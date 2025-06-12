<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Add New Product</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addProduct">
              <v-text-field v-model="title" label="Title" required></v-text-field>
              <v-text-field v-model="price" label="Price" type="number" required></v-text-field>
              <v-textarea v-model="description" label="Description" required></v-textarea>
              <v-text-field v-model="category" label="Category" required></v-text-field>
              <v-text-field v-model="image" label="Image URL" required></v-text-field>
              <v-btn type="submit" color="primary">Add Product</v-btn>
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
