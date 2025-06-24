import { ref, computed } from "vue";
import { defineStore } from "pinia";

export interface Workspace {
	id: string;
	name: string;
	description?: string;
	color: string;
	icon: string;
	createdAt: Date;
	updatedAt: Date;
	isDefault: boolean;
}

export const useWorkspaceStore = defineStore("workspace", () => {
	const workspaces = ref<Workspace[]>([]);
	const currentWorkspaceId = ref<string>("");
	const currentWorkspace = computed(() => {
		// Inicializar si no hay workspaces
		if (workspaces.value.length === 0) {
			initWorkspaces();
		}
		return (
			workspaces.value.find((w) => w.id === currentWorkspaceId.value) ||
			workspaces.value[0]
		);
	});

	const defaultWorkspace = computed(() => {
		return workspaces.value.find((w) => w.isDefault) || workspaces.value[0];
	});

	// Inicializar workspaces con uno por defecto
	const initWorkspaces = () => {
		const savedWorkspaces = localStorage.getItem("horizon-workspaces");
		const savedCurrentId = localStorage.getItem("horizon-current-workspace");

		if (savedWorkspaces) {
			try {
				const parsed = JSON.parse(savedWorkspaces) as Workspace[];
				workspaces.value = parsed.map((w) => ({
					...w,
					createdAt: new Date(w.createdAt),
					updatedAt: new Date(w.updatedAt),
				}));
			} catch (error) {
				console.error("Error parsing saved workspaces:", error);
				createDefaultWorkspace();
			}
		} else {
			createDefaultWorkspace();
		}

		// Establecer workspace actual
		if (
			savedCurrentId &&
			workspaces.value.find((w) => w.id === savedCurrentId)
		) {
			currentWorkspaceId.value = savedCurrentId;
		} else {
			currentWorkspaceId.value = defaultWorkspace.value?.id || "";
		}
	};

	const createDefaultWorkspace = () => {
		const defaultWs: Workspace = {
			id: "default",
			name: "Default Workspace",
			description: "Workspace principal para tus proyectos",
			color: "#3b82f6",
			icon: "mdi-briefcase",
			createdAt: new Date(),
			updatedAt: new Date(),
			isDefault: true,
		};

		workspaces.value = [defaultWs];
		currentWorkspaceId.value = defaultWs.id;
		saveWorkspaces();
	};

	const createWorkspace = (
		data: Omit<Workspace, "id" | "createdAt" | "updatedAt">,
	) => {
		const newWorkspace: Workspace = {
			...data,
			id: generateId(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		workspaces.value.push(newWorkspace);
		saveWorkspaces();
		return newWorkspace;
	};

	const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
		const index = workspaces.value.findIndex((w: Workspace) => w.id === id);
		if (index !== -1) {
			workspaces.value[index] = {
				...workspaces.value[index],
				...updates,
				updatedAt: new Date(),
			};
			saveWorkspaces();
		}
	};

	const deleteWorkspace = (id: string) => {
		const workspace = workspaces.value.find((w: Workspace) => w.id === id);
		if (workspace?.isDefault) {
			throw new Error("No se puede eliminar el workspace por defecto");
		}

		workspaces.value = workspaces.value.filter((w: Workspace) => w.id !== id);

		// Si estamos eliminando el workspace actual, cambiar al default
		if (currentWorkspaceId.value === id) {
			currentWorkspaceId.value = defaultWorkspace.value?.id || "";
		}

		saveWorkspaces();
	};

	const switchWorkspace = (id: string) => {
		const workspace = workspaces.value.find((w: Workspace) => w.id === id);
		if (workspace) {
			currentWorkspaceId.value = id;
			localStorage.setItem("horizon-current-workspace", id);
		}
	};

	const saveWorkspaces = () => {
		localStorage.setItem(
			"horizon-workspaces",
			JSON.stringify(workspaces.value),
		);
		localStorage.setItem("horizon-current-workspace", currentWorkspaceId.value);
	};

	const generateId = () => {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	};

	return {
		workspaces,
		currentWorkspaceId,
		currentWorkspace,
		defaultWorkspace,
		initWorkspaces,
		createWorkspace,
		updateWorkspace,
		deleteWorkspace,
		switchWorkspace,
	};
});
