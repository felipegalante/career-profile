import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import "./gallery.css";
import { GalleryApp } from "./GalleryApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <GalleryApp />
    </HashRouter>
  </StrictMode>
);
