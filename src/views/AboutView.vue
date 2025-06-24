<template>
  <DefaultLayout>
    <div class="p-8 bg-base-100 min-h-screen">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-primary mb-2">Configuración</h1>
          <p class="text-base-content/70">Personaliza tu experiencia en Horizon</p>
        </div>

        <!-- Settings Sections -->
        <div class="space-y-6">
          <!-- Appearance -->
          <div class="card bg-base-200 shadow-xl backdrop-blur-sm border border-base-300">
            <div class="card-body">
              <h2 class="card-title mb-4">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                Apariencia
              </h2>

              <!-- Theme Selection -->
              <div class="form-control mb-4">
                <label class="label">
                  <span class="label-text">Tema</span>
                </label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-for="theme in themes" :key="theme.value" @click="setTheme(theme.value)" :class="[
                    'p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md',
                    currentTheme === theme.value ? 'border-primary bg-primary/10' : 'border-base-300'
                  ]">
                    <div class="flex items-center space-x-2 mb-2">
                      <component :is="theme.icon" class="w-5 h-5" />
                      <span class="font-medium">{{ theme.label }}</span>
                    </div>
                    <div class="flex space-x-1">
                      <div v-for="color in theme.colors" :key="color" :class="['w-4 h-4 rounded-full', color]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Font Size -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Tamaño de fuente</span>
                  <span class="label-text-alt">{{ fontSize }}px</span>
                </label>
                <input v-model="fontSize" type="range" min="12" max="20" class="range range-primary"
                  @input="updateFontSize" />
                <div class="w-full flex justify-between text-xs px-2">
                  <span>Pequeño</span>
                  <span>Mediano</span>
                  <span>Grande</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div class="card bg-base-200 shadow-xl backdrop-blur-sm border border-base-300">
            <div class="card-body">
              <h2 class="card-title mb-4">
                <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-5 5v-5zM10.07 4.93l1.41 1.41A8 8 0 0119.93 14H22a10 10 0 11-11.93-9.07z" />
                </svg>
                Notificaciones
              </h2>

              <div class="space-y-4">
                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Notificaciones de ejecución de workflows</span>
                    <input v-model="notifications.workflowExecution" type="checkbox" class="toggle toggle-primary" />
                  </label>
                </div>

                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Notificaciones de errores</span>
                    <input v-model="notifications.errors" type="checkbox" class="toggle toggle-error" />
                  </label>
                </div>

                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Actualizaciones del sistema</span>
                    <input v-model="notifications.systemUpdates" type="checkbox" class="toggle toggle-info" />
                  </label>
                </div>

                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Recordatorios de proyectos</span>
                    <input v-model="notifications.projectReminders" type="checkbox" class="toggle toggle-warning" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance -->
          <div class="card bg-base-200 shadow-xl backdrop-blur-sm border border-base-300">
            <div class="card-body">
              <h2 class="card-title mb-4">
                <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Rendimiento
              </h2>

              <div class="space-y-4">
                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Animaciones reducidas</span>
                    <input v-model="performance.reducedAnimations" type="checkbox" class="toggle" />
                  </label>
                  <label class="label">
                    <span class="label-text-alt">Mejora el rendimiento en dispositivos lentos</span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Auto-guardado</span>
                    <input v-model="performance.autoSave" type="checkbox" class="toggle toggle-success" />
                  </label>
                  <label class="label">
                    <span class="label-text-alt">Guarda automáticamente cada 30 segundos</span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Intervalo de actualización del canvas</span>
                    <span class="label-text-alt">{{ canvasRefreshRate }}ms</span>
                  </label>
                  <input v-model="canvasRefreshRate" type="range" min="16" max="100" class="range range-accent" />
                  <div class="w-full flex justify-between text-xs px-2">
                    <span>Rápido</span>
                    <span>Balanceado</span>
                    <span>Lento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Data & Privacy -->
          <div class="card bg-base-200 shadow-xl backdrop-blur-sm border border-base-300">
            <div class="card-body">
              <h2 class="card-title mb-4">
                <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Datos y Privacidad
              </h2>

              <div class="space-y-4">
                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Telemetría anónima</span>
                    <input v-model="privacy.telemetry" type="checkbox" class="toggle" />
                  </label>
                  <label class="label">
                    <span class="label-text-alt">Ayuda a mejorar la aplicación</span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Caché local</span>
                    <input v-model="privacy.localCache" type="checkbox" class="toggle toggle-info" />
                  </label>
                  <label class="label">
                    <span class="label-text-alt">Almacena datos localmente para mejor rendimiento</span>
                  </label>
                </div>

                <div class="divider"></div>

                <div class="flex space-x-4">
                  <button @click="exportData" class="btn btn-outline">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Exportar Datos
                  </button>
                  <button @click="clearData" class="btn btn-error btn-outline">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Limpiar Datos
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- About -->
          <div class="card bg-base-200 shadow-xl backdrop-blur-sm border border-base-300">
            <div class="card-body">
              <h2 class="card-title mb-4">
                <svg class="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Acerca de
              </h2>

              <div class="text-sm space-y-2">
                <div class="flex justify-between">
                  <span>Versión:</span>
                  <span class="font-mono">1.0.0</span>
                </div>
                <div class="flex justify-between">
                  <span>Build:</span>
                  <span class="font-mono">2024.06.24</span>
                </div>
                <div class="flex justify-between">
                  <span>Tecnologías:</span>
                  <span>Vue 3, TypeScript, Vite</span>
                </div>
              </div>

              <div class="divider"></div>

              <div class="flex space-x-4">
                <button class="btn btn-outline btn-sm">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documentación
                </button>
                <button class="btn btn-outline btn-sm">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Soporte
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="mt-8 text-center">
          <button @click="saveSettings" class="btn btn-primary btn-lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import IconSun from '../components/icons/IconSun.vue'
