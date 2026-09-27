import { AppShell, Button, Chip, ChipList, Icon, MenuItem, PageHeader, ProfileSection, RecordActionsMenu, RecordItem } from "@career-profile/ui";
import { demoAccount, demoCommands, demoNavigation } from "../shell/shellDemo";

const roles = [
  { title: "Senior Product Engineer", subtitle: "Shopify · Full-time", meta: "Mar 2024 – Current · Vancouver, BC", skills: ["TypeScript", "System Design", "Mentoring"], more: 4 },
  { title: "Software Engineer", subtitle: "Hootsuite · Full-time", meta: "Jun 2021 – Feb 2024 · Vancouver, BC", skills: ["React", "PostgreSQL", "Collaboration"], more: 0 },
];

export function ExperiencePage() {
  return (
    <AppShell navigation={demoNavigation} currentItemId="profile" account={demoAccount} commands={demoCommands(() => undefined)}>
      <PageHeader title="Work experience" description="Maintain roles, companies, dates, and skills connected to your work history." backLink={{ href: "/compositions/profile-empty" }} actions={<Button variant="primary"><Icon name="plus" />Add experience</Button>} />
      <ProfileSection variant="page" title="Work experience" description="Roles are ordered by most recent start date." data-parity-id="section-page">
        {roles.map((role) => (
          <RecordItem key={role.title} title={role.title} subtitle={role.subtitle} meta={role.meta} action={<RecordActionsMenu recordLabel={role.title}><MenuItem id="edit" icon="pencil">Edit</MenuItem><MenuItem id="remove" icon="close" tone="danger">Remove</MenuItem></RecordActionsMenu>}>
            <ChipList aria-label={`Skills from ${role.title}`}>
              {role.skills.map((skill) => <Chip as="li" key={skill}>{skill}</Chip>)}
              {role.more ? <Chip as="li" tone="neutral">+{role.more} more</Chip> : null}
            </ChipList>
          </RecordItem>
        ))}
      </ProfileSection>
    </AppShell>
  );
}
