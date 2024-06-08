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
        {
            path: '/ckeditor',
            name: 'ckeditor',
            component: () => import('../views/ckeditor.vue'),
        },
        {
            path: '/id-recognition',
            name: 'id-recognition',
            component: () => import('@/views/id-recognition.vue'),
        },
    ],
})

export default router
