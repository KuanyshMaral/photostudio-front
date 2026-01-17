import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
<<<<<<< HEAD
import { AuthProvider } from "./context/AuthContext.tsx";
=======
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
