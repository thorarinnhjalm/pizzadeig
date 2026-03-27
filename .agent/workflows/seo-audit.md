---
description: Run an SEO audit and improve metadata, content, and structure across all pages
---

# SEO Analysis & Content Optimization Workflow

Audit all pages on pizzadeig.is for SEO best practices and optimize metadata, headings, content, and structure. Stay within the existing Next.js framework — no external tools or services.

## Steps

// turbo-all

1. **Inventory all pages**
```bash
find src/app/\[locale\] -name "page.tsx" | sort
```

2. **For each page, audit the following:**

### Metadata & Head Tags
- Does the page have a proper `<title>` or `metadata` export? (Next.js `generateMetadata` or `metadata` const)
- Is there a `description` meta tag? Is it compelling and under 160 characters?
- Are there Open Graph (`og:title`, `og:description`, `og:image`) tags?
- Is there a canonical URL?

### Content Structure
- Is there exactly one `<h1>` per page?
- Are headings hierarchical (`h1 > h2 > h3`, no skipping)?
- Are images using `alt` attributes with descriptive (Icelandic) text?
- Are links using descriptive anchor text (not "click here")?

### Semantic HTML
- Are `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>` used correctly?
- Do interactive elements have unique `id` attributes?
- Are lists using `<ul>`/`<ol>` where appropriate?

### Performance & Technical SEO
- Check `src/app/sitemap.ts` — are all public pages included?
- Check `src/app/robots.ts` — is it correctly configured?
- Check `src/app/manifest.ts` — PWA metadata
- Are images using Next.js `<Image>` component with proper `width`/`height`?
- Is there structured data (JSON-LD) for recipes and restaurants?

3. **Key pages to prioritize** (highest traffic potential):
   - `/` — Landing page (target: "pizza á Íslandi", "pizzadeig", "besta pizza í Reykjavík")
   - `/stadir` — Restaurant listings (target: "pizzustaðir á Íslandi", "besti pizzustaður")
   - `/uppskriftir` — Recipes (target: "pizza uppskrift", "pizzadeig uppskrift", "súrdeig pizza")
   - `/stilar` — Pizza styles (target: "pizzustílar", "napólítönsk pizza")
   - `/deigreiknivel` — Dough calculator (target: "pizzadeig reiknivél", "deig reiknivél")
   - `/topplisti` — Rankings (target: "besta pizza á Íslandi topplisti")

4. **Add/fix metadata** using Next.js `generateMetadata` in each page file. Template:
```tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    title: isIs ? 'Icelandic Title | Pizzadeig.is' : 'English Title | Pizzadeig.is',
    description: isIs ? 'Icelandic description under 160 chars' : 'English description under 160 chars',
    openGraph: {
      title: isIs ? 'OG Title' : 'OG Title EN',
      description: isIs ? 'OG desc' : 'OG desc EN',
      url: `https://www.pizzadeig.is/${locale}/path`,
      siteName: 'Pizzadeig.is',
      locale: isIs ? 'is_IS' : 'en_US',
      type: 'website',
    },
  };
}
```

5. **Update sitemap.ts** to include all public pages with proper `lastModified` dates and `priority` values.

6. **Add JSON-LD structured data** where applicable:
   - Recipe pages → `Recipe` schema
   - Restaurant pages → `Restaurant` schema
   - Landing page → `WebSite` schema

7. **Commit with message:** `seo: metadata, structured data, and content optimization`
