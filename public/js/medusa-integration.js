// MedusaJS integration for Meleon Accessories Store
// Centrally configurable Medusa backend URL
const MEDUSA_CONFIG = {
  BACKEND_URL: localStorage.getItem('medusa_backend_url') || 'https://admin.meleon.shop',
  PUBLISHABLE_API_KEY: localStorage.getItem('medusa_publishable_key') || 'pk_c01a0dcfb53975198fdf1d15ca95fd4c1c545349059cd9a54dea817020f023a4',
  STORE_REGION: 'us',
  CURRENCY: 'usd'
};

// Function to get default headers with publishable API key
function getDefaultHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_API_KEY
  };
}

// Function to update backend URL
function setMedusaBackendUrl(url) {
  MEDUSA_CONFIG.BACKEND_URL = url;
  localStorage.setItem('medusa_backend_url', url);
}

// Function to update publishable API key
function setMedusaPublishableKey(key) {
  MEDUSA_CONFIG.PUBLISHABLE_API_KEY = key;
  localStorage.setItem('medusa_publishable_key', key);
}

// Fetch and render categories (example: for nav or sidebar)
async function loadCategories() {
  try {
    const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/product-categories`, {
      headers: getDefaultHeaders()
    });
    const data = await res.json();
    // Example: render categories in a nav with id 'categories-nav'
    if (data.product_categories && document.getElementById('categories-nav')) {
      document.getElementById('categories-nav').innerHTML = data.product_categories.map(cat => `
        <li><a href="listing-grid.html?category=${cat.id}" data-category="${cat.id}">${cat.name}</a></li>
      `).join('');
    }
    
    // Update main navigation categories
    const mainNav = document.querySelector('.mainnav');
    if (mainNav && data.product_categories) {
      const categoriesHtml = data.product_categories.slice(0, 6).map(cat => `
        <li class="level0 nav-category">
          <a class="menu-title-lv0" href="listing-grid.html?category=${cat.id}">
            <span class="title">${cat.name}</span>
          </a>
        </li>
      `).join('');
      
      // Insert categories after Home
      const homeItem = mainNav.querySelector('.level0.custom-item');
      if (homeItem) {
        homeItem.insertAdjacentHTML('afterend', categoriesHtml);
      }
    }
  } catch (e) { console.error('Failed to load categories', e); }
}

// Fetch and render products (example: for product grid)
async function loadProducts(categoryId = null, limit = 20, offset = 0) {
  try {
    let url = `${MEDUSA_CONFIG.BACKEND_URL}/store/products?limit=${limit}&offset=${offset}`;
    if (categoryId) url += `&category_id[]=${categoryId}`;
    
    const res = await fetch(url, {
      headers: getDefaultHeaders()
    });
    const data = await res.json();
    
    // Example: render products in a div with id 'products-grid'
    if (data.products && document.getElementById('products-grid')) {
      document.getElementById('products-grid').innerHTML = data.products.map(prod => `
        <div class="item col-lg-2d4 col-md-3 col-sm-4 col-xs-6 col-phone-12">
          <div class="item-inner">
            <div class="prd">
              <div class="item-img clearfix">
                ${prod.status === 'published' && new Date(prod.created_at) > new Date(Date.now() - 30*24*60*60*1000) ? '<div class="ico-label"><span class="ico-product ico-new">New</span></div>' : ''}
                <a class="product-image have-additional" title="${prod.title}" href="detail.html?id=${prod.id}">
                  <span class="img-main">
                    <img src="${prod.thumbnail || 'images/placehoder.jpg'}" alt="${prod.title}">
                  </span>
                </a>
              </div>
              <div class="item-info">
                <div class="info-inner">
                  <div class="item-title">
                    <a title="${prod.title}" href="detail.html?id=${prod.id}">${prod.title}</a>
                  </div>
                  <div class="item-price">
                    <div class="price-box">
                      <span class="regular-price">
                        <span class="price">
                          <span class="price1">${formatPrice(prod.variants[0]?.prices?.find(p => p.currency_code === MEDUSA_CONFIG.CURRENCY))}</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="action-bot">
                <div class="wrap-addtocart">
                  <button class="btn-cart" title="Add to Cart" onclick="addToCart('${prod.variants[0]?.id}')">
                    <i class="fa fa-shopping-cart"></i>
                    <span>Add to Cart</span>
                  </button>
                </div>
                <div class="actions">
                  <ul class="add-to-links">
                    <li>
                      <a class="link-wishlist" href="#" title="Add to Wishlist" onclick="addToWishlist('${prod.id}')">
                        <i class="fa fa-heart"></i>
                      </a>
                    </li>
                    <li>
                      <a class="link-compare" href="#" title="Add to Compare">
                        <i class="fa fa-random"></i>
                      </a>
                    </li>
                    <li class="wrap-quickview" data-id="qv_item_${prod.id}">
                      <div class="quickview-wrap">
                        <a class="sns-btn-quickview qv_btn" href="#" onclick="quickView('${prod.id}')">
                          <i class="fa fa-eye"></i>
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (e) { console.error('Failed to load products', e); }
}

// Add to cart (Medusa cart API)
async function addToCart(variantId, quantity = 1) {
  try {
    let cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) {
      // Create new cart
      const cartRes = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/carts`, { 
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify({ region_id: await getRegionId() })
      });
      const cartData = await cartRes.json();
      cartId = cartData.cart.id;
      localStorage.setItem('medusa_cart_id', cartId);
    }
    // Add item
    const response = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ variant_id: variantId, quantity })
    });
    
    if (response.ok) {
      alert('Added to cart!');
      updateCartUI();
    } else {
      throw new Error('Failed to add item');
    }
  } catch (e) { 
    console.error(e);
    alert('Failed to add to cart'); 
  }
}

// Get cart details
async function getCart() {
  try {
    const cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) return null;
    
    const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/carts/${cartId}`, {
      headers: getDefaultHeaders()
    });
    const data = await res.json();
    return data.cart;
  } catch (e) {
    console.error('Failed to get cart', e);
    return null;
  }
}

