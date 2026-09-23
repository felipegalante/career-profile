import { Text } from "@career-profile/ui";
import { DocPage, MobileFrame, NotArtifactBacked } from "../../chrome/DocPage";

export function MobilePage() {
  return (
    <DocPage overline="Shell" title="Mobile shell" description="At 860px and below the rail becomes a top bar with a navigation drawer and page content becomes single-column. The frame embeds the application shell demo at 390px.">
      <div className="flex items-center justify-center gap-2"><NotArtifactBacked /><Text variant="meta" tone="muted">The drawer surface is not drawn in any artifact; the top bar follows profile/overview-mobile.html.</Text></div>
      <MobileFrame src="gallery.html#/shell/sidebar" title="Application shell at 390 pixels wide" />
    </DocPage>
  );
}
