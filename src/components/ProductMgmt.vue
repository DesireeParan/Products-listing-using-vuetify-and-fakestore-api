<template>
  <v-container class="add-product-container" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="10">
        <v-card class="add-product-card" elevation="10">
          <v-card-title class="table-list-add-product-title mb-6 d-flex align-center justify-space-between">
            <div class="d-flex align-center" style="gap: 12px;">
              <v-icon class="mr-2">mdi-plus-box</v-icon>
              Product Management
            </div>
            <div class="d-flex align-center" style="gap: 12px; ">
              <v-text-field
                v-model="search"
                placeholder="Search products..."
                dense
                hide-details
                class="table-list-search-bar"
                prepend-inner-icon="mdi-magnify"
              />
              <v-btn class="table-list-add-btn" prepend-icon="mdi-plus" @click="showAddProduct = true">Add Product</v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="table-list-headings d-flex mb-2 px-2">
              <div class="table-list-heading-col table-list-center-col" style="flex:2 0 0;">Product</div>
              <div class="table-list-heading-col table-list-center-col" style="flex:1 0 0; min-width:120px;">Price</div>
              <div class="table-list-heading-col table-list-center-col" style="flex:2 0 0;">Description</div>
              <div class="table-list-heading-col table-list-center-col" style="flex:1 0 0; min-width:90px;">Quantity</div>
              <div class="table-list-heading-col table-list-center-col" style="flex:1 0 0; min-width:120px;">Category</div>
              <div class="table-list-heading-col table-list-center-col" style="flex:1 0 0; min-width:90px;">Actions</div>
            </div>
            <!-- Product Table -->
            <v-data-table :headers="headers" :items="filteredProducts" class="elevation-1 table-list-custom-table" item-key="id" :items-per-page="5">
              <!-- Removed image slot -->
              <template #item.title="{ item }">
                <div class="table-list-center-col" style="flex:2 0 0;">{{ item.title }}</div>
              </template>
              <template #item.price="{ item }">
                <div class="table-list-center-col" style="flex:1 0 0; min-width:120px;">
                  <span class="table-list-product-price navy-blur-bg">
                    <template v-if="item.isUserAdded">
                      ₱{{ Number(item.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </template>
                    <template v-else>
                      ₱{{ (item.price * 58).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </template>
                  </span>
                </div>
              </template>
              <template #item.description="{ item }">
                <div class="table-list-center-col" style="flex:2 0 0;">
                  <span class="table-list-description">{{ item.description }}</span>
                </div>
              </template>
              <template #item.quantity="{ item }">
                <div class="table-list-center-col" style="flex:1 0 0; min-width:90px;">{{ item.available ?? '-' }}</div>
              </template>
              <template #item.category="{ item }">
                <div class="table-list-center-col" style="flex:1 0 0; min-width:120px;">{{ item.category }}</div>
              </template>
              <template #item.actions="{ item }">
                <div class="d-flex justify-center align-center table-list-action-icons" style="flex:1 0 0; min-width:90px; gap:12px;">
                  <v-btn icon class="table-list-action-btn table-list-edit-btn" @click="editProduct(item)">
                    <v-icon class="table-list-action-edit">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon class="table-list-action-btn table-list-delete-btn" @click="deleteProduct(item.id)">
                    <v-icon class="table-list-action-delete">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
            <!-- Add Product Modal -->
            <AddProductModal :show="showAddProduct" @add="addProductFromModal" @close="showAddProduct = false" />
            <!-- Edit Product Modal -->
            <EditProductModal
              :show="showEditDialog"
              :product="form"
              @update="onUpdateFromModal"
              @close="cancelEdit"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import ProductList from './ProductList.vue';
import AddProductModal from './AddProductModal.vue';
import EditProductModal from './EditProductModal.vue';
import { ref, onMounted, defineComponent, computed } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AddProduct',
  components: { AddProductModal, EditProductModal },
  setup() {
    const products = ref<any[]>([]);
    const form = ref({
      id: null,
      title: '',
      price: '',
      description: '',
      category: '',
      image: ''
    });
    const showAddProduct = ref(false);
    const showEditDialog = ref(false);
    const search = ref('');
    const headers = [
      // Removed Image column
      { text: 'Title', value: 'title' },
      { text: 'Price', value: 'price' },
      { text: 'Description', value: 'description' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Category', value: 'category' },
      { text: 'Actions', value: 'actions', sortable: false }
    ];

    // Fetch products from API (same as ProductList.vue)
    onMounted(async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      products.value = response.data.map((p: any) => ({
        ...p,
        sold: Math.floor(Math.random() * 500) + 10, // 10-509 sold
        available: Math.floor(Math.random() * 100) + 1 // 1-100 available
      }));
    });

    const filteredProducts = computed(() => {
      if (!search.value) return products.value;
      return products.value.filter((product) =>
        product.title.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    function resetForm() {
      form.value = { id: null, title: '', price: '', description: '', category: '', image: '' };
    }

    function onSubmit() {
      if (!form.value.title || !form.value.price || !form.value.description || !form.value.category || !form.value.image) return;
      const id = products.value.length ? Math.max(...products.value.map(p => p.id || 0)) + 1 : 1;
      products.value.push({ ...form.value, id });
      resetForm();
      showAddProduct.value = false;
    }

    function editProduct(item: any) {
      form.value = { ...item };
      showEditDialog.value = true;
    }

    function onUpdateFromModal(updatedProduct: any) {
      const idx = products.value.findIndex(p => p.id === updatedProduct.id);
      if (idx !== -1) {
        products.value[idx] = { ...updatedProduct };
      }
      showEditDialog.value = false;
      resetForm();
    }

    function deleteProduct(id: number) {
      products.value = products.value.filter(p => p.id !== id);
    }

    function cancelEdit() {
      showEditDialog.value = false;
      resetForm();
    }

    function addProductFromModal(product: any) {
      const id = products.value.length ? Math.max(...products.value.map(p => p.id || 0)) + 1 : 1;
      // Use the quantity from the modal as available, and use the price as entered (number)
      products.value.push({
        ...product,
        id,
        available: product.quantity ?? 1,
        price: Number(product.price), // ensure price is a number, not a string
        // Add a flag to distinguish user-added products
        isUserAdded: true
      });
      showAddProduct.value = false;
    }

    return { products, form, headers, showAddProduct, showEditDialog, onSubmit, editProduct, deleteProduct, cancelEdit, addProductFromModal, onUpdateFromModal, search, filteredProducts };
  }
});
</script>

<style scoped src="@/assets/css/table_list.css"></style>
