<template>
  <Breadcrumbs variant="default" :show-home-icon="true" />

  <v-row>
    <!-- Judul Laporan -->
    <v-col cols="12" class="d-flex">
      <div>
        <!-- <span class="text-h6 font-weight-bold" @click="printReports"> Cetak Laporan </span> -->
        <!-- <span class="text-caption font-weight-light">
            Silakan isi informasi lengkap tentang buku yang akan ditambahkan.
        </span> -->
      </div>
    </v-col>
    <v-divider class="mb-4" />

    <v-col cols="12">  
      <card-title class="text-subtitle-1">Filter Laporan</card-title>
    </v-col>

    <!-- Input： Jenis Laporan  -->
    <v-col cols="12">
      <v-label class="text-caption font-weight-light mb-2">
        Jenis Laporan *
      </v-label>
      <v-select
        v-model="reportType"
        :items="['Semua','Peminjaman', 'Pengembalian', 'Denda']"
        variant="outlined"
        />
    </v-col>

        <!-- Input： Status Laporan  -->
    <!-- <v-col cols="12" md="6">
      <v-label class="text-caption font-weight-light mb-2">
        Status *
      </v-label>
      <v-text-field
        v-model="reportStatus"
        placeholder="Status Laporan"
        variant="outlined"
      />
    </v-col> -->

    <!-- Input: Dari Tanggal -->
    <v-col cols="12" md="6">
      <v-label class="text-caption font-weight-light mb-2">
        Dari Tanggal *
      </v-label>
      <v-text-field
        v-model="borrowDate"
        placeholder="Tanggal Awal"
        type="date"
        variant="outlined"
      />
    </v-col>

    <!-- Input: Sampai Tanggal -->
    <v-col cols="12" md="6">
      <v-label class="text-caption font-weight-light mb-2">
        Sampai Tanggal *
      </v-label>
      <v-text-field
        v-model="dueDate"
        placeholder="Tanggal Akhir"
        type="date"
        variant="outlined"
      />
    </v-col>
    <v-col cols="12" class="d-flex justify-end">
  <v-btn color="success" variant="outlined" :loading="loading" @click="fetchReports">
    Lihat Laporan
  </v-btn>
  <v-btn class="ml-4" color="primary" variant="outlined" :loading="loading" @click="generateLaporan">
    Unduh PDF
  </v-btn>
</v-col>

  </v-row>

  <v-divider class="my-4"></v-divider>

  <v-row>
    <v-col cols="12" class="d-flex">
      <div class="d-flex align-center justify-center text-center">
        <span class="text-h6 font-weight-bold"> Pritinjau Laporan </span>
        <!-- <span class="text-caption font-weight-light">
            Silakan isi informasi lengkap tentang buku yang akan ditambahkan.
        </span> -->
      </div>

    </v-col>
  </v-row>

  <v-row>
  <v-col cols="12">
    <v-data-table
      v-if="reports.length"
      :headers="headers"
      :items="reports"
      item-value="id"
      class="elevation-1"
    ></v-data-table>
    <p v-else class="text-center text-caption text-grey-darken-1">
      Tidak ada data laporan yang tersedia.
    </p>
  </v-col>
</v-row>

</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

definePageMeta({ layout: "admin", allowedRoles: ['PETUGAS', 'ADMINISTRATOR'] as const });

const borrowDate = ref(new Date().toISOString().substr(0, 10));
const dueDate = ref(new Date().toISOString().substr(0, 10));
const reports = ref<any[]>([]);
const reportType = ref("Peminjaman");
const loading = ref(false); // Tambahkan indikator loading

const headers = [
  { title: "ID", key: "id" },
  { title: "Nama", key: "name" },
  { title: "Tanggal", key: "date" },
  { title: "Tipe", key: "type" },
];

const fetchReports = async () => {
  console.log(`/api/reports?type=${reportType.value}&start=${borrowDate.value}&end=${dueDate.value}`);
  loading.value = true; 
  try {
    const response = await fetch(
      `/api/reports?type=${reportType.value}&start=${borrowDate.value}&end=${dueDate.value}`
    );
    if (!response.ok) throw new Error("Gagal mengambil data laporan");

    const data = await response.json();
    reports.value = data;
    
    console.log("Data laporan setelah fetch:", reports.value);
  } catch (error) {
    console.error("Error fetching reports:", error);
  } finally {
    loading.value = false;
  }
};


const generateLaporan = async () => {
  try {
    loading.value = true;

    const response = await fetch(
      `/api/reports?type=${reportType.value}&start=${borrowDate.value}&end=${dueDate.value}&print=true`,
      {
        headers: {
          "Accept": "application/pdf",
        },
      }
    );

    if (!response.ok) throw new Error("Gagal mengunduh laporan");

    const blob = await response.blob();
    console.log("Blob size:", blob.size); // Debugging ukuran file

    if (blob.size === 0) {
      throw new Error("File PDF kosong");
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-${reportType.value}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url); // Bersihkan URL blob
  } catch (error) {
    console.error("Error generate laporan:", error);
  } finally {
    loading.value = false;
  }
};


// Ambil laporan saat halaman pertama kali dibuka
onMounted(fetchReports);
</script>

