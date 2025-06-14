import { ref, watch } from 'vue';

/**
 * @param {{ show: boolean }} props
 * @param {(event: string, ...args: any[]) => void} emit
 */
export function useAddProductModal(props, emit) {
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

/**
 * Composable for EditProductModal logic
 * @param {{ show: boolean, product: any }} props
 * @param {(event: string, ...args: any[]) => void} emit
 */
export function useEditProductModal(props, emit) {
  const form = ref({ ...props.product });
  const categories = ref([
    'electronics',
    'jewelery',
    "men's clothing",
    "women's clothing"
  ]);

  watch(() => props.product, (newVal) => {
    form.value = { ...newVal };
  });

  function onUpdate() {
    emit('update', { ...form.value });
  }

  return { form, onUpdate, categories };
}
