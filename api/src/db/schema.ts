import { sql } from "drizzle-orm";
import { boolean, check, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["USER", "ADMIN"]);
export const passwordSetupGrantPurpose = pgEnum("password_setup_grant_purpose", ["FIRST_PASSWORD", "RESET"]);

const timestamps = {
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    normalizedEmail: text("normalized_email").notNull(),
    passwordHash: text("password_hash"),
    role: userRole("role").default("USER").notNull(),
    passwordSetupRequired: boolean("password_setup_required").default(false).notNull(),
    onboardingCompletedAt: timestamp("onboarding_completed_at", { mode: "date", withTimezone: true }),
    credentialGeneration: integer("credential_generation").default(0).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_normalized_email_key").on(table.normalizedEmail),
    index("users_created_at_id_idx").on(table.createdAt, table.id),
    check("users_password_setup_shape", sql`(${table.passwordSetupRequired} AND ${table.passwordHash} IS NULL) OR (NOT ${table.passwordSetupRequired} AND ${table.passwordHash} IS NOT NULL)`),
  ]
);

export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    csrfTokenHash: text("csrf_token_hash").notNull(),
    credentialGeneration: integer("credential_generation").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
    lastSeenAt: timestamp("last_seen_at", { mode: "date", withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { mode: "date", withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("sessions_token_hash_key").on(table.tokenHash),
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ]
);

export const passwordSetupGrants = pgTable(
  "password_setup_grants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    purpose: passwordSetupGrantPurpose("purpose").notNull(),
    credentialGeneration: integer("credential_generation").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { mode: "date", withTimezone: true }),
    revokedAt: timestamp("revoked_at", { mode: "date", withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("password_setup_grants_token_hash_key").on(table.tokenHash),
    index("password_setup_grants_user_id_idx").on(table.userId),
    index("password_setup_grants_expires_at_idx").on(table.expiresAt),
  ]
);

// Keyed, short-lived counters ensure credentials and setup proofs are never stored in throttle state.
export const authAttemptWindows = pgTable("auth_attempt_windows", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").default(0).notNull(),
  expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});
