<template>
  <DefaultLayout>
    <div id="sns_content" class="wrap layout-m">
      <div class="container">
        <div class="row">
          <div id="sns_main" class="col-md-12 col-main">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <p>Loading product details...</p>
            </div>

            <div v-else-if="product" class="product-detail">
              <!-- Breadcrumb -->
              <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <router-link to="/">Home</router-link>
                  </li>
                  <li class="breadcrumb-item">
                    <router-link to="/shop">Shop</router-link>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">{{ product.title }}</li>
                </ol>
              </nav>

              <div class="row">
                <!-- Product Images -->
                <div class="col-md-6">
                  <div class="product-images">
                    <div class="main-image mb-3">
                      <img 
                        :src="selectedImage || product.thumbnail || '/images/products/placeholder.jpg'" 
                        :alt="product.title"
                        class="img-fluid main-product-image"
                        @error="handleImageError"
                      >
                    </div>
                    <div class="image-thumbnails" v-if="product.images && product.images.length > 1">
                      <div class="row">
                        <div 
                          v-for="(image, index) in product.images" 
                          :key="index"
                          class="col-3 mb-2"
                        >
                          <img 
                            :src="image.url" 
                            :alt="`${product.title} ${index + 1}`"
                            class="img-fluid thumbnail-image"
                            :class="{ active: selectedImage === image.url }"
                            @click="selectedImage = image.url"
                            @error="handleImageError"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="col-md-6">
                  <div class="product-info">
                    <h1 class="product-title">{{ product.title }}</h1>
                    
                    <div class="product-price mb-3">
                      <span class="current-price">${{ formatPrice(currentPrice) }}</span>
                      <span 
                        v-if="originalPrice && originalPrice !== currentPrice" 
                        class="original-price"
                      >
                        ${{ formatPrice(originalPrice) }}
                      </span>
                    </div>

                    <div class="product-description mb-4">
                      <p>{{ product.description || 'No description available for this product.' }}</p>
                    </div>

                    <!-- Variant Selection -->
                    <div v-if="product.variants && product.variants.length > 1" class="variants mb-4">
                      <h6>Options:</h6>
                      <div class="variant-options">
                        <button 
                          v-for="variant in product.variants" 
                          :key="variant.id"
                          class="btn btn-outline-secondary me-2 mb-2"
                          :class="{ active: selectedVariant?.id === variant.id }"
                          @click="selectVariant(variant)"
                        >
                          {{ variant.title }}
                        </button>
                      </div>
                    </div>

                    <!-- Quantity Selector -->
                    <div class="quantity-selector mb-4">
                      <label for="quantity" class="form-label">Quantity:</label>
                      <div class="input-group" style="width: 150px;">
                        <button 
                          class="btn btn-outline-secondary" 
                          type="button" 
                          @click="decrementQuantity"
                        >
                          -
                        </button>
                        <input 
                          id="quantity"
                          type="number" 
                          class="form-control text-center" 
                          v-model.number="quantity"
                          min="1"
                          :max="selectedVariant?.inventory_quantity || 99"
                        >
                        <button 
                          class="btn btn-outline-secondary" 
                          type="button" 
                          @click="incrementQuantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <!-- Add to Cart -->
                    <div class="action-buttons mb-4">
                      <button 
                        class="btn btn-primary btn-lg me-3"
                        @click="addToCart"
                        :disabled="!selectedVariant || quantity <= 0"
                      >
                        <i class="fa fa-shopping-cart"></i>
                        Add to Cart
                      </button>
                      <button 
                        class="btn btn-outline-secondary"
                        @click="addToWishlist"
                      >
                        <i class="fa fa-heart"></i>
                        Add to Wishlist
                      </button>
                    </div>

                    <!-- Product Meta -->
                    <div class="product-meta">
                      <div class="meta-item" v-if="product.collection">
                        <strong>Collection:</strong> 
                        <router-link :to="`/collections/${product.collection.id}`">
                          {{ product.collection.title }}
                        </router-link>
                      </div>
                      <div class="meta-item" v-if="product.tags && product.tags.length > 0">
                        <strong>Tags:</strong>
                        <span 
                          v-for="tag in product.tags" 
                          :key="tag.id"
                          class="badge bg-secondary me-1"
                        >
                          {{ tag.value }}
                        </span>
                      </div>
                      <div class="meta-item">
                        <strong>SKU:</strong> {{ selectedVariant?.sku || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Product Details Tabs -->
              <div class="product-tabs mt-5">
                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link active" 
                      id="description-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#description" 
                      type="button" 
                      role="tab"
                    >
                      Description
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link" 
                      id="specifications-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#specifications" 
                      type="button" 
                      role="tab"
                    >
                      Specifications
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link" 
                      id="shipping-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#shipping" 
                      type="button" 
                      role="tab"
                    >
                      Shipping
                    </button>
                  </li>
                </ul>
                <div class="tab-content">
                  <div class="tab-pane fade show active" id="description" role="tabpanel">
                    <div class="tab-content-inner p-4">
                      <p>{{ product.description || 'No detailed description available.' }}</p>
                      <div v-if="product.metadata?.features">
                        <h6>Features:</h6>
                        <ul>
                          <li v-for="feature in product.metadata.features" :key="feature">
                            {{ feature }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="specifications" role="tabpanel">
                    <div class="tab-content-inner p-4">
                      <div v-if="product.metadata?.specifications">
                        <div class="row">
                          <div 
                            v-for="(value, key) in product.metadata.specifications" 
                            :key="key"
                            class="col-md-6 mb-2"
                          >
                            <strong>{{ key }}:</strong> {{ value }}
                          </div>
                        </div>
                      </div>
                      <p v-else>No specifications available for this product.</p>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="shipping" role="tabpanel">
                    <div class="tab-content-inner p-4">
                      <h6>Shipping Information</h6>
                      <ul>
                        <li>Free shipping on orders over $100</li>
                        <li>Standard delivery: 3-5 business days</li>
                        <li>Express delivery: 1-2 business days</li>
                        <li>International shipping available</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Related Products -->
              <div v-if="relatedProducts.length > 0" class="related-products mt-5">
                <h3 class="section-title mb-4">Related Products</h3>
                <div class="products-grid row style_grid">
                  <ProductCard 
                    v-for="relatedProduct in relatedProducts" 
                    :key="relatedProduct.id" 
                    :product="relatedProduct" 
                  />
                </div>
              </div>
            </div>

            <div v-else class="text-center py-5">
              <h3>Product not found</h3>
              <p>The product you're looking for doesn't exist.</p>
              <router-link to="/shop" class="btn btn-primary">Back to Shop</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/components/DefaultLayout.vue'
import ProductCard from '@/components/ProductCard.vue'
import { medusaService } from '@/services/medusa'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'ProductDetail',
  components: {
    DefaultLayout,
    ProductCard
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const cartStore = useCartStore()
    
    const product = ref(null)
    const selectedVariant = ref(null)
    const selectedImage = ref(null)
    const quantity = ref(1)
    const loading = ref(true)
    const relatedProducts = ref([])

    const currentPrice = computed(() => {
      if (selectedVariant.value?.prices && selectedVariant.value.prices.length > 0) {
        return selectedVariant.value.prices[0].amount / 100
      }
      return 0
    })

    const originalPrice = computed(() => {
      if (selectedVariant.value?.original_price) {
        return selectedVariant.value.original_price / 100
      }
      return null
    })

    const formatPrice = (price) => {
      return price ? price.toFixed(2) : '0.00'
    }

    const fetchProduct = async (productId) => {
      try {
        loading.value = true
        const fetchedProduct = await medusaService.getProduct(productId)
        
        if (fetchedProduct) {
          product.value = fetchedProduct
          
          // Set default variant
          if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
            selectedVariant.value = fetchedProduct.variants[0]
          }
          
          // Set default image
          if (fetchedProduct.images && fetchedProduct.images.length > 0) {
            selectedImage.value = fetchedProduct.images[0].url
          } else if (fetchedProduct.thumbnail) {
            selectedImage.value = fetchedProduct.thumbnail
          }

          // Fetch related products
          fetchRelatedProducts()
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        product.value = null
      } finally {
        loading.value = false
      }
    }

    const fetchRelatedProducts = async () => {
      try {
        let relatedProductsData = []
        
        // Try to get products from the same collection
        if (product.value.collection_id) {
          relatedProductsData = await medusaService.getProducts({
            collection_id: [product.value.collection_id],
            limit: 8
          })
        }
        
        // Filter out current product and limit to 4 products
        relatedProducts.value = (relatedProductsData || [])
          .filter(p => p.id !== product.value.id)
          .slice(0, 4)
      } catch (error) {
        console.error('Error fetching related products:', error)
        relatedProducts.value = []
      }
    }

    const selectVariant = (variant) => {
      selectedVariant.value = variant
    }

    const incrementQuantity = () => {
      const maxQuantity = selectedVariant.value?.inventory_quantity || 99
      if (quantity.value < maxQuantity) {
        quantity.value++
      }
    }

    const decrementQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const addToCart = () => {
      if (selectedVariant.value && quantity.value > 0) {
        const productToAdd = {
          ...product.value,
          variants: [selectedVariant.value]
        }
        cartStore.addToCart(productToAdd, quantity.value)
        console.log('Added to cart:', product.value.title, 'Quantity:', quantity.value)
        // You can add a toast notification here
      }
    }

    const addToWishlist = () => {
      // Implement wishlist functionality
      console.log('Added to wishlist:', product.value.title)
    }

    const handleImageError = (event) => {
      event.target.src = '/images/products/placeholder.jpg'
    }

    // Watch for route changes
    watch(() => route.params.id, (newId) => {
      if (newId) {
        fetchProduct(newId)
      }
    })

    onMounted(() => {
      const productId = props.id || route.params.id
      if (productId) {
        fetchProduct(productId)
      }
    })

    return {
      product,
      selectedVariant,
      selectedImage,
      quantity,
      loading,
      relatedProducts,
      currentPrice,
      originalPrice,
      formatPrice,
      selectVariant,
      incrementQuantity,
      decrementQuantity,
      addToCart,
      addToWishlist,
      handleImageError
    }
  }
}
</script>

<style scoped>
.product-detail {
  padding: 20px 0;
}

.main-product-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.thumbnail-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.thumbnail-image:hover,
.thumbnail-image.active {
  opacity: 1;
  border: 2px solid #007bff;
}

.product-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.current-price {
  font-size: 24px;
  font-weight: bold;
  color: #e74c3c;
}

.original-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}

.product-description {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
}

.variant-options .btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.quantity-selector .input-group {
  max-width: 150px;
}

.action-buttons .btn {
  padding: 12px 24px;
  font-weight: 500;
}

.product-meta .meta-item {
  margin-bottom: 10px;
  font-size: 14px;
}

.product-meta strong {
  color: #333;
  margin-right: 8px;
}

.product-tabs .nav-tabs {
  border-bottom: 2px solid #007bff;
}

.product-tabs .nav-link {
  color: #666;
  font-weight: 500;
  border: none;
  padding: 15px 20px;
}

.product-tabs .nav-link.active {
  color: #007bff;
  background: none;
  border-bottom: 2px solid #007bff;
}

.tab-content-inner {
  background: #f8f9fa;
  border-radius: 0 0 10px 10px;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #007bff;
}

.breadcrumb {
  background: transparent;
  padding: 0;
}

.breadcrumb-item a {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .main-product-image {
    height: 300px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .current-price {
    font-size: 20px;
  }
}
</style>
