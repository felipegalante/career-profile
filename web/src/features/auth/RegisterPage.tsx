import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { AuthHeader, AuthLayout, Button, FormErrorSummary, PasswordField, Stack, Text, TextField, TextLink } from "@career-profile/ui";
import { RegisterDocument } from "../../generated/graphql";
import { ApiError, graphql } from "../../lib/graphql";
import { AuthIllustration } from "./AuthIllustration";
import { destination, PASSWORD_POLICY_HINT, type AuthState } from "./session";

export function RegisterPage({ auth }: { auth: AuthState }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    if (password !== confirm) {
      setErrors({ confirm: "Passwords do not match." });
      return;
    }
    setPending(true);
    setFormError(null);
    try {
      const data = await graphql(RegisterDocument, { input: { email, password } });
      auth.setViewer(data.register.viewer);
      navigate(destination(data.register.viewer), { replace: true });
    } catch (error) {
      const api = error instanceof ApiError ? error : new ApiError("NETWORK", "Could not reach Career Profile. Try again.");
      setErrors(api.fieldErrors);
      setFormError(api.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthLayout art={<AuthIllustration />}>
      <AuthHeader overline="Create account" title="Start your Career Profile" />
      <FormErrorSummary className="mb-4">{formError}</FormErrorSummary>
      <form onSubmit={submit} noValidate>
        <Stack>
          <TextField label="Email" type="email" placeholder="you@example.com" autoComplete="username" value={email} onChange={setEmail} errorMessage={errors.email} />
          <PasswordField label="Password" autoComplete="new-password" value={password} onChange={setPassword} description={PASSWORD_POLICY_HINT} errorMessage={errors.password} />
          <PasswordField label="Verify password" autoComplete="new-password" value={confirm} onChange={setConfirm} errorMessage={errors.confirm} />
          <Button variant="primary" size="lg" type="submit" isPending={pending}>{pending ? "Creating account…" : "Create account"}</Button>
        </Stack>
      </form>
      <Text as="div" variant="meta" tone="muted" className="mt-[18px]">Already have an account? <TextLink href="/login">Sign in</TextLink></Text>
    </AuthLayout>
  );
}
