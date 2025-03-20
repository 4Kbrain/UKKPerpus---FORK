<script setup lang="ts">
definePageMeta({
    layout: "admin",
    allowedRoles: ['PETUGAS'] as const
})
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const dendaId = route.params.id as string // Ensure it's a string

const denda = ref<{ id: string; amount: number; reason: string; status: string; user: { fullname: string; username: string } } | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Fetch denda data
const fetchDenda = async () => {
  try {
    loading.value = true
    denda.value = await $fetch<{ id: string; amount: number; reason: string; status: string; user: { fullname: string; username: string } }>(`/api/denda/${dendaId}`)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Update denda data
const updateDenda = async () => {
  if (!denda.value) return
  try {
    loading.value = true
    await $fetch(`/api/denda/${dendaId}`, {
      method: 'PUT',
      body: { amount: denda.value.amount, status: denda.value.status }
    })
    alert('Denda updated successfully!')
    router.push('/denda-management') // Redirect after update
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchDenda)
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold">Edit Denda</h1>

    <p v-if="loading">Loading...</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>

    <form v-if="denda" @submit.prevent="updateDenda" class="space-y-4">
      <div>
        <v-label class="block font-semibold">Nama Pengguna</v-label>
        <v-text-field v-model="denda.user.fullname" type="text" variant="outlined" class="w-full p-2 border rounded" disabled />
      </div>
      <div>
        <v-label class="block font-semibold">Username</v-label>
        <v-text-field v-model="denda.user.username" type="text" variant="outlined" class="w-full p-2 border rounded" disabled />
      </div>
      <div>
        <v-label class="block font-semibold">Jumlah Denda</v-label>
        <v-text-field v-model="denda.amount" type="number" variant="outlined" class="w-full p-2 border rounded" />
      </div>
      <div>
        <v-label class="block font-semibold">Status Denda</v-label>
        <v-select
          v-model="denda.status"
          :items="['BELUM_LUNAS', 'LUNAS']"
          variant="outlined"
          class="w-full p-2 border rounded"
        />
      </div>
      <v-btn type="submit" :disabled="loading" color="primary" block>
        Save Changes
      </v-btn>
    </form>
  </div>
</template>
