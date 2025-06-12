<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Fake Store</v-toolbar-title>
      <v-spacer />
      <v-btn to="/" text>Products</v-btn>
      <v-btn to="/add" text>Add Product</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import ProductList from './components/ProductList.vue';
  //
</script>
