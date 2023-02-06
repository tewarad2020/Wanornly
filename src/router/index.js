import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'homePage',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/book',
        name: 'bookPage',
        component: () => import('../views/Book.vue')
    },
    {
        path: '/profile',
        name: 'profilePage',
        component: () => import('../views/Profile.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router