import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { AuthHeader, AuthLayout, Button, Callout, PasswordField, Stack } from "@career-profile/ui";
import { SetPasswordDocument } from "../../generated/graphql";
import { graphql, type ApiError } from "../../lib/graphql";
import { AuthIllustration } from "./AuthIllustration";
import { destination, PASSWORD_POLICY_HINT, type AuthState } from "./session";

const UNAVAILABLE = "This setup link is invalid, expired, or already used.";

export function SetPasswordPage({ auth }: { auth: AuthState }) {
  const navigate = useNavigate();
  const [proof] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get("proof") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [invalidGrant, setInvalidGrant] = useState(!proof);
  const [error, setError] = useState<string | null>(proof ? null : UNAVAILABLE);
  const [pending, setPending] = useState(false);

  // The one-time proof must not stay in the address bar or browser history.
  useEffect(() => {
    if (window.location.hash) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const data = await graphql(SetPasswordDocument, { input: { proof, password } });
      auth.setViewer(data.setPassword.viewer);
      navigate(destination(data.setPassword.viewer), { replace: true });
    } catch (exception) {
      const api = exception as ApiError;
      setError(api.message);
      setInvalidGrant(api.code === "INVALID_SETUP_GRANT");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthLayout art={<AuthIllustration />} footer={null}>
      <AuthHeader
        overline={invalidGrant ? "Password setup unavailable" : "Account setup"}
        title={invalidGrant ? "This setup link is unavailable" : "Set your password"}
        lead={invalidGrant ? "This password setup link may be invalid, expired, or already used. Ask your administrator for a new link." : "Your account is ready. Create a strong password before continuing to your profile setup."}
      />
      {error ? <Callout tone="danger" role="alert" className="mb-4">{error}</Callout> : null}
      {proof && !invalidGrant ? (
        <form onSubmit={submit}>
          <Stack>
            <PasswordField label="Password" autoComplete="new-password" value={password} onChange={setPassword} description={PASSWORD_POLICY_HINT} />
            <PasswordField label="Verify password" autoComplete="new-password" value={confirm} onChange={setConfirm} />
            <Button variant="primary" size="lg" type="submit" isPending={pending}>{pending ? "Saving password…" : "Set password & continue"}</Button>
          </Stack>
        </form>
      ) : null}
    </AuthLayout>
  );
}
