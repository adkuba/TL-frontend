import { createApp } from './main.js';

const { app, router, store } = createApp();

router.onReady(() => {
	// replacing store from server
	if (window.__INITIAL_STATE__) {
		store.replaceState(window.__INITIAL_STATE__);
	}

	app.$mount('#app');
})