import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useWorkspaceStore } from './workspace'
import socketService from '../services/socket'

export interface ProjectTransportConfig {
	// TCP
	host?: string
	port?: number

	// RabbitMQ
	amqpUrl?: string
	exchange?: string
	queue?: string
	routingKey?: string

	// Kafka
	brokers?: string[]
	clientId?: string
	groupId?: string
	topic?: string

	// NATS
	natsUrl?: string
	subject?: string

	// HTTP/REST
	baseUrl?: string
	timeout?: number

	// WebSocket
	wsUrl?: string

	// Common
	username?: string
	password?: string
	ssl?: boolean
	retries?: number
	retryDelay?: number
}

export interface Project {
	id: string
	workspaceId?: string
	name: string
	description: string
	status: 'active' | 'inactive'
	transportType?: 'none' | 'tcp' | 'rabbitmq' | 'kafka' | 'nats' | 'http' | 'websocket' | 'mqtt'
	transportConfig?: ProjectTransportConfig
	createdAt: Date
	updatedAt: Date
}

export const useProjectsStore = defineStore('projects', () => {
	const isInitialized = ref(false)
	const projects = ref<Project[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)
	const showEmptyState = ref(false)
	const workspaceStore = useWorkspaceStore()

	// Computed properties
	const getProjectById = computed(() => {
		if (!isInitialized.value) initializeData()
		return (id: string) => {
			return projects.value.find((p) => p.id.toString() === id.toString())
		}
	})

	const getActiveProjectsCount = computed(() => {
		return projects.value.filter((p) => p.status === 'active').length
	})

	const getInactiveProjectsCount = computed(() => {
		return projects.value.filter((p) => p.status === 'inactive').length
	})

	const getAllProjectsStats = computed(() => {
		return {
			total: projects.value.length,
			active: getActiveProjectsCount.value,
			inactive: getInactiveProjectsCount.value
		}
	})

	// Actions
	const initializeData = () => {
		if (isInitialized.value) return
		isInitialized.value = true
		watch(
			() => workspaceStore.currentWorkspaceId,
			async (value) => {
				if (!value) return
				loadProjects()
			},
			{ immediate: true }
		)
	}

	const loadProjects = async () => {
		showEmptyState.value = false
		const parsed: Project[] = await socketService.getProjects(workspaceStore.currentWorkspaceId)
		if (!parsed || parsed.length === 0) {
			showEmptyState.value = true
			projects.value = []
			return
		}
		try {
			projects.value = parsed.map((p) => ({
				...p,
				createdAt: new Date(p.createdAt),
				updatedAt: new Date(p.updatedAt)
			}))
		} catch (error) {
			console.error('Error parsing saved projects:', error)
			showEmptyState.value = true
		}
	}

	const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
		const now = new Date()
		const newProject: Project = {
			...projectData,
			id: Date.now().toString(),
			workspaceId: workspaceStore.currentWorkspaceId,
			createdAt: now,
			updatedAt: now
		}
		socketService.createProject(newProject)
		loadProjects()
		return newProject
	}

	const updateProject = (projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
		const now = new Date()
		const updatedProject = {
			...getProjectById.value(projectId),
			...updates,
			updatedAt: now
		}
		socketService.updateProject(projectId, updatedProject)
		loadProjects()
		return updatedProject
	}

	const deleteProject = async (projectId: string) => {
		try {
			await socketService.deleteProject(projectId)
			loadProjects()
			return true
		} catch (error) {
			return false
		}
	}

	const setLoading = (value: boolean) => {
		loading.value = value
	}

	const setError = (message: string | null) => {
		error.value = message
	}

	return {
		// State
		projects,
		loading,
		error,
		showEmptyState,

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
		setError
	}
})
