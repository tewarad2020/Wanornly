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
        path: '/book/:id',
        name: 'bookPage',
        component: () => import('../views/Book.vue'),
    },
    {
        path: '/ebook/:filename',
        name: 'ebookPage',
        component: () => import('../views/Ebook.vue'),
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
        component: () => import('../views/Donate.vue')
    },
    {
        path: '/cart',
        name: 'cartPage',
        component: () => import('../views/CartPage.vue')
    },
    {
        path: '/donate',
        name: 'donatePage',
        component: () => import('../views/Donate.vue')
    },
    {
        path: '/requestManager',
        name: 'requestManager',
        component: () => import('../views/BookManagement/RequestManager.vue')
    },
    {
        path: '/borrowManager',
        name: 'borrowManager',
        component: () => import('../views/BookManagement/BorrowManager.vue')
    },
    {
        path: '/offlineBorrow',
        name: 'offlineBorrow',
        component: () => import('../views/BookManagement/OfflineBorrow.vue')
    },
    {
        path: '/donateManager',
        name: 'donateManager',
        component: () => import('../views/BookManagement/DonateManager.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (localStorage.getItem('status_login') && JSON.parse(localStorage.getItem('user_info')).role === 'admin') {
        console.log('adnim')
        next()
    }else if (localStorage.getItem('status_login') && JSON.parse(localStorage.getItem('user_info')).role === 'customer'){
        console.log('to: ', to)
        console.log('customer')
        if (to.fullPath === '/' 
            || to.fullPath.includes('/book/') 
            || to.fullPath.includes('/cart')
            || to.fullPath.includes('/profile') 
            || to.fullPath.includes('/donate') 
            || to.fullPath.includes('/history')
        ){
            next()
        }
        else {
            next('/')
        }
    }else if (localStorage.getItem('status_login') === null){
        if (to.fullPath === '/' 
            || to.fullPath.includes('/book/')
        ){
            next()
        } else {
            next('/')
        }
    }
  })

export default router