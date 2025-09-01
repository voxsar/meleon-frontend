// Configuration file for MedusaJS client
export const medusaConfig = {
  baseUrl: import.meta.env.VUE_APP_MEDUSA_URL || "https://admin.meleon.shop",
  publishableKey: import.meta.env.VUE_APP_MEDUSA_PUBLISHABLE_KEY,
  debug: import.meta.env.DEV,
  
  // Validate configuration
  validate() {
    if (!this.publishableKey) {
      throw new Error(`
❌ MedusaJS Configuration Error:
VUE_APP_MEDUSA_PUBLISHABLE_KEY is required but not found in environment variables.

Please:
1. Check that your .env file exists in the project root
2. Ensure it contains: VUE_APP_MEDUSA_PUBLISHABLE_KEY=pk_your_key_here
3. Restart your development server after making changes

Your publishable key can be found in your Medusa admin dashboard under Settings > Publishable API Keys.
      `)
    }
    
    if (!this.baseUrl) {
      throw new Error('VUE_APP_MEDUSA_URL is required but not found in environment variables.')
    }
    
    return true
  }
}
