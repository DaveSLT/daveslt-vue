// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
//import { createVuetify } from 'vuetify'

import { createVuetify } from "vuetify";
import "vuetify/styles"; // Ensure Vuetify styles are loaded
import { aliases, mdi } from "vuetify/iconsets/mdi"; // For icons

export default createVuetify({
  icons: {
    defaultSet: "mdi", // Use the Material Design Icons
    aliases,
    sets: {
      mdi,
    },
  },
});

//export default createVuetify();
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
