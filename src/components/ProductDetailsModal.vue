<template>
  <v-dialog v-model="show" max-width="800px">
    <v-card class="modal-card">
      <v-row>
        <v-col cols="12" md="6" class="modal-description-col">
          <h2 class="modal-title">{{ product?.title }}</h2>
          <div class="modal-category text-uppercase text-grey-darken-1 mb-2">{{ product?.category }}</div>
          <div class="modal-description mb-4">{{ product?.description }}</div>
          <div class="modal-price mb-2">Price: <span class="font-weight-bold">${{ product?.price.toFixed(2) }}</span></div>
          <div class="modal-colors mb-2">
            <span class="font-weight-bold">Available Colors:</span>
            <v-chip v-for="color in colors" :key="color" class="ma-1" color="primary" text-color="white">{{ color }}</v-chip>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="modal-image-col d-flex align-center justify-center">
          <v-img :src="product?.image" height="320px" max-width="100%" class="modal-image" cover></v-img>
        </v-col>
      </v-row>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" text @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default defineComponent({
  name: 'ProductDetailsModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    product: {
      type: Object as PropType<Product | null>,
      default: null
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  emits: ['close']
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
.modal-category {
  font-size: 0.95rem;
  letter-spacing: 1px;
  color: #193366;
}
.modal-description {
  font-size: 1.05rem;
  color: #193366;
  margin-bottom: 1.5rem;
}
.modal-price {
  font-size: 1.2rem;
  color: #FFD700;
}
.modal-colors {
  margin-bottom: 1rem;
}
.modal-image-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-image {
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(10,23,78,0.10);
  background: #f5f7fa;
}
</style>
