# DESIGN.md — Pizzadeig.is

> Modern Digital Kitchen hönnunarkerfi. Ljóst, hlýtt og nútímalegt.

---

## 1. HUGMYNDAFRÆÐI: "THE ARTISANAL ALCHEMIST"

**Hlýlegt, mjölkennt heimiliseldhús þar sem handverkið er í fyrirrúmi.**

Hönnunin brúar bilið á milli hefðbundinnar ítalskrar pizzeríu og nútímalegs,
hreins stafræns viðmóts. Ljósir, hlýir litir sem minna á 00-mjöl og bakað brauð.

**Innblástur:** Nútíma eldhús í dagsbirtu. Cream-litað 00-mjöl. Hlýr steinn. Rauð tómatsósa.

---

## 2. LITAPÁLETTA

### Aðallitir
| Token | Hex | Notkun |
|---|---|---|
| `--color-brand` (San Marzano Red) | `#B91C1C` | Aðalhnappar, CTA, brand highlights |
| `--color-brand-light` | `#DC2626` | Hover á aðallitur |
| `--color-brand-dark` | `#7F1D1D` | Dimmur variant |
| `--color-gold` (Golden Crust) | `#D97706` | Einkunnir, verðlaun, accents |
| `--color-gold-light` | `#F59E0B` | Hover á gulli |

### Bakgrunnur (Ljóst — cream / 00 flour)
| Token | Hex | Notkun |
|---|---|---|
| `--color-bg-primary` | `#FDF9F2` | Aðal bakgrunnur |
| `--color-bg-secondary` (Warm Stone) | `#F1EDE6` | Kort, sections, modal |
| `--color-bg-tertiary` | `#E8E2D8` | Input reitir, nested svæði |
| `--color-bg-warm` | `#DDD5C8` | Hover á flötum |
| `--color-bg-chalk` | `#2A2520` | Töflusvæði (dökkt accent) |

### Texti (Espresso Dark)
| Token | Hex | Notkun |
|---|---|---|
| `--color-text-primary` | `#1C1C18` | Aðaltexti (dökkt á ljósu) |
| `--color-text-secondary` | `#57534E` | Lýsingar, metadata |
| `--color-text-tertiary` | `#8B7D6B` | Placeholder, muted |
| `--color-text-chalk` | `#E8E0D4` | Krítarskrift (á dökku) |

### Rammar (Stone)
| Token | Hex | Notkun |
|---|---|---|
| `--color-border` | `#D6D3D1` | Almennir rammar |
| `--color-border-light` | `#E7E5E4` | Fíngerðir rammar |
| `--color-border-gold` | `#D97706` | Gylltir accents |

---

## 3. LETURGERÐIR

| Font | CSS var | Notkun |
|---|---|---|
| **Playfair Display** | `--font-display` | h1, h2. Bold, -0.02em tracking. Elegant serif. |
| **Playfair Display Italic** | `--font-display` | h3. Weight 400, italic |
| **Caveat** | `--font-chalk` | Krítarskrift: flokkar, badges, accents |
| **Work Sans** | `--font-body` | Meginmál, labels, input. Hreint sans-serif. |

---

## 4. COMPONENT PRINCIPLES

- **Radius:** `2xl` (mjúk horn)
- **Elevation:** Lágmarks skuggar, tonal shifts, fíngerðir rammar (`border-stone-200`)
- **Interactions:** Mjúk hover-state (lift + shadow enhancement)
- **Buttons:** `rounded-xl`, subtle shadow, hover lift

---

## 5. SÍÐUR (18 stk)

### Opinberar síður
| Slóð | Nafn | Lykileiningar |
|---|---|---|
| `/` | Forsíða | Hero, RecipeCard×3, AdSlot×3, NewsletterForm |
| `/uppskriftir` | Uppskriftir | CategoryFilter, RecipeGrid, RecipeCard |
| `/uppskriftir/[slug]` | Uppskriftasíða | IngredientList, StepByStep, GuidedBake, Reviews |
| `/uppskriftir/ny` | Ný uppskrift | RecipeForm |
| `/stadir` | Pizzustaðir | RestaurantGrid, Map |
| `/stadir/[slug]` | Staðasíða | MenuSection, Reviews, Map, Triple-rating |
| `/stilar` | Pizzustílar | StyleCard×4 |
| `/hvad-a-eg` | Hvað á ég? | IngredientMatcher |
| `/deigreiknivel` | Deigreiknivél | DoughCalculator |
| `/vorur` | Búðin | ProductCard grid |
| `/topplisti` | Topplisti | — |
| `/notandi/[uid]` | Notandasíða | BadgeDisplay, RecipeGrid |

### Admin síður
`/admin`, `/admin/uppskriftir`, `/admin/stadir`, `/admin/auglysingar`, `/admin/notendur`

---

## 6. GAGNALÍKÖN

### Recipe
`id, title_is/en, slug, category (deig|sosur|ostur|alegg|pizzur), difficulty, ingredients[], steps[], rating_avg, likes_count`

### Restaurant
`id, name, slug, city, location, rating_google, rating_tripadvisor, rating_community, features[], tags[]`

### Review
`id, target_type, target_id, user_id, rating (1-5🍕), text`

---

## 7. EINKUNNASKERFI

- 🍕 **Pizzadeig.is** — heilar pizzur 1-5 (samfélag)
- 📍 **Google** — Google Places (lesið)
- 🦉 **TripAdvisor** — (lesið)

---

## 8. LEIÐBEININGAR FYRIR STITCH

1. **Ljóst theme** — `#FDF9F2` cream bakgrunnur
2. **Playfair Display** á fyrirsögnum
3. **Work Sans** á meginmáli
4. **Caveat** á chalk/accent labels
5. **Rautt (`#B91C1C`)** á CTA hnöppum
6. **Gull (`#D97706`)** á einkunnir og accents
7. **Mjúk horn** — `rounded-2xl` á kortum
8. **Heilar pizzur** í stað stjörnu í einkunnakerfinu
9. **Tvítyngt** — IS/EN
10. **Mobile first** — hamburger menu, stacked grids
