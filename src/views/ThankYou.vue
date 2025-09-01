<template>
  <DefaultLayout>
    <div id="sns_content" class="wrap layout-m">
      <div class="container">
        <div class="row">
          <div id="sns_main" class="col-md-12 col-main">
            <div class="thank-you-page">
              <div class="row justify-content-center">
                <div class="col-lg-8">
                  <div class="thank-you-content text-center">
                    <!-- Success Icon -->
                    <div class="success-icon mb-4">
                      <i class="fa fa-check-circle fa-5x text-success"></i>
                    </div>

                    <!-- Thank You Message -->
                    <h1 class="thank-you-title mb-3">Thank You for Your Order!</h1>
                    <p class="thank-you-subtitle mb-4">
                      Your order has been successfully placed and is being processed.
                    </p>

                    <!-- Order Details -->
                    <div class="order-confirmation card mb-4">
                      <div class="card-body">
                        <h4 class="mb-3">Order Confirmation</h4>
                        <div class="order-info row">
                          <div class="col-md-6">
                            <div class="info-item">
                              <strong>Order Number:</strong>
                              <span class="order-number">#{{ orderNumber }}</span>
                            </div>
                            <div class="info-item">
                              <strong>Order Date:</strong>
                              <span>{{ formatDate(orderDate) }}</span>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="info-item">
                              <strong>Email:</strong>
                              <span>{{ customerEmail }}</span>
                            </div>
                            <div class="info-item">
                              <strong>Total Amount:</strong>
                              <span class="order-total">${{ orderTotal }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- What's Next -->
                    <div class="next-steps card mb-4">
                      <div class="card-body">
                        <h5 class="mb-3">What's Next?</h5>
                        <div class="steps-list">
                          <div class="step-item">
                            <div class="step-icon">
                              <i class="fa fa-envelope"></i>
                            </div>
                            <div class="step-content">
                              <h6>Order Confirmation Email</h6>
                              <p>We've sent you an order confirmation email with all the details.</p>
                            </div>
                          </div>
                          <div class="step-item">
                            <div class="step-icon">
                              <i class="fa fa-box"></i>
                            </div>
                            <div class="step-content">
                              <h6>Processing</h6>
                              <p>We'll start processing your order within 24 hours.</p>
                            </div>
                          </div>
                          <div class="step-item">
                            <div class="step-icon">
                              <i class="fa fa-truck"></i>
                            </div>
                            <div class="step-content">
                              <h6>Shipping</h6>
                              <p>You'll receive a tracking number once your order ships.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Estimated Delivery -->
                    <div class="delivery-info card mb-4">
                      <div class="card-body">
                        <h5 class="mb-3">Estimated Delivery</h5>
                        <div class="delivery-timeline">
                          <div class="timeline-item">
                            <div class="timeline-date">
                              <strong>{{ formatDate(estimatedShipDate) }}</strong>
                              <small>Ships</small>
                            </div>
                            <div class="timeline-connector"></div>
                            <div class="timeline-date">
                              <strong>{{ formatDate(estimatedDeliveryDate) }}</strong>
                              <small>Delivered</small>
                            </div>
                          </div>
                        </div>
                        <p class="text-muted mt-3">
                          <small>* Delivery dates are estimates and may vary based on location and shipping method.</small>
                        </p>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-buttons">
                      <router-link to="/shop" class="btn btn-primary btn-lg me-3">
                        <i class="fa fa-shopping-bag"></i> Continue Shopping
                      </router-link>
                      <button class="btn btn-outline-primary btn-lg" @click="printOrder">
                        <i class="fa fa-print"></i> Print Order
                      </button>
                    </div>

                    <!-- Customer Support -->
                    <div class="customer-support mt-5">
                      <h6>Need Help?</h6>
                      <p class="text-muted">
                        If you have any questions about your order, please contact our customer support team.
                      </p>
                      <div class="support-options">
                        <a href="mailto:support@meleon.com" class="support-link">
                          <i class="fa fa-envelope"></i> support@meleon.com
                        </a>
                        <a href="tel:+1234567890" class="support-link">
                          <i class="fa fa-phone"></i> (123) 456-7890
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recommended Products -->
              <div class="recommended-products mt-5" v-if="recommendedProducts.length > 0">
                <h3 class="section-title text-center mb-4">You Might Also Like</h3>
                <div class="products-grid row style_grid">
                  <ProductCard 
                    v-for="product in recommendedProducts" 
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
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import ProductCard from '@/components/ProductCard.vue'
import { medusaService } from '@/services/medusa'

export default {
  name: 'ThankYou',
  components: {
    DefaultLayout,
    ProductCard
  },
  setup() {
    const orderNumber = ref(generateOrderNumber())
    const orderDate = ref(new Date())
    const customerEmail = ref('customer@example.com') // This would come from the checkout process
    const orderTotal = ref('125.99') // This would come from the checkout process
    const recommendedProducts = ref([])

    const estimatedShipDate = ref(new Date(Date.now() + (1 * 24 * 60 * 60 * 1000))) // Tomorrow
    const estimatedDeliveryDate = ref(new Date(Date.now() + (5 * 24 * 60 * 60 * 1000))) // 5 days from now

    function generateOrderNumber() {
      return 'ORD' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100)
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    }

    const printOrder = () => {
      window.print()
    }

    const fetchRecommendedProducts = async () => {
      try {
        const products = await medusaService.getProducts({
          limit: 4
        })
        recommendedProducts.value = products || []
      } catch (error) {
        console.error('Error fetching recommended products:', error)
        recommendedProducts.value = []
      }
    }

    onMounted(() => {
      fetchRecommendedProducts()
      
      // In a real application, you might get order details from route params or store
      // For demo purposes, we'll use mock data
    })

    return {
      orderNumber,
      orderDate,
      customerEmail,
      orderTotal,
      estimatedShipDate,
      estimatedDeliveryDate,
      recommendedProducts,
      formatDate,
      printOrder
    }
  }
}
</script>

