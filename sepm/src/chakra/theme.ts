// 1. Import `extendTheme`
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./buttons";
// import { Button } from "./button";

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      100: "#FF3C00",
      200: "#ECF2D9",
      300: "#596642",
      400: "#BCCC71",
      500: "#0F3220",
      600: "#233814",
    },
    green: {
      100: "#BCCC71",
      200: "#596642",
      300: "#233814",
      400: "#0F3220",
    },
  },
  fonts: {
    body: "Open Sans, sans-serif",
  },
  styles: {
    global: () => ({
      body: {
        bg: "#ECF2D9",
      },
    }),
  },
    components: {
      Button,
    },
});
