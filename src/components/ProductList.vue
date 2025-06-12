<template>
  <v-container class="product-list-modern" fluid>
    <v-row>
      <!-- Sidebar Navigation Drawer for Categories -->
      <v-navigation-drawer
        app
        permanent
        width="220"
        class="category-sidebar-modern"
        color="#f8fafc"
        style="border-right: 1.5px solid #FFD700;"
      >
        <div class="sidebar-title-modern mb-4 mt-2">Categories</div>
        <div class="category-box-group-modern">
          <v-btn
            v-for="cat in ['All', ...categories]"
            :key="cat"
            :class="['category-box-btn-modern', { active: selectedCategory === (cat === 'All' ? '' : cat) }]"
            rounded
            size="small"
            @click="selectedCategory = (cat === 'All' ? '' : cat)"
          >
            {{ cat }}
          </v-btn>
        </div>
        <div class="sidebar-sort-title-modern mt-8 mb-2">Sort By</div>
        <div class="sort-box-group-modern">
          <v-btn
            v-for="opt in sortOptions"
            :key="opt.value"
            :class="['sort-box-btn-modern', { active: sortOption === opt.value }]"
            rounded
            size="small"
            @click="sortOption = opt.value"
          >
            {{ opt.title }}
          </v-btn>
        </div>
      </v-navigation-drawer>
      <v-col>
        <v-row class="mb-8 align-center justify-space-between">
          <v-col cols="12" md="8">
            <h1 class="modern-title mb-2">Shop</h1>
            <div class="modern-subtitle mb-4">
              <v-icon color="#FFD700" class="mr-2">mdi-star-four-points</v-icon>
              <span>Discover curated products, exclusive deals, and new arrivals.</span>
            </div>
          </v-col>
        </v-row>
        <v-row class="mb-6 align-center">
          <v-col cols="12" md="8" class="d-flex align-center">
            <v-text-field
              v-model="search"
              label="Search for anything..."
              prepend-inner-icon="mdi-magnify"
              clearable
              class="search-bar-modern"
              hide-details
              style="flex:1; min-width:0;"
            />
            <div class="searchbar-icons-modern d-flex align-center ml-4" style="gap: 1.2rem;">
              <v-btn icon variant="text" class="icon-btn-modern" aria-label="Cart">
                <v-icon size="28" color="#0a174e">mdi-cart-outline</v-icon>
              </v-btn>
              <v-btn icon variant="text" class="icon-btn-modern" aria-label="Notifications">
                <v-icon size="28" color="#0a174e">mdi-bell-outline</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <!-- Inline Category and Sort Controls -->
        <v-row class="mb-6 align-center justify-space-between">
          <v-col cols="12" md="8">
            <div class="inline-category-sort-group d-flex align-center flex-wrap" style="gap: 1.5rem;">
              <div class="inline-category-box-group d-flex align-center flex-wrap" style="gap: 0.5rem;">
                <span class="mr-2" style="font-weight:600;color:#0a174e;">Category:</span>
                <v-btn
                  v-for="cat in ['All', ...categories]"
                  :key="cat + '-inline'"
                  :class="['category-box-btn-modern', { active: selectedCategory === (cat === 'All' ? '' : cat) }]"
                  rounded
                  size="small"
                  @click="selectedCategory = (cat === 'All' ? '' : cat)"
                >
                  {{ cat }}
                </v-btn>
              </div>
              <div class="inline-sort-box-group d-flex align-center flex-wrap" style="gap: 0.5rem;">
                <span class="mr-2" style="font-weight:600;color:#0a174e;">Sort by:</span>
                <v-btn
                  v-for="opt in sortOptions"
                  :key="opt.value + '-inline'"
                  :class="['sort-box-btn-modern', { active: sortOption === opt.value }]"
                  rounded
                  size="small"
                  @click="sortOption = opt.value"
                >
                  {{ opt.title }}
                </v-btn>
              </div>
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
        return desc.slice(0, 60) + '...';
      }
      return desc + '...';
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
  width: 100%;
  margin: 0 auto;
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
  box-shadow: none !important;
}
.search-bar-modern input {
  color: #0a174e !important;
  font-size: 1.08rem;
  font-weight: 700;
  background: transparent !important;
}
.inline-category-sort-group {
  margin-bottom: 2rem;
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
  row-gap: 32px;
  /* column-gap: 10px; */
  margin: 0 auto;
  display: flex;
}
.product-card-modern {
  border-radius: 4px !important;
  background: #fff;
  border: 1.5px solid #FFD700;
  color: #0a174e;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  padding: 1.5rem;
  max-width: 350px;
  min-height: 370px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 0 !important;
}
.product-card-modern:hover {
  transform: translateY(-4px) scale(1.03);
  border-color: #FFD700;
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
  border-radius: 12px;
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
    width: 46px;
    height: 46px;
  }
}
</style>
