<script>
import Header from "./layouts/Header.vue";
import Hero from "./layouts/Hero.vue";
import { gsap } from "gsap";

export default {
  name: "App",
  components: {
    Header,
    Hero,
  },
  data: () => ({
    isToggle: "",
  }),
  mounted() {
    if (
      localStorage.theme === "Dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      gsap.to(".ellipse", { x: "-200%" });
      this.isToggle = "Dark";
      document.documentElement.classList.add("dark");
    } else {
      gsap.to(".ellipse", { x: "0" });
      this.isToggle = "Light";
      document.documentElement.classList.remove("dark");
    }
  },
  methods: {
    toggle: function () {
      if (
        localStorage.theme === "Dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        gsap.to(".ellipse", { x: "0" });
        document.documentElement.classList.remove("dark");
        this.isToggle = "Light";
        localStorage.theme = "Light";
      } else {
        gsap.to(".ellipse", { x: "-200%" });
        document.documentElement.classList.add("dark");
        this.isToggle = "Dark";
        localStorage.theme = "Dark";
      }
    },
  },
};
</script>

<template>
  <div class="main">
    <Header :toggle="isToggle" />
    <Hero :is-toggle="isToggle" />
    <button class="toggle-switch" role="switch" @click="toggle">
      <span class="toggle-mode light-mode">Light mode</span>
      <span class="toggle-mode dark-mode">Dark mode</span>
      <div class="ellipse">
        <img
          v-if="isToggle === 'Dark'"
          src="https://storage.googleapis.com/brimble-assets/moon.svg"
          alt=""
        />
        <img
          v-if="isToggle === 'Light'"
          src="https://storage.googleapis.com/brimble-assets/sun.svg"
          alt=""
        />
      </div>
    </button>
  </div>
</template>