<style scoped>
.thank-you-page {
  padding: 40px 0;
  min-height: 70vh;
}

.success-icon {
  margin-bottom: 30px;
}

.thank-you-title {
  font-size: 36px;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 15px;
}

.thank-you-subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.order-confirmation {
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-radius: 15px;
}

.order-confirmation .card-body {
  padding: 30px;
}

.order-info .info-item {
  margin-bottom: 15px;
  font-size: 16px;
}

.order-info strong {
  color: #333;
  margin-right: 10px;
}

.order-number {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #007bff;
  font-size: 18px;
}

.order-total {
  font-weight: bold;
  color: #28a745;
  font-size: 18px;
}

.next-steps {
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-radius: 15px;
}

.steps-list {
  text-align: left;
}

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.step-icon {
  background: #007bff;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 20px;
  flex-shrink: 0;
}

.step-content h6 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.step-content p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.delivery-info {
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-radius: 15px;
}

.delivery-timeline {
  padding: 20px 0;
}

.timeline-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.timeline-date {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 10px;
  text-align: center;
  border: 2px solid #007bff;
}

.timeline-date strong {
  display: block;
  color: #007bff;
  font-size: 16px;
}

.timeline-date small {
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.timeline-connector {
  width: 60px;
  height: 3px;
  background: #007bff;
  margin: 0 20px;
}

.action-buttons {
  margin: 40px 0;
}

.action-buttons .btn {
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 50px;
}

.customer-support {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  border: 1px solid #eee;
}

.customer-support h6 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.support-options {
  margin-top: 20px;
}

.support-link {
  display: inline-block;
  margin: 0 15px;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.support-link:hover {
  text-decoration: underline;
}

.support-link i {
  margin-right: 8px;
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

@media (max-width: 768px) {
  .thank-you-title {
    font-size: 28px;
  }
  
  .thank-you-subtitle {
    font-size: 16px;
  }
  
  .step-item {
    flex-direction: column;
    text-align: center;
  }
  
  .step-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .timeline-item {
    flex-direction: column;
  }
  
  .timeline-connector {
    width: 3px;
    height: 40px;
    margin: 15px 0;
  }
  
  .action-buttons .btn {
    display: block;
    width: 100%;
    margin-bottom: 10px;
  }
}

@media print {
  .action-buttons,
  .recommended-products,
  .customer-support {
    display: none !important;
  }
  
  .thank-you-page {
    padding: 20px 0;
  }
}
</style>
