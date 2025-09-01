<template>
  <div id="sns_footer" class="footer_style vesion2 wrap">
    <div id="sns_footer_top" class="footer">
      <div class="container">
        <div class="container_in">
          <div class="row">
            <div class="col-md-3 col-sm-12 col-xs-12 column0">
              <div class="contact_us">
                <h6>Contact us</h6>
                <ul class="fa-ul">
                  <li class="pd-right">
                    <i class="fa-li fa fw fa-home"> </i>
                    8888 South Avenue Street, New York
                  </li>
                  <li>
                    <i class="fa-li fa fw fa-phone"> </i>
                    <p>(12) 3 456 7896</p>
                    <p>(12) 3 456 7895</p>
                  </li>
                  <li>
                    <i class="fa-li fa fw fa-envelope"> </i>
                    <p>
                      <a href="mailto:info@meleon.com">info@meleon.com</a>
                    </p>
                    <p>
                      <a href="mailto:support@meleon.com">support@meleon.com</a>
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div class="col-phone-12 col-xs-6 col-sm-3 col-md-2 column column1">
              <h6>Service</h6>
              <ul>
                <li>
                  <a href="#">Prices & Currencies</a>
                </li>
                <li>
                  <a href="#">Secure Payment</a>
                </li>
                <li>
                  <a href="#">Delivery Times & Costs</a>
                </li>
                <li>
                  <a href="#">Returns & Exchanges</a>
                </li>
                <li>
                  <a href="#">FAQ's</a>
                </li>
              </ul>
            </div>
            <div class="col-phone-12 col-xs-6 col-sm-3 col-md-2 column column2">
              <h6>Account</h6>
              <ul>
                <li>
                  <a href="#">My account</a>
                </li>
                <li>
                  <a href="#">Wishlist</a>
                </li>
                <li>
                  <a href="#">Order history</a>
                </li>
                <li>
                  <a href="#">Specials</a>
                </li>
                <li>
                  <a href="#">Gift vouchers</a>
                </li>
              </ul>
            </div>
            <div class="col-phone-12 col-xs-6 col-sm-3 col-md-2 column column3">
              <h6>Information</h6>
              <ul>
                <li>
                  <router-link to="/about">About Us</router-link>
                </li>
                <li>
                  <router-link to="/contact">Contact</router-link>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms & Conditions</a>
                </li>
                <li>
                  <a href="#">Site Map</a>
                </li>
              </ul>
            </div>
            <div class="col-phone-12 col-xs-6 col-sm-3 col-md-3 column column4">
              <div class="subcribe-footer">
                <div class="block_border block-subscribe">
                  <div class="block_head">
                    <h6>Newsletter</h6>
                    <p>Register your email for news</p>
                  </div>
                  <form @submit.prevent="subscribeNewsletter">
                    <div class="block_content">
                      <div class="input-box">
                        <div class="input_warp">
                          <input 
                            v-model="email" 
                            id="newsletter" 
                            class="input-text required-entry validate-email" 
                            type="email" 
                            title="Sign up for our newsletter" 
                            placeholder="Your email here" 
                            name="email"
                            required
                          >
                        </div>
                        <div class="button_warp">
                          <button class="button gfont" title="Subscribe" type="submit">
                            <span>
                              <span>Subscribe</span>
                            </span>
                          </button>
                        </div>
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

    <div id="sns_footer_bottom" class="footer">
      <div class="container">
        <div class="row">
          <div class="bottom-pd1 col-sm-6">
            <div class="sns-copyright">
              © 2025 Meleon Accessories Store. All Rights Reserved.
            </div>
          </div>
          <div class="bottom-pd2 col-sm-6">
            <div class="payment">
              <img src="/images/sns_paymal.png" alt="Payment Methods">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AppFooter',
  setup() {
    const email = ref('')

    const subscribeNewsletter = () => {
      if (email.value) {
        // Here you would integrate with your newsletter service
        console.log('Newsletter subscription:', email.value)
        alert('Thank you for subscribing to our newsletter!')
        email.value = ''
      }
    }

    return {
      email,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
/* Component-specific styles if needed */
</style>
