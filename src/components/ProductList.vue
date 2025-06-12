<template>
  <v-container class="product-list-container" fluid>
    <v-row>
      <!-- Sidebar Navigation Drawer for Categories -->
      <v-navigation-drawer
        app
        permanent
        width="240"
        class="category-sidebar"
        color="#f5f7fa"
        style="border-right: 1.5px solid #FFD700;"
      >
        <div class="sidebar-title font-weight-bold mb-4 mt-2" style="font-size:1.2rem; color:#0a174e;">Categories</div>
        <v-list nav dense>
          <v-list-item
            :active="!selectedCategory"
            @click="selectedCategory = ''"
            class="category-list-item"
          >
            <v-list-item-title>All</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="cat in categories"
            :key="cat"
            :active="selectedCategory === cat"
            @click="selectedCategory = cat"
            class="category-list-item"
          >
            <v-list-item-title>{{ cat }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <!-- Sort filter below categories -->
        <div class="sidebar-sort-title mt-6 mb-2" style="margin-left:16px; color:#0a174e; font-weight:600; font-size:1.05rem;">Sort By</div>
        <v-list nav dense>
          <v-list-item
            :active="sortOption === 'popular'"
            @click="sortOption = 'popular'"
            class="sidebar-sort-item"
          >
            <v-list-item-title>Popular</v-list-item-title>
          </v-list-item>
          <v-list-item
            :active="sortOption === 'price-asc'"
            @click="sortOption = 'price-asc'"
            class="sidebar-sort-item"
          >
            <v-list-item-title>Price: Low to High</v-list-item-title>
          </v-list-item>
          <v-list-item
            :active="sortOption === 'price-desc'"
            @click="sortOption = 'price-desc'"
            class="sidebar-sort-item"
          >
            <v-list-item-title>Price: High to Low</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-col>
        <v-row class="mb-6" align="center" justify="space-between">
          <v-col cols="12" md="6">
            <h1 class="display-1 text-black font-weight-bold mb-2">Products</h1>
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
          <v-col cols="12" md="2">
            <v-select
              v-model="sortOption"
              :items="sortOptions"
              label="Sort by"
              clearable
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="product-card" elevation="8" hover @click="openProduct(product)">
              <div class="product-image-wrapper">
                <v-img :src="product.image" height="200px" class="product-image" cover></v-img>
              </div>
              <v-card-title class="product-title emphasized-title text-truncate">{{ product.title }}</v-card-title>
              <v-card-subtitle class="product-category text-uppercase text-grey-darken-1">{{ product.category }}</v-card-subtitle>
              <v-card-text class="product-description">
                {{ getCuriosityDescription(product.description) }}
              </v-card-text>
              <v-card-actions class="d-flex justify-space-between align-center">
                <div class="product-price font-weight-bold">₱{{ (product.price * 58).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                {{ formatSold(product.sold) }} sold
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

        <!-- View Details Modal -->
        <ProductDetailsModal
          :show="showModal"
          :product="selectedProduct"
          :colors="availableColors"
          @close="showModal = false"
        />

        <!-- Add Product Dialog -->
        <AddProductModal
          :show="showAddProduct"
          @add="addProductFromModal"
          @close="showAddProduct = false"
        />
        <v-btn color="primary" class="add-product-btn" @click="showAddProduct = true" prepend-icon="mdi-plus">
          Add Product
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import axios from 'axios';
import AddProductModal from './AddProductModal.vue';
import ProductDetailsModal from './ProductDetailsModal.vue';

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
  components: { AddProductModal, ProductDetailsModal },
  setup() {
    const products = ref<Product[]>([]);
    const search = ref('');
    const selectedCategory = ref('');
    const categories = ref<string[]>([]);
    const showModal = ref(false);
    const selectedProduct = ref<Product | null>(null);
    const availableColors = ref<string[]>([]);
    const showAddProduct = ref(false);
    const newProduct = ref({
      title: '',
      price: '',
      description: '',
      category: '',
      image: ''
    });

    // Sort options
    const sortOptions = ref([
      { title: 'Popular', value: 'popular' },
      { title: 'Price: Low to High', value: 'price-asc' },
      { title: 'Price: High to Low', value: 'price-desc' }
    ]);
    const sortOption = ref('popular');

    const fetchProducts = async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      // Add fake sold and available data for demo
      products.value = response.data.map((p: Product) => ({
        ...p,
        sold: Math.floor(Math.random() * 500) + 10, // 10-509 sold
        available: Math.floor(Math.random() * 100) + 1 // 1-100 available
      }));
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
      // Sort logic
      if (sortOption.value === 'popular') {
        filtered = [...filtered].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
      } else if (sortOption.value === 'price-asc') {
        filtered = [...filtered].sort((a, b) => a.price - b.price);
      } else if (sortOption.value === 'price-desc') {
        filtered = [...filtered].sort((a, b) => b.price - a.price);
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

    function addProduct() {
      if (!newProduct.value.title || !newProduct.value.price || !newProduct.value.description || !newProduct.value.category || !newProduct.value.image) return;
      const id = products.value.length ? Math.max(...products.value.map(p => p.id)) + 1 : 1;
      products.value.unshift({
        id,
        title: newProduct.value.title,
        price: parseFloat(newProduct.value.price),
        description: newProduct.value.description,
        category: newProduct.value.category,
        image: newProduct.value.image
      });
      showAddProduct.value = false;
      newProduct.value = { title: '', price: '', description: '', category: '', image: '' };
    }

    function addProductFromModal(product: any) {
      const id = products.value.length ? Math.max(...products.value.map(p => p.id)) + 1 : 1;
      products.value.unshift({
        id,
        title: product.title,
        price: parseFloat(product.price),
        description: product.description,
        category: product.category,
        image: product.image
      });
      showAddProduct.value = false;
    }

    function formatSold(sold: number = 0) {
      if (sold >= 1000) {
        return (sold / 1000).toFixed(sold % 1000 === 0 ? 0 : 1) + 'K';
      }
      return sold.toString();
    }

    onMounted(fetchProducts);

    return {
      products, search, selectedCategory, categories, filteredProducts, downloadProducts,
      showModal, selectedProduct, openProduct, getCuriosityDescription, availableColors,
      showAddProduct, newProduct, addProduct, addProductFromModal,
      sortOptions, sortOption, formatSold
    };
  }
});
</script>

<style scoped>
.product-list-container {
  background: #fff;
  min-height: 100vh;
  padding-top: 32px;
  padding-bottom: 32px;
}
.product-card {
  border-radius: 18px;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  background: #fff;
  border: 1.5px solid #FFD700;
  color: #0a174e;
  padding-bottom: 8px;
}
.product-card:hover {
  box-shadow: 0 8px 32px rgba(10, 23, 78, 0.12);
  transform: translateY(-4px) scale(1.03);
  border-color: #FFD700;
}
.product-image-wrapper {
  padding: 16px;
  background: transparent;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  overflow: hidden;
}
.product-image {
  object-fit: contain;
  background: transparent;
  border-radius: 12px;
  width: 100%;
  height: 180px;
  max-width: 180px;
  max-height: 180px;
  display: block;
  margin: 0 auto;
}
.product-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0;
  color: #0a174e;
  letter-spacing: 0.5px;
  text-align: left;
}
.emphasized-title {
  text-shadow: 0 2px 8px rgba(25, 51, 102, 0.10);
}
.product-category {
  font-size: 0.85rem;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  color: #193366;
}
.product-description {
  font-size: 0.98rem;
  color: #193366;
  min-height: 60px;
  font-style: italic;
}
.product-price {
  font-size: 1.2rem;
  background-color: #193366;
  color: #FFD700;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
}
.product-meta {
  font-size: 0.9rem;
  color: #193366;
}
.sold-count, .available-count {
  display: inline-block;
  margin-right: 16px;
}

/* Modal styles */
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
.v-btn, .v-btn--variant-elevated {
  background: linear-gradient(90deg, #FFD700 0%, #fffbe6 100%);
  color: #0a174e !important;
  font-weight: 700;
  border-radius: 8px;
  border: none;
}
.v-btn:hover {
  background: linear-gradient(90deg, #fffbe6 0%, #FFD700 100%);
  color: #0a174e !important;
}
.v-select, .v-text-field {
  background: #f5f7fa;
  color: #0a174e;
  border-radius: 8px;
}
.v-select input, .v-text-field input {
  color: #0a174e;
}
.v-alert {
  background: #f5f7fa !important;
  color: #0a174e !important;
  border-color: #FFD700 !important;
}
.v-chip {
  background: #FFD700 !important;
  color: #0a174e !important;
  font-weight: 700;
}
.add-product-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 1001;
  box-shadow: 0 4px 24px rgba(25,51,102,0.18);
}
.category-sidebar {
  min-width: 200px;
  max-width: 260px;
  background: #f5f7fa !important;
  border-right: 1.5px solid #FFD700;
  padding-top: 24px;
}
.sidebar-title {
  color: #0a174e;
  font-size: 1.2rem;
  margin-left: 16px;
}
.category-list-item {
  cursor: pointer;
  border-radius: 8px;
  margin: 2px 8px;
  transition: background 0.2s;
}
.category-list-item[active], .category-list-item.v-list-item--active {
  background: #FFD700 !important;
  color: #0a174e !important;
}


@media (max-width: 960px) {
  .category-sidebar {
    display: none;
  }
}
</style>
