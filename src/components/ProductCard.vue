<template>
  <div class="item col-lg-2d4 col-md-3 col-sm-4 col-xs-6 col-phone-12">
    <div class="item-inner">
      <div class="prd">
        <div class="item-img clearfix">
          <div class="ico-label" v-if="product.tags && product.tags.length > 0">
            <span 
              v-for="tag in product.tags.slice(0, 2)" 
              :key="tag.id" 
              :class="`ico-product ico-${tag.value.toLowerCase()}`"
            >
              {{ tag.value }}
            </span>
          </div>

          <router-link 
            class="product-image have-additional"
            :title="product.title"
            :to="`/product/${product.id}`"
          >
            <span class="img-main">
              <img 
                :src="product.thumbnail || '/images/products/placeholder.jpg'" 
                :alt="product.title"
                @error="handleImageError"
              >
            </span>
          </router-link>
        </div>
        
        <div class="item-info">
          <div class="info-inner">
            <div class="item-title">
              <router-link 
                :title="product.title"
                :to="`/product/${product.id}`"
              >
                {{ product.title }}
              </router-link>
            </div>
            <div class="item-price">
              <div class="price-box">
                <span class="regular-price">
                  <span class="price">
                    <span class="price1">${{ formatPrice(currentPrice) }}</span>
                    <span 
                      v-if="originalPrice && originalPrice !== currentPrice" 
                      class="price2"
                    >
                      ${{ formatPrice(originalPrice) }}
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="action-bot">
          <div class="wrap-addtocart">
            <button 
              class="btn-cart"
              title="Add to Cart"
              @click="addToCart"
              :disabled="!product.variants || product.variants.length === 0"
            >
              <i class="fa fa-shopping-cart"></i>
              <span>Add to Cart</span>
            </button>
          </div>
          <div class="actions">
            <ul class="add-to-links">
              <li>
                <a 
                  class="link-wishlist"
                  href="#"
                  title="Add to Wishlist"
                  @click.prevent="addToWishlist"
                >
                  <i class="fa fa-heart"></i>
                </a>
              </li>
              <li>
                <a 
                  class="link-compare"
                  href="#"
                  title="Add to Compare"
                  @click.prevent="addToCompare"
                >
                  <i class="fa fa-random"></i>
                </a>
              </li>
              <li class="wrap-quickview">
                <div class="quickview-wrap">
                  <router-link 
                    class="sns-btn-quickview qv_btn"
                    :to="`/product/${product.id}`"
                    title="Quick View"
                  >
                    <i class="fa fa-eye"></i>
                  </router-link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const cartStore = useCartStore()

    const currentPrice = computed(() => {
      if (props.product.variants && props.product.variants.length > 0) {
        const variant = props.product.variants[0]
        if (variant.prices && variant.prices.length > 0) {
          return variant.prices[0].amount / 100
        }
      }
      return 0
    })

    const originalPrice = computed(() => {
      if (props.product.variants && props.product.variants.length > 0) {
        const variant = props.product.variants[0]
        if (variant.original_price) {
          return variant.original_price / 100
        }
      }
      return null
    })

    const formatPrice = (price) => {
      return price ? price.toFixed(2) : '0.00'
    }

    const handleImageError = (event) => {
      event.target.src = '/images/products/placeholder.jpg'
    }

    const addToCart = () => {
      if (props.product.variants && props.product.variants.length > 0) {
        cartStore.addToCart(props.product, 1)
        // Show success message or notification
        console.log('Added to cart:', props.product.title)
      }
    }

    const addToWishlist = () => {
      // Implement wishlist functionality
      console.log('Added to wishlist:', props.product.title)
    }

    const addToCompare = () => {
      // Implement compare functionality
      console.log('Added to compare:', props.product.title)
    }

    return {
      currentPrice,
      originalPrice,
      formatPrice,
      handleImageError,
      addToCart,
      addToWishlist,
      addToCompare
    }
  }
}
</script>

<script setup>
import { computed } from 'vue'
</script>

<style scoped>
.btn-cart:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.price2 {
  text-decoration: line-through;
  color: #999;
}
</style>
