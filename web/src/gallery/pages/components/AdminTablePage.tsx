import { DocPage } from "../../chrome/DocPage";
import { UsersTableDemo } from "./UsersTableDemo";

export function AdminTablePage() {
  return (
    <DocPage overline="Domain component" title="User table" description="Administrative table pattern with searchable rows, role/status badges, filters, sortable columns, server-style pagination, and loading, no-match and error states.">
      <UsersTableDemo />
    </DocPage>
  );
}
