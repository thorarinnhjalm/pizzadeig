@AGENTS.md

# PIZZADEIG.IS - Ítarleg Kerfislýsing
Þetta skjal þjónar sem heildaryfirsýn (System Architecture & Blueprint) fyrir þróun á Pizzadeig.is, sérstaklega hannað til að gefa Claude / LLM allar nauðsynlegar upplýsingar.

---

## 1. Tæknistakkur & Grunnur
- **Framework:** Next.js 16+ (App Router, Turbopack)
- **UI & Stílar:** React 19, Tailwind CSS (Sérsmíðaðar CSS breytur í `globals.css`)
- **Tvítyngi (i18n):** `next-intl` (Hýsir `is` og `en`). Öll layout og pages eru vafin innan `[locale]`.
- **Gagnagrunnur & Auth:** Firebase (Firestore fyrir gögn, Auth fyrir innskráningu, Storage fyrir myndir).
- **Ikonar:** `lucide-react` ásamt sérsniðnum SVG skjölum (t.d. samfélagsmiðlar).

---

## 2. Veftré (Sitemap & Routing)
Kerfið byggir algjörlega á App Router og hefur eftirfarandi grunnslóðir innan `src/app/[locale]/`:

### Almenningur (Public Routes)
- `/` - Forsíða (Hero, nýjustu uppskriftir, flokkar).
- `/uppskriftir` - Safn allra uppskrifta.
- `/uppskriftir/[slug]` - Upplýsingasíða fyrir staka uppskrift (Ingredients, Steps, Reviews).
- `/stadir` - Kort/listi yfir veitingastaði.
- `/stadir/[slug]` - Upplýsingasíða um stakan veitingastað.
- `/flokkar/[type]` - Dynamískar síður fyrir flokka (t.d. `/flokkar/deig`, `/flokkar/sosur`).
- `/topplisti` - Vinsælustu dæmin dæmd út frá `rating_avg` / `likes_count`.
- `/notandi/[uid]` - Opinber prófíll notanda.
- `/um-okkur`, `/skilmalar`, `/personuvernd`, `/tengilidir` - Upplýsingasíður.

### Lokað / Admin (Protected Routes)
- `/admin` - Yfirlit/Mælaborð Super Admin.
- `/admin/uppskriftir` - Umsjón með innkominni uppskriftum (Approve/Reject/Edit).
- `/admin/stadir` - Umsjón með veitingastöðum.
- `/admin/notendur` - Umsjón meō notendum.
- `/admin/auglysingar` - Stjórnborð auglýsingaherferða (búa til, setja creatives, stýra status).

---

## 3. Gagnagrunnsskipulag (Firestore Schema)
Gögnin eru vistuð í Firestore collections. Mörg skjöl halda utan um bæði íslensku (`_is`) og ensku (`_en`) inni í sama skjali.

### `recipes` (Uppskriftir)
- `id` (string), `slug` (string)
- `title_is`, `title_en` (string)
- `description_is`, `description_en` (string)
- `type` (RecipeType: 'deig' | 'sosa' | 'ostur' | 'alegg' | 'tol' | 'heildar')
- `category` (string), `difficulty` ('audvelt' | 'midlungs' | 'erfitt')
- `prep_time_min`, `cook_time_min`, `rest_time_min`, `servings` (number)
- `ingredients_is`, `ingredients_en` (Array of `{ amount, unit, name }`)
- `steps_is`, `steps_en` (Array of strings)
- `tips_is`, `tips_en` (string, optional)
- `image_urls` (Array of URLs), `video_url` (string)
- `author_uid`, `author_name`, `author_avatar` (Denormalized auth data)
- `likes_count`, `rating_avg`, `rating_count` (Aggregated metrics)
- `tags` (Array of strings), `published` (boolean)
- `seo_...` (SEO yfirskriftir/lýsingar), `created_at`, `updated_at` (Timestamp)

### `restaurants` (Veitingastaðir)
- `id` (string), `slug` (string), `name` (string)
- `description_is`, `description_en` (string)
- `address`, `city`, `postal_code` (string), `location` (GeoPoint)
- `phone`, `website` (string)
- `opening_hours` (Map<string, string>)
- `price_level` (1-4)
- `features`, `tags`, `image_urls` (Array of strings)
- `owner_uid` (string), `is_verified` (boolean)
- `rating_avg`, `rating_count`, `likes_count` (metrics)
- *Subcollection eða vísun:* `menu_items` (fyrir matseðil)

### `users` (Notendur)
- `uid` (string - Firebase Auth ID)
- `display_name`, `email`, `avatar_url` (string)
- `bio_is`, `bio_en` (string)
- `role` ('user' | 'admin')
- `recipes_count`, `reviews_count`, `followers_count`, `following_count` (Aggregates)

### `reviews` (Umsagnir)
- `id`, `target_id`, `target_type` ('recipe' | 'restaurant')
- `user_uid`, `user_name`, `user_avatar`
- `rating` (number 1-5), `comment` (string)
- `is_verified_purchase` (boolean), `status` ('pending' | 'approved' | 'rejected')

### `ads` (Auglýsingar)
- `id` (string), `campaign_name` (string)
- `sponsor_name`, `sponsor_id` (string)
- `target_url` (string)
- `status` ('active' | 'paused' | 'ended' | 'scheduled')
- `creatives` (Record<AdFormat, string> – getur geymt path/url á mynd fyrir mismunandi formöt: `1018x360`, `310x400`, `300x250`, `1080x240`, `320x50`, `468x60`)
- `placements` (Array of strings - t.d. `home_mid`, `recipes_sidebar`, `global_footer`)
- `start_date`, `end_date` (Timestamp)
- `impressions`, `clicks` (number)

---

## 4. Hönnunarkerfi og Tilþrif (Design Tokens)
- Öll UI components eiga að nota Tailwind utility classes ásamt the custom variables.
- Notast er við **DM Serif Display** í gegnum klasann `.heading-display` (fyrir allar aðal fyrirsagnir) og **Source Sans 3** í gegnum almenna skrifaða texta.
- Litaþemu eru stýrð með CSS breytum: `var(--pizza-red)`, `var(--pizza-gold)`, `var(--pizza-green)`, `var(--bg-cream)`, `var(--text-dark)`, `var(--color-accent-green-light)`.
- Færa þarf hluti til baka með CSS frekar en hörðum gulum/grænum TW litum þar sem það á við.
- Micro-interactions innifelur klassana: `.card-hover` og `.skeleton` (loading state).

---

## 5. Auglýsingakóði (`AdSlot.tsx`)
- Notast er við `<AdSlot />` (klippt og skorið component) til að fella inn auglýsingar.
- Það tekur inn `placement` og `format` (t.d. `format="1080x240"`).
- Kóðinn finnur hvaða borðar eru `active` og í réttu formati og birtir af handahófi (eða fallback ef ekkert er).
- Inniheldur líka tvítyngda textamerkingu (`Ad` / `Auglýsing`) með CSS after element.
