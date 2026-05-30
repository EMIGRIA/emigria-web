import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import Home from "./pages/Home";
import Result from "./pages/Result";
import Analytics from "./pages/Analytics";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            className: "emigria-toast",
            duration: 4000,
            success: {
              className: "emigria-toast emigria-toast-success",
              iconTheme: {
                primary: "var(--brand-green)",
                secondary: "transparent",
              },
            },
            error: {
              className: "emigria-toast emigria-toast-error",
              iconTheme: {
                primary: "var(--risk-high)",
                secondary: "transparent",
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

