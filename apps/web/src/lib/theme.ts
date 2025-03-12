"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#007C5F",
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  cssVariables: true,
});

export default theme;
