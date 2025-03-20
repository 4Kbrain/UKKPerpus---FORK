<template>
  <Breadcrumbs variant="default" :show-home-icon="true" />

  <v-row class="mb-4">
    <!-- Card: Total Buku -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Total Buku</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalItems }}</p>
          <!-- <p class="text-green-darken-2 text-caption">
            ↑ 12% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Buku Tersedia -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Buku Tersedia</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalAvailable }}</p>
          <!-- <p class="text-green-darken-2 text-caption">
            ↑ 5% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Buku Tidak Tersedia -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Buku Tidak Tersedia</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalUnavailable }}</p>
          <!-- <p class="text-red-darken-2 text-caption">
            ↓ 3% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Menunggu Pengembalian -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Menunggu Pengembalian</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">23</p>
          <!-- <p class="text-red-darken-2 text-caption">
            ↓ 8% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row align="center" class="mb-4">
    <v-col cols="6">
      <v-text-field
        v-model="search"
        placeholder="Cari buku..."
        dense
        variant="outlined"
        hide-details
        prepend-inner-icon="mdi-magnify"
        style="width: 100%"
      />
    </v-col>
    <v-spacer />
    <v-col cols="2">
      <v-btn color="primary" small @click="router.push('/book-management/create')">
        Tambah Buku
      </v-btn>
    </v-col>
    <!-- <v-col cols="2">
      <v-btn color="success" small> Import Data </v-btn>
    </v-col> -->
  </v-row>

  <!-- Tabs -->
  <v-tabs v-model="tab">
    <v-tab value="semua">Semua Buku</v-tab>
    <v-tab value="tersedia">Tersedia</v-tab>
    <v-tab value="dipinjam">Tidak Tersedia</v-tab>
  </v-tabs>

  <!-- Tab Content -->
  <v-window v-model="tab">
    <v-window-item value="semua">
      <v-card class="mt-4">
        <v-card-title>
          <v-row align="center">
            <v-col cols="8">
              <span class="text-h6 font-weight-bold">Daftar Buku</span>
            </v-col>
            <v-col cols="4" class="d-flex align-center">
              <v-card-text>Filter:</v-card-text>
              <v-select
                v-model="selectedCategory"
                :items="filterCategories"
                label="Kategori"
                dense
                variant="outlined"
                hide-details
                prepend-inner-icon="mdi-filter"
                @update:model-value="getItemFromApi"
              />
            </v-col>
            <!-- <v-col cols="2">
              <v-btn color="primary" small> Peminjaman Baru </v-btn>
            </v-col> -->
          </v-row>
        </v-card-title>

        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems"
          :items-length="totalItems"
          :loading="loading"
          :search="search"
          item-value="name"
          class="elevation-1"
        >
          <template v-slot:item.buku="{ item }">
            <v-row align="center" no-gutters>
              <v-col cols="2">
                <v-img
                  src="/default-avatar.png"
                  alt="Book Image"
                  max-height="30"
                  max-width="30"
                  contain
                />
              </v-col>
              <v-col cols="10">
                {{ item.judul }}
              </v-col>
            </v-row>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status as StatusBuku)" dark>
              {{ item.status as StatusPinjaman }}
            </v-chip>
          </template>

          <template v-slot:item.tahun_terbit="{ item }">
            <span>
              {{ useFormatDate(item.tahun_terbit) }}
            </span>
          </template>

          <template v-slot:item.categories="{ item }">
            <v-chip v-if="item.categories.length">
              {{ item.categories.join(', ') }}
            </v-chip>
            <v-chip v-else color="grey">Tidak ada kategori</v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <!-- Tombol Edit -->
            <v-btn text color="primary" class="mr-2" @click="editItem(item)">
              <v-icon left>mdi-pencil</v-icon>
              Edit
            </v-btn>

            <!-- Tombol Delete dengan Konfirmasi -->
            <v-btn text color="secondary" @click="confirmDelete(item)">
              <v-icon left>mdi-delete</v-icon>
              Delete
            </v-btn>

            <!-- Dialog Konfirmasi Hapus -->
            <v-dialog v-model="dialogDelete" max-width="400">
              <v-card>
                <v-card-title>Konfirmasi</v-card-title>
                <v-card-text>Apakah Anda yakin ingin menghapus item ini?</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialogDelete = false">Batal</v-btn>
                  <v-btn color="red" text @click="deleteItem">Hapus</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table-server>

        <!-- <v-pagination v-model="page" :length="3" class="my-4" /> -->
      </v-card>
    </v-window-item>
  </v-window>


  <!-- Tab Content -->
  <v-window v-model="tab">
    <v-window-item value="tersedia">
      <v-card class="mt-4">
        <v-card-title>
          <v-row align="center">
            <v-col cols="8">
              <span class="text-h6 font-weight-bold">Daftar Buku Tersedia</span>
            </v-col>
            <v-col cols="4" class="d-flex align-center">
              <v-card-text>Filter:</v-card-text>
              <v-select
                v-model="selectedCategory"
                :items="filterCategories"
                label="Kategori"
                dense
                variant="outlined"
                hide-details
                prepend-inner-icon="mdi-filter"
                @update:model-value="getItemFromApi"
              />
            </v-col>
            <!-- <v-col cols="2">
              <v-btn color="primary" small> Peminjaman Baru </v-btn>
            </v-col> -->
          </v-row>
        </v-card-title>

        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems.filter(v => v.status === 'TERSEDIA')"
          :items-length="totalItems"
          :loading="loading"
          :search="search"
          item-value="name"
          class="elevation-1"
        >
          <template v-slot:item.buku="{ item }">
            <v-row align="center" no-gutters>
              <v-col cols="2">
                <v-img
                  src="/default-avatar.png"
                  alt="Book Image"
                  max-height="30"
                  max-width="30"
                  contain
                />
              </v-col>
              <v-col cols="10">
                {{ item.judul }}
              </v-col>
            </v-row>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status as StatusBuku)" dark>
              {{ item.status as StatusPinjaman }}
            </v-chip>
          </template>

          <template v-slot:item.tahun_terbit="{ item }">
            <span>
              {{ useFormatDate(item.tahun_terbit) }}
            </span>
          </template>

          <template v-slot:item.categories="{ item }">
            <v-chip v-if="item.categories.length">
              {{ item.categories.join(', ') }}
            </v-chip>
            <v-chip v-else color="grey">Tidak ada kategori</v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <!-- Tombol Edit -->
            <v-btn text color="primary" class="mr-2" @click="editItem(item)">
              <v-icon left>mdi-pencil</v-icon>
              Edit
            </v-btn>

            <!-- Tombol Delete dengan Konfirmasi -->
            <v-btn text color="secondary" @click="confirmDelete(item)">
              <v-icon left>mdi-delete</v-icon>
              Delete
            </v-btn>

            <!-- Dialog Konfirmasi Hapus -->
            <v-dialog v-model="dialogDelete" max-width="400">
              <v-card>
                <v-card-title>Konfirmasi</v-card-title>
                <v-card-text>Apakah Anda yakin ingin menghapus item ini?</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialogDelete = false">Batal</v-btn>
                  <v-btn color="red" text @click="deleteItem">Hapus</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table-server>

        <!-- <v-pagination v-model="page" :length="3" class="my-4" /> -->
      </v-card>
    </v-window-item>
  </v-window>

  <!-- Tab Content -->
  <v-window v-model="tab">
    <v-window-item value="dipinjam">
      <v-card class="mt-4">
        <v-card-title>
          <v-row align="center">
            <v-col cols="8">
              <span class="text-h6 font-weight-bold">Daftar Buku Tidak Tersedia</span>
            </v-col>
            <v-col cols="4" class="d-flex align-center">
              <v-card-text>Filter:</v-card-text>
              <v-select
                v-model="selectedCategory"
          :items="filterCategories"
                label="Kategori"
                dense
                variant="outlined"
                hide-details
                prepend-inner-icon="mdi-filter"
                @update:model-value="getItemFromApi"
              />
            </v-col>
            <!-- <v-col cols="2">
              <v-btn color="primary" small> Peminjaman Baru </v-btn>
            </v-col> -->
          </v-row>
        </v-card-title>

        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems.filter(v => v.status === 'TIDAK_TERSEDIA')"
          :items-length="totalItems"
          :loading="loading"
          :search="search"
          item-value="name"
          class="elevation-1"
        >
          <template v-slot:item.buku="{ item }">
            <v-row align="center" no-gutters>
              <v-col cols="2">
                <v-img
                  src="/default-avatar.png"
                  alt="Book Image"
                  max-height="30"
                  max-width="30"
                  contain
                />
              </v-col>
              <v-col cols="10">
                {{ item.judul }}
              </v-col>
            </v-row>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status as StatusBuku)" dark>
              {{ item.status as StatusPinjaman }}
            </v-chip>
          </template>

          <template v-slot:item.tahun_terbit="{ item }">
            <span>
              {{ useFormatDate(item.tahun_terbit) }}
            </span>
          </template>
          
          <template v-slot:item.categories="{ item }">
            <v-chip v-if="item.categories.length">
              {{ item.categories.join(', ') }}
            </v-chip>
            <v-chip v-else color="grey">Tidak ada kategori</v-chip>
          </template>
          
          <template v-slot:item.jumlah="{ item }">
            <span>
              {{ item.jumlah }}
            </span>
          </template>
          <template v-slot:item.actions="{ item }">
            <!-- Tombol Edit -->
            <v-btn text color="primary" class="mr-2" @click="editItem(item)">
              <v-icon left>mdi-pencil</v-icon>
              Edit
            </v-btn>

            <!-- Tombol Delete dengan Konfirmasi -->
            <v-btn text color="secondary" @click="confirmDelete(item)">
              <v-icon left>mdi-delete</v-icon>
              Delete
            </v-btn>

            <!-- Dialog Konfirmasi Hapus -->
            <v-dialog v-model="dialogDelete" max-width="400">
              <v-card>
                <v-card-title>Konfirmasi</v-card-title>
                <v-card-text>Apakah Anda yakin ingin menghapus item ini?</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialogDelete = false">Batal</v-btn>
                  <v-btn color="red" text @click="deleteItem">Hapus</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table-server>

        <!-- <v-pagination v-model="page" :length="3" class="my-4" /> -->
      </v-card>
    </v-window-item>
  </v-window>


