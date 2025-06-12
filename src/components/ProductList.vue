<template>
  <v-container class="product-list-container" fluid>
    <v-row class="mb-6" align="center" justify="space-between">
      <v-col cols="12" md="6">
        <h1 class="display-1 font-weight-bold mb-2">Shop Products</h1>
        <div class="subtitle-1 text-grey-darken-1 mb-4">Discover the best deals and latest trends</div>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end align-center">
        <v-btn color="primary" @click="downloadProducts" size="large" prepend-icon="mdi-download">
          Download Products JSON
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Search products..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Filter by Category"
          clearable
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="product-card" elevation="8" hover>
          <div class="product-image-wrapper">
            <v-img :src="product.image" height="200px" class="product-image" cover></v-img>
          </div>
          <v-card-title class="product-title emphasized-title text-truncate">{{ product.title }}</v-card-title>
          <v-card-subtitle class="product-category text-uppercase text-grey-darken-1">{{ product.category }}</v-card-subtitle>
          <v-card-text class="product-description">
            {{ getCuriosityDescription(product.description) }}
          </v-card-text>
          <v-card-actions class="d-flex justify-space-between align-center">
            <div class="product-price font-weight-bold">${{ product.price.toFixed(2) }}</div>
            <v-btn color="primary" variant="elevated" size="small" @click="openProduct(product)">View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="filteredProducts.length === 0">
      <v-col cols="12" class="text-center">
        <v-alert type="info" border="start" color="primary" variant="tonal">
          No products found.
        </v-alert>
      </v-col>
    </v-row>
    <v-dialog v-model="showModal" max-width="800px">
      <v-card class="modal-card">
        <v-row>
          <v-col cols="12" md="6" class="modal-description-col">
            <h2 class="modal-title">{{ selectedProduct?.title }}</h2>
            <div class="modal-category text-uppercase text-grey-darken-1 mb-2">{{ selectedProduct?.category }}</div>
            <div class="modal-description mb-4">{{ selectedProduct?.description }}</div>
            <div class="modal-price mb-2">Price: <span class="font-weight-bold">${{ selectedProduct?.price.toFixed(2) }}</span></div>
            <div class="modal-colors mb-2">
              <span class="font-weight-bold">Available Colors:</span>
              <v-chip v-for="color in availableColors" :key="color" class="ma-1" color="primary" text-color="white">{{ color }}</v-chip>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="modal-image-col d-flex align-center justify-center">
            <v-img :src="selectedProduct?.image" height="320px" max-width="100%" class="modal-image" cover></v-img>
          </v-col>
        </v-row>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="primary" text @click="showModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const COLOR_PALETTE = [
  'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange', 'Gray', 'Pink'
];

export default defineComponent({
  name: 'ProductList',
  setup() {
    const products = ref<Product[]>([]);
    const search = ref('');
    const selectedCategory = ref('');
    const categories = ref<string[]>([]);
    const showModal = ref(false);
    const selectedProduct = ref<Product | null>(null);
    const availableColors = ref<string[]>([]);

    const fetchProducts = async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      products.value = response.data;
      categories.value = Array.from(new Set(response.data.map((p: Product) => p.category)));
    };

    const downloadProducts = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products.value, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "products.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    const filteredProducts = computed(() => {
      let filtered = products.value;
      if (search.value) {
        const s = search.value.toLowerCase();
        filtered = filtered.filter(
          p =>
            p.title.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.category.toLowerCase().includes(s)
        );
      }
      if (selectedCategory.value) {
        filtered = filtered.filter(p => p.category === selectedCategory.value);
      }
      return filtered;
    });

    function getCuriosityDescription(desc: string) {
      if (desc.length > 60) {
        return desc.slice(0, 60) + '... Discover more!';
      }
      return desc + '... Discover more!';
    }

    function openProduct(product: Product) {
      selectedProduct.value = product;
      // Randomly pick 3-5 colors for demo
      availableColors.value = COLOR_PALETTE.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
      showModal.value = true;
    }

    onMounted(fetchProducts);

    return {
      products, search, selectedCategory, categories, filteredProducts, downloadProducts,
      showModal, selectedProduct, openProduct, getCuriosityDescription, availableColors
    };
  }
});
</script>

<style scoped>
.product-list-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding-top: 32px;
  padding-bottom: 32px;
}
.product-card {
  border-radius: 18px;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  background: #fff;
  padding-bottom: 8px;
}
.product-card:hover {
  box-shadow: 0 8px 32px rgba(60,60,60,0.18);
  transform: translateY(-4px) scale(1.03);
}
.product-image-wrapper {
  padding: 18px 18px 0 18px;
  background: #f8f8f8;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-image {
  object-fit: contain;
  background: transparent;
  border-radius: 12px;
}
.product-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0;
  color: #222;
  letter-spacing: 0.5px;
  text-align: left;
}
.emphasized-title {
  text-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}
.product-category {
  font-size: 0.85rem;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}
.product-description {
  font-size: 0.98rem;
  color: #555;
  min-height: 60px;
  font-style: italic;
}
.product-price {
  font-size: 1.2rem;
  color: #1976d2;
}

/* Modal styles */
.modal-card {
  border-radius: 18px;
  padding: 24px 12px 12px 12px;
  background: #fff;
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #222;
}
.modal-category {
  font-size: 0.95rem;
  letter-spacing: 1px;
}
.modal-description {
  font-size: 1.05rem;
  color: #444;
  margin-bottom: 1.5rem;
}
.modal-price {
  font-size: 1.2rem;
  color: #1976d2;
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
  box-shadow: 0 4px 24px rgba(60,60,60,0.10);
  background: #f8f8f8;
}
@media (max-width: 960px) {
  .modal-image-col {
    margin-top: 24px;
  }
}
</style>
