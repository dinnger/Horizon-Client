import type {
	INodeCanvas,
	INodeConnections,
} from "@canvas/interfaz/node.interface";
import type { Canvas } from "@canvas/canvas";
import { defineStore } from "pinia";
import { ref } from "vue";

type WorkflowData = {
	nodes: { [key: string]: INodeCanvas };
	connections: INodeConnections[];
	version: string;
	timestamp: number;
};

export const useCanvas = defineStore("canvas", () => {
	const history = ref<WorkflowData[]>([]);
	const idFlow = ref<string>("");
	const version = ref<{
		value: string;
		status: "draft" | "published" | "archived";
	}>({
		value: "0.0.1",
		status: "draft",
	});
	const changes = ref(false);

	let canvasInstance: Canvas;

	const initCanvas = (data: { flow: string; canvasInstance: Canvas }) => {
		idFlow.value = data.flow;
		canvasInstance = data.canvasInstance;
		loadInitialWorkflow();
		canvasInstance.subscriber(
			["node_added", "node_removed", "node_moved"],
			(e) => {
				changes.value = true;
			},
		);
	};

	const loadInitialWorkflow = () => {
		if (!canvasInstance) return;
		const workflowData = localStorage.getItem(`workflow_${idFlow.value}`);
		if (workflowData) {
			try {
				const data: WorkflowData[] = JSON.parse(workflowData);
				if (data) {
					history.value = data;
					const lastHistory = history.value[history.value.length - 1];
					version.value.value = lastHistory.version;
					version.value.status = "draft";
					canvasInstance.loadWorkflowData(lastHistory);
				} else {
					localStorage.removeItem(`workflow_${idFlow.value}`);
				}
			} catch (e) {
				console.error("Error parsing workflow data:", e);
			}
		} else {
			// Añadir un nodo inicial de ejemplo
			canvasInstance.actionAddNode({
				node: {
					type: "input",
					design: { x: 60, y: 60 },
					tags: ["input"],
					info: {
						color: "#3498DB",
						group: "Input",
						desc: "Input 1",
						connectors: {
							inputs: [],
							outputs: [{ name: "init", nextNodeTag: "output" }],
						},
						name: "init",
						icon: "󰐊",
					},
					properties: {},
				},
			});
		}

		console.log("initCanvas");
	};

	const save = () => {
		if (!canvasInstance) return;
		const timestamp = Date.now();
		const lastVersion =
			history.value[history.value.length - 1]?.version || "0.0.0";
		const [major, minor, patch] = lastVersion.split(".").map(Number);
		version.value.value = [major, minor, (patch ?? 0) + 1].join(".");
		history.value.push({
			...canvasInstance.getWorkflowData(),
			version: version.value.value,
			timestamp,
		});
		changes.value = false;
		localStorage.setItem(
			`workflow_${idFlow.value}`,
			JSON.stringify(history.value),
		);
	};

	const getHistory = (): WorkflowData[] => {
		return Array.from(history.value.values()).reverse();
	};

	const selectHistory = (selectVersion: string) => {
		if (!canvasInstance) return;
		const workflow = history.value.find((f) => f.version === selectVersion);
		if (workflow) {
			canvasInstance.loadWorkflowData(workflow);
			version.value.value = workflow.version;
			version.value.status =
				selectVersion === history.value[history.value.length - 1].version
					? "draft"
					: "archived";
		}
	};

	const clearHistory = () => {
		history.value = [];
		localStorage.removeItem(`workflow_${idFlow.value}`);
	};

	return {
		initCanvas,
		save,
		getHistory,
		selectHistory,
		clearHistory,
		changes,
		version,
	};
});
