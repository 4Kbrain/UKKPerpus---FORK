<template>
  <!-- Dialog for Tambah Petugas -->
  <v-dialog v-model="dialogPetugas" max-width="600px">
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white d-flex align-center">
        <p class="mb-0">Tambah Petugas Baru</p>
        <v-spacer></v-spacer>
        <v-btn text @click="dialogPetugas = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form ref="petugasForm">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newStaff.fullname"
                placeholder="Nama Lengkap"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newStaff.username"
                placeholder="Username"
                prepend-inner-icon="mdi-badge-account"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newStaff.email"
                type="email"
                placeholder="Email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newStaff.phone"
                placeholder="No. Telepon"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newStaff.password"
                placeholder="Password"
                type="password"
                prepend-inner-icon="mdi-shield-account"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newStaff.confirmPassword"
                placeholder="Konfirmasi Password"
                type="password"
                prepend-inner-icon="mdi-shield-account"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="newStaff.gender"
                :items="staffGender"
                label="Gender"
                prepend-inner-icon="mdi-shield-account"
                variant="outlined"
                dense
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="newStaff.role"
                :items="staffRoles"
                label="Jabatan"
                prepend-inner-icon="mdi-shield-account"
                variant="outlined"
                dense
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="newStaff.address"
                label="Alamat"
                prepend-inner-icon="mdi-map-marker"
                variant="outlined"
                auto-grow
                dense
                rows="2"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pb-4 px-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="dialogPetugas = false"> Batal </v-btn>
        <v-btn color="primary" :disabled="isLoading" @click="saveStaff"> Simpan </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog untuk Unduh Laporan Bulanan -->
  <v-dialog v-model="dialogLaporan" max-width="600px">
  <v-card>
    <v-card-title class="text-h5 bg-primary text-white d-flex align-center">
      <p class="mb-0">Unduh Laporan Bulanan</p>
      <v-spacer></v-spacer>
      <v-btn text @click="dialogLaporan = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="pt-4">
      <v-form ref="laporanForm">
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="selectedReportType"
              :items="reportTypes"
              label="Pilih Jenis Laporan"
              prepend-inner-icon="mdi-file-chart"
              variant="outlined"
              dense
              required
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="selectedMonth"
              :items="months"
              label="Pilih Bulan"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              dense
              required
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="selectedYear"
              :items="years"
              label="Pilih Tahun"
              prepend-inner-icon="mdi-calendar-range"
              variant="outlined"
              dense
              required
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="selectedFormat"
              :items="formats"
              label="Pilih Format"
              prepend-inner-icon="mdi-file"
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
      <v-btn color="grey" text @click="dialogLaporan = false"> Batal </v-btn>
      <v-btn color="primary" @click="downloadReport">Unduh</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


  <!-- Dialog for Tambah Pengumuman Baru -->
  <v-dialog v-model="dialogPengumuman" max-width="600px">
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white d-flex align-center">
        <p class="mb-0">Tambah Pengumuman Baru</p>
        <v-spacer></v-spacer>
        <v-btn text @click="dialogPengumuman = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form ref="pengumumanForm">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="newPengumuman.judul"
                label="Judul Pengumuman"
                prepend-inner-icon="mdi-bullhorn"
                variant="outlined"
                dense
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="newPengumuman.isi"
                label="Isi Pengumuman"
                prepend-inner-icon="mdi-text"
                variant="outlined"
                auto-grow
                dense
                rows="3"
                required
              ></v-textarea>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="newPengumuman.kategori"
                :items="kategoriPengumumanList"
                label="Kategori Pengumuman"
                prepend-inner-icon="mdi-tag"
                variant="outlined"
                dense
                required
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-switch
                v-model="newPengumuman.is_active"
                label="Aktifkan Pengumuman"
                inset
                color="primary"
              ></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pb-4 px-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="dialogPengumuman = false"> Batal </v-btn>
        <v-btn color="primary" @click="saveAnnouncement"> Simpan </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row class="mb-4">
    <!-- Card: Total Buku -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Total Buku</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalBook }}</p>
          <!-- <p class="text-green-darken-2 text-caption">
            ↑ 12% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Total Anggota -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Total Anggota</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalUser }}</p>
          <!-- <p class="text-green-darken-2 text-caption">
            ↑ 5% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Peminjaman Aktif -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Peminjaman Aktif</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ totalLoan }}</p>
          <!-- <p class="text-red-darken-2 text-caption">
            ↓ 3% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Peminjaman Terlambat -->
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <v-card-title class="text-subtitle-1">Peminjaman Terlambat</v-card-title>
        <v-card-text>
          <p class="text-h5 font-weight-bold text-primary">{{ lateLoan }}</p>
          <!-- <p class="text-red-darken-2 text-caption">
            ↓ 8% dibanding bulan lalu
          </p> -->
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Card: Aksi Cepat Admin -->
  <v-row class="mb-4">
    <!-- Card: Tambah Petugas -->
    <v-col cols="12" sm="6" md="4">
      <v-card class="pa-4 text-center">
        <v-card-title class="text-subtitle-1">Tambah Petugas</v-card-title>
        <v-card-text>
          <v-btn
            color="primary"
            prepend-icon="mdi-account-plus"
            @click="dialogPetugas = !dialogPetugas"
            >Tambah</v-btn
          >
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Unduh Laporan Bulanan -->
    <v-col cols="12" sm="6" md="4">
      <v-card class="pa-4 text-center">
        <v-card-title class="text-subtitle-1">Unduh Laporan Bulanan</v-card-title>
        <v-card-text>
          <v-btn color="success" prepend-icon="mdi-download" @click="dialogLaporan = !dialogLaporan"
            >Unduh</v-btn
          >
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Card: Tambah Pengumuman -->
    <v-col cols="12" sm="6" md="4">
      <v-card class="pa-4 text-center">
        <v-card-title class="text-subtitle-1">Buat Pengumuman Baru</v-card-title>
        <v-card-text>
          <v-btn
            color="warning"
            prepend-icon="mdi-bullhorn"
            @click="dialogPengumuman = !dialogPengumuman"
            >Tambah</v-btn
          >
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Tabs -->
  <v-tabs v-model="tab">
    <v-tab value="terbaru">Peminjaman Terbaru</v-tab>
    <v-tab value="pengembalian">Pengembalian Hari Ini</v-tab>
    <!-- <v-tab value="populer">Buku Populer</v-tab> -->
  </v-tabs>

  <!-- Tab Content: Peminjaman Terbaru -->
  <v-window v-model="tab" class="mb-4">
    <v-window-item value="terbaru">
      <v-card class="mt-4">
        <v-card-title>
          <v-row align="center">
            <v-col cols="7">
              <span class="text-h6 font-weight-bold">Daftar Peminjaman Terbaru</span>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="search"
                placeholder="Cari peminjaman..."
                dense
                variant="outlined"
                hide-details
                prepend-inner-icon="mdi-magnify"
                style="width: 100%"
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
          :items="peminjaman.filter(v => v.status === 'DIAJUKAN' || v.status === 'DIPINJAM')"
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
                {{ item.buku }}
              </v-col>
            </v-row>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status as StatusPinjaman)" dark>
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.borrowedAt="{ item }">
            <span>{{ useFormatDate(item.borrowedAt) }}</span>
          </template>

          <template v-slot:item.dueDate="{ item }">
            <span>{{ useFormatDate(item.dueDate) }}</span>
          </template>

          <!-- <template v-slot:item.aksi="{ item }">
            <v-btn text color="primary" class="mr-2">Detail</v-btn>
            <v-btn text color="secondary">Setujui</v-btn>
          </template> -->
        </v-data-table-server>

        <!-- <v-pagination v-model="page" :length="3" class="my-4" /> -->
      </v-card>
    </v-window-item>
  </v-window>

  <!-- Tab Content: Buku Perlu Dikembalikan -->
  <v-window v-model="tab">
    <v-window-item value="pengembalian">
      <v-card class="mt-4">
        <v-card-title>
          <v-row align="center">
            <v-col cols="7">
              <span class="text-h6 font-weight-bold">Buku yang perlu dikembalikan hari ini</span>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="search"
                placeholder="Cari peminjaman..."
                dense
                variant="outlined"
                hide-details
                prepend-inner-icon="mdi-magnify"
                style="width: 100%"
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
          :items="
            peminjaman.filter(
              v => v.status === 'MENDEKATI_TANGGAL_PENGEMBALIAN' || v.status === 'TERLAMBAT'
            )
          "
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
                {{ item.buku }}
              </v-col>
            </v-row>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status as StatusPinjaman)" dark>
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.borrowedAt="{ item }">
            <span>{{ useFormatDate(item.borrowedAt) }}</span>
          </template>

          <template v-slot:item.dueDate="{ item }">
            <span>{{ useFormatDate(item.dueDate) }}</span>
          </template>
          <template v-slot:item.aksi="{ item }">
            <v-btn
              text
              color="primary"
              class="mr-2"
              :ripple="true"
              elevation="2"
              small
              rounded
              prepend-icon="mdi-eye"
            >
              <span class="font-weight-medium">Detail</span>
            </v-btn>

            <v-btn
              text
              color="secondary"
              :ripple="true"
              elevation="2"
              small
              rounded
              prepend-icon="mdi-keyboard-return"
            >
              <span class="font-weight-medium">Kembalikan</span>
            </v-btn>
          </template>
        </v-data-table-server>

        <!-- <v-pagination v-model="page" :length="3" class="my-4" /> -->
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

