import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
	INodeCanvas,
	INodeCanvasAdd,
} from "@canvas/interfaz/node.interface";

export interface NodeGroup {
	name: string;
	subgroups?: string[];
	nodes: INodeCanvas[];
}

export const useNodesLibraryStore = defineStore("nodesLibrary", () => {
	// Lista completa de nodos disponibles
	const availableNodes = ref<INodeCanvas[]>([
		// Nodos de Input
		{
			id: "input-webhook",
			type: "input",
			design: { x: 0, y: 0 },
			tags: ["input", "trigger"],
			info: {
				name: "Webhook",
				desc: "Recibe peticiones HTTP",
				icon: "󰘯",
				group: "Input",
				color: "#3498DB",
				connectors: {
					inputs: [{ name: "init" }],
					outputs: [{ name: "response" }, { name: "error" }],
				},
			},
			properties: {},
		},
		{
			id: "input-schedule",
			type: "input",
			design: { x: 0, y: 0 },
			tags: ["input", "trigger"],
			info: {
				name: "Schedule",
				desc: "Ejecuta en horarios programados",
				icon: "󰃰",
				group: "Input",
				color: "#3498DB",
				connectors: {
					inputs: [],
					outputs: [{ name: "trigger", nextNodeTag: "process" }],
				},
			},
			properties: {},
		},
		{
			id: "input-manual",
			type: "input",
			design: { x: 0, y: 0 },
			tags: ["input", "trigger"],
			info: {
				name: "Manual Trigger",
				desc: "Activación manual del workflow",
				icon: "󰆿",
				group: "Input",
				color: "#3498DB",
				connectors: {
					inputs: [],
					outputs: [{ name: "start", nextNodeTag: "process" }],
				},
			},
			properties: {},
		},
		{
			id: "input-file-watcher",
			type: "input",
			design: { x: 0, y: 0 },
			tags: ["input", "file"],
			info: {
				name: "File Watcher",
				desc: "Detecta cambios en archivos",
				icon: "󰈙",
				group: "Input",
				color: "#3498DB",
				connectors: {
					inputs: [],
					outputs: [{ name: "file", nextNodeTag: "process" }],
				},
			},
			properties: {},
		},
		{
			id: "input-email",
			type: "input",
			design: { x: 0, y: 0 },
			tags: ["input", "email"],
			info: {
				name: "Email Trigger",
				desc: "Se activa al recibir emails",
				icon: "󰇮",
				group: "Input",
				color: "#3498DB",
				connectors: {
					inputs: [],
					outputs: [{ name: "email", nextNodeTag: "process" }],
				},
			},
			properties: {},
		},

		// Nodos de Google Drive
		{
			id: "google-drive-upload",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["google", "drive", "upload"],
			info: {
				name: "Upload File",
				desc: "Sube archivos a Google Drive",
				icon: "󰊓",
				group: "Google/Drive",
				color: "#4285F4",
				connectors: {
					inputs: [{ name: "file", nextNodeTag: "input" }],
					outputs: [{ name: "result", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "google-drive-download",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["google", "drive", "download"],
			info: {
				name: "Download File",
				desc: "Descarga archivos de Google Drive",
				icon: "󰇚",
				group: "Google/Drive",
				color: "#4285F4",
				connectors: {
					inputs: [{ name: "fileId", nextNodeTag: "input" }],
					outputs: [{ name: "file", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "google-drive-list",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["google", "drive", "list"],
			info: {
				name: "List Files",
				desc: "Lista archivos de Google Drive",
				icon: "󰋲",
				group: "Google/Drive",
				color: "#4285F4",
				connectors: {
					inputs: [{ name: "folder", nextNodeTag: "input" }],
					outputs: [{ name: "files", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "google-drive-share",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["google", "drive", "share"],
			info: {
				name: "Share File",
				desc: "Comparte archivos de Google Drive",
				icon: "󰒖",
				group: "Google/Drive",
				color: "#4285F4",
				connectors: {
					inputs: [{ name: "fileId", nextNodeTag: "input" }],
					outputs: [{ name: "shareLink", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "google-drive-delete",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["google", "drive", "delete"],
			info: {
				name: "Delete File",
				desc: "Elimina archivos de Google Drive",
				icon: "󰆴",
				group: "Google/Drive",
				color: "#4285F4",
				connectors: {
					inputs: [{ name: "fileId", nextNodeTag: "input" }],
					outputs: [{ name: "success", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},

		// Nodos de Google Sheets
		{
			id: "google-sheets-read",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["google", "sheets", "read"],
			info: {
				name: "Read Sheet",
				desc: "Lee datos de Google Sheets",
				icon: "󰧷",
				group: "Google/Sheets",
				color: "#0F9D58",
				connectors: {
					inputs: [{ name: "sheetId", nextNodeTag: "input" }],
					outputs: [{ name: "data", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "google-sheets-write",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["google", "sheets", "write"],
			info: {
				name: "Write Sheet",
				desc: "Escribe datos en Google Sheets",
				icon: "󰧮",
				group: "Google/Sheets",
				color: "#0F9D58",
				connectors: {
					inputs: [{ name: "data", nextNodeTag: "input" }],
					outputs: [{ name: "result", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "google-sheets-create",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["google", "sheets", "create"],
			info: {
				name: "Create Sheet",
				desc: "Crea una nueva hoja de cálculo",
				icon: "󰐕",
				group: "Google/Sheets",
				color: "#0F9D58",
				connectors: {
					inputs: [{ name: "name", nextNodeTag: "input" }],
					outputs: [{ name: "sheetId", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "google-sheets-append",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["google", "sheets", "append"],
			info: {
				name: "Append Row",
				desc: "Añade filas a Google Sheets",
				icon: "󰐖",
				group: "Google/Sheets",
				color: "#0F9D58",
				connectors: {
					inputs: [{ name: "row", nextNodeTag: "input" }],
					outputs: [{ name: "result", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "google-sheets-clear",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["google", "sheets", "clear"],
			info: {
				name: "Clear Range",
				desc: "Limpia un rango en Google Sheets",
				icon: "󰚃",
				group: "Google/Sheets",
				color: "#0F9D58",
				connectors: {
					inputs: [{ name: "range", nextNodeTag: "input" }],
					outputs: [{ name: "success", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},

		// Nodos de Microsoft Office
		{
			id: "excel-read",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["microsoft", "excel", "read"],
			info: {
				name: "Read Excel",
				desc: "Lee archivos de Excel",
				icon: "󰧷",
				group: "Microsoft/Excel",
				color: "#217346",
				connectors: {
					inputs: [{ name: "file", nextNodeTag: "input" }],
					outputs: [{ name: "data", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "excel-write",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["microsoft", "excel", "write"],
			info: {
				name: "Write Excel",
				desc: "Escribe archivos de Excel",
				icon: "󰧮",
				group: "Microsoft/Excel",
				color: "#217346",
				connectors: {
					inputs: [{ name: "data", nextNodeTag: "input" }],
					outputs: [{ name: "file", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "word-create",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["microsoft", "word", "create"],
			info: {
				name: "Create Word",
				desc: "Crea documentos de Word",
				icon: "󰈙",
				group: "Microsoft/Word",
				color: "#2B579A",
				connectors: {
					inputs: [{ name: "content", nextNodeTag: "input" }],
					outputs: [{ name: "document", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "powerpoint-create",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["microsoft", "powerpoint", "create"],
			info: {
				name: "Create PowerPoint",
				desc: "Crea presentaciones de PowerPoint",
				icon: "󰐽",
				group: "Microsoft/PowerPoint",
				color: "#D24726",
				connectors: {
					inputs: [{ name: "slides", nextNodeTag: "input" }],
					outputs: [{ name: "presentation", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},

		// Nodos de Base de Datos
		{
			id: "mysql-query",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["database", "mysql", "query"],
			info: {
				name: "MySQL Query",
				desc: "Ejecuta consultas MySQL",
				icon: "󰆼",
				group: "Database/MySQL",
				color: "#F29111",
				connectors: {
					inputs: [{ name: "query", nextNodeTag: "input" }],
					outputs: [{ name: "result", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "postgres-query",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["database", "postgres", "query"],
			info: {
				name: "PostgreSQL Query",
				desc: "Ejecuta consultas PostgreSQL",
				icon: "󰆼",
				group: "Database/PostgreSQL",
				color: "#336791",
				connectors: {
					inputs: [{ name: "query", nextNodeTag: "input" }],
					outputs: [{ name: "result", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "mongodb-find",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["database", "mongodb", "find"],
			info: {
				name: "MongoDB Find",
				desc: "Busca documentos en MongoDB",
				icon: "󰜷",
				group: "Database/MongoDB",
				color: "#47A248",
				connectors: {
					inputs: [{ name: "filter", nextNodeTag: "input" }],
					outputs: [{ name: "documents", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "mongodb-insert",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["database", "mongodb", "insert"],
			info: {
				name: "MongoDB Insert",
				desc: "Inserta documentos en MongoDB",
				icon: "󰐕",
				group: "Database/MongoDB",
				color: "#47A248",
				connectors: {
					inputs: [{ name: "document", nextNodeTag: "input" }],
					outputs: [{ name: "result", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},

		// Nodos de Comunicación
		{
			id: "email-send",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["communication", "email", "send"],
			info: {
				name: "Send Email",
				desc: "Envía correos electrónicos",
				icon: "󰇮",
				group: "Communication/Email",
				color: "#EA4335",
				connectors: {
					inputs: [{ name: "message", nextNodeTag: "input" }],
					outputs: [{ name: "sent", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "slack-message",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["communication", "slack", "message"],
			info: {
				name: "Slack Message",
				desc: "Envía mensajes a Slack",
				icon: "󰒱",
				group: "Communication/Slack",
				color: "#4A154B",
				connectors: {
					inputs: [{ name: "message", nextNodeTag: "input" }],
					outputs: [{ name: "sent", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "teams-message",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["communication", "teams", "message"],
			info: {
				name: "Teams Message",
				desc: "Envía mensajes a Microsoft Teams",
				icon: "󰊻",
				group: "Communication/Teams",
				color: "#6264A7",
				connectors: {
					inputs: [{ name: "message", nextNodeTag: "input" }],
					outputs: [{ name: "sent", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "discord-message",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["communication", "discord", "message"],
			info: {
				name: "Discord Message",
				desc: "Envía mensajes a Discord",
				icon: "󰙯",
				group: "Communication/Discord",
				color: "#5865F2",
				connectors: {
					inputs: [{ name: "message", nextNodeTag: "input" }],
					outputs: [{ name: "sent", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},

		// Nodos de Utilidades
		{
			id: "json-parse",
			type: "utility",
			design: { x: 0, y: 0 },
			tags: ["utility", "json", "parse"],
			info: {
				name: "JSON Parse",
				desc: "Convierte texto a objeto JSON",
				icon: "󰘦",
				group: "Utility/JSON",
				color: "#FF6B6B",
				connectors: {
					inputs: [{ name: "text", nextNodeTag: "input" }],
					outputs: [{ name: "object", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "json-stringify",
			type: "utility",
			design: { x: 0, y: 0 },
			tags: ["utility", "json", "stringify"],
			info: {
				name: "JSON Stringify",
				desc: "Convierte objeto a texto JSON",
				icon: "󰘦",
				group: "Utility/JSON",
				color: "#FF6B6B",
				connectors: {
					inputs: [{ name: "object", nextNodeTag: "input" }],
					outputs: [{ name: "text", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "text-replace",
			type: "utility",
			design: { x: 0, y: 0 },
			tags: ["utility", "text", "replace"],
			info: {
				name: "Text Replace",
				desc: "Reemplaza texto usando patrones",
				icon: "󰛩",
				group: "Utility/Text",
				color: "#4ECDC4",
				connectors: {
					inputs: [{ name: "text", nextNodeTag: "input" }],
					outputs: [{ name: "result", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "text-split",
			type: "utility",
			design: { x: 0, y: 0 },
			tags: ["utility", "text", "split"],
			info: {
				name: "Text Split",
				desc: "Divide texto en partes",
				icon: "󰯊",
				group: "Utility/Text",
				color: "#4ECDC4",
				connectors: {
					inputs: [{ name: "text", nextNodeTag: "input" }],
					outputs: [{ name: "parts", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "date-format",
			type: "utility",
			design: { x: 0, y: 0 },
			tags: ["utility", "date", "format"],
			info: {
				name: "Date Format",
				desc: "Formatea fechas",
				icon: "󰃰",
				group: "Utility/Date",
				color: "#45B7D1",
				connectors: {
					inputs: [{ name: "date", nextNodeTag: "input" }],
					outputs: [{ name: "formatted", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "math-calculate",
			type: "utility",
			design: { x: 0, y: 0 },
			tags: ["utility", "math", "calculate"],
			info: {
				name: "Math Calculate",
				desc: "Realiza cálculos matemáticos",
				icon: "󰖩",
				group: "Utility/Math",
				color: "#F7931E",
				connectors: {
					inputs: [{ name: "expression", nextNodeTag: "input" }],
					outputs: [{ name: "result", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},

		// Nodos de APIs
		{
			id: "http-request",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["api", "http", "request"],
			info: {
				name: "HTTP Request",
				desc: "Realiza peticiones HTTP",
				icon: "󰖟",
				group: "API/HTTP",
				color: "#96CEB4",
				connectors: {
					inputs: [{ name: "config", nextNodeTag: "input" }],
					outputs: [{ name: "response", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "graphql-query",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["api", "graphql", "query"],
			info: {
				name: "GraphQL Query",
				desc: "Ejecuta consultas GraphQL",
				icon: "󰡷",
				group: "API/GraphQL",
				color: "#E10098",
				connectors: {
					inputs: [{ name: "query", nextNodeTag: "input" }],
					outputs: [{ name: "data", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "rest-get",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["api", "rest", "get"],
			info: {
				name: "REST GET",
				desc: "Petición GET REST",
				icon: "󰆽",
				group: "API/REST",
				color: "#61DAFB",
				connectors: {
					inputs: [{ name: "url", nextNodeTag: "input" }],
					outputs: [{ name: "data", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "rest-post",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["api", "rest", "post"],
			info: {
				name: "REST POST",
				desc: "Petición POST REST",
				icon: "󰐕",
				group: "API/REST",
				color: "#61DAFB",
				connectors: {
					inputs: [{ name: "data", nextNodeTag: "input" }],
					outputs: [{ name: "response", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},

		// Nodos de Archivos
		{
			id: "file-read",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["file", "read"],
			info: {
				name: "Read File",
				desc: "Lee archivos del sistema",
				icon: "󰈙",
				group: "File/System",
				color: "#FFA726",
				connectors: {
					inputs: [{ name: "path", nextNodeTag: "input" }],
					outputs: [{ name: "content", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "file-write",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["file", "write"],
			info: {
				name: "Write File",
				desc: "Escribe archivos al sistema",
				icon: "󰈞",
				group: "File/System",
				color: "#FFA726",
				connectors: {
					inputs: [{ name: "content", nextNodeTag: "input" }],
					outputs: [{ name: "success", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "file-compress",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["file", "compress"],
			info: {
				name: "Compress File",
				desc: "Comprime archivos",
				icon: "󰗄",
				group: "File/Compression",
				color: "#66BB6A",
				connectors: {
					inputs: [{ name: "files", nextNodeTag: "input" }],
					outputs: [{ name: "archive", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},
		{
			id: "file-extract",
			type: "action",
			design: { x: 0, y: 0 },
			tags: ["file", "extract"],
			info: {
				name: "Extract File",
				desc: "Extrae archivos comprimidos",
				icon: "󰇘",
				group: "File/Compression",
				color: "#66BB6A",
				connectors: {
					inputs: [{ name: "archive", nextNodeTag: "input" }],
					outputs: [{ name: "files", nextNodeTag: "output" }],
				},
			},
			properties: {},
		},

		// Nodos de Output
		{
			id: "output-log",
			type: "output",
			design: { x: 0, y: 0 },
			tags: ["output", "log"],
			info: {
				name: "Log Output",
				desc: "Registra información en logs",
				icon: "󰌪",
				group: "Output",
				color: "#9B59B6",
				connectors: {
					inputs: [{ name: "data", nextNodeTag: "input" }],
					outputs: [],
				},
			},
			properties: {},
		},
		{
			id: "output-webhook",
			type: "output",
			design: { x: 0, y: 0 },
			tags: ["output", "webhook"],
			info: {
				name: "Webhook Output",
				desc: "Envía datos vía webhook",
				icon: "󰖟",
				group: "Output",
				color: "#9B59B6",
				connectors: {
					inputs: [{ name: "data", nextNodeTag: "input" }],
					outputs: [],
				},
			},
			properties: {},
		},
		{
			id: "output-file",
			type: "output",
			design: { x: 0, y: 0 },
			tags: ["output", "file"],
			info: {
				name: "File Output",
				desc: "Guarda datos en archivo",
				icon: "󰈞",
				group: "Output",
				color: "#9B59B6",
				connectors: {
					inputs: [{ name: "data", nextNodeTag: "input" }],
					outputs: [],
				},
			},
			properties: {},
		},
		{
			id: "output-database",
			type: "output",
			design: { x: 0, y: 0 },
			tags: ["output", "database"],
			info: {
				name: "Database Output",
				desc: "Guarda datos en base de datos",
				icon: "󰆼",
				group: "Output",
				color: "#9B59B6",
				connectors: {
					inputs: [{ name: "data", nextNodeTag: "input" }],
					outputs: [],
				},
			},
			properties: {},
		},
		{
			id: "output-response",
			type: "output",
			design: { x: 0, y: 0 },
			tags: ["output", "response"],
			info: {
				name: "HTTP Response",
				desc: "Envía respuesta HTTP",
				icon: "󰞉",
				group: "Output",
				color: "#9B59B6",
				connectors: {
					inputs: [{ name: "data", nextNodeTag: "input" }],
					outputs: [],
				},
			},
			properties: {},
		},
	]);

	// Panel lateral visible
	const isNodePanelVisible = ref(false);
	// Computed para organizar nodos por grupos y subgrupos
	const nodeGroups = computed(() => {
		const groups: { [key: string]: NodeGroup } = {};

		for (const node of availableNodes.value) {
			const groupPath = node.info.group;
			const parts = groupPath.split("/");
			const mainGroup = parts[0];
			const subGroup = parts[1] || null;

			if (!groups[mainGroup]) {
				groups[mainGroup] = {
					name: mainGroup,
					subgroups: [],
					nodes: [],
				};
			}

			if (subGroup) {
				if (!groups[mainGroup].subgroups?.includes(subGroup)) {
					groups[mainGroup].subgroups?.push(subGroup);
				}
			} else {
				groups[mainGroup].nodes.push(node);
			}
		}

		return groups;
	});

	// Computed para obtener nodos de un subgrupo específico
	const getNodesBySubgroup = computed(() => {
		return (mainGroup: string, subGroup: string) => {
			return availableNodes.value.filter(
				(node) => node.info.group === `${mainGroup}/${subGroup}`,
			);
		};
	});

	// Mostrar/ocultar panel
	const showNodePanel = (e: INodeCanvasAdd) => {
		if (e?.connection && typeof e.connection === "object") {
			console.log("Mostrando panel de nodos con conexión", e.connection);
		}
		isNodePanelVisible.value = true;
	};

	const hideNodePanel = () => {
		isNodePanelVisible.value = false;
	};

	const toggleNodePanel = () => {
		isNodePanelVisible.value = !isNodePanelVisible.value;
	};

	// Buscar nodos
	const searchNodes = (query: string) => {
		if (!query.trim()) return availableNodes.value;

		const lowerQuery = query.toLowerCase();
		return availableNodes.value.filter(
			(node) =>
				node.info.name.toLowerCase().includes(lowerQuery) ||
				node.info.desc.toLowerCase().includes(lowerQuery) ||
				node.info.group.toLowerCase().includes(lowerQuery) ||
				node.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
		);
	};

	return {
		availableNodes,
		isNodePanelVisible,
		nodeGroups,
		getNodesBySubgroup,
		showNodePanel,
		hideNodePanel,
		toggleNodePanel,
		searchNodes,
	};
});
