<template>
  <DefaultLayout>
    <div class="h-screen bg-base-100 overflow-hidden">
      <!-- Canvas Header -->
      <div class="bg-base-200 border-b border-base-300 p-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="$router.go(-1)" class="btn btn-ghost btn-circle btn-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold">Canvas - {{ projectName }}</h1>
            <p class="text-sm opacity-70">Diseña tu workflow visualmente</p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <div class="flex items-center space-x-2 mr-4">
            <button @click="zoomOut" :disabled="zoom <= 0.5" class="btn btn-ghost btn-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <span class="text-sm min-w-[60px] text-center">{{ Math.round(zoom * 100) }}%</span>
            <button @click="zoomIn" :disabled="zoom >= 2" class="btn btn-ghost btn-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button @click="resetZoom" class="btn btn-ghost btn-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <button @click="clearCanvas" class="btn btn-error btn-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpiar
          </button>

          <button @click="saveCanvas" class="btn btn-primary btn-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Guardar
          </button>
        </div>
      </div>

      <div class="flex h-[calc(100vh-73px)]">
        <!-- Toolbar -->
        <div class="w-64 bg-base-200 border-r border-base-300 p-4 overflow-y-auto">
          <h3 class="font-semibold mb-4">Herramientas</h3>

          <!-- Node Types -->
          <div class="space-y-2 mb-6">
            <h4 class="text-sm font-medium opacity-70 mb-2">Nodos</h4>
            <div v-for="nodeType in nodeTypes" :key="nodeType.type" @dragstart="startDrag($event, nodeType)"
              draggable="true"
              class="p-3 bg-base-100 rounded-lg border border-base-300 cursor-move hover:shadow-md transition-all">
              <div class="flex items-center space-x-2">
                <div :class="['w-3 h-3 rounded-full', nodeType.color]"></div>
                <span class="text-sm font-medium">{{ nodeType.name }}</span>
              </div>
              <p class="text-xs opacity-70 mt-1">{{ nodeType.description }}</p>
            </div>
          </div>

          <!-- Canvas Tools -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium opacity-70 mb-2">Herramientas</h4>
            <button @click="selectedTool = 'select'"
              :class="['btn btn-sm w-full justify-start', selectedTool === 'select' ? 'btn-primary' : 'btn-ghost']">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Seleccionar
            </button>
            <button @click="selectedTool = 'pan'"
              :class="['btn btn-sm w-full justify-start', selectedTool === 'pan' ? 'btn-primary' : 'btn-ghost']">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Mover
            </button>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="flex-1 relative overflow-hidden">
          <div ref="canvasContainer" class="w-full h-full relative" @drop="onDrop" @dragover.prevent
            @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @wheel="onWheel">
            <!-- Grid Background -->
            <div class="absolute inset-0 opacity-10" :style="{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              transform: `translate(${panX}px, ${panY}px)`
            }"></div>

            <!-- Canvas Content -->
            <div class="absolute inset-0" :style="{
              transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }">
              <!-- Nodes -->
              <div v-for="node in nodes" :key="node.id" class="absolute"
                :style="{ left: node.x + 'px', top: node.y + 'px' }">
                <div :class="[
                  'w-32 h-20 bg-base-100 border-2 border-base-300 rounded-lg shadow-lg cursor-move flex flex-col items-center justify-center relative',
                  selectedNode === node.id ? 'border-primary' : ''
                ]" @mousedown.stop="selectNode(node.id)" @dblclick="editNode(node)">
                  <div :class="['w-3 h-3 rounded-full mb-1', getNodeColor(node.type)]"></div>
                  <span class="text-xs font-medium text-center px-2">{{ node.name }}</span>

                  <!-- Node Handles -->
                  <div
                    class="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white">
                  </div>
                  <div
                    class="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-secondary rounded-full border-2 border-white">
                  </div>
                </div>
              </div>

              <!-- Connections would go here -->
              <!-- This is a placeholder for connection lines between nodes -->
            </div>

            <!-- Empty State -->
            <div v-if="nodes.length === 0"
              class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="text-center">
                <div
                  class="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2 opacity-70">Canvas Vacío</h3>
                <p class="text-base-content/50">Arrastra nodos desde la barra lateral para comenzar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'

