<template>
  <v-app>
    <v-app-bar app class="gold-navbar" elevation="4">
      <v-btn icon class="burger-btn d-flex d-md-none" @click="drawer = !drawer" aria-label="Toggle navigation menu">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title class="gold-title d-none d-sm-flex">
        <v-icon class="mr-2">mdi-storefront</v-icon>
        MDP Store
      </v-toolbar-title>
      <v-spacer />
      <v-btn to="/" class="gold-nav-btn d-none d-md-flex" variant="text">Products</v-btn>
      <v-btn to="/lists" class="gold-nav-btn d-none d-md-flex" variant="text">List</v-btn>
      <div class="navbar-icons d-flex align-center" style="gap: 1rem; margin-left: 1.5rem;">
        <v-badge :content="3" color="red" overlap>
          <v-btn icon variant="text" class="icon-btn-modern" aria-label="Cart">
            <v-icon size="28" color="#0a174e">mdi-cart-outline</v-icon>
          </v-btn>
        </v-badge>
        <v-badge :content="5" color="red" overlap>
          <v-btn icon variant="text" class="icon-btn-modern" aria-label="Notifications">
            <v-icon size="28" color="#0a174e">mdi-bell-outline</v-icon>
          </v-btn>
        </v-badge>
        <v-badge :content="2" color="red" overlap>
          <v-btn icon variant="text" class="icon-btn-modern" aria-label="Vouchers">
            <v-icon size="28" color="#0a174e">mdi-ticket-percent-outline</v-icon>
          </v-btn>
        </v-badge>
      </div>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary location="right" class="mobile-nav-drawer">
        <v-list>
          <v-toolbar-title class="gold-title">
          <v-icon class="ms-4">mdi-storefront</v-icon>
          MDP Store
        </v-toolbar-title>
        <div class="navbar-btns">
          <v-list-item to="/" @click="drawer = false">
            <v-list-item-title>Products</v-list-item-title>
          </v-list-item>
          <v-list-item to="/lists" @click="drawer = false">
            <v-list-item-title>List</v-list-item-title>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-col">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Order Tracking</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Company</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Links</h3>
          <ul>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Deals</a></li>
            <li><a href="#">Gift Cards</a></li>
            <li><a href="#">Affiliates</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Contact</h3>
          <ul>
            <li>Email: support@mdpstore.com</li>
            <li>Phone: +63 912 345 6789</li>
            <li>Address: Manila, Philippines</li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Services</h3>
          <ul>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Payment Options</a></li>
            <li><a href="#">Warranty</a></li>
            <li><a href="#">Bulk Orders</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">© 2025 MDP Store. All rights reserved.</div>
    </footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const drawer = ref(false);
</script>

<style scoped>
.gold-navbar {
  background: #fefefe !important;
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}
.gold-title {
  color: #0a174e;
  font-weight: 700;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}
.gold-nav-btn {
  color: #0a174e !important;
  font-weight: 700;
  font-size: 1.05rem;
  border-radius: 8px;
  margin-left: 8px;
  transition: background 0.2s, color 0.2s;
}
.gold-nav-btn:hover {
  background: linear-gradient(90deg, #FFD700 0%, #fffbe6 100%);
  color: #0a174e !important;
}

.navbar-icons {
  background: transparent;
  transition: background 0.2s, color 0.2s;
  margin-right: 2rem;
}

.scroll-navbar {
  overflow-x: auto;
  white-space: nowrap;
}
.navbar-scroll-content {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 400px;
}

.footer {
  width: 100%;
  background: #0a174e;
  color: #FFD700;
  text-align: left;
  padding: 32px 0 0 0;
  font-size: 1rem;
  letter-spacing: 1px;
}
.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
.footer-col {
  flex: 1 1 180px;
  min-width: 160px;
  max-width: 220px;
}
.footer-col h3 {
  color: #FFD700;
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-weight: 700;
}
.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-col ul li {
  margin-bottom: 8px;
}
.footer-col ul li a {
  color: #FFD700;
  text-decoration: none;
  transition: text-decoration 0.2s;
}
.footer-col ul li a:hover {
  text-decoration: underline;
}
.footer-bottom {
  text-align: center;
  color: #FFD700;
  padding: 18px 0 8px 0;
  font-size: 0.98rem;
  border-top: 1px solid #FFD70033;
  margin-top: 24px;
}
@media (max-width: 900px) {
  .navbar-scroll-content {
    min-width: 600px;
    width: max-content;
    padding-right: 12px;
  }
  .gold-navbar {
    overflow-x: auto !important;
    white-space: nowrap !important;
  }
}
@media (max-width: 900px) {
  .gold-nav-btn.d-md-flex {
    display: none !important;
  }
  .v-btn.d-md-none {
    display: flex !important;
  }
}
@media (min-width: 901px) {
  .v-btn.d-md-none {
    display: none !important;
  }
  .gold-nav-btn.d-md-flex {
    display: flex !important;
  }
}
.mobile-nav-drawer {
  min-width: 180px;
  background: #fefefe !important;
  color:#0a174e;
}

.navbar-btns {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

@media (max-width: 900px) {
  .gold-navbar {
    flex-direction: column;
    padding: 0 8px;
  }

  .burger-btn {

    color:#0a174e;
  }
  .gold-title {
    font-size: 1.1rem;
    flex-wrap: wrap;
  }
  .gold-nav-btn {
    font-size: 0.98rem;
    margin-left: 4px;
    margin-right: 4px;
    padding: 4px 8px;
  }
  .navbar-icons {
    gap: 0.7rem !important;
    margin-left: 0.5rem !important;
  }
  .v-icon {
    font-size: 22px !important;
  }
  .searchbar-navbar-center {
    min-width: 0 !important;
    max-width: 100vw !important;
    padding: 0 2vw;
  }
  .search-bar-navbar {
    min-width: 0 !important;
    max-width: 100vw !important;
    font-size: 0.98rem;
  }
}
@media (max-width: 600px) {
  .gold-navbar {
    flex-direction: column;
    padding: 0 2px;
    min-height: 56px;
  }
  .gold-title {
    font-size: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  .gold-nav-btn {
    font-size: 0.93rem;
    margin: 2px 0 2px 0;
    padding: 3px 6px;
  }
  .navbar-icons {
    gap: 0.5rem !important;
    margin-left: 0 !important;
    margin-top: 4px;
  }
  .v-icon {
    font-size: 18px !important;
  }
  .searchbar-navbar-center {
    min-width: 0 !important;
    max-width: 100vw !important;
    padding: 0 1vw;
    margin: 0 auto;
  }
  .search-bar-navbar {
    min-width: 0 !important;
    max-width: 100vw !important;
    font-size: 0.95rem;
  }
}
</style>
