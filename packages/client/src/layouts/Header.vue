<script>
import { gsap } from "gsap";
import NavItem from "../components/NavItem.vue";
import SocialItem from "../components/SocialItem.vue";
import BrimbleLogo from "../components/BrimbleLogo.vue";

export default {
  name: "Home",
  components: {
    NavItem,
    SocialItem,
    BrimbleLogo,
  },
  data() {
    return {
      items: [
        {
          name: "Home",
          link: "#",
          isActive: true,
        },
        {
          name: "Pricing",
          link: "#",
          isActive: false,
        },
        {
          name: "About",
          link: "#",
          isActive: false,
        },
        {
          name: "Framework",
          link: "#",
          isActive: false,
        },
      ],
      socialLinks: [
        {
          name: "Github",
          label: "View brimble github repo",
          href: "https://github.com/brimblehq",
        },
        {
          name: "Twitter",
          label: "View brimble twitter profile",
          href: "https://twitter.com/brimblehq",
        },
      ],
    };
  },
  mounted() {
    window.tl = gsap.timeline({ paused: true });
    window.tl
      .to("body, html", { overflowY: "hidden" })
      .to(".line-2", {
        x: "-5px",
        y: "-7px",
        rotate: 45,
        duration: 1,
        ease: "expo.out",
      })
      .to(
        ".line-1",
        { x: "-4px", y: "4px", rotate: -45, duration: 1, ease: "expo.out" },
        "-=1"
      )
      .to(".nav-bg", { top: 0, duration: 1, ease: "Power3.out" }, "-=1")
      .to(".nav-mobile", { top: 0, duration: 0.9, ease: "Power3.out" }, "-=0.9")
      .fromTo(
        ".link-anim",
        { y: "50px" },
        { y: 0, stagger: 0.2, ease: "expo.out" },
        "-0.1"
      );
    window.tl.reverse();
  },
  methods: {
    menuAnim: function () {
      window.tl.reversed() ? window.tl.play() : window.tl.reverse();
    },
  },
};
</script>

<template>
  <header class="header">
    <BrimbleLogo />
    <button
      aria-label="Click to open main menu"
      class="menu-btn"
      @click="menuAnim"
    >
      <span class="line line-1"></span>
      <span class="line line-2"></span>
    </button>
    <nav class="nav-lg">
      <ul class="menu-lg" role="list">
        <NavItem
          v-for="(item, index) in items"
          :key="index"
          :mobile="false"
          :item="item"
        />
      </ul>
    </nav>
    <ul class="socials-lg" role="list">
      <SocialItem
        v-for="(item, index) in socialLinks"
        :key="index"
        :item="item"
      />
    </ul>
    <nav class="nav-mobile">
      <ul class="menu-mobile" role="list">
        <NavItem
          v-for="(item, index) in items"
          :key="index"
          :mobile="true"
          :item="item"
        />
      </ul>
      <ul class="socials-mobile">
        <SocialItem
          v-for="(item, index) in socialLinks"
          :key="index"
          :item="item"
        />
      </ul>
    </nav>
    <div class="nav-bg"></div>
  </header>
</template>