import IconMoon from '../components/icons/IconMoon.vue'
import IconPalette from '../components/icons/IconPalette.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const currentTheme = ref('crystal')
const fontSize = ref(16)
const canvasRefreshRate = ref(33)

const themes = [
  {
    value: 'crystal',
    label: 'Crystal Light',
    icon: IconSun,
    colors: ['bg-blue-500', 'bg-purple-500', 'bg-cyan-500']
  },
  {
    value: 'crystal-dark',
    label: 'Crystal Dark',
    icon: IconMoon,
    colors: ['bg-blue-400', 'bg-purple-400', 'bg-cyan-400']
  },
  {
    value: 'cyberpunk',
    label: 'Cyberpunk',
    icon: IconPalette,
    colors: ['bg-pink-500', 'bg-cyan-500', 'bg-yellow-500']
  },
  {
    value: 'synthwave',
    label: 'Synthwave',
    icon: IconPalette,
    colors: ['bg-purple-500', 'bg-pink-500', 'bg-blue-500']
  },
  {
    value: 'luxury',
    label: 'Luxury',
    icon: IconPalette,
    colors: ['bg-amber-500', 'bg-slate-700', 'bg-red-600']
  },
  {
    value: 'dracula',
    label: 'Dracula',
    icon: IconMoon,
    colors: ['bg-purple-500', 'bg-pink-500', 'bg-green-500']
  }
]

const notifications = reactive({
  workflowExecution: true,
  errors: true,
  systemUpdates: false,
  projectReminders: true
})

const performance = reactive({
  reducedAnimations: false,
  autoSave: true
})

const privacy = reactive({
  telemetry: false,
  localCache: true
})

const setTheme = (theme: string) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
}

const updateFontSize = () => {
  document.documentElement.style.fontSize = `${fontSize.value}px`
}

const exportData = () => {
  const data = {
    settings: {
      theme: currentTheme.value,
      fontSize: fontSize.value,
      notifications: notifications,
      performance: performance,
      privacy: privacy
    },
    timestamp: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'horizon-settings.json'
  a.click()
  URL.revokeObjectURL(url)
}

const clearData = () => {
  if (confirm('¿Estás seguro de que quieres limpiar todos los datos? Esta acción no se puede deshacer.')) {
    localStorage.clear()
    alert('Datos limpiados. La página se recargará.')
    window.location.reload()
  }
}

const saveSettings = () => {
  const settings = {
    theme: currentTheme.value,
    fontSize: fontSize.value,
    canvasRefreshRate: canvasRefreshRate.value,
    notifications: notifications,
    performance: performance,
    privacy: privacy
  }

  localStorage.setItem('horizon-settings', JSON.stringify(settings))
  alert('Configuración guardada exitosamente!')
}

onMounted(() => {
  // Load saved settings
  const saved = localStorage.getItem('horizon-settings')
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      currentTheme.value = settings.theme || 'crystal'
      fontSize.value = settings.fontSize || 16
      canvasRefreshRate.value = settings.canvasRefreshRate || 33

      if (settings.notifications) {
        Object.assign(notifications, settings.notifications)
      }
      if (settings.performance) {
        Object.assign(performance, settings.performance)
      }
      if (settings.privacy) {
        Object.assign(privacy, settings.privacy)
      }

      setTheme(currentTheme.value)
      updateFontSize()
    } catch (e) {
      console.error('Error loading settings:', e)
    }
  }
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
