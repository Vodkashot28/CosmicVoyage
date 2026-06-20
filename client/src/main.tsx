// src/main.tsx
import "./polyfills"; // Keep polyfills first

import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root")!;
rootEl.innerHTML = "";

createRoot(rootEl).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