</template>

<script lang="ts" setup>
import type { Book, StatusBuku, StatusPinjaman } from '@/types'
import { routerKey } from 'vue-router'

definePageMeta({
  layout: 'admin',
  allowedRoles: ['PETUGAS'] as const
})

const router = useRouter()
const itemsPerPage = ref(10)
const tab = ref('terbaru')
const search = ref('')
const page = ref(1)
const totalItems = ref(0)
const loading = ref(false)

const dialogDelete = ref(false)
const selectedItem = ref(null)

// Total Buku
const totalAvailable = ref(0)
const totalUnavailable = ref(0)

const selectedCategory = ref('Fiction')
const filterCategories = ref(['Semua', 'Fiction', 'Non-Fiksi', 'Teknologi', 'Sejarah'])

// Server Items
const serverItems = ref<Book[]>([])
const headers = ref([
  { title: 'Kode Buku', align: 'start', key: 'kode_buku' },
  { title: 'Judul Buku', align: 'start', key: 'judul' },
  { title: 'Pengarang', key: 'pengarang' },
  { title: 'Kategori', key: 'categories' },
  { title: 'Penerbit', key: 'penerbit' },
  { title: 'Jumlah Buku', key: 'jumlah' },
  { title: 'Tahun Terbit', key: 'tahun_terbit' },
  { title: 'Status', key: 'status' },
  { title: 'Aksi', key: 'actions', sortable: false }
] as const)

