<template>
    <div>
        <h5 class="fw-bold mb-1">{{ post.title }}</h5>
        <p class="text-muted small mb-2">
            By {{ post.author?.username }} · {{ formatDate(post.createdAt) }}
        </p>
        <!-- Show only the first 150 characters as a preview -->
        <p class="mb-2">{{ post.content.substring(0, 150) }}{{ post.content.length > 150 ? '...' : '' }}</p>
        <RouterLink :to="`/posts/${post._id}`" class="btn btn-sm btn-outline-primary">
            Read More
        </RouterLink>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    })
}
</script>