<script setup lang="ts">
import type { StatusPinjaman, Peminjaman } from "@/types";
const { data } = useAuth();

definePageMeta({
  layout: "admin",
  allowedRoles: ['PETUGAS', 'ADMINISTRATOR'] as const
});

const router = useRouter();

// Card: Dashboard
const totalBook = ref(0);
const totalUser = ref(0);
const totalLoan = ref(0);
const lateLoan = ref(0);

const isLoading = ref(false)

const itemsPerPage = ref(10);
const tab = ref("terbaru");
const search = ref("");
const page = ref(1);
const totalItems = ref(0);
const loading = ref(false);
// const serverItems = ref<User[]>([]);

// Dialog: Admin Actions
const dialogPetugas = ref(false);
const dialogLaporan = ref(false);
const dialogPengumuman = ref(false);

// Laporan Bulanan
const selectedReportType = ref(null);
const reportTypes = [
  { title: "Laporan Peminjaman", value: "peminjaman" },
  { title: "Laporan Buku yang Sering Dipinjam", value: "buku-sering" },
  { title: "Laporan Denda", value: "denda" },
  { title: "Laporan Pengguna Aktif", value: "pengguna-aktif" },
  { title: "Laporan Buku Tidak Pernah Dipinjam", value: "buku-tidak-sering" },
  { title: "Laporan Pengembalian Buku", value: "pengembalian" },
];
const selectedMonth = ref(null);
const selectedYear = ref(null);
const selectedFormat = ref(null);
const months = [
  { title: "Januari", value: "1" },
  { title: "Februari", value: "2" },
  { title: "Maret", value: "3" },
  { title: "April", value: "4" },
  { title: "Mei", value: "5" },
  { title: "Juni", value: "6" },
  { title: "Juli", value: "7" },
  { title: "Agustus", value: "8" },
  { title: "September", value: "9" },
  { title: "Oktober", value: "10" },
  { title: "November", value: "11" },
  { title: "Desember", value: "12" },
];
const years = Array.from({ length: 10 }, (_, i) => ({
  title: String(new Date().getFullYear() - i),
  value: String(new Date().getFullYear() - i),
}));
const formats = [{ title: "PDF", value: "pdf" }];

