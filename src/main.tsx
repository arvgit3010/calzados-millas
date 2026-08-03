import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "@/app/AppRouter";
import { AuthProvider } from "@/core/context";
import { BotinesSocketProvider } from "@/core/socket";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <AuthProvider>
        <BotinesSocketProvider>
          <BrowserRouter>
            <AppRouter />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontSize: "14px",
                  borderRadius: "12px",
                },
              }}
            />
          </BrowserRouter>
        </BotinesSocketProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
