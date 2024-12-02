import blueskyTailwind from "@evomark/vue-bluesky-feed/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: [...blueskyTailwind(), "./src/**/*.{vue,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
