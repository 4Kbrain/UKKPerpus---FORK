<template>
    <v-card class="p-4 rounded-lg shadow-lg">
      <v-card-title class="text-xl font-semibold">📌 Daftar Denda</v-card-title>
      <v-divider class="my-4"></v-divider>
      <v-card-text>
        <p class="text-sm text-gray-500">
          Daftar denda yang harus Anda bayar saat ini.
        </p>
        <p class="text-sm text-gray-500">
          Denda akan terus bertambah jika Anda belum melunasi pembayaran.
        </p>
        <v-card-title> {{ formatCurrency(totalAkumulasiDenda) }}</v-card-title>
        </v-card-text>

      <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
      <v-progress-circular v-if="loading" indeterminate color="primary" class="mt-4 mx-auto"></v-progress-circular>

      <v-table v-else-if="dendaList.length > 0">
        <thead>
          <tr>
            <th class="text-left">Buku</th>
            <th class="text-left">Jumlah Denda</th>
            <th class="text-left">Tanggal Peminjaman</th>
            <th class="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="denda in dendaList" :key="denda.id">
            <td class="flex items-center space-x-3">
              <v-img
                :src="denda.peminjaman?.book?.cover || '/default-avatar.png'"
                alt="Cover Buku"
                class="w-12 h-16 rounded-md"
              />
              <div>
                <p class="font-medium">{{ denda.peminjaman?.book?.judul ?? "Tidak diketahui" }}</p>

                <p class="text-sm text-gray-500">{{ denda.peminjaman?.book?.pengarang }}</p>
              </div>
            </td>
            <td class="font-medium text-red-600">Rp{{ formatCurrency(denda.amount) }}</td>
            <td>{{ useFormatDate(denda.peminjaman?.borrowedAt) }}</td>
            <td>
              <v-chip :color="denda.status === 'BELUM_LUNAS' ? 'error' : 'success'">
                {{ denda.status === "BELUM_LUNAS" ? "Belum Lunas" : "Lunas" }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-alert v-else type="info" class="mt-4">Tidak ada denda saat ini.</v-alert>
    </v-card>
</template>

<script setup>
const dendaList = ref([]);
const loading = ref(true);
const error = ref(0);

const totalAkumulasiDenda = ref(null);

const fetchDenda = async () => {
  try {
    const { data, error: fetchError } = await useFetch("/api/denda/me", { method: "GET" });
    if (fetchError.value) throw fetchError.value;
    dendaList.value = data.value.denda || [];
    totalAkumulasiDenda.value = data.value.totalDenda;
    console.log(totalAkumulasiDenda);
  } catch (err) {
    error.value = "Gagal mengambil data denda.";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleDateString("id-ID") : "-";
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);
};

onMounted(async() => {
  await fetchDenda();
});
</script>
