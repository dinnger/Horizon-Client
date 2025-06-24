import { ref, computed } from "vue";
import { defineStore } from "pinia";

export interface Project {
	id: string;
	name: string;
	description: string;
	status: "active" | "inactive";
	createdAt: Date;
	updatedAt: Date;
}

export const useProjectsStore = defineStore("projects", () => {
	const projects = ref<Project[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	// Computed properties
	const getProjectById = computed(() => {
		return (id: string) => projects.value.find((p) => p.id === id);
	});

	const getActiveProjectsCount = computed(() => {
		return projects.value.filter((p) => p.status === "active").length;
	});

	const getInactiveProjectsCount = computed(() => {
		return projects.value.filter((p) => p.status === "inactive").length;
	});

	const getAllProjectsStats = computed(() => {
		return {
			total: projects.value.length,
			active: getActiveProjectsCount.value,
			inactive: getInactiveProjectsCount.value,
		};
	});

	// Actions
	const initializeData = () => {
		// Cargar datos del localStorage
		const savedProjects = localStorage.getItem("horizon-projects");

		if (savedProjects) {
			try {
				const parsed = JSON.parse(savedProjects) as Project[];
				projects.value = parsed.map((p) => ({
					...p,
					createdAt: new Date(p.createdAt),
					updatedAt: new Date(p.updatedAt),
				}));
			} catch (error) {
				console.error("Error parsing saved projects:", error);
				loadDefaultProjects();
			}
		} else {
			loadDefaultProjects();
		}
	};

	const loadDefaultProjects = () => {
		projects.value = [
			{
				id: "1",
				name: "Web Application",
				description: "Una aplicación web moderna con Vue.js y TypeScript",
				status: "active",
				createdAt: new Date("2024-01-15"),
				updatedAt: new Date("2024-01-15"),
			},
			{
				id: "2",
				name: "Mobile App",
				description: "Aplicación móvil para iOS y Android",
				status: "inactive",
				createdAt: new Date("2024-02-10"),
				updatedAt: new Date("2024-02-10"),
			},
			{
				id: "3",
				name: "API Backend",
				description: "API REST con Node.js y Express",
				status: "active",
				createdAt: new Date("2024-03-05"),
				updatedAt: new Date("2024-03-05"),
			},
		];
		saveProjects();
	};

	const saveProjects = () => {
		localStorage.setItem("horizon-projects", JSON.stringify(projects.value));
	};

	const createProject = (
		projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
	) => {
		const now = new Date();
		const newProject: Project = {
			...projectData,
			id: Date.now().toString(),
			createdAt: now,
			updatedAt: now,
		};

		projects.value.push(newProject);
		saveProjects();
		return newProject;
	};

	const updateProject = (
		projectId: string,
		updates: Partial<Omit<Project, "id" | "createdAt">>,
	) => {
		const index = projects.value.findIndex((p) => p.id === projectId);
		if (index > -1) {
			projects.value[index] = {
				...projects.value[index],
				...updates,
				updatedAt: new Date(),
			};
			saveProjects();
			return projects.value[index];
		}
		return null;
	};

	const deleteProject = (projectId: string) => {
		const index = projects.value.findIndex((p) => p.id === projectId);
		if (index > -1) {
			projects.value.splice(index, 1);
			saveProjects();
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
		projects,
		loading,
		error,

		// Getters
		getProjectById,
		getActiveProjectsCount,
		getInactiveProjectsCount,
		getAllProjectsStats,

		// Actions
		initializeData,
		createProject,
		updateProject,
		deleteProject,
		setLoading,
		setError,
	};
});
