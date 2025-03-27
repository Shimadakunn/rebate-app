import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import Page from "./page.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
    <Toaster position="top-center" />
  </StrictMode>
);
