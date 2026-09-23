import type { Viewer } from "../../lib/graphql";

export interface AuthState {
  viewer: Viewer | null | undefined;
  setViewer(viewer: Viewer | null): void;
}

/** Where a signed-in viewer belongs: onboarding until it is complete, then the Profile. */
export const destination = (viewer: Viewer) => (viewer.onboardingCompleted ? "/profile" : "/onboarding");

export const PASSWORD_POLICY_HINT = "10+ chars, uppercase, lowercase, number, special character.";
