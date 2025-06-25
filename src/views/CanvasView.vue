<template>
  <div class="h-screen bg-base-100 overflow-hidden">
    <!-- Canvas Header -->
    <div class="bg-base-200 border-b border-base-300 h-[55px] p-2 flex items-center justify-between relative">
      <div class="flex items-center space-x-4">
        <button @click="$router.go(-1)" class="btn btn-ghost btn-circle btn-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-bold">Canvas - {{ projectName }}</h1>
          <p class="text-sm opacity-70 -mt-1">Diseña tu workflow visualmente </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <!-- Panel de historial  -->
        <VersionControlPanel />

        <button class="btn btn-success btn-sm" @click="canvasStore.save()" :disabled="!canvasStore.changes">
          <span class="mdi mdi-content-save"></span>
          Guardar
        </button>

        <button class="btn btn-primary btn-sm" @click="canvasStore.save()">
          <span class="mdi mdi-upload"></span>
          Publicar
        </button>
      </div>

      <div class="absolute top-[38px] right-1/2 translate-6/12  flex gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-md">
        <button class="btn btn-sm btn-soft btn-primary">
          <span class="mdi mdi-play"></span>
        </button>
        <h2 class="text-[10px]">Version: {{ canvasStore.version.value }}</h2>
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
import { ref, onMounted } from 'vue'
import { Canvas } from '@canvas/canvas.ts'
import { useSettingsStore, useNodesLibraryStore, useCanvas } from '@/stores'
import NodesLibraryPanel from '@/components/NodesLibraryPanel.vue'
import VersionControlPanel from '@/components/VersionControlPanel.vue'
import type { INodeCanvas, INodeCanvasAdd } from '@canvas/interfaz/node.interface'
import { useRouter } from 'vue-router'

const settingsStore = useSettingsStore()
const nodesStore = useNodesLibraryStore()
const canvasStore = useCanvas()
const router = useRouter()

const contentCanvas = ref<HTMLCanvasElement>()
const canvasPos = ref('0x, 0y')
const canvasZoom = ref(1)
const nodeOrigin = ref<INodeCanvasAdd | null>(null)
const projectName = ref('Web Application')
const nextNodePosition = ref({ x: 100, y: 100 })
const currentMousePosition = ref({ x: 0, y: 0 })

let canvasInstance: Canvas | null = null

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

  // Añadir el nodo
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
  canvasInstance.subscriber("mouse_move", (e) => {
    canvasPos.value = `${e.x}x, ${e.y}y`
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

  canvasStore.initCanvas({ flow: router.currentRoute.value.params.id as string, canvasInstance })

})
</script>

<style scoped>
.canvas-container {
  background-color: var(--fallback-b1, oklch(var(--b1)));
}
</style>
