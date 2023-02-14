import { createRouter, createWebHistory } from 'vue-router'
// import { inject } from 'vue'
// import { createApp } from 'vue'
// import App from '../App.vue'

// const app = createApp(App)

// const Vue3GoogleOauth = app.

// const Vue3GoogleOauth = inject('Vue3GoogleOauth');

const routes = [
    {
        path: '/',
        name: 'homePage',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/book',
        name: 'bookPage',
        component: () => import('../views/Book.vue'),
    },
    {
        path: '/profile',
        name: 'profilePage',
        component: () => import('../views/Profile.vue')
    },
    {
        path: '/history',
        name: 'historyPage',
        component: () => import('../views/History.vue')
    },
    {
        path: '/searchbook',
        name: 'SearchBookPage',
        component: () => import('../views/SearchBook.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router