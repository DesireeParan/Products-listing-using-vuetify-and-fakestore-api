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
          <v-row class="mb-2">
            <v-col cols="12">
              <label class="font-weight-bold mb-1" style="color:#0a174e;">Quantity</label>
              <div class="d-flex align-center">
                <v-btn icon size="small" @click="decrementQuantity" :disabled="form.quantity <= 1">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <v-text-field
                  v-model.number="form.quantity"
                  type="number"
                  min="1"
                  style="max-width: 80px; text-align: center;"
                  hide-details
                  class="mx-2"
                />
                <v-btn icon size="small" @click="incrementQuantity">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
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
      image: '',
      quantity: 1
    });

    watch(() => props.show, (val) => {
      if (!val) {
        form.value = { title: '', price: '', description: '', category: '', image: '', quantity: 1 };
      }
    });

    function incrementQuantity() {
      form.value.quantity++;
    }
    function decrementQuantity() {
      if (form.value.quantity > 1) form.value.quantity--;
    }

    function onAddProduct() {
      if (!form.value.title || !form.value.price || !form.value.description || !form.value.category || !form.value.image) return;
      emit('add', { ...form.value });
      form.value = { title: '', price: '', description: '', category: '', image: '', quantity: 1 };
    }

    return { form, onAddProduct, incrementQuantity, decrementQuantity };
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
