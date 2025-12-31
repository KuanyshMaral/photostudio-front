import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"; // твой Tailwind
 import "./App.css"; // если нужны старые стили друга

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
