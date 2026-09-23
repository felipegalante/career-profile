import { DocPage, Specimen, Swatch, TokenGrid } from "../../chrome/DocPage";

export function ColorPage() {
  return (
    <DocPage overline="Foundations" title="Color" description="A cool neutral canvas with an indigo brand accent. Semantic colors are reserved for system feedback.">
      <Specimen title="Core palette" description="Primary application surfaces and text.">
        <TokenGrid>
          <Swatch label="Canvas" background="var(--canvas)" parityId="swatch-canvas" />
          <Swatch label="Surface" background="var(--surface)" />
          <Swatch label="Sunken" background="var(--sunken)" />
          <Swatch label="Brand" background="var(--brand)" color="white" parityId="swatch-brand" />
          <Swatch label="Brand tint" background="var(--brand-tint)" color="var(--brand-ink)" />
          <Swatch label="Ink" background="var(--ink)" color="white" />
          <Swatch label="Line" background="var(--line)" />
          <Swatch label="Hover" background="var(--hover)" />
        </TokenGrid>
      </Specimen>
      <Specimen title="Semantic palette" description="Feedback colors are paired with text labels and icons." style={{ marginTop: 16 }}>
        <TokenGrid>
          <Swatch label="Success" background="var(--success-tint)" color="var(--success)" parityId="swatch-success" />
          <Swatch label="Info" background="var(--info-tint)" color="var(--info)" />
          <Swatch label="Warning" background="var(--warning-tint)" color="var(--warning)" />
          <Swatch label="Danger" background="var(--danger-tint)" color="var(--danger)" parityId="swatch-danger" />
        </TokenGrid>
      </Specimen>
    </DocPage>
  );
}
