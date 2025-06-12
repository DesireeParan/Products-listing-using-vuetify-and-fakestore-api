<template>
  <v-container class="add-product-container" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="6">
        <v-card class="add-product-card" elevation="10">
          <v-card-title class="add-product-title">
            <v-icon color="gold" class="mr-2">mdi-plus-box</v-icon>
            Add New Product
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addProduct" class="add-product-form">
              <v-text-field v-model="title" label="Title" required prepend-inner-icon="mdi-tag" class="mb-3" />
              <v-text-field v-model="price" label="Price" type="number" required prepend-inner-icon="mdi-currency-usd" class="mb-3" />
              <v-textarea v-model="description" label="Description" required prepend-inner-icon="mdi-text" class="mb-3" rows="3" auto-grow />
              <v-text-field v-model="category" label="Category" required prepend-inner-icon="mdi-shape" class="mb-3" />
              <v-text-field v-model="image" label="Image URL" required prepend-inner-icon="mdi-image" class="mb-3" />
              <v-btn type="submit" color="primary" size="large" block class="add-btn" prepend-icon="mdi-plus">Add Product</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AddProduct',
  setup() {
    const title = ref('');
    const price = ref('');
    const description = ref('');
    const category = ref('');
    const image = ref('');

    const addProduct = () => {
      // Here you would send a POST request to your backend or API
      alert(`Product Added: ${title.value}`);
      // Reset form
      title.value = '';
      price.value = '';
      description.value = '';
      category.value = '';
      image.value = '';
    };

    return { title, price, description, category, image, addProduct };
  }
});
</script>

<style scoped>
.add-product-container {
  background: #fff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 32px;
  padding-bottom: 32px;
}
.add-product-card {
  border-radius: 18px;
  background: #fff;
  color: #0a174e;
  border: 1.5px solid #FFD700;
  box-shadow: 0 8px 32px rgba(10, 23, 78, 0.10);
}
.add-product-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0a174e;
  display: flex;
  align-items: center;
  letter-spacing: 1px;
  padding-bottom: 8px;
}
.add-product-form .v-text-field,
.add-product-form .v-textarea {
  background: #f5f7fa;
  color: #0a174e;
  border-radius: 8px;
}
.add-product-form input,
.add-product-form textarea {
  color: #0a174e !important;
}
.add-btn {
  background: linear-gradient(90deg, #FFD700 0%, #fffbe6 100%);
  color: #0a174e !important;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  margin-top: 12px;
}
.add-btn:hover {
  background: linear-gradient(90deg, #fffbe6 0%, #FFD700 100%);
  color: #0a174e !important;
}
</style>
