<template>
    <v-row justify="center" class="px-4">
      <v-col cols="12" md="4" lg="3">
        <div class="sticky-top pt-4">
          <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" :elevation="isHovering ? 12 : 4" class="transition-swing">
              <v-img :src="cover" height="450" cover class="rounded-lg" @click="dialog = true">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-hover>
          <v-card class="mt-4 pa-4" elevation="2">
            <v-btn block color="primary" size="large" :disabled="!available" class="mb-3" @click="borrowBook">
  <v-icon start>mdi-book-open-page-variant</v-icon>
  {{ available ? 'Borrow Now' : 'Currently Unavailable' }}
</v-btn>

<v-btn 
  @click="toggleFavorite" 
  block 
  variant="outlined" 
  color="secondary"
>
  <v-icon left>{{ isFavoritExist ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
  {{ isFavoritExist ? 'Remove from Favorites' : 'Add to Favorites' }}
</v-btn>

  

          </v-card>
        </div>
      </v-col>
      <v-col cols="12" md="8" lg="7">
        <v-card class="pa-6 mt-4" elevation="2">
          <div class="d-flex flex-column flex-sm-row justify-space-between align-center mb-4">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">{{ title }}</h1>
              <div class="text-h6 text-grey-darken-1 mb-2">by {{ author }}</div>
              <v-rating v-model="rating" readonly half-increments length="5" size="small" color="amber">
                <template v-slot:item-label="props">
                  <span class="ml-2 text-subtitle-2">({{ props.value }})</span>
                </template>
              </v-rating>
            </div>
            <v-chip :color="available ? 'success' : 'error'" class="mt-2 mt-sm-0">
              {{ available ? 'Available' : 'Unavailable' }}
            </v-chip>
          </div>
          <v-tabs v-model="activeTab" color="primary" align-tabs="center" class="mb-6">
            <v-tab value="details">Details</v-tab>
          </v-tabs>
          <v-window v-model="activeTab">
            <v-window-item value="details">
              <v-card flat>
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-barcode</v-icon>
                    </template>
                    <v-list-item-title>ISBN</v-list-item-title>
                    <v-list-item-subtitle>{{ ISBN }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-calendar</v-icon>
                    </template>
                    <v-list-item-title>Published</v-list-item-title>
                    <v-list-item-subtitle>{{ useFormatDate(publishedDate) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-4"></v-divider>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-text-box</v-icon>
                    </template>
                    <v-list-item-title class="mb-2">Description</v-list-item-title>
                    <v-list-item-subtitle class="text-body-1">
                      {{ description }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
  <template v-slot:prepend>
    <v-icon color="primary">mdi-barcode</v-icon>
  </template>
  <v-list-item-title>Book Code</v-list-item-title>
  <v-list-item-subtitle>{{ kodeBuku }}</v-list-item-subtitle>
</v-list-item>
<v-list-item>
  <template v-slot:prepend>
    <v-icon color="primary">mdi-tag-multiple</v-icon>
  </template>
  <v-list-item-title>Category</v-list-item-title>
  <v-list-item-subtitle>{{ categories }}</v-list-item-subtitle>
  <v-list-item-title>Jumlah Buku</v-list-item-title>
  <v-list-item-subtitle>{{ jumlah }}</v-list-item-subtitle>
</v-list-item>

                </v-list>
              </v-card>
            </v-window-item>
            <v-window-item value="reviews">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-title @click="console.log('Hello')">
                    <v-icon start>mdi-plus</v-icon>
                    Write a Review
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-form @submit.prevent="submitReview" v-model="isFormValid">
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field v-model="newReview.user" label="Your Name"
                            :rules="[(v) => !!v || 'Name is required']"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" class="d-flex align-center">
                          <v-rating v-model="newReview.rating" half-increments length="5" size="large"
                            color="amber"></v-rating>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea v-model="newReview.comment" label="Your Review""
                            :rules="[(v) => !!v || 'Review is required']" counter rows="3"></v-textarea>
                        </v-col>
                      </v-row>
                      <v-btn type="submit" color="primary" :disabled="!isFormValid" class="mt-2">
                        Submit Review
                      </v-btn>
                    </v-form>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <!-- Reviews List -->
              <div class="mt-6">
                <template v-if="reviews.length">
                  <v-card v-for="(review, index) in reviews" :key="index" class="mb-4 pa-4" variant="outlined">
                    <div class="d-flex justify-space-between align-center mb-2">
                      <div class="font-weight-bold">{{ review.user }}</div>
                      <v-rating v-model="review.rating" readonly half-increments length="5" size="x-small"
                        color="amber"></v-rating>
                    </div>
                    <p class="mb-0 text-body-2">{{ review.comment }}</p>
                  </v-card>
                </template>
                <v-alert v-else type="info" text="Be the first to review this book!"></v-alert>
              </div>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Ini ulasan -->
    </v-row>
    <!-- <v-row>
      <v-card>
        <v-card-title>Ulasan Buku</v-card-title>
      </v-card>
    </v-row> -->
    <!-- Image Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-img :src="cover" height="800" cover></v-img>
        <v-btn icon="mdi-close" variant="text" position="absolute" location="top right" class="ma-2"
          @click="dialog = false"></v-btn>
      </v-card>
    </v-dialog>

    
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
</template>
<script setup lang="ts">
import { useRoute, useRouter, useAsyncData } from '#imports'
import type { Favorit } from '~/types'
// State
const route = useRoute()
const router = useRouter()
const dialog = ref(false)
const activeTab = ref('details')
const isFormValid = ref(false)
const isFavoritExist = ref(false)

// Snackbar
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});


// Ambil ID dari parameter URL
const bookId = route.params.id
const id = route.params.id
// Fetch data buku dari API
const { data: book, pending, error } = await useAsyncData(`book-${id}`, async () => {
  const response = await $fetch(`/api/books/${id}`)
  console.log('Fetched book data:', response) 
  return response
})
// Handle loading/error state
if (error.value) console.error('Error fetching book:', error.value)
if (pending.value) console.log('Fetching book data...')
// Data buku default
const title = computed(() => book.value?.judul || 'Unknown Title')
const author = computed(() => book.value?.pengarang || 'Unknown Author')
const ISBN = computed(() => book.value?.isbn || 'N/A')
const description = computed(() => book.value?.sinopsis || 'No description available.')
const publishedDate = computed(() => book.value?.tahun_terbit || 'Unknown')
const rating = computed(() => book.value?.rating || 0)
const available = computed(() => book.value?.available || false)
const cover = computed(() => book.value?.cover || '/default-avatar.png')
const kodeBuku = computed(() => book.value?.kode_buku || 'N/A')
const categories = computed(() => book.value?.categories?.map(cat => cat.category.name).join(', ') || 'Uncategorized')
const jumlah = computed(() => book.value?.jumlah || '0')



// Fungsi Pinjam Buku
const borrowBook = () => {
  router.push({ path: `/book/${route.params.id}/borrow` })
}

const removeToFavorites = () => {
  console.log('Remove to favorites')
}

const checkFavoriteStatus = async () => {
  try {
    const response = await $fetch(`/api/favorit/${route.params.id}`, {
      method: "GET"
    });

    isFavoritExist.value = response.exists;
  } catch (error) {
    console.error("Failed to fetch favorite status", error);
  }
};


const toggleFavorite = async () => {
  try {
    if (isFavoritExist.value) {
      // Hapus dari favorit
      await $fetch(`/api/favorit/${route.params.id}`, {
        method: "DELETE"
      });
      showSnackbar("Removed from favorites", "info");
    } else {
      // Tambah ke favorit
      await $fetch(`/api/favorit/${route.params.id}`, {
        method: "POST",
      });
      showSnackbar("Added to favorites", "success");
    }

    // Perbarui status favorit
    isFavoritExist.value = !isFavoritExist.value;
  } catch (error) {
    showSnackbar("Failed to update favorites", "error");
    // console.error(error)
    // console.log(error)
  }
};



const reviews = ref([])
const newReview = ref({ user: '', comment: '', rating: 0 })
const submitReview = () => {
  if (newReview.value.user && newReview.value.comment) {
    reviews.value.unshift({ ...newReview.value })
    newReview.value = { user: '', comment: '', rating: 0 }
    showSnackbar('Review submitted successfully!', 'success')
  }
}


function showSnackbar(text: string, color: string = "success") {
  snackbar.value = {
    show: true,
    text,
    color,
  };
}

  

onMounted(() => {
  checkFavoriteStatus()
})
</script>
<style scoped>
.sticky-top {
  position: sticky;
  top: 24px;
}
@media (max-width: 960px) {
  .sticky-top {
    position: relative;
    top: 0;
  }
}
</style>