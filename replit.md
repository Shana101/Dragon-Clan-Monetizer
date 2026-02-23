# Heidi Monetization Dashboard — Dragon Clan TV

## Overview

This is the **Heidi Monetization Dashboard** for Dragon Clan TV — an AI-powered creator monetization platform. The application provides creators with a dashboard to manage earnings, subscription tiers, community engagement, analytics, gamification (Dragon Points), and AI assistant tools ("Heidi"). The core philosophy is to avoid Apple/Google app store taxes by processing all payments through web-based flows (Stripe, PayPal), reward creators directly, and incentivize migration from YouTube/TikTok.

The app is a full-stack TypeScript monorepo with a React frontend (Vite) and an Express backend, using PostgreSQL via Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
- **`client/`** — React SPA (Single Page Application)
- **`server/`** — Express API server
- **`shared/`** — Shared TypeScript types and Drizzle schema (used by both client and server)
- **`migrations/`** — Drizzle-generated database migrations
- **`script/`** — Build scripts

### Frontend (`client/src/`)
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router)
- **State/Data Fetching**: `@tanstack/react-query` for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin), CSS variables for theming (dark dragon/gaming aesthetic with orange-yellow primary color (Dragon Clan branding)), custom fonts (Rajdhani display, Inter body)
- **Pages**: Dashboard (overview), Earnings, Heidi Tools, Dragon Points, Community, Analytics, Settings, Podcast Studio
- **Layout**: Collapsible sidebar navigation with mobile sheet drawer, top header bar with search and notifications
- **API Communication**: Custom `apiRequest` utility function wrapping `fetch`, with React Query for caching/invalidation
- **Auth approach**: Demo/seed-based — uses localStorage to persist a user ID, seeds demo data on first visit via `/api/seed`

### Backend (`server/`)
- **Framework**: Express 5 on Node.js
- **Entry point**: `server/index.ts` — creates HTTP server, registers routes, sets up Vite dev middleware or static file serving
- **Routes** (`server/routes.ts`): RESTful API endpoints for users, earnings, subscription tiers, dragon quests, community posts, analytics, and a seed endpoint
- **Storage** (`server/storage.ts`): `DatabaseStorage` class implementing `IStorage` interface, using Drizzle ORM over a `pg` Pool connection
- **Dev mode**: Vite dev server runs as middleware inside Express (HMR via WebSocket at `/vite-hmr`)
- **Production**: Client is pre-built to `dist/public`, served as static files; server is bundled with esbuild to `dist/index.cjs`

### Database
- **Database**: PostgreSQL (required — `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema validation
- **Schema** (`shared/schema.ts`): 6 tables:
  - `users` — creator profiles with Heidi AI settings, payment connection status, gamification fields
  - `earnings` — revenue records (subscription, tip, ad, merch)
  - `subscription_tiers` — creator subscription tier configurations
  - `dragon_quests` — gamification quests/challenges
  - `community_posts` — social/community feed posts
  - `analytics_snapshots` — time-series analytics data
- **Migrations**: Use `drizzle-kit push` (`npm run db:push`) to sync schema to database

### Build System
- **Dev**: `npm run dev` — runs Express with Vite middleware via `tsx`
- **Build**: `npm run build` — runs `script/build.ts` which builds client with Vite and server with esbuild
- **Production**: `npm start` — runs the bundled `dist/index.cjs`
- Server dependencies in the allowlist are bundled to reduce cold start times; others are external

### Key Design Decisions
1. **No authentication system** — Uses a demo seed approach where a user is auto-created and stored in localStorage. This is a prototype/demo pattern.
2. **Shared schema** — The `shared/` directory allows both client and server to import the same types and validation schemas, ensuring type safety across the stack.
3. **Storage interface pattern** — `IStorage` interface abstracts the database layer, making it possible to swap implementations (e.g., in-memory for testing).
4. **Web-first payments** — Architecture deliberately avoids native app patterns; all payment flows go through web (Stripe/PayPal) to avoid platform fees.

## External Dependencies

### Database
- **PostgreSQL** — Primary data store, connected via `DATABASE_URL` environment variable
- **Drizzle ORM** + `drizzle-kit` — Schema management and query building
- **`pg`** — Node.js PostgreSQL client (connection pooling)

### Payment Processing (Planned/Referenced)
- **Stripe** — Referenced in schema (`stripeConnected` field) and build allowlist
- **PayPal** — Referenced in schema (`paypalConnected` field)

### AI Services (Referenced in Build)
- **OpenAI** — In build allowlist, likely for Heidi AI features
- **Google Generative AI** (`@google/generative-ai`) — In build allowlist

### Frontend Libraries
- **Radix UI** — Full suite of accessible primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui** — Pre-built component library (new-york style variant)
- **Recharts** — Charting library (used via chart.tsx component)
- **Embla Carousel** — Carousel component
- **React Hook Form** + `@hookform/resolvers` — Form management with Zod validation
- **wouter** — Client-side routing
- **date-fns** — Date formatting utilities
- **cmdk** — Command palette component
- **vaul** — Drawer component

### Build & Dev Tools
- **Vite** — Frontend build tool with HMR
- **esbuild** — Server bundling for production
- **tsx** — TypeScript execution for development
- **Tailwind CSS v4** — Utility-first CSS framework
- **Replit plugins** — `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` (dev-only)

### Other Server Dependencies
- **express-session** + `connect-pg-simple` — Session management (in allowlist, may be used for future auth)
- **passport** + `passport-local` — Authentication framework (in allowlist, not yet implemented)
- **nodemailer** — Email sending capability
- **multer** — File upload handling
- **nanoid** / **uuid** — ID generation
- **jsonwebtoken** — JWT token handling
- **cors** — Cross-origin resource sharing
- **express-rate-limit** — API rate limiting