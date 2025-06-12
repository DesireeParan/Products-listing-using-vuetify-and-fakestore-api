import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import ProductList from './components/ProductList.vue';
import ProductMgmt from './components/ProductMgmt.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: ProductList },
  { path: '/lists', component: ProductMgmt },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
