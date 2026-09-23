import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AUTH_TAGLINE, AuthHeader, AuthLayout, AuthShowcase } from "./Auth";
import { ChooseFileButton, FileDropzone } from "../FileDropzone/FileDropzone";
import { ResumeHeader, ResumeItem, ResumePaper, ResumePreview, ResumeSection, ResumeSkills } from "../Resume/Resume";

describe("AuthLayout", () => {
  it("renders the card heading, tagline and a decorative showcase", () => {
    render(
      <AuthLayout art={<AuthShowcase overline="Build a profile that stays useful" title="Connect the parts of your professional story." description="Add structured experience." records={[{ kind: "Experience", title: "Senior Product Engineer", meta: "Shopify · Full-time" }]} skills={{ overline: "Your skills profile", title: "Skills connected to your profile", chips: ["TypeScript"], note: "Organize proficiency." }} benefits={["Catalog-backed suggestions."]} />}>
        <AuthHeader overline="Welcome back" title="Sign in to Career Profile" lead="Continue building your professional profile." />
      </AuthLayout>
    );
    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Sign in to Career Profile" })).toBeTruthy();
    expect(screen.getByText(AUTH_TAGLINE)).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Connect the parts of your professional story." })).toBeNull();
  });
});

describe("file selection", () => {
  it("passes chosen files to the handler", async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    render(
      <>
        <FileDropzone acceptedFileTypes={["application/pdf"]} onFiles={onFiles} description="PDF or DOCX" aria-label="Resume file" />
        <ChooseFileButton variant="primary" acceptedFileTypes={["application/pdf"]} onFiles={onFiles} />
      </>
    );
    expect(screen.getByText("PDF or DOCX")).toBeTruthy();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, new File(["%PDF"], "maya.pdf", { type: "application/pdf" }));
    expect(onFiles.mock.lastCall?.[0][0].name).toBe("maya.pdf");
    expect(screen.getByRole("button", { name: "Choose file" })).toBeTruthy();
  });
});

describe("Resume document", () => {
  it("uses a clear heading hierarchy inside the preview", () => {
    render(
      <ResumePreview description="Generated from the current profile." backHref="/profile">
        <ResumePaper>
          <ResumeHeader name="Maya Chen" role="Senior Product Engineer" contact="Vancouver, BC" />
          <ResumeSection title="Experience">
            <ResumeItem title="Senior Product Engineer · Shopify" subtitle="Full-time" date="Mar 2024 – Present" bullets={["Built product workflows."]} />
          </ResumeSection>
          <ResumeSection title="Skills">
            <ResumeSkills groups={[{ label: "Technical", skills: "TypeScript, React" }]} />
          </ResumeSection>
        </ResumePaper>
      </ResumePreview>
    );
    expect(screen.getByRole("heading", { level: 1, name: "Resume preview" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Maya Chen" })).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual(["Experience", "Skills"]);
    expect(screen.getByRole("link", { name: "Back to Profile" })).toBeTruthy();
    expect(screen.getByText("Built product workflows.")).toBeTruthy();
  });
});
