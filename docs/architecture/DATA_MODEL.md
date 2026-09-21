# Data Model

This document defines the planned relational shape. Drizzle schema files will be the executable schema once implementation begins.

## Database runtime conventions

Database commands are owned by the API workspace. Drizzle Kit's journal is the sole migration history; the former `schema_migrations` no-op marker is retired only when it contains exactly `001_init.sql`.

Application services start transactions at the workflow boundary and pass the resulting Drizzle transaction handle through repositories that participate in the same write. Domain migrations remain forward-only. PostgreSQL 16 is required; later catalog-search migrations may require a deployment role permitted to install `pg_trgm`, but Phase 00 installs no extensions or domain tables.

## Accounts

### users

- `id uuid primary key`
- `email text not null`
- `normalized_email text not null unique`
- `password_hash text null` — null only while an admin-created/reset account requires password setup
- `role USER|ADMIN not null`
- `onboarding_completed_at timestamptz null`
- `password_setup_required boolean not null default false`
- timestamps

### sessions

Opaque server-managed sessions with user reference, token hash/identifier, expiry, timestamps.

### user_profiles

Personal/career profile fields: first/last name, phone, DOB, location, postal code, country, preferred language, LinkedIn URL, employment status, career goal, timestamps.

## Shared catalog conventions

Domain catalogs remain separate tables. Catalog tables that support custom values include:

- display label/name;
- normalized label/name;
- `scope GLOBAL|USER`;
- nullable `owner_user_id` required for `USER` scope;
- timestamps.

Visibility query invariant:

```text
scope = GLOBAL
OR (scope = USER AND owner_user_id = viewer.id)
```

Database checks enforce valid scope/owner combinations. Partial unique indexes enforce global and per-owner normalized uniqueness within the appropriate domain and parent scope.

## Work Experience catalogs

### companies

`id`, `name`, `normalized_name`, scope/owner, optional metadata such as industry/country.

### job_titles

`id`, `label`, `normalized_label`, scope/owner.

### company_job_titles

Known or viewer-owned association between company and job title. Used to prioritize company-relevant titles.

### work_experiences

- `id`, `user_id`
- `company_id`
- `job_title_id`
- employment type
- start/end date
- `is_current`
- timestamps

Saved work experiences always resolve selections to concrete Company and JobTitle rows, including user-private custom rows created transactionally when needed.

## Education catalogs

### institutions

`id`, `name`, `normalized_name`, scope/owner, optional location/type metadata.

### majors_specializations

`id`, `label`, `normalized_label`, scope/owner.

The application/data model uses `major`/`major_specialization`; the persisted reference is `major_specialization_id`.

### degree_types

`id`, `label`, `normalized_label`, scope/owner.

### institution_programs

Represents a known or viewer-owned program offering:

- `institution_id`
- `major_specialization_id`
- `degree_type_id`
- optional scope/owner when the relation itself is custom

Unique across the same triple/scope.

### education_experiences

- `id`, `user_id`
- `institution_id`
- `major_specialization_id`
- `degree_type_id`
- status
- start/end year
- `is_current`
- timestamps

## Certification catalogs

### certification_boards

`id`, `name`, `normalized_name`, scope/owner, optional URL.

### certification_definitions

- `id`
- `board_id`
- `name`, `normalized_name`
- scope/owner
- optional code/level metadata

Uniqueness is scoped by board and global/owner visibility.

### certifications

User-owned record:

- `id`, `user_id`
- `certification_board_id`
- `certification_definition_id`
- `certification_url`
- `certification_id` (external certification identifier)
- issue/expiration dates
- timestamps

## Professional Focus

### focus_areas

Global or viewer-private custom focus definitions with label, normalized label, optional description, scope/owner.

### user_focus_areas

- `user_id`
- `focus_area_id`
- `sort_order`
- `is_primary`

Database/application invariant: at most one primary focus area per user.

## Skills

### skills

- `id`
- label + normalized label
- `category TECHNICAL|FOUNDATIONAL`
- definition origin `CATALOG|CUSTOM`
- nullable custom owner
- timestamps

### user_skills

- `id`, `user_id`, `skill_id`
- proficiency enum
- timestamps
- unique `(user_id, skill_id)`

### user_skill_sources

- `id`, `user_skill_id`
- source type
- nullable source entity id
- timestamps

### user_skill_dismissals

- `user_skill_id` primary key / foreign key
- `dismissed_at`

A dismissal hides a derived-supported skill from its owner's Skills projection without deleting its source links. It is removed when the user manually re-adds the skill or when the final source link is removed.

## Search indexes

Enable `pg_trgm` and add appropriate trigram indexes to normalized searchable labels. Also index:

- catalog owner/scope predicates;
- company/title association traversal;
- institution program traversal by institution and major;
- certification definitions by board;
- user-owned profile foreign keys;
- skill provenance traversal.
