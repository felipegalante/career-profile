import { AppShell, Badge, ButtonLink, Chip, ChipList, Grid, Icon, PageHeader, ProfileHero, ProfileSection, RecordItem, SkillBoard, type SkillCategoryData } from "@career-profile/ui";
import { demoAccount, demoCommands, demoNavigation } from "../shell/shellDemo";

const names = (labels: string[]) => labels.map((label) => ({ id: label.toLowerCase().replace(/\W+/g, "-"), label }));

const profileSkills: SkillCategoryData[] = [
  { category: "TECHNICAL", lanes: [{ level: "ADVANCED", skills: names(["TypeScript", "System Design"]) }, { level: "INTERMEDIATE", skills: names(["React", "PostgreSQL", "AWS", "GraphQL", "Docker", "Kubernetes", "Node.js", "Terraform", "Redis", "Kafka", "Go", "Python"]) }], total: 15 },
  { category: "FOUNDATIONAL", lanes: [{ level: "ADVANCED", skills: names(["Communication", "Problem Solving"]) }, { level: "INTERMEDIATE", skills: names(["Planning", "Mentoring", "Facilitation", "Negotiation", "Coaching"]) }], total: 7 },
];

export function ProfilePage() {
  return (
    <AppShell navigation={demoNavigation} currentItemId="profile" account={demoAccount} commands={demoCommands(() => undefined)}>
      <PageHeader title="Profile" description="Manage your professional profile from one place." actions={<ButtonLink variant="secondary" href="/compositions/skills-edit"><Icon name="file" />Resume tools</ButtonLink>} />
      <ProfileHero name="Maya Chen" subtitle="Product Engineer · Vancouver, BC" status={<Badge tone="success">82% complete</Badge>} />
      <ProfileSection title="Work experience" description="Roles and employment history" action={<ButtonLink variant="secondary" size="sm" href="/compositions/experience"><Icon name="plus" />Add experience</ButtonLink>} flush data-parity-id="section-embedded">
        <RecordItem title="Senior Product Engineer" subtitle="Shopify · Full-time" meta="Mar 2024 – Current" action={<ButtonLink variant="ghost" size="sm" href="/compositions/experience">Edit</ButtonLink>}>
          <ChipList aria-label="Skills from Senior Product Engineer">{["TypeScript", "System Design", "Collaboration"].map((label) => <Chip as="li" key={label}>{label}</Chip>)}</ChipList>
        </RecordItem>
        <RecordItem title="Software Engineer" subtitle="Northstar Labs · Full-time" meta="Jun 2021 – Feb 2024" action={<ButtonLink variant="ghost" size="sm" href="/compositions/experience">Edit</ButtonLink>} />
      </ProfileSection>
      <ProfileSection title="Skills" description="Technical and foundational skills by proficiency" action={<ButtonLink variant="secondary" size="sm" href="/compositions/skills-edit">Edit skills</ButtonLink>}>
        <SkillBoard categories={profileSkills} />
      </ProfileSection>
      <Grid columns={2} className="mt-4">
        <ProfileSection variant="embedded" className="mt-0" title="Education" description="Academic background" action={<ButtonLink variant="secondary" size="sm" href="/components/profile-record-dialog"><Icon name="plus" />Add</ButtonLink>}>
          <RecordItem compact title="Master of Science · Computer Science" subtitle="University of British Columbia" meta="2024 – 2026" />
        </ProfileSection>
        <ProfileSection variant="embedded" className="mt-0" title="Certifications" description="Professional certifications and exams" action={<ButtonLink variant="secondary" size="sm" href="/components/profile-record-dialog"><Icon name="plus" />Add</ButtonLink>}>
          <RecordItem compact title="AWS Certified Cloud Practitioner" subtitle="Amazon Web Services" meta="Active" />
        </ProfileSection>
      </Grid>
      <ProfileSection title="Professional Focus" description="Areas you want your profile to emphasize" action={<ButtonLink variant="secondary" size="sm" href="/compositions/focus">Manage</ButtonLink>}>
        <ChipList aria-label="Professional focus areas">
          <Chip as="li">Software &amp; Technology · Primary</Chip>
          <Chip as="li" tone="neutral">Product &amp; Strategy</Chip>
          <Chip as="li" tone="neutral">Data &amp; Analytics</Chip>
        </ChipList>
      </ProfileSection>
    </AppShell>
  );
}
