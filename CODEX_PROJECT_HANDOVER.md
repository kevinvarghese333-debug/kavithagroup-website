# Kavitha Group Website — Codex Project Handover

Use this document as the primary project context when assigning work to Codex or another development agent.

## 1. Project identity

- Production domain: `https://kavithagroup.in`
- Canonical website: `https://www.kavithagroup.in`
- GitHub repository: `https://github.com/kevinvarghese333-debug/kavithagroup-website.git`
- Production branch: `main`
- Hosting: Vercel
- Vercel project: `kavithagroup-website`
- Framework: Next.js App Router with React and TypeScript

The GitHub repository is the source of truth. Code changes must be committed to this repository, verified in a Vercel preview, and merged into `main` for production deployment.

## 2. Project objective

Kavitha Group is the corporate umbrella for a group of businesses spanning finance, jewellery, savings, fashion, events, sports and leisure.

The website should communicate:

- financial credibility
- heritage
- institutional discipline
- long-term outlook
- warmth and trust
- an established Indian business identity

The visual direction is premium, editorial, understated and timeless. It must not feel like a fintech startup, generic SaaS template, luxury-fashion site, wedding site or heavily animated marketing page.

The brand tagline is:

> Built on trust.

## 3. Important instruction for Codex

This is an existing production application, not a rewrite.

Before making changes:

1. Read this file and `README.md`.
2. Inspect `package.json`, `app/`, `components/`, `lib/`, `db/` and the relevant API routes.
3. Run `git status` and preserve unrelated work.
4. Improve existing components instead of creating duplicate versions.
5. Make the smallest coherent change that satisfies the request.

Do not replace or break:

- database schema or Drizzle configuration
- existing API contracts
- Clerk authentication
- admin authorization and allowlist logic
- Vercel Blob upload logic
- existing CRUD operations
- content-management functionality
- existing routes
- environment variable names
- production image-storage behaviour
- SEO metadata unless the task specifically requires an improvement

Design work should primarily affect presentation, layout, typography, spacing, reusable components, responsive behaviour, interaction states, accessibility and restrained motion.

## 4. Technology stack

- Node.js 22
- Next.js 16.3.5
- React 19.2.6
- TypeScript 5.9
- Tailwind CSS 4
- shadcn/ui
- Base UI
- Lucide icons
- Clerk authentication
- Neon PostgreSQL
- Drizzle ORM
- Vercel Blob
- Vercel deployments through GitHub

## 5. Project structure

```text
app/                     Next.js routes, layouts and route handlers
app/api/admin/           Protected administration APIs
components/              Public website and admin components
components/ui/           shadcn UI foundation
lib/site-content.ts      Default content and database content loaders
lib/admin-auth.ts        Clerk authentication and admin allowlist
db/schema.ts             Drizzle database schema
drizzle/                 SQL migrations and migration metadata
public/assets/           Logos and bundled fallback photography
app/globals.css          Brand tokens and global presentation system
proxy.ts                 Clerk middleware integration
```

## 6. Public routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/about` | Group history, values and leadership |
| `/businesses` | Business portfolio |
| `/investors` | Corporate reports, policies and disclosures |
| `/customers` | Customer information and service links |
| `/careers` | Published career openings |
| `/contact` | Contact information and enquiry form |
| `/sign-in` | Clerk sign-in |
| `/admin` | Protected website administration |

## 7. Admin panel

Production admin URL:

`https://www.kavithagroup.in/admin`

The admin panel supports:

- editing hero text, group story and contact information
- editing business names, categories, descriptions, locations and links
- uploading and replacing business images
- editing leadership names, roles and biographies
- uploading leadership portraits
- uploading and deleting AGM reports, annual reports, policies and disclosures
- creating and editing career openings
- viewing enquiries and changing enquiry status

Content saved through the admin panel is stored in Neon PostgreSQL. Uploaded files are stored in Vercel Blob. Admin content changes appear on the public site without a Git commit or code deployment.

### Upload rules

- Images: JPEG, PNG or WebP
- Documents: PDF
- Maximum upload size: 15 MB
- Typical document categories: `annual`, `agm`, `policy`, `disclosure`

Replacing a business or leadership image uploads a new Blob object. The team should periodically review unused Blob files because the current replacement workflow does not automatically delete an older image.

## 8. Authentication and access control

Clerk handles sign-in. A signed-in user must also appear in the `ADMIN_EMAILS` environment variable.

Current intended administrators:

- `it@kavithagroup.in`
- `kevinvarghese333@gmail.com`

To add an administrator:

1. Add or invite the user in Clerk.
2. Add the exact lowercase email address to `ADMIN_EMAILS` in Vercel.
3. Redeploy the affected Vercel environment.

Never bypass the server-side allowlist check in `lib/admin-auth.ts`.

## 9. Environment variables

```env
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ADMIN_EMAILS=it@kavithagroup.in,kevinvarghese333@gmail.com
```

These values belong in Vercel environment settings and local `.env.local` files. Never commit credentials, service tokens or `.env.local`.

Configure variables independently for Development, Preview and Production where appropriate.

## 10. Database model

The Neon PostgreSQL database contains:

- `content_blocks` — hero, group story and contact content
- `leaders` — leadership profiles and image URLs
- `businesses` — group companies and image URLs
- `documents` — investor documents and Blob URLs
- `jobs` — career openings
- `inquiries` — contact-form submissions

Public pages fall back to the bundled content in `lib/site-content.ts` if database access is unavailable. Admin editing, uploads and contact-form persistence require the configured services.

When changing `db/schema.ts`:

