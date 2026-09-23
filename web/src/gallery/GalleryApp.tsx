import { Route, Routes } from "react-router";
import { ToastProvider } from "@career-profile/ui";
import { GalleryFrame } from "./chrome/GalleryFrame";
import { GalleryIndex } from "./chrome/GalleryIndex";
import { galleryPages } from "./pages";
import { galleryRoutes } from "./routes";

export function GalleryApp() {
  return (
    <ToastProvider>
      <Routes>
        <Route index element={<GalleryIndex />} />
        {galleryRoutes.map((route) => {
          const Page = galleryPages[route.path];
          return <Route key={route.path} path={route.path} element={<GalleryFrame route={route}><Page /></GalleryFrame>} />;
        })}
      </Routes>
    </ToastProvider>
  );
}
