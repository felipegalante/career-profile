import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { CatalogCombobox, type CatalogSearch, type CatalogSearchResult, type CatalogSelection } from "./CatalogCombobox";
import { Dialog } from "../../primitives/Dialog/Dialog";

const companies: CatalogSearchResult = {
  hasExactMatch: false,
  options: [
    { id: "shopify", label: "Shopify", meta: "Catalog" },
    { id: "shopify-plus", label: "Shopify Plus", meta: "Catalog" },
    { id: "typescript", label: "Shoppers Drug Mart", meta: "Already added", isDisabled: true },
  ],
};

function Harness({ search, onCreateCustom, parentContext, initial = null, onChange }: { search: CatalogSearch<string | undefined>; onCreateCustom?: (query: string) => void; parentContext?: string; initial?: CatalogSelection | null; onChange?: (value: CatalogSelection | null) => void }) {
  const [value, setValue] = useState<CatalogSelection | null>(initial);
  return (
    <>
      <CatalogCombobox
        label="Company"
        customNoun="company"
        placeholder="Search companies…"
        value={value}
        onChange={(next) => {
          setValue(next);
          onChange?.(next);
        }}
        search={search}
        parentContext={parentContext}
        onCreateCustom={onCreateCustom}
        debounceMs={10}
      />
      <button type="button">Elsewhere</button>
    </>
  );
}

const input = () => screen.getByRole("combobox", { name: "Company" });

