import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "@primereact/core";
import { AppRouter } from "@/app/AppRouter";
import { AuthProvider } from "@/core/context";
import { primeReactConfig } from "@/core/config/primereact";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <AuthProvider>
        <PrimeReactProvider {...primeReactConfig}>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </PrimeReactProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
