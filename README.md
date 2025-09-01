# Meleon Frontend - Medusa Integration

# Meleon Frontend - Vue 3 E-commerce Store

This is the frontend for the Meleon Accessories Store, built with Vue 3 and integrated with MedusaJS e-commerce backend.

## 🚀 Features

- **Homepage**: Featured products and collections showcase
- **Shop Page**: Product listing with filtering and sorting
- **Collections**: Curated product collections
- **Product Detail**: Detailed product view with variant selection
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout**: Complete checkout flow with address and payment
- **Thank You Page**: Order confirmation and next steps

## 🛠️ Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Vue Router 4** - Client-side routing
- **Pinia** - State management
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icons
- **MedusaJS JS SDK** - Latest e-commerce backend integration with publishable API key support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/voxsar/meleon-frontend.git
   cd meleon-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VUE_APP_MEDUSA_URL=https://your-medusa-backend-url.com
   VUE_APP_STORE_NAME=Meleon Accessories Store
   VUE_APP_API_URL=https://your-medusa-backend-url.com
   VUE_APP_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_api_key_here
   ```

   **Important**: Replace `pk_your_publishable_api_key_here` with your actual MedusaJS publishable API key. You can get this from your Medusa admin dashboard under Settings > Publishable API Keys.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppHeader.vue   # Main navigation header
│   ├── AppFooter.vue   # Site footer
│   ├── DefaultLayout.vue # Layout wrapper
│   └── ProductCard.vue # Product display component
├── views/              # Page components
│   ├── Home.vue        # Homepage
│   ├── Shop.vue        # Product listing
│   ├── Collections.vue # Collections overview
│   ├── ProductDetail.vue # Product details
│   ├── Cart.vue        # Shopping cart
│   ├── Checkout.vue    # Checkout process
│   └── ThankYou.vue    # Order confirmation
├── stores/             # Pinia stores
│   └── cart.js         # Shopping cart state
├── services/           # API services
│   └── medusa.js       # MedusaJS integration
├── router/             # Vue Router configuration
│   └── index.js        # Route definitions
├── App.vue             # Root component
└── main.js             # Application entry point
```

## 🔧 Key Components

### AppHeader
- Navigation menu with cart counter
- Language and currency switchers
- User account dropdown
- Responsive design

### ProductCard
- Product image with hover effects
- Price display with sale prices
- Add to cart functionality
- Quick view and wishlist actions

### Shopping Cart (Pinia Store)
- Add/remove products
- Quantity management
- Price calculations
- Persistent cart state

### MedusaJS Integration
- Product catalog management
- Collections and categories
- Cart and checkout operations
- Order processing

## 🎨 Styling

The project maintains the original design aesthetic using:
- **Bootstrap 5** for responsive grid system
- **Custom CSS** for brand-specific styling
- **Font Awesome** for consistent iconography
- **Responsive design** for mobile compatibility

## 🔗 API Integration

### Medusa Service Functions
- `getProducts()` - Fetch product catalog
- `getProduct(id)` - Get single product details
- `getCollections()` - Fetch product collections
- `createCart()` - Initialize shopping cart
- `addToCart()` - Add items to cart
- `completeCart()` - Process checkout

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: Full navigation and grid layout
- **Tablet**: Optimized navigation and card layout
- **Mobile**: Collapsed navigation and single-column layout

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
- `VUE_APP_MEDUSA_URL`: MedusaJS backend URL
- `VUE_APP_STORE_NAME`: Store display name
- `VUE_APP_API_URL`: API endpoint URL

## 🔜 Next Steps

1. **MedusaJS Backend Integration**
   - Set up MedusaJS server
   - Configure product catalog
   - Set up payment providers
   - Configure shipping options

2. **Enhanced Features**
   - User authentication
   - Wishlist functionality
   - Product reviews
   - Search functionality
   - Order tracking

3. **Performance Optimization**
   - Image optimization
   - Code splitting
   - Caching strategies
   - SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@meleon.com