function getStatusColor(status: StatusBuku): string {
  switch (status) {
    case 'TIDAK_TERSEDIA':
      return 'red'
    case 'TERSEDIA':
      return 'green'
    default:
      return 'grey'
  }
}

const getCategoryFromApi = async () => {
  try {
    const response = await $fetch('/api/bookCategory')
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }
}

async function getItemFromApi() {
  loading.value = true
  // TODO: Fetch data from API
  try {
    const response = await $fetch('/api/books', {
      method: 'GET',
      query: {
        search: search.value || '',
        page: 1,
        limit: itemsPerPage.value
      }
    })

    if (response.items.length > 0) {
      serverItems.value = response.items.map((item: Book) => ({
        ...item,
        // cover: item.cover ?? undefined,

        categories: item.categories || []
      }))
      totalItems.value = response.total
      totalAvailable.value = response.availableBook
      totalUnavailable.value = response.notAvailableBook
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// search input (delay API call)
let timeout: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    getItemFromApi()
  }, 100)
})

const editItem = async (item: Book) => {
  console.log('Edit item:', item)
  // Redirect ke halaman edit
  router.push(`/book-management/edit/${item.id}`)
}

function confirmDelete(item: Book) {
  selectedItem.value = item
  dialogDelete.value = true
}

async function deleteItem() {
  if (!selectedItem.value) return

  try {
    await $fetch(`/api/books/${selectedItem.value.id}`, { method: 'DELETE' })

    // Hapus dari daftar tanpa reload API
    serverItems.value = serverItems.value.filter(book => book.id !== selectedItem.value.id)

    // Reset state
    selectedItem.value = null
    dialogDelete.value = false
  } catch (error) {
    console.error('Gagal menghapus:', error)
  }
}

onMounted(async () => {
  await getItemFromApi()
  await getCategoryFromApi()
})
</script>
