# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Build & Dev Commands

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint (flat config, ESLint 9)
```

No test framework is configured.

## Tech Stack

- **Next.js 16+** (App Router, Turbopack) — read `node_modules/next/dist/docs/` before using new APIs
- **React 19**, **TypeScript 5** (strict mode)
- **Tailwind CSS v4** (via `@tailwindcss/postcss`), **shadcn/ui** (Base UI React)
- **next-intl** for bilingual i18n (`is` / `en`, default `is`)
- **Firebase**: Firestore (database `pizzadeig`), Auth (Google Sign-in), Cloud Storage
- **Google Maps** (`@vis.gl/react-google-maps`), **lucide-react** icons, **Resend** for email

## Path Alias

`@/*` maps to `./src/*` — always use `@/` imports (e.g., `import { Recipe } from '@/types/recipe'`).

## Architecture

### Routing & i18n

All pages live under `src/app/[locale]/`. Every route receives a `locale` param (`is` or `en`). The i18n config is in `src/i18n/`:
- `routing.ts` — locale definitions, exports `Link`, `useRouter`, `usePathname` from `next-intl/navigation`
- `request.ts` — server-side message loading
- `messages/is.json`, `messages/en.json` — translation strings

Use `useTranslations('Namespace')` in client components and `getTranslations('Namespace')` in server components.

### Bilingual Data Pattern

Firestore documents store both languages inline with `_is` / `_en` suffixes:
- `title_is`, `title_en`, `description_is`, `description_en`
- `ingredients_is`, `ingredients_en` (Array of `{ amount, unit, name }`)
- `steps_is`, `steps_en` (Array of strings)

Select the correct field based on the current locale.

### Key Directories

- `src/components/` — React components organized by domain (`recipes/`, `restaurants/`, `ads/`, `community/`, `dough/`, `layout/`, `ui/`)
- `src/hooks/` — `useAuth.ts` (Firebase Auth), `useRecipes.ts` (Firestore queries with mock fallback), `useCommunityRating.ts`
- `src/lib/` — utilities and data (`firebase.ts`, `recipeData.ts` with hardcoded recipes, `mockData.ts`, `doughCalculator.ts`, `seo.ts`)
- `src/types/` — TypeScript interfaces (`recipe.ts`, `restaurant.ts`, `ad.ts`, `user.ts`, `review.ts`, `category.ts`)

### Firebase

Initialized in `src/lib/firebase.ts`. Client-side only (no Admin SDK). Auth uses Google popup on desktop, redirect on mobile. Firestore security rules are in `firestore.rules` with role-based access (admin role checked via `NEXT_PUBLIC_ADMIN_EMAILS` env var).

### Ad System

`<AdSlot placement="..." format="..." />` in `src/components/ads/AdSlot.tsx`. Queries Firestore for active ads matching placement/format, renders random eligible ad, tracks impressions/clicks via `ad_events` collection.

## Design Tokens

Defined in `src/app/globals.css` as CSS custom properties. Use these instead of hardcoded Tailwind colors:

| Token | Usage |
|-------|-------|
| `--color-brand` (#B91C1C) | Primary red, CTAs |
| `--color-brand-light` (#DC2626) | Hover state |
| `--color-gold` (#D97706) | Ratings, accents |
| `--color-bg-primary` (#FDF9F2) | Main background (cream) |
| `--color-bg-secondary` (#F1EDE6) | Cards, sections |
| `--color-bg-tertiary` (#E8E2D8) | Inputs, nested |
| `--color-text-primary` (#1C1C18) | Main text |
| `--color-text-secondary` (#57534E) | Secondary text |
| `--color-text-tertiary` (#8B7D6B) | Muted text |
| `--color-border` (#D6D3D1) | Standard borders |
| `--color-green` (#4D7C0F) | Green accent |

### Typography

- **Headings:** Playfair Display (700 weight) — use `.heading-display` class
- **Body:** Work Sans (400–700)
- **Decorative:** Caveat (badges, handwritten accents)

### Utility Classes

- `.card-hover` — lift + shadow on hover
- `.skeleton` — loading shimmer animation
- `.btn-primary`, `.btn-secondary`, `.btn-chalk` — button variants
- `.bg-wood`, `.bg-brick`, `.bg-chalk`, `.bg-checkered`, `.bg-paper` — texture backgrounds

## Firestore Schema

### Key Collections

**recipes**: `id`, `slug`, `title_is/en`, `description_is/en`, `type` (`'deig'|'sosa'|'ostur'|'alegg'|'tol'|'heildar'`), `difficulty` (`'audvelt'|'midlungs'|'erfitt'`), `prep_time_min`, `cook_time_min`, `rest_time_min`, `servings`, `ingredients_is/en`, `steps_is/en`, `tips_is/en`, `image_urls`, `author_uid`, `likes_count`, `rating_avg`, `rating_count`, `tags`, `published`

**restaurants**: `id`, `slug`, `name`, `description_is/en`, `address`, `city`, `location` (GeoPoint), `phone`, `website`, `opening_hours`, `price_level` (1–4), `features`, `image_urls`, `owner_uid`, `is_verified`, `rating_avg`, `rating_count` — subcollection: `menu_items`

**reviews**: `id`, `target_type` (`'recipe'|'restaurant'|'menu_item'`), `target_id`, `author_uid`, `rating` (1–5), `comment_is/en`, `image_urls`

**users**: `uid`, `display_name`, `email`, `avatar_url`, `role` (`'user'|'admin'`), `recipes_count`, `reviews_count`

**ads**: `id`, `name`, `client`, `format`, `creatives` (Record<AdFormat, string>), `target_url`, `status` (`'active'|'paused'|'ended'`), `placements`, `start_date`, `end_date`, `impressions`, `clicks`

### Ad Formats
`'1018x360'|'1080x240'|'300x250'|'310x400'|'320x50'|'468x60'|'sponsored_card'`

## Icelandic Route Names

Routes use Icelandic names: `/uppskriftir` (recipes), `/stadir` (restaurants), `/flokkar` (categories), `/topplisti` (top list), `/notandi` (user), `/deigreiknivel` (dough calculator), `/stilar` (styles), `/samfelag` (community), `/um-okkur` (about), `/skilmalar` (terms), `/personuvernd` (privacy), `/tengilidir` (contact).
