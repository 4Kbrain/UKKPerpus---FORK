<template>
  <Breadcrumbs variant="default" :show-home-icon="true" />

  <!-- Dialog for Tambah Pengguna -->
  <v-dialog v-model="createDenda" max-width="600px">
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white d-flex align-center">
        <p class="mb-0">Tambah Denda Baru</p>
        <v-spacer></v-spacer>
        <v-btn text @click="createDenda = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="dendaForm" v-model="isValid">
          <v-row>
            <!-- Pilih Peminjaman (Dropdown) -->
            <v-col cols="12">
              <v-autocomplete
                v-model="selectedPeminjaman"
                :items="peminjamanList"
                label="Pilih Peminjaman"
                item-title="displayText"
                item-value="id"
                prepend-inner-icon="mdi-book"
                variant="outlined"
                dense
                required
                @update:modelValue="updateSelectedPeminjaman"
              ></v-autocomplete>
            </v-col>

            <!-- ISBN Buku (Readonly) -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedDenda.isbn"
                label="Isbn Buku"
                prepend-inner-icon="mdi-multiple-books"
                variant="outlined"
                dense
                disabled
              ></v-text-field>
            </v-col>

            <!-- Nama Peminjam (Readonly) -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedDenda.userName"
                label="Nama Peminjam"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                dense
                disabled
              ></v-text-field>
            </v-col>

            <!-- Judul Buku (Readonly) -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedDenda.bookTitle"
                label="Judul Buku"
                prepend-inner-icon="mdi-book"
                variant="outlined"
                dense
                disabled
              ></v-text-field>
            </v-col>

            <!-- Jumlah Denda -->
            <!-- <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedDenda.amount"
                label="Jumlah Denda"
                type="number"
                prepend-inner-icon="mdi-cash"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col> -->

            <v-col cols="12" sm="6">
              <v-radio-group v-model="editedDenda.reason" label="Pilih Opsi Denda" required>
                <v-radio label="Bayar" value="KETERLAMBATAN" />
                <v-radio label="Diganti" value="DIGANTIKAN" />
              </v-radio-group>
            </v-col>

            <!-- Menampilkan input jumlah denda hanya jika 'Bayar' dipilih -->
            <v-col v-if="editedDenda.reason === 'KETERLAMBATAN'" cols="12" sm="6">
              <v-text-field
                v-model="editedDenda.amount"
                label="Jumlah Denda"
                type="number"
                prepend-inner-icon="mdi-cash"
                variant="outlined"
                auto-grow
                dense
                required
              ></v-text-field>
            </v-col>

            <!-- Menampilkan notifikasi jika opsi 'Diganti' dipilih -->
            <v-col v-if="editedDenda.reason === 'DIGANTIKAN'" cols="12" sm="6">
              <v-alert type="info" variant="outlined">
                <!-- Use "outlined" instead of "filled" -->
                Anda harus mengganti buku dengan buku yang sama.
              </v-alert>
            </v-col>

            <!-- Alasan Denda -->
            <v-col cols="12">
              <v-select
                v-model="editedDenda.reason"
                :items="dendaReasons"
                label="Alasan Denda"
                prepend-inner-icon="mdi-alert"
                variant="outlined"
                dense
                required
              ></v-select>
            </v-col>

            <!-- Status Denda -->
            <v-col cols="12">
              <v-select
                v-model="editedDenda.status"
                :items="['BELUM_LUNAS', 'LUNAS']"
                label="Status Denda"
                prepend-inner-icon="mdi-check-circle"
                variant="outlined"
                dense
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pb-4 px-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="createDenda = false"> Batal </v-btn>
        <v-btn color="primary" @click="createNewDenda"> Simpan </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row class="mb-4">
    <!-- Card: Total Denda -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Total Denda</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalDenda }}</p>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Denda yang Dibayar -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Denda Dibayar</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalDendaDibayar }}</p>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Denda Belum Dibayar -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Denda Belum Dibayar</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalDendaBelumDibayar }}</p>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Pengguna Terkena Denda -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Pengguna Terkena Denda</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalPenggunaDenda }}</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row align="center" class="mb-4">
    <v-col cols="6">
      <v-text-field
        v-model="search"
        placeholder="Cari denda pengguna..."
        dense
        variant="outlined"
        hide-details
        prepend-inner-icon="mdi-magnify"
        style="width: 100%"
      />
    </v-col>
    <v-spacer />
    <v-col cols="2">
      <v-btn color="primary" small @click="createDenda = !createDenda"> Tambah Denda </v-btn>
    </v-col>
    <!-- <v-col cols="2">
      <v-btn color="success" small> Import Data </v-btn>
    </v-col> -->
  </v-row>

  <!-- Tabs -->
  <v-tabs v-model="tab">
    <v-tab value="semua">Semua</v-tab>
    <v-tab value="belum_lunas">Belum Lunas</v-tab>
    <v-tab value="lunas">Sudah Lunas</v-tab>
  </v-tabs>

  <!-- Tab Content: Semua Pengguna -->
  <v-window v-model="tab">
    <v-window-item value="semua">
      <v-card class="mt-4">
        <v-card-title>
          <v-row align="center">
            <v-col cols="8">
              <span class="text-h6 font-weight-bold">Semua Denda</span>
            </v-col>
          </v-row>
        </v-card-title>

        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems"
          :items-length="totalDenda"
          :loading="loading"
          :search="search"
          item-value="name"
          class="elevation-1"
          @update:options="getItemFromApi"
        >
          <template v-slot:item.amount="{ item }">
            <span>Rp. {{ item.amount }}</span>
          </template>

          <template v-slot:item.last_login="{ item }">
            <span>{{ useFormatDate(item.last_login as string) }}</span>
          </template>

          <template v-slot:item.createdAt="{ item }">
            <span>
              {{ useFormatDate(item.createdAt) }}
            </span>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon @click="handleEdit(item)" color="primary">mdi-pencil</v-icon>
            <v-icon @click="handleDelete(item)" color="error">mdi-delete</v-icon>
          </template>
          <!-- <v-pagination v-model="page" :length="3" class="my-4" /> -->
        </v-data-table-server>
      </v-card>
    </v-window-item>
  </v-window>

  <!-- Tab Content: Admin & Petugas -->
  <v-window v-model="tab">
    <v-window-item value="belum_lunas">
      <!-- <h1>Admin Petugas</h1> -->
      <v-card class="mt-4">
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems.filter(v => v.status === 'BELUM_LUNAS')"
          :items-length="totalDendaBelumDibayar"
          :loading="loading"
          :search="search"
          item-value="name"
          class="elevation-1"
        >
          <template v-slot:item.amount="{ item }">
            <span>Rp. {{ item.amount }}</span>
          </template>

          <template v-slot:item.last_login="{ item }">
            <span>{{ useFormatDate(item.last_login as string) }}</span>
          </template>

          <template v-slot:item.createdAt="{ item }">
            <span>
              {{ useFormatDate(item.createdAt) }}
            </span>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon @click="handleEdit(item)" color="primary">mdi-pencil</v-icon>
            <v-icon @click="handleDelete(item)" color="error">mdi-delete</v-icon>
          </template>
        </v-data-table-server>
      </v-card>
    </v-window-item>
  </v-window>

  <!-- Tab Content: Anggota Perpustakaan -->
  <v-window v-model="tab">
    <v-window-item value="sudah_lunas">
      <!-- <h1>Admin Petugas</h1> -->
      <v-card class="mt-4">
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems.filter(v => v.status === 'LUNAS')"
          :items-length="totalDendaDibayar"
          :loading="loading"
          :search="search"
          item-value="name"
          class="elevation-1"
        >
          <template v-slot:item.amount="{ item }">
            <span> Rp. {{ item.amount }}</span>
          </template>

          <template v-slot:item.createdAt="{ item }">
            <span>
              {{ useFormatDate(item.createdAt) }}
            </span>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon @click="handleEdit(item)" color="primary">mdi-pencil</v-icon>
            <v-icon @click="handleDelete(item)" color="error">mdi-delete</v-icon>
          </template>
        </v-data-table-server>
      </v-card>
    </v-window-item>
  </v-window>

  <v-snackbar
    v-model="snackbar.show"
    :timeout="3000"
    :color="snackbar.color"
    top
    rounded="pill"
    class="snackbar-custom"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-2">{{
        snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'
      }}</v-icon>
      <span>{{ snackbar.message }}</span>
    </div>
  </v-snackbar>

  <v-dialog v-model="dialog.show" max-width="400" style="align-self: flex-start; margin-top: 20px">
    <v-card rounded="lg">
      <v-card-title class="text-h6 pa-4">
        <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
        Error
      </v-card-title>
      <v-card-text class="pa-4">{{ dialog.message }}</v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="dialog.show = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: 'admin',
  allowedRoles: ['PETUGAS'] as const
})

