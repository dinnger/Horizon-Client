<template>
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
          <p class="text-sm opacity-70">Diseña tu workflow visualmente • Presiona <kbd class="kbd kbd-xs">Espacio</kbd>
            para añadir nodos</p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <button @click="showNodesPanel" class="btn btn-outline btn-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Añadir Nodo
        </button>
        <button class="btn btn-primary btn-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Guardar
        </button>
      </div>
    </div>

    <div class="flex h-[calc(100vh-73px)]">
      <canvas ref="contentCanvas"></canvas>
      <div class="absolute bottom-0 right-0 flex flex-col gap-2 p-2 text-[11px] text-right">
        Pos: {{ canvasPos }}
        <br>
        zoom: {{ canvasZoom }} X
      </div>
    </div>

    <!-- Panel de librería de nodos -->
    <NodesLibraryPanel @node-selected="handleNodeSelection" @close="onPanelClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Canvas } from '@canvas/canvas.ts'
import { useSettingsStore, useNodesLibraryStore } from '@/stores'
import NodesLibraryPanel from '@/components/NodesLibraryPanel.vue'
import type { INodeCanvas, INodeCanvasAdd } from '@canvas/interfaz/node.interface'

const settingsStore = useSettingsStore()
const nodesStore = useNodesLibraryStore()

const contentCanvas = ref<HTMLCanvasElement>()
const canvasContainer = ref<HTMLElement>()
const canvasPos = ref('0x, 0y')
const canvasZoom = ref(1)

const nodeOrigin = ref<INodeCanvasAdd | null>(null)

let canvasInstance: Canvas | null = null

const projectName = ref('Web Application')

// Posición donde se añadirá el próximo nodo
const nextNodePosition = ref({ x: 100, y: 100 })
const currentMousePosition = ref({ x: 0, y: 0 })



// Función para manejar la selección de un nodo desde el panel
const handleNodeSelection = (selectedNode: INodeCanvas) => {
  if (!canvasInstance || !nodeOrigin.value) return

  // Usar la posición del mouse si está disponible, sino usar la posición por defecto
  const positionX = currentMousePosition.value.x || nextNodePosition.value.x
  const positionY = currentMousePosition.value.y || nextNodePosition.value.y

  // Crear una copia del nodo con nueva posición
  const nodeToAdd: INodeCanvas = {
    ...JSON.parse(JSON.stringify(selectedNode)),
    design: {
      x: positionX,
      y: positionY
    }
  }



  const nodeId = canvasInstance.actionAddNode({
    origin: {
      idNode: nodeOrigin.value.node.id as string,
      connectorType: nodeOrigin.value.connection.type,
      connectorName: nodeOrigin.value.connection.name
    },
    node: nodeToAdd,
    isManual: true
  })


  console.log(`Nodo ${selectedNode.info.name} añadido con ID: ${nodeId}`)
}

// Función para manejar el cierre del panel
const onPanelClose = () => {
  // Aquí puedes agregar lógica adicional cuando se cierre el panel
  console.log('Panel de nodos cerrado')
}

onMounted(() => {
  if (!contentCanvas.value) return

  canvasInstance = new Canvas({
    canvas: contentCanvas.value,
    theme: settingsStore.currentTheme
  })
  // Suscribirse a eventos del canvas
  canvasInstance.subscriber("mouse_move", (e) => {
    canvasPos.value = `${e.x}x, ${e.y}y`
    // Actualizar posición del mouse para usar al añadir nodos
    currentMousePosition.value = { x: e.x, y: e.y }
  })

  canvasInstance.subscriber("zoom", (e) => {
    canvasZoom.value = e.zoom
  })

  canvasInstance.subscriber("node_added", (e: INodeCanvasAdd) => {
    console.log('Nodo añadido:', e)
    nodeOrigin.value = e
    nodesStore.showNodePanel(e)
  })

  // Añadir un nodo inicial de ejemplo
  canvasInstance.actionAddNode({
    node: {
      id: '1',
      type: 'input',
      design: { x: 60, y: 60 },
      tags: ['input'],
      info: {
        color: '#3498DB',
        group: 'Input',
        desc: 'Input 1',
        connectors: {
          inputs: [],
          outputs: [{ name: 'init', nextNodeTag: 'output' }]
        },
        name: 'init',
        icon: '󰐊'
      },
      properties: {}
    }
  })


})
</script>

<style scoped>
.canvas-container {
  background-color: var(--fallback-b1, oklch(var(--b1)));
}
</style>
