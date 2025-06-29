import type { INodeCanvas, INodeCanvasAdd } from '@canvas/interfaz/node.interface'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import socketService from '@/services/socket'

export interface NodeGroup {
	name: string
	subgroups?: string[]
	nodes: INodeCanvas[]
}

export const useNodesLibraryStore = defineStore('nodesLibrary', async () => {
	console.log('🌱 Iniciando nodes...', await socketService.getNodes())

	// Estados reactivos
	const availableNodes = ref<INodeCanvas[]>([])
	const nodeGroups = ref<Record<string, NodeGroup>>({})
	const isLoading = ref(false)
	const error = ref<string | null>(null)
	const isNodePanelVisible = ref(false)

	// Cargar nodos desde el servidor
	const loadNodes = async () => {
		isLoading.value = true
		error.value = null

		try {
			const nodes = await socketService.getNodes()

			// Convertir los nodos del servidor al formato del cliente
			availableNodes.value = Object.entries(nodes).map(([type, nodeData]: [string, any]) => ({
				type,
				design: { x: 0, y: 0 },
				tags: nodeData.dependencies || [],
				info: {
					name: nodeData.name,
					desc: nodeData.info.description || nodeData.info.title,
					icon: nodeData.info.icon || '●',
					group: Array.isArray(nodeData.group) ? nodeData.group[0] : nodeData.group,
					color: nodeData.info.color || '#3498DB',
					connectors: nodeData.info.connectors || {
						inputs: [{ name: 'init' }],
						outputs: [{ name: 'response' }, { name: 'error' }]
					}
				},
				properties: nodeData.properties || {}
			}))

			// Organizar nodos por grupos
			await loadNodeGroups()
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Error cargando nodos'
			console.error('Error loading nodes:', err)

			// Fallback a nodos estáticos si hay error
			loadStaticNodes()
		} finally {
			isLoading.value = false
		}
	}

	// Cargar grupos de nodos
	const loadNodeGroups = async () => {
		try {
			const groups = await socketService.getNodeGroups()
			const groupedNodes: Record<string, NodeGroup> = {}

			// Inicializar grupos
			for (const groupName of groups) {
				groupedNodes[groupName] = {
					name: groupName,
					subgroups: [],
					nodes: []
				}
			}

			// Organizar nodos por grupos
			for (const node of availableNodes.value) {
				const groupName = node.info.group
				if (groupedNodes[groupName]) {
					groupedNodes[groupName].nodes.push(node)
				}
			}

			nodeGroups.value = groupedNodes
		} catch (err) {
			console.error('Error loading node groups:', err)
			// Fallback: agrupar por la propiedad group de cada nodo
			fallbackGroupNodes()
		}
	}

	// Fallback para agrupar nodos manualmente
	const fallbackGroupNodes = () => {
		const groupedNodes: Record<string, NodeGroup> = {}

		for (const node of availableNodes.value) {
			const groupName = node.info.group
			if (!groupedNodes[groupName]) {
				groupedNodes[groupName] = {
					name: groupName,
					subgroups: [],
					nodes: []
				}
			}
			groupedNodes[groupName].nodes.push(node)
		}

		nodeGroups.value = groupedNodes
	}

	// Buscar nodos
	const searchNodes = async (query: string) => {
		try {
			const searchResults = await socketService.searchNodes(query)

			// Convertir resultados de búsqueda al formato del cliente
			return Object.entries(searchResults).map(([type, nodeData]: [string, any]) => ({
				type,
				design: { x: 0, y: 0 },
				tags: nodeData.dependencies || [],
				info: {
					name: nodeData.name,
					desc: nodeData.info.description || nodeData.info.title,
					icon: nodeData.info.icon || '●',
					group: Array.isArray(nodeData.group) ? nodeData.group[0] : nodeData.group,
					color: nodeData.info.color || '#3498DB',
					connectors: nodeData.info.connectors || {
						inputs: [{ name: 'init' }],
						outputs: [{ name: 'response' }, { name: 'error' }]
					}
				},
				properties: nodeData.properties || {}
			}))
		} catch (err) {
			console.error('Error searching nodes:', err)
			// Fallback a búsqueda local
			return availableNodes.value.filter(
				(node) =>
					node.info.name.toLowerCase().includes(query.toLowerCase()) ||
					node.info.desc.toLowerCase().includes(query.toLowerCase()) ||
					node.type.toLowerCase().includes(query.toLowerCase())
			)
		}
	}

	// Obtener información detallada de un nodo
	const getNodeInfo = async (type: string) => {
		try {
			return await socketService.getNodeInfo(type)
		} catch (err) {
			console.error('Error getting node info:', err)
			return null
		}
	}

	// Obtener estadísticas de nodos
	const getNodeStats = async () => {
		try {
			return await socketService.getNodeStats()
		} catch (err) {
			console.error('Error getting node stats:', err)
			return null
		}
	}

	// Cargar nodos estáticos como fallback
	const loadStaticNodes = () => {
		// Lista completa de nodos disponibles (fallback)
		availableNodes.value = [
			// Nodos de Input
			{
				type: 'input',
				design: { x: 0, y: 0 },
				tags: ['input', 'trigger'],
				info: {
					name: 'Webhook',
					desc: 'Recibe peticiones HTTP',
					icon: '󰘯',
					group: 'Input',
					color: '#3498DB',
					connectors: {
						inputs: [{ name: 'init' }],
						outputs: [{ name: 'response' }, { name: 'error' }]
					}
				},
				properties: {}
			},
			{
				type: 'input',
				design: { x: 0, y: 0 },
				tags: ['input', 'trigger'],
				info: {
					name: 'Schedule',
					desc: 'Ejecuta en horarios programados',
					icon: '󰃰',
					group: 'Input',
					color: '#3498DB',
					connectors: {
						inputs: [],
						outputs: [{ name: 'trigger', nextNodeTag: 'process' }]
					}
				},
				properties: {}
			},
			{
				type: 'input',
				design: { x: 0, y: 0 },
				tags: ['input', 'trigger'],
				info: {
					name: 'Manual Trigger',
					desc: 'Activación manual del workflow',
					icon: '󰆿',
					group: 'Input',
					color: '#3498DB',
					connectors: {
						inputs: [],
						outputs: [{ name: 'start', nextNodeTag: 'process' }]
					}
				},
				properties: {}
			},
			{
				type: 'input',
				design: { x: 0, y: 0 },
				tags: ['input', 'file'],
				info: {
					name: 'File Watcher',
					desc: 'Detecta cambios en archivos',
					icon: '󰈙',
					group: 'Input',
					color: '#3498DB',
					connectors: {
						inputs: [],
						outputs: [{ name: 'file', nextNodeTag: 'process' }]
					}
				},
				properties: {}
			},
			{
				type: 'input',
				design: { x: 0, y: 0 },
				tags: ['input', 'email'],
				info: {
					name: 'Email Trigger',
					desc: 'Se activa al recibir emails',
					icon: '󰇮',
					group: 'Input',
					color: '#3498DB',
					connectors: {
						inputs: [],
						outputs: [{ name: 'email', nextNodeTag: 'process' }]
					}
				},
				properties: {}
			},

			// Nodos de Google Drive
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['google', 'drive', 'upload'],
				info: {
					name: 'Upload File',
					desc: 'Sube archivos a Google Drive',
					icon: '󰊓',
					group: 'Google/Drive',
					color: '#4285F4',
					connectors: {
						inputs: [{ name: 'file', nextNodeTag: 'input' }],
						outputs: [{ name: 'result', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['google', 'drive', 'download'],
				info: {
					name: 'Download File',
					desc: 'Descarga archivos de Google Drive',
					icon: '󰇚',
					group: 'Google/Drive',
					color: '#4285F4',
					connectors: {
						inputs: [{ name: 'fileId', nextNodeTag: 'input' }],
						outputs: [{ name: 'file', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['google', 'drive', 'list'],
				info: {
					name: 'List Files',
					desc: 'Lista archivos de Google Drive',
					icon: '󰋲',
					group: 'Google/Drive',
					color: '#4285F4',
					connectors: {
						inputs: [{ name: 'folder', nextNodeTag: 'input' }],
						outputs: [{ name: 'files', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['google', 'drive', 'share'],
				info: {
					name: 'Share File',
					desc: 'Comparte archivos de Google Drive',
					icon: '󰒖',
					group: 'Google/Drive',
					color: '#4285F4',
					connectors: {
						inputs: [{ name: 'fileId', nextNodeTag: 'input' }],
						outputs: [{ name: 'shareLink', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['google', 'drive', 'delete'],
				info: {
					name: 'Delete File',
					desc: 'Elimina archivos de Google Drive',
					icon: '󰆴',
					group: 'Google/Drive',
					color: '#4285F4',
					connectors: {
						inputs: [{ name: 'fileId', nextNodeTag: 'input' }],
						outputs: [{ name: 'success', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},

			// Nodos de Google Sheets
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['google', 'sheets', 'read'],
				info: {
					name: 'Read Sheet',
					desc: 'Lee datos de Google Sheets',
					icon: '󰧷',
					group: 'Google/Sheets',
					color: '#0F9D58',
					connectors: {
						inputs: [{ name: 'sheetId', nextNodeTag: 'input' }],
						outputs: [{ name: 'data', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['google', 'sheets', 'write'],
				info: {
					name: 'Write Sheet',
					desc: 'Escribe datos en Google Sheets',
					icon: '󰧮',
					group: 'Google/Sheets',
					color: '#0F9D58',
					connectors: {
						inputs: [{ name: 'data', nextNodeTag: 'input' }],
						outputs: [{ name: 'result', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['google', 'sheets', 'create'],
				info: {
					name: 'Create Sheet',
					desc: 'Crea una nueva hoja de cálculo',
					icon: '󰐕',
					group: 'Google/Sheets',
					color: '#0F9D58',
					connectors: {
						inputs: [{ name: 'name', nextNodeTag: 'input' }],
						outputs: [{ name: 'sheetId', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['google', 'sheets', 'append'],
				info: {
					name: 'Append Row',
					desc: 'Añade filas a Google Sheets',
					icon: '󰐖',
					group: 'Google/Sheets',
					color: '#0F9D58',
					connectors: {
						inputs: [{ name: 'row', nextNodeTag: 'input' }],
						outputs: [{ name: 'result', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['google', 'sheets', 'clear'],
				info: {
					name: 'Clear Range',
					desc: 'Limpia un rango en Google Sheets',
					icon: '󰚃',
					group: 'Google/Sheets',
					color: '#0F9D58',
					connectors: {
						inputs: [{ name: 'range', nextNodeTag: 'input' }],
						outputs: [{ name: 'success', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},

			// Nodos de Microsoft Office
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['microsoft', 'excel', 'read'],
				info: {
					name: 'Read Excel',
					desc: 'Lee archivos de Excel',
					icon: '󰧷',
					group: 'Microsoft/Excel',
					color: '#217346',
					connectors: {
						inputs: [{ name: 'file', nextNodeTag: 'input' }],
						outputs: [{ name: 'data', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['microsoft', 'excel', 'write'],
				info: {
					name: 'Write Excel',
					desc: 'Escribe archivos de Excel',
					icon: '󰧮',
					group: 'Microsoft/Excel',
					color: '#217346',
					connectors: {
						inputs: [{ name: 'data', nextNodeTag: 'input' }],
						outputs: [{ name: 'file', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['microsoft', 'word', 'create'],
				info: {
					name: 'Create Word',
					desc: 'Crea documentos de Word',
					icon: '󰈙',
					group: 'Microsoft/Word',
					color: '#2B579A',
					connectors: {
						inputs: [{ name: 'content', nextNodeTag: 'input' }],
						outputs: [{ name: 'document', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['microsoft', 'powerpoint', 'create'],
				info: {
					name: 'Create PowerPoint',
					desc: 'Crea presentaciones de PowerPoint',
					icon: '󰐽',
					group: 'Microsoft/PowerPoint',
					color: '#D24726',
					connectors: {
						inputs: [{ name: 'slides', nextNodeTag: 'input' }],
						outputs: [{ name: 'presentation', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},

			// Nodos de Base de Datos
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['database', 'mysql', 'query'],
				info: {
					name: 'MySQL Query',
					desc: 'Ejecuta consultas MySQL',
					icon: '󰆼',
					group: 'Database/MySQL',
					color: '#F29111',
					connectors: {
						inputs: [{ name: 'query', nextNodeTag: 'input' }],
						outputs: [{ name: 'result', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['database', 'postgres', 'query'],
				info: {
					name: 'PostgreSQL Query',
					desc: 'Ejecuta consultas PostgreSQL',
					icon: '󰆼',
					group: 'Database/PostgreSQL',
					color: '#336791',
					connectors: {
						inputs: [{ name: 'query', nextNodeTag: 'input' }],
						outputs: [{ name: 'result', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['database', 'mongodb', 'find'],
				info: {
					name: 'MongoDB Find',
					desc: 'Busca documentos en MongoDB',
					icon: '󰜷',
					group: 'Database/MongoDB',
					color: '#47A248',
					connectors: {
						inputs: [{ name: 'filter', nextNodeTag: 'input' }],
						outputs: [{ name: 'documents', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['database', 'mongodb', 'insert'],
				info: {
					name: 'MongoDB Insert',
					desc: 'Inserta documentos en MongoDB',
					icon: '󰐕',
					group: 'Database/MongoDB',
					color: '#47A248',
					connectors: {
						inputs: [{ name: 'document', nextNodeTag: 'input' }],
						outputs: [{ name: 'result', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},

			// Nodos de Comunicación
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['communication', 'email', 'send'],
				info: {
					name: 'Send Email',
					desc: 'Envía correos electrónicos',
					icon: '󰇮',
					group: 'Communication/Email',
					color: '#EA4335',
					connectors: {
						inputs: [{ name: 'message', nextNodeTag: 'input' }],
						outputs: [{ name: 'sent', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['communication', 'slack', 'message'],
				info: {
					name: 'Slack Message',
					desc: 'Envía mensajes a Slack',
					icon: '󰒱',
					group: 'Communication/Slack',
					color: '#4A154B',
					connectors: {
						inputs: [{ name: 'message', nextNodeTag: 'input' }],
						outputs: [{ name: 'sent', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['communication', 'teams', 'message'],
				info: {
					name: 'Teams Message',
					desc: 'Envía mensajes a Microsoft Teams',
					icon: '󰊻',
					group: 'Communication/Teams',
					color: '#6264A7',
					connectors: {
						inputs: [{ name: 'message', nextNodeTag: 'input' }],
						outputs: [{ name: 'sent', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['communication', 'discord', 'message'],
				info: {
					name: 'Discord Message',
					desc: 'Envía mensajes a Discord',
					icon: '󰙯',
					group: 'Communication/Discord',
					color: '#5865F2',
					connectors: {
						inputs: [{ name: 'message', nextNodeTag: 'input' }],
						outputs: [{ name: 'sent', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},

			// Nodos de Utilidades
			{
				type: 'utility',
				design: { x: 0, y: 0 },
				tags: ['utility', 'json', 'parse'],
				info: {
					name: 'JSON Parse',
					desc: 'Convierte texto a objeto JSON',
					icon: '󰘦',
					group: 'Utility/JSON',
					color: '#FF6B6B',
					connectors: {
						inputs: [{ name: 'text', nextNodeTag: 'input' }],
						outputs: [{ name: 'object', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'utility',
				design: { x: 0, y: 0 },
				tags: ['utility', 'json', 'stringify'],
				info: {
					name: 'JSON Stringify',
					desc: 'Convierte objeto a texto JSON',
					icon: '󰘦',
					group: 'Utility/JSON',
					color: '#FF6B6B',
					connectors: {
						inputs: [{ name: 'object', nextNodeTag: 'input' }],
						outputs: [{ name: 'text', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'utility',
				design: { x: 0, y: 0 },
				tags: ['utility', 'text', 'replace'],
				info: {
					name: 'Text Replace',
					desc: 'Reemplaza texto usando patrones',
					icon: '󰛩',
					group: 'Utility/Text',
					color: '#4ECDC4',
					connectors: {
						inputs: [{ name: 'text', nextNodeTag: 'input' }],
						outputs: [{ name: 'result', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'utility',
				design: { x: 0, y: 0 },
				tags: ['utility', 'text', 'split'],
				info: {
					name: 'Text Split',
					desc: 'Divide texto en partes',
					icon: '󰯊',
					group: 'Utility/Text',
					color: '#4ECDC4',
					connectors: {
						inputs: [{ name: 'text', nextNodeTag: 'input' }],
						outputs: [{ name: 'parts', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'utility',
				design: { x: 0, y: 0 },
				tags: ['utility', 'date', 'format'],
				info: {
					name: 'Date Format',
					desc: 'Formatea fechas',
					icon: '󰃰',
					group: 'Utility/Date',
					color: '#45B7D1',
					connectors: {
						inputs: [{ name: 'date', nextNodeTag: 'input' }],
						outputs: [{ name: 'formatted', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'utility',
				design: { x: 0, y: 0 },
				tags: ['utility', 'math', 'calculate'],
				info: {
					name: 'Math Calculate',
					desc: 'Realiza cálculos matemáticos',
					icon: '󰖩',
					group: 'Utility/Math',
					color: '#F7931E',
					connectors: {
						inputs: [{ name: 'expression', nextNodeTag: 'input' }],
						outputs: [{ name: 'result', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},

			// Nodos de APIs
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['api', 'http', 'request'],
				info: {
					name: 'HTTP Request',
					desc: 'Realiza peticiones HTTP',
					icon: '󰖟',
					group: 'API/HTTP',
					color: '#96CEB4',
					connectors: {
						inputs: [{ name: 'config', nextNodeTag: 'input' }],
						outputs: [{ name: 'response', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['api', 'graphql', 'query'],
				info: {
					name: 'GraphQL Query',
					desc: 'Ejecuta consultas GraphQL',
					icon: '󰡷',
					group: 'API/GraphQL',
					color: '#E10098',
					connectors: {
						inputs: [{ name: 'query', nextNodeTag: 'input' }],
						outputs: [{ name: 'data', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['api', 'rest', 'get'],
				info: {
					name: 'REST GET',
					desc: 'Petición GET REST',
					icon: '󰆽',
					group: 'API/REST',
					color: '#61DAFB',
					connectors: {
						inputs: [{ name: 'url', nextNodeTag: 'input' }],
						outputs: [{ name: 'data', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['api', 'rest', 'post'],
				info: {
					name: 'REST POST',
					desc: 'Petición POST REST',
					icon: '󰐕',
					group: 'API/REST',
					color: '#61DAFB',
					connectors: {
						inputs: [{ name: 'data', nextNodeTag: 'input' }],
						outputs: [{ name: 'response', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},

			// Nodos de Archivos
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['file', 'read'],
				info: {
					name: 'Read File',
					desc: 'Lee archivos del sistema',
					icon: '󰈙',
					group: 'File/System',
					color: '#FFA726',
					connectors: {
						inputs: [{ name: 'path', nextNodeTag: 'input' }],
						outputs: [{ name: 'content', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['file', 'write'],
				info: {
					name: 'Write File',
					desc: 'Escribe archivos al sistema',
					icon: '󰈞',
					group: 'File/System',
					color: '#FFA726',
					connectors: {
						inputs: [{ name: 'content', nextNodeTag: 'input' }],
						outputs: [{ name: 'success', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['file', 'compress'],
				info: {
					name: 'Compress File',
					desc: 'Comprime archivos',
					icon: '󰗄',
					group: 'File/Compression',
					color: '#66BB6A',
					connectors: {
						inputs: [{ name: 'files', nextNodeTag: 'input' }],
						outputs: [{ name: 'archive', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},
			{
				type: 'action',
				design: { x: 0, y: 0 },
				tags: ['file', 'extract'],
				info: {
					name: 'Extract File',
					desc: 'Extrae archivos comprimidos',
					icon: '󰇘',
					group: 'File/Compression',
					color: '#66BB6A',
					connectors: {
						inputs: [{ name: 'archive', nextNodeTag: 'input' }],
						outputs: [{ name: 'files', nextNodeTag: 'output' }]
					}
				},
				properties: {}
			},

			// Nodos de Output
			{
				type: 'output',
				design: { x: 0, y: 0 },
				tags: ['output', 'log'],
				info: {
					name: 'Log Output',
					desc: 'Registra información en logs',
					icon: '󰌪',
					group: 'Output',
					color: '#9B59B6',
					connectors: {
						inputs: [{ name: 'data', nextNodeTag: 'input' }],
						outputs: []
					}
				},
				properties: {}
			},
			{
				type: 'output',
				design: { x: 0, y: 0 },
				tags: ['output', 'webhook'],
				info: {
					name: 'Webhook Output',
					desc: 'Envía datos vía webhook',
					icon: '󰖟',
					group: 'Output',
					color: '#9B59B6',
					connectors: {
						inputs: [{ name: 'data', nextNodeTag: 'input' }],
						outputs: []
					}
				},
				properties: {}
			},
			{
				type: 'output',
				design: { x: 0, y: 0 },
				tags: ['output', 'file'],
				info: {
					name: 'File Output',
					desc: 'Guarda datos en archivo',
					icon: '󰈞',
					group: 'Output',
					color: '#9B59B6',
					connectors: {
						inputs: [{ name: 'data', nextNodeTag: 'input' }],
						outputs: []
					}
				},
				properties: {}
			},
			{
				type: 'output',
				design: { x: 0, y: 0 },
				tags: ['output', 'database'],
				info: {
					name: 'Database Output',
					desc: 'Guarda datos en base de datos',
					icon: '󰆼',
					group: 'Output',
					color: '#9B59B6',
					connectors: {
						inputs: [{ name: 'data', nextNodeTag: 'input' }],
						outputs: []
					}
				},
				properties: {}
			},
			{
				type: 'output',
				design: { x: 0, y: 0 },
				tags: ['output', 'response'],
				info: {
					name: 'HTTP Response',
					desc: 'Envía respuesta HTTP',
					icon: '󰞉',
					group: 'Output',
					color: '#9B59B6',
					connectors: {
						inputs: [{ name: 'data', nextNodeTag: 'input' }],
						outputs: []
					}
				},
				properties: {}
			}
		]

		// Agrupar nodos estáticos
		fallbackGroupNodes()
	}

	// Funciones para controlar la visibilidad del panel
	const showNodePanel = () => {
		isNodePanelVisible.value = true
	}

	const hideNodePanel = () => {
		isNodePanelVisible.value = false
	}

	const toggleNodePanel = () => {
		isNodePanelVisible.value = !isNodePanelVisible.value
	}

	// Función para obtener nodos por subgrupo (manteniendo compatibilidad)
	const getNodesBySubgroup = (groupName: string, subgroupName: string) => {
		const group = nodeGroups.value[groupName]
		if (!group) return []

		return group.nodes.filter((node) => node.info.group.includes(subgroupName) || node.type.includes(subgroupName.toLowerCase()))
	}

	// Cargar nodos al iniciar el store
	loadNodes()

	return {
		availableNodes,
		isNodePanelVisible,
		nodeGroups,
		showNodePanel,
		hideNodePanel,
		toggleNodePanel,
		searchNodes,
		loadNodes,
		isLoading,
		error,
		getNodeInfo,
		getNodeStats,
		getNodesBySubgroup,
		loadNodeGroups,
		fallbackGroupNodes
	}
})
