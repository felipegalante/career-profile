import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import "@career-profile/ui/styles.css";
import "./gallery.css";
import { GalleryApp } from "./GalleryApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <GalleryApp />
    </HashRouter>
  </StrictMode>
);
