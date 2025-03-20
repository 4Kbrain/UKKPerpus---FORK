<template>
  <v-container fluid theme="dark">
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Konfirmasi</v-card-title>
        <v-card-text>Apakah Anda yakin ingin mengajukan persetujuan peminjaman?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="confirmDialog = false">Batal</v-btn>
          <v-btn color="success" @click="submitApproval">Ya, Ajukan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="cancelDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Konfirmasi</v-card-title>
        <v-card-text>Apakah Anda yakin ingin membatalkan peminjaman?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="cancelDialog = false">Batal</v-btn>
          <v-btn color="error" @click="confirmCancel">Ya, Batalkan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row justify="center" class="px-4 fill-height">
      <v-col cols="12" md="4" lg="3">
        <div class="sticky-top pt-4">
          <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" :elevation="isHovering ? 12 : 4" class="transition-swing">
              <v-img :src="bookCover" height="450" cover class="rounded-lg" @click="dialog = true">
                <v-btn
                  @click.stop="goBack"
                  color="background"
                  class="absolute top-0 left-0 ml-0"
                  style="
                    border-right: 4px solid #1c232b;
                    border-bottom: 4px solid #1c232b;
                    background-color: #1c232b;
                    border-radius: 8px 0 12px 0;
                  "
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-hover>

          <v-card
            class="mt-4 pa-4"
            elevation="2"
            v-if="status === 'PENDING' || status === 'DIAJUKAN'"
          >
            <v-btn
              v-if="status === 'PENDING'"
              block
              color="success"
              size="large"
              class="mb-3"
              @click="confirmDialog = true"
            >
              <v-icon start>mdi-check-circle</v-icon>
              Ajukan Persetujuan
            </v-btn>

            <v-btn
              v-if="status === 'PENDING' || status === 'DIAJUKAN'"
              block
              color="error"
              variant="outlined"
              class="mb-3"
              @click="cancelDialog = true"
            >
              <v-icon start>mdi-close-circle</v-icon>
              Batalkan Peminjaman
            </v-btn>
          </v-card>
        </div>
      </v-col>

      <v-col cols="12" md="8" lg="7">
        <v-card class="pa-6 mt-4 h-full" elevation="2">
          <div class="d-flex flex-column flex-sm-row justify-space-between align-center mb-4">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">{{ title }}</h1>
            </div>
            <v-chip :color="statusColor" class="mt-2 mt-sm-0">
              {{ statusText }}
            </v-chip>
          </div>

          <v-list>
            <v-list-item>
              <v-list-item-title>Nama Peminjam</v-list-item-title>
              <v-list-item-subtitle>{{ data?.user.fullname }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-calendar-arrow-right</v-icon>
              </template>
              <v-list-item-title>Tanggal Peminjaman</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(borrowedAt) }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-calendar-clock</v-icon>
              </template>
              <v-list-item-title>Tanggal Jatuh Tempo</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(dueDate) }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import dayjs from 'dayjs'

const { data } = useAuth();

const formatDate = dateString => {
  return dayjs(dateString).locale('id').format('dddd, DD MMMM YYYY HH:mm')
}

const route = useRoute()
console.log('ID dari route.params:', route.params.id)
const router = useRouter()
const dialog = ref(false)
const status = ref('PENDING')
const bookCover = ref('')
const title = ref('')
const borrowedAt = ref('')
const dueDate = ref('')

const confirmDialog = ref(false)
const cancelDialog = ref(false)

const statusText = computed(() => {
  switch (status.value) {
    case 'PENDING':
      return 'Menunggu Persetujuan'
    case 'DIAJUKAN':
      return 'Sedang Diajukan'
    case 'DISETUJUI':
      return 'Peminjaman Disetujui'
    case 'MENUNGGU_PENGAMBILAN':
      return 'Bisa Diambil'
    case 'DIPINJAM':
      return 'Sedang Dipinjam'
    case 'DIPERPANJANG':
      return 'Diperpanjang'
    case 'DIKEMBALIKAN':
      return 'Sudah Dikembalikan'
    case 'DIBATALKAN':
      return 'Dibatalkan'
    case 'DITOLAK':
      return 'Permintaan Ditolak'
    case 'TERLAMBAT':
      return 'Terlambat Dikembalikan'
    case 'DIBERHENTIKAN':
      return 'Peminjaman Dihentikan'
    default:
      return 'Status Tidak Diketahui'
  }
})

const statusColor = computed(() => {
  switch (status.value) {
    case 'PENDING':
      return 'warning'
    case 'DIAJUKAN':
      return 'primary'
    case 'DISETUJUI':
      return 'green'
    case 'MENUNGGU_PENGAMBILAN':
      return 'green'
    case 'DIPINJAM':
      return 'success'
    case 'DIPERPANJANG':
      return 'purple'
    case 'DIKEMBALIKAN':
      return 'info'
    case 'DIBATALKAN':
      return 'error'
    case 'DITOLAK':
      return 'red'
    case 'TERLAMBAT':
      return 'orange'
    case 'DIBERHENTIKAN':
      return 'dark'
    default:
      return 'grey'
  }
})

const fetchLoanDetails = async () => {
  try {
    const response = await $fetch(`/api/peminjaman/${route.params.id}`)

    bookCover.value = response.bookCover || '/default-avatar.png'
    title.value = response.title
    borrowedAt.value = response.borrowedAt
    dueDate.value = response.dueDate
    status.value = response.status
  } catch (error) {
    console.error('Gagal mengambil data peminjaman:', error)
  }
}

const submitApproval = async () => {
  try {
    await $fetch(`/api/peminjaman/${route.params.id}/submit`, {
      method: 'POST'
    })

    await fetchLoanDetails()

    console.log('Status setelah submit:', status.value) // Debugging
    confirmDialog.value = false
  } catch (error) {
    console.error('Gagal mengajukan peminjaman:', error)
  }
}

const confirmCancel = async () => {
  try {
    await $fetch(`/api/peminjaman/${route.params.id}/cancel`, {
      method: 'PATCH'
    })

    await fetchLoanDetails()

    cancelDialog.value = false
  } catch (error) {
    console.error('Gagal membatalkan peminjaman:', error)
  }
}

const goBack = () => {
  // router.go(-1);
  useRouter().push('/pinjaman')
}

onMounted(fetchLoanDetails)
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 24px;
}
</style>
