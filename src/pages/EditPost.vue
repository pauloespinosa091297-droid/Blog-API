<template>
    <div class="container py-4" style="max-width: 650px;">

        <RouterLink :to="`/posts/${route.params.id}`" class="btn btn-sm btn-outline-secondary mb-4">
            ← Back to Post
        </RouterLink>

        <h3 class="fw-bold mb-4">Edit Post</h3>

        <div class="mb-3">
            <label class="form-label">Title</label>
            <input
                type="text"
                v-model="title"
                class="form-control"
            />
        </div>

        <div class="mb-3">
            <label class="form-label">Content</label>
            <textarea
                v-model="content"
                class="form-control"
                rows="8"
            ></textarea>
        </div>

        <div class="d-flex gap-2">
            <button @click="updatePost" class="btn btn-primary">
                Save Changes
            </button>
            <RouterLink :to="`/posts/${route.params.id}`" class="btn btn-outline-secondary">
                Cancel
            </RouterLink>
        </div>

        <p v-if="error" class="text-danger mt-3">{{ error }}</p>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import api from '../api'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const title = ref('')
const content = ref('')
const error = ref('')

// Load the existing post data into the form
const fetchPost = async () => {
    try {
        const res = await api.get(`/posts/${route.params.id}`)
        title.value = res.data.title
        content.value = res.data.content
    } catch (err) {
        error.value = 'Failed to load post'
    }
}

const updatePost = async () => {
    error.value = ''

    if (!title.value.trim() || !content.value.trim()) {
        error.value = 'Title and content are required'
        return
    }

    try {
        await api.patch(`/posts/${route.params.id}`, { title: title.value, content: content.value })
        router.push(`/posts/${route.params.id}`)
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to update post'
    }
}

onMounted(() => {
    if (!userStore.isAuthenticated()) {
        router.push('/login')
    } else {
        fetchPost()
    }
})
</script>
