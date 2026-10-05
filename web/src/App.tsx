import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Button } from "@career-profile/ui";
import { UiRoot } from "./app/UiRoot";
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";
import { SetPasswordPage } from "./features/auth/SetPasswordPage";
import { destination, type AuthState } from "./features/auth/session";
import { LogoutDocument, ViewerDocument } from "./generated/graphql";
import { graphql, type Viewer } from "./lib/graphql";

const centered = "grid min-h-screen place-content-center justify-items-center gap-3 p-6 text-center";

function Destination({ auth, required }: { auth: AuthState; required: "complete" | "incomplete" }) {
  if (!auth.viewer) return <Navigate to="/login" replace />;
  if ((required === "complete") !== auth.viewer.onboardingCompleted) return <Navigate to={destination(auth.viewer)} replace />;
  return (
    <main className={centered}>
      <h1>{required === "complete" ? "Profile" : "Onboarding"}</h1>
      <p>This protected destination will be completed in Phase 02.</p>
      <Button variant="primary" onPress={async () => { await graphql(LogoutDocument); auth.setViewer(null); }}>Sign out</Button>
    </main>
  );
}

function RouterApp() {
  const [viewer, setViewer] = useState<Viewer | null | undefined>(undefined);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [viewerRequest, setViewerRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setViewer(undefined);
    setViewerError(null);
    void graphql(ViewerDocument, undefined, controller.signal)
      .then((data) => setViewer(data.viewer))
      .catch(() => {
        if (!controller.signal.aborted) setViewerError("Could not restore your session. Try again.");
      });
    return () => controller.abort();
  }, [viewerRequest]);

  const auth: AuthState = { viewer, setViewer };
  if (viewerError) {
    return (
      <main className={centered} role="alert">
        <h1>Could not restore your session</h1>
        <p>{viewerError}</p>
        <Button variant="primary" onPress={() => setViewerRequest((request) => request + 1)}>Try again</Button>
      </main>
    );
  }
  if (viewer === undefined) return <main className={centered} aria-live="polite">Loading Career Profile…</main>;

  const redirect = viewer ? destination(viewer) : undefined;
  return (
    <Routes>
      <Route path="/login" element={redirect ? <Navigate to={redirect} replace /> : <LoginPage auth={auth} />} />
      <Route path="/register" element={redirect ? <Navigate to={redirect} replace /> : <RegisterPage auth={auth} />} />
      <Route path="/set-password" element={<SetPasswordPage auth={auth} />} />
      <Route path="/profile" element={<Destination auth={auth} required="complete" />} />
      <Route path="/onboarding" element={<Destination auth={auth} required="incomplete" />} />
      <Route path="*" element={<Navigate to={redirect ?? "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UiRoot>
        <RouterApp />
      </UiRoot>
    </BrowserRouter>
  );
}
