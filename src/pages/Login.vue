<template>
    <div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh;">
        <div class="card p-4 shadow-sm" style="width: 100%; max-width: 420px;">

            <h4 class="mb-4 text-center fw-bold">
                {{ isRegister ? 'Create an Account' : 'Welcome Back' }}
            </h4>

            <div>
                <!-- Username field only shows on register -->
                <div v-if="isRegister" class="mb-2">
                    <input
                        type="text"
                        v-model="form.username"
                        class="form-control"
                        placeholder="Username"
                    />
                </div>

                <div class="mb-2">
                    <input
                        type="email"
                        v-model="form.email"
                        class="form-control"
                        placeholder="Email"
                    />
                </div>

                <div class="mb-3">
                    <input
                        type="password"
                        v-model="form.password"
                        class="form-control"
                        placeholder="Password (min 8 characters)"
                    />
                </div>

                <button class="btn btn-primary w-100" @click="submit">
                    {{ isRegister ? 'Register' : 'Login' }}
                </button>
            </div>

            <!-- Toggle between login and register -->
            <div class="mt-3 text-center">
                <button class="btn btn-link text-decoration-none" @click="toggleMode">
                    {{ isRegister ? 'Already have an account? Login' : "Don't have an account? Register" }}
                </button>
            </div>

            <!-- Error message -->
            <p class="text-danger text-center mt-2" v-if="error">{{ error }}</p>

            <!-- Success message -->
            <p class="text-success text-center mt-2" v-if="successMessage">{{ successMessage }}</p>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const isRegister = ref(false)
const form = ref({ username: '', email: '', password: '' })
const error = ref('')
const successMessage = ref('')

const toggleMode = () => {
    isRegister.value = !isRegister.value
    error.value = ''
    successMessage.value = ''
    form.value = { username: '', email: '', password: '' }
}

const submit = async () => {
    error.value = ''
    successMessage.value = ''

    try {
        if (isRegister.value) {
            // Register the user
            await api.post('/users/register', form.value)
            successMessage.value = 'Registered successfully! Please log in.'
            isRegister.value = false
            form.value = { username: '', email: '', password: '' }

        } else {
            // Login the user
            const res = await api.post('/users/login', form.value)

            // Save the token
            userStore.setToken(res.data.access)

            // Fetch the user profile to get isAdmin, userId, username
            const profile = await api.get('/users/details')
            userStore.setAdmin(profile.data.isAdmin)
            userStore.setUser(profile.data._id, profile.data.username)

            router.push('/')
        }

    } catch (err) {
        error.value = err.response?.data?.message || 'Something went wrong'
    }
}

// If already logged in, go to home
onMounted(() => {
    if (userStore.isAuthenticated()) {
        router.push('/')
    }
})
</script>
