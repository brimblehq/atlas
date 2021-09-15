<script>
import { ref, } from "vue";
import { gsap } from "gsap";
import Heading from "../components/Heading.vue";
import Modal from "../components/Modal.vue";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";

export default {
  name: "Hero",
  components: {
    Modal,
    Heading,
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
  },
  data() {
    return {
      tools: [
        {
          name: "vue",
          src: "https://res.cloudinary.com/dexg5uy3d/image/upload/v1631510746/vue_ml7atz.svg",
        },
        {
          name: "ember",
          src: "https://res.cloudinary.com/dexg5uy3d/image/upload/v1631510817/ember_xjetmd.svg",
        },
        {
          name: "react",
          src: "https://res.cloudinary.com/dexg5uy3d/image/upload/v1631510883/react_knhn9b.svg",
        },
        {
          name: "nuxt",
          src: "https://res.cloudinary.com/dexg5uy3d/image/upload/v1631510913/nuxt_egzrba.svg",
        },
        {
          name: "gatsby",
          src: "https://res.cloudinary.com/dexg5uy3d/image/upload/v1631510941/gatsby_xkzjth.svg",
        },
        {
          name: "svelte",
          src: "https://res.cloudinary.com/dexg5uy3d/image/upload/v1631510975/svelte_xwiupt.svg",
        },
        {
          name: "angular",
          src: "https://res.cloudinary.com/dexg5uy3d/image/upload/v1631511025/angular_lkh7fl.svg",
        },
        {
          name: "next",
          src: "https://res.cloudinary.com/dexg5uy3d/image/upload/v1631511058/next_vjvp3a.svg",
        },
        {
          name: "javascript",
          src: "https://res.cloudinary.com/dexg5uy3d/image/upload/v1631511086/javascript_djuubq.svg",
        },
      ],
      response: {
        status: "",
        data: {
          number: "",
        },
      },
    };
  },
  mounted() {
    const headingTl = gsap.timeline({ repeat: -1, yoyo: true });
    const dotsTl = gsap.timeline({ repeat: -1, yoyo: true });
    const logosTl = gsap.timeline({ repeat: -1 });
    gsap.set(".gatsby-anim", { opacity: 0 });
    gsap.set(".nuxt", { left: "30.5%" });
    gsap.set(".svelte", { right: "30.5%" });
    headingTl
      .from(".heading-gradient", { opacity: 0, duration: 3.2, ease: "Power.in" })
      .from(".heading-color", { opacity: 1, duration: 3.2 , ease: "Power.in" }, "-=2.2");
    dotsTl
      .fromTo(
        `.dots-up circle, .dots-down circle`,
        { opacity: 0 },
        { opacity: 1, duration: 4.2, ease: "Power.in" }
      );
    logosTl.fromTo(
      `.tool-anim`,
      { opacity: 0 },
      {
        opacity: 1,
        stagger: 2.2,
        ease: "Bounce.out",
      }
    )
    .to(".gatsby-anim", { opacity: 1, duration: 1.8 })
    .to(`.nuxt`, { left: "25.5%", duration: 1.2}, "-=1.6")
    .to(`.svelte`, { right: "25.5%", duration: 1.2}, "-=1.2")
    .to(".tool-anim", { opacity: 0, duration: 0.5 }, "+=0.1");
  },
  setup() {
    let isOpen = ref(false);

    return {
      isOpen,
      setIsOpen(value) {
        isOpen.value = value;
      },
    };
  },
  props: ["isToggle"],
  methods: {
    handleSubmit() {
      //API test :)
      this.response = {
        status: "Yay, we did it!!",
        data: {
          number: 666,
        },
      };
      //response => works ? 'Open success modal' : 'return or error message, whatever floats your boat :)'
      if (!this.isOpen) {
        this.setIsOpen(true);
      }
    }
  },
};
</script>

<template>
  <section class="hero">
    <div class="tools">
      <img
        :class="`absolute ${tool.name} hidden md:block tool ${
          tool.name === 'gatsby' ? 'gatsby-anim' : 'tool-anim'
        }`"
        :src="tool.src"
        alt=""
        :key="index"
        v-for="(tool, index) in tools"
      />
    </div>
    <Heading :toggle="isToggle" />
    <p class="info">Be the first to know when BRIMBLE launches</p>
    <form @submit.prevent="handleSubmit" class="form">
      <label class="visuallyHidden" for="waitlist">
        Input your email address
      </label>
      <input
        required
        placeholder="email address"
        class="input-mail"
        type="email"
        name="waitlist"
        id="waitlist"
      />
      <input class="form-btn" type="submit" value="Join Waitlist" />
    </form>
    <Modal :isOpen="isOpen" :setIsOpen="setIsOpen" :response="response" />
  </section>
</template>
