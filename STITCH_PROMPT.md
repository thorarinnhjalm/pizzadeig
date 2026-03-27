# STITCH DESIGN REQUEST — Pizzadeig.is Remaining Pages

> Use the existing "Modern Digital Kitchen" design system to create high-fidelity screens for the following pages. Maintain visual consistency with the Homepage and Recipe Detail page already designed.

---

## EXISTING DESIGN SYSTEM (do not change)

- **Background:** `#FDF9F2` (cream/00 flour)
- **Surface:** `#F1EDE6` (warm stone)
- **Primary:** `#B91C1C` (San Marzano red)
- **Secondary:** `#D97706` (Golden Crust amber)
- **Text:** `#1C1C18` (Espresso dark)
- **Muted text:** `#57534E`
- **Border:** `#D6D3D1` (stone)
- **Headings:** Playfair Display (bold, italic for accents)
- **Body:** Work Sans
- **Buttons:** Fully rounded (pill shape), red CTA, beige secondary
- **Cards:** `border-radius: 2xl`, subtle shadow, hover lift
- **Navbar:** "Pizzadeig.is" in red serif left, 4 links center (Recipes, Restaurants, Community, Shop), cart + user icons right

---

## PAGES TO DESIGN (6 screens)

### 1. RECIPE LIST — `/uppskriftir`
**Purpose:** Browse and filter all 15 recipes.

**Layout:**
- Hero: Section title "Uppskriftasafn" with subtitle
- Filter bar: Horizontal pill buttons for categories: `Deig`, `Sósur`, `Ostur`, `Álegg`, `Pizzur`, `Allt`
- Grid: 3 columns (desktop), 1 column (mobile)
- Each card identical to Homepage recipe cards:
  - Large image (rounded top)
  - Category badge (top-right, red)
  - Pizza emoji ratings 🍕🍕🍕🍕🤍 + review count
  - Title (Playfair Display bold)
  - Description (2 lines, Work Sans)
  - Footer: clock icon + ferment time | difficulty icon + level
- Pagination or "Load more" button at bottom

---

### 2. RESTAURANT LIST — `/stadir`
**Purpose:** Discover Icelandic pizza restaurants.

**Layout:**
- Hero: "Pizzustaðir á Íslandi" with subtitle
- Split view:
  - Left (60%): Scrollable list of restaurant cards
  - Right (40%): Google Map (placeholder rectangle with pin icons)
- Restaurant card:
  - Name (Playfair Display bold)
  - Address, city
  - Triple rating display:
    - 🍕 Pizzadeig.is community rating
    - 📍 Google rating
    - 🦉 TripAdvisor rating
  - Tags: pill badges (e.g. "Viðarofn", "Napólí stíl", "Afhending")
  - "Skoða" button (red pill)

---

### 3. RESTAURANT DETAIL — `/stadir/[slug]`
**Purpose:** Individual restaurant page.

**Layout:**
- Hero image (full-width, rounded bottom corners)
- Restaurant name + address + city
- Triple rating bar (same as card but larger)
- Tabs or sections:
  - "Um staðinn" — description
  - "Matseðill" — menu items (if available)
  - "Kort" — embedded Google Map
  - "Umsagnir" — community reviews with pizza rating form
- Sidebar: Hours, contact info, features/tags

---

### 4. INGREDIENT SEARCH — `/hvad-a-eg` ("What's in the cupboard?")
**Purpose:** Find recipes by selecting ingredients you have at home.

**Layout:**
- Hero: "Hvað á ég?" with playful subtitle
- Ingredient selection area:
  - Grid of ingredient buttons organized by category (Mjöl, Ger, Ostur, Grænmeti, Kjöt, Krydd)
  - Selected ingredients highlighted with checkmark
  - Each ingredient is a pill button with emoji + name
- "Finna uppskriftir" amber button (large, centered)
- Results area: Shows matching recipe cards (same style as recipe list)
- Empty state: Illustration with "Veldu hráefni til að byrja"

---

### 5. DOUGH CALCULATOR — `/deigreiknivel`
**Purpose:** Calculate exact dough quantities based on number of pizzas.

**Layout:**
- Hero: "Deigreiknivél" with subtitle about precision
- Calculator card (centered, stone background):
  - Slider or +/- input: "Fjöldi pizza" (1-20)
  - Slider: "Vatnshlutfall" (55-75%)
  - Dropdown: Pizza style (Napólí, New York, Detroit)
  - Toggle: "Ger" vs "Súrdeig"
- Results card (below calculator):
  - Ingredient list with exact gram amounts
  - Visual progress bar showing hydration percentage
  - Fermentation timeline (visual, horizontal)
- "Vista eða deila" button

---

### 6. PIZZA STYLES — `/stilar`
**Purpose:** Educational page about world pizza styles.

**Layout:**
- Hero: "Pizzustílar Heimsins" with globe emoji
- Large alternating cards (left-right layout):
  - Each card: Full-width, gradient header with emoji + style name
  - Content: Description, 3-stat grid (Temperature, Bake time, Hydration), characteristic bullet points
  - Styles: Neapolitan 🇮🇹, New York 🗽, Detroit 🏭, Roman 🏛️
- Each card should feel like a mini-article

---

## GENERAL NOTES
- Every page uses the same Navbar and subtle cream background
- Mobile responsive (stack to single column)
- Use real Icelandic text where shown, English subtitle underneath
- Pizza emoji 🍕 replaces traditional star ratings throughout
- Maintain the warm, artisanal "Modern Digital Kitchen" feel
