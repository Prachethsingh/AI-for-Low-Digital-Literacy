import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./ui/App";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./ui/styles.css";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#15803d' },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

