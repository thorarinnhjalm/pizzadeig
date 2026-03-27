---
description: Proofread all Icelandic content on the website for grammar, spelling, and natural phrasing
---

# Icelandic Proofreader Workflow

This workflow scans all user-facing Icelandic text in the pizzadeig.is codebase and fixes grammar, spelling, and phrasing issues.

## Steps

1. **Find all pages with Icelandic content**
// turbo
```bash
grep -rl "isIs\|_is:" src/app/ src/components/ --include="*.tsx" --include="*.ts" | head -40
```

2. **For each file found, review all Icelandic strings** — look for:
   - Spelling errors (e.g. `vatnhlutfall` → `vatnshlutfall`)
   - Wrong declensions (e.g. `Napólísk` → `Napólítönsk`)
   - Unnatural phrasing that sounds like direct translation from English
   - Missing or incorrect special characters (ð, þ, æ, ö, etc.)
   - Inconsistent terminology across pages
   - Missing definite articles where Icelandic requires them
   - Gender agreement issues (hann/hún/það)

3. **Check the following key files specifically:**
   - `src/app/[locale]/page.tsx` (landing page)
   - `src/app/[locale]/stilar/page.tsx` (pizza styles)
   - `src/app/[locale]/uppskriftir/page.tsx` (recipes)
   - `src/app/[locale]/stadir/page.tsx` (restaurants)
   - `src/app/[locale]/um-okkur/page.tsx` (about)
   - `src/app/[locale]/skilmalar/page.tsx` (terms)
   - `src/app/[locale]/personuvernd/page.tsx` (privacy)
   - `src/app/[locale]/tengilidir/page.tsx` (contact)
   - `src/components/layout/Navbar.tsx` (navigation)
   - `src/components/layout/Footer.tsx` (footer)
   - `src/lib/mockData.ts` (restaurant/recipe descriptions)

4. **Fix all issues found** using the code editing tools. Group fixes by file.

5. **Common Icelandic pizza terminology to enforce consistently:**
   - Deig = Dough
   - Gerjun = Fermentation
   - Vatnshlutfall = Hydration
   - Mjöl = Flour
   - Súrdeig = Sourdough
   - Steinofn = Stone oven
   - Álegg = Toppings
   - Skorpa = Crust
   - Sósa = Sauce
   - Uppskrift = Recipe
   - Veitingastaður = Restaurant
   - Umsögn = Review
   - Einkunn = Rating

6. **After fixing, commit with message:** `fix: yfirfara íslensku á öllu efni`