const staffGender = ref(["MALE", "FEMALE"]);
const staffRoles = ref(["ADMINISTRATOR", "PETUGAS"]);

const newStaff = reactive({
  fullname: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  gender: "",
  role: "",
  address: "",
});

const newPengumuman = reactive({
  judul: "",
  isi: "",
  kategori: "",
  is_active: true,
});

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const dialog = ref({
  show: false,
  message: ''
})


const kategoriPengumumanList = ref([
  "INFORMASI",
  "EVENT",
  "PERUBAHAN_KEBIJAKAN",
  "PERINGATAN"
]);

const headers = [
  { title: "ID", key: "id" },
  { title: "Buku", key: "judul" },
  { title: "Peminjam", key: "fullname" },
  { title: "Tanggal Pinjam", key: "borrowedAt" },
  { title: "Tanggal Kembali", key: "dueDate" },
  { title: "Status", key: "status" },
];

const peminjaman = ref<Peminjaman[]>([]);

const saveStaff = async () => {
  if (!newStaff || Object.values(newStaff).some(value => !value)) {
  snackbar.value = { show: true, message: 'Please fill all required fields', color: 'error' }
return
}


  isLoading.value = true;
  try {
    const createdStaff = await $fetch("/api/users", {
      method: "POST",
      body: newStaff,
    })


    snackbar.value = { show: true, message: 'Staff created succesfully!...', color: 'success' }


  } catch (error) {
  console.error("Save Staff Error:", error);

  } finally {
    isLoading.value = false;
    dialogPetugas.value = false;
  }
};


