<template>
  <h1 class="text-h4 font-weight-bold mb-4">Kelola Peminjaman</h1>

  <div class="d-flex flex-wrap align-center mb-6 gap-4">
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      label="Cari Peminjam atau Judul Buku"
      variant="outlined"
      density="compact"
      hide-details
      class="flex-grow-1 mr-4"
      style="max-width: 350px"
      @update:model-value="onSearch"
      :disabled="isLoading"
    />

    <v-select
      v-model="filterStatus"
      :items="statusOptions"
      label="Filter Status"
      variant="outlined"
      density="compact"
      hide-details
      class="max-width-250"
      style="max-width: 200px"
      :disabled="isLoading"
    />

    <v-spacer />

    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      @click="fetchLoans"
      :loading="isLoading"
      :disabled="isLoading"
    >
      Refresh
    </v-btn>
  </div>

  <v-data-table
    :headers="headers"
    :items="filteredLoans"
    :search="search"
    class="elevation-1"
    :loading="isLoading"
    loading-text="Memuat data peminjaman..."
  >
    <template v-slot:item.status="{ item }">
      <v-chip :color="getStatusColor(item.status)">
        {{ getStatusText(item.status) }}
      </v-chip>
    </template>

    <template v-slot:item.borrowedAt="{ item }">
      {{ formatDate(item.borrowedAt) }}
    </template>

    <template v-slot:item.dueDate="{ item }">
      {{ formatDate(item.dueDate) }}
    </template>

    <template v-slot:item.returnedAt="{ item }">
            <span>
              {{ useFormatDate(item.returnedAt) }}
            </span>
          </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex gap-2">
        <template v-if="item.status === 'PENDING'">
          <v-btn
            color="success"
            size="small"
            variant="outlined"
            @click="showConfirmationDialog(item, 'DISETUJUI')"
            :disabled="isProcessing || actionDisabled[item.id]"
            :loading="actionLoading[item.id]?.status === 'DISETUJUI'"
          >
            <v-icon size="small" class="mr-1">mdi-check</v-icon>
            Setujui
          </v-btn>
          <v-btn
            color="error"
            size="small"
            variant="outlined"
            @click="showConfirmationDialog(item, 'DIBATALKAN')"
            :disabled="isProcessing || actionDisabled[item.id]"
            :loading="actionLoading[item.id]?.status === 'DIBATALKAN'"
          >
            <v-icon size="small" class="mr-1">mdi-close</v-icon>
            Tolak
          </v-btn>
        </template>

        <template v-else-if="item.status === 'DIAJUKAN'">
          <v-btn
            color="info"
            size="small"
            variant="outlined"
            @click="showConfirmationDialog(item, 'DISETUJUI')"
            :disabled="isProcessing || actionDisabled[item.id]"
            :loading="actionLoading[item.id]?.status === 'DISETUJUI'"
          >
            <v-icon size="small" class="mr-1">mdi-book-check-outline</v-icon>
            Konfirmasi Pinjam
          </v-btn>
        </template>

        <template v-else-if="item.status === 'DISETUJUI'">
          <v-btn
            color="info"
            size="small"
            variant="outlined"
            @click="showConfirmationDialog(item, 'MENUNGGU_PENGAMBILAN')"
            :disabled="isProcessing || actionDisabled[item.id]"
            :loading="actionLoading[item.id]?.status === 'MENUNGGU_PENGAMBILAN'"
          >
            <v-icon size="small" class="mr-1">mdi-book-check-outline</v-icon>
            Konfirmasi Pinjam
          </v-btn>
        </template>

        <template v-else-if="item.status === 'MENUNGGU_PENGAMBILAN'">
          <v-btn
            color="info"
            size="small"
            variant="outlined"
            @click="showConfirmationDialog(item, 'DIPINJAM')"
            :disabled="isProcessing || actionDisabled[item.id]"
            :loading="actionLoading[item.id]?.status === 'DIPINJAM'"
          >
            <v-icon size="small" class="mr-1">mdi-book-check-outline</v-icon>
            Konfirmasi Pengambilan
          </v-btn>
        </template>

        <!-- <template v-else-if="item.status === 'DIPINJAM'">
          <v-btn
            color="warning"
            size="small"
            variant="outlined"
            @click="showConfirmationDialog(item, 'DIPERPANJANG')"
            :disabled="isProcessing || actionDisabled[item.id]"
            :loading="actionLoading[item.id]?.status === 'DIPERPANJANG'"
          >
            <v-icon size="small" class="mr-1">mdi-clock-plus-outline</v-icon>
            Perpanjang
          </v-btn>

          <v-btn
            color="grey-darken-1"
            size="small"
            variant="outlined"
            @click="showConfirmationDialog(item, 'DIKEMBALIKAN')"
            :disabled="isProcessing || actionDisabled[item.id]"
            :loading="actionLoading[item.id]?.status === 'DIKEMBALIKAN'"
          >
            <v-icon size="small" class="mr-1">mdi-book-arrow-left-outline</v-icon>
            Konfirmasi Kembali
          </v-btn>
        </template> -->

        <template v-else-if="item.status === 'DIPINJAM'">
          <v-btn
            color="grey-darken-1"
            size="small"
            variant="outlined"
            @click="showConfirmationDialog(item, 'DIKEMBALIKAN')"
            :disabled="isProcessing || actionDisabled[item.id]"
            :loading="actionLoading[item.id]?.status === 'DIKEMBALIKAN'"
          >
            <v-icon size="small" class="mr-1">mdi-book-arrow-left-outline</v-icon>
            Konfirmasi Kembali
          </v-btn>
        </template>
        
 

        <template v-else>
          <v-chip size="small" variant="flat" color="grey-lighten-1"> Tidak ada aksi </v-chip>
        </template>

        
      </div>
    </template>
  </v-data-table>

  <!-- Dialog Konfirmasi -->
  <v-dialog v-model="dialog.show" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-h5 pa-4">
        {{ dialog.title }}
      </v-card-title>

      <v-card-text class="pa-4">
        <p>{{ dialog.message }}</p>
        <v-divider class="my-4"></v-divider>
        <div v-if="dialog.loan" class="d-flex flex-column gap-2">
          <p><strong>Peminjam:</strong> {{ dialog.loan.user?.fullname }}</p>
          <p><strong>Buku:</strong> {{ dialog.loan.book?.judul }}</p>
          <p><strong>Status Saat Ini:</strong> {{ getStatusText(dialog.loan.status) }}</p>
          <p>
            <strong>Status Baru:</strong>
            <span class="font-weight-bold">{{
              getStatusText(dialog.newStatus as StatusPinjaman)
            }}</span>
          </p>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="dialog.show = false"
          :disabled="isProcessing"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="confirmStatusUpdate"
          :loading="isProcessing"
          :disabled="isProcessing"
        >
          Konfirmasi
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Overlay loading untuk seluruh halaman -->
  <v-overlay v-model="pageLoading" class="align-center justify-center" persistent>
    <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
  </v-overlay>

  <!-- Snackbar untuk notifikasi -->
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar.show = false"> Tutup </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

