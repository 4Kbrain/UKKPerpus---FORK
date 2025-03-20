<template>
    <v-container>
      <!-- Pencarian -->
      <v-card class="mb-6 pa-4 rounded-lg elevation-2">
        <v-row align="center" no-gutters>
          <v-col cols="12" md="10" class="pr-md-2">
            <v-text-field
              v-model="searchQuery"
              placeholder="Cari judul, pengarang, penerbit..."
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              hide-details
              rounded
              clearable
              color="primary"
              bg-color="grey-lighten-4"
              class="search-field"
              @keyup.enter="fetchBooks"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2" class="mt-2 mt-md-0">
            <v-btn 
              block 
              color="primary" 
              @click="fetchBooks"
              elevation="2"
              class="rounded-lg text-uppercase font-weight-medium"
              height="48"
            >
              <v-icon left class="mr-1">mdi-book-search</v-icon>
              Cari
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
  
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-4">
        <h1 class="text-h5 font-weight-bold">Katalog Buku</h1>
        <v-chip color="primary" variant="outlined">
          {{ books.length }} buku ditemukan
        </v-chip>
      </div>
  
      <!-- Loading State -->
      <v-row v-if="loading">
        <v-col cols="12" class="text-center py-16">
          <v-progress-circular indeterminate color="primary" size="64" width="4"></v-progress-circular>
          <div class="mt-4 text-body-1">Memuat katalog buku...</div>
        </v-col>
      </v-row>
  
      <!-- Error State -->
      <v-row v-else-if="error">
        <v-col cols="12">
          <v-alert
            type="error"
            variant="tonal"
            border="start"
            closable
            class="mb-6"
          >
            <div class="d-flex align-center">
              <v-avatar color="error" class="mr-3">
                <v-icon>mdi-alert-circle</v-icon>
              </v-avatar>
              <div>
                <div class="text-h6">Gagal memuat data</div>
                <div>{{ error }}</div>
                <v-btn color="error" variant="text" class="mt-2 px-0" @click="fetchBooks">
                  <v-icon left>mdi-refresh</v-icon> Coba lagi
                </v-btn>
              </div>
            </div>
          </v-alert>
        </v-col>
      </v-row>
  
      <!-- Empty State -->
      <v-row v-else-if="books.length === 0">
        <v-col cols="12" class="text-center py-16">
          <v-icon size="64" color="grey-lighten-1">mdi-book-off</v-icon>
          <h3 class="text-h5 mt-4">Tidak ada buku ditemukan</h3>
          <p class="text-body-1 mt-2 mb-4">Coba gunakan kata kunci pencarian yang berbeda</p>
          <v-btn color="primary" @click="resetSearch">Lihat semua buku</v-btn>
        </v-col>
      </v-row>
  
      <!-- Daftar Buku -->
      <v-row v-else>
        <v-col v-for="book in books" :key="book.id" cols="12" sm="6" md="4" lg="3">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 8 : 2"
              class="book-card h-100 rounded-lg overflow-hidden"
              @click="goToBookDetail(book.id, book.judul)"
            >
              <div class="book-cover-wrapper">
                <v-img
                  :src="book.cover || '/default-avatar.png'"
                  height="200px"
                  cover
                  class="book-cover"
                  :class="{ 'scale-up': isHovering }"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height bg-grey-lighten-2">
                      <v-icon size="48" color="grey">mdi-book-variant</v-icon>
                    </div>
                  </template>
                  
                  <v-chip
                    class="ma-2 status-chip"
                    :color="getStatusColor(book.status)"
                    text-color="white"
                    size="small"
                  >
                    {{ book.status }}
                  </v-chip>
                </v-img>
              </div>
              
              <v-card-title class="book-title text-truncate">{{ book.judul }}</v-card-title>
              <v-card-subtitle class="book-author pb-0">{{ book.pengarang }}</v-card-subtitle>
              
              <v-card-text>
                <v-list-item density="compact" class="px-0">
                  <template v-slot:prepend>
                    <v-icon size="small" color="grey">mdi-office-building</v-icon>
                  </template>
                  <v-list-item-subtitle class="text-truncate">{{ book.penerbit }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item density="compact" class="px-0">
                  <template v-slot:prepend>
                    <v-icon size="small" color="grey">mdi-calendar</v-icon>
                  </template>
                  <v-list-item-subtitle>{{ formatDate(book.tahun_terbit) }}</v-list-item-subtitle>
                </v-list-item>
                
                <div class="d-flex flex-wrap mt-2">
                  <v-chip
                    v-for="(category, index) in getCategories(book.categories)"
                    :key="index"
                    size="x-small"
                    class="mr-1 mb-1"
                    color="primary"
                    variant="flat"
                  >
                    {{ category }}
                  </v-chip>
                </div>
              </v-card-text>
              
              <v-divider></v-divider>
              
              <v-card-actions>
                <v-btn
                  variant="text"
                  color="primary"
                  block
                  class="text-none"
                  :ripple="false"
                >
                  Lihat Detail
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      
      <!-- Pagination -->
      <v-row v-if="books.length > 0" class="mt-6">
        <v-col cols="12" class="d-flex justify-center">
          <v-pagination
            v-model="currentPage"
            :length="Math.ceil(books.length / 12)"
            @update:model-value="changePage"
            rounded
            color="primary"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import type { Book } from '~/types'
  

  const route = useRoute()
  const books = ref<Book[]>([])
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()
  const currentPage = ref(1)
  
  const fetchBooks = async () => {
  loading.value = true
  error.value = null

  try {
    const { data } = await useFetch('/api/books', {
      query: { search: searchQuery.value }
    })

    if (data.value?.success) {
      books.value = data.value.items.map((item: any) => ({
        id: item.id,
        judul: item.judul,
        cover: item.cover,
        pengarang: item.pengarang,
        penerbit: item.penerbit,
        tahun_terbit: item.tahun_terbit,
        status: item.status,
        categories: item.categories
      }))
      currentPage.value = 1

      // 🔹 Perbarui URL dengan parameter pencarian
      router.push({ path: '/katalog', query: { search: searchQuery.value } })
    } else {
      throw new Error('Gagal mengambil data buku')
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
  
  const formatDate = (date: string) => {
    if (!date) return 'Tidak tersedia'
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const goToBookDetail = (id: string, judul: string) => {
    const formattedTitle = judul.replace(/\s+/g, '-').toLowerCase()
    router.push(`/book/${id}/${formattedTitle}`)
  }
  
  const getStatusColor = (status: string) => {
    if (!status) return 'grey'
    const statusLower = status.toLowerCase()
    if (statusLower.includes('tersedia')) return 'success'
    if (statusLower.includes('dipinjam')) return 'error'
    return 'info'
  }
  
  const getCategories = (categories: string | string[]) => {
    if (!categories) return []
    if (typeof categories === 'string') {
      return categories.split(',').map(cat => cat.trim()).filter(Boolean)
    }
    return categories
  }
  
  const resetSearch = () => {
    searchQuery.value = ''
    fetchBooks()
  }
  
  const changePage = (page: number) => {
    // Implementasi untuk pagination
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  // Fetch books saat halaman dimuat
  fetchBooks()

  watch(() => route.query.search, (newSearch) => {
  if (newSearch !== searchQuery.value) {
    searchQuery.value = String(newSearch || '')
    fetchBooks()
  }
})

  onMounted(() => {
    if (route.query.search) {
    searchQuery.value = String(route.query.search)
    fetchBooks()
  }
  })
  </script>
  
  <style scoped>
  .book-card {
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    height: 100%;
  }
  
  .book-cover-wrapper {
    position: relative;
    overflow: hidden;
  }
  
  .book-cover {
    transition: transform 0.4s ease;
  }
  
  .book-cover.scale-up {
    transform: scale(1.05);
  }
  
  .status-chip {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  
  .book-title {
    font-weight: 600;
    line-height: 1.3;
    font-size: 18px;
  }
  
  .book-author {
    font-style: italic;
  }
  
  .search-field {
    transition: all 0.3s ease;
  }
  
  .search-field:focus-within {
    transform: translateY(-2px);
  }
  
  @media (max-width: 600px) {
    .book-title {
      font-size: 16px;
    }
  }
  </style>