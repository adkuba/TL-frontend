import { createApp } from './main.js';

// client-specific bootstrapping logic...

const { app, store } = createApp()

if (window.__INITIAL_STATE__) {
    // We initialize the store state with the data injected from the server
    store.replaceState(window.__INITIAL_STATE__)
  }

// this assumes App.vue template root element has `id="app"`
app.$mount('#app')