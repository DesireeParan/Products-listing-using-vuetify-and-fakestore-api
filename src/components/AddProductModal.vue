<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card class="edit-product-modal">
      <v-btn icon class="modal-close-btn" @click="$emit('close')" aria-label="Close">
        <v-icon color="#0a174e">mdi-close</v-icon>
      </v-btn>
      <v-card-title class="edit-modal-title">
        <v-icon color="#FFD700" class="mr-2">mdi-plus-box</v-icon>
        Add New Product
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onAddProduct">
          <v-text-field v-model="form.title" label="Title" required prepend-inner-icon="mdi-tag" class="mb-3 gold-input" />
          <v-text-field v-model="form.price" label="Price" type="number" required prepend-inner-icon="mdi-currency-php" class="mb-3 gold-input" />
          <v-textarea v-model="form.description" label="Description" required prepend-inner-icon="mdi-text" class="mb-3 gold-input" rows="2" auto-grow />
          <v-select
            v-model="form.category"
            :items="categories"
            label="Category"
            required
            prepend-inner-icon="mdi-shape"
            class="mb-3 gold-input"
            clearable
          />
          <v-text-field v-model="form.image" label="Image URL" required prepend-inner-icon="mdi-image" class="mb-3 gold-input" />
          <v-row class="mb-3">
            <v-col class="quantity-col" cols="12">
              <label class="font-weight-bold mb-1">Quantity</label>
              <div class="d-flex align-center justify-center quantity-btn-group">
                <v-btn
                  size="large"
                  @click="decrementQuantity"
                  :disabled="form.quantity <= 1"
                  class="mr-2 quantity-btn"
                  variant="tonal"
                  aria-label="Decrease quantity"
                >
                  <v-icon size="28">mdi-minus</v-icon>
                </v-btn>
                <div class="quantity-value text-h6 font-weight-bold px-4" style="min-width: 48px; text-align: center; ">
                  {{ form.quantity }}
                </div>
                <v-btn
                  size="large"
                  @click="incrementQuantity"
                  class="ml-2 quantity-btn"
                  variant="tonal"
                  aria-label="Increase quantity"
                >
                  <v-icon size="28">mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer />
            <v-btn type="submit" prepend-icon="mdi-content-save" class="edit-save-btn">Add Product</v-btn>
            <v-btn @click="$emit('close')" class="edit-cancel-btn">Close</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAddProductModal } from '@/assets/js/modal.js';


export default defineComponent({
  name: 'AddProductModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['add', 'close'],
  setup(props, { emit }) {
    // Use the composable from modal.js
    return useAddProductModal(props, emit);
  }
});
</script>

<style src="@/assets/css//modal.css"></style>
