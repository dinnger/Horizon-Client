import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import ProjectDetailView from "../views/ProjectDetailView.vue";
import CanvasView from "../views/CanvasView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ServerErrorView from "../views/ServerErrorView.vue";
import { authGuard } from "../guards/auth";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/login",
			name: "login",
			component: LoginView,
		},
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/projects",
			name: "projects",
			component: ProjectsView,
		},
		{
			path: "/projects/:id",
			name: "project-detail",
			component: ProjectDetailView,
		},
		{
			path: "/projects/:id/canvas",
			name: "canvas",
			component: CanvasView,
		},
		{
			path: "/settings",
			name: "settings",
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import("../views/AboutView.vue"),
		},
		{
			path: "/500",
			name: "server-error",
			component: ServerErrorView,
		},
		{
			path: "/:pathMatch(.*)*",
			name: "not-found",
			component: NotFoundView,
		},
	],
});

// Aplicar el guard de autenticación a todas las rutas
router.beforeEach(authGuard);

export default router;
