import { AppShell, Button, ResumeHeader, ResumeItem, ResumePaper, ResumePreview, ResumeSection, ResumeSkills, ResumeSummary } from "@career-profile/ui";
import { demoAccount, demoCommands, demoNavigation } from "../shell/shellDemo";

export function ResumeGeneratedPage() {
  return (
    <AppShell navigation={demoNavigation} currentItemId="profile" account={demoAccount} commands={demoCommands(() => undefined)}>
      <ResumePreview backHref="/compositions/profile" description="Generated from the current profile. Review the document before downloading." actions={<><Button variant="secondary">Regenerate</Button><Button variant="primary">Download PDF</Button></>} note="This preview is optimized for a clean, ATS-friendly single-column resume. Generated copy should remain grounded in saved profile data.">
        <ResumePaper>
          <ResumeHeader name="Maya Chen" role="Senior Product Engineer" contact={<>Vancouver, BC<br />maya@careerprofile.test · (604) 555-0142<br />linkedin.com/in/mayachen</>} />
          <ResumeSection title="Professional Summary">
            <ResumeSummary>Product-focused software engineer with experience building web platforms, APIs, and cloud systems. Strong background in TypeScript, system design, PostgreSQL, and cross-functional product delivery.</ResumeSummary>
          </ResumeSection>
          <ResumeSection title="Experience">
            <ResumeItem title="Senior Product Engineer · Shopify" subtitle="Full-time · Vancouver, BC" date="Mar 2024 – Present" bullets={["Built and evolved customer-facing product workflows across React, TypeScript, and backend services.", "Partnered with product and design to translate ambiguous requirements into maintainable system changes.", "Improved platform reliability through stronger observability, testing, and database design practices."]} />
            <ResumeItem title="Software Engineer · Northstar Labs" subtitle="Full-time · Vancouver, BC" date="Jun 2021 – Feb 2024" bullets={["Delivered full-stack features backed by PostgreSQL and cloud infrastructure.", "Contributed to API design, automated testing, and internal developer tooling."]} />
          </ResumeSection>
          <ResumeSection title="Skills">
            <ResumeSkills groups={[{ label: "Technical", skills: "TypeScript, React, Node.js, PostgreSQL, AWS, System Design, GraphQL, Docker" }, { label: "Foundational", skills: "Communication, Problem Solving, Collaboration, Planning, Mentoring" }]} />
          </ResumeSection>
          <ResumeSection title="Education">
            <ResumeItem title="Master of Science · Computer Science" subtitle="University of British Columbia" date="2024 – 2026" />
          </ResumeSection>
          <ResumeSection title="Certifications">
            <ResumeItem title="AWS Certified Solutions Architect" subtitle="Amazon Web Services" date="Active" />
          </ResumeSection>
        </ResumePaper>
      </ResumePreview>
    </AppShell>
  );
}
