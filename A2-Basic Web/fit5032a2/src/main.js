// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import store from './store';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    store.dispatch('initializeAuth'); // Start monitoring authentication state
  }
};

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)
app.use(Toast);
app.use(store);

app.mount('#app')
