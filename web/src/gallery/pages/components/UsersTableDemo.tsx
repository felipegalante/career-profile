import { useMemo, useState } from "react";
import { Badge, Button, DataTable, EmptyState, FilterSelect, LoadingSkeleton, MenuItem, Pagination, PersonCell, RecordActionsMenu, SortableHeader, Surface, TableScrollRegion, TableSearchField, TableStateRow, TableToolbar, VisuallyHidden, type Key, type SortDirection } from "@career-profile/ui";

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  onboarding: "COMPLETE" | "INCOMPLETE";
  createdAt: Date;
}

const first = ["Alex", "Maya", "Jordan", "Sam", "Taylor", "Riley", "Casey", "Morgan", "Jamie", "Avery", "Quinn", "Drew", "Robin", "Skyler", "Emerson", "Hayden"];
const last = ["Rivera", "Chen", "Davis", "Patel", "Morgan", "Nguyen", "Okafor", "Kowalski", "Haddad", "Silva", "Tanaka", "Byrne"];

export const demoUsers: DemoUser[] = Array.from({ length: 128 }, (_, index) => {
  const name = `${first[index % first.length]} ${last[(index * 7) % last.length]}`;
  return {
    id: `user-${index}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}${index}@careerprofile.test`,
    role: index % 9 === 0 ? "ADMIN" : "USER",
    onboarding: index % 3 === 2 ? "INCOMPLETE" : "COMPLETE",
    createdAt: new Date(Date.UTC(2026, 8, 20) - index * 86_400_000 * 0.9),
  };
});

type SortKey = "name" | "role" | "onboarding" | "createdAt";
type DemoState = "populated" | "loading" | "error";

const roleFilters = [{ id: "all", label: "All" }, { id: "ADMIN", label: "Admin" }, { id: "USER", label: "User" }];
const onboardingFilters = [{ id: "all", label: "All" }, { id: "COMPLETE", label: "Complete" }, { id: "INCOMPLETE", label: "Incomplete" }];
const sortOptions = [{ id: "newest", label: "Newest" }, { id: "oldest", label: "Oldest" }, { id: "name", label: "Name" }];
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function UsersTableDemo({ showStateSwitcher = true }: { showStateSwitcher?: boolean }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Key>("all");
  const [onboarding, setOnboarding] = useState<Key>("all");
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: "createdAt", direction: "descending" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [state, setState] = useState<DemoState>("populated");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = demoUsers.filter((user) => (role === "all" || user.role === role) && (onboarding === "all" || user.onboarding === onboarding) && (!needle || user.name.toLowerCase().includes(needle) || user.email.includes(needle)));
    const factor = sort.direction === "ascending" ? 1 : -1;
    return [...filtered].sort((a, b) => factor * (sort.key === "createdAt" ? a.createdAt.getTime() - b.createdAt.getTime() : String(a[sort.key]).localeCompare(String(b[sort.key]))));
  }, [query, role, onboarding, sort]);

  const visible = rows.slice((page - 1) * pageSize, page * pageSize);
  const resetPage = <T,>(set: (value: T) => void) => (value: T) => { set(value); setPage(1); };
  const header = (key: SortKey, label: string) => <SortableHeader label={label} direction={sort.key === key ? sort.direction : undefined} onSort={(direction) => { setSort({ key, direction }); setPage(1); }} />;
  const sortValue = sort.key === "name" ? "name" : sort.key === "createdAt" && sort.direction === "ascending" ? "oldest" : "newest";

  let body;
  if (state === "loading") body = <TableStateRow colSpan={5}><div className="p-5"><LoadingSkeleton label="Loading users" /></div></TableStateRow>;
  else if (state === "error") body = <TableStateRow colSpan={5}><EmptyState icon="close" tone="danger" title="Couldn’t load users" description="Your saved data is unchanged. Try again." action={<Button onPress={() => setState("populated")}>Retry</Button>} /></TableStateRow>;
  else if (visible.length === 0) body = <TableStateRow colSpan={5}><EmptyState icon="search" title="No matching users" description="Try another search or clear the filters." action={<Button onPress={() => { setQuery(""); setRole("all"); setOnboarding("all"); }}>Clear filters</Button>} /></TableStateRow>;
  else
    body = visible.map((user) => (
      <tr key={user.id}>
        <td><PersonCell name={user.name} detail={user.email} /></td>
        <td><Badge tone={user.role === "ADMIN" ? "brand" : "neutral"}>{user.role === "ADMIN" ? "Admin" : "User"}</Badge></td>
        <td><Badge tone={user.onboarding === "COMPLETE" ? "success" : "warning"}>{user.onboarding === "COMPLETE" ? "Complete" : "Incomplete"}</Badge></td>
        <td className="text-xs">{dateFormat.format(user.createdAt)}</td>
        <td>
          <RecordActionsMenu recordLabel={user.name}>
            <MenuItem id="reset" icon="lock">Reset password</MenuItem>
          </RecordActionsMenu>
        </td>
      </tr>
    ));

  return (
    <>
      {showStateSwitcher ? (
        <div className="mb-3">
          <FilterSelect label="Gallery state" items={[{ id: "populated", label: "Populated" }, { id: "loading", label: "Loading" }, { id: "error", label: "Error" }]} value={state} onChange={(value) => setState(value as DemoState)} />
        </div>
      ) : null}
      <Surface data-parity-id="users-table">
        <TableToolbar
          search={<TableSearchField label="Search users" value={query} onChange={resetPage(setQuery)} placeholder="Search users…" />}
          filters={
            <>
              <FilterSelect label="Role" items={roleFilters} value={role} onChange={resetPage(setRole)} />
              <FilterSelect label="Onboarding" items={onboardingFilters} value={onboarding} onChange={resetPage(setOnboarding)} />
              <FilterSelect label="Sort" items={sortOptions} value={sortValue} onChange={(value) => { setSort(value === "name" ? { key: "name", direction: "ascending" } : { key: "createdAt", direction: value === "oldest" ? "ascending" : "descending" }); setPage(1); }} />
            </>
          }
        />
        <TableScrollRegion label="Users table">
          <DataTable caption="Users" aria-busy={state === "loading"}>
            <thead>
              <tr>
                {header("name", "User")}
                {header("role", "Role")}
                {header("onboarding", "Onboarding")}
                {header("createdAt", "Created")}
                <th><VisuallyHidden>Actions</VisuallyHidden></th>
              </tr>
            </thead>
            <tbody>{body}</tbody>
          </DataTable>
        </TableScrollRegion>
        <Pagination page={page} pageSize={pageSize} total={state === "populated" ? rows.length : 0} itemLabel="users" onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </Surface>
    </>
  );
}
