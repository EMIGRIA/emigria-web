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
            style: {
              background: "#003D4F",
              color: "#fff",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(0,237,100,0.15)",
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

