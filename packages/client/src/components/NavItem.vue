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
};
</script>

<template>
  <li class="uppercase overflow-hidden">
    <router-link
      :href="item.link"
      :class="
        item.isActive && mobile
          ? 'btn link-anim'
          : !item.isActive && mobile
          ? 'link link-anim'
          : item.isActive && !mobile
          ? 'btn'
          : 'link'
      "
    >
      {{ item.name }}
    </router-link>
  </li>
</template>
