import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import PostDetail from '../pages/PostDetail.vue'
import CreatePost from '../pages/CreatePost.vue'
import EditPost from '../pages/EditPost.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/posts/:id', name: 'PostDetail', component: PostDetail },
    { path: '/create', name: 'CreatePost', component: CreatePost, meta: { requiresAuth: true } },
    { path: '/edit/:id', name: 'EditPost', component: EditPost, meta: { requiresAuth: true } },
    { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAdmin: true } }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
