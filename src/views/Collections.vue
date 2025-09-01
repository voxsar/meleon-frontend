<template>
  <DefaultLayout>
    <div id="sns_content" class="wrap layout-m">
      <div class="container">
        <div class="row">
          <div id="sns_main" class="col-md-12 col-main">
            <div id="sns_mainmidle">
              <!-- Collections Header -->
              <div class="collections-header text-center mb-5">
                <h2 class="page-title">Collections</h2>
                <p class="page-subtitle">Discover our curated collections of premium accessories</p>
              </div>

              <!-- Single Collection View (when accessing /collections/:id) -->
              <div v-if="singleCollection" class="single-collection">
                <div class="collection-banner mb-4">
                  <div class="row align-items-center">
                    <div class="col-md-8">
                      <h3>{{ singleCollection.title }}</h3>
                      <p class="collection-description">{{ singleCollection.metadata?.description || 'Explore this amazing collection' }}</p>
                    </div>
                    <div class="col-md-4 text-right">
                      <router-link to="/collections" class="btn btn-secondary">
                        <i class="fa fa-arrow-left"></i> Back to Collections
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Collection Products -->
                <div v-if="collectionProducts.length > 0" class="products-grid row style_grid">
                  <ProductCard 
                    v-for="product in collectionProducts" 
                    :key="product.id" 
                    :product="product" 
                  />
                </div>
                <div v-else-if="loading" class="text-center py-5">
                  <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <p>Loading collection products...</p>
                </div>
                <div v-else class="text-center py-5">
                  <p>No products found in this collection.</p>
                  <router-link to="/shop" class="btn btn-primary">Browse All Products</router-link>
                </div>
              </div>

              <!-- All Collections View -->
              <div v-else>
                <div v-if="loading" class="text-center py-5">
                  <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <p>Loading collections...</p>
                </div>

                <div v-else-if="collections.length > 0" class="collections-grid">
                  <div class="row">
                    <div 
                      v-for="collection in collections" 
                      :key="collection.id"
                      class="col-lg-4 col-md-6 col-sm-12 mb-4"
                    >
                      <div class="collection-card">
                        <div class="collection-image">
                          <router-link :to="`/collections/${collection.id}`">
                            <img 
                              :src="collection.metadata?.image || '/images/collection-default.jpg'" 
                              :alt="collection.title"
                              class="img-fluid"
                              @error="handleImageError"
                            >
                            <div class="collection-overlay">
                              <div class="collection-content">
                                <h4>{{ collection.title }}</h4>
                                <p>{{ getCollectionProductCount(collection.id) }} Products</p>
                                <span class="btn btn-light btn-sm">View Collection</span>
                              </div>
                            </div>
                          </router-link>
                        </div>
                        <div class="collection-info">
                          <h5>{{ collection.title }}</h5>
                          <p class="collection-handle">{{ collection.handle }}</p>
                          <div class="collection-meta">
                            <span class="product-count">{{ getCollectionProductCount(collection.id) }} Products</span>
                            <router-link :to="`/collections/${collection.id}`" class="view-collection">
                              View Collection <i class="fa fa-arrow-right"></i>
                            </router-link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-5">
                  <p>No collections available at the moment.</p>
                  <router-link to="/shop" class="btn btn-primary">Browse All Products</router-link>
                </div>
              </div>

              <!-- Featured Products from Collections -->
              <div v-if="!singleCollection && featuredProducts.length > 0" class="featured-from-collections mt-5">
                <h3 class="section-title text-center mb-4">Featured from Collections</h3>
                <div class="products-grid row style_grid">
                  <ProductCard 
                    v-for="product in featuredProducts" 
                    :key="product.id" 
                    :product="product" 
                  />
                </div>
              </div>
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

export default {
  name: 'Collections',
  components: {
    DefaultLayout,
    ProductCard
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const route = useRoute()
    const collections = ref([])
    const singleCollection = ref(null)
    const collectionProducts = ref([])
    const allProducts = ref([])
    const loading = ref(true)

    const featuredProducts = computed(() => {
      // Get a few products from each collection for featured section
      const featured = []
      collections.value.forEach(collection => {
        const collectionProds = allProducts.value.filter(product => 
          product.collection_id === collection.id
        ).slice(0, 2)
        featured.push(...collectionProds)
      })
      return featured.slice(0, 8)
    })

    const fetchCollections = async () => {
      try {
        loading.value = true
        const fetchedCollections = await medusaService.getCollections()
        collections.value = fetchedCollections || []
      } catch (error) {
        console.error('Error fetching collections:', error)
        collections.value = []
      }
    }

    const fetchSingleCollection = async (collectionId) => {
      try {
        loading.value = true
        const collection = await medusaService.getCollection(collectionId)
        singleCollection.value = collection
        
        // Fetch products for this collection
        const products = await medusaService.getProducts({
          collection_id: [collectionId]
        })
        collectionProducts.value = products || []
      } catch (error) {
        console.error('Error fetching collection:', error)
        singleCollection.value = null
        collectionProducts.value = []
      } finally {
        loading.value = false
      }
    }

    const fetchAllProducts = async () => {
      try {
        const products = await medusaService.getProducts({
          limit: 100
        })
        allProducts.value = products || []
      } catch (error) {
        console.error('Error fetching products:', error)
        allProducts.value = []
      }
    }

    const getCollectionProductCount = (collectionId) => {
      return allProducts.value.filter(product => 
        product.collection_id === collectionId
      ).length
    }

    const handleImageError = (event) => {
      event.target.src = '/images/collection-default.jpg'
    }

    const initializePage = async () => {
      const collectionId = props.id || route.params.id
      
      if (collectionId) {
        // Load single collection
        await fetchSingleCollection(collectionId)
      } else {
        // Load all collections
        singleCollection.value = null
        collectionProducts.value = []
        await Promise.all([
          fetchCollections(),
          fetchAllProducts()
        ])
        loading.value = false
      }
    }

    // Watch for route changes
    watch(() => route.params.id, (newId) => {
      initializePage()
    })

    onMounted(() => {
      initializePage()
    })

    return {
      collections,
      singleCollection,
      collectionProducts,
      allProducts,
      loading,
      featuredProducts,
      getCollectionProductCount,
      handleImageError
    }
  }
}
</script>

<style scoped>
.collections-header {
  padding: 40px 0;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.page-subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 0;
}

.collection-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.collection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.collection-image {
  position: relative;
  overflow: hidden;
  height: 250px;
}

.collection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.collection-card:hover .collection-image img {
  transform: scale(1.05);
}

.collection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.collection-card:hover .collection-overlay {
  opacity: 1;
}

.collection-content {
  text-align: center;
  color: white;
}

.collection-content h4 {
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: bold;
}

.collection-content p {
  font-size: 16px;
  margin-bottom: 15px;
}

.collection-info {
  padding: 20px;
}

.collection-info h5 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.collection-handle {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.collection-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-count {
  color: #888;
  font-size: 14px;
}

.view-collection {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
}

.view-collection:hover {
  color: #0056b3;
  text-decoration: none;
}

.collection-banner {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  border-left: 4px solid #007bff;
}

.collection-description {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
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

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.single-collection .products-grid {
  margin-top: 30px;
}
</style>
