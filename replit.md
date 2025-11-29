# AzMountain - Azerbaijan Mountain Tourism Platform

## Overview

AzMountain is a mountain tourism platform for Azerbaijan that gamifies the climbing experience through regional achievement badges. The application allows users to discover mountain trips, earn cultural achievements representing Azerbaijan's regions (Karabakh, Nakhchivan, Shaki, Gabala, Ganja, Gobustan), track their climbing progress, and share reviews. It combines practical trip planning with cultural heritage celebration, creating an immersive experience that connects adventurers with Azerbaijan's rich mountain landscapes and traditions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Monorepo Structure

The application uses a monorepo architecture with three main directories:
- **client/** - React frontend application with Vite
- **server/** - Express.js backend API
- **shared/** - Shared TypeScript types and database schema

This structure enables type sharing between frontend and backend, reducing duplication and ensuring consistency.

### Frontend Architecture

**Framework**: React 18 with TypeScript, bundled via Vite

**Routing**: Wouter (lightweight client-side routing library)

**State Management**: TanStack Query (React Query) for server state management and caching. No global client state management library is used - component state and React Query handle all state needs.

**UI Component Library**: Radix UI primitives with shadcn/ui styling system. This provides accessible, unstyled components that are customized with Tailwind CSS. The "new-york" style variant is configured.

**Styling**: Tailwind CSS with custom design tokens defined in `index.css`. The design system includes:
- Custom color palette inspired by Azerbaijan (teal primary, amber/orange secondary)
- Typography system using Montserrat (headlines), Inter (body), and Playfair Display (cultural sections)
- Responsive spacing and layout utilities
- Custom CSS variables for theming (light/dark mode support)

**Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

**Internationalization (i18n)**: Multi-language support using react-i18next
- Languages: English (en), Azerbaijani (az), Turkish (tr), Russian (ru)
- Translation files: `client/src/locales/{en,az,tr,ru}.json`
- Configuration: `client/src/lib/i18n.ts`
- LanguageSwitcher component with text-based country codes (EN/AZ/TR/RU) and Lucide icons (no emojis per design guidelines)
- Browser language detection with localStorage persistence

**Key Pages**:
- Landing page for unauthenticated users
- Home dashboard for authenticated users showing progress and featured content
- Trips catalog with filtering and search
- Achievements gallery with regional and tier-based organization
- Reviews section with user-generated content
- Personal dashboard showing user stats and completed trips

### Backend Architecture

**Framework**: Express.js with TypeScript

**API Design**: RESTful API with JSON responses. Routes are organized in `server/routes.ts` with the following endpoint groups:
- `/api/auth/*` - Authentication endpoints
- `/api/regions` - Regional data
- `/api/trips` - Trip listings and details
- `/api/achievements` - Achievement definitions
- `/api/user/*` - User-specific data (trips, achievements, stats)
- `/api/reviews` - User reviews

**Business Logic**: Centralized in the storage layer (`server/storage.ts`) which provides a clean interface between HTTP handlers and database operations. This abstraction allows for easier testing and potential database migrations.

**Build Process**: Custom build script (`script/build.ts`) that:
- Bundles the client with Vite
- Bundles the server with esbuild
- Selectively bundles dependencies to reduce cold start times
- Produces a single distributable in `dist/`

### Database & ORM

**Database**: PostgreSQL via Neon serverless (configured but ready to be provisioned)

**ORM**: Drizzle ORM with the following design:
- Schema definitions in `shared/schema.ts` using Drizzle's schema builder
- Type-safe queries with full TypeScript inference
- Zod schema generation from Drizzle schemas for validation
- Migration management via drizzle-kit

**Schema Design**:
- `users` - User profiles with climbing stats (level, points, elevation)
- `regions` - Azerbaijan regions with cultural symbols
- `trips` - Mountain trips/adventures with difficulty levels and activity types
- `achievements` - Badge definitions with tiers (bronze/silver/gold/platinum)
- `user_achievements` - Junction table tracking earned badges
- `user_trips` - Junction table tracking completed trips with ratings
- `reviews` - User reviews with ratings and content
- `sessions` - Session storage for authentication

**Relationships**: Uses Drizzle's relations API to define foreign keys and enable join queries.

### Authentication System

**Provider**: Replit Auth (OpenID Connect integration)

**Implementation**: Passport.js strategy with `openid-client` library

**Session Management**: 
- Express sessions stored in PostgreSQL via `connect-pg-simple`
- 7-day session TTL with secure, httpOnly cookies
- Session secret from environment variables

**User Flow**:
- Redirect to `/api/login` triggers OIDC flow
- Successful auth creates/updates user record and establishes session
- Frontend checks authentication via `/api/auth/user` endpoint
- Protected routes use `isAuthenticated` middleware

**User Model**: Users are upserted on login with data from OIDC claims (email, name, profile image). Additional climbing statistics are maintained separately.

### Data Flow & Caching

**Client-Server Communication**:
- All API requests include credentials for session cookie transmission
- Centralized request handling in `lib/queryClient.ts`
- Error responses are parsed and thrown for React Query to handle

**Caching Strategy**:
- React Query configured with `staleTime: Infinity` by default
- Manual invalidation after mutations (creating trips, earning achievements, etc.)
- Optimistic updates not currently implemented but structure supports it

**Authorization Pattern**: 401 responses can be configured to either return null or throw errors depending on context via `getQueryFn` options.

## External Dependencies

### Core Infrastructure
- **Neon Database** (@neondatabase/serverless) - Serverless PostgreSQL hosting
- **Replit Auth** (openid-client) - Authentication via OIDC
- **Replit Deployment Tools** - Vite plugins for development environment integration

### UI & Component Libraries
- **Radix UI** - Complete suite of accessible, unstyled UI primitives (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui** - Pre-styled component implementations built on Radix
- **Lucide React** - Icon library (used throughout for consistent iconography)
- **Tailwind CSS** - Utility-first styling framework

### State & Data Management
- **TanStack Query** (React Query) - Server state synchronization and caching
- **React Hook Form** - Form state management with performance optimization
- **Zod** - Runtime type validation and schema definition

### Build & Development Tools
- **Vite** - Frontend build tool and dev server with HMR
- **esbuild** - Fast JavaScript bundler for server code
- **TypeScript** - Type safety across entire stack
- **Drizzle Kit** - Database migration CLI tool

### Backend Utilities
- **Express.js** - Web server framework
- **Passport.js** - Authentication middleware
- **ws** - WebSocket library (for Neon serverless connections)
- **Wouter** - Lightweight routing for React

### Fonts & Assets
- **Google Fonts** - Montserrat, Inter, Playfair Display
- **Unsplash** - Hero images and trip photos (referenced via URLs in seed data)

### Development & Quality
- **@replit/vite-plugin-cartographer** - Development tooling
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error overlay
- **@replit/vite-plugin-dev-banner** - Development mode indicators

All dependencies are managed via npm with versions locked in package-lock.json. The build process selectively bundles critical dependencies (listed in allowlist) to optimize cold start performance while keeping others external.