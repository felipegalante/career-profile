import { AuthHeader, AuthLayout, Button, PasswordField, Stack, Text, TextField, TextLink } from "@career-profile/ui";
import { DemoShowcase } from "./authShowcase";

export function LoginPage() {
  return (
    <AuthLayout art={<DemoShowcase />}>
      <AuthHeader overline="Welcome back" title="Sign in to Career Profile" lead="Continue building your professional profile." />
      <form onSubmit={(event) => event.preventDefault()} noValidate>
        <Stack>
          <TextField label="Email" type="email" leadingIcon="mail" placeholder="you@example.com" autoComplete="username" data-parity-id="login-email" />
          <PasswordField label="Password" leadingIcon="lock" autoComplete="current-password" />
          <Button variant="primary" size="lg" type="submit">Sign in</Button>
        </Stack>
      </form>
      <Text as="div" variant="meta" tone="muted" className="mt-[18px]">New here? <TextLink href="/compositions/onboarding">Create an account</TextLink></Text>
    </AuthLayout>
  );
}
