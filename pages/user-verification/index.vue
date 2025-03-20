<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          label="Search User..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
        ></v-text-field>
      </v-card-title>

      <v-table v-if="filteredUsers.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>NIK</th>
            <th>Verified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>
              <v-btn variant="outlined" color="primary" @click="viewNIK(user.nik)">
                View NIK
              </v-btn>
            </td>
            <td>
              <v-chip :color="user.is_verify ? 'green' : 'red'">
                {{ user.is_verify ? "Verified" : "Pending" }}
              </v-chip>
            </td>
            <td>
              <v-btn
                color="success"
                :disabled="user.is_verify || loading[user.id]"
                :loading="loading[user.id]"
                @click="verifyUser(user.id)"
              >
                Verify
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Pagination -->
      <v-pagination
        v-model="page"
        :length="totalPages"
        @update:model-value="fetchUsers"
      ></v-pagination>
    </v-card>

    <!-- Dialog untuk NIK -->
    <v-dialog v-model="nikDialog" max-width="500px">
      <v-card>
        <v-card-title>NIK Preview</v-card-title>
        <v-card-text>
          <v-img :src="`${selectedNIK}`" max-height="300"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="nikDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar Notifikasi -->
    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>

  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  allowedRoles: ['ADMINISTRATOR'] as const
})

import { ref, computed } from "vue";
import { useLazyFetch, useFetch } from "#app";

const users = ref([]);
const search = ref("");
const nikDialog = ref(false);
const selectedNIK = ref("");
const loading = ref({});
const page = ref(1);
const totalPages = ref(1);

// State untuk Snackbar
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");

// Fetch data dengan pagination
const fetchUsers = async () => {
  const { data, pending } = await useLazyFetch(`/api/admin/users?page=${page.value}`);
  if (!pending.value) {
    users.value = data.value?.users || [];
    totalPages.value = data.value?.totalPages || 1;
    console.log(data.value);
  }
};

// Auto fetch saat halaman berubah
fetchUsers();

const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.email.toLowerCase().includes(search.value.toLowerCase())
  );
});

const viewNIK = (nikPath) => {
  if (!nikPath) return;

  const filename = nikPath.split('/').pop(); 
  selectedNIK.value = `/api/nik/${filename}`; 
  nikDialog.value = true;

  // console.log("Final NIK URL:", selectedNIK.value);
};

const verifyUser = async (userId) => {
  loading.value[userId] = true;
  try {
    const { error } = await useFetch("/api/admin/verify-user", {
      method: "PATCH",
      body: { userId }
    });

    if (error.value) {
      throw new Error(error.value.message);
    }

    await fetchUsers();
    snackbarMessage.value = "User berhasil diverifikasi!";
    snackbarColor.value = "green";
  } catch (err) {
    snackbarMessage.value = "Gagal memverifikasi user!";
    snackbarColor.value = "red";
  } finally {
    snackbar.value = true;
    loading.value[userId] = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
