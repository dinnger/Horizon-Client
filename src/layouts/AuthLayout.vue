<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-primary/20 via-base-100 to-secondary/20">
    <!-- Header opcional con logo -->
    <header class="absolute top-0 left-0 right-0 z-10">
      <div class="container mx-auto p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-base-content">Horizon</span>
          </div>

          <!-- Theme Switcher -->
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
              <component :is="themeIcon" class="w-5 h-5" />
            </div>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li v-for="theme in themes" :key="theme.value">
                <a @click="setTheme(theme.value)" :class="{ 'active': currentTheme === theme.value }">
                  <component :is="theme.icon" class="w-4 h-4" />
                  {{ theme.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="min-h-screen flex items-center justify-center p-4">
      <router-view />
    </main>

    <!-- Footer opcional -->
    <footer class="absolute bottom-0 left-0 right-0 p-6">
      <div class="text-center text-sm text-base-content/60">
        © 2025 Horizon Project Management. Todos los derechos reservados.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import IconSun from '../components/icons/IconSun.vue'
import IconMoon from '../components/icons/IconMoon.vue'
import IconPalette from '../components/icons/IconPalette.vue'

const currentTheme = ref('crystal')

const themes = [
  { value: 'crystal', label: 'Crystal Light', icon: IconSun },
  { value: 'crystal-dark', label: 'Crystal Dark', icon: IconMoon },
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon },
  { value: 'cyberpunk', label: 'Cyberpunk', icon: IconPalette },
  { value: 'synthwave', label: 'Synthwave', icon: IconPalette },
  { value: 'luxury', label: 'Luxury', icon: IconPalette },
  { value: 'dracula', label: 'Dracula', icon: IconPalette }
]

const themeIcon = computed(() => {
  if (currentTheme.value.includes('dark')) return IconMoon
  if (currentTheme.value === 'light' || currentTheme.value === 'crystal') return IconSun
  return IconPalette
})

const setTheme = (theme: string) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'crystal'
  setTheme(savedTheme)
})
</script>