const saveAnnouncement = async () => {
  if (!newPengumuman || Object.values(newPengumuman).some(value => !value)) {
  snackbar.value = { show: true, message: 'Please fill all required fields', color: 'error' }
return
}


  isLoading.value = true;
  try {
    const createdStaff = await $fetch("/api/announcement", {
      method: "POST",
      body: newPengumuman,
    })


    snackbar.value = { show: true, message: 'Announcement created succesfully!...', color: 'success' }


  } catch (error) {
  console.error("Save Announcement Error:", error);

  } finally {
    isLoading.value = false;
    dialogPengumuman.value = false;
  }
}

const downloadReport = async () => {
  if (!selectedMonth.value || !selectedYear.value || !selectedReportType.value) {
    alert("Silakan pilih jenis laporan, bulan, dan tahun terlebih dahulu!");
    return;
  }

  const url = `/api/reports/monthly-report?month=${selectedMonth.value}&year=${selectedYear.value}&type=${selectedReportType.value}&print=true`;

  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const fileName = `Laporan_${selectedReportType.value}_${selectedMonth.value}_${selectedYear.value}.pdf`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
    alert("Laporan berhasil diunduh!");
  } catch (error) {
    console.error("Error saat mengunduh laporan:", error);
    alert("Gagal mengunduh laporan.");
  }
};



const getStatusColor = (status: StatusPinjaman) => {
  // if (status === "Dipinjam") return "green";
  // if (status === "Mendekati Deadline") return "orange";
  // if (status === "Terlambat") return "red";
  if (status === "DIPINJAM") return "green";
  if (status === "MENDEKATI_TANGGAL_PENGEMBALIAN") return "orange";
  if (status === "TERLAMBAT") return "red";
  return "grey";
};

async function getBookFromApi() {
  const response = await $fetch("/api/books", {
    method: "GET",
  });

  // console.log("API Response:", response.items);
  // console.log("API Total Book Response:", response.total);

  totalBook.value = response.total;
}

async function getUsersFromApi() {
  const response = await $fetch("/api/users", {
    method: "GET",
  });

  // console.log("API Response:", response.items);
  // console.log("API Total User Response:", response.total);

  totalUser.value = response.total;
}

async function getLoansFromApi() {
  const response = await $fetch("/api/loans", {
    method: "GET",
  });

  // console.log("API Response:", response.items);
  // console.log("API Total Loan Response:", response.total);

  peminjaman.value = response.items.map((loan) => ({
    id: loan.id,
    borrowedAt: loan.borrowedAt,
    dueDate: loan.dueDate,
    status: loan.status,
    judul: loan.book?.judul || "Tidak diketahui",
    fullname: loan.user?.fullname || "Tidak diketahui",
  }));

  const activeLoans = response.items.filter((loan) =>
    [
      "DIAJUKAN",
      "DISETUJUI",
      "DIPINJAM",
      "DIPERPANJANG",
      "MENDEKATI_TANGGAL_PENGEMBALIAN",
    ].includes(loan.status)
  );

  const lateLoans = response.items.filter((loan) =>
    ["TERLAMBAT"].includes(loan.status)
  );

  totalLoan.value = activeLoans.length;
  lateLoan.value = lateLoans.length;
}

async function checkRole() {
  if (data?.role !== "ADMINISTRATOR" || data?.role !== "PETUGAS") {
    router.push("/dashboard");
  }
}

onMounted(async () => {
  await getBookFromApi();
  await getUsersFromApi();
  await getLoansFromApi();
  await checkRole();
});
</script>

<style>
.v-input .v-label {
  font-size: 12px;
}
</style>
