import { AppShell, Badge, Button, PageHeader, ProfileHero, ProfilePlaceholder, Surface } from "@career-profile/ui";
import { demoCommands, demoNavigation } from "../shell/shellDemo";

const account = { name: "Taylor Morgan", subtitle: "Toronto, ON", actions: [{ id: "sign-out", label: "Sign out", icon: "sign-out" as const, tone: "danger" as const, href: "/" }] };

export function ProfileEmptyPage() {
  return (
    <AppShell navigation={demoNavigation} currentItemId="profile" account={account} commands={demoCommands(() => undefined)}>
      <PageHeader title="Profile" description="Manage your professional profile from one place." actions={<Button variant="secondary">Resume tools</Button>} />
      <ProfileHero name="Taylor Morgan" subtitle="Your profile is ready to build." status={<Badge tone="warning">Incomplete</Badge>} data-parity-id="hero" />
      <Surface className="mt-4" data-parity-id="placeholders">
        <ProfilePlaceholder icon="briefcase" title="Work experience" description="Add your roles, companies, dates, and employment history." action={<Button>Add experience</Button>} />
        <ProfilePlaceholder icon="bar-chart" title="Skills" description="Add technical and foundational skills and set your proficiency." action={<Button>Add skills</Button>} />
        <ProfilePlaceholder icon="graduation-cap" title="Education" description="Add institutions, majors / specializations, degrees, and study dates." action={<Button>Add education</Button>} />
        <ProfilePlaceholder icon="award" title="Certifications" description="Add certification boards, exams, IDs, and validity dates." action={<Button>Add certification</Button>} />
        <ProfilePlaceholder icon="target" title="Professional Focus" description="Choose the areas you want your profile to emphasize." action={<Button>Choose focus</Button>} />
      </Surface>
    </AppShell>
  );
}