const router = useRouter()
const createDenda = ref(false)

const isLoading = ref(false)

const deleteDialog = ref(false)

const itemsPerPage = ref(10)
const tab = ref('belum_lunas')
const search = ref('')
const page = ref(1)
const totalDenda = ref(0)
const totalDendaDibayar = ref(0)
const totalDendaBelumDibayar = ref(0)
const totalPenggunaDenda = ref(0)
const loading = ref(false)
const editedDenda = ref({
  userId: '',
  peminjamanId: '',
  userName: '',
  bookTitle: '',
  isbn: '',
  amount: '',
  reason: 'KETERLAMBATAN',
  status: 'BELUM_LUNAS',
  createdAt: new Date()
})

const isValid = ref(false)

const peminjamanList = ref([])
const dendaReasons = ref(['DIGANTIKAN','KETERLAMBATAN', 'RUSAK', 'HILANG', 'LAINNYA'])
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})
const selectedPeminjaman = ref(null)

const dialog = ref({
  show: false,
  message: ''
})

const fetchPeminjaman = async () => {
  try {
    const response = await $fetch('/api/admin/peminjaman') // Pastikan endpoint benar
    console.log('Response dari API:', response)

    if (Array.isArray(response)) {
      peminjamanList.value = response.map(peminjaman => ({
        id: peminjaman.id,
        userId: peminjaman.userId,
        bookId: peminjaman.book.id,
        isbn: peminjaman.book.isbn,
        userName: peminjaman.user.fullname,
        bookTitle: peminjaman.book.judul,
        displayText: `${peminjaman.user.fullname} - ${peminjaman.book.judul} - ${peminjaman.book.isbn}` // Ditampilkan di dropdown
      }))
      console.log(peminjamanList.value);  // Add this to check if ISBN is populated

    } else {
      console.error('Response bukan array:', response)
    }
  } catch (error) {
    console.error('Error fetching peminjaman:', error)
  }
}

