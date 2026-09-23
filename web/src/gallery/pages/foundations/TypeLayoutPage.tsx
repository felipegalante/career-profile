import { Text } from "@career-profile/ui";
import { DocPage, Specimen } from "../../chrome/DocPage";

export function TypeLayoutPage() {
  return (
    <DocPage overline="Foundations" title="Type, spacing, and layout" description="Geist for interface text, Geist Mono for compact counts and identifiers.">
      <div className="grid grid-cols-2 gap-4 max-shell:grid-cols-1">
        <Specimen title="Type scale" description="Compact hierarchy for profile-heavy screens.">
          <Text as="div" variant="display" data-parity-id="type-display">Display 32</Text>
          <Text as="div" variant="record" className="mt-[18px]" data-parity-id="type-record">Record 21</Text>
          <Text as="div" variant="section" className="mt-[18px]" data-parity-id="type-section">Section 16</Text>
          <Text as="div" variant="label" className="mt-[18px]" data-parity-id="type-label">Label 13 medium</Text>
          <Text as="div" variant="meta" tone="faint" className="mt-[18px]" data-parity-id="type-meta">Metadata 12</Text>
          <Text as="div" variant="overline" className="mt-[18px]" data-parity-id="type-overline">Overline 11</Text>
          <Text as="div" mono className="mt-[18px]" data-parity-id="type-mono">MONO 14 · 18 skills</Text>
        </Specimen>
        <Specimen title="Spacing and radius" description="Components use the artifact's literal spacing; page layout uses the 4px Tailwind scale. Radii step from 6 through 14.">
          <div className="flex flex-col gap-4">
            {[25, 50, 75, 100].map((width) => (
              <div key={width} className="h-8 rounded-xl bg-brand-tint shadow-e1" style={{ width: `${width}%` }} />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[6, 10, 14].map((radius) => (
              <div key={radius} className="h-[78px] bg-sunken" style={{ borderRadius: radius }} />
            ))}
          </div>
        </Specimen>
      </div>
    </DocPage>
  );
}
