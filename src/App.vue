<template>
  <v-app>
    <v-app-bar app class="gold-navbar" elevation="4">
      <v-toolbar-title class="gold-title">
        <v-icon color="#FFD700" class="mr-2">mdi-storefront</v-icon>
        MDP Store
      </v-toolbar-title>
      <v-spacer />
      <v-btn to="/" class="gold-nav-btn" variant="text">Products</v-btn>
      <v-btn to="/add" class="gold-nav-btn" variant="text">Add Product</v-btn>
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

<style scoped>
.gold-navbar {
  background: linear-gradient(90deg, #0a174e 0%, #193366 100%);
  border-bottom: 2px solid #FFD700;
}
.gold-title {
  color: #FFD700;
  font-weight: 700;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}
.gold-nav-btn {
  color: #FFD700 !important;
  font-weight: 700;
  font-size: 1.05rem;
  border-radius: 8px;
  margin-left: 8px;
  transition: background 0.2s, color 0.2s;
}
.gold-nav-btn:hover {
  background: linear-gradient(90deg, #FFD700 0%, #fffbe6 100%);
  color: #0a174e !important;
}
.v-main {
  background: #fff !important;
}
</style>
