import { Link } from "react-router";
import { Text } from "@career-profile/ui";
import { galleryGroups, galleryRoutes } from "../routes";
import { DocPage, Specimen } from "./DocPage";

export function GalleryIndex() {
  return (
    <DocPage overline="Career Profile design system" title="Component gallery" description="Every page renders @career-profile/ui components next to the design artifact it reproduces. Open the artifact HTML side by side to compare.">
      <div className="grid grid-cols-3 gap-4 max-shell:grid-cols-1">
        {galleryGroups.map((group) => {
          const routes = galleryRoutes.filter((route) => route.group === group);
          if (routes.length === 0) return null;
          return (
            <Specimen key={group} title={group}>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {routes.map((route) => (
                  <li key={route.path}>
                    <Link to={`/${route.path}`} className="font-medium text-brand-ink">{route.title}</Link>
                    <Text as="div" variant="meta" tone="faint">{route.artifact}</Text>
                  </li>
                ))}
              </ul>
            </Specimen>
          );
        })}
      </div>
    </DocPage>
  );
}
