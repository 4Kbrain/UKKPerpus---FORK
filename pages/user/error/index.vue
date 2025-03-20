<template>
    <v-container class="d-flex justify-center align-center" style="height: 100vh;">
      <v-row justify="center">
        <v-col cols="12" md="6" class="text-center">
          <v-icon size="200" color="error">mdi-alert-circle-outline</v-icon>
          <v-card class="pa-6 mt-4">
            <v-card-title class="text-h5">
              Unauthorized Access
            </v-card-title>
            <v-card-text>
              <p v-if="errorMessage">{{ errorMessage }}</p>
              <p v-else>An unexpected error occurred.</p>
              <p class="text-caption text-grey">
                Redirecting to login in {{ countdown }} seconds...
              </p>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn color="primary" @click="$router.push('/user/login')">Go to Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
    definePageMeta({
    layout: 'blank',
    auth: { unauthenticatedOnly: true, navigateAuthenticated: '/user/login' }
    })

  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const errorMessage = typeof route.query.error === 'string'
    ? decodeURIComponent(route.query.error)
    : 'Unauthorized access.';
  const countdown = ref(3);
  
  onMounted(() => {
    const interval = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(interval);
        router.push('/user/login');
      }
    }, 1000);
  });
  </script>
  