describe("CatalogCombobox", () => {
  it("searches once after rapid typing", async () => {
    // Fake timers make the debounce window deterministic; on a loaded CI runner, real
    // per-keystroke delays from userEvent can exceed the 10ms debounce and trigger a
    // search per keystroke, so keystrokes are dispatched directly instead (userEvent
    // itself does not run under fake timers, see the Toast tests for the same reason).
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      const search = vi.fn<CatalogSearch<string | undefined>>(async () => companies);
      render(<Harness search={search} />);
      const field = input();
      for (const value of ["s", "sh", "sho", "shop"]) {
        fireEvent.change(field, { target: { value } });
      }
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10);
      });
      expect(search).toHaveBeenCalledTimes(1);
      expect(search.mock.calls[0][0]).toBe("shop");
      screen.getByRole("option", { name: "Shopify" });
    } finally {
      vi.useRealTimers();
    }
  });

  it("aborts and ignores stale responses", async () => {
    const user = userEvent.setup();
    const pending: Array<{ resolve: (result: CatalogSearchResult) => void; signal: AbortSignal }> = [];
    const search = vi.fn<CatalogSearch<string | undefined>>((_query, { signal }) => new Promise((resolve) => pending.push({ resolve, signal })));
    render(<Harness search={search} />);
    await user.type(input(), "s");
    await waitFor(() => expect(search).toHaveBeenCalledTimes(1));
    await user.type(input(), "h");
    await waitFor(() => expect(search).toHaveBeenCalledTimes(2));
    expect(pending[0].signal.aborted).toBe(true);
    pending[1].resolve(companies);
    pending[0].resolve({ hasExactMatch: false, options: [{ id: "stale", label: "Stale result" }] });
    await screen.findByRole("option", { name: "Shopify" });
    expect(screen.queryByRole("option", { name: "Stale result" })).toBeNull();
  });

  it("offers custom creation first, reports catalog selections and keeps visible disabled options", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness search={async () => companies} onChange={onChange} onCreateCustom={() => undefined} />);
    await user.type(input(), "shop");
    const options = await screen.findAllByRole("option");
    expect(options[0].textContent).toContain("Create custom company “shop”");
    expect(options[0].textContent).toContain("Only visible to you");
    expect(screen.getByRole("option", { name: "Shoppers Drug Mart" }).getAttribute("aria-disabled")).toBe("true");
    expect(screen.getByRole("option", { name: "Shopify" }).querySelector("b")?.textContent).toBe("Shop");
    await user.click(screen.getByRole("option", { name: "Shopify" }));
    expect(onChange).toHaveBeenLastCalledWith({ kind: "catalog", id: "shopify", label: "Shopify" });
    expect((input() as HTMLInputElement).value).toBe("Shopify");
  });

  it("selects with the keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness search={async () => companies} onChange={onChange} />);
    await user.type(input(), "shop");
    await screen.findByRole("option", { name: "Shopify" });
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith({ kind: "catalog", id: "shopify", label: "Shopify" });
  });

  it("does not offer custom creation when a value matches exactly", async () => {
    const user = userEvent.setup();
    render(<Harness search={async () => ({ ...companies, hasExactMatch: true })} onCreateCustom={() => undefined} />);
    await user.type(input(), "shopify");
    await screen.findByRole("option", { name: "Shopify" });
    expect(screen.queryByRole("option", { name: /Create custom/ })).toBeNull();
  });

  it("hands the typed query to the create action", async () => {
    const user = userEvent.setup();
    const onCreateCustom = vi.fn();
    render(<Harness search={async () => ({ hasExactMatch: false, options: [] })} onCreateCustom={onCreateCustom} />);
    await user.type(input(), "Shopify Labs");
    const create = await screen.findByRole("option", { name: "Create custom company “Shopify Labs”" });
    expect(within(screen.getByRole("listbox")).getByText("No catalog matches")).toBeTruthy();
    await user.click(create);
    expect(onCreateCustom).toHaveBeenCalledWith("Shopify Labs");
  });

  it("distinguishes no results from failures and retries", async () => {
    const user = userEvent.setup();
    const search = vi.fn<CatalogSearch<string | undefined>>().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(companies);
    render(<Harness search={search} />);
    await user.type(input(), "shop");
    const listbox = await screen.findByRole("listbox");
    expect(await within(listbox).findByText("Search failed.")).toBeTruthy();
    expect(within(listbox).queryByText("No catalog matches")).toBeNull();
    await user.click(screen.getByRole("option", { name: "Retry search" }));
    expect(await screen.findByRole("option", { name: "Shopify" })).toBeTruthy();
    expect(search).toHaveBeenCalledTimes(2);
  });

  it("shows plain no-results copy when custom values are not allowed", async () => {
    const user = userEvent.setup();
    render(<Harness search={async () => ({ hasExactMatch: false, options: [] })} />);
    await user.type(input(), "zzz");
    const listbox = await screen.findByRole("listbox");
    expect(await within(listbox).findByText("No catalog matches")).toBeTruthy();
    expect(within(listbox).queryByRole("option", { name: /Create custom/ })).toBeNull();
  });

  it("restores the selected label when the field loses focus with unfinished text", async () => {
    const user = userEvent.setup();
    render(<Harness search={async () => companies} initial={{ kind: "catalog", id: "shopify", label: "Shopify" }} />);
    await user.clear(input());
    await user.type(input(), "Hoot");
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));
    expect((input() as HTMLInputElement).value).toBe("Shopify");
  });

  it("clears the selection when the text is emptied", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness search={async () => companies} initial={{ kind: "custom", label: "North Shore Design Institute" }} onChange={onChange} />);
    expect((input() as HTMLInputElement).value).toBe("North Shore Design Institute");
    await user.clear(input());
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("passes the parent context to the search", async () => {
    const user = userEvent.setup();
    const search = vi.fn<CatalogSearch<string | undefined>>(async () => companies);
    render(<Harness search={search} parentContext="shopify" />);
    await user.type(input(), "eng");
    await screen.findByRole("option", { name: "Shopify" });
    expect(search.mock.calls[0][1].parentContext).toBe("shopify");
  });

  it("closes its popover on the first Escape inside a dialog and the dialog on the next", async () => {
    const user = userEvent.setup();
    render(
      <Dialog title="Add work experience" isOpen onOpenChange={() => undefined}>
        <Harness search={async () => companies} />
      </Dialog>
    );
    await user.type(input(), "shop");
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(screen.getByRole("dialog", { name: "Add work experience" })).toBeTruthy();
  });
});