// Update cart UI
async function updateCartUI() {
  const cart = await getCart();
  if (!cart) return;
  
  // Update cart count
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    const totalItems = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    cartCount.textContent = totalItems;
  }
  
  // Update cart total
  const cartTotal = document.querySelector('.cart-total');
  if (cartTotal && cart.total) {
    cartTotal.textContent = formatPrice({ amount: cart.total, currency_code: cart.region?.currency_code });
  }
}

// Get region ID
async function getRegionId() {
  try {
    const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/regions`, {
      headers: getDefaultHeaders()
    });
    const data = await res.json();
    return data.regions?.[0]?.id || 'reg_01';
  } catch (e) {
    return 'reg_01'; // fallback
  }
}

// Format price helper
function formatPrice(price) {
  if (!price || !price.amount) return '';
  const amount = price.amount / 100;
  const currency = price.currency_code?.toUpperCase() || 'USD';
  return `${currency} ${amount.toFixed(2)}`;
}

// Load single product (for product detail page)
async function loadProductDetail(productId) {
  try {
    const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/products/${productId}`, {
      headers: getDefaultHeaders()
    });
    const data = await res.json();
    return data.product;
  } catch (e) {
    console.error('Failed to load product', e);
    return null;
  }
}

// Add to wishlist
function addToWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem('medusa_wishlist') || '[]');
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem('medusa_wishlist', JSON.stringify(wishlist));
    alert('Added to wishlist!');
  } else {
    alert('Already in wishlist!');
  }
}

// Quick view
function quickView(productId) {
  // Implement quick view modal
  window.open(`detail.html?id=${productId}`, '_blank', 'width=800,height=600');
}

