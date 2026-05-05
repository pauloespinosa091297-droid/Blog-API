<template>
    <div class="container py-4" style="max-width: 750px;">

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold mb-0">Blog Posts</h2>
            <div class="d-flex gap-2">
                <RouterLink v-if="userStore.isAuthenticated()" to="/create" class="btn btn-success btn-sm">
                    + New Post
                </RouterLink>
                <RouterLink v-if="userStore.isAdmin" to="/admin" class="btn btn-warning btn-sm">
                    Admin
                </RouterLink>
                <button v-if="userStore.isAuthenticated()" @click="logout" class="btn btn-outline-danger btn-sm">
                    Logout
                </button>
                <RouterLink v-else to="/login" class="btn btn-primary btn-sm">
                    Login
                </RouterLink>
            </div>
        </div>

        <!-- Loading spinner -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="posts.length === 0" class="text-center py-5 text-muted">
            <p>No posts yet. Be the first to write one!</p>
        </div>

        <!-- Post list -->
        <div v-else>
            <div v-for="post in posts" :key="post._id" class="card mb-3 shadow-sm">
                <div class="card-body">
                    <PostCard :post="post" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '../api'
import { useUserStore } from '../stores/user'
import PostCard from '../components/PostCard.vue'

const router = useRouter()
const userStore = useUserStore()

const posts = ref([])
const isLoading = ref(false)

const fetchPosts = async () => {
    isLoading.value = true
    try {
        const res = await api.get('/posts')
        posts.value = res.data
    } catch (err) {
        console.error('Failed to fetch posts:', err)
    }
    isLoading.value = false
}

const logout = () => {
    userStore.clearToken()
    router.push('/login')
}

onMounted(() => {
    fetchPosts()
})
</script>
