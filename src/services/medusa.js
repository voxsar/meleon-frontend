import { Store, Client } from "@medusajs/js-sdk"

// Initialize MedusaJS client with publishable API key
// The publishable key is required for all store API requests
const client = new Client({
  baseUrl: import.meta.env.VUE_APP_MEDUSA_URL || "https://admin.meleon.shop",
  publishableKey: import.meta.env.VUE_APP_MEDUSA_PUBLISHABLE_KEY || "pk_c01a0dcfb53975198fdf1d15ca95fd4c1c545349059cd9a54dea817020f023a4",
  debug: import.meta.env.DEV
})

const medusa = new Store(client)

export default medusa

export const medusaService = {
  // Products
  getProducts: async (params = {}) => {
    try {
      const response = await medusa.product.list(params)
      return response.products
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },

  getProduct: async (id) => {
    try {
      const response = await medusa.product.retrieve(id)
      return response.product
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  },

  // Collections
  getCollections: async () => {
    try {
      const response = await medusa.collection.list()
      return response.collections
    } catch (error) {
      console.error('Error fetching collections:', error)
      return []
    }
  },

  getCollection: async (id) => {
    try {
      const response = await medusa.collection.retrieve(id)
      return response.collection
    } catch (error) {
      console.error('Error fetching collection:', error)
      return null
    }
  },

  // Cart
  createCart: async () => {
    try {
      const response = await medusa.cart.create()
      return response.cart
    } catch (error) {
      console.error('Error creating cart:', error)
      return null
    }
  },

  getCart: async (cartId) => {
    try {
      const response = await medusa.cart.retrieve(cartId)
      return response.cart
    } catch (error) {
      console.error('Error fetching cart:', error)
      return null
    }
  },

  addToCart: async (cartId, variantId, quantity = 1) => {
    try {
      const response = await medusa.cart.createLineItem(cartId, {
        variant_id: variantId,
        quantity: quantity
      })
      return response.cart
    } catch (error) {
      console.error('Error adding to cart:', error)
      return null
    }
  },

  updateCartItem: async (cartId, lineId, quantity) => {
    try {
      const response = await medusa.cart.updateLineItem(cartId, lineId, {
        quantity: quantity
      })
      return response.cart
    } catch (error) {
      console.error('Error updating cart item:', error)
      return null
    }
  },

  removeFromCart: async (cartId, lineId) => {
    try {
      const response = await medusa.cart.deleteLineItem(cartId, lineId)
      return response.cart
    } catch (error) {
      console.error('Error removing from cart:', error)
      return null
    }
  },

  // Checkout
  createPaymentSessions: async (cartId) => {
    try {
      const response = await medusa.cart.createPaymentSessions(cartId)
      return response.cart
    } catch (error) {
      console.error('Error creating payment sessions:', error)
      return null
    }
  },

  setPaymentSession: async (cartId, providerId) => {
    try {
      const response = await medusa.cart.setPaymentSession(cartId, {
        provider_id: providerId
      })
      return response.cart
    } catch (error) {
      console.error('Error setting payment session:', error)
      return null
    }
  },

  completeCart: async (cartId) => {
    try {
      const response = await medusa.cart.complete(cartId)
      return response.order
    } catch (error) {
      console.error('Error completing cart:', error)
      return null
    }
  },

  // Regions
  getRegions: async () => {
    try {
      const response = await medusa.region.list()
      return response.regions
    } catch (error) {
      console.error('Error fetching regions:', error)
      return []
    }
  },

  // Shipping Options
  getShippingOptions: async (cartId) => {
    try {
      const response = await medusa.fulfillment.listCartOptions(cartId)
      return response.shipping_options
    } catch (error) {
      console.error('Error fetching shipping options:', error)
      return []
    }
  }
}
