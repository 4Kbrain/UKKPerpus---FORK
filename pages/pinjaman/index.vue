<template>
  <v-container fluid class="pa-4">
    <v-card class="rounded-xl elevation-5 overflow-hidden border">
      <v-toolbar flat color="primary" dark class="px-4">
        <v-icon size="28" class="mr-2">mdi-book-open-page-variant</v-icon>
        <span class="text-h5 font-weight-bold">Daftar Peminjaman Buku</span>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" @click="fetchPeminjaman">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <!-- <v-btn icon variant="text">
          <v-icon>mdi-tune</v-icon>
        </v-btn> -->
      </v-toolbar>

      <v-card-text v-if="peminjaman.length" class="pa-4">
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
            v-for="item in filteredPeminjaman"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              class="book-card rounded-xl"
              elevation="2"
              @click="goToDetail(item.id)"
            >
              <div class="position-relative">
                <v-img
                  :src="item.book.cover"
                  height="200"
                  cover
                  class="rounded-t-xl"
                ></v-img>
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                  class="status-chip"
                  variant="elevated"
                >
                  {{ item.status }}
                </v-chip>
              </div>

              <v-card-item>
                <v-card-title
                  class="text-wrap text-subtitle-1 font-weight-bold pb-1"
                >
                  {{ truncateText(item.book.judul, 40) }}
                </v-card-title>
                <v-card-subtitle class="pt-1">
                  <div class="mb-1">
                    <v-icon size="small" class="mr-1"
                      >mdi-calendar-clock</v-icon
                    >
                    <span class="text-caption"
                      >Dipinjam: {{ formatDate(item.borrowedAt) }}</span
                    >
                  </div>
                  <div
                    class="date-warning"
                    :class="{ 'text-red': isNearDueDate(item.dueDate) }"
                  >
                    <v-icon size="small" class="mr-1"
                      >mdi-calendar-alert</v-icon
                    >
                    <span class="text-caption font-weight-medium"
                      >Batas: {{ formatDate(item.dueDate) }}</span
                    >
                  </div>
                </v-card-subtitle>
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
                <v-spacer></v-spacer>
                <v-btn
                  v-if="canExtend(item.status, item.dueDate)"
                  variant="text"
                  color="secondary"
                  size="small"
                  prepend-icon="mdi-calendar-plus"
                  @click.stop="openExtendDialog(item)"
                >
                  Perpanjang
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-pagination
          v-if="filteredPeminjaman.length > itemsPerPage"
          v-model="page"
          :length="Math.ceil(filteredPeminjaman.length / itemsPerPage)"
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

    <!-- Dialog Perpanjangan Peminjaman -->
    <v-dialog v-model="extendDialog" max-width="500" persistent>
      <v-card class="rounded-lg">
        <v-toolbar color="primary" dark flat class="px-4">
          <v-toolbar-title class="font-weight-bold">
            Perpanjang Masa Peminjaman
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" @click="extendDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-5">
          <div v-if="selectedBook" class="d-flex mb-4">
            <v-img
              :src="selectedBook.book.cover"
              width="100"
              height="140"
              cover
              class="rounded-lg mr-4"
            ></v-img>
            <div>
              <div class="text-h6 font-weight-bold">
                {{ selectedBook.book.judul }}
              </div>
              <div class="text-body-2 text-grey-darken-1 mt-1">
                <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
                Dipinjam: {{ formatDate(selectedBook.borrowedAt) }}
              </div>
              <div class="text-body-2 text-grey-darken-1 mt-1">
                <v-icon size="small" class="mr-1">mdi-calendar-alert</v-icon>
                Batas pengembalian saat ini:
                {{ formatDate(selectedBook.dueDate) }}
              </div>
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <div class="text-body-1 mb-4">
            Dengan perpanjangan, batas pengembalian buku akan ditambah 7 hari
            dari tanggal saat ini.
          </div>

          <v-alert
            v-if="selectedBook && isNearDueDate(selectedBook.dueDate)"
            type="warning"
            variant="tonal"
            class="mb-4"
            density="compact"
          >
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-clock-alert-outline</v-icon>
              <div>
                <strong>Perhatian:</strong> Batas pengembalian buku Anda tinggal
                {{ getRemainingDays(selectedBook.dueDate) }} hari lagi.
              </div>
            </div>
          </v-alert>

          <v-radio-group v-model="extendPeriod" class="mb-2">
            <div class="text-subtitle-1 mb-2">Pilih periode perpanjangan:</div>
            <v-radio label="7 hari (standar)" value="7"></v-radio>
            <v-radio
              label="14 hari (memerlukan persetujuan)"
              value="14"
            ></v-radio>
          </v-radio-group>

          <div class="text-body-2 text-grey-darken-1 mb-4">
            <v-icon size="small" class="mr-1">mdi-information-outline</v-icon>
            Batas pengembalian setelah perpanjangan:
            <strong>{{ getNewDueDate() }}</strong>
          </div>

          <v-textarea
            v-model="extendReason"
            label="Alasan perpanjangan (opsional)"
            variant="outlined"
            rows="2"
            counter="100"
            placeholder="Contoh: Belum selesai membaca, masih digunakan untuk tugas, dll."
            density="comfortable"
            class="mb-2"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-btn
            color="grey-lighten-1"
            variant="text"
            @click="extendDialog = false"
          >
            Batal
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="isLoading"
            :disabled="isLoading"
            @click="submitExtension"
            prepend-icon="mdi-check"
          >
            Konfirmasi Perpanjangan
          </v-btn>
        </v-card-actions>
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
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Peminjaman } from "@/types";
import { useRouter } from "vue-router";

