import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { AuthHeader, AuthLayout, Button, FormErrorSummary, PasswordField, Stack, Text, TextField, TextLink } from "@career-profile/ui";
import { LoginDocument } from "../../generated/graphql";
import { ApiError, graphql } from "../../lib/graphql";
import { AuthIllustration } from "./AuthIllustration";
import { destination, type AuthState } from "./session";

export function LoginPage({ auth }: { auth: AuthState }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setFormError(null);
    try {
      const data = await graphql(LoginDocument, { input: { email, password } });
      auth.setViewer(data.login.viewer);
      navigate(destination(data.login.viewer), { replace: true });
    } catch (error) {
      setFormError((error as ApiError).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthLayout art={<AuthIllustration />}>
      <AuthHeader overline="Welcome back" title="Sign in to Career Profile" lead="Continue building your professional profile." />
      <FormErrorSummary className="mb-4">{formError}</FormErrorSummary>
      <form onSubmit={submit}>
        <Stack>
          <TextField label="Email" type="email" leadingIcon="mail" placeholder="you@example.com" autoComplete="username" value={email} onChange={setEmail} />
          <PasswordField label="Password" leadingIcon="lock" autoComplete="current-password" value={password} onChange={setPassword} />
          <Button variant="primary" size="lg" type="submit" isPending={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
        </Stack>
      </form>
      <Text as="div" variant="meta" tone="muted" className="mt-[18px]">New here? <TextLink href="/register">Create an account</TextLink></Text>
    </AuthLayout>
  );
}
