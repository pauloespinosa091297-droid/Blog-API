<template>
    <div class="container py-4">

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold mb-0">Admin Dashboard</h3>
            <RouterLink to="/" class="btn btn-sm btn-outline-secondary">
                ← Back to Blog
            </RouterLink>
        </div>

        <!-- All Posts -->
        <div class="mb-5">
            <h5 class="mb-3">All Posts ({{ posts.length }})</h5>

            <div v-if="posts.length === 0" class="text-muted">No posts found.</div>

            <div v-for="post in posts" :key="post._id" class="card mb-2">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{{ post.title }}</strong>
                        <span class="text-muted small ms-2">by {{ post.author?.username }}</span>
                    </div>
                    <button @click="deletePost(post._id)" class="btn btn-danger btn-sm">
                        Delete
                    </button>
                </div>
            </div>
        </div>

        <!-- All Comments -->
        <div>
            <h5 class="mb-3">All Comments ({{ allComments.length }})</h5>

            <div v-if="allComments.length === 0" class="text-muted">No comments found.</div>

            <div v-for="comment in allComments" :key="comment._id" class="card mb-2">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <span class="small text-muted">{{ comment.author?.username }}: </span>
                        {{ comment.content }}
                    </div>
                    <button @click="deleteComment(comment._id)" class="btn btn-danger btn-sm">
                        Delete
                    </button>
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

const router = useRouter()
const userStore = useUserStore()

const posts = ref([])
const allComments = ref([])

// Fetch all posts
const fetchPosts = async () => {
    try {
        const res = await api.get('/posts')
        posts.value = res.data
    } catch (err) {
        console.error('Failed to fetch posts:', err)
    }
}

// Fetch comments for every post
const fetchAllComments = async () => {
    try {
        const postsRes = await api.get('/posts')
        const commentPromises = postsRes.data.map(post => api.get(`/comments/${post._id}`))
        const results = await Promise.all(commentPromises)
        // Flatten all comment arrays into one
        allComments.value = results.flatMap(res => res.data)
    } catch (err) {
        console.error('Failed to fetch comments:', err)
    }
}

const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return
    try {
        await api.delete(`/posts/${id}`)
        fetchPosts()
        fetchAllComments()
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete post')
    }
}

const deleteComment = async (id) => {
    if (!confirm('Delete this comment?')) return
    try {
        await api.delete(`/comments/${id}`)
        fetchAllComments()
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete comment')
    }
}

onMounted(() => {
    // Redirect if not admin
    if (!userStore.isAdmin) {
        router.push('/')
    } else {
        fetchPosts()
        fetchAllComments()
    }
})
</script>
