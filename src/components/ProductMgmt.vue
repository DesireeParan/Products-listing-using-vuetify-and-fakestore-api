<template>
  <v-container class="add-product-container" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="10">
        <v-card class="add-product-card" elevation="10">
          <v-card-title class="add-product-title">
            <v-icon color="gold" class="mr-2">mdi-plus-box</v-icon>
            Product Management
            <v-spacer />
            <v-btn color="primary" class="add-btn" prepend-icon="mdi-plus" @click="showAddProduct = true">Add Product</v-btn>
          </v-card-title>
          <v-card-text>
            <div class="table-headings d-flex mb-2 px-2">
              <div class="heading-col center-col" style="flex:2 0 0;">Product</div>
              <div class="heading-col center-col" style="flex:1 0 0; min-width:120px;">Price</div>
              <div class="heading-col center-col" style="flex:2 0 0;">Description</div>
              <div class="heading-col center-col" style="flex:1 0 0; min-width:90px;">Quantity</div>
              <div class="heading-col center-col" style="flex:1 0 0; min-width:120px;">Category</div>
              <div class="heading-col center-col" style="flex:1 0 0; min-width:90px;">Actions</div>
            </div>
            <!-- Product Table -->
            <v-data-table :headers="headers" :items="products" class="elevation-1 custom-table" item-key="id" :items-per-page="5">
              <!-- Removed image slot -->
              <template #item.title="{ item }">
                <div class="center-col" style="flex:2 0 0;">{{ item.title }}</div>
              </template>
              <template #item.price="{ item }">
                <div class="center-col" style="flex:1 0 0; min-width:120px;">
                  <span class="product-price navy-blur-bg">₱{{ (item.price * 58).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
              </template>
              <template #item.description="{ item }">
                <div class="center-col" style="flex:2 0 0;">
                  <span class="table-description">{{ item.description }}</span>
                </div>
              </template>
              <template #item.quantity="{ item }">
                <div class="center-col" style="flex:1 0 0; min-width:90px;">{{ item.available ?? '-' }}</div>
              </template>
              <template #item.category="{ item }">
                <div class="center-col" style="flex:1 0 0; min-width:120px;">{{ item.category }}</div>
              </template>
              <template #item.actions="{ item }">
                <div class="d-flex justify-center align-center action-icons" style="flex:1 0 0; min-width:90px; gap:12px;">
                  <v-btn icon class="action-btn edit-btn" @click="editProduct(item)">
                    <v-icon class="action-edit">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon class="action-btn delete-btn" @click="deleteProduct(item.id)">
                    <v-icon class="action-delete">mdi-delete</v-icon>
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
import { ref, onMounted, defineComponent } from 'vue';
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
      products.value.push({ ...product, id, available: product.available ?? 1 });
      showAddProduct.value = false;
    }

    return { products, form, headers, showAddProduct, showEditDialog, onSubmit, editProduct, deleteProduct, cancelEdit, addProductFromModal, onUpdateFromModal };
  }
});
</script>

<style scoped>
.add-product-container {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 32px;
  padding-bottom: 32px;
}
.add-product-card {
  border-radius: 18px;
  background: #fff;
  color: #0a174e;
  border: 1.5px solid #FFD700;
  box-shadow: 0 8px 32px rgba(10, 23, 78, 0.10);
}
.add-product-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0a174e;
  display: flex;
  align-items: center;
  letter-spacing: 1px;
  padding-bottom: 8px;
}
.add-product-form .v-text-field,
.add-product-form .v-textarea {
  background: #f5f7fa;
  color: #0a174e;
  border-radius: 8px;
}
.add-product-form input,
.add-product-form textarea {
  color: #0a174e !important;
}
.add-btn {
  background: linear-gradient(90deg, #FFD700 0%, #fffbe6 100%);
  color: #0a174e !important;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  margin-top: 12px;
}
.add-btn:hover {
  background: linear-gradient(90deg, #fffbe6 0%, #FFD700 100%);
  color: #0a174e !important;
}
.custom-table {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
    color: #0a174e;
  background: transparent;
}
.custom-table .v-data-table__wrapper {
  background-color: #f6f4f4 !important;
}

.table-description {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.action-icons .v-btn {
  background: transparent !important;
  box-shadow: none !important;
  margin: 0 2px;
}
.action-icons .v-btn:hover {
  background: #f5f7fa !important;
}
.action-edit {
  color: #0a174e !important; /* Vuetify blue */
}
.action-delete {
  color: #d32f2f !important; /* Vuetify red */
}
.table-headings {
  font-weight: 700;
  color: #0a174e;
  background: #f5f7fa;
  border-radius: 8px 8px 0 0;
  font-size: 1.05rem;
  align-items: center;
  text-align: center;
}
.heading-col {
  padding: 12px 8px 12px 0;
  text-align: center;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  display: flex;
}
.center-col {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
}
.table-image-col {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
}
.table-image {
  border-radius: 8px;
  object-fit: cover;
  background: #f5f7fa;
  border: 1px solid #e0e0e0;
}
.action-icons {
  gap: 12px;
  margin-top: 2px;
  margin-bottom: 2px;
}
.action-btn {
  box-shadow: none !important;
  margin: 0 2px;
  transition: background 0.2s;
}
.edit-btn {
  background: #1976d2 !important; /* Vuetify blue */
  border: none !important;
}
.edit-btn:hover {
  background: #1565c0 !important;
}
.delete-btn {
  background: #d32f2f !important; /* Vuetify red */
  border: none !important;
}
.delete-btn:hover {
  background: #b71c1c !important;
}
</style>
