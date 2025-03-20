<template>
  <v-container>
    <!-- Dialog Error -->
    <v-dialog v-model="showErrorDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Gagal Meminjam Buku</v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="showErrorDialog = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card>
      <div class="d-flex justify-start px-2 pt-2">
        <v-btn
          variant="text"
          @click.stop="useRouter().push(`/book/${route.params.id}/title`)"
          icon="mdi-chevron-left"
        />
        <v-card-title>Pinjam Buku</v-card-title>
      </div>

      <v-divider />
      <v-form @submit.prevent="handleSubmit" class="ma-4">
        <v-label class="text-white mb-1">Tanggal Peminjaman</v-label>
        <v-text-field
          v-model="form.borrowedAt"
          type="date"
          variant="outlined"
          prepend-inner-icon="mdi-calendar"
          :min="today"
          hide-details
          required
        />

        <v-label class="text-white mb-1">Tanggal Pengembalian</v-label>
        <v-text-field
          v-model="form.dueDate"
          type="date"
          variant="outlined"
          prepend-inner-icon="mdi-calendar"
          :min="minDate"
          :max="maxDate"
          hide-details
          required
        />

        <div class="d-flex mt-4 justify-end">
          <v-btn :disabled="isLoading" color="primary" type="submit">
            <v-progress-circular v-if="isLoading" indeterminate size="20"></v-progress-circular>
            <span v-else>Pinjam</span>
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
const { data } = useAuth()
const route = useRoute()
const router = useRouter()

const today = dayjs().format("YYYY-MM-DD");
const isLoading = ref(false)
const showErrorDialog = ref(false)
const errorMessage = ref('')

const form = ref({
  userId: data.value?.user?.id,
  bookId: route.params.id,
  borrowedAt: today,
  dueDate: dayjs(today).add(7, 'day').format('YYYY-MM-DD')
})

const minDate = computed(() => form.value.borrowedAt)
const maxDate = computed(() => dayjs(form.value.borrowedAt).add(7, 'day').format('YYYY-MM-DD'))

async function handleSubmit() {
  isLoading.value = true
  try {
    const response = await $fetch(`/api/loans`, {
      method: 'POST',
      body: {
        userId: form.value.userId,
        bookId: form.value.bookId,
        borrowedAt: dayjs(form.value.borrowedAt).toISOString(),
        dueDate: dayjs(form.value.dueDate).toISOString(),
        returnedAt: null
      }
    })

    console.log('Response API:', response)

    if (response && response.peminjamanId) {
      router.push(`/pinjaman/${response.peminjamanId}`)
    }
  } catch (error: any) {
    console.error('Gagal melakukan peminjaman:', error)

    if (error.statusMessage) {
      errorMessage.value = error.statusMessage
    } else if (error.data?.message) {
      errorMessage.value = error.data.message
    } else {
      errorMessage.value = 'Terjadi kesalahan pada server'
    }

    showErrorDialog.value = true
  } finally {
    isLoading.value = false
  }
}

watch(
  [() => form.value.dueDate, () => form.value.borrowedAt],
  ([newPengembalian, newPeminjaman]) => {
    if (newPengembalian < newPeminjaman) {
      errorMessage.value = 'Tanggal pengembalian tidak boleh kurang dari tanggal peminjaman.'
      showErrorDialog.value = true
      form.value.dueDate = newPeminjaman
    }
  }
)
</script>
