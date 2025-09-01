<template>
  <DefaultLayout>
    <div id="sns_content" class="wrap layout-m">
      <div class="container">
        <div class="row">
          <!-- Sidebar -->
          <div id="sns_left" class="col-md-3 col-main">
            <div class="wrap-in">
              <!-- Categories Filter -->
              <div class="block block-layered-nav">
                <div class="block-title">
                  <strong><span>Categories</span></strong>
                </div>
                <div class="block-content">
                  <div class="form-check" v-for="collection in collections" :key="collection.id">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :value="collection.id" 
                      :id="`collection-${collection.id}`"
                      v-model="selectedCollections"
                      @change="filterProducts"
                    >
                    <label class="form-check-label" :for="`collection-${collection.id}`">
                      {{ collection.title }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- Price Filter -->
              <div class="block block-layered-nav">
                <div class="block-title">
                  <strong><span>Price Range</span></strong>
                </div>
                <div class="block-content">
                  <div class="price-range">
                    <input 
                      type="range" 
                      min="0" 
                      :max="maxPrice" 
                      v-model="priceRange.min" 
                      @input="filterProducts"
                      class="form-range"
                    >
                    <input 
                      type="range" 
                      min="0" 
                      :max="maxPrice" 
                      v-model="priceRange.max" 
                      @input="filterProducts"
                      class="form-range"
                    >
                    <div class="price-labels">
                      <span>${{ priceRange.min }}</span>
                      <span>${{ priceRange.max }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div id="sns_main" class="col-md-9 col-main">
            <div id="sns_mainmidle">
              <!-- Toolbar -->
              <div class="toolbar">
                <div class="row">
                  <div class="col-md-6">
                    <div class="view-mode">
                      <button 
                        @click="viewMode = 'grid'" 
                        :class="{ active: viewMode === 'grid' }"
                        class="btn btn-sm"
                      >
                        <i class="fa fa-th"></i> Grid
                      </button>
                      <button 
                        @click="viewMode = 'list'" 
                        :class="{ active: viewMode === 'list' }"
                        class="btn btn-sm"
                      >
                        <i class="fa fa-list"></i> List
                      </button>
                    </div>
                  </div>
                  <div class="col-md-6 text-right">
                    <div class="sort-by">
                      <label>Sort by:</label>
                      <select v-model="sortBy" @change="sortProducts" class="form-select">
                        <option value="title">Name</option>
                        <option value="price">Price</option>
                        <option value="created_at">Newest</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Products Grid -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <p>Loading products...</p>
              </div>

              <div v-else-if="filteredProducts.length > 0">
                <!-- Grid View -->
                <div v-if="viewMode === 'grid'" class="products-grid row style_grid">
                  <ProductCard 
                    v-for="product in paginatedProducts" 
                    :key="product.id" 
                    :product="product" 
                  />
                </div>

                <!-- List View -->
                <div v-else class="products-list">
                  <div 
                    v-for="product in paginatedProducts" 
                    :key="product.id"
                    class="product-item-list row mb-3 p-3 border rounded"
                  >
                    <div class="col-md-3">
                      <router-link :to="`/product/${product.id}`">
                        <img 
                          :src="product.thumbnail || '/images/products/placeholder.jpg'" 
                          :alt="product.title"
                          class="img-fluid"
                        >
                      </router-link>
                    </div>
                    <div class="col-md-6">
                      <h5>
                        <router-link :to="`/product/${product.id}`">
                          {{ product.title }}
                        </router-link>
                      </h5>
                      <p class="product-description">{{ product.description || 'No description available' }}</p>
                    </div>
                    <div class="col-md-3 text-right">
                      <div class="price mb-2">
                        <span class="price1">${{ getProductPrice(product) }}</span>
                      </div>
                      <button 
                        class="btn btn-primary btn-sm"
                        @click="addToCart(product)"
                        :disabled="!product.variants || product.variants.length === 0"
                      >
                        <i class="fa fa-shopping-cart"></i> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Pagination -->
                <div class="pagination-wrapper text-center mt-4" v-if="totalPages > 1">
                  <nav>
                    <ul class="pagination justify-content-center">
                      <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" @click="changePage(currentPage - 1)" href="#">Previous</a>
                      </li>
                      <li 
                        class="page-item" 
                        v-for="page in visiblePages" 
                        :key="page"
                        :class="{ active: page === currentPage }"
                      >
                        <a class="page-link" @click="changePage(page)" href="#">{{ page }}</a>
                      </li>
                      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" @click="changePage(currentPage + 1)" href="#">Next</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <div v-else class="text-center py-5">
                <p>No products found matching your criteria.</p>
                <button @click="clearFilters" class="btn btn-secondary">Clear Filters</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import ProductCard from '@/components/ProductCard.vue'
import { medusaService } from '@/services/medusa'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'Shop',
  components: {
    DefaultLayout,
    ProductCard
  },
  setup() {
    const cartStore = useCartStore()
    const products = ref([])
    const collections = ref([])
    const loading = ref(true)
    const viewMode = ref('grid')
    const sortBy = ref('title')
    const selectedCollections = ref([])
    const priceRange = ref({ min: 0, max: 1000 })
    const currentPage = ref(1)
    const itemsPerPage = 12

    const maxPrice = computed(() => {
      if (products.value.length === 0) return 1000
      return Math.max(...products.value.map(product => getProductPrice(product))) || 1000
    })

    const filteredProducts = ref([])

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredProducts.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage)
    })

    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, start + 4)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    const getProductPrice = (product) => {
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants[0]
        if (variant.prices && variant.prices.length > 0) {
          return (variant.prices[0].amount / 100).toFixed(2)
        }
      }
      return '0.00'
    }

    const fetchProducts = async () => {
      try {
        loading.value = true
        const fetchedProducts = await medusaService.getProducts({
          limit: 100
        })
        products.value = fetchedProducts || []
        filteredProducts.value = [...products.value]
        
        // Set initial price range
        if (products.value.length > 0) {
          priceRange.value.max = maxPrice.value
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        products.value = []
        filteredProducts.value = []
      } finally {
        loading.value = false
      }
    }

    const fetchCollections = async () => {
      try {
        const fetchedCollections = await medusaService.getCollections()
        collections.value = fetchedCollections || []
      } catch (error) {
        console.error('Error fetching collections:', error)
        collections.value = []
      }
    }

    const filterProducts = () => {
      let filtered = [...products.value]

      // Filter by collections
      if (selectedCollections.value.length > 0) {
        filtered = filtered.filter(product => 
          selectedCollections.value.includes(product.collection_id)
        )
      }

      // Filter by price range
      filtered = filtered.filter(product => {
        const price = parseFloat(getProductPrice(product))
        return price >= priceRange.value.min && price <= priceRange.value.max
      })

      filteredProducts.value = filtered
      currentPage.value = 1 // Reset to first page
    }

    const sortProducts = () => {
      filteredProducts.value.sort((a, b) => {
        switch (sortBy.value) {
          case 'title':
            return a.title.localeCompare(b.title)
          case 'price':
            return parseFloat(getProductPrice(a)) - parseFloat(getProductPrice(b))
          case 'created_at':
            return new Date(b.created_at) - new Date(a.created_at)
          default:
            return 0
        }
      })
    }

    const clearFilters = () => {
      selectedCollections.value = []
      priceRange.value = { min: 0, max: maxPrice.value }
      filteredProducts.value = [...products.value]
      currentPage.value = 1
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const addToCart = (product) => {
      cartStore.addToCart(product, 1)
      console.log('Added to cart:', product.title)
    }

    onMounted(async () => {
      await Promise.all([
        fetchProducts(),
        fetchCollections()
      ])
    })

    return {
      products,
      collections,
      loading,
      viewMode,
      sortBy,
      selectedCollections,
      priceRange,
      currentPage,
      maxPrice,
      filteredProducts,
      paginatedProducts,
      totalPages,
      visiblePages,
      getProductPrice,
      filterProducts,
      sortProducts,
      clearFilters,
      changePage,
      addToCart
    }
  }
}
</script>

<style scoped>
.toolbar {
  background: #f8f9fa;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.view-mode .btn {
  margin-right: 10px;
}

.view-mode .btn.active {
  background-color: #007bff;
  color: white;
}

.product-item-list {
  transition: transform 0.2s ease;
}

.product-item-list:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.price-range {
  padding: 10px 0;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.form-range {
  width: 100%;
  margin: 5px 0;
}

.block {
  margin-bottom: 30px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.block-title {
  background: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.block-content {
  padding: 15px;
}

.form-check {
  margin-bottom: 10px;
}

.pagination .page-link {
  cursor: pointer;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
