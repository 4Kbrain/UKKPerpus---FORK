<template>
  <v-container>
    <v-card>
      <div class="d-flex justify-start px-2 pt-2">
        <v-btn variant="text" @click.stop="router.push('/book-management')" icon="mdi-chevron-left" />
        <v-card-title>Edit Buku</v-card-title>
      </div>

      <v-divider />
      <v-form @submit.prevent="handleSubmit" class="ma-4">
        <v-text-field v-model="form.isbn" label="ISBN" variant="outlined" prepend-inner-icon="mdi-barcode" clearable />
        <v-text-field v-model="form.edisi" label="Edisi" variant="outlined" prepend-inner-icon="mdi-update" clearable />
        <v-text-field v-model="form.judul" label="Judul Buku" variant="outlined" prepend-inner-icon="mdi-book" required />
        <v-textarea v-model="form.sinopsis" label="Sinopsis" variant="outlined" prepend-inner-icon="mdi-text" clearable auto-grow />
        <v-text-field v-model="form.kode_buku" label="Kode Buku" variant="outlined" prepend-inner-icon="mdi-barcode" required />
        <v-text-field v-model="form.pengarang" label="Pengarang" variant="outlined" prepend-inner-icon="mdi-account" required />
        <v-text-field v-model="form.penerbit" label="Penerbit" variant="outlined" prepend-inner-icon="mdi-office-building" required />

        <v-autocomplete
          v-model="form.categories"
          label="Kategori"
          variant="outlined"
          :items="bookCategory.map(item => ({ title: item.name, value: item.id }))"
          multiple
          chips
          clearable
        />

        <v-text-field v-model="form.tahun_terbit" label="Tahun Terbit" type="date" variant="outlined" :max="maxDate" required />
        <v-text-field v-model.number="form.jumlah" label="Jumlah Buku" type="number" variant="outlined" required />
        <v-text-field v-model="form.cover" label="Cover Buku" variant="outlined" prepend-icon="mdi-upload" required />

        <div class="d-flex mt-4 justify-end">
          <v-btn :disabled="isLoading" color="primary" type="submit">Simpan Perubahan</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
  allowedRoles: ['PETUGAS'] as const
})

import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const maxDate = dayjs().format('YYYY-MM-DD')
const bookCategory = ref<{ name: string; id: string }[]>([])
const isLoading = ref(false)
const form = reactive({
  id: '',
  judul: '',
  kode_buku: '',
  pengarang: '',
  penerbit: '',
  tahun_terbit: '',
  categories: [],
  jumlah: 0,
  cover: '',
  sinopsis: '',
  isbn: '',
  edisi: ''
})

// Ambil data buku berdasarkan ID dari URL
const fetchBook = async () => {
  const bookId = route.params.id
  if (!bookId) return

  try {
    const book = await $fetch(`/api/books/${bookId}`)
    if (book) {
      form.id = book.id
      form.judul = book.judul
      form.kode_buku = book.kode_buku
      form.pengarang = book.pengarang
      form.penerbit = book.penerbit
      form.tahun_terbit = book.tahun_terbit
      form.categories = book.categories.map(cat => cat.category.id)
      form.jumlah = book.jumlah
      form.cover = book.cover
      form.sinopsis = book.sinopsis
      form.isbn = book.isbn
      form.edisi = book.edisi
    }
  } catch (error) {
    console.error('Gagal mengambil data buku:', error)
  }
}

const getCategories = async () => {
  try {
    const response = await $fetch('/api/categories', { method: 'GET' })
    bookCategory.value = response.body
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }
}

// Fungsi untuk menyimpan perubahan
const handleSubmit = async () => {
  isLoading.value = true
  try {
    await $fetch(`/api/books/${form.id}`, {
      method: 'PATCH',
      body: {
        ...form,
        categories: form.categories.map(id => id) 
      }
    })

    router.push('/book-management')
  } catch (error) {
    console.error('Gagal menyimpan perubahan:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await getCategories()
  await fetchBook() // Auto-fill data saat halaman dimuat
})
</script>
