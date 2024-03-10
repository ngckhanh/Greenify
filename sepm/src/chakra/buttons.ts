import type { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "60px",
    fontSize: "10pt",
    fontWeight: 700,
    _focus: {
      boxShadow: "none",
    },
  },
  sizes: {
    sm: {
      fontSize: "8pt",
    },
    md: {
      fontSize: "10pt",
      // height: "28px",
    },
  },
  variants: {
    solid: {
      color: "white",
      bg: "#0F3220",
      _hover: {
        bg: "blue.400",
      },
    },
    outline: {
      color: "#0F3220",
      border: "1px solid",
      borderColor: "#0F3220",
    },
    oauth: {
      height: "34px",
      border: "1px solid",
      borderColor: "gray.300",
      _hover: {
        bg: "gray.50",
      },
    },
    search: {
      borderRadius: "7px",
      width: "70px",
      height: "30px",
      color: "black",
      bg: "gray.400",
      _hover: {
        bg: "gray.500",
      },
    },
    create_pin: {
      borderRadius: "7px",
      width: "70px",
      height: "30px",
      color: "white",
      bg: "#0F3320",
      _hover: {
        bg: "#596642",
      },
    },
  },
};