interface Node {
  id: string
  type: string
  name: string
  x: number
  y: number
}

interface NodeType {
  type: string
  name: string
  description: string
  color: string
}

const route = useRoute()
const canvasContainer = ref<HTMLElement>()

const projectName = ref('Web Application')
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const selectedTool = ref('select')
const selectedNode = ref<string | null>(null)
const nodes = ref<Node[]>([])

const isPanning = ref(false)
const isDraggingNode = ref(false)
const lastMousePos = reactive({ x: 0, y: 0 })

const nodeTypes: NodeType[] = [
  {
    type: 'start',
    name: 'Inicio',
    description: 'Punto de inicio del workflow',
    color: 'bg-success'
  },
  {
    type: 'action',
    name: 'Acción',
    description: 'Ejecuta una tarea específica',
    color: 'bg-primary'
  },
  {
    type: 'condition',
    name: 'Condición',
    description: 'Evalúa una condición',
    color: 'bg-warning'
  },
  {
    type: 'end',
    name: 'Fin',
    description: 'Punto final del workflow',
    color: 'bg-error'
  }
]

// Canvas Controls
const zoomIn = () => {
  if (zoom.value < 2) {
    zoom.value = Math.min(2, zoom.value + 0.1)
  }
}

const zoomOut = () => {
  if (zoom.value > 0.5) {
    zoom.value = Math.max(0.5, zoom.value - 0.1)
  }
}

const resetZoom = () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

// Node Operations
const startDrag = (event: DragEvent, nodeType: NodeType) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('nodeType', JSON.stringify(nodeType))
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    const nodeTypeData = event.dataTransfer.getData('nodeType')
    if (nodeTypeData) {
      const nodeType = JSON.parse(nodeTypeData) as NodeType
      const rect = canvasContainer.value?.getBoundingClientRect()
      if (rect) {
        const x = (event.clientX - rect.left - panX.value) / zoom.value
        const y = (event.clientY - rect.top - panY.value) / zoom.value

        const newNode: Node = {
          id: Date.now().toString(),
          type: nodeType.type,
          name: nodeType.name,
          x: x - 64, // Center the node
          y: y - 40
        }

        nodes.value.push(newNode)
      }
    }
  }
}

const selectNode = (nodeId: string) => {
  selectedNode.value = nodeId
}

const editNode = (node: Node) => {
  const newName = prompt('Nombre del nodo:', node.name)
  if (newName) {
    node.name = newName
  }
}

// Mouse Events
const onMouseDown = (event: MouseEvent) => {
  lastMousePos.x = event.clientX
  lastMousePos.y = event.clientY

  if (selectedTool.value === 'pan') {
    isPanning.value = true
  }
}

const onMouseMove = (event: MouseEvent) => {
  if (isPanning.value) {
    const deltaX = event.clientX - lastMousePos.x
    const deltaY = event.clientY - lastMousePos.y

    panX.value += deltaX
    panY.value += deltaY

    lastMousePos.x = event.clientX
    lastMousePos.y = event.clientY
  }
}

const onMouseUp = () => {
  isPanning.value = false
  isDraggingNode.value = false
}

const onWheel = (event: WheelEvent) => {
  event.preventDefault()
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  const newZoom = Math.max(0.5, Math.min(2, zoom.value + delta))
  zoom.value = newZoom
}

// Canvas Actions
const clearCanvas = () => {
  if (confirm('¿Estás seguro de que quieres limpiar el canvas?')) {
    nodes.value = []
    selectedNode.value = null
  }
}

const saveCanvas = () => {
  // TODO: Implement save functionality
  console.log('Saving canvas...', { nodes: nodes.value })
  alert('Canvas guardado!')
}

const getNodeColor = (type: string) => {
  const nodeType = nodeTypes.find(nt => nt.type === type)
  return nodeType?.color || 'bg-base-300'
}

onMounted(() => {
  // Initialize canvas
  console.log('Canvas initialized for project:', route.params.id)
})
</script>

<style scoped>
.canvas-container {
  background-color: var(--fallback-b1, oklch(var(--b1)));
}
</style>
