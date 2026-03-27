# Project PRD / Brief: Pizzadeig.is

---

**1. Document Meta**

- **Project Title:** Pizzadeig.is — Íslenskt Pizzusamfélag
- **Version:** 1.0
- **Author(s):** Antigravity / Þórarinn Hjálmarsson
- **Date:** 2026-03-26
- **Status:** In Development
- **Stack:** Next.js 16, React 19, Tailwind CSS 4, Firebase (Auth/Firestore/Storage), Resend, Google Maps

---

**2. Executive Summary**

- **What are we building?** A comprehensive Icelandic pizza community platform — part recipe engine, part restaurant guide, part social community. Think "the ultimate pizza companion for Iceland."
- **Why are we building it?** Iceland has no dedicated pizza platform. Recipes are scattered, restaurant info is unreliable, and there's no community for pizza enthusiasts. Pizzadeig.is fills all three gaps in one bilingual (IS/EN) product.
- **Who is it for?** Icelandic home bakers, pizza enthusiasts, tourists looking for pizza spots, and restaurant owners wanting visibility.
- **Key Deliverables:**
  - Recipe engine with 15+ bilingual recipes (dough, sauces, cheese, toppings, full builds)
  - Restaurant directory with 34 real Icelandic pizza places + triple ratings (Pizzadeig.is / Google / TripAdvisor)
  - Guided Bake mode with step-by-step timers
  - Dough calculator, ingredient matcher, pizza style guides
  - Community features: reviews, likes, follows, badges (gamification)
  - PWA offline support
  - Affiliate product store
- **Desired Outcome:** Become the go-to pizza resource in Iceland. 1,000 monthly users within 6 months, 50+ user-submitted recipes within year 1.

---

**3. Problem Statement**

- **User problem:** Icelandic pizza enthusiasts have no centralized resource. Dough recipes are in English blogs, restaurant info is fragmented across TripAdvisor/Google, and there's no community to share tips and creations.
- **Business problem:** No Icelandic platform monetizes pizza content. There's an opportunity for newsletter-driven engagement, affiliate revenue from pizza equipment, and advertising from restaurants.

---

**4. Vision & Goals**

- **Vision:** The Icelandic pizza bible — from raw dough to the perfect slice, from your kitchen to the best pizzeria on the island.
- **Tagline:** "Allt um pizzu — frá deigi til disks"
- **Goals:**
  - Launch MVP on Vercel with Firebase backend by Q2 2026
  - 34 restaurants + 15 recipes at launch (✅ done)
  - 100 newsletter subscribers within first month
  - 10+ user reviews within first 2 weeks

---

**5. Target Audience**

- **Primary:** Icelandic home bakers (25-45), interested in making pizza from scratch
  - Pain: Can't find good recipes in Icelandic, don't know hydration/timing
  - Current: YouTube, English blogs, trial and error
- **Secondary:** Pizza tourists visiting Iceland
  - Pain: Don't know where to eat pizza, unreliable Google results
  - Current: TripAdvisor, asking at hotel
- **Tertiary:** Restaurant owners
  - Pain: No dedicated pizza platform for visibility
  - Current: Google My Business, own websites

---

**6. Use Cases / User Stories**

1. As a home baker, I want to find a Neapolitan dough recipe in Icelandic, so I can follow it step by step.
2. As a home baker, I want a guided bake mode with timers, so I don't forget my dough or overbake.
3. As a home baker, I want a dough calculator, so I can scale recipes to my number of pizzas.
4. As a pizza lover, I want to find the best pizza place near me, so I can eat great pizza tonight.
5. As a tourist, I want to see pizza places across Iceland on a map, so I can find one in Akureyri.
6. As a reviewer, I want to rate restaurants with pizza emojis (not stars), so it feels fun and on-brand.
7. As a curious cook, I want to select ingredients I have and find matching recipes, so I waste nothing.
8. As a user, I want to earn badges for my contributions, so I feel rewarded for engaging.
9. As a restaurant owner, I want my place verified and visible, so I attract more customers.

---

**7. Functional Requirements**

### Core Feature 1: Recipe Engine
- 15+ bilingual recipes across 5 categories: deig, sósur, ostur, álegg, pizzur
- Full ingredient lists with amounts and units (IS + EN)
- Step-by-step instructions
- Difficulty level, prep/cook/rest time, servings
- User ratings (whole pizzas 1-5🍕)
- Search by title, tags, ingredients, and description

### Core Feature 2: Guided Bake
- Full-screen overlay launched from recipe page
- Per-step countdown timers
- Sound alerts when timer completes
- Progress bar across all steps
- Celebration screen on completion

