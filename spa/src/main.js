import { createApp } from 'vue'
import { createPinia } from "pinia";
import router from "./router";
import './assets/styles/style.css'
import App from './App.vue'

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

import { FontAwesomeIcon } from '@/utils/plugins/font-awesome';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: "light",
    },
  },
});
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount('#app');