// Search products
async function searchProducts(query) {
  try {
    const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/products?q=${encodeURIComponent(query)}`, {
      headers: getDefaultHeaders()
    });
    const data = await res.json();
    return data.products || [];
  } catch (e) {
    console.error('Failed to search products', e);
    return [];
  }
}

// On page load
window.addEventListener('DOMContentLoaded', function() {
  // Initialize based on current page
  const currentPage = window.location.pathname.split('/').pop().split('.')[0];
  
  switch(currentPage) {
    case 'index':
      loadCategories();
      loadProducts();
      break;
    case 'listing-grid':
    case 'listing-list':
      loadCategories();
      loadCategoryProducts();
      break;
    case 'detail':
      loadProductDetailPage();
      break;
    case 'shoppingcart':
      loadCartPage();
      break;
    default:
      loadCategories();
      updateCartUI();
  }
  
  // Setup search functionality
  setupSearch();
  
  // Example: handle category click
  const catNav = document.getElementById('categories-nav');
  if (catNav) {
    catNav.addEventListener('click', function(e) {
      if (e.target.tagName === 'A' && e.target.dataset.category) {
        e.preventDefault();
        loadProducts(e.target.dataset.category);
      }
    });
  }
  
  // Update cart UI on load
  updateCartUI();
});

// Load category products (for listing pages)
function loadCategoryProducts() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('category');
  if (categoryId) {
    loadProducts(categoryId);
  } else {
    loadProducts();
  }
}

// Load product detail page
async function loadProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    const product = await loadProductDetail(productId);
    if (product) {
      renderProductDetail(product);
    }
  }
}

// Render product detail
function renderProductDetail(product) {
  // Update page title
  document.title = product.title;
  
  // Update product images
  const mainImage = document.querySelector('.product-main-image img');
  if (mainImage) {
    mainImage.src = product.thumbnail || 'images/placehoder.jpg';
    mainImage.alt = product.title;
  }
  
  // Update product title
  const titleElement = document.querySelector('.product-title, .product-name h1');
  if (titleElement) {
    titleElement.textContent = product.title;
  }
  
  // Update product description
  const descElement = document.querySelector('.product-description, .product-desc');
  if (descElement) {
    descElement.innerHTML = product.description || '';
  }
  
  // Update product price
  const priceElement = document.querySelector('.product-price .price, .price-box .price');
  if (priceElement && product.variants?.[0]?.prices) {
    const price = product.variants[0].prices.find(p => p.currency_code === MEDUSA_CONFIG.CURRENCY);
    priceElement.innerHTML = `<span class="price1">${formatPrice(price)}</span>`;
  }
  
  // Update add to cart button
  const addToCartBtn = document.querySelector('.btn-cart, .add-to-cart-btn');
  if (addToCartBtn && product.variants?.[0]) {
    addToCartBtn.onclick = () => addToCart(product.variants[0].id);
  }
}

// Load cart page
async function loadCartPage() {
  const cart = await getCart();
  if (cart && document.getElementById('cart-items')) {
    renderCartItems(cart);
  }
}

// Render cart items
function renderCartItems(cart) {
  const cartContainer = document.getElementById('cart-items');
  if (!cartContainer) return;
  
  if (!cart.items || cart.items.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty</p>';
    return;
  }
  
  cartContainer.innerHTML = cart.items.map(item => `
    <tr class="cart-item">
      <td class="product-image">
        <img src="${item.variant?.product?.thumbnail || 'images/placehoder.jpg'}" alt="${item.title}" width="100">
      </td>
      <td class="product-name">
        <a href="detail.html?id=${item.variant?.product?.id}">${item.title}</a>
      </td>
      <td class="product-price">${formatPrice({ amount: item.unit_price, currency_code: cart.region?.currency_code })}</td>
      <td class="product-quantity">
        <input type="number" value="${item.quantity}" min="1" onchange="updateCartItem('${item.id}', this.value)">
      </td>
      <td class="product-total">${formatPrice({ amount: item.total, currency_code: cart.region?.currency_code })}</td>
      <td class="product-remove">
        <button onclick="removeCartItem('${item.id}')" class="btn-remove">Remove</button>
      </td>
    </tr>
  `).join('');
  
  // Update cart totals
  const totalElement = document.querySelector('.cart-total-amount');
  if (totalElement) {
    totalElement.textContent = formatPrice({ amount: cart.total, currency_code: cart.region?.currency_code });
  }
}

// Update cart item quantity
async function updateCartItem(lineItemId, quantity) {
  try {
    const cartId = localStorage.getItem('medusa_cart_id');
    await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ quantity: parseInt(quantity) })
    });
    loadCartPage(); // Reload cart
  } catch (e) {
    console.error('Failed to update cart item', e);
  }
}

// Remove cart item
async function removeCartItem(lineItemId) {
  try {
    const cartId = localStorage.getItem('medusa_cart_id');
    await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'DELETE',
      headers: getDefaultHeaders()
    });
    loadCartPage(); // Reload cart
  } catch (e) {
    console.error('Failed to remove cart item', e);
  }
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.querySelector('input[name="q"], .search-input');
  const searchForm = document.querySelector('#search_mini_form3703138361442478087, .search-form');
  
  if (searchForm) {
    searchForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const query = searchInput?.value?.trim();
      if (query) {
        const products = await searchProducts(query);
        if (document.getElementById('products-grid')) {
          // Render search results in products grid
          document.getElementById('products-grid').innerHTML = products.map(prod => `
            <div class="item col-lg-2d4 col-md-3 col-sm-4 col-xs-6 col-phone-12">
              <!-- Product HTML similar to loadProducts function -->
            </div>
          `).join('');
        }
      }
    });
  }
}

// Cart page specific functions
function loadCartPage() {
    updateCartDisplay();
}

function renderCartItems(cart) {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (!cart || !cart.items || cart.items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 40px;">
                <p>Your cart is empty</p>
                <a href="index.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        updateCartTotals(null);
        return;
    }

    const itemsHTML = cart.items.map(item => `
        <ul class="nav-mid clearfix" data-item-id="${item.id}">
            <li class="image">
                <a href="detail.html?id=${item.variant?.product_id || item.product_id}">
                    <img src="${item.variant?.product?.thumbnail || item.thumbnail || 'images/placehoder.jpg'}" alt="${item.title}">
                </a>
            </li>
            <li class="item-title">
                <a href="detail.html?id=${item.variant?.product_id || item.product_id}">${item.title}</a>
            </li>
            <li class="icon1">
                <i class="btn-edit fa fa-edit" onclick="editCartItem('${item.id}')"></i>
            </li>
            <li class="price1">${formatPrice({ amount: item.unit_price, currency_code: MEDUSA_CONFIG.currency })}</li>
            <li class="number">
                <input type="number" value="${item.quantity}" min="1" 
                       onchange="updateCartItemQuantity('${item.id}', this.value)" 
                       style="width: 60px; text-align: center;">
            </li>
            <li class="price2">${formatPrice({ amount: item.total, currency_code: MEDUSA_CONFIG.currency })}</li>
            <li class="icon2">
                <i class="btn-remove fa fa-remove" onclick="removeFromCart('${item.id}')"></i>
            </li>
        </ul>
    `).join('');

    container.innerHTML = itemsHTML;
    updateCartTotals(cart);
}

function updateCartTotals(cart) {
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    
    if (!cart || !cart.items || cart.items.length === 0) {
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        if (totalElement) totalElement.textContent = '$0.00';
        return;
    }

    const subtotal = cart.subtotal || 0;
    const total = cart.total || subtotal;

    if (subtotalElement) subtotalElement.textContent = formatPrice({ amount: subtotal, currency_code: MEDUSA_CONFIG.currency });
    if (totalElement) totalElement.textContent = formatPrice({ amount: total, currency_code: MEDUSA_CONFIG.currency });
}

function updateCartItemQuantity(itemId, quantity) {
    quantity = parseInt(quantity);
    if (quantity < 1) {
        removeFromCart(itemId);
        return;
    }

    updateCartItem(itemId, { quantity });
}

function editCartItem(itemId) {
    // For now, just focus on quantity input
    const itemElement = document.querySelector(`[data-item-id="${itemId}"] input[type="number"]`);
    if (itemElement) {
        itemElement.focus();
        itemElement.select();
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your shopping cart?')) {
        // Clear the entire cart
        const cart = getCart();
        if (cart && cart.items) {
            cart.items.forEach(item => {
                removeFromCart(item.id);
            });
        }
        
        // Also clear localStorage
        localStorage.removeItem('cart');
        updateCartDisplay();
    }
}

function proceedToCheckout() {
    const cart = getCart();
    if (!cart || !cart.items || cart.items.length === 0) {
        alert('Your cart is empty. Please add items before proceeding to checkout.');
        return;
    }
    
    // For now, redirect to a checkout page (to be implemented)
    window.location.href = 'checkout.html';
}

function updateCartDisplay() {
    const cart = getCart();
    renderCartItems(cart);
    updateCartUI(); // Update the mini cart in header as well
}

// Configuration functions for easy setup
window.MedusaConfig = {
    setBackendUrl: setMedusaBackendUrl,
    setPublishableKey: setMedusaPublishableKey,
    getCurrentConfig: () => ({ ...MEDUSA_CONFIG }),
    
    // Quick setup function
    configure: (backendUrl, publishableKey) => {
        if (backendUrl) setMedusaBackendUrl(backendUrl);
        if (publishableKey) setMedusaPublishableKey(publishableKey);
        console.log('Medusa configuration updated:', { 
            backendUrl: MEDUSA_CONFIG.BACKEND_URL, 
            publishableKey: MEDUSA_CONFIG.PUBLISHABLE_API_KEY 
        });
    }
};

// Initialize configuration on page load
console.log('Medusa Integration loaded with config:', {
    backendUrl: MEDUSA_CONFIG.BACKEND_URL,
    publishableKey: MEDUSA_CONFIG.PUBLISHABLE_API_KEY ? `${MEDUSA_CONFIG.PUBLISHABLE_API_KEY.substring(0, 8)}...` : 'not set'
});
