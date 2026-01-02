import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"; // твой Tailwind
 import "./App.css"; // если нужны старые стили друга

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <StudioList />
        </QueryClientProvider>
    </React.StrictMode>,
)