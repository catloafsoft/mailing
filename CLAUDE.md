# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mailing is a modern email development framework that enables developers to build, preview, and send emails using React components. This is a fork of sofn-xyz/mailing with significant modernization: React 19, Next.js 16, pure ESM architecture, Vite integration for 3.5x faster builds, and Node.js 18+ requirement.

The repository is a **pnpm monorepo** with three packages:

- **`packages/core`** - Lightweight email rendering library (React → MJML → HTML)
- **`packages/cli`** - Development preview server and production email server
- **`packages/web`** - Documentation site and analytics dashboard (Next.js)

## Essential Commands

### Development

```bash
# Install dependencies (first time)
pnpm install

# Start CLI preview server (primary dev workflow)
pnpm dev                    # Port 3883

# Start documentation website
pnpm dev:web                # Port 3000

# Watch and rebuild packages
pnpm watch
```

### Testing

```bash
# Run all Jest unit tests
pnpm test

# Run integration tests (auto-starts test servers)
pnpm test:integration

# Watch mode for integration tests
pnpm test:integration:watch

# Cypress tests for preview server (requires server running)
cd packages/cli && pnpm exec cypress run

# Interactive Cypress
cd packages/cli && pnpm exec cypress open
```

### Building & Linting

```bash
# Build all packages (uses preconstruct)
pnpm build

# Lint entire monorepo
pnpm lint

# Type check
cd packages/web && pnpm type-check
```

### E2E Framework Tests

```bash
# Full framework test suite (Next.js, Remix, Redwood, etc.)
pnpm test:e2e

# Test specific framework with Ruby harness
bundle exec ruby e2e/cli.rb --app=next_ts

# Skip build step (faster iteration)
bundle exec ruby e2e/cli.rb --app=next_ts --skip-build

# Rerun without reinstalling framework
bundle exec ruby e2e/cli.rb --app=next_ts --rerun
```

### Publishing & Releases

```bash
# Local release simulation
pnpm release:local

# Production release
pnpm release
```

## Architecture

### Core Package (`packages/core`)

**Purpose**: Framework-agnostic library for rendering React email components to production HTML.

**Key Files**:

- `src/index.ts` - Exports `buildSendMail()` and `render()`
- `src/mjml.ts` - Core rendering pipeline: `React → MJML → HTML`
- `src/util/instrumentHtml.ts` - Adds analytics tracking pixels and click tracking

**Rendering Flow**:

```text
React Component → renderToMjml() → MJML string → mjml2html() → responsive HTML
```

**Key Function**: `buildSendMail(transport, defaults, configPath)`
Returns an async `sendMail()` that handles three modes:

1. **Test mode** (`NODE_ENV=test`): Queues emails to temp file instead of sending
2. **Preview mode** (local dev): Creates "intercepts" that open in browser preview
3. **Production mode**: Renders, instruments with tracking, sends via nodemailer

### CLI Package (`packages/cli`)

**Purpose**: Full development environment with hot-reloading preview server and production email server.

**Key Architecture**:

1. **Preview Server** (`src/commands/preview/server/start.ts`):
   - Bootstraps by copying CLI files to `./.mailing/` directory
   - Scans user's `emailsDir` for templates and previews
   - Generates `moduleManifest.ts` dynamically with all email imports
   - Starts Next.js dev server on port 3883
   - Watches files and hot-reloads via Socket.IO

2. **Email Discovery** (`src/commands/preview/server/setup.ts`):

   ```text
   Step 1: Scan emailsDir/previews/*.tsx → create preview imports
   Step 2: Scan emailsDir/*.tsx → create template imports
   Step 3: Generate moduleManifest.ts with all imports/exports
   Step 4: Build manifest with esbuild
   ```

3. **Email Template Structure**:
   - Templates: `emails/Welcome.tsx` (React component with optional `subject` property)
   - Previews: `emails/previews/Welcome.tsx` (named functions that return template instances)

