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
            <!-- Product Table -->
            <v-data-table :headers="headers" :items="products" class="elevation-1 custom-table" item-key="id" :items-per-page="5">
              <template #item.image="{ item }">
                <v-img :src="item.image" max-width="60" max-height="60" class="rounded" />
              </template>
              <template #item.title="{ item }">
                <span class="font-weight-bold">{{ item.title }}</span>
              </template>
              <template #item.price="{ item }">
                <span class="product-price navy-blur-bg">₱{{ (item.price * 58).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </template>
              <template #item.description="{ item }">
                <span class="table-description">{{ item.description }}</span>
              </template>
              <template #item.quantity="{ item }">
                <span>{{ item.available ?? '-' }}</span>
              </template>
              <template #item.category="{ item }">
                <span>{{ item.category }}</span>
              </template>
              <template #item.actions="{ item }">
                <v-btn icon color="primary" @click="editProduct(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                <v-btn icon color="error" @click="deleteProduct(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
              </template>
            </v-data-table>
            <!-- Add Product Modal -->
            <AddProductModal :show="showAddProduct" @add="addProductFromModal" @close="showAddProduct = false" />
            <!-- Edit Product Dialog -->
            <v-dialog v-model="showEditDialog" max-width="600px">
              <v-card>
                <v-card-title>Edit Product</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="onUpdate">
                    <v-text-field v-model="form.title" label="Title" required prepend-inner-icon="mdi-tag" class="mb-3" />
                    <v-text-field v-model="form.price" label="Price" type="number" required prepend-inner-icon="mdi-currency-usd" class="mb-3" />
                    <v-textarea v-model="form.description" label="Description" required prepend-inner-icon="mdi-text" class="mb-3" rows="2" auto-grow />
                    <v-text-field v-model="form.category" label="Category" required prepend-inner-icon="mdi-shape" class="mb-3" />
                    <v-text-field v-model="form.image" label="Image URL" required prepend-inner-icon="mdi-image" class="mb-3" />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn color="primary" type="submit" prepend-icon="mdi-content-save">Update</v-btn>
                      <v-btn color="error" @click="cancelEdit">Cancel</v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import ProductList from './ProductList.vue';
import AddProductModal from './AddProductModal.vue';
import { ref, onMounted, defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AddProduct',
  components: { AddProductModal },
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
      { text: 'Image', value: 'image', sortable: false },
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

    function onUpdate() {
      const idx = products.value.findIndex(p => p.id === form.value.id);
      if (idx !== -1) {
        products.value[idx] = { ...form.value };
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

    return { products, form, headers, showAddProduct, showEditDialog, onSubmit, editProduct, onUpdate, deleteProduct, cancelEdit, addProductFromModal };
  }
});
</script>

<style scoped>
.add-product-container {
  background: #fff;
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
.custom-table .v-data-table__wrapper {
  background: #fff !important;
}
.navy-blur-bg {
  background: rgba(10, 23, 78, 0.18);
  backdrop-filter: blur(2px);
  border-radius: 8px;
  padding: 4px 12px;
  color: #FFD700;
  font-size: 1.1rem;
  display: inline-block;
}
.table-description {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
</style>
