<script>
import { ref } from "vue";
import { gsap } from "gsap";
import Heading from "../components/Heading.vue";
import Modal from "../components/Modal.vue";

export default {
  name: "Hero",
  components: { Modal, Heading },
  props: {
    isToggle: {
      type: String,
      required: true,
    },
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
  data() {
    return {
      tools: [
        {
          name: "vue",
          src: "https://storage.googleapis.com/brimble-assets/vue.svg",
        },
        {
          name: "ember",
          src: "https://storage.googleapis.com/brimble-assets/ember.svg",
        },
        {
          name: "react",
          src: "https://storage.googleapis.com/brimble-assets/react.svg",
        },
        {
          name: "nuxt",
          src: "https://storage.googleapis.com/brimble-assets/nuxt.svg",
        },
        {
          name: "gatsby",
          src: "https://storage.googleapis.com/brimble-assets/gatsby.svg",
        },
        {
          name: "svelte",
          src: "https://storage.googleapis.com/brimble-assets/svelte.svg",
        },
        {
          name: "angular",
          src: "https://storage.googleapis.com/brimble-assets/angular.svg",
        },
        {
          name: "next",
          src: "https://storage.googleapis.com/brimble-assets/next.svg",
        },
        {
          name: "javascript",
          src: "https://storage.googleapis.com/brimble-assets/javascript.svg",
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
      .from(".heading-gradient", {
        opacity: 0,
        duration: 3.2,
        ease: "Power.in",
      })
      .from(
        ".heading-color",
        { opacity: 1, duration: 3.2, ease: "Power.in" },
        "-=2.2"
      );
    dotsTl.fromTo(
      `.dots-up circle, .dots-down circle`,
      { opacity: 0 },
      { opacity: 1, duration: 4.2, ease: "Power.in" }
    );
    logosTl
      .fromTo(
        `.tool-anim`,
        { opacity: 0 },
        {
          opacity: 1,
          stagger: 2.2,
          ease: "Bounce.out",
        }
      )
      .to(".gatsby-anim", { opacity: 1, duration: 1.8 })
      .to(`.nuxt`, { left: "25.5%", duration: 1.2 }, "-=1.6")
      .to(`.svelte`, { right: "25.5%", duration: 1.2 }, "-=1.2")
      .to(".tool-anim", { opacity: 0, duration: 0.5 }, "+=0.1");
  },
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
    },
  },
};
</script>

<template>
  <section class="hero">
    <div class="tools">
      <img
        v-for="(tool, index) in tools"
        :key="index"
        :class="`absolute ${tool.name} hidden md:block tool ${
          tool.name === 'gatsby' ? 'gatsby-anim' : 'tool-anim'
        }`"
        :src="tool.src"
        alt=""
      />
    </div>
    <Heading :toggle="isToggle" />
    <p class="info">Be the first to know when BRIMBLE launches</p>
    <form class="form" @submit.prevent="handleSubmit">
      <label class="visuallyHidden" for="waitlist">
        Input your email address
      </label>
      <input
        id="waitlist"
        required
        placeholder="email address"
        class="input-mail"
        type="email"
        name="waitlist"
      />
      <input class="form-btn" type="submit" value="Join Waitlist" />
    </form>
    <Modal :is-open="isOpen" :set-is-open="setIsOpen" :response="response" />
  </section>
</template>
