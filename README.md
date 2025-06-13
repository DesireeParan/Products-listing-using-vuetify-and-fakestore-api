# Vuetify Product Listing Project

This project is a modern, minimalist product listing web app built with Vue 3 and Vuetify. It features a sidebar, search bar, category and sort controls, product grid, and modals for product details and adding products.

---

## Developer Information

**Developer:** Maria Desiree Paran  
**Email:** paranmariadesiree1@gmail.com
**GitHub:** [github.com/DesireeParan](https://github.com/DesireeParan)  
**Location:** Manila, Philippines

Maria Desiree Paran is a dedicated PHP Laravel developer with strong experience in Vue.js. She is passionate about building robust web applications and is actively exploring other modern frameworks and technologies to expand her skill set.

---

## Step-by-Step Project Creation Guide

### 1. Project Setup
- Install Node.js and npm if not already installed.
- Create a new Vue 3 project using Vite:
  ```sh
  npm create vite@latest vuetify-project -- --template vue-ts
  cd vuetify-project
  ```
- Install dependencies:
  ```sh
  npm install
  npm install vuetify@next axios
  ```
- Set up Vuetify:
  - Create `src/plugins/vuetify.ts` and configure Vuetify.
  - Import and use Vuetify in `main.ts`.

### 2. Project Structure
- Organize components in `src/components/`:
  - `ProductList.vue`: Main product listing page.
  - `ProductDetailsModal.vue`: Modal for viewing product details.
  - `AddProductModal.vue`: Modal for adding new products.
  - `EditProductModal.vue`: (Optional) For editing products.
  - `Footer.vue`, `Welcome.vue`: Additional UI components.
  - `productStore.ts`: Shared state for products and categories.
- Add assets (images, CSS, JS) in `src/assets/` as needed.

### 3. Building the UI
- Use Vuetify components for layout:
  - `v-container`, `v-row`, `v-col` for responsive grid.
  - `v-navigation-drawer` for the sidebar.
  - `v-btn`, `v-icon`, `v-text-field` for controls.
  - `v-card`, `v-img` for product display.
- Implement a sidebar with category and sort options.
- Add a search bar with icons for cart and notifications.
- Place inline category and sort controls below the search bar.
- Create a 4-column product grid using Vuetify's grid system.
- Add floating action buttons for messages and adding products.

### 4. State Management & Logic
- Use the Composition API (`ref`, `computed`) for state.
- Store products and categories in a shared store (`productStore.ts`).
- Fetch products from an API (e.g., fakestoreapi.com) using Axios.
- Implement filtering (search, category) and sorting (popular, price).
- Add modals for viewing and adding products.
- Use localStorage to persist user-added products.

### 5. Styling
- Use scoped CSS in each component for custom styles.
- Apply a modern, minimalist look: clean backgrounds, gold/navy color palette, rounded corners, and subtle hover effects.
- Ensure responsive design for desktop and mobile.

### 6. Running the Project
- Start the development server:
  ```sh
  npm run dev
  ```
- Open the app in your browser at the provided local address.

### 7. Cloning and Running on Another Machine or IDE (VSCode, etc.)
1. Clone the repository:
   ```sh
   git clone https://github.com/DesireeParan/Products-listing-using-vuetify-and-fakestore-api
   cd vuetify-project
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open the project folder in VS Code or your preferred IDE for development.
5. Access the app in your browser at the local address shown in the terminal (usually http://localhost:5173).

### 8. Customization & Deployment
- Customize product data, categories, and UI as needed.
- Build for production:
  ```sh
  npm run build
  ```
- Deploy the `dist/` folder to your preferred hosting service.

---

For more details, see the code in each component and the comments throughout the project.

<img src="assets/image1.png">
<img src="assets/image2.png">
<img src="assets/image3.png">
<img src="assets/image4.png">