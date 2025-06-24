import { ref, computed } from "vue";
import { defineStore } from "pinia";

export interface Workflow {
	id: string;
	name: string;
	description: string;
	status: "success" | "running" | "failed" | "pending";
	lastRun: Date;
	duration: string;
	projectId: string;
	createdAt: Date;
	updatedAt: Date;
}

export const useWorkflowsStore = defineStore("workflows", () => {
	const workflows = ref<Workflow[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	// Computed properties
	const getWorkflowById = computed(() => {
		return (id: string) => workflows.value.find((w) => w.id === id);
	});

	const getWorkflowsByProjectId = computed(() => {
		return (projectId: string) =>
			workflows.value.filter((w) => w.projectId === projectId);
	});

	const getActiveWorkflowsCount = computed(() => {
		return (projectId: string) => {
			const projectWorkflows = workflows.value.filter(
				(w) => w.projectId === projectId,
			);
			return projectWorkflows.filter(
				(w) => w.status === "running" || w.status === "success",
			).length;
		};
	});

	const getWorkflowStats = computed(() => {
		return (projectId: string) => {
			const projectWorkflows = workflows.value.filter(
				(w) => w.projectId === projectId,
			);

			if (projectWorkflows.length === 0) {
				return {
					executions: 0,
					successRate: 0,
					avgDuration: "0m 0s",
					lastExecution: undefined,
				};
			}

			const successCount = projectWorkflows.filter(
				(w) => w.status === "success",
			).length;
			const successRate = (successCount / projectWorkflows.length) * 100; // Calcular duración promedio real
			const totalSeconds = projectWorkflows.reduce((total, workflow) => {
				const [minutes, seconds] = workflow.duration
					.split(/[ms]/)
					.map((s) => Number.parseInt(s.trim()) || 0);
				return total + minutes * 60 + seconds;
			}, 0);
			const avgSeconds = Math.round(totalSeconds / projectWorkflows.length);
			const avgMinutes = Math.floor(avgSeconds / 60);
			const remainingSeconds = avgSeconds % 60;
			const avgDuration = `${avgMinutes}m ${remainingSeconds}s`;

			// Última ejecución
			const lastExecution = projectWorkflows.reduce((latest, workflow) => {
				return workflow.lastRun > latest ? workflow.lastRun : latest;
			}, new Date(0));

			return {
				executions: projectWorkflows.length,
				successRate: Math.round(successRate * 10) / 10,
				avgDuration,
				lastExecution: lastExecution.getTime() > 0 ? lastExecution : undefined,
			};
		};
	});

	const getAllWorkflowStats = computed(() => {
		if (workflows.value.length === 0) {
			return {
				total: 0,
				running: 0,
				success: 0,
				failed: 0,
				pending: 0,
			};
		}

		return {
			total: workflows.value.length,
			running: workflows.value.filter((w) => w.status === "running").length,
			success: workflows.value.filter((w) => w.status === "success").length,
			failed: workflows.value.filter((w) => w.status === "failed").length,
			pending: workflows.value.filter((w) => w.status === "pending").length,
		};
	});

	// Actions
	const initializeData = () => {
		const savedWorkflows = localStorage.getItem("horizon-workflows");

		if (savedWorkflows) {
			try {
				const parsed = JSON.parse(savedWorkflows) as Workflow[];
				workflows.value = parsed.map((w) => ({
					...w,
					createdAt: new Date(w.createdAt),
					updatedAt: new Date(w.updatedAt),
					lastRun: new Date(w.lastRun),
				}));
			} catch (error) {
				console.error("Error parsing saved workflows:", error);
				loadDefaultWorkflows();
			}
		} else {
			loadDefaultWorkflows();
		}
	};

	const loadDefaultWorkflows = () => {
		workflows.value = [
			{
				id: "1",
				name: "Build & Test",
				description: "Compilar código y ejecutar pruebas",
				status: "success",
				lastRun: new Date("2024-06-23T10:30:00"),
				duration: "2m 15s",
				projectId: "1",
				createdAt: new Date("2024-01-15"),
				updatedAt: new Date("2024-06-23T10:30:00"),
			},
			{
				id: "2",
				name: "Deploy to Staging",
				description: "Desplegar a entorno de pruebas",
				status: "running",
				lastRun: new Date("2024-06-23T11:45:00"),
				duration: "1m 32s",
				projectId: "1",
				createdAt: new Date("2024-01-15"),
				updatedAt: new Date("2024-06-23T11:45:00"),
			},
			{
				id: "3",
				name: "Deploy to Production",
				description: "Desplegar a producción",
				status: "pending",
				lastRun: new Date("2024-06-22T16:20:00"),
				duration: "3m 45s",
				projectId: "1",
				createdAt: new Date("2024-01-15"),
				updatedAt: new Date("2024-06-22T16:20:00"),
			},
			{
				id: "4",
				name: "Build iOS",
				description: "Compilar aplicación para iOS",
				status: "success",
				lastRun: new Date("2024-06-22T14:20:00"),
				duration: "4m 12s",
				projectId: "2",
				createdAt: new Date("2024-02-10"),
				updatedAt: new Date("2024-06-22T14:20:00"),
			},
			{
				id: "5",
				name: "Build Android",
				description: "Compilar aplicación para Android",
				status: "failed",
				lastRun: new Date("2024-06-22T15:30:00"),
				duration: "3m 45s",
				projectId: "2",
				createdAt: new Date("2024-02-10"),
				updatedAt: new Date("2024-06-22T15:30:00"),
			},
			{
				id: "6",
				name: "API Tests",
				description: "Ejecutar pruebas de la API",
				status: "success",
				lastRun: new Date("2024-06-23T09:15:00"),
				duration: "1m 22s",
				projectId: "3",
				createdAt: new Date("2024-03-05"),
				updatedAt: new Date("2024-06-23T09:15:00"),
			},
			{
				id: "7",
				name: "Deploy API",
				description: "Desplegar API a producción",
				status: "success",
				lastRun: new Date("2024-06-23T12:00:00"),
				duration: "2m 08s",
				projectId: "3",
				createdAt: new Date("2024-03-05"),
				updatedAt: new Date("2024-06-23T12:00:00"),
			},
			{
				id: "8",
				name: "Database Migration",
				description: "Ejecutar migraciones de base de datos",
				status: "pending",
				lastRun: new Date("2024-06-20T18:00:00"),
				duration: "45s",
				projectId: "3",
				createdAt: new Date("2024-03-05"),
				updatedAt: new Date("2024-06-20T18:00:00"),
			},
			{
				id: "9",
				name: "Health Check",
				description: "Verificar estado de la API",
				status: "running",
				lastRun: new Date("2024-06-23T13:30:00"),
				duration: "30s",
				projectId: "3",
				createdAt: new Date("2024-03-05"),
				updatedAt: new Date("2024-06-23T13:30:00"),
			},
		];
		saveWorkflows();
	};

	const saveWorkflows = () => {
		localStorage.setItem("horizon-workflows", JSON.stringify(workflows.value));
	};

	const createWorkflow = (
		workflowData: Omit<Workflow, "id" | "createdAt" | "updatedAt" | "lastRun">,
	) => {
		const now = new Date();
		const newWorkflow: Workflow = {
			...workflowData,
			id: Date.now().toString(),
			lastRun: now,
			createdAt: now,
			updatedAt: now,
		};

		workflows.value.push(newWorkflow);
		saveWorkflows();
		return newWorkflow;
	};

	const updateWorkflow = (
		workflowId: string,
		updates: Partial<Omit<Workflow, "id" | "createdAt" | "projectId">>,
	) => {
		const index = workflows.value.findIndex((w) => w.id === workflowId);
		if (index > -1) {
			workflows.value[index] = {
				...workflows.value[index],
				...updates,
				updatedAt: new Date(),
			};
			saveWorkflows();
			return workflows.value[index];
		}
		return null;
	};

	const deleteWorkflow = (workflowId: string) => {
		const index = workflows.value.findIndex((w) => w.id === workflowId);
		if (index > -1) {
			workflows.value.splice(index, 1);
			saveWorkflows();
			return true;
		}
		return false;
	};

	const deleteWorkflowsByProjectId = (projectId: string) => {
		const initialLength = workflows.value.length;
		workflows.value = workflows.value.filter((w) => w.projectId !== projectId);

		if (workflows.value.length !== initialLength) {
			saveWorkflows();
			return true;
		}
		return false;
	};

	const runWorkflow = (workflowId: string) => {
		const workflow = workflows.value.find((w) => w.id === workflowId);
		if (workflow) {
			workflow.status = "running";
			workflow.lastRun = new Date();
			workflow.updatedAt = new Date();
			saveWorkflows();

			// Simular ejecución
			setTimeout(
				() => {
					workflow.status = Math.random() > 0.1 ? "success" : "failed";
					workflow.duration = `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`;
					workflow.updatedAt = new Date();
					saveWorkflows();
				},
				2000 + Math.random() * 3000,
			);

			return true;
		}
		return false;
	};

	const setLoading = (value: boolean) => {
		loading.value = value;
	};

	const setError = (message: string | null) => {
		error.value = message;
	};

	return {
		// State
		workflows,
		loading,
		error,

		// Getters
		getWorkflowById,
		getWorkflowsByProjectId,
		getActiveWorkflowsCount,
		getWorkflowStats,
		getAllWorkflowStats,

		// Actions
		initializeData,
		createWorkflow,
		updateWorkflow,
		deleteWorkflow,
		deleteWorkflowsByProjectId,
		runWorkflow,
		setLoading,
		setError,
	};
});
