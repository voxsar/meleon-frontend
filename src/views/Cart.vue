<template>
  <DefaultLayout>
    <div id="sns_content" class="wrap layout-m">
      <div class="container">
        <div class="row">
          <div id="sns_main" class="col-md-12 col-main">
            <div class="cart-page">
              <h2 class="page-title mb-4">Shopping Cart</h2>

              <div v-if="cartStore.items.length === 0" class="empty-cart text-center py-5">
                <div class="empty-cart-icon mb-3">
                  <i class="fa fa-shopping-cart fa-5x text-muted"></i>
                </div>
                <h3>Your cart is empty</h3>
                <p class="text-muted">Start shopping to add items to your cart</p>
                <router-link to="/shop" class="btn btn-primary btn-lg">
                  <i class="fa fa-arrow-left"></i> Continue Shopping
                </router-link>
              </div>

              <div v-else>
                <div class="row">
                  <!-- Cart Items -->
                  <div class="col-lg-8">
                    <div class="cart-items">
                      <div class="table-responsive">
                        <table class="table cart-table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Total</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in cartStore.items" :key="item.id" class="cart-item">
                              <td class="product-info">
                                <div class="d-flex align-items-center">
                                  <div class="product-image me-3">
                                    <img 
                                      :src="item.image || '/images/products/placeholder.jpg'" 
                                      :alt="item.title"
                                      class="cart-item-image"
                                      @error="handleImageError"
                                    >
                                  </div>
                                  <div class="product-details">
                                    <h6 class="product-title mb-1">{{ item.title }}</h6>
                                    <small class="text-muted" v-if="item.variant_id">
                                      Variant ID: {{ item.variant_id }}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td class="price">
                                <span class="price-amount">${{ formatPrice(item.price) }}</span>
                              </td>
                              <td class="quantity">
                                <div class="quantity-controls">
                                  <button 
                                    class="btn btn-sm btn-outline-secondary"
                                    @click="decrementQuantity(item.id)"
                                    :disabled="item.quantity <= 1"
                                  >
                                    <i class="fa fa-minus"></i>
                                  </button>
                                  <input 
                                    type="number" 
                                    class="form-control quantity-input"
                                    :value="item.quantity"
                                    @input="updateQuantity(item.id, $event.target.value)"
                                    min="1"
                                  >
                                  <button 
                                    class="btn btn-sm btn-outline-secondary"
                                    @click="incrementQuantity(item.id)"
                                  >
                                    <i class="fa fa-plus"></i>
                                  </button>
                                </div>
                              </td>
                              <td class="total">
                                <span class="total-amount">${{ formatPrice(item.price * item.quantity) }}</span>
                              </td>
                              <td class="actions">
                                <button 
                                  class="btn btn-sm btn-outline-danger"
                                  @click="removeItem(item.id)"
                                  title="Remove item"
                                >
                                  <i class="fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Cart Actions -->
                      <div class="cart-actions mt-3">
                        <div class="row">
                          <div class="col-md-6">
                            <router-link to="/shop" class="btn btn-outline-primary">
                              <i class="fa fa-arrow-left"></i> Continue Shopping
                            </router-link>
                          </div>
                          <div class="col-md-6 text-end">
                            <button 
                              class="btn btn-outline-secondary me-2"
                              @click="clearCart"
                            >
                              <i class="fa fa-trash"></i> Clear Cart
                            </button>
                            <button 
                              class="btn btn-primary"
                              @click="updateCart"
                            >
                              <i class="fa fa-sync"></i> Update Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Cart Summary -->
                  <div class="col-lg-4">
                    <div class="cart-summary">
                      <div class="card">
                        <div class="card-header">
                          <h5 class="mb-0">Order Summary</h5>
                        </div>
                        <div class="card-body">
                          <div class="summary-item d-flex justify-content-between">
                            <span>Subtotal ({{ cartStore.itemCount }} items):</span>
                            <span>${{ cartStore.subtotal }}</span>
                          </div>
                          <div class="summary-item d-flex justify-content-between">
                            <span>Shipping:</span>
                            <span v-if="freeShipping" class="text-success">Free</span>
                            <span v-else>${{ shippingCost.toFixed(2) }}</span>
                          </div>
                          <div class="summary-item d-flex justify-content-between">
                            <span>Tax:</span>
                            <span>${{ tax.toFixed(2) }}</span>
                          </div>
                          <hr>
                          <div class="summary-total d-flex justify-content-between">
                            <strong>Total:</strong>
                            <strong class="text-primary">${{ grandTotal.toFixed(2) }}</strong>
                          </div>

                          <!-- Coupon Code -->
                          <div class="coupon-section mt-4">
                            <h6>Have a coupon?</h6>
                            <div class="input-group">
                              <input 
                                type="text" 
                                class="form-control" 
                                placeholder="Enter coupon code"
                                v-model="couponCode"
                              >
                              <button 
                                class="btn btn-outline-secondary" 
                                type="button"
                                @click="applyCoupon"
                              >
                                Apply
                              </button>
                            </div>
                            <div v-if="appliedCoupon" class="applied-coupon mt-2">
                              <small class="text-success">
                                <i class="fa fa-check"></i> Coupon "{{ appliedCoupon }}" applied
                              </small>
                            </div>
                          </div>

                          <!-- Checkout Button -->
                          <div class="checkout-section mt-4">
                            <router-link 
                              to="/checkout" 
                              class="btn btn-primary btn-lg w-100"
                            >
                              <i class="fa fa-lock"></i> Proceed to Checkout
                            </router-link>
                          </div>

                          <!-- Security Notice -->
                          <div class="security-notice mt-3 text-center">
                            <small class="text-muted">
                              <i class="fa fa-shield"></i> Secure checkout with SSL encryption
                            </small>
                          </div>
                        </div>
                      </div>

                      <!-- Payment Methods -->
                      <div class="payment-methods mt-3">
                        <div class="card">
                          <div class="card-body text-center">
                            <h6 class="mb-3">We Accept</h6>
                            <div class="payment-icons">
                              <img src="/images/payment/visa.png" alt="Visa" class="payment-icon">
                              <img src="/images/payment/mastercard.png" alt="Mastercard" class="payment-icon">
                              <img src="/images/payment/paypal.png" alt="PayPal" class="payment-icon">
                              <img src="/images/payment/amex.png" alt="American Express" class="payment-icon">
                            </div>
                          </div>
                        </div>
                      </div>
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
import { ref, computed } from 'vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'Cart',
  components: {
    DefaultLayout
  },
  setup() {
    const cartStore = useCartStore()
    const couponCode = ref('')
    const appliedCoupon = ref('')

    const shippingCost = computed(() => {
      return freeShipping.value ? 0 : 10.00
    })

    const freeShipping = computed(() => {
      return parseFloat(cartStore.subtotal) >= 100
    })

    const tax = computed(() => {
      return parseFloat(cartStore.subtotal) * 0.08 // 8% tax
    })

    const grandTotal = computed(() => {
      return parseFloat(cartStore.subtotal) + shippingCost.value + tax.value
    })

    const formatPrice = (price) => {
      return price ? price.toFixed(2) : '0.00'
    }

    const updateQuantity = (productId, quantity) => {
      const qty = parseInt(quantity)
      if (qty > 0) {
        cartStore.updateQuantity(productId, qty)
      }
    }

    const incrementQuantity = (productId) => {
      const item = cartStore.items.find(item => item.id === productId)
      if (item) {
        cartStore.updateQuantity(productId, item.quantity + 1)
      }
    }

    const decrementQuantity = (productId) => {
      const item = cartStore.items.find(item => item.id === productId)
      if (item && item.quantity > 1) {
        cartStore.updateQuantity(productId, item.quantity - 1)
      }
    }

    const removeItem = (productId) => {
      if (confirm('Are you sure you want to remove this item from your cart?')) {
        cartStore.removeFromCart(productId)
      }
    }

    const clearCart = () => {
      if (confirm('Are you sure you want to clear your entire cart?')) {
        cartStore.clearCart()
      }
    }

    const updateCart = () => {
      // In a real application, this would sync with the backend
      console.log('Cart updated')
      alert('Cart updated successfully!')
    }

    const applyCoupon = () => {
      if (couponCode.value.trim()) {
        // In a real application, validate coupon with backend
        appliedCoupon.value = couponCode.value
        couponCode.value = ''
        alert('Coupon applied successfully!')
      }
    }

    const handleImageError = (event) => {
      event.target.src = '/images/products/placeholder.jpg'
    }

    return {
      cartStore,
      couponCode,
      appliedCoupon,
      shippingCost,
      freeShipping,
      tax,
      grandTotal,
      formatPrice,
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      removeItem,
      clearCart,
      updateCart,
      applyCoupon,
      handleImageError
    }
  }
}
</script>

<style scoped>
.cart-page {
  padding: 20px 0;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.empty-cart {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 60px 20px;
}

.empty-cart-icon i {
  opacity: 0.3;
}

.cart-table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.cart-table th {
  background: #f8f9fa;
  border: none;
  font-weight: 600;
  color: #333;
  padding: 15px;
}

.cart-table td {
  border: none;
  padding: 20px 15px;
  vertical-align: middle;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.price-amount,
.total-amount {
  font-size: 18px;
  font-weight: 600;
  color: #e74c3c;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}

.quantity-input {
  width: 60px;
  text-align: center;
  border: 1px solid #ddd;
}

.cart-actions {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.cart-summary .card {
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 10px;
}

.cart-summary .card-header {
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  font-weight: 600;
}

.summary-item {
  padding: 8px 0;
  font-size: 16px;
}

.summary-total {
  font-size: 20px;
  padding: 10px 0;
}

.coupon-section h6 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
}

.applied-coupon {
  background: #d4edda;
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #c3e6cb;
}

.checkout-section .btn {
  font-size: 18px;
  font-weight: 600;
  padding: 15px;
}

.security-notice {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
}

.payment-methods .card-body {
  padding: 15px;
}

.payment-icon {
  height: 30px;
  margin: 0 5px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.payment-icon:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .cart-table {
    font-size: 14px;
  }
  
  .cart-item-image {
    width: 60px;
    height: 60px;
  }
  
  .quantity-controls {
    flex-direction: column;
    gap: 2px;
  }
  
  .quantity-input {
    width: 50px;
  }
}
</style>
