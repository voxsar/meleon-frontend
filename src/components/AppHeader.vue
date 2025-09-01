<template>
  <div id="sns_header" class="wrap">
    <!-- Header Top -->
    <div class="sns_header_top">
      <div class="container">
        <div class="sns_module">
          <div class="header-setting">
            <div class="module-setting">
              <div class="mysetting language-switcher">
                <div class="tongle">
                  <img alt="" src="/images/flag/english.png">
                  <span>English</span>
                </div>
                <div class="content">
                  <div class="language-switcher">
                    <ul id="select-language">
                      <li>
                        <a class="selected" href="#">
                          <img alt="" src="/images/flag/english.png">
                          <span>English</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <img alt="" src="/images/flag/brazil.png">
                          <span>Brazil</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <img alt="" src="/images/flag/france.png">
                          <span>France</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="mysetting currency-switcher">
                <div class="tongle">
                  <span class="gfont"> USD </span>
                </div>
                <div class="content">
                  <ul id="select-currency">
                    <li>
                      <a href="#"> EUR </a>
                    </li>
                    <li>
                      <a class="selected" href="#"> USD </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="header-account">
            <div class="myaccount">
              <div class="tongle">
                <i class="fa fa-user"></i>
                <span>My account</span>
                <i class="fa fa-angle-down"></i>
              </div>
              <div class="customer-ct content">
                <ul class="links">
                  <li class="first">
                    <a class="top-link-myaccount" title="My Account" href="#">My Account</a>
                  </li>
                  <li>
                    <a class="top-link-wishlist" title="My Wishlist" href="#">My Wishlist</a>
                  </li>
                  <li>
                    <router-link class="top-link-checkout" title="Checkout" to="/checkout">Checkout</router-link>
                  </li>
                  <li class=" last">
                    <a class="top-link-login" title="Log In" href="#">Login</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Header Logo -->
    <div id="sns_header_logo">
      <div class="container">
        <div class="container_in">
          <div class="row">
            <h1 id="logo" class="responsv col-md-3">
              <router-link to="/" title="Meleon Accessories Store">
                <img alt="Meleon" src="/images/logo.jpg"> 
              </router-link>
            </h1>
            <div class="col-md-9 policy">
              <div class="row">
                <div class="col-md-4 col-sm-4 col-phone-12">
                  <div class="policy_custom">
                    <div class="policy-icon">
                      <em class="fa fa-truck"> </em>
                    </div>
                    <p class="policy-titile">FREE DELIVERY WORLDWIDE</p>
                    <p class="policy-ct">On order over $100</p>
                  </div>
                </div>
                <div class="col-md-4 col-sm-4 col-phone-12">
                  <div class="policy_custom">
                    <div class="policy-icon">
                      <em class="fa fa-cloud-upload"> </em>
                    </div>
                    <p class="policy-titile">UP TO 20% OFF COSY LAYERS</p>
                    <p class="policy-ct">Premium accessories collection</p>
                  </div>
                </div>
                <div class="col-md-4 col-sm-4 col-phone-12">
                  <div class="policy_custom">
                    <div class="policy-icon">
                      <em class="fa fa-gift"> </em>
                    </div>
                    <p class="policy-titile">Buy 1 get 1 free</p>
                    <p class="policy-ct">On order over $100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Header Navigation -->
    <div id="sns_menu">
      <div class="container">
        <div class="container_in">
          <div class="row">
            <div class="col-md-9 sns-menu">
              <div class="sns-megamenu">
                <ul class="nav-menu level0">
                  <li class="level0 nav-1 group drop-submenu parent">
                    <router-link class="menu-title-lv0" to="/">
                      <span class="title">Home</span>
                    </router-link>
                  </li>
                  <li class="level0 nav-2 no-group drop-submenu parent">
                    <router-link class="menu-title-lv0" to="/shop">
                      <span class="title">Shop</span>
                    </router-link>
                  </li>
                  <li class="level0 nav-3 no-group drop-submenu parent">
                    <router-link class="menu-title-lv0" to="/collections">
                      <span class="title">Collections</span>
                    </router-link>
                  </li>
                  <li class="level0 nav-4 no-group">
                    <a class="menu-title-lv0" href="#">
                      <span class="title">About</span>
                    </a>
                  </li>
                  <li class="level0 nav-5 no-group">
                    <a class="menu-title-lv0" href="#">
                      <span class="title">Contact</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-md-3 social-links">
              <div class="sns-header-cart">
                <router-link to="/cart" class="cart-icon">
                  <i class="fa fa-shopping-cart"></i>
                  <span class="cart-count" v-if="cartStore.itemCount > 0">{{ cartStore.itemCount }}</span>
                  <span class="cart-text">Cart ({{ cartStore.total }})</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'

export default {
  name: 'AppHeader',
  setup() {
    const cartStore = useCartStore()
    
    return {
      cartStore
    }
  }
}
</script>

<style scoped>
.cart-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  color: #333;
  text-decoration: none;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.cart-text {
  margin-left: 8px;
}
</style>
