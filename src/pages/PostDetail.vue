<template>
    <div class="container py-4" style="max-width: 750px;">

        <RouterLink to="/" class="btn btn-sm btn-outline-secondary mb-4">
            ← Back to Posts
        </RouterLink>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border" role="status"></div>
        </div>

        <!-- Post content -->
        <div v-else-if="post">
            <h2 class="fw-bold">{{ post.title }}</h2>
            <p class="text-muted small">
                By <strong>{{ post.author?.username }}</strong> on {{ formatDate(post.createdAt) }}
            </p>
            <hr />
            <p style="white-space: pre-wrap;">{{ post.content }}</p>

            <!-- Show edit/delete only to the post author -->
            <div v-if="isAuthor" class="d-flex gap-2 mt-3">
                <RouterLink :to="`/edit/${post._id}`" class="btn btn-sm btn-outline-primary">
                    Edit Post
                </RouterLink>
                <button @click="deletePost" class="btn btn-sm btn-danger">
                    Delete Post
                </button>
            </div>
        </div>

        <hr class="my-4" />

        <!-- Comments section -->
        <h5>Comments ({{ comments.length }})</h5>

        <div v-if="comments.length === 0" class="text-muted mb-3">
            No comments yet.
        </div>

        <div v-for="comment in comments" :key="comment._id" class="card mb-2">
            <div class="card-body py-2">
                <CommentItem :comment="comment" />
            </div>
        </div>

        <!-- Add comment form — only for logged-in users -->
        <div v-if="userStore.isAuthenticated()" class="mt-4">
            <h6>Add a Comment</h6>
            <textarea
                v-model="newComment"
                class="form-control mb-2"
                rows="3"
                placeholder="Write your comment here..."
            ></textarea>
            <button @click="addComment" class="btn btn-primary btn-sm">
                Post Comment
            </button>
            <p v-if="commentError" class="text-danger mt-2">{{ commentError }}</p>
        </div>

        <div v-else class="mt-3">
            <p class="text-muted">
                <RouterLink to="/login">Log in</RouterLink> to leave a comment.
            </p>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import api from '../api'
import { useUserStore } from '../stores/user'
import CommentItem from '../components/CommentItem.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const post = ref(null)
const comments = ref([])
const newComment = ref('')
const commentError = ref('')
const isLoading = ref(false)

// Check if the current logged-in user is the author of this post
const isAuthor = computed(() => {
    if (!post.value || !userStore.isAuthenticated()) return false
    return post.value.author?._id === userStore.userId
})

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })
}

const fetchPost = async () => {
    isLoading.value = true
    try {
        const res = await api.get(`/posts/${route.params.id}`)
        post.value = res.data
    } catch (err) {
        console.error('Failed to fetch post:', err)
    }
    isLoading.value = false
}

const fetchComments = async () => {
    try {
        const res = await api.get(`/comments/${route.params.id}`)
        comments.value = res.data
    } catch (err) {
        console.error('Failed to fetch comments:', err)
    }
}

const addComment = async () => {
    commentError.value = ''
    if (!newComment.value.trim()) {
        commentError.value = 'Comment cannot be empty'
        return
    }
    try {
        await api.post(`/comments/${route.params.id}`, { content: newComment.value })
        newComment.value = ''
        fetchComments() // Refresh the comments list
    } catch (err) {
        commentError.value = err.response?.data?.message || 'Failed to add comment'
    }
}

const deletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
        await api.delete(`/posts/${route.params.id}`)
        router.push('/')
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete post')
    }
}

onMounted(() => {
    fetchPost()
    fetchComments()
})
</script>
