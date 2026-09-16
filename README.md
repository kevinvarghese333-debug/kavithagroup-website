# Kavitha Group website

The corporate website and content-management dashboard for Kavitha Group. The application is built with Next.js 16 and is ready for Vercel's standard Next.js deployment pipeline.

## Architecture

- Next.js App Router for the public website, admin dashboard, and API routes
- Clerk for admin authentication
- Neon Postgres with Drizzle ORM for editable website content
- Vercel Blob for leadership photos, business imagery, and investor documents
- Vercel-managed preview and production deployments

Public pages fall back to the bundled Kavitha Group content when the database has not been provisioned yet. Editing, enquiries, and uploads require the configured services.

## Local setup

Use Node.js 22 and install dependencies:

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`, then prepare the database and start the application:

```bash
npm run db:migrate
npm run dev
```

The admin dashboard is available at `/admin`. Only addresses listed in `ADMIN_EMAILS` can access it, even if another user has a valid Clerk account.

## Vercel deployment

1. Import `kevinvarghese333-debug/kavithagroup-website` into the intended Vercel team.
2. Add a Neon Postgres database, a Vercel Blob store, and a Clerk application.
3. Add the variables from `.env.example` to the Development, Preview, and Production environments as appropriate.
4. Run `npm run db:migrate` against the intended Neon database once before using the admin dashboard.
5. Deploy a preview and verify the public pages, admin sign-in, content editing, file uploads, contact form, and report downloads.
6. Add `kavithagroup.in` and `www.kavithagroup.in` to the Vercel project only after the preview is approved, then apply Vercel's DNS records in Cloudflare.

Keep the existing Google Workspace MX, SPF, and domain-verification records when changing website DNS. Do not commit `.env.local` or any service credentials.

## Required environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob uploads and document management |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser authentication |
| `CLERK_SECRET_KEY` | Clerk server authentication |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route; use `/sign-in` |
| `ADMIN_EMAILS` | Comma-separated admin allowlist |

## Verification commands

```bash
npm run lint
npm run build
npm audit --omit=dev
```
