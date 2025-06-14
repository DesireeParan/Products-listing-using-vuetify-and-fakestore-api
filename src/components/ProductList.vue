<template>
  <v-container class="product-list-modern" fluid>
    <v-row>
      <v-col>
        <v-row class="mb-8 align-center justify-space-between border pb-4 ms-lg-1">
          <v-col cols="12" md="8">
            <h1 class="modern-title mb-2">Shop</h1>
            <div class="modern-subtitle mb-4">
              <v-icon color="#FFD700" class="mr-2">mdi-star-four-points</v-icon>
              <span>Discover curated products, exclusive deals, and new arrivals.</span>
            </div>
          </v-col>
        </v-row>
        <v-row class="mb-6 align-center ms-lg-1">
          <v-col cols="12" md="12">
            <div class="searchbar-row d-flex align-center">
              <div class="filter-group" style="min-width:0;">
                <label class="filter-label">Search</label>
                <v-text-field
                  v-model="search"
                  placeholder="Search products..."
                  label=""
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  class="search-bar-modern"
                  hide-details
                />
              </div>
              <div class="inline-category-sort-group d-flex align-center" style="gap: 0.5rem;">
                <div class="filter-group" style="min-width:90px;">
                  <label class="filter-label">Min Price (₱)</label>
                  <v-text-field
                    v-model.number="minPrice"
                    placeholder="0"
                    label=""
                    type="number"
                    dense
                    hide-details
                    class="simple-dropdown"
                  />
                </div>
                <div class="filter-group" style="min-width:90px;">
                  <label class="filter-label">Max Price (₱)</label>
                  <v-text-field
                    v-model.number="maxPrice"
                    placeholder="10000"
                    label=""
                    type="number"
                    dense
                    hide-details
                    class="simple-dropdown"
                  />
                </div>
              </div>
              <div class="inline-category-sort-group d-flex align-center" style="gap: 0.5rem;">
                <div class="filter-group" >
                  <label class="filter-label">Category</label>
                  <v-select
                    v-model="selectedCategory"
                    :items="['', ...categories]"
                    :item-title="cat => cat === '' ? 'All' : cat"
                    :item-value="cat => cat"
                    label=""
                    dense
                    hide-details
                    class="simple-dropdown"
                  />
                </div>
                <div class="filter-group" style="min-width:120px;">
                  <label class="filter-label">Sort</label>
                  <v-select
                    v-model="sortOption"
                    :items="sortOptions"
                    item-title="title"
                    item-value="value"
                    label=""
                    dense
                    hide-details
                    class="simple-dropdown"
                  />
                </div>
              </div>
              <div style="flex:1;"></div>
            </div>
          </v-col>
        </v-row>
        <v-row class="product-grid-modern" dense>
          <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="product-card-modern" elevation="2" hover @click="openProduct(product)">
              <v-img :src="product.image" height="180px" class="product-image-modern" cover></v-img>
              <v-card-title class="product-title-modern text-truncate">{{ product.title }}</v-card-title>
              <v-card-subtitle class="product-category-modern text-uppercase">{{ product.category }}</v-card-subtitle>
              <v-card-text class="product-description-modern">
                {{ getCuriosityDescription(product.description) }}
              </v-card-text>
              <v-card-actions class="d-flex justify-space-between align-center">
                <div class="product-price-modern">₱{{ (product.price * 58).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                <span class="sold-modern">{{ formatSold(product.sold) }} sold</span>
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
        <!-- Floating Message Icon Button -->
        <v-btn icon class="message-btn-modern" aria-label="Messages">
          <v-icon size="30" color="#0a174e">mdi-message-outline</v-icon>
        </v-btn>
        <v-btn color="primary" class="add-product-btn-modern" @click="showAddProduct = true" prepend-icon="mdi-plus">
          Add Product
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { sharedProducts, sharedCategories } from './productStore';
import AddProductModal from './AddProductModal.vue';
import ProductDetailsModal from './ProductDetailsModal.vue';
import { getCuriosityDescription, formatSold } from '../assets/js/product_list.js';
import type { Product } from './types';
import type { Ref } from 'vue';

const COLOR_PALETTE = [
  'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange', 'Gray', 'Pink'
];

export default defineComponent({
  /**
   * ProductList component
   * @see {import('./types').Product}
   */
  name: 'ProductList',
  components: { AddProductModal, ProductDetailsModal },
  setup() {
    // Use shared state
    const products = sharedProducts;
    const categories = sharedCategories;
    const search = ref('');
    const selectedCategory = ref('');
    const showModal = ref(false);
    const selectedProduct = ref(null) as Ref<any>;
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
    const minPrice = ref<number | null>(null);
    const maxPrice = ref<number | null>(null);

    const fetchProducts = async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      const apiProducts = response.data.map((p: any) => ({
        ...p,
        sold: Math.floor(Math.random() * 500) + 10,
        available: Math.floor(Math.random() * 100) + 1
      }));
      // Only set if not already loaded
      if (products.value.length === 0) {
        products.value.push(...apiProducts);
      }
      categories.value.splice(
        0,
        categories.value.length,
        ...Array.from(new Set(apiProducts.map((p: any) => p.category as string))) as string[]
      );
      // Load user-added products
      const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      for (const up of userProducts) {
        if (!products.value.some(p => p.id === up.id)) {
          products.value.unshift(up);
        }
      }
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
      if (minPrice.value !== null) {
        filtered = filtered.filter(p => p.price * 58 >= minPrice.value!);
      }
      if (maxPrice.value !== null) {
        filtered = filtered.filter(p => p.price * 58 <= maxPrice.value!);
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

    // --- Sync with localStorage for cross-page persistence ---
    // Load user-added products from localStorage
    onMounted(async () => {
      if (products.value.length === 0) {
        const response = await axios.get('https://fakestoreapi.com/products');
        const apiProducts = response.data.map((p: any) => ({
          ...p,
          sold: Math.floor(Math.random() * 500) + 10,
          available: Math.floor(Math.random() * 100) + 1
        }));
        products.value.push(...apiProducts);
        categories.value.splice(
          0,
          categories.value.length,
          ...Array.from(new Set(apiProducts.map((p: any) => p.category as string))) as string[]
        );

      }
      // Load user-added products
      const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      for (const up of userProducts) {
        if (!products.value.some(p => p.id === up.id)) {
          products.value.unshift(up);
        }
      }
    });

    // Save user-added products to localStorage whenever a new one is added
    function addProductFromModal(product: any) {
      const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      const id = userProducts.length ? Math.max(...userProducts.map((p: any) => p.id)) + 1 : (products.value.length ? Math.max(...products.value.map(p => p.id)) + 1 : 1);
      const userProduct = {
        id,
        title: product.title,
        price: parseFloat(product.price),
        description: product.description,
        category: product.category,
        image: product.image,
        available: product.quantity ?? 1,
        sold: 0,
        isUserAdded: true
      };
      products.value.unshift(userProduct);
      userProducts.unshift(userProduct);
      localStorage.setItem('userProducts', JSON.stringify(userProducts));
      showAddProduct.value = false;
    }

    onMounted(fetchProducts);

    return {
      products, search, selectedCategory, categories, filteredProducts, downloadProducts,
      showModal, selectedProduct, openProduct, getCuriosityDescription, availableColors,
      showAddProduct, newProduct, addProduct, addProductFromModal,
      sortOptions, sortOption, formatSold, minPrice, maxPrice
    };
  }
});
</script>

<style scoped>
.product-list-modern {
  background: linear-gradient(120deg, #ffffff 0%, #f5f7fa 100%);
  min-height: 100vh;
  padding-top: 32px;
  padding-bottom: 32px;
}
.category-sidebar-modern {
  min-width: 180px;
  max-width: 220px;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding-top: 32px;
}
.sidebar-title-modern {
  color: #0a174e;
  font-size: 1.25rem;
  font-weight: 700;
  margin-left: 8px;
  letter-spacing: 1px;
}
.category-box-group-modern {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.category-box-btn-modern {
  background: transparent !important;
  border: none !important;
  color: #0a174e !important;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
  margin-bottom: 2px;
  box-shadow: none !important;
}
.category-box-btn-modern.active,
.category-box-btn-modern[aria-pressed="true"] {
  text-decoration: underline;
  background: transparent !important;
  color: #FFD700 !important;
}
.sidebar-sort-title-modern {
  color: #0a174e;
  font-size: 1.05rem;
  font-weight: 600;
  margin-left: 8px;
  letter-spacing: 0.5px;
}
.sort-box-group-modern {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.sort-box-btn-modern {
  background: transparent !important;
  border: none !important;
  color: #0a174e !important;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
  margin-bottom: 2px;
  box-shadow: none !important;
}
.sort-box-btn-modern.active,
.sort-box-btn-modern[aria-pressed="true"] {
  text-decoration: underline;
  background: transparent !important;
  color: #FFD700 !important;
}
.modern-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0a174e;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}
.modern-subtitle {
  font-size: 1.15rem;
  color: #193366;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.search-bar-modern {
  width: 800px;
  max-width: 100%;
  border-radius: 8px;
  background: #ffffff !important;
  color: #0a174e !important;
}
.search-bar-modern .v-input__control {
  background: transparent !important;
  border-radius: 0;
  border: none !important;
  border-bottom: 2px solid #0a174e !important;
  color: #0a174e !important;
}
.search-bar-modern input {
  color: #0a174e !important;
  font-size: 1.08rem;
  font-weight: 700;
  background: transparent !important;
}

.inline-category-box-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.inline-sort-box-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.product-grid-modern {
  margin-top: 12px;
  margin: 0 auto;
  row-gap: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.product-card-modern {
  border-radius: 4px !important;
  background: #fff;
  border: 1.5px solid #a8a8a8;
  color: #0a174e;
  cursor: pointer;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 10px;
}
.product-card-modern:hover {
  transform: translateY(-4px) scale(1.03);
  border-color: #0a174e;
}
.product-image-modern {
  object-fit: contain;
  background: #f8fafc;
  width: 100%;
  height: 180px;
  max-width: 180px;
  max-height: 180px;
  margin: 20px auto;

}
.product-title-modern {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0a174e;
  letter-spacing: 0.5px;
  margin-top: 8px;
  margin-bottom: 0;
  text-align: left;
}
.product-category-modern {
  font-size: 0.85rem;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  color: #193366;
}
.product-description-modern {
  font-size: 0.98rem;
  color: #193366;
  min-height: 48px;
  font-style: italic;
  margin-bottom: 0.5rem;
}
.product-price-modern {
  font-size: 1.15rem;
  background: linear-gradient(90deg, #FFD700 0%, #fffbe6 100%);
  color: #0a174e;
  padding: 0.2rem 0.7rem;
  border-radius: 8px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.10);
}
.sold-modern {
  font-size: 0.98rem;
  color: #193366;
  font-weight: 500;
}
.add-product-btn-modern {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 1001;
  background: linear-gradient(90deg, #FFD700 0%, #fffbe6 100%) !important;
  color: #0a174e !important;
  font-weight: 700;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(25,51,102,0.18);
  font-size: 1.1rem;
}
.message-btn-modern {
  position: fixed;
  bottom: 92px;
  right: 40px;
  z-index: 1002;
  background: #fff !important;
  color: #0a174e !important;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(25,51,102,0.10);
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.message-btn-modern:hover {
  background: #FFD700 !important;
  color: #0a174e !important;
}
.simple-dropdown .v-input__control {
  background: #fff !important;
  border-radius: 6px !important;
  border: 1px solid #e0e0e0 !important;
  box-shadow: none !important;
}
.simple-dropdown .v-field__input {
  color: #222 !important;
  font-size: 0.98rem !important;
}
.simple-dropdown .v-label {
  color: #0a174e !important;
}
.searchbar-row {
  width: 100%;
  gap: 0.8rem;
}
.filter-label {
  font-size: 0.95rem;
  color: #0a174e !important;
  font-weight: 600;
  display: block;
}
.filter-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: #0a174e !important;
  /* width: 300px; */
}
@media (max-width: 960px) {
  .category-sidebar-modern {
    display: none;
  }
  .add-product-btn-modern {
    right: 16px;
    bottom: 16px;
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
  }
  .message-btn-modern {
    right: 24px;
    bottom: 76px;
  }
  .search-bar-modern {
    width: 100%;
    border-radius: 8px;
    background: #ffffff !important;
    color: #0a174e !important;
  }
  .simple-dropdown .v-input__control {
    background: #fff !important;
    border-radius: 6px !important;
    border: 1px solid #e0e0e0 !important;
    box-shadow: none !important;
  }
  .simple-dropdown .v-field__input {
    color: #222 !important;
    font-size: 0.98rem !important;
  }
  .simple-dropdown .v-label {
    color: #0a174e !important;
  }
  .searchbar-row {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1.2rem;
  }
  .filter-label {
    font-size: 0.95rem;
    color: #0a174e !important;
    font-weight: 600;
    margin-bottom: 2px;
    display: block;
  }
  .filter-group {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    color: #0a174e !important;
    width: 100%;
  }
}
</style>
