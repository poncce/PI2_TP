// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const orangeTheme = createTheme({
  palette: {
    mode: "light", // modo claro
    primary: {
      main: "#f97316", // naranja principal
    },
    background: {
      default: "#ffffff", // fondo de toda la página
      paper: "#fff7ed", // tarjetas / formularios
    },
    text: {
      primary: "#1e1e1e", // texto oscuro
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={orangeTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
