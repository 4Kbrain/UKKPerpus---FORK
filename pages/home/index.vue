<template>
  <div class="home-page">
    <!-- Hero Section -->
    <v-parallax
      src="/default-avatar.png"
      height="400"
      class="mb-8"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-center px-4">
        <h1 class="text-h2 font-weight-bold text-white mb-4 text-shadow-lg">
    Perpustakaan
  </h1>
  <h2 class="text-h5 font-weight-regular text-white mb-6 text-shadow-md">
    Temukan ribuan buku dari berbagai kategori
  </h2>
        
        <v-sheet
  elevation="0"
  rounded
  width="100%"
  max-width="600"
  class="pa-4 bg-transparent"
>
  <v-row no-gutters>
    <v-col cols="10">
      <v-text-field
        v-model="searchQuery"
        variant="outlined"
        placeholder="Cari judul, pengarang, atau kategori..."
        prepend-inner-icon="mdi-magnify"
        density="comfortable"
        hide-details
        rounded
        bg-color="white"
        color="primary"
        class="search-field"
        @keypress.enter="handleSearch"
      ></v-text-field>
    </v-col>
    <v-col cols="2" class="pl-2">
      <v-btn
        color="primary"
        height="46"
        block
        rounded="lg"
        @click="handleSearch"
      >
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</v-sheet>
      </div>
    </v-parallax>

    <v-container>
      <!-- Statistik -->
      <v-row class="mb-10">
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card text-center pa-4" elevation="2">
            <v-icon size="48" color="primary" class="mb-2">mdi-bookshelf</v-icon>
            <h3 class="text-h4 font-weight-bold">{{ totalBook }}</h3>
            <p class="text-subtitle-1">Total Koleksi</p>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card text-center pa-4" elevation="2">
            <v-icon size="48" color="success" class="mb-2">mdi-account-group</v-icon>
            <h3 class="text-h4 font-weight-bold">2</h3>
            <p class="text-subtitle-1">Anggota Aktif</p>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card text-center pa-4" elevation="2">
            <v-icon size="48" color="info" class="mb-2">mdi-book-open-page-variant</v-icon>
            <h3 class="text-h4 font-weight-bold">{{ totalBukuDipinjam }}</h3>
            <p class="text-subtitle-1">Buku Dipinjam</p>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card text-center pa-4" elevation="2">
            <v-icon size="48" color="warning" class="mb-2">mdi-shape</v-icon>
            <h3 class="text-h4 font-weight-bold">{{ totalCategory }}</h3>
            <p class="text-subtitle-1">Kategori Buku</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Kategori Populer -->
      <!-- <h2 class="text-h4 font-weight-bold mb-6">Kategori Populer</h2>
      <v-row class="mb-12">
        <v-col v-for="(category, index) in popularCategories" :key="index" cols="6" sm="4" md="3" lg="2">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 6 : 2"
              @click="navigateToCategory(category.slug)"
              class="category-card d-flex flex-column align-center pa-4 text-center"
              :class="{ 'on-hover': isHovering }"
              height="120"
            >
              <v-icon
                :color="category.color"
                size="36"
                class="mb-2"
              >
                {{ category.icon }}
              </v-icon>
              <div class="text-subtitle-1 font-weight-medium">{{ category.name }}</div>
              <div class="text-caption text-grey">{{ category.count }} buku</div>
            </v-card>
          </v-hover>
        </v-col>
      </v-row> -->

      <!-- Buku Terbaru -->
      <div class="d-flex justify-space-between align-center mb-6">
        <h2 class="text-h4 font-weight-bold">Buku Terbaru</h2>
        <v-btn
          variant="text"
          color="primary"
          @click="navigateToCatalog"
          class="text-none"
        >
          Lihat Semua <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <div v-if="loading" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <v-row v-else>
        <v-col v-for="(book, index) in latestBooks" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 8 : 2"
              @click="navigateToBookDetail(book.id, book.judul)"
              class="book-card h-100"
              :class="{ 'on-hover': isHovering }"
            >
              <div class="book-cover-wrapper">
                <v-img
                  :src="book.cover || '/default-avatar.png'"
                  height="200"
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
              
              <v-card-title class="text-truncate pt-3">{{ book.judul as string }}</v-card-title>
              <v-card-subtitle>{{ book.pengarang }}</v-card-subtitle>
              
              <v-card-text>
                <v-row dense>
                  <v-col cols="6">
                    <div class="text-caption text-grey">Penerbit</div>
                    <div class="text-body-2 text-truncate">{{ book.penerbit }}</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-caption text-grey">Tahun</div>
                    <div class="text-body-2">{{ useFormatDate(book.tahun) }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>


      <!-- Jadwal & Info -->
      <v-row class="mt-12">
        <v-col cols="12" md="6">
          <v-card class="pa-4" elevation="2">
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" size="28" class="mr-2">mdi-clock</v-icon>
              <h3 class="text-h5 font-weight-bold">Jam Operasional</h3>
            </div>
            <v-list>
              <v-list-item v-for="(schedule, i) in operationalHours" :key="i">
                <v-list-item-title>{{ schedule.day }}</v-list-item-title>
                <v-list-item-subtitle>{{ schedule.hours }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-4" elevation="2">
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" size="28" class="mr-2">mdi-information</v-icon>
              <h3 class="text-h5 font-weight-bold">Informasi Perpustakaan</h3>
            </div>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="grey">mdi-map-marker</v-icon>
                </template>
                <v-list-item-title>Alamat</v-list-item-title>
                <v-list-item-subtitle>Jl. Parangtritis, Ngireng-ireng, Panggungharjo,
                  Kec. Sewon, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55188</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="grey">mdi-phone</v-icon>
                </template>
                <v-list-item-title>Telepon</v-list-item-title>
                <v-list-item-subtitle>(021) 1234-5678</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="grey">mdi-email</v-icon>
                </template>
                <v-list-item-title>Email</v-list-item-title>
                <v-list-item-subtitle>ineffable@qualia.flux</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const loading = ref(false)
const router = useRouter()

const operationalHours = ref([])

const totalBook = ref(0)
const totalCategory = ref(0)
const totalBukuDipinjam = ref(0)
const popularCategories = ref([])
const latestBooks = ref([])
const popularBooks = ref([])

const fetchOperationalHours = async () => {
  try {
    const res = await fetch('/api/settings/operational-hours')
    const data = await res.json()
    operationalHours.value = data.operationalHours
  } catch (error) {
    console.error('Error fetching operational hours:', error)
  }
}

const fetchTotalData = async () => {
  try {
    // Ambil total kategori
    const categoryRes = await fetch('/api/categories/count')
    const categoryData = await categoryRes.json()
    totalCategory.value = categoryData.total

    // Ambil total buku yang sedang dipinjam
    const borrowedRes = await fetch('/api/books/borrowed-count')
    const borrowedData = await borrowedRes.json()
    totalBukuDipinjam.value = borrowedData.total
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    // Fetch total books count
    const totalResponse = await fetch('/api/books/count')
    const totalData = await totalResponse.json()
    totalBook.value = totalData.total

    // TODO: Fetch popular categories
    // const categoriesResponse = await fetch('/api/categories/popular')
    // popularCategories.value = await categoriesResponse.json()

    // Fetch latest books
    const latestResponse = await fetch('/api/books/latest')
    latestBooks.value = await latestResponse.json()

    // Fetch popular books
    const popularResponse = await fetch('/api/books/popular')
    popularBooks.value = await popularResponse.json()
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const chunkedPopularBooks = computed(() => {
  const result = []
  const itemsPerSlide = 4
  for (let i = 0; i < popularBooks.value.length; i += itemsPerSlide) {
    result.push(popularBooks.value.slice(i, i + itemsPerSlide))
  }
  return result
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/katalog', query: { search: searchQuery.value } })
  }
}

const navigateToCategory = (slug: string) => router.push(`/category/${slug}`)
const navigateToCatalog = () => router.push('/katalog')
const navigateToBookDetail = (id: string, title: string) => {
  const formattedTitle = title.replace(/\s+/g, '-').toLowerCase()
  router.push(`/book/${id}/${formattedTitle}`)
}

const getStatusColor = (status: string) => {
  if (!status) return 'grey'
  const statusLower = status.toLowerCase()
  return statusLower.includes('tersedia') ? 'success' : statusLower.includes('dipinjam') ? 'error' : 'info'
}

onMounted(() => {
  fetchData()
  fetchTotalData()
  fetchOperationalHours()
})
</script>

<style scoped>
.home-page {
  padding-bottom: 2rem;
}

.header-container {
  position: relative;
  z-index: 1;
}

.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.text-shadow-md {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.search-container {
  position: relative;
  z-index: 2;
}

.search-field {
  transition: all 0.3s ease;
}

.search-field:hover, .search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2) !important;
}

.search-btn {
  transition: all 0.3s ease;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.search-field {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.category-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.category-card.on-hover {
  transform: translateY(-5px);
}

.book-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 12px;
  overflow: hidden;
}

.book-card.on-hover {
  transform: translateY(-5px);
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
}

.popular-book-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.popular-book-card:hover {
  transform: translateY(-5px);
}

@media (max-width: 600px) {
  .text-h2 {
    font-size: 2rem !important;
  }
  
  .text-h4 {
    font-size: 1.5rem !important;
  }
}
</style>