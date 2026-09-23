import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { DataTable, FilterSelect, Pagination, PersonCell, SortableHeader, TableSearchField, paginationRange, type SortDirection } from "./DataTable";

describe("paginationRange", () => {
  it("shows every page when there are few", () => {
    expect(paginationRange(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });
  it("keeps first, last and neighbours with gaps", () => {
    expect(paginationRange(1, 6)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(paginationRange(1, 12)).toEqual([1, 2, 3, "gap-end", 12]);
    expect(paginationRange(6, 12)).toEqual([1, "gap-start", 5, 6, 7, "gap-end", 12]);
    expect(paginationRange(12, 12)).toEqual([1, "gap-start", 10, 11, 12]);
  });
});

describe("table parts", () => {
  it("exposes sort state on the header and toggles direction", async () => {
    const user = userEvent.setup();
    function Header() {
      const [direction, setDirection] = useState<SortDirection | undefined>();
      return (
        <DataTable caption="Users">
          <thead><tr><SortableHeader label="Created" direction={direction} onSort={setDirection} /></tr></thead>
          <tbody><tr><td><PersonCell name="Maya Chen" detail="maya@careerprofile.test" /></td></tr></tbody>
        </DataTable>
      );
    }
    render(<Header />);
    const header = screen.getByRole("columnheader", { name: "Created" });
    expect(header.getAttribute("aria-sort")).toBe("none");
    await user.click(screen.getByRole("button", { name: "Created" }));
    expect(header.getAttribute("aria-sort")).toBe("ascending");
    await user.click(screen.getByRole("button", { name: "Created" }));
    expect(header.getAttribute("aria-sort")).toBe("descending");
    expect(screen.getByRole("table", { name: "Users" })).toBeTruthy();
  });

  it("reports filter changes and search text", async () => {
    const user = userEvent.setup();
    const onFilter = vi.fn();
    const onSearch = vi.fn();
    render(
      <>
        <TableSearchField label="Search users" value="" onChange={onSearch} placeholder="Search users…" />
        <FilterSelect label="Role" items={[{ id: "all", label: "All" }, { id: "ADMIN", label: "Admin" }]} value="all" onChange={onFilter} />
      </>
    );
    await user.type(screen.getByRole("searchbox", { name: "Search users" }), "m");
    expect(onSearch).toHaveBeenCalledWith("m");
    await user.click(screen.getByRole("button", { name: "Role: All" }));
    await user.click(screen.getByRole("menuitemradio", { name: "Admin" }));
    expect(onFilter).toHaveBeenCalledWith("ADMIN");
  });
});

describe("Pagination", () => {
  it("summarizes the range and moves between pages", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();
    render(<Pagination page={1} pageSize={25} total={128} itemLabel="users" onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />);
    expect(screen.getByText("Showing 1–25 of 128 users")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
    await user.click(screen.getByRole("button", { name: "Page 2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    await user.click(screen.getByRole("button", { name: "Rows per page: 25" }));
    await user.click(screen.getByRole("menuitemradio", { name: "50" }));
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });
});