4. **API Endpoints** (in `src/pages/api/`):
   - `render.ts` - Renders template with props to HTML
   - `sendMail.ts` - Sends emails or creates preview intercepts
   - `messages/` - CRUD operations for message tracking

5. **Database** (Prisma):
   - Tracks users, organizations, API keys
   - Records all sent messages with analytics (opens, clicks)
   - Manages subscription lists and members
   - Schema: `packages/cli/prisma/schema.prisma`

### Web Package (`packages/web`)

**Purpose**: Public documentation site and analytics dashboard.

**Structure**:

- Next.js app using Pages Router (not App Router)
- MDX-based documentation in `pages/docs/`
- Separate Prisma database for newsletter subscribers
- Demonstrates mailing usage with its own email templates in `emails/`

### Package Dependencies

```text
web → core (for email examples)
cli → core (for rendering) + next (server) + prisma (tracking)
core → standalone (no internal deps)
```

## Development Workflow

### Local Development with Yalc

When testing CLI changes in a real Next.js app:

```bash
# In packages/cli directory
yalc publish

# In your test Next.js app
yalc add @catloafsoft/mailing

# After making changes to mailing
cd /path/to/mailing
pnpm build
yalc push  # Publishes and updates linked apps
```

### Email Development Flow

1. Start preview server: `pnpm dev` (opens <http://localhost:3883>)
2. Create template: `emails/Welcome.tsx`
3. Create preview: `emails/previews/Welcome.tsx` with named preview functions
4. Server auto-discovers and hot-reloads
5. View in browser with desktop/mobile toggle
6. Call `sendMail({ component: <Welcome /> })` to preview without sending

### Testing Strategy

- **Unit tests**: `packages/*/src/__test__/**/*.test.tsx`
- **Integration tests**: Test with real database, auto-start servers
- **Cypress tests**: UI tests for preview server (in `packages/cli/cypress`)
- **E2E tests**: Ruby harness in `scripts/e2e_test` tests multiple frameworks

## Code Conventions (from .cursor/rules)

### ESM-Only Architecture

- Use `import`/`export` only, never `require` or `module.exports`
- Use `import.meta.url` with `fileURLToPath` instead of `__dirname`
- All packages have `"type": "module"` in package.json
- Target Node 18+, use native `fetch` and `fs/promises`

### TypeScript Standards

- Explicitly annotate exported/public APIs
- Avoid `any` - use `unknown` with type guards
- Extract complex types to shared files, never inline
- Prefer early returns, handle errors first
- Keep files ≤ 500 lines, extract shared logic
- Use meaningful names: functions as verbs, variables as nouns

### Linting

- Treat all lints as errors, fix root causes
- Never disable/bypass rules without discussion
- Extract reusable logic instead of duplicating code
- ESLint flat config in `eslint.config.mjs` (ESLint 9)

### Next.js (Web Package)

- Uses Pages Router (not App Router)
- Keep modules ESM-only
- MDX docs in `packages/web/pages/docs/`
- Avoid Node-only APIs in edge/runtime code

## Build System

### Preconstruct

- Monorepo coordination tool
- Handles symlinks between packages during development
- `pnpm postinstall` runs `preconstruct dev` to set up links
- `pnpm build` runs `preconstruct build` for all packages

### Vite (CLI & Core)

- CLI: Entry `src/index.ts` → `dist/mailing.js`
- Core: Entry `src/index.ts` → `dist/index.js`
- External deps kept outside bundle (react, next, fs, etc.)
- Target: ES2022, Node 18+

### Prisma

- Two separate databases:
  - `MAILING_DATABASE_URL` - CLI package (messages, analytics, auth)
  - `WEB_DATABASE_URL` - Web package (newsletter subscribers)
- Generate clients: `pnpm exec prisma generate`
- Migrations: `pnpm exec prisma migrate dev`

## Key Configuration Files

- `pnpm-workspace.yaml` - Workspace package definitions
- `mailing.config.json` - User project config (emailsDir, port, typescript)
- `eslint.config.mjs` - Flat config for ESLint 9
- `packages/*/vite.config.ts` - Build configurations
- `packages/*/prisma/schema.prisma` - Database schemas

## Important Technical Details

### Email Rendering Pipeline

1. React component with props
2. `renderToMjml()` converts to MJML markup
3. `mjml2html()` converts to responsive HTML
4. `instrumentHtml()` adds tracking pixels and click tracking
5. HTML minified and sent via nodemailer

### Preview System ("Intercepts")

- In development, `sendMail()` doesn't actually send
- Instead, POSTs to `/api/intercepts` on preview server
- Stores email in memory cache, opens in browser
- Allows testing without sending real emails

### Module Manifest Generation

- CLI scans user's email directory at runtime
- Generates `moduleManifest.ts` with all template imports
- Built with esbuild for fast iteration
- Regenerated on file changes with hot reload

### Analytics Integration

- When `MAILING_API_URL` and `listName` provided:
  - Message registered with API, returns messageId
  - Tracking pixel: `<img src="/api/hooks/open/{messageId}">`
  - Click tracking wraps all links
  - Dashboard shows opens/clicks per message

## Environment Variables

### CLI Package

- `MAILING_DATABASE_URL` - Postgres connection for message tracking
- `MAILING_API_KEY` - API key for sendMail endpoint
- `MAILING_API_URL` - URL for analytics/tracking service
- `NODE_ENV` - Controls test/preview/production modes
- `REQUIRE_API_KEY` - Enable/disable API key validation

### Web Package

- `WEB_DATABASE_URL` - Separate Postgres for newsletter subscribers
- `NEXT_PUBLIC_MAILING_SKIP_AUTH` - Skip authentication (dev only)

## Testing Database Setup

Integration tests require test database URLs:

```bash
MAILING_DATABASE_URL_TEST=postgresql://...
WEB_DATABASE_URL_TEST=postgresql://...
```

See `.env.example` for full configuration details.

## Common Patterns

### Creating a New Email Template

1. Create template file: `emails/MyEmail.tsx`

   ```typescript
   import { MjmlSection, Heading } from '@faire/mjml-react';
   import BaseLayout from './BaseLayout';

   type MyEmailProps = { name: string };

   const MyEmail = ({ name }: MyEmailProps) => (
     <BaseLayout>
       <MjmlSection>
         <Heading>Hello {name}</Heading>
       </MjmlSection>
     </BaseLayout>
   );

   MyEmail.subject = ({ name }) => `Welcome, ${name}!`;
   export default MyEmail;
   ```

2. Create preview: `emails/previews/MyEmail.tsx`

   ```typescript
   import MyEmail from '../MyEmail';

   export function withName() {
     return <MyEmail name="Alice" />;
   }

   export function withLongName() {
     return <MyEmail name="Bartholomew" />;
   }
   ```

3. Preview server auto-discovers both files

### Sending Emails in Production

```typescript
import { buildSendMail } from '@catloafsoft/mailing-core';
import nodemailer from 'nodemailer';
import MyEmail from './emails/MyEmail';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: { user: '...', pass: '...' }
});

const sendMail = buildSendMail({
  transport,
  defaultFrom: 'hello@example.com',
  configPath: './mailing.config.json'
});

await sendMail({
  to: 'user@example.com',
  component: <MyEmail name="Alice" />,
  dangerouslyForceDeliver: true // Required in production
});
```

## Release Process

1. Make changes, run tests: `pnpm test` and `pnpm test:integration`
2. Run framework E2E tests: `pnpm test:e2e`
3. Update version with changesets: `pnpm changeset`
4. Build: `pnpm build`
5. Release: `pnpm release` (runs publish script)

## Additional Resources

- Documentation: <https://www.mailing.run/docs>
- Contributing: `docs/CONTRIBUTING.md`
- Discord: <https://discord.gg/fdSzmY46wY>
- Issues: <https://github.com/catloafsoft/mailing/issues>
