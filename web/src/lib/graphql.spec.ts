import { beforeEach, describe, expect, it, vi } from "vitest";
import { LogoutDocument, ViewerDocument } from "../generated/graphql";

describe("GraphQL transport", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    document.cookie = "career_profile_session_csrf=csrf-proof; Path=/";
  });

  it("uses the CSRF cookie name supplied by the API runtime", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { viewer: null } }), { headers: { "x-csrf-cookie-name": "career_profile_session_csrf" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { logout: { success: true } } })));
    vi.stubGlobal("fetch", fetchMock);
    const { graphql } = await import("./graphql");

    await graphql(ViewerDocument);
    await graphql(LogoutDocument);

    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      headers: expect.objectContaining({ "x-csrf-token": "csrf-proof" }),
    });
  });
});
