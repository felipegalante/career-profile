export const authTypeDefs = /* GraphQL */ `
  enum UserRole { USER ADMIN }
  type Viewer { id: ID! email: String! role: UserRole! passwordSetupRequired: Boolean! onboardingCompleted: Boolean! }
  type AuthPayload { viewer: Viewer! }
  type LogoutPayload { success: Boolean! }
  input CredentialsInput { email: String! password: String! }
  input SetPasswordInput { proof: String! password: String! }
  type Query { ping: String! viewer: Viewer }
  type Mutation { register(input: CredentialsInput!): AuthPayload! login(input: CredentialsInput!): AuthPayload! logout: LogoutPayload! setPassword(input: SetPasswordInput!): AuthPayload! }
`;
