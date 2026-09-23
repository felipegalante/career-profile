import { AuthShowcase } from "@career-profile/ui";

export function AuthIllustration() {
  return (
    <AuthShowcase
      overline="Build a profile that stays useful"
      title="Connect the parts of your professional story."
      description="Add structured experience and education, then keep the skills they support organized in one place."
      records={[
        { kind: "Experience", title: "Senior Product Engineer", meta: "Shopify · Full-time" },
        { kind: "Education", title: "Computer Science", meta: "University of British Columbia" },
        { kind: "Certification", title: "AWS Solutions Architect", meta: "Amazon Web Services" },
      ]}
      skills={{ overline: "Your skills profile", title: "Skills connected to your profile", chips: ["TypeScript", "System Design", "AWS", "Communication", "PostgreSQL"], note: "Organize proficiency, add custom skills, and keep profile sources connected." }}
      benefits={["Catalog-backed suggestions with custom values when you need them.", "One Profile workspace for experience, education, certifications, and skills.", "Structured data that is easy to review and keep current."]}
    />
  );
}
