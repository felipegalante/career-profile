import type { ReactNode } from "react";
import { Link } from "react-router";
import type { GalleryRoute } from "../routes";
import styles from "./GalleryFrame.module.css";

export function GalleryFrame({ route, children }: { route: GalleryRoute; children: ReactNode }) {
  if (route.bare) return <>{children}</>;
  return (
    <>
      <nav className={styles.bar} aria-label="Gallery">
        <Link to="/">All gallery pages</Link>
        <span className={styles.source}>docs/design/artifacts/{route.artifact}</span>
      </nav>
      {children}
    </>
  );
}
