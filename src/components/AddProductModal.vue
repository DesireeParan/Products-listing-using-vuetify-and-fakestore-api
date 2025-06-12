<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card class="modal-card">
      <v-card-title class="modal-title">Add New Product</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onAddProduct">
          <v-text-field v-model="form.title" label="Title" required class="mb-2" />
          <v-text-field v-model="form.price" label="Price" type="number" required class="mb-2" />
          <v-textarea v-model="form.description" label="Description" required class="mb-2" />
          <v-text-field v-model="form.category" label="Category" required class="mb-2" />
          <v-text-field v-model="form.image" label="Image URL" required class="mb-2" />
          <v-btn type="submit" color="primary" class="mt-2">Add Product</v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" text @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';

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
    const form = ref({
      title: '',
      price: '',
      description: '',
      category: '',
      image: ''
    });

    watch(() => props.show, (val) => {
      if (!val) {
        form.value = { title: '', price: '', description: '', category: '', image: '' };
      }
    });

    function onAddProduct() {
      if (!form.value.title || !form.value.price || !form.value.description || !form.value.category || !form.value.image) return;
      emit('add', { ...form.value });
      form.value = { title: '', price: '', description: '', category: '', image: '' };
    }

    return { form, onAddProduct };
  }
});
</script>

<style scoped>
.modal-card {
  border-radius: 18px;
  padding: 24px 12px 12px 12px;
  background: #fff;
  color: #0a174e;
  border: 1.5px solid #FFD700;
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #0a174e;
}
</style>
