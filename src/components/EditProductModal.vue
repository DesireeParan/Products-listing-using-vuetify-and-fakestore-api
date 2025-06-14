<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card class="edit-product-modal">
      <v-btn icon class="modal-close-btn" @click="$emit('close')" aria-label="Close">
        <v-icon color="#0a174e">mdi-close</v-icon>
      </v-btn>
      <v-card-title class="edit-modal-title">
        <v-icon color="#FFD700" class="mr-2">mdi-pencil-box</v-icon>
        Edit Product
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onUpdate">
          <v-text-field v-model="form.title" label="Title" required prepend-inner-icon="mdi-tag" class="mb-3 gold-input" />
          <v-text-field
            :value="form.price !== undefined && form.price !== null && form.price !== '' ? `₱${(Number(form.price) * 58).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''"
            label="Price (₱)"
            prepend-inner-icon="mdi-currency-php"
            class="mb-3 gold-input"
            readonly
            persistent-hint
          />
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
          <v-card-actions>
            <v-spacer />
            <v-btn type="submit" prepend-icon="mdi-content-save" class="edit-save-btn">Update</v-btn>
            <v-btn @click="$emit('close')" class="edit-cancel-btn">Close</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useEditProductModal } from '@/assets/js/modal.js';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'EditProductModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    product: {
      type: Object as PropType<any>,
      default: () => ({})
    }
  },
  emits: ['update', 'close'],
  setup(props, { emit }) {
    // Use the composable from modal.js
    return useEditProductModal(props, emit);
  }
});
</script>

<style src="@/assets/css//modal.css"></style>
