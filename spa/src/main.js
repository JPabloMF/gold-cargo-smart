import { createApp } from 'vue'
import { createPinia } from "pinia";
import router from "./router";
import './assets/styles/main.scss'
import App from './App.vue'
// PrimeVue Imports
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: "system",
    },
  },
});

app.mount('#app');