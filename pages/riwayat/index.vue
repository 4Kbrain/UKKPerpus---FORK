<script setup>
const { data: riwayat, pending } = useFetch('/api/riwayat');

const statusIcons = {
  DIPINJAM: 'mdi-book-open',
  DIPERPANJANG: 'mdi-calendar-refresh',
  DIKEMBALIKAN: 'mdi-check-circle',
  DIAJUKAN: 'mdi-clock',
  DITOLAK: 'mdi-close-circle',
};
</script>

<template>
  <v-container>
    <h1 class="text-h5 font-weight-bold mb-4">Riwayat Peminjaman</h1>

    <v-skeleton-loader v-if="pending" type="list-item"></v-skeleton-loader>

    <v-row v-else>
      <v-col v-for="peminjaman in riwayat" :key="peminjaman.id" cols="12" md="6">
        <v-card elevation="3" class="pa-3">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">{{ statusIcons[peminjaman.status] || 'mdi-book' }}</v-icon>
            {{ peminjaman.book.judul }}
          </v-card-title>

          <v-card-subtitle>
            📅 {{ new Date(peminjaman.borrowedAt).toLocaleDateString() }} → 
            {{ peminjaman.returnedAt ? new Date(peminjaman.returnedAt).toLocaleDateString() : 'Belum dikembalikan' }}
          </v-card-subtitle>

          <v-card-text>
            <v-chip :color="peminjaman.status === 'DIPINJAM' ? 'blue' : peminjaman.status === 'DIKEMBALIKAN' ? 'green' : 'orange'">
              {{ peminjaman.status }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
