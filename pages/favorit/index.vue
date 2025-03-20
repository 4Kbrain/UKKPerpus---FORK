<template>
    <v-container fluid class="pa-4">
      <v-card class="rounded-xl elevation-5 overflow-hidden border">
        <v-toolbar flat color="primary" dark class="px-4">
          <v-icon size="28" class="mr-2">mdi-book-open-page-variant</v-icon>
          <span class="text-h5 font-weight-bold">Daftar Favorit Buku</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" @click="fetchFavorit">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <!-- <v-btn icon variant="text">
            <v-icon>mdi-tune</v-icon>
          </v-btn> -->
        </v-toolbar>
  
        <v-card-text v-if="favorit.length" class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Cari judul buku..."
                variant="outlined"
                density="compact"
                hide-details
                class="mb-4"
                bg-color="grey-lighten-4"
              ></v-text-field>
            </v-col>
          </v-row>
  
          <v-row>
            <v-col
              v-for="item in filteredFavorit"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                class="book-card rounded-xl"
                elevation="2"
                @click="goToBookDetail(item.book.id, item.book.judul)"
              >
                <div class="position-relative">
                  <v-img
                    :src="item.book.cover"
                    height="200"
                    cover
                    class="rounded-t-xl"
                  ></v-img>
                </div>
  
                <v-card-item>
                  <v-card-title
                    class="text-wrap text-subtitle-1 font-weight-bold pb-1"
                  >
                    {{ truncateText(item.book.judul, 40) }}
                  </v-card-title>
                </v-card-item>
  
                <v-divider></v-divider>
  
                <v-card-actions>
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    prepend-icon="mdi-eye"
                  >
                    Detail
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
  
          <v-pagination
            v-if="filteredFavorit.length > itemsPerPage"
            v-model="page"
            :length="Math.ceil(filteredFavorit.length / itemsPerPage)"
            class="mt-4"
            rounded
          ></v-pagination>
        </v-card-text>
  
        <v-card-text v-else class="pa-8">
          <div class="d-flex flex-column align-center">
            <v-icon size="64" color="grey-lighten-1" class="mb-4"
              >mdi-bookshelf</v-icon
            >
            <div class="text-h6 text-grey-darken-1 text-center mb-2">
              Belum Ada Buku yang Dipinjam
            </div>
            <div class="text-body-2 text-grey text-center mb-6">
              Jelajahi perpustakaan untuk menemukan buku yang ingin Anda pinjam.
            </div>
            <v-btn color="primary" prepend-icon="mdi-book-search" to="/browse">
              Jelajahi Katalog Buku
            </v-btn>
          </div>
        </v-card-text>
      </v-card>


      <!-- Snackbar Notifikasi -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
        location="top"
      >
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn
            variant="text"
            icon="mdi-close"
            @click="snackbar.show = false"
          ></v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import type { Favorit } from "@/types";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const favorit = ref<Favorit[]>([]);
  const search = ref("");
  const page = ref(1);
  const itemsPerPage = 8;
  
  
  // Snackbar
  const snackbar = ref({
    show: false,
    text: "",
    color: "success",
  });
  
  // Filter berdasarkan judul buku
  const filteredFavorit = computed(() => {
    if (!search.value) return favorit.value;
    return favorit.value.filter((item) =>
      item.book.judul.toLowerCase().includes(search.value.toLowerCase())
    );
  });
  
  // Pagination berdasarkan 8 item per halaman
  const paginatedFavorit = computed(() => {
    const start = (page.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredFavorit.value.slice(start, end);
  });
  
  async function fetchFavorit() {
  try {
    const response = await $fetch<Favorit[]>("/api/favorit");
    favorit.value = response; 
    console.log(favorit.value, "Updated Favorit Data");
  } catch (error) {
    console.error("Error fetching Favorit:", error);
    showSnackbar("Gagal memuat data Favorit", "error");
  }
}

  
  
  // Format tanggal dalam bahasa Indonesia
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  // Warna status favorit dengan warna yang lebih menarik
  function getStatusColor(status: string) {
    switch (status) {
      case "DIPINJAM":
        return "indigo";
      case "DIPERPANJANG":
        return "teal";
      case "DIBATALKAN":
        return "deep-orange";
      case "DIKEMBALIKAN":
        return "grey-darken-1";
      case "TERLAMBAT":
        return "red-darken-2";
      default:
        return "blue-grey";
    }
  }
  


  
  // Fungsi untuk memotong teks yang terlalu panjang
  function truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }
  
  // Fungsi untuk menampilkan snackbar
  function showSnackbar(text: string, color: string = "success") {
    snackbar.value = {
      show: true,
      text,
      color,
    };
  }
  
  const goToBookDetail = (id: string, judul: string) => {
    const formattedTitle = judul.replace(/\s+/g, '-').toLowerCase()
    router.push(`/book/${id}/${formattedTitle}`)
  }
  
  onMounted(fetchFavorit);
  </script>
  
  <style scoped>
  .book-card {
    transition: all 0.3s ease;
    height: 100%;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
  }
  
  .status-chip {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  
  .date-warning {
    transition: all 0.3s ease;
  }
  
  .date-warning.text-red {
    color: #d32f2f !important;
    font-weight: bold;
  }
  
  .border {
    border: 1px solid rgba(0, 0, 0, 0.08) !important;
  }
  </style>
  