### Core Feature 3: Restaurant Directory
- 34 real Icelandic pizza places (Reykjavík, Akureyri, Keflavík, Selfoss, Vestmannaeyjar, Húsavík, Ísafjörður, Egilsstaðir, Eskifjörður, Stykkishólmur + greater Reykjavík area)
- Triple rating display: Pizzadeig.is (community) / Google / TripAdvisor
- Menu items for select restaurants
- Google Maps integration
- Filter by city, features, tags

### Core Feature 4: Dough Calculator
- Input: number of balls, ball weight, hydration %, salt %
- Output: exact grams of flour, water, salt, yeast
- Timeline visualization

### Core Feature 5: Ingredient Matcher
- Tag-based ingredient selection
- Scoring algorithm matches against all recipes
- Sorted results by match percentage

### Core Feature 6: Community
- User registration (Email + Google)
- Reviews with whole-pizza ratings
- Likes on recipes and restaurants
- Follow other users
- 8 unlockable badges (gamification)
- User gallery with photo upload

### Core Feature 7: Pizza Style Guides
- Educational pages for 4 styles: Neapolitan, New York, Detroit, Roman
- Stats: temperature, hydration, bake time
- Visual cards with key differences

### Core Feature 8: Newsletter
- Email subscription via Resend
- Managed audience list

### Core Feature 9: PWA
- Service worker with network-first caching
- Install prompt banner
- Offline access to cached recipes

### Core Feature 10: Affiliate Store
- Product recommendations in 5 categories: Mjöl, Tómatar, Tól, Ofnar, Ostur
- External affiliate links

### Core Feature 11: Search
- Client-side search across recipes and restaurants
- Searches titles, descriptions, tags, ingredients, cities
- Debounced dropdown results with images

---

**8. Non-Functional Requirements**

- **Performance:** < 2s page load (Next.js SSR + ISR)
- **Security:** Firebase Auth, Firestore rules, Storage rules with file type/size limits
- **Usability:** Mobile-first responsive design, bilingual IS/EN
- **Reliability:** Vercel edge network, Firebase global infrastructure
- **SEO:** Meta tags, semantic HTML, proper heading hierarchy, OpenGraph

---

**9. Scope**

### In-Scope (MVP)
- All 11 core features above
- 15 recipes, 34 restaurants
- Admin dashboard (recipes, restaurants, ads, users)
- Bilingual (IS/EN)
- Dark "Pizzería" theme

### Out-of-Scope (Future)
- Native mobile apps
- Restaurant owner self-service portal
- AI recipe generation
- Video content
- Delivery ordering integration
- Real-time chat between users
- Multi-language beyond IS/EN

---

**10. Success Metrics / KPIs**

| Metric | Target | Timeframe |
|---|---|---|
| Monthly active users | 1,000 | 6 months |
| Newsletter subscribers | 100 | 1 month |
| User-submitted recipes | 50 | 12 months |
| Restaurant reviews | 100 | 6 months |
| Average session duration | > 3 min | 3 months |
| PWA installs | 200 | 6 months |

---

**11. Assumptions**

- Users will engage with Icelandic-language pizza content
- Firebase free tier is sufficient for initial scale
- Unsplash placeholder images will be replaced with real photos over time
- Restaurant data is accurate based on web scraping (to be verified)

---

**12. Constraints**

- **Timeline:** MVP launch Q2 2026
- **Budget:** Near-zero — all free-tier services (~3,000 kr/year for domain only)
- **Technical:** Next.js 16 + Firebase, deployed on Vercel
- **Team:** Solo developer + AI assistance

---

**13. Dependencies**

- **Domain:** pizzadeig.is registration at ISNIC
- **Firebase:** Project setup + security rules deployment
- **Vercel:** Git repo connection + environment variables
- **Resend:** Domain verification for newsletter emails
- **Google Cloud Console:** Maps JavaScript API + Places API keys
- **Content:** Real photos to replace Unsplash placeholders

---

**14. Open Questions**

- Should we add a "Pizza of the Week" editorial feature?
- Should restaurant owners be able to claim and manage their listing?
- Should we integrate with Icelandic food delivery services (Aha, etc.)?
- Should we add video tutorials for techniques (stretching, baking)?
- How do we handle moderation of user-submitted reviews?

---

**15. Appendix**

- **Design System:** See [DESIGN.md](file:///Users/thorarinnhjalmarsson/Documents/Antigravity/pizzadeig/DESIGN.md)
- **Deployment Guide:** See [owner.md](file:///Users/thorarinnhjalmarsson/Documents/Antigravity/pizzadeig/owner.md)
- **Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Firebase, Resend, Google Maps
- **Repository:** Local at `/Users/thorarinnhjalmarsson/Documents/Antigravity/pizzadeig`
