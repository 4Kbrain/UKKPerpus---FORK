<template>
  <Breadcrumbs variant="default" :show-home-icon="true" />

  <!-- Dialog for Tambah Pengguna -->
  <v-dialog v-model="createUser" max-width="600px">
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white d-flex align-center">
        <p class="mb-0">Tambah Pengguna Baru</p>
        <v-spacer></v-spacer>
        <v-btn text @click="createUser = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form ref="petugasForm">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newUser.fullname"
                label="Nama Lengkap"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newUser.username"
                placeholder="Username"
                prepend-inner-icon="mdi-badge-account"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newUser.email"
                type="email"
                placeholder="Masukkan alamat email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newUser.phone"
                placeholder="Masukkan nomor telepon"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newUser.password"
                placeholder="Masukkan kata sandi"
                type="password"
                prepend-inner-icon="mdi-eye"
                variant="outlined"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newUser.confirmPassword"
                placeholder="Konfirmasi kata sandi"
                type="password"
                prepend-inner-icon="mdi-eye"
                variant="outlined"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="newUser.gender"
                :items="userGender"
                label="Pilih Gender"
                prepend-inner-icon="mdi-shield-account"
                variant="outlined"
                dense
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="newUser.role"
                :items="userRoles"
                label="Pilih Role"
                prepend-inner-icon="mdi-shield-account"
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
        <v-btn color="grey" text @click="createUser = false"> Batal </v-btn>
        <v-btn color="primary" @click="createNewUser"> Simpan </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  

  <v-row class="mb-4">
    <!-- Card: Total Anggota -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Total Angota</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalItems }}</p>
          <!-- <p class="text-green-darken-2 text-caption">
            ↑ 12% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Admin dan Petugas -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Admin & Petugas</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalAdminAndPetugas }}</p>
          <!-- <p class="text-green-darken-2 text-caption">
            ↑ 5% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Pendaftaran Baru -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Pendaftaran Baru</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalNewUser }}</p>
          <!-- <p class="text-red-darken-2 text-caption">
            ↓ 3% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Akun Diblokir -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Akun Diblokir</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ blockedUserCount }}</p>
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
        placeholder="Cari pengguna..."
        dense
        variant="outlined"
        hide-details
        prepend-inner-icon="mdi-magnify"
        style="width: 100%"
      />
    </v-col>
    <v-spacer />
    <v-col cols="2">
      <v-btn color="primary" small @click="createUser = !createUser"> Tambah Pengguna </v-btn>
    </v-col>
    <!-- <v-col cols="2">
      <v-btn color="success" small> Import Data </v-btn>
    </v-col> -->
  </v-row>

  <!-- Tabs -->
  <v-tabs v-model="tab">
    <v-tab value="semua">Semua</v-tab>
    <v-tab value="admin_petugas">Admin & Petugas</v-tab>
    <v-tab value="anggota">Anggota Perpustakaan</v-tab>
  </v-tabs>

  <!-- Tab Content: Semua Pengguna -->
  <v-window v-model="tab">
    <v-window-item value="semua">
      <v-card class="mt-4">
        <v-card-title>
          <v-row align="center">
            <v-col cols="8">
              <span class="text-h6 font-weight-bold">Semua Pengguna</span>
            </v-col>
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
          @update:options="getItemFromApi"
        >
          <template v-slot:item.last_login="{ item }">
            <span>{{ useFormatDate(item.last_login as string) }}</span>
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
    <v-window-item value="admin_petugas">
      <!-- <h1>Admin Petugas</h1> -->
      <v-card class="mt-4">
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems.filter(v => v.role === 'ADMINISTRATOR' || v.role === 'PETUGAS')"
          :items-length="totalAdminAndPetugas"
          :loading="loading"
          :search="search"
          item-value="name"
          class="elevation-1"
        >
          <template v-slot:item.last_login="{ item }">
            <span>{{ useFormatDate(item.last_login as string) }}</span>
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
    <v-window-item value="anggota">
      <!-- <h1>Admin Petugas</h1> -->
      <v-card class="mt-4">
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems.filter(v => v.role === 'PEMINJAM')"
          :items-length="totalPeminjam"
          :loading="loading"
          :search="search"
          item-value="name"
          class="elevation-1"
        >
          <template v-slot:item.last_login="{ item }">
            <span>{{ useFormatDate(item.last_login as string) }}</span>
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
import type { User, UserRole } from '@/types'

