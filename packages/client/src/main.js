import { createApp } from "vue";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import App from "./App.vue";
import "./index.css";

createApp(App).use(VueToast).mount("#app");
