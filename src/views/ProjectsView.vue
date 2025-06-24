<template>
  <div class="p-8 bg-base-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-primary">Proyectos</h1>
          <p class="text-base-content/70 mt-2">Gestiona todos tus proyectos desde aquí</p>
        </div>
        <button @click="showCreateModal = true" class="btn btn-primary glass">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Proyecto
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="project in projects" :key="project.id" @click="goToProject(project.id)"
          class="card bg-base-200 shadow-xl backdrop-blur-sm border border-base-300 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105">
          <div class="card-body">
            <div class="flex justify-between items-start mb-4">
              <h2 class="card-title text-lg">{{ project.name }}</h2>
              <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-sm" @click.stop>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </div>
                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a @click.stop="editProject(project)">Editar</a></li>
                  <li><a @click.stop="deleteProject(project.id)" class="text-error">Eliminar</a></li>
                </ul>
              </div>
            </div>

            <p class="text-sm opacity-70 mb-4">{{ project.description }}</p>

            <div class="flex justify-between items-center text-sm">
              <div class="flex items-center space-x-2">
                <span class="badge badge-primary badge-sm">{{ project.workflows.length }} workflows</span>
                <span :class="['badge badge-sm', project.status === 'active' ? 'badge-success' : 'badge-warning']">
                  {{ project.status }}
                </span>
              </div>
              <span class="opacity-50">{{ formatDate(project.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="projects.length === 0"
          class="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div class="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mb-4">
            <svg class="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">No tienes proyectos aún</h3>
          <p class="text-base-content/70 mb-4">Crea tu primer proyecto para comenzar</p>
          <button @click="showCreateModal = true" class="btn btn-primary">
            Crear Proyecto
          </button>
        </div>
      </div>

      <!-- Create Project Modal -->
      <div v-if="showCreateModal" class="modal modal-open">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Crear Nuevo Proyecto</h3>
          <form @submit.prevent="createProject">
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Nombre del Proyecto</span>
              </label>
              <input v-model="newProject.name" type="text" placeholder="Mi proyecto increíble"
                class="input input-bordered w-full" required />
            </div>

            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text">Descripción</span>
              </label>
              <textarea v-model="newProject.description" class="textarea textarea-bordered h-24"
                placeholder="Describe tu proyecto..."></textarea>
            </div>

            <div class="modal-action">
              <button type="button" @click="showCreateModal = false" class="btn">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                Crear Proyecto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  workflows: string[]
  createdAt: Date
}

const router = useRouter()
const showCreateModal = ref(false)
const projects = ref<Project[]>([
  {
    id: '1',
    name: 'Web Application',
    description: 'Una aplicación web moderna con Vue.js y TypeScript',
    status: 'active',
    workflows: ['build', 'test', 'deploy'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'Aplicación móvil para iOS y Android',
    status: 'inactive',
    workflows: ['build', 'test'],
    createdAt: new Date('2024-02-10')
  },
  {
    id: '3',
    name: 'API Backend',
    description: 'API REST con Node.js y Express',
    status: 'active',
    workflows: ['build', 'test', 'deploy', 'monitoring'],
    createdAt: new Date('2024-03-05')
  }
])

const newProject = reactive({
  name: '',
  description: ''
})

const goToProject = (projectId: string) => {
  router.push(`/projects/${projectId}`)
}

const createProject = () => {
  const project: Project = {
    id: Date.now().toString(),
    name: newProject.name,
    description: newProject.description,
    status: 'active',
    workflows: [],
    createdAt: new Date()
  }

  projects.value.push(project)

  // Reset form
  newProject.name = ''
  newProject.description = ''
  showCreateModal.value = false
}

const editProject = (project: Project) => {
  // TODO: Implement edit functionality
  console.log('Edit project:', project)
}

const deleteProject = (projectId: string) => {
  const index = projects.value.findIndex(p => p.id === projectId)
  if (index > -1) {
    projects.value.splice(index, 1)
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
