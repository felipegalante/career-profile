import type { ReactNode } from "react";
import { Route, Routes, useHref, useNavigate } from "react-router";
import { UiProvider } from "@career-profile/ui";
import { GalleryFrame } from "./chrome/GalleryFrame";
import { GalleryIndex } from "./chrome/GalleryIndex";
import { galleryPages } from "./pages";
import { galleryRoutes } from "./routes";

function RouterAwareUi({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return <UiProvider navigate={navigate} useHref={useHref}>{children}</UiProvider>;
}

export function GalleryApp() {
  return (
    <RouterAwareUi>
      <Routes>
        <Route index element={<GalleryIndex />} />
        {galleryRoutes.map((route) => {
          const Page = galleryPages[route.path];
          return <Route key={route.path} path={route.path} element={<GalleryFrame route={route}><Page /></GalleryFrame>} />;
        })}
      </Routes>
    </RouterAwareUi>
  );
}
