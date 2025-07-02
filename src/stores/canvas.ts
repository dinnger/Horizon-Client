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
		canvasInstance.subscriber(['node_added', 'node_removed', 'node_moved', 'node_update_properties'], (e) => {
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
				canvasInstance.actionAddNode({ node: { ...node, design: { x: 60, y: 60 } } })
			})
		}
	}

	const save = async () => {
		if (!canvasInstance) return
		await workflowsStore.updateWorkflow(workflowId.value, canvasInstance.getWorkflowData())
		changes.value = false
	}

	const execute = async () => {
		if (!canvasInstance) return

		try {
			// First save the current workflow
			await save()

			// Execute the workflow which will also save to file
			const result = await socketService.executeWorkflow(workflowId.value)

			if (result.success) {
				console.log('Workflow ejecutado exitosamente:', result.executionId)
				return { success: true, executionId: result.executionId }
			}

			console.error('Error ejecutando workflow:', result.message)
			return { success: false, message: result.message }
		} catch (error) {
			console.error('Error en ejecución:', error)
			return { success: false, message: 'Error al ejecutar workflow' }
		}
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
		execute,
		getHistory,
		selectHistory,
		clearHistory,
		changes,
		version
	}
})
