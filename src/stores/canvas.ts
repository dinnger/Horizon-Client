import type { INodeCanvas, INodeConnections } from '@canvas/interfaz/node.interface'
import type { Canvas } from '@canvas/canvas'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWorkflowsStore } from '@/stores/workflows'
import socketService from '@/services/socket'

type WorkflowData = {
	nodes: { [key: string]: INodeCanvas }
	connections: INodeConnections[]
	version: string
	timestamp: number
}

export const useCanvas = defineStore('canvas', () => {
	const history = ref<WorkflowData[]>([])
	const workflowId = ref<string>('')
	const version = ref<{
		value: string
		status: 'draft' | 'published' | 'archived'
	}>({
		value: '0.0.1',
		status: 'draft'
	})
	const changes = ref(false)
	const workflowsStore = useWorkflowsStore()

	let canvasInstance: Canvas

	const initCanvas = (data: { flow: string; canvasInstance: Canvas }) => {
		workflowId.value = data.flow
		canvasInstance = data.canvasInstance
		loadInitialWorkflow()
		canvasInstance.subscriber(['node_added', 'node_removed', 'node_moved'], (e) => {
			changes.value = true
		})
	}

	const loadInitialWorkflow = async () => {
		if (!canvasInstance) return
		const data: { workflowData: WorkflowData; version: string } = await workflowsStore.getWorkflowById(workflowId.value)
		if (data?.workflowData) {
			try {
				version.value.value = data.version
				version.value.status = 'draft'
				canvasInstance.loadWorkflowData(data.workflowData)
			} catch (e) {
				console.error('Error parsing workflow data:', e)
			}
		} else {
			socketService.getNodeByType('workflow_init').then((node) => {
				console.log(' node', node)
				canvasInstance.actionAddNode({ node: { ...node, design: { x: 60, y: 60 } } })
			})
			// Añadir un nodo inicial de ejemplo
		}

		console.log('initCanvas')
	}

	const save = () => {
		if (!canvasInstance) return
		// const timestamp = Date.now()
		// const lastVersion = history.value[history.value.length - 1]?.version || '0.0.0'
		// const [major, minor, patch] = lastVersion.split('.').map(Number)
		// version.value.value = [major, minor, (patch ?? 0) + 1].join('.')
		workflowsStore.updateWorkflow(workflowId.value, canvasInstance.getWorkflowData())
		changes.value = false
		// localStorage.setItem(`workflow_${workflowId.value}`, JSON.stringify(history.value))
	}

	const getHistory = (): WorkflowData[] => {
		return Array.from(history.value.values()).reverse()
	}

	const selectHistory = (selectVersion: string) => {
		if (!canvasInstance) return
		const workflow = history.value.find((f) => f.version === selectVersion)
		if (workflow) {
			canvasInstance.loadWorkflowData(workflow)
			version.value.value = workflow.version
			version.value.status = selectVersion === history.value[history.value.length - 1].version ? 'draft' : 'archived'
		}
	}

	const clearHistory = () => {
		history.value = []
		localStorage.removeItem(`workflow_${workflowId.value}`)
	}

	return {
		initCanvas,
		save,
		getHistory,
		selectHistory,
		clearHistory,
		changes,
		version
	}
})