import type { Peminjaman, StatusPinjaman } from '~/types'
import dayjs from 'dayjs'

const formatDate = (date: string): string => {
  return dayjs(date).format('DD/MM/YYYY')
}

const drawer = ref(true)
const rail = ref(false)

// State untuk loading dan proses
const isLoading = ref(false) // Loading untuk tabel dan filter
const isProcessing = ref(false) // Loading untuk aksi proses konfirmasi
const pageLoading = ref(false) // Loading overlay untuk seluruh halaman
const actionLoading = ref<Record<string, { status: StatusPinjaman }>>({}) // Loading untuk tombol spesifik
const actionDisabled = ref<Record<string, boolean>>({}) // Disable semua tombol untuk item tertentu

const loans = ref<Peminjaman[]>([])
const search = ref('')
const filterStatus = ref<string>('Semua')

// Dialog state
const dialog = ref({
  show: false,
  title: '',
  message: '',
  loan: null as Peminjaman | null,
  newStatus: null as StatusPinjaman | null
})

// Snackbar state
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const statusOptions: string[] = [
  'Semua',
  'PENDING',
  'DIAJUKAN',
  'MENUNGGU_PENGAMBILAN',
  'DISETUJUI',
  'DIPINJAM',
  'DIPERPANJANG',
  'DIKEMBALIKAN',
  'DIBATALKAN'
]