const router = useRouter();
const peminjaman = ref<Peminjaman[]>([]);
const search = ref("");
const page = ref(1);
const itemsPerPage = 8;

// Dialog Perpanjangan
const extendDialog = ref(false);
const selectedBook = ref<Peminjaman | null>(null);
const extendPeriod = ref("7");
const extendReason = ref("");
const isLoading = ref(false);

// Snackbar
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

// Filter berdasarkan judul buku
const filteredPeminjaman = computed(() => {
  if (!search.value) return peminjaman.value;
  return peminjaman.value.filter((item) =>
    item.book.judul.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Pagination berdasarkan 8 item per halaman
const paginatedPeminjaman = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPeminjaman.value.slice(start, end);
});

async function fetchPeminjaman() {
  try {
    const response = await $fetch<Peminjaman[]>("/api/peminjaman");

    // Filter hanya status tertentu
    peminjaman.value = response.filter(p => 
      ["DISETUJUI","DIPINJAM", "DIPERPANJANG", "DIAJUKAN", "PENDING", "MENUNGGU_PENGAMBILAN"].includes(p.status)
    );

  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    showSnackbar("Gagal memuat data peminjaman", "error");
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

// Warna status peminjaman dengan warna yang lebih menarik
function getStatusColor(status: string) {
  switch (status) {
    case "DISETUJUI":
      return "success";
    case "DIAJUKAN":
      return "warning";
    case "PENDING":
      return "info";
    case "MENUNGGU_PENGAMBILAN":
      return "info";
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

// Fungsi untuk memeriksa jika tanggal mendekati batas waktu pengembalian (3 hari)
function isNearDueDate(dueDate: string): boolean {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
}

// Fungsi untuk mendapatkan jumlah hari tersisa
function getRemainingDays(dueDate: string): number {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Fungsi untuk memperoleh tanggal baru setelah perpanjangan
function getNewDueDate(): string {
  if (!selectedBook.value) return "";

  const today = new Date();
  const days = parseInt(extendPeriod.value);
  const newDate = new Date(today);
  newDate.setDate(today.getDate() + days);

  return newDate.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Fungsi untuk memotong teks yang terlalu panjang
function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

// Cek apakah buku bisa diperpanjang
function canExtend(status: string, dueDate: string): boolean {
  if (status !== "DIPINJAM") return false; // Hanya peminjaman aktif yang bisa diperpanjang

  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 1; // Perpanjangan hanya bisa dilakukan tepat H-1 sebelum dueDate
}

// Fungsi untuk membuka dialog perpanjangan
function openExtendDialog(book: Peminjaman) {
  selectedBook.value = book;
  extendPeriod.value = "7";
  extendReason.value = "";
  extendDialog.value = true;
}

// Fungsi untuk menampilkan snackbar
function showSnackbar(text: string, color: string = "success") {
  snackbar.value = {
    show: true,
    text,
    color,
  };
}

// Fungsi untuk mengirim permintaan perpanjangan
async function submitExtension() {
  if (!selectedBook.value) return;

  isLoading.value = true;

  try {
    // Simulasi API request
    // await new Promise(resolve => setTimeout(resolve, 1000));

    await $fetch(`/api/peminjaman/${selectedBook.value.id}/perpanjang`, {
      method: "PATCH",
      body: {
        loanId: selectedBook.value.id,
        period: parseInt(extendPeriod.value),
        reason: extendReason.value,
      },
    });

    // Update UI
    const index = peminjaman.value.findIndex(
      (item) => item.id === selectedBook.value?.id
    );
    if (index !== -1) {
      // Perbarui status buku
      peminjaman.value[index].status = "DIPERPANJANG";

      // Perbarui tanggal jatuh tempo
      const today = new Date();
      const days = parseInt(extendPeriod.value);
      const newDueDate = new Date(today);
      newDueDate.setDate(today.getDate() + days);
      peminjaman.value[index].dueDate = newDueDate.toISOString();
    }

    showSnackbar("Perpanjangan berhasil diajukan");
    extendDialog.value = false;
  } catch (error) {
    console.error("Error extending book:", error);
    showSnackbar("Gagal melakukan perpanjangan", "error");
  } finally {
    isLoading.value = false;
  }
}

function goToDetail(peminjamanId: string) {
  router.push(`/pinjaman/${peminjamanId}`);
}

onMounted(fetchPeminjaman);
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
