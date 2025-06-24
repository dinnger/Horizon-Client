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
          <p class="text-sm opacity-70">Diseña tu workflow visualmente</p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Canvas } from '../../canvas/canvas.ts'
import { useSettingsStore } from '@/stores'

const settingsStore = useSettingsStore()

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

const contentCanvas = ref<HTMLCanvasElement>()
const route = useRoute()
const canvasContainer = ref<HTMLElement>()
const canvasPos = ref('0x, 0y')
const canvasZoom = ref(1)

const projectName = ref('Web Application')

onMounted(() => {
  if (!contentCanvas.value) return
  const canvas = new Canvas({
    canvas: contentCanvas.value,
    theme: settingsStore.currentTheme
  })
  canvas.subscriber("mouse_move", (e) => {
    canvasPos.value = `${e.x}x, ${e.y}y`
  })
  canvas.subscriber("zoom", (e) => {
    canvasZoom.value = e.zoom
  })
  canvas.subscriber("node_added", (e) => {
    console.log(e)
  })
  canvas.actionAddNode({
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
