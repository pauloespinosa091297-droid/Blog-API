<template>
    <div class="container py-4" style="max-width: 650px;">

        <RouterLink to="/" class="btn btn-sm btn-outline-secondary mb-4">
            ← Back
        </RouterLink>

        <h3 class="fw-bold mb-4">Create New Post</h3>

        <div class="mb-3">
            <label class="form-label">Title</label>
            <input
                type="text"
                v-model="title"
                class="form-control"
                placeholder="Enter post title"
            />
        </div>

        <div class="mb-3">
            <label class="form-label">Content</label>
            <textarea
                v-model="content"
                class="form-control"
                rows="8"
                placeholder="Write your post content here..."
            ></textarea>
        </div>

        <div class="d-flex gap-2">
            <button @click="createPost" class="btn btn-success">
                Publish Post
            </button>
            <RouterLink to="/" class="btn btn-outline-secondary">
                Cancel
            </RouterLink>
        </div>

        <p v-if="error" class="text-danger mt-3">{{ error }}</p>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '../api'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const title = ref('')
const content = ref('')
const error = ref('')

const createPost = async () => {
    error.value = ''

    if (!title.value.trim() || !content.value.trim()) {
        error.value = 'Title and content are required'
        return
    }

    try {
        await api.post('/posts', { title: title.value, content: content.value })
        router.push('/')
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to create post'
    }
}

// Redirect to login if not authenticated
onMounted(() => {
    if (!userStore.isAuthenticated()) {
        router.push('/login')
    }
})
</script>
