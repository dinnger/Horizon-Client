import type { INodeCanvas, INodeCanvasAdd } from '@canvas/interfaz/node.interface'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import socketService from '@/services/socket'

export interface NodeGroup {
	name: string
	subgroups?: string[]
	nodes: INodeCanvas[]
}

export const useNodesLibraryStore = defineStore('nodesLibrary', () => {
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
	const searchNodes = (query: string) => {
		return availableNodes.value.filter(
			(node) =>
				node.info.name.toLowerCase().includes(query.toLowerCase()) ||
				node.info.desc.toLowerCase().includes(query.toLowerCase()) ||
				node.info.group.toLowerCase().includes(query.toLowerCase())
		)
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
