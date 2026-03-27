import { createApp } from 'vue'
import { createPinia } from "pinia";
import router from "./router";
import './assets/styles/style.css'
import App from './App.vue'

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";

const GoldCargoPreset = definePreset(Aura, {
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '#ECBF26',
              borderColor: '#ECBF26',
              color: '#2C3D69',
              hoverBackground: '#d4a91f',
              hoverBorderColor: '#d4a91f',
              hoverColor: '#2C3D69',
              activeBackground: '#b8911a',
              activeBorderColor: '#b8911a',
              activeColor: '#2C3D69',
            },
          },
        },
      },
    },
  },
  semantic: {
    primary: {
      50:  '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '#2C3D69',
      600: '#253562',
      700: '#1e2d55',
      800: '#172448',
      900: '#101c3b',
      950: '#0a132e',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#2C3D69',
          inverseColor: '#ffffff',
          hoverColor: '#253562',
          activeColor: '#1e2d55',
        },
        highlight: {
          background: '#ECBF26',
          focusBackground: '#d4a91f',
          color: '#2C3D69',
          focusColor: '#2C3D69',
        },
      },
    },
  },
});

import { FontAwesomeIcon } from '@/utils/plugins/font-awesome';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: GoldCargoPreset,
    options: {
      darkModeSelector: "light",
    },
  },
});
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount('#app');