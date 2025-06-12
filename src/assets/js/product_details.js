// ProductDetailsModal logic extracted for external use
import { ref, computed } from 'vue';

export function useProductDetailsModal(props) {
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const quantity = ref(1);
  const isDiscounted = true; // Simulate new user or voucher
  const discountRate = 0.1;
  const conversionRate = 58.0; // 1 USD = 58 PHP (as of June 2025, update as needed)
  const discountedPrice = computed(() => {
    if (!props.product) return '';
    return (props.product.price * (1 - discountRate)).toFixed(2);
  });
  const discountedPricePHP = computed(() => {
    if (!props.product) return '';
    return (props.product.price * (1 - discountRate) * conversionRate).toFixed(2);
  });
  const shippingFee = '$4.99';
  const countries = ref(['Philippines', 'USA', 'Canada', 'UK', 'Australia', 'Singapore']);
  const citiesByCountry = {
    Philippines: ['Manila', 'Cebu', 'Davao', 'Quezon City', 'Makati'],
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
    Canada: ['Toronto', 'Vancouver', 'Montreal'],
    UK: ['London', 'Manchester', 'Birmingham'],
    Australia: ['Sydney', 'Melbourne', 'Brisbane'],
    Singapore: ['Singapore'],
  };
  const selectedCountry = ref('Philippines');
  const selectedCity = ref('Manila');
  const filteredCities = computed(() => citiesByCountry[selectedCountry.value] || []);
  function onCountryInput(val) {
    if (val && !countries.value.includes(val)) {
      countries.value.push(val);
      citiesByCountry[val] = [];
    }
  }
  function incrementQuantity() { quantity.value++; }
  function decrementQuantity() { if (quantity.value > 1) quantity.value--; }
  function getContrastColor(color) {
    const c = color.toLowerCase();
    if (["yellow", "white", "beige", "lightgray", "pink"].some(lc => c.includes(lc))) return '#222';
    return '#fff';
  }
  return {
    sizes,
    quantity,
    incrementQuantity,
    decrementQuantity,
    getContrastColor,
    isDiscounted,
    discountedPrice,
    discountedPricePHP,
    conversionRate,
    shippingFee,
    countries,
    selectedCountry,
    selectedCity,
    filteredCities,
    onCountryInput
  };
}
