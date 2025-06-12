<template>
  <v-dialog v-model="show" max-width="1200px" height="900px" persistent>
    <v-card class="modal-card">
      <v-row>
        <v-col cols="12" class="d-flex justify-end align-center pa-0">
          <v-btn icon class="modal-close-btn" @click="$emit('close')" aria-label="Close">
            <v-icon color="#0a174e">mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6" class="modal-image-col ">
          <v-img :src="product?.image" height="520px" max-width="100%" class="modal-image" cover></v-img>
          <div class="modal-sizes mb-2">
            <span class="font-weight-bold">Sizes:</span>
            <div class="sizes-box">
              <div v-for="size in sizes" :key="size" class="size-box">{{ size }}</div>
            </div>
          </div>
          <div class="modal-colors mb-2">
            <span class="font-weight-bold">Colors:</span>
            <div class="colors-box">
              <div v-for="color in colors" :key="color" class="color-box" :style="{ backgroundColor: color.toLowerCase(), color: getContrastColor(color) }">
                {{ color }}
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="modal-description-col">
          <h2 class="modal-title">{{ product?.title }}</h2>
          <div class="modal-category text-uppercase text-grey-darken-1 mb-2">{{ product?.category }}</div>
          <div class="d-flex align-center mb-2">
            <v-rating :model-value="product?.rating?.rate || 4.5" color="#FFD700" background-color="#e0e0e0" half-increments readonly size="24" class="mr-2" />
            <span class="modal-rating-text">{{ product?.rating?.rate || 4.5 }} ({{ product?.rating?.count || 120 }} reviews)</span>
          </div>
          <div class="modal-description mb-4">{{ product?.description }}</div>
          <div class="modal-price mb-2">
            <span v-if="isDiscounted" class="discount-message">
              <v-icon class="voucher-icon mr-2" color="white">mdi-ticket-percent</v-icon>
              New User Voucher! <span class="discount-highlight">10% OFF</span>
            </span>
            <span v-if="isDiscounted">
              <span class="original-price">₱{{ (product?.price * conversionRate).toFixed(2) }}</span>
              <span class="discounted-price">₱{{ (discountedPricePHP) }}</span>
            </span>
            <span v-else>
              Price: <span class="font-weight-bold">₱{{ (product?.price * conversionRate).toFixed(2) }}</span>
            </span>
          </div>

          <div class="shipping-info mb-2">
            <span class="shipping-fee">
              <v-icon class="shipping-icon mr-1" color="white">mdi-truck-delivery</v-icon>
              Shipping Fee: <span class="font-weight-bold">${{ shippingFee }}</span>
            </span>
            <span class="shipping-guarantee">Shipping Guarantee: <span class="guarantee-highlight">100% Delivery or Money Back</span></span>
          </div>
          <div class="shipping-to mb-4">
            <span class="font-weight-bold">Shipping to:</span>
            <v-select
              v-model="selectedCountry"
              :items="countries"
              label="Country"
              class="shipping-select mr-2"
              dense
              outlined
              hide-details
              style="max-width: 160px;"
              :allow-new="true"
              :menu-props="{ closeOnContentClick: false }"
              @update:search-input="onCountryInput"
            />
            <v-select
              v-model="selectedCity"
              :items="filteredCities"
              label="City"
              class="shipping-select"
              dense
              outlined
              hide-details
              style="max-width: 160px;"
              :disabled="!selectedCountry"
            />
          </div>


          <div class="modal-quantity mb-4">
            <span class="font-weight-bold">Quantity:</span>
            <div class="quantity-box d-flex align-center mt-2">
              <v-btn icon size="small" @click="decrementQuantity" :disabled="quantity <= 1">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <v-text-field
                v-model.number="quantity"
                min="1"
                type="number"
                hide-details
                class="quantity-input"
                style="max-width: 5rem; min-width: 2rem; text-align: center;"
                :step="1"
                :readonly="false"
                :single-line="true"
              />
              <v-btn icon size="small" @click="incrementQuantity">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="modal-actions d-flex justify-center w-100 mb-4">
            <v-btn class="mr-2 action-buy" size="large">Buy Now</v-btn>
            <v-btn variant="outlined action-cart" size="large">
              <v-icon class="cart-icon mr-2" color="white">mdi-cart</v-icon>
              Add to Cart
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useProductDetailsModal } from '@/assets/js/product_details.js';

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
  emits: ['close'],
  setup(props) {
    return useProductDetailsModal(props);
  }
});
</script>

<style src="@/assets/css/product_details.css"></style>

<style>
/* Add style for the close button */
.modal-close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 10;
  background: rgba(255,255,255,0.85);
  box-shadow: 0 2px 8px rgba(10,23,78,0.10);
}
.modal-close-btn:hover {
  background: #FFD700 !important;
}
</style>
