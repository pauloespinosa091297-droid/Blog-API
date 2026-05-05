<template>
    <div>
        <div class="d-flex justify-content-between align-items-start">
            <div>
                <strong class="small">{{ comment.author?.username }}</strong>
                <span class="text-muted small ms-2">{{ formatDate(comment.createdAt) }}</span>
            </div>
        </div>
        <p class="mb-0 mt-1">{{ comment.content }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    comment: {
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
