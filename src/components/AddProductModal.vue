<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card class="edit-product-modal">
      <v-btn icon class="modal-close-btn" @click="$emit('close')" aria-label="Close">
        <v-icon color="#0a174e">mdi-close</v-icon>
      </v-btn>
      <v-card-title class="edit-modal-title">
        <v-icon color="#FFD700" class="mr-2">mdi-plus-box</v-icon>
        Add New Product
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onAddProduct">
          <v-text-field v-model="form.title" label="Title" required prepend-inner-icon="mdi-tag" class="mb-3 gold-input" />
          <v-text-field v-model="form.price" label="Price" type="number" required prepend-inner-icon="mdi-currency-php" class="mb-3 gold-input" />
          <v-textarea v-model="form.description" label="Description" required prepend-inner-icon="mdi-text" class="mb-3 gold-input" rows="2" auto-grow />
          <v-select
            v-model="form.category"
            :items="categories"
            label="Category"
            required
            prepend-inner-icon="mdi-shape"
            class="mb-3 gold-input"
            clearable
          />
          <v-text-field v-model="form.image" label="Image URL" required prepend-inner-icon="mdi-image" class="mb-3 gold-input" />
          <v-row class="mb-3">
            <v-col class="quantity-col" cols="12">
              <label class="font-weight-bold mb-1">Quantity</label>
              <div class="d-flex align-center justify-center quantity-btn-group">
                <v-btn
                  size="large"
                  @click="decrementQuantity"
                  :disabled="form.quantity <= 1"
                  class="mr-2 quantity-btn"
                  variant="tonal"
                  aria-label="Decrease quantity"
                >
                  <v-icon size="28">mdi-minus</v-icon>
                </v-btn>
                <div class="quantity-value text-h6 font-weight-bold px-4" style="min-width: 48px; text-align: center; ">
                  {{ form.quantity }}
                </div>
                <v-btn
                  size="large"
                  @click="incrementQuantity"
                  class="ml-2 quantity-btn"
                  variant="tonal"
                  aria-label="Increase quantity"
                >
                  <v-icon size="28">mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" type="submit" prepend-icon="mdi-content-save" class="edit-save-btn">Add Product</v-btn>
            <v-btn @click="$emit('close')" class="edit-cancel-btn">Close</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

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
    const categories = ref([
      'electronics',
      'jewelery',
      "men's clothing",
      "women's clothing"
    ]);

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

    return { form, onAddProduct, incrementQuantity, decrementQuantity, categories };
  }
});
</script>

<style scoped>
.edit-product-modal {
  background: #fff !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1.5px solid #FFD700;
  color: #0a174e;
  border-radius: 18px;
  padding: 24px 12px 12px 12px;
}
.edit-modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a174e;
  display: flex;
  align-items: center;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}
.gold-input .v-input__control {
  background: #f5f7fa !important;
  color: #0a174e !important;
  border-radius: 8px;
}
.gold-input input,
.gold-input textarea {
  color: #0a174e !important;
}
.edit-save-btn {
  background: linear-gradient(90deg, #FFD700 0%, #fffbe6 100%) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #0a174e !important;
  font-weight: 700;
  border-radius: 8px;
  border: none;
}
.edit-save-btn:hover {
  background: linear-gradient(90deg, #fffbe6 0%, #FFD700 100%) !important;
  color: #0a174e !important;
}
.edit-cancel-btn {
  border-radius: 8px;
  font-weight: 700;
}
.modal-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: rgba(255,255,255,0.85);
  box-shadow: 0 2px 8px rgba(10,23,78,0.10);
}
.modal-close-btn:hover {
  background: #FFD700 !important;
}
.quantity-btn-group {
  margin-top: 4px;
  margin-bottom: 4px;
}
.quantity-btn {
  transition: box-shadow 0.2s, background 0.2s;
  background: #fff !important;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.10);
}
.quantity-btn:active {
  /* background: #FFD700 !important; */
}
.quantity-value {
  user-select: none;
  font-size: 1.2rem;
  letter-spacing: 1px;
}
.quantity-col {
  display: flex;
  flex-direction: column;
  border-radius: none !important;
  align-items: center;
}
</style>
