// import { createApp } from "vue";
// import App from "./App.vue";
// import vuetify from "./plugins/vuetify";
// import { loadFonts } from "./plugins/webfontloader";

// loadFonts();

// createApp(App).use(vuetify).mount("#app");

// Import the necessary modules for Vue 3 and Vuetify
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify"; // Your Vuetify plugin
import { loadFonts } from "./plugins/webfontloader"; // Webfont loader for fonts

// Load any fonts you need (optional)
loadFonts();

// Create the Vue 3 app and use Vuetify
createApp(App).use(vuetify).mount("#app"); // Mount the app to the DOM
