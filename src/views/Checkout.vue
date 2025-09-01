<template>
  <DefaultLayout>
    <div id="sns_content" class="wrap layout-m">
      <div class="container">
        <div class="row">
          <div id="sns_main" class="col-md-12 col-main">
            <div class="checkout-page">
              <h2 class="page-title mb-4">Checkout</h2>

              <div v-if="cartStore.items.length === 0" class="empty-cart text-center py-5">
                <h3>Your cart is empty</h3>
                <p class="text-muted">Add items to your cart before checkout</p>
                <router-link to="/shop" class="btn btn-primary">
                  <i class="fa fa-arrow-left"></i> Start Shopping
                </router-link>
              </div>

              <div v-else class="row">
                <!-- Checkout Form -->
                <div class="col-lg-8">
                  <form @submit.prevent="processCheckout">
                    <!-- Customer Information -->
                    <div class="checkout-section">
                      <h4 class="section-title">
                        <span class="step-number">1</span>
                        Customer Information
                      </h4>
                      <div class="section-content">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <label for="email" class="form-label">Email Address *</label>
                              <input 
                                type="email" 
                                id="email"
                                class="form-control" 
                                v-model="customerInfo.email"
                                required
                              >
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group">
                              <label for="phone" class="form-label">Phone Number</label>
                              <input 
                                type="tel" 
                                id="phone"
                                class="form-control" 
                                v-model="customerInfo.phone"
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Billing Address -->
                    <div class="checkout-section">
                      <h4 class="section-title">
                        <span class="step-number">2</span>
                        Billing Address
                      </h4>
                      <div class="section-content">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <label for="firstName" class="form-label">First Name *</label>
                              <input 
                                type="text" 
                                id="firstName"
                                class="form-control" 
                                v-model="billingAddress.first_name"
                                required
                              >
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group">
                              <label for="lastName" class="form-label">Last Name *</label>
                              <input 
                                type="text" 
                                id="lastName"
                                class="form-control" 
                                v-model="billingAddress.last_name"
                                required
                              >
                            </div>
                          </div>
                        </div>
                        <div class="form-group">
                          <label for="address1" class="form-label">Address Line 1 *</label>
                          <input 
                            type="text" 
                            id="address1"
                            class="form-control" 
                            v-model="billingAddress.address_1"
                            required
                          >
                        </div>
                        <div class="form-group">
                          <label for="address2" class="form-label">Address Line 2</label>
                          <input 
                            type="text" 
                            id="address2"
                            class="form-control" 
                            v-model="billingAddress.address_2"
                          >
                        </div>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <label for="city" class="form-label">City *</label>
                              <input 
                                type="text" 
                                id="city"
                                class="form-control" 
                                v-model="billingAddress.city"
                                required
                              >
                            </div>
                          </div>
                          <div class="col-md-3">
                            <div class="form-group">
                              <label for="state" class="form-label">State/Province *</label>
                              <input 
                                type="text" 
                                id="state"
                                class="form-control" 
                                v-model="billingAddress.province"
                                required
                              >
                            </div>
                          </div>
                          <div class="col-md-3">
                            <div class="form-group">
                              <label for="zip" class="form-label">ZIP/Postal Code *</label>
                              <input 
                                type="text" 
                                id="zip"
                                class="form-control" 
                                v-model="billingAddress.postal_code"
                                required
                              >
                            </div>
                          </div>
                        </div>
                        <div class="form-group">
                          <label for="country" class="form-label">Country *</label>
                          <select 
                            id="country"
                            class="form-select" 
                            v-model="billingAddress.country_code"
                            required
                          >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <!-- Add more countries as needed -->
                          </select>
                        </div>
                      </div>
                    </div>

                    <!-- Shipping Address -->
                    <div class="checkout-section">
                      <h4 class="section-title">
                        <span class="step-number">3</span>
                        Shipping Address
                      </h4>
                      <div class="section-content">
                        <div class="form-check mb-3">
                          <input 
                            class="form-check-input" 
                            type="checkbox" 
                            id="sameAsBilling"
                            v-model="sameAsBilling"
                            @change="toggleShippingAddress"
                          >
                          <label class="form-check-label" for="sameAsBilling">
                            Same as billing address
                          </label>
                        </div>

                        <div v-if="!sameAsBilling">
                          <div class="row">
                            <div class="col-md-6">
                              <div class="form-group">
                                <label for="shippingFirstName" class="form-label">First Name *</label>
                                <input 
                                  type="text" 
                                  id="shippingFirstName"
                                  class="form-control" 
                                  v-model="shippingAddress.first_name"
                                  required
                                >
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group">
                                <label for="shippingLastName" class="form-label">Last Name *</label>
                                <input 
                                  type="text" 
                                  id="shippingLastName"
                                  class="form-control" 
                                  v-model="shippingAddress.last_name"
                                  required
                                >
                              </div>
                            </div>
                          </div>
                          <!-- Add more shipping address fields similar to billing -->
                        </div>
                      </div>
                    </div>

                    <!-- Shipping Method -->
                    <div class="checkout-section">
                      <h4 class="section-title">
                        <span class="step-number">4</span>
                        Shipping Method
                      </h4>
                      <div class="section-content">
                        <div class="shipping-methods">
                          <div 
                            v-for="method in shippingMethods" 
                            :key="method.id"
                            class="shipping-option"
                          >
                            <div class="form-check">
                              <input 
                                class="form-check-input" 
                                type="radio" 
                                :id="`shipping-${method.id}`"
                                :value="method.id"
                                v-model="selectedShippingMethod"
                              >
                              <label class="form-check-label w-100" :for="`shipping-${method.id}`">
                                <div class="d-flex justify-content-between align-items-center">
                                  <div>
                                    <strong>{{ method.name }}</strong>
                                    <div class="text-muted small">{{ method.description }}</div>
                                  </div>
                                  <div class="shipping-cost">
                                    <span v-if="method.cost === 0" class="text-success">Free</span>
                                    <span v-else>${{ method.cost.toFixed(2) }}</span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Payment Method -->
                    <div class="checkout-section">
                      <h4 class="section-title">
                        <span class="step-number">5</span>
                        Payment Method
                      </h4>
                      <div class="section-content">
                        <div class="payment-methods">
                          <div class="payment-option">
                            <div class="form-check">
                              <input 
                                class="form-check-input" 
                                type="radio" 
                                id="credit-card"
                                value="card"
                                v-model="selectedPaymentMethod"
                              >
                              <label class="form-check-label" for="credit-card">
                                <i class="fa fa-credit-card"></i> Credit Card
                              </label>
                            </div>
                          </div>
                          <div class="payment-option">
                            <div class="form-check">
                              <input 
                                class="form-check-input" 
                                type="radio" 
                                id="paypal"
                                value="paypal"
                                v-model="selectedPaymentMethod"
                              >
                              <label class="form-check-label" for="paypal">
                                <i class="fa fa-paypal"></i> PayPal
                              </label>
                            </div>
                          </div>
                        </div>

                        <!-- Credit Card Form -->
                        <div v-if="selectedPaymentMethod === 'card'" class="credit-card-form mt-3">
                          <div class="row">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label for="cardNumber" class="form-label">Card Number *</label>
                                <input 
                                  type="text" 
                                  id="cardNumber"
                                  class="form-control" 
                                  v-model="paymentInfo.cardNumber"
                                  placeholder="1234 5678 9012 3456"
                                  maxlength="19"
                                  @input="formatCardNumber"
                                  required
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-8">
                              <div class="form-group">
                                <label for="cardName" class="form-label">Cardholder Name *</label>
                                <input 
                                  type="text" 
                                  id="cardName"
                                  class="form-control" 
                                  v-model="paymentInfo.cardName"
                                  required
                                >
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="expiryDate" class="form-label">MM/YY *</label>
                                <input 
                                  type="text" 
                                  id="expiryDate"
                                  class="form-control" 
                                  v-model="paymentInfo.expiryDate"
                                  placeholder="MM/YY"
                                  maxlength="5"
                                  @input="formatExpiryDate"
                                  required
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="cvv" class="form-label">CVV *</label>
                                <input 
                                  type="text" 
                                  id="cvv"
                                  class="form-control" 
                                  v-model="paymentInfo.cvv"
                                  placeholder="123"
                                  maxlength="4"
                                  required
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Place Order Button -->
                    <div class="checkout-actions">
                      <button 
                        type="submit" 
                        class="btn btn-primary btn-lg w-100"
                        :disabled="processing"
                      >
                        <span v-if="processing">
                          <i class="fa fa-spinner fa-spin"></i> Processing...
                        </span>
                        <span v-else>
                          <i class="fa fa-lock"></i> Place Order
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

                <!-- Order Summary -->
                <div class="col-lg-4">
                  <div class="order-summary">
                    <div class="card">
                      <div class="card-header">
                        <h5 class="mb-0">Order Summary</h5>
                      </div>
                      <div class="card-body">
                        <!-- Order Items -->
                        <div class="order-items">
                          <div 
                            v-for="item in cartStore.items" 
                            :key="item.id"
                            class="order-item d-flex justify-content-between mb-2"
                          >
                            <div class="item-info">
                              <span class="item-name">{{ item.title }}</span>
                              <small class="text-muted d-block">Qty: {{ item.quantity }}</small>
                            </div>
                            <div class="item-price">
                              <span>${{ formatPrice(item.price * item.quantity) }}</span>
                            </div>
                          </div>
                        </div>

                        <hr>

                        <!-- Order Totals -->
                        <div class="order-totals">
                          <div class="total-item d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>${{ cartStore.subtotal }}</span>
                          </div>
                          <div class="total-item d-flex justify-content-between">
                            <span>Shipping:</span>
                            <span v-if="selectedShippingCost === 0" class="text-success">Free</span>
                            <span v-else>${{ selectedShippingCost.toFixed(2) }}</span>
                          </div>
                          <div class="total-item d-flex justify-content-between">
                            <span>Tax:</span>
                            <span>${{ tax.toFixed(2) }}</span>
                          </div>
                          <hr>
                          <div class="total-item d-flex justify-content-between">
                            <strong>Total:</strong>
                            <strong class="text-primary">${{ grandTotal.toFixed(2) }}</strong>
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
import { useRouter } from 'vue-router'
import DefaultLayout from '@/components/DefaultLayout.vue'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'Checkout',
  components: {
    DefaultLayout
  },
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    
    const processing = ref(false)
    const sameAsBilling = ref(true)
    const selectedShippingMethod = ref('standard')
    const selectedPaymentMethod = ref('card')

    const customerInfo = ref({
      email: '',
      phone: ''
    })

    const billingAddress = ref({
      first_name: '',
      last_name: '',
      address_1: '',
      address_2: '',
      city: '',
      province: '',
      postal_code: '',
      country_code: ''
    })

    const shippingAddress = ref({
      first_name: '',
      last_name: '',
      address_1: '',
      address_2: '',
      city: '',
      province: '',
      postal_code: '',
      country_code: ''
    })

    const paymentInfo = ref({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    })

    const shippingMethods = ref([
      {
        id: 'standard',
        name: 'Standard Shipping',
        description: '5-7 business days',
        cost: 10.00
      },
      {
        id: 'express',
        name: 'Express Shipping',
        description: '2-3 business days',
        cost: 20.00
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        description: 'Next business day',
        cost: 35.00
      },
      {
        id: 'free',
        name: 'Free Shipping',
        description: '7-10 business days',
        cost: 0
      }
    ])

    const selectedShippingCost = computed(() => {
      const method = shippingMethods.value.find(m => m.id === selectedShippingMethod.value)
      return method ? method.cost : 0
    })

    const tax = computed(() => {
      return parseFloat(cartStore.subtotal) * 0.08 // 8% tax
    })

    const grandTotal = computed(() => {
      return parseFloat(cartStore.subtotal) + selectedShippingCost.value + tax.value
    })

    const formatPrice = (price) => {
      return price ? price.toFixed(2) : '0.00'
    }

    const toggleShippingAddress = () => {
      if (sameAsBilling.value) {
        shippingAddress.value = { ...billingAddress.value }
      }
    }

    const formatCardNumber = (event) => {
      let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
      paymentInfo.value.cardNumber = formattedValue
    }

    const formatExpiryDate = (event) => {
      let value = event.target.value.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4)
      }
      paymentInfo.value.expiryDate = value
    }

    const validateForm = () => {
      // Basic validation
      if (!customerInfo.value.email) {
        alert('Please enter your email address')
        return false
      }

      if (!billingAddress.value.first_name || !billingAddress.value.last_name) {
        alert('Please enter your billing address')
        return false
      }

      if (!selectedShippingMethod.value) {
        alert('Please select a shipping method')
        return false
      }

      if (!selectedPaymentMethod.value) {
        alert('Please select a payment method')
        return false
      }

      if (selectedPaymentMethod.value === 'card') {
        if (!paymentInfo.value.cardNumber || !paymentInfo.value.cardName || 
            !paymentInfo.value.expiryDate || !paymentInfo.value.cvv) {
          alert('Please complete the credit card information')
          return false
        }
      }

      return true
    }

    const processCheckout = async () => {
      if (!validateForm()) {
        return
      }

      processing.value = true

      try {
        // Simulate checkout process
        await new Promise(resolve => setTimeout(resolve, 2000))

        // In a real application, you would:
        // 1. Create cart in Medusa
        // 2. Add items to cart
        // 3. Set billing/shipping addresses
        // 4. Select shipping method
        // 5. Create payment session
        // 6. Complete the cart

        // Clear cart and redirect to thank you page
        cartStore.clearCart()
        router.push('/thank-you')
      } catch (error) {
        console.error('Checkout error:', error)
        alert('There was an error processing your order. Please try again.')
      } finally {
        processing.value = false
      }
    }

    return {
      cartStore,
      processing,
      sameAsBilling,
      selectedShippingMethod,
      selectedPaymentMethod,
      customerInfo,
      billingAddress,
      shippingAddress,
      paymentInfo,
      shippingMethods,
      selectedShippingCost,
      tax,
      grandTotal,
      formatPrice,
      toggleShippingAddress,
      formatCardNumber,
      formatExpiryDate,
      processCheckout
    }
  }
}
</script>

<style scoped>
.checkout-page {
  padding: 20px 0;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.checkout-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
  overflow: hidden;
}

.section-title {
  background: #f8f9fa;
  padding: 20px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.step-number {
  background: #007bff;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-weight: bold;
}

.section-content {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-control,
.form-select {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.shipping-option,
.payment-option {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  transition: border-color 0.3s ease;
}

.shipping-option:hover,
.payment-option:hover {
  border-color: #007bff;
}

.shipping-option .form-check-input:checked ~ .form-check-label,
.payment-option .form-check-input:checked ~ .form-check-label {
  color: #007bff;
  font-weight: 600;
}

.shipping-cost {
  font-weight: 600;
  font-size: 16px;
}

.credit-card-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.checkout-actions {
  margin-top: 30px;
}

.checkout-actions .btn {
  font-size: 18px;
  font-weight: 600;
  padding: 15px;
}

.order-summary .card {
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 10px;
  position: sticky;
  top: 20px;
}

.order-summary .card-header {
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  font-weight: 600;
}

.order-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 500;
  color: #333;
}

.item-price {
  font-weight: 600;
  color: #e74c3c;
}

.total-item {
  padding: 8px 0;
  font-size: 16px;
}

.total-item:last-child {
  font-size: 20px;
  padding: 15px 0 5px 0;
}

@media (max-width: 768px) {
  .section-content {
    padding: 20px;
  }
  
  .step-number {
    width: 25px;
    height: 25px;
    font-size: 14px;
  }
  
  .section-title {
    font-size: 16px;
    padding: 15px;
  }
}
</style>
