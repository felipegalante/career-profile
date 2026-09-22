import { GraphQLError } from "graphql";

export class AuthError extends GraphQLError {
  constructor(code: "DUPLICATE_EMAIL" | "INVALID_CREDENTIALS" | "INVALID_SETUP_GRANT" | "RATE_LIMITED" | "VALIDATION_FAILED", message: string, field?: string) {
    super(message, {
      extensions: {
        code,
        ...(field ? { fieldErrors: [{ path: field, code, message }] } : {}),
      },
    });
  }
}
