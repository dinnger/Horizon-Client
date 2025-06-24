<template>
  <div class="flex h-screen w-full bg-base-100">
    <!-- Sidebar -->
    <div :class="[
      'transition-all duration-300 flex flex-col bg-base-200 shadow-xl backdrop-blur-lg border-r border-base-300',
      isExpanded ? 'w-64' : 'w-16'
    ]">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-base-300">
        <h1 :class="['font-bold text-xl text-primary', !isExpanded && 'hidden']">
          Horizon
        </h1>
        <button @click="toggleSidebar" class="btn btn-ghost btn-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 p-2">
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.path"> <router-link :to="item.path"
              class="flex items-center p-3 rounded-lg hover:bg-base-300 transition-colors group"
              :class="{ 'bg-primary text-primary-content': route.path === item.path }">
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span :class="[
                'ml-3 font-medium transition-opacity',
                !isExpanded && 'opacity-0 hidden'
              ]">
                {{ item.label }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-base-300" v-if="authStore.user">
        <div class="flex items-center space-x-3">
          <div class="avatar">
            <div class="w-10 h-10 rounded-full">
              <img :src="authStore.user.avatar" :alt="authStore.user.name" />
            </div>
          </div>
          <div :class="['flex-1', !isExpanded && 'hidden']">
            <p class="font-medium text-sm">{{ authStore.user.name }}</p>
            <p class="text-xs opacity-70">{{ authStore.user.email }}</p>
          </div>
          <div class="dropdown dropdown-top dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </div>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48">
              <li>
                <a @click="editProfile">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Perfil
                </a>
              </li>
              <li>
                <a @click="handleLogout" class="text-error">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Theme Switcher -->
      <div class="p-4 border-t border-base-300">
        <div class="flex items-center justify-between">
          <span :class="['text-sm font-medium', !isExpanded && 'hidden']">
            Tema
          </span>
          <div class="dropdown dropdown-top dropdown-end">
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
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import IconHome from './icons/IconHome.vue'
import IconProjects from './icons/IconProjects.vue'
import IconSettings from './icons/IconSettings.vue'
import IconSun from './icons/IconSun.vue'
import IconMoon from './icons/IconMoon.vue'
import IconPalette from './icons/IconPalette.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isExpanded = ref(true)
const currentTheme = ref('crystal')

const menuItems = [
  { path: '/', label: 'Home', icon: IconHome },
  { path: '/projects', label: 'Projects', icon: IconProjects },
  { path: '/settings', label: 'Settings', icon: IconSettings }
]

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

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
}

const setTheme = (theme: string) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const editProfile = () => {
  // TODO: Implementar modal o redirección para editar perfil
  console.log('Editar perfil - por implementar')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'crystal'
  setTheme(savedTheme)
})
</script>
