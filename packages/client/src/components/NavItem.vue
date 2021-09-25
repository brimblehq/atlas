<script>
export default {
  name: "NavItem",
  props: {
    item: {
      type: Object,
    },
    mobile: {
      type: Boolean,
    },
  },
  methods: {
    comingSoon(title) {
      if (title == "Home") {
        return (location.href = "/");
      }

      const theme = localStorage.getItem("theme");
      const message = `${title} page will be available soon 🥴`;

      if (theme && theme == "Dark") {
        this.$toast.info(message, {
          position: "top",
        });
      } else {
        this.$toast.default(message, {
          position: "top",
        });
      }
    },
  },
};
</script>

<template>
  <li class="uppercase overflow-hidden">
    <button
      :class="
        item.isActive && mobile
          ? 'btn link-anim'
          : !item.isActive && mobile
          ? 'link link-anim'
          : item.isActive && !mobile
          ? 'btn'
          : 'link'
      "
      @click="comingSoon(item.name)"
    >
      {{ item.name }}
    </button>
  </li>
</template>
