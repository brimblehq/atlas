<script
>
import Header from "./layouts/Header.vue";
import Hero from "./layouts/Hero.vue";
import {gsap} from 'gsap';

export default {
  name: 'App',
  components: {
    Header,
    Hero
  },
  data() {
    return {
      menu: [
        'Home', 'Pricing', 'About', 'Framework'
      ],
      isToggle: ''
    }
  },
  methods: {
    toggle: function() {
    if (localStorage.theme === 'Dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        gsap.to('.ellipse', {x: '0'})
        document.documentElement.classList.remove('dark')
        this.isToggle = "Light"
        localStorage.theme = 'Light'
    } else {
        gsap.to('.ellipse', {x: '-200%'})
        document.documentElement.classList.add('dark')
        this.isToggle = "Dark"
        localStorage.theme = 'Dark'
    }
    }
  },
  mounted() {
    if (localStorage.theme === 'Dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      gsap.to('.ellipse', {x: '-200%'})
      this.isToggle = "Dark"
      document.documentElement.classList.add('dark')
    } else {
        gsap.to('.ellipse', {x: '0'})
        this.isToggle = "Light"
        document.documentElement.classList.remove('dark')
    }
  }
}
</script>

<template>
  <div class="main">
    <Header :toggle="isToggle"/>
    <Hero :isToggle="isToggle"/>
    <button v-on:click="toggle" class="toggle-switch" role="switch">
      <span class="toggle-mode light-mode">Light mode</span>
      <span class="toggle-mode dark-mode">Dark mode</span>
      <div class="ellipse">
        <img v-if="isToggle === 'Dark'" src="https://res.cloudinary.com/dexg5uy3d/image/upload/v1631553656/bi_moon-stars_lvpyxk.svg" alt="">
        <img v-if="isToggle === 'Light'" src="https://res.cloudinary.com/dexg5uy3d/image/upload/v1631553628/clarity_sun-line_rzlflp.svg" alt="">
      </div>  
    </button>
  </div>
</template>

