import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { GalleryApp } from "./GalleryApp";
import { galleryPages } from "./pages";
import { galleryRoutes } from "./routes";

afterEach(() => cleanup());

describe("component gallery", () => {
  it("has exactly one page component for every route", () => {
    expect(Object.keys(galleryPages).sort()).toEqual(galleryRoutes.map((route) => route.path).sort());
  });

  it.each(galleryRoutes)("renders $path", async (route) => {
    render(<MemoryRouter initialEntries={[`/${route.path}`]}><GalleryApp /></MemoryRouter>);
    expect(await screen.findByRole("heading", { level: 1 })).toBeTruthy();
  });

  it("lists every page on the index", () => {
    render(<MemoryRouter><GalleryApp /></MemoryRouter>);
    for (const route of galleryRoutes) expect(screen.getByRole("link", { name: route.title })).toBeTruthy();
  });
});