- GitHub Issues: [Create an issue](https://github.com/voxsar/meleon-frontend/issues)

---

**Built with ❤️ using Vue 3 and MedusaJS**

## 🚀 Quick Setup

### 1. Configure Medusa Backend

Visit `/medusa-config.html` in your browser to set up your Medusa backend URL and publishable API key.

**Required Configuration:**
- **Backend URL**: Your Medusa backend URL (e.g., `https://admin.meleon.shop`)
- **Publishable API Key**: Your Medusa publishable key (starts with `pk_`)

### 2. Manual Configuration (Alternative)

You can also configure via JavaScript console:

```javascript
// Set both URL and API key
MedusaConfig.configure(
    'https://your-medusa-backend.com',
    'pk_your_publishable_api_key_here'
);

// Or set individually
MedusaConfig.setBackendUrl('https://your-medusa-backend.com');
MedusaConfig.setPublishableKey('pk_your_publishable_api_key_here');

// Check current configuration
MedusaConfig.getCurrentConfig();
```

## 📋 Features

### ✅ Implemented
- **Product Catalog**: Browse products by categories
- **Product Search**: Search products with real-time results
- **Shopping Cart**: Add/remove items, update quantities
- **Product Details**: View detailed product information
- **Wishlist**: Add products to wishlist (localStorage)
- **Categories**: Dynamic category navigation
- **Responsive Design**: Mobile-friendly interface

### 🔧 API Integration
All API calls now include the required `x-publishable-api-key` header:

- Product listing and filtering
- Category management
- Cart operations (create, add, update, remove)
- Product search
- Region handling

## 📁 File Structure

```
/
├── index.html              # Homepage
├── listing-grid.html       # Product grid view
├── listing-list.html       # Product list view
├── detail.html            # Product detail page
├── shoppingcart.html      # Shopping cart page
├── medusa-config.html     # Configuration page
├── js/
│   ├── medusa-integration.js  # Main Medusa API integration
│   ├── custom.js              # Custom functionality
│   └── ...
├── css/
│   ├── style.css             # Main styles
│   └── ...
└── images/
    └── ...
```

## 🔗 API Endpoints Used

- `GET /store/product-categories` - Fetch categories
- `GET /store/products` - Fetch products (with filtering)
- `GET /store/products/{id}` - Fetch single product
- `POST /store/carts` - Create cart
- `POST /store/carts/{id}/line-items` - Add to cart
- `POST /store/carts/{id}/line-items/{item_id}` - Update cart item
- `DELETE /store/carts/{id}/line-items/{item_id}` - Remove from cart
- `GET /store/carts/{id}` - Get cart details
- `GET /store/regions` - Fetch regions

## 🛠️ Configuration Options

The `MEDUSA_CONFIG` object supports:

```javascript
{
  BACKEND_URL: 'https://admin.meleon.shop',
  PUBLISHABLE_API_KEY: 'pk_01JDQXV9BH2W5V4NJ8N1J8XRZ8',
  STORE_REGION: 'us',
  CURRENCY: 'usd'
}
```

## 📱 Usage

1. **Homepage** (`index.html`): Displays featured products and categories
2. **Product Listing** (`listing-grid.html`): Browse products with category filtering
3. **Product Detail** (`detail.html`): View product details with `?id=product_id`
4. **Shopping Cart** (`shoppingcart.html`): Manage cart items and proceed to checkout

## 🔍 URL Parameters

- `listing-grid.html?category=cat_123` - Filter by category
- `detail.html?id=prod_123` - View specific product

## 💾 Local Storage

The application uses localStorage for:
- `medusa_backend_url` - Backend URL
- `medusa_publishable_key` - API key
- `medusa_cart_id` - Current cart session
- `medusa_wishlist` - Wishlist items

## 🐛 Troubleshooting

1. **Products not loading**: Check backend URL and API key in configuration
2. **Cart not working**: Ensure cart creation API is working
3. **Categories missing**: Verify product categories exist in your Medusa backend

## 🔒 Security Notes

- Publishable API keys are safe to use in frontend applications
- Never use secret API keys in frontend code
- The publishable key is stored in localStorage and can be changed anytime

## 📞 Support

For issues related to:
- **Medusa Backend**: Check [Medusa Documentation](https://docs.medusajs.com/)
- **Frontend Integration**: Review the `medusa-integration.js` file

---

**Note**: Make sure your Medusa backend has CORS properly configured to allow requests from your frontend domain.
