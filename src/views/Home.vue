<template>
  <DefaultLayout>
    <!-- CONTENT -->
    <div id="sns_content" class="wrap layout-m">
      <div class="container">
        <div class="row">
          <div id="sns_main" class="col-md-12 col-main">
            <div id="sns_mainmidle">
              <div id="sns_producttaps1" class="sns_producttaps_wraps">
                <h3 class="precar">FEATURED PRODUCTS</h3>
                
                <!-- Nav tabs -->
                <ul class="nav nav-tabs" role="tablist">
                  <li role="presentation" class="active">
                    <a href="#home" aria-controls="home" role="tab" data-toggle="tab">All Products</a>
                  </li>
                  <li role="presentation" v-if="collections.length > 0">
                    <a 
                      v-for="collection in collections.slice(0, 3)" 
                      :key="collection.id"
                      :href="`#collection-${collection.id}`" 
                      role="tab" 
                      data-toggle="tab"
                    >
                      {{ collection.title }}
                    </a>
                  </li>
                </ul>

                <!-- Tab panes -->
                <div class="tab-content">
                  <div role="tabpanel" class="tab-pane active" id="home">
                    <div class="products-grid row style_grid" v-if="products.length > 0">
                      <ProductCard 
                        v-for="product in featuredProducts" 
                        :key="product.id" 
                        :product="product" 
                      />
                    </div>
                    <div v-else-if="loading" class="text-center py-5">
                      <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                      <p>Loading products...</p>
                    </div>
                    <div v-else class="text-center py-5">
                      <p>No products available at the moment.</p>
                      <router-link to="/shop" class="btn btn-primary">Browse Shop</router-link>
                    </div>
                  </div>
                  
                  <!-- Collection tabs -->
                  <div 
                    v-for="collection in collections.slice(0, 3)" 
                    :key="collection.id"
                    role="tabpanel" 
                    class="tab-pane" 
                    :id="`collection-${collection.id}`"
                  >
                    <div class="products-grid row style_grid">
                      <ProductCard 
                        v-for="product in getCollectionProducts(collection.id)" 
                        :key="product.id" 
                        :product="product" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Banner Section -->
              <div class="banner-section my-5" v-if="collections.length > 0">
                <div class="row">
                  <div class="col-md-4" v-for="collection in collections.slice(0, 3)" :key="collection.id">
                    <div class="banner-item">
                      <router-link :to="`/collections/${collection.id}`">
                        <img 
                          :src="collection.metadata?.banner_image || '/images/banner-default.jpg'" 
                          :alt="collection.title"
                          class="img-responsive"
                        >
                        <div class="banner-content">
                          <h4>{{ collection.title }}</h4>
                          <p>{{ collection.handle || 'Explore Collection' }}</p>
                        </div>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Newsletter Section -->
              <div class="newsletter-section bg-light py-5 my-5">
                <div class="container">
                  <div class="row">
                    <div class="col-md-6 offset-md-3 text-center">
                      <h3>Stay Updated</h3>
                      <p>Subscribe to our newsletter for the latest products and offers</p>
                      <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
                        <div class="input-group">
                          <input 
                            v-model="email" 
                            type="email" 
                            class="form-control" 
                            placeholder="Enter your email"
                            required
                          >
                          <div class="input-group-append">
                            <button class="btn btn-primary" type="submit">Subscribe</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
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
import { ref, onMounted, computed } from 'vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import ProductCard from '@/components/ProductCard.vue'
import { medusaService } from '@/services/medusa'

export default {
  name: 'Home',
  components: {
    DefaultLayout,
    ProductCard
  },
  setup() {
    const products = ref([])
    const collections = ref([])
    const loading = ref(true)
    const email = ref('')

    const featuredProducts = computed(() => {
      return products.value.slice(0, 12) // Show first 12 products
    })

    const fetchProducts = async () => {
      try {
        loading.value = true
        const fetchedProducts = await medusaService.getProducts({
          limit: 20,
          offset: 0
        })
        products.value = fetchedProducts || []
      } catch (error) {
        console.error('Error fetching products:', error)
        products.value = []
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

    const getCollectionProducts = (collectionId) => {
      // Filter products by collection
      return products.value.filter(product => 
        product.collection_id === collectionId
      ).slice(0, 8)
    }

    const subscribeNewsletter = () => {
      if (email.value) {
        console.log('Newsletter subscription:', email.value)
        alert('Thank you for subscribing!')
        email.value = ''
      }
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
      email,
      featuredProducts,
      getCollectionProducts,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
.precar {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
}

.banner-item {
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.banner-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.banner-item:hover img {
  transform: scale(1.05);
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 20px;
}

.banner-content h4 {
  margin: 0 0 5px 0;
  font-size: 18px;
}

.banner-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.newsletter-section {
  border-radius: 10px;
}

.newsletter-form .input-group {
  max-width: 400px;
  margin: 0 auto;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
