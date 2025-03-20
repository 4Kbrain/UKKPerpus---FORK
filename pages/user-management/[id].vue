<script setup lang="ts">
definePageMeta({
    layout: "admin",
    allowedRoles: ['ADMINISTRATOR'] as const
})
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const userId = route.params.id as string

const user = ref({
  fullname: '',
  email: '',
  username: '',
  phone: '',
  gender: '',
  role: '',
  photo: '',
  address: '',
  is_verify: false,
  is_active: false,
  nik: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

// Fetch user data
const fetchUser = async () => {
  try {
    loading.value = true
    user.value = await $fetch(`/api/users/${userId}`)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Update user data
const updateUser = async () => {
  try {
    loading.value = true
    await $fetch(`/api/users/${userId}`, {
      method: 'PUT',
      body: user.value
    })
    alert('User updated successfully!')
    router.push('/user-management')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchUser)
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold">Edit User</h1>

    <p v-if="loading">Loading...</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>

    <form v-if="user" @submit.prevent="updateUser" class="space-y-4">
      <div>
        <label class="block font-semibold">Full Name</label>
        <v-text-field v-model="user.fullname" type="text" variant="outlined" class="w-full" />
      </div>

      <div>
        <label class="block font-semibold">Email</label>
        <v-text-field v-model="user.email" type="email" variant="outlined" class="w-full" />
      </div>

      <div>
        <label class="block font-semibold">Username</label>
        <v-text-field v-model="user.username" type="text" variant="outlined" class="w-full" />
      </div>

      <div>
        <label class="block font-semibold">Phone</label>
        <v-text-field v-model="user.phone" type="text" variant="outlined" class="w-full" />
      </div>

      <div>
        <label class="block font-semibold">Gender</label>
        <v-select v-model="user.gender" :items="['Male', 'Female']" variant="outlined" class="w-full" />
      </div>

      <div>
        <label class="block font-semibold">Role</label>
        <v-select v-model="user.role" :items="['ADMIN', 'PEMINJAM']" variant="outlined" class="w-full" />
      </div>

      <div>
        <label class="block font-semibold">Address</label>
        <v-text-field v-model="user.address" type="text" variant="outlined" class="w-full" />
      </div>

      <div>
        <label class="block font-semibold">NIK</label>
        <v-text-field v-model="user.nik" type="text" variant="outlined" class="w-full" />
      </div>

      <div>
        <label class="block font-semibold">Photo URL</label>
        <v-text-field v-model="user.photo" type="text" variant="outlined" class="w-full" />
      </div>

      <div>
        <label class="block font-semibold">Verified</label>
        <v-switch v-model="user.is_verify" label="Verified" />
      </div>

      <div>
        <label class="block font-semibold">Active</label>
        <v-switch v-model="user.is_active" label="Active" />
      </div>

      <v-btn type="submit" :disabled="loading" color="primary" block>
        Save Changes
      </v-btn>
    </form>
  </div>
</template>
