/** @type {import('tailwindcss').Config} */
import type {Config} from 'tailwindcss'


export const themeColors = {
   primary: {
      color: 'rgb(var(--primary-color) / <alpha-value>)'
   },
   accent: {
      color: 'rgb(var(--accent-color) / <alpha-value>)'
   },
   background: {
      color: 'rgb(var(--background-color) / <alpha-value>)',
      accent: 'rgb(var(--background-accent) / <alpha-value>)',
      reverse: `rgb(var(--background-text) / <alpha-value>)`
   }
};

export default {
   content: ['./src/**/*.{js,ts,jsx,tsx}'],
   theme: {
      extend: {
         colors: {...themeColors},
         keyframes: {
            slideIn: {
               "0%": {opacity: "0", transform: "translateX(100%)"},
               "100%": {opacity: "1", transform: "translateX(0)"}
            },
            slideOut: {
               "0%": {opacity: "1", transform: "translateX(0)"},
               "100%": {opacity: "0", transform: "translateX(100%)"}
            },
            fadeIn: {
               "0%": {opacity: "0"},
               "100%": {opacity: "1"}
            },
            fadeOut: {
               "0%": {opacity: "1"},
               "100%": {opacity: "0"}
            }
         },
         animation: {
            slideIn: "slideIn 700ms ease-in-out",
            slideOut: "slideOut 700ms ease-in-out",
            fadeIn: "fadeIn 400ms ease-in-out",
            fadeOut: "fadeOut 400ms ease-in-out",
         },
      },
   },
   plugins: [],
} satisfies Config;

