import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/jwt',
            name: 'jwt',
            component: () => import('../views/jwt.vue'),
        },
        {
            path: '/tesseract',
            name: 'tesseract',
            component: () => import('../views/tesseract.vue'),
        },
    ],
})

export default router