const headers = [
  { title: 'Peminjam', value: 'user.fullname', key: 'user.fullname' },
  { title: 'Buku', value: 'book.judul', key: 'book.judul' },
  { title: 'Status', value: 'status', key: 'status' },
  { title: 'Tanggal Peminjaman', value: 'borrowedAt', key: 'borrowedAt' },
  { title: 'Jatuh Tempo', value: 'dueDate', key: 'dueDate' },
  { title: 'Tanggal Kembalian', value: 'returnedAt', key: 'dueDate' },
  { title: 'Aksi', value: 'actions', key: 'actions', sortable: false }
]

const statusTextMap: Record<StatusPinjaman, string> = {
  PENDING: 'Menunggu Persetujuan',
  DIAJUKAN: 'Diajukan',
  DISETUJUI: 'Disetujui',
  DIPINJAM: 'Sedang Dipinjam',
  DIPERPANJANG: 'Diperpanjang',
  DIKEMBALIKAN: 'Dikembalikan',
  DIBATALKAN: 'Dibatalkan',
  MENUNGGU_PENGAMBILAN: 'Menunggu Pengambilan',
  MENDEKATI_TANGGAL_PENGEMBALIAN: 'Mendekati Tanggal Pengembalian',
  DITOLAK: 'Ditolak',
  TERLAMBAT: 'Terlambat',
  DIBERHENTIKAN: 'Diberhentikan'
}

const statusColorMap: Record<StatusPinjaman, string> = {
  PENDING: 'warning',
  DIAJUKAN: 'orange',
  DISETUJUI: 'success',
  DIPINJAM: 'blue',
  DIPERPANJANG: 'purple',
  DIKEMBALIKAN: 'grey',
  DIBATALKAN: 'error',
  MENUNGGU_PENGAMBILAN: 'info',
  MENDEKATI_TANGGAL_PENGEMBALIAN: 'info',
  DITOLAK: 'error',
  TERLAMBAT: 'red',
  DIBERHENTIKAN: 'black'
}

const getStatusText = (status: StatusPinjaman): string => statusTextMap[status] ?? 'Tidak Diketahui'
const getStatusColor = (status: StatusPinjaman): string => statusColorMap[status] ?? 'default'

// Menangani validasi perubahan status
const isValidStatusChange = (currentStatus: StatusPinjaman, newStatus: StatusPinjaman): boolean => {
  // Daftar transisi status yang valid
  const validTransitions: Record<StatusPinjaman, StatusPinjaman[]> = {
    PENDING: ['DISETUJUI', 'DIBATALKAN'],
    DISETUJUI: ['MENUNGGU_PENGAMBILAN', 'DIBATALKAN'],
    MENUNGGU_PENGAMBILAN: ['DIPINJAM'],
    DIPINJAM: ['DIKEMBALIKAN', 'DIPERPANJANG'],
    DIPERPANJANG: ['DIKEMBALIKAN'],
    DIAJUKAN: ['DISETUJUI', 'DIBATALKAN'],
    DIKEMBALIKAN: [], // Tidak bisa diubah lagi
    DIBATALKAN: [], // Tidak bisa diubah lagi
    MENDEKATI_TANGGAL_PENGEMBALIAN: [],
    DITOLAK: [],
    TERLAMBAT: [],
    DIBERHENTIKAN: []
  }

  return validTransitions[currentStatus]?.includes(newStatus) || false
}