const updateSelectedPeminjaman = peminjamanId => {
  const selected = peminjamanList.value.find(p => p.id === peminjamanId)
  if (selected) {
    editedDenda.value.userId = selected.userId
    editedDenda.value.peminjamanId = selected.id
    editedDenda.value.userName = selected.userName
    editedDenda.value.bookTitle = selected.bookTitle
  }
}

// Server Items
const serverItems = ref([])
const headers = ref([
  { title: 'Nama', key: 'user.fullname', align: 'start' as const },
  { title: 'Email', key: 'user.email', align: 'start' as const },
  { title: 'Judul Buku', key: 'peminjaman.book.judul', align: 'start' as const },
  { title: 'Jumlah Denda', key: 'amount', align: 'end' as const },
  { title: 'Alasan', key: 'reason', align: 'start' as const },
  { title: 'Status', key: 'status', align: 'start' as const },
  { title: 'Tanggal Dibuat', key: 'createdAt', align: 'start' as const },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center' as const,
    sortable: false
  }
] as const)

const handleEdit = (item) => {
  useRouter().push(`/denda-management/${item.id}`)
}

async function handleDelete(item): Promise<void> {
  console.log('Delete:', item)
  loading.value = true
  try {
    if (!confirm('Are you sure you want to delete this denda?')) return

    const { error } = await useFetch(`/api/denda/${item.id}`, {
      method: 'DELETE'
    })

    if (error.value) {
      console.error('Delete error:', error.value)
      return
    }

    // Refresh the list after deletion
    getItemFromApi()
    deleteDialog.value = false
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    console.error('Delete exception:', err)
  } finally {
    loading.value = false
  }
}


const createNewDenda = async () => {

  if (!isValid.value) {
    snackbar.value = { show: true, message: 'Form is invalid. Please fill in all required fields.', color: 'error' };
    return;
  }
  isLoading.value = true

  // Mengecek jika alasan adalah "KETERLAMBATAN", maka amount harus ada
  if (editedDenda.value.reason === 'KETERLAMBATAN' && !editedDenda.value.amount) {
    snackbar.value = { show: true, message: 'Amount tidak boleh kosong untuk keterlambatan!', color: 'error' }
    isLoading.value = false
    return
  }

  // Jika alasan "DIGANTIKAN", set status menjadi "LUNAS"
  if (editedDenda.value.reason === 'DIGANTIKAN') {
    editedDenda.value.status = 'LUNAS'
  }

  // Siapkan data untuk dikirim
  const requestData = {
    userId: editedDenda.value.userId.trim(), // Hapus spasi ekstra
    peminjamanId: editedDenda.value.peminjamanId || null, // Kosong jadi `null`
    amount: editedDenda.value.amount || 0,
    reason: editedDenda.value.reason,
    status: editedDenda.value.status,
  }

  try {
    const response = await $fetch('/api/denda', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
    // Proses respon dan lakukan sesuatu setelah berhasil
    snackbar.value = { show: true, message: 'Denda berhasil ditambahkan!', color: 'success' }
    createDenda.value = false
  } catch (error) {
    console.error('Error creating denda:', error)
    snackbar.value = { show: true, message: 'Terjadi kesalahan!', color: 'error' }
  } finally {
    isLoading.value = false
  }
}


async function getItemFromApi() {
  loading.value = true
  try {
    const response = await $fetch('/api/denda', {
      method: 'GET',
      query: {
        search: search.value || '',
        page: 1,
        limit: itemsPerPage.value
      }
    })

    if (!response || !response.items) throw new Error('Response tidak valid')

    serverItems.value = response.items.map((item) => ({
      ...item,
      photo: item.photo ?? undefined,
      last_login: item.last_login as string
    }))

    totalDenda.value = response.total ?? 0
    totalDendaBelumDibayar.value = response.totalDendaBelumDibayar ?? 0
    totalDendaDibayar.value = response.totalDendaDibayar ?? 0
    totalPenggunaDenda.value = response.totalPenggunaDenda ?? 0
  } catch (error) {
    console.error('Gagal mengambil data denda:', error)
    dialog.value = { show: true, message: 'Gagal mengambil data denda. Silakan coba lagi nanti.' }
  } finally {
    loading.value = false
  }
}

watch(createDenda, newValue => {
  // console.log("Dialog is now " + (newValue ? "open" : "closed"));
})

// search input (delay API call)
let timeout: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    getItemFromApi()
  }, 100)
})

onMounted(fetchPeminjaman)

onMounted(async () => {
  await getItemFromApi()
})
</script>
