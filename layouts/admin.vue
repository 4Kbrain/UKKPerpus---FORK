<template>
  <!-- Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" :temporary="isMobile" :permanent="!isMobile" app>
    <v-list>
      <!-- Logo and Title -->
      <v-list-item class="py-4">
        <v-row align="center" no-gutters>
          <v-col cols="2">
            <v-img 
              src="/logo.png" 
              alt="Perpustakaan Logo" 
              max-height="40" 
              max-width="40"
              contain
            />
          </v-col>
          <v-col cols="10">
            <v-list-item-title class="text-h8 font-weight-bold ml-2">
              Perpustakaan
            </v-list-item-title>
          </v-col>
        </v-row>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Navigation Links -->
      <v-list-item title="Dashboard" to="/dashboard" />
      <v-list-item title="Kelola Buku" to="/book-management" />
      <v-list-item title="Anggota" to="/user-management" />
      <v-list-item title="Verifikasi Pengguna Baru" to="/user-verification" />
      <v-list-item title="Peminjaman" to="/loan-management" />
      <v-list-item title="Denda" to="/denda-management" />
      <v-list-item title="Pengumuman" to="/announcement-management" />
      <v-list-item title="Laporan" to="/reports" />
      <v-list-item title="Pengaturan" to="/settings" />
    </v-list>
  </v-navigation-drawer>

  <!-- App Bar -->
  <v-app-bar app>
    <v-app-bar-nav-icon @click="toggleDrawer" v-if="isMobile" />
    <v-app-bar-title>Admin Panel</v-app-bar-title>
    <v-spacer />
    
    <!-- Profile Button -->
    <v-btn text to="/user">
      <v-avatar size="32" class="mr-2">
        <v-img src="/admin-avatar.png" alt="Admin Avatar" />
      </v-avatar>
      {{ data?.user?.fullname || "Loading..." }}
    </v-btn>
  </v-app-bar>
  
  <!-- Main Content  -->
  <v-main>
    <v-container>
      <slot />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "#imports";

const { data } = useAuth();
const drawer = ref(false);
const isMobile = ref(process.client ? window.innerWidth < 960 : false);

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 960;
  if (process.client) {
  if (!isMobile.value) {
    drawer.value = true; // Biarkan drawer terbuka di desktop
  } else {
    drawer.value = false; // Tutup drawer di mobile
  }
}
};

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

onMounted(() => {
  window.addEventListener("resize", updateScreenSize);
  updateScreenSize();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>
