import { AppShell, ButtonLink, Icon, PageHeader } from "@career-profile/ui";
import { UsersTableDemo } from "../components/UsersTableDemo";
import { demoCommands, demoNavigation } from "../shell/shellDemo";

const navigation = [...demoNavigation, { id: "administration", label: "Administration", items: [{ id: "users", label: "Users", icon: "user-plus" as const, href: "/compositions/admin-users" }] }];
const account = { name: "Alex Rivera", subtitle: "Administrator", actions: [{ id: "sign-out", label: "Sign out", icon: "sign-out" as const, tone: "danger" as const, href: "/" }] };

export function AdminUsersPage() {
  return (
    <AppShell navigation={navigation} currentItemId="users" account={account} commands={demoCommands(() => undefined)}>
      <PageHeader title="Users" description="View accounts and create regular or administrator users." actions={<ButtonLink variant="primary" href="/compositions/admin-users"><Icon name="plus" />Create user</ButtonLink>} />
      <UsersTableDemo showStateSwitcher={false} />
    </AppShell>
  );
}