```bash
npm run db:generate
npm run db:migrate
```

Commit the generated migration. Test migrations against a non-production database before applying them to Production.

## 11. Current content state

- Kevin Varghese's approved photograph is included.
- K. Varghese, Kavitha Varghese and Dr. K. Padmanabhan still use portrait placeholders.
- Leadership biographies remain placeholder copy and require approved text.
- Business images can be replaced from the admin panel.
- Corporate documents can be published from the admin panel.
- Contact enquiries are stored in the database.
- Contact submissions do not currently send automatic email notifications.
- The public fallback data identifies `Krithi by Kavitha`, not Kavitha Textiles.

## 12. Brand and UI system

### Core palette

```text
Burgundy       #4A1420
Maroon         #6B1F2A
Antique Gold   #B88A44
Light Gold     #D4AF6A
Cream          #FAF6F0
Warm White     #FFFDF9
Ink            #1C1410
Muted          #6D625C
```

Use the semantic variables already defined in `app/globals.css`. Do not scatter raw colour values through new components.

Recommended colour balance:

- 60–70% cream and warm white
- 15–20% burgundy and maroon
- 5–10% photography and dark surfaces
- 2–5% gold accents

Gold is a restrained accent for rules, selected states, small icon details and important calls to action. It should not dominate the interface.

### Typography

- Manrope: headings, navigation and important UI labels
- Barlow: body copy, forms and metadata
- Playfair Display: short heritage statements and occasional editorial accents

### Layout principles

- Content container: approximately 1280px
- Wide editorial container: approximately 1440px
- Mobile horizontal padding: approximately 20–24px
- Generous but varied section spacing
- Strong whitespace and clear hierarchy
- Editorial public pages rather than repeated shadcn cards
- shadcn components for functional UI such as buttons, sheets, dialogs, forms, tabs, tables and feedback states
- Accessible keyboard focus states
- Restrained transitions and reduced-motion support

## 13. Development setup

```bash
git clone https://github.com/kevinvarghese333-debug/kavithagroup-website.git
cd kavithagroup-website
npm install
cp .env.example .env.local
npm run db:migrate
npm run dev
```

Required checks before committing:

```bash
npm run lint
npm run build
```

Also verify the changed flow manually on desktop and mobile. If the change affects administration, test authentication, save operations and uploads using a Preview environment.

## 14. Parallel development workflow

Do not let multiple developers push unrelated work directly to `main`.

Each task should use its own branch:

```bash
git checkout main
git pull origin main
git checkout -b feature/short-description
```

Suggested naming:

```text
feature/leadership-content
feature/business-photography
feature/email-notifications
fix/mobile-layout
content/annual-reports
```

Workflow:

1. Create a branch from the latest `main`.
2. Make a focused change.
3. Run lint and production build.
4. Push the branch to the Kavitha Group GitHub repository.
5. Open a pull request into `main`.
6. Review the Vercel Preview deployment.
7. Test public pages and any affected admin functions.
8. Merge only after approval.
9. Confirm the Vercel production deployment succeeds.
10. Verify the result on `https://www.kavithagroup.in`.

The current GitHub/Vercel integration automatically deploys updates merged into `main`.

## 15. Deployment and rollback

- Feature branches and pull requests should produce Vercel Preview deployments.
- `main` is the production branch.
- A successful merge to `main` should trigger a production deployment.
- Confirm the Vercel status attached to the GitHub commit.
- Verify the exact changed functionality on the production domain.
- If a production deployment introduces a regression, use Vercel's rollback or promote the last validated deployment.
- Do not fix production by editing generated build output.

## 16. Domain and DNS

Current request flow:

```text
kavithagroup.in
  -> redirects through the existing IIS/Plesk configuration
  -> https://www.kavithagroup.in
  -> Vercel production deployment
```

If the apex domain is later moved entirely to Vercel, preserve all email-related DNS records:

- MX
- SPF
- DKIM
- DMARC
- Google Workspace verification

Do not change nameservers or delete DNS records without first exporting and reviewing the complete DNS zone.

## 17. Security and operational notes

- Admin APIs require both Clerk authentication and the admin email allowlist.
- Upload endpoints validate file type, path and maximum size.
- Public contact input has basic server-side validation and length limits.
- The contact form does not currently have dedicated rate limiting or CAPTCHA.
- Review rate limiting if spam becomes a problem.
- Do not expose Clerk, Neon or Blob credentials to the client.
- Do not store production credentials in prompts, commits, issues or pull requests.
- Keep dependency updates separate from feature work when possible.

## 18. Suggested future work

These are optional follow-up tasks, not permission to alter the architecture automatically:

1. Upload approved portraits and biographies for the remaining leaders.
2. Replace placeholder business imagery with original photographs.
3. Upload AGM reports, annual reports, policies and disclosures.
4. Add contact-enquiry email notifications.
5. Add rate limiting or spam protection to the contact endpoint.
6. Add automated tests for public routes, admin authorization and CRUD operations.
7. Improve document metadata entry with proper form controls instead of browser prompts.
8. Add an intentional cleanup process for replaced Blob images.

## 19. Completion standard for every Codex task

A task is complete only when:

- the requested behaviour is implemented without breaking existing functionality
- existing architecture and data contracts are preserved
- lint passes
- the production build passes
- relevant desktop and mobile flows are verified
- affected admin functionality is tested when applicable
- no secrets or unrelated files are committed
- the change is pushed to the correct feature branch
- the Vercel Preview deployment is reviewed
- the approved pull request is merged into `main`
- the production deployment succeeds
- the final result is checked on the live Kavitha Group domain