// Computed untuk pencarian dan filter
const filteredLoans = computed(() => {
  let result = [...loans.value]

  // Filter berdasarkan status
  if (filterStatus.value !== 'Semua') {
    result = result.filter(loan => loan.status === filterStatus.value)
  }

  // Filter berdasarkan pencarian
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(
      peminjaman =>
        peminjaman.user?.fullname?.toLowerCase().includes(searchLower) ||
        peminjaman.book?.judul?.toLowerCase().includes(searchLower)
    )
  }

  return result
})

const onSearch = () => {
  // Handler untuk pencarian real-time
  // Sudah dihandle oleh computed property filteredLoans
}

const fetchLoans = async () => {
  if (isLoading.value) return // Prevent double fetching

  isLoading.value = true
  actionDisabled.value = {} // Reset disabled status

  try {
    loans.value = await $fetch<Peminjaman[]>('/api/admin/peminjaman', {
      method: 'GET',
      params: {
        status: filterStatus.value !== 'Semua' ? filterStatus.value.toUpperCase() : undefined
      }
    })
  } catch (error) {
    console.error('Gagal mengambil data peminjaman:', error)
    showSnackbar('Gagal mengambil data peminjaman', 'error')
  } finally {
    isLoading.value = false
  }
}

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

const debouncedFetchLoans = debounce(fetchLoans, 300)

const showConfirmationDialog = (loan: Peminjaman, newStatus: StatusPinjaman) => {
  dialog.value = {
    show: true,
    loan,
    newStatus,
    title: newStatus === 'DIPERPANJANG' ? 'Konfirmasi Perpanjangan' : 'Konfirmasi Status',
    message:
      newStatus === 'DIPERPANJANG'
        ? `Apakah Anda yakin ingin memperpanjang peminjaman buku ini?`
        : `Apakah Anda yakin ingin mengubah status peminjaman ini menjadi ${getStatusText(newStatus)}?`,
  }
}


const confirmStatusUpdate = async () => {
  if (!dialog.value.loan || !dialog.value.newStatus) return

  isProcessing.value = true
  actionLoading.value[dialog.value.loan.id] = { status: dialog.value.newStatus }
  actionDisabled.value[dialog.value.loan.id] = true

  try {
    await updateLoanStatus(dialog.value.loan.id, dialog.value.newStatus)
    snackbar.value = {
      show: true,
      message: `Status berhasil diperbarui menjadi ${getStatusText(dialog.value.newStatus)}.`,
      color: 'success'
    }
    fetchLoans()
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Gagal memperbarui status. Silakan coba lagi.',
      color: 'error'
    }
  } finally {
    isProcessing.value = false
    actionLoading.value[dialog.value.loan.id] = { status: null }
    actionDisabled.value[dialog.value.loan.id] = false
    dialog.value.show = false
  }
}


const updateLoanStatus = async (id: string, status: StatusPinjaman) => {
  // Tandai tombol sebagai loading dan disabled
  actionLoading.value[id] = { status }
  actionDisabled.value[id] = true

  try {
    const response = await $fetch(`/api/admin/peminjaman/${id}`, {
      method: 'PATCH',
      body: { status }
    })

    const message = `Status peminjaman berhasil diperbarui menjadi ${statusTextMap[status]}`
    showSnackbar(message, 'success')

    // Tunggu sebentar sebelum refresh untuk menghindari race condition
    setTimeout(() => {
      fetchLoans()
    }, 500)
  } catch (error: any) {
    console.error(`Gagal memperbarui status peminjaman (${status}):`, error)

    let errorMessage = 'Gagal memperbarui status peminjaman'

    // Jika ada response error message
    if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    showSnackbar(errorMessage, 'error')
  } finally {
    // Hapus loading dan disabled setelah 1 detik
    setTimeout(() => {
      delete actionLoading.value[id]
      delete actionDisabled.value[id]
    }, 1000)
  }
}

const showSnackbar = (message: string, color: string = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Watch untuk perubahan filter dan search
watch(filterStatus, debouncedFetchLoans)

onMounted(() => {
  pageLoading.value = true
  fetchLoans().finally(() => {
    pageLoading.value = false
  })
})
</script>
