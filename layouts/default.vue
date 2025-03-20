<template>
  <!-- Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" :temporary="isMobile" :permanent="!isMobile" app>
    <v-list>
      <!-- Logo and Title -->
      <v-list-item class="py-4">
        <v-row align="center" no-gutters>
          <v-col cols="2">
            <v-img src="/logo.png" alt="Perpustakaan Logo" max-height="40" max-width="40" contain />
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
      <v-list-item title="Home" to="/home" />
      <v-list-item title="Katalog Buku" to="/katalog" />
      <v-list-item title="Pinjaman Saya" to="/pinjaman" />
      <v-list-item title="Riwayat" to="/riwayat" />
      <v-list-item title="Favorit" to="/favorit" />
      <v-list-item title="Denda" to="/denda" />
      <!-- <v-list-item title="Notifikasi" to="/notifikasi" /> -->
    </v-list>
  </v-navigation-drawer>

  <!-- App Bar -->
  <v-app-bar app>
    <v-app-bar-nav-icon @click="toggleDrawer" v-if="isMobile" />

    <v-spacer />

    <!-- Profile Button -->
    <v-btn text to="/user">
      <v-avatar size="32" class="mr-2">
        <v-img src="/admin-avatar.png" alt="Admin Avatar" />
      </v-avatar>
    </v-btn>

    <!-- Dropdown Menu -->
    <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn text v-bind="props">
          <v-icon>{{ menu ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </template>

      <v-card max-width="300" class="mt-2">
        <v-list>
          <v-list-item to="/languages">
            <v-list-item-title>
              <v-icon class="mr-2">mdi-translate</v-icon> Languages
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/settings">
            <v-list-item-title> <v-icon class="mr-2">mdi-cog</v-icon> Settings </v-list-item-title>
          </v-list-item>
          <v-list-item to="/faq">
            <v-list-item-title>
              <v-icon class="mr-2">mdi-comment-question</v-icon> FAQ
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/user/logout">
            <v-list-item-title> <v-icon class="mr-2">mdi-logout</v-icon> Logout </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>

  <!-- Main Content -->
  <v-main>
    <v-container>
      <slot />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
const drawer = ref(false)
const menu = ref(false)
const isMobile = ref(process.client ? window.innerWidth < 960 : false)

const updateScreenSize = () => {
  if (process.client) {
    isMobile.value = window.innerWidth < 960
    drawer.value = !isMobile.value
  }
}
const toggleDrawer = () => {
  drawer.value = !drawer.value
}

onMounted(() => {
  window.addEventListener("resize", updateScreenSize)
  updateScreenSize()
})

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize)
})
</script>
