<template>
  <v-container>
    <v-card>
      <div class="d-flex justify-start px-2 pt-2">
        <v-btn
          variant="text"
          @click.stop="router.push('/book-management')"
          icon="mdi-chevron-left"
        />
        <v-card-title>Tambah Buku</v-card-title>
      </div>

      <v-divider />
      <v-form @submit.prevent="handleSubmit" class="ma-4">
        <v-text-field
          v-model="form.isbn"
          label="ISBN"
          variant="outlined"
          prepend-inner-icon="mdi-barcode"
          clearable
        />
        <v-text-field
          v-model="form.edisi"
          label="Edisi"
          variant="outlined"
          prepend-inner-icon="mdi-update"
          clearable
        />

        <v-text-field
          v-model="form.judul"
          label="Judul Buku"
          variant="outlined"
          prepend-inner-icon="mdi-book"
          required
        />
        <v-textarea
          v-model="form.sinopsis"
          label="Sinopsis"
          variant="outlined"
          prepend-inner-icon="mdi-text"
          clearable
          auto-grow
        />
        <v-text-field
          v-model="form.kode_buku"
          label="Kode Buku"
          variant="outlined"
          prepend-inner-icon="mdi-barcode"
          required
        />
        <v-text-field
          v-model="form.pengarang"
          label="Pengarang"
          variant="outlined"
          prepend-inner-icon="mdi-account"
          required
        />
        <v-text-field
          v-model="form.penerbit"
          label="Penerbit"
          variant="outlined"
          prepend-inner-icon="mdi-office-building"
          required
        />

        <v-autocomplete
          v-model="form.categories"
          label="Kategori"
          variant="outlined"
          :items="bookCategory.map(item => ({ title: item.name, value: item.id }))"
          multiple
          chips
          clearable
        >
        </v-autocomplete>

        <v-text-field
          v-model="form.tahun_terbit"
          label="Tahun Terbit"
          type="date"
          variant="outlined"
          :max="maxDate"
          required
        />
        <v-text-field
          v-model.number="form.jumlah"
          label="Jumlah Buku"
          type="number"
          variant="outlined"
          required
        />

        <!-- Doesn't support file upload yet -->
        <v-text-field
          v-model="form.cover"
          label="Cover Buku"
          variant="outlined"
          prepend-icon="mdi-upload"
          required
        />

        <div class="d-flex mt-4 justify-end">
          <v-btn :disabled="isLoading" color="primary" type="submit">Tambah</v-btn>
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

import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()
const maxDate = dayjs().format('YYYY-MM-DD')
const bookCategory = ref<{ name: string; id: string }[]>([])
const isLoading = ref(false)
const form = reactive({
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

// Fungsi untuk generate kode buku berdasarkan kategori
function generateBookCode(): string {
  if (!form.categories.length || !bookCategory.value.length) {
    return 'BOK-' + Math.floor(Math.random() * 1000) // Default jika tidak ada kategori
  }

  // Ambil kategori pertama yang dipilih
  const selectedCategory = bookCategory.value.find(cat => cat.id === form.categories[0])
  
  if (!selectedCategory) {
    return 'BOK-' + Math.floor(Math.random() * 1000) // Jaga-jaga kalau kategori tidak ditemukan
  }

  // Ambil tiga huruf pertama dari kategori (uppercase)
  const categoryPrefix = selectedCategory.name.substring(0, 3).toUpperCase()

  return `${categoryPrefix}-${Math.floor(Math.random() * 1000)}`
}

// Fungsi untuk memastikan kode buku unik
async function generateUniqueBookCode(): Promise<string> {
  let newCode: string
  let isUnique = false

  while (!isUnique) {
    newCode = generateBookCode()

    // Cek apakah kode sudah ada di database
    const existingBook = await $fetch('/api/books/checkBookCode', {
      method: 'POST',
      body: { kode_buku: newCode }
    })

    if (!existingBook.exists) {
      isUnique = true
    }
  }

  return newCode
}

// Watcher untuk update kode buku saat kategori berubah
watch(() => form.categories, async () => {
  form.kode_buku = await generateUniqueBookCode()
})

async function handleSubmit() {
  isLoading.value = true
  try {
    // Memastikan kode buku unik sebelum dikirim ke server :)
    form.kode_buku = await generateUniqueBookCode() 

    await $fetch('/api/createBook', {
      method: 'POST',
      body: {
        ...form,
        // Convert categories ke array id
        categories: form.categories.map(id => id) 
      }
    })

    router.push('/book-management')
  } catch (error) {
    console.error('Gagal menambah buku:', error)
  } finally {
    isLoading.value = false
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

onMounted(async () => {
  await getCategories()
  // Set kode buku saat halaman pertama kali dimuat
  form.kode_buku = await generateUniqueBookCode()
})
</script>
