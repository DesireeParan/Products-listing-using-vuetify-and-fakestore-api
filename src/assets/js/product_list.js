// Utility functions moved from ProductList.vue

export function getCuriosityDescription(desc) {
  if (desc.length > 60) {
    return desc.slice(0, 60) + '...';
  }
  return desc + '...';
}

export function formatSold(sold = 0) {
  if (sold >= 1000) {
    return (sold / 1000).toFixed(sold % 1000 === 0 ? 0 : 1) + 'K';
  }
  return sold.toString();
}