definePageMeta({
  layout: 'admin',
  allowedRoles: ['ADMINISTRATOR'] as const
})

const router = useRouter()
const createUser = ref(false)

const isLoading = ref(false)

const deleteDialog = ref(false)

const itemsPerPage = ref(10)
const tab = ref('terbaru')
const search = ref('')
const page = ref(1)
const totalItems = ref(0)
const totalAdminAndPetugas = ref(0)
const totalPeminjam = ref(0)
const totalNewUser = ref(0)
const blockedUserCount = ref(0)
const loading = ref(false)
const userRoles = ref(['ADMINISTRATOR', 'PETUGAS', 'PEMINJAM'])
const userGender = ref(['MALE', 'FEMALE'])

// Form Data
const newUser = reactive({
  fullname: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: '',
  gender: ''
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const dialog = ref({
  show: false,
  message: ''
})

// Server Items
const serverItems = ref<User[]>([])
const headers = ref([
  {
    title: 'Nama',
    key: 'fullname',
    sortable: false,
    align: 'start' as const
  },
  { title: 'username', key: 'username', align: 'start' as const },
  { title: 'Email', key: 'email', align: 'start' as const },
  { title: 'Gender', key: 'gender', align: 'start' as const },
  { title: 'Role', key: 'role', align: 'end' as const },
  { title: 'Login Terakhir', key: 'last_login', align: 'start' as const },
  // { title: 'Status Akun', key: 'is_active', align: 'start' as const },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center' as const,
    sortable: false
  }
] as const)


const handleEdit = (item: User) => {
  useRouter().push(`/user-management/${item.id}`)
}

async function handleDelete(item: User): Promise<void> {
  console.log('Delete:', item)
  loading.value = true
  try {
    if (!confirm('Are you sure you want to delete this user?')) return

    const { error } = await useFetch(`/api/users/${item.id}`, {
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

function getStatusColor(status: UserRole): string {
  switch (status) {
    case 'ADMINISTRATOR':
      return 'green'
    case 'PETUGAS':
      return 'red'
    case 'PEMINJAM':
      return 'orange'
    default:
      return 'grey'
  }
}

const createNewUser = async () => {
  if (!newUser || Object.values(newUser).some(value => !value)) {
    snackbar.value = { show: true, message: 'Please fill all required fields', color: 'error' }
    return
  }

  isLoading.value = true
  try {
    const createdUser = await $fetch('/api/users', {
      method: 'POST',
      body: newUser
    })

    snackbar.value = { show: true, message: 'User created succesfully!...', color: 'success' }

    await getItemFromApi()
  } catch (error) {
    console.error('Save User Error:', error)
  } finally {
    isLoading.value = false
    createUser.value = false
  }
}

async function getItemFromApi() {
  loading.value = true
  // TODO: Fetch data from API
  try {
    const response = await $fetch('/api/users', {
      method: 'GET',
      query: {
        search: search.value || '',
        page: 1,
        limit: itemsPerPage.value
      }
    })

    // console.log("API Response:", response.items);

    if (response.items.length > 0) {
      serverItems.value = response.items.map((item: User) => ({
        ...item,
        photo: item.photo ?? undefined,
        last_login: item.last_login as string
      }))
      totalItems.value = response.total
      totalAdminAndPetugas.value = response.adminAndPetugasCount
      totalPeminjam.value = response.peminjamCount
      totalNewUser.value = response.newUserCount
      blockedUserCount.value = response.blockedUserCount
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch(createUser, newValue => {
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

onMounted(async () => {
  await getItemFromApi()
})
</script>
