import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import Home from "./pages/Home";
import Result from "./pages/Result";
import Analytics from "./pages/Analytics";
import { ThemeProvider } from "./context/ThemeContext";
import CustomToast from "./components/common/CustomToast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          gutter={8}
          toastOptions={{ duration: 4000 }}
        >  
          {(t) => <CustomToast t={t} />}
        </Toaster>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

