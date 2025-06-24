import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  // Simulación de login
  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500))
        // Validación simple para demo
      if (email === 'admin@horizon.com' && password === 'admin123') {
        user.value = {
          id: '1',
          email: 'admin@horizon.com',
          name: 'Administrator',
          avatar: 'https://ui-avatars.com/api/?name=Administrator&background=3b82f6&color=fff',
          role: 'admin'
        }
        localStorage.setItem('horizon-user', JSON.stringify(user.value))
        return true
      }
      
      if (email === 'user@horizon.com' && password === 'user123') {
        user.value = {
          id: '2',
          email: 'user@horizon.com',
          name: 'John Doe',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=8b5cf6&color=fff',
          role: 'user'
        }
        localStorage.setItem('horizon-user', JSON.stringify(user.value))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('horizon-user')
  }

  const initAuth = () => {
    const savedUser = localStorage.getItem('horizon-user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('horizon-user')
      }
    }
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('horizon-user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    initAuth,
    updateProfile
  }
})
