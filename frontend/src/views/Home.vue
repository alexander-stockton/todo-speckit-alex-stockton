<script setup>
import { computed } from "vue";
import Utils from "../config/utils.js";
import authServices from "../services/authServices.js";

const user = computed(() => Utils.getStore("user"));

const handleSignOut = async () => {
  await authServices.logoutUser();
};
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <h1 class="text-h4 mb-4">Welcome, {{ user?.fName }}!</h1>
        <v-btn color="primary" variant="elevated" class="oc-cta" @click="handleSignOut">
          Sign out
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
