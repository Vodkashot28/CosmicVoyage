// src/main.tsx

import "./polyfills"; // Keep polyfills first

import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query"; // Import the necessary component
import { queryClient } from "@/lib/queryClient"; // Import the client instance
import App from "./App";
import "./index.css";

// Note: Removed the inline Buffer polyfill as it is now correctly inlined in ./polyfills.ts

createRoot(document.getElementById("root")!).render(
  // Wrap the entire application with the QueryClientProvider
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
