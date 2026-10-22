#!/usr/bin/env node
// Builds the site's menu data from a folder of verified menu JSON files.
//
//   node scripts/build-menu-data.mjs seo/matsedlar/<date>/json [--prev <file>] [--dry]
//
// Reads    <json-dir>/<restaurant-slug>.json   (one file per restaurant in mockRestaurants)
// Writes   src/lib/menuData.ts                 (mockMenuItems, generated - do not edit by hand)
//          src/lib/mockData.ts                 (only the menu_* source fields on each restaurant)
//          <json-dir>/../heimildaskra.csv      (source register, UTF-8 with BOM, ';' separated for Icelandic Excel)
//          seo/matsedlar/retired-ids.json      (ids that were dropped once and must never be reused)
//
// --prev <file>  previous menu items, used to keep item ids stable (reviews are keyed by id).
//                A .json file holding an array, or a .ts file with `export const mockMenuItems ... = [ ... ];`.
//                Default: src/lib/menuData.ts.
// --dry          print the report only, write nothing.
//
// Owner-supplied menus: a JSON with price_basis 'owner_supplied', optional `id` per item (pins the id), `register_note`.
// The output is deterministic: same JSON + same previous ids => byte-identical files.
// Prices come only from the JSON. The only text written here is the translations in
// scripts/menu-translations.mjs; a source phrase without a translation stops the build.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IS_EN, DESC_OVERRIDES } from './menu-translations.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MOCK_DATA = path.join(ROOT, 'src/lib/mockData.ts');
const MENU_DATA = path.join(ROOT, 'src/lib/menuData.ts');
const RETIRED = path.join(ROOT, 'seo/matsedlar/retired-ids.json');

// ─── Configuration that belongs to the data, not the logic ───────────────────

// id prefix per restaurant slug (ids look like `<prefix>-<n>`)
const PREFIX = {
  'flatey-pizza': 'fp', 'olifa-la-madre': 'ol', 'eldofninn': 'el', 'hornid': 'ho',
  'reykjavik-pizzeria': 'rp', 'bakabaka': 'bb', 'kaffi-laugalaekur': 'kl', 'rossopomodoro': 'rs',
  'napoli-pizza-rvk': 'np', 'glosteinn': 'gs', 'pizza-popolare': 'pp', 'antons-mamma-mia': 'am',
  'italiano-kopavogur': 'ik', 'pizzafjordur': 'pf', 'pizza-kofinn': 'pk', 'askur-pizzeria': 'ap',
  'stykkid-pizzeria': 'sp', 'ishusid-pizzeria-hofn': 'ip', 'flatey-pizza-selfoss': 'fs',
  'kaffi-krus': 'kk', 'pizza-67-vestmannaeyjar': 'p7', 'hamraborg-isafjordur': 'hb',
  'pizzan-hafnarfjordur': 'ph', 'flatey-pizza-gardabaer': 'fg', 'pizzasmidjan-akureyri': 'psa',
  'islenska-flatbakan': 'ifb', 'greifinn-akureyri': 'greif', 'castello-hafnarfjordur': 'cast',
};

// Branch name used to filter Flatey items that carry `only_at`
const BRANCH = { 'flatey-pizza': 'Grandi', 'flatey-pizza-gardabaer': 'Garðatorg', 'flatey-pizza-selfoss': 'Selfoss' };

// Items that are not on a fixed-price pizza menu. Keyed "<slug>|<source name>".
const EXCLUDE = {
  'greifinn-akureyri|Hvítlauks Diavolo': 'garlic bread base with toppings (not a pizza)',
};
const EXCLUDE_NAME_RE = /^(veldu|velja|veljið)\s+sjálf|build your own|hvítlauksbrauð|brauðstang|garlic bread|breadstick/i;

// Name corrections: source artifacts and the two names where the source itself gives both languages
const NAME_FIXES = {
  'kaffi-laugalaekur|LitlaGulaHænan': { name_is: 'Litla Gula Hænan' }, // missing spaces (PDF text artifact)
  'kaffi-laugalaekur|Barnabaka (children\'s menu, 12 and under)': { name_is: 'Barnabaka', name_en: 'Barnabaka' },
  'glosteinn|10"Glómagnaða': { name_is: '10" Glómagnaða' }, // missing space
  'reykjavik-pizzeria|35. Barnapizza / Pizza for children': { name_is: '35. Barnapizza', name_en: '35. Pizza for children' },
  'ishusid-pizzeria-hofn|Barnabaka | Kids pizza': { name_is: 'Barnabaka', name_en: 'Kids pizza' },
  'hornid|Hvítlaukspizza / Garlic pizza (Pizza con aglio e formaggio)': {
    name_is: 'Hvítlaukspizza (Pizza con aglio e formaggio)',
    name_en: 'Garlic pizza (Pizza con aglio e formaggio)',
  },
};

// Explicit id assignments, checked BEFORE name matching. Keyed "<slug>|<source name>" -> previous id.
// Use them when a source renamed an item (the JSON diff says it is the same pizza) or when name matching would
// move an id onto a different pizza. The build throws when a key no longer matches an item or the id is unknown,
// so remove entries that go stale.
const ID_OVERRIDES = {
  'kaffi-laugalaekur|Ostapizza': 'kl-4', // was "Ostabaka"
  'kaffi-laugalaekur|Chorizohálfmáni': 'kl-8', // was "Hálfmáni"
  'bakabaka|Scandinavia': 'bb-8', // was "Scandinava"
  'napoli-pizza-rvk|Ortolana / vegetarian': 'np-8', // was "Ortolana/Vegan"
  'napoli-pizza-rvk|Aglio e olio / Garlic': 'np-10', // was "Aglio e Olio"
  'eldofninn|S - SALAT PIZZA - FERSK': 'el-7', // was "S - Salat Pizza"
  'italiano-kopavogur|Margherita eða Hvítlauks pizza': 'ik-1', // old Margherita, now sold together with the garlic pizza
  // Popolare: "MARINARA 2.0" is the old "Napoli Popolare" (same ingredients and price), not the old "Marinara"
  'pizza-popolare|MARINARA': 'pp-7',
  'pizza-popolare|MARINARA 2.0': 'pp-6',
  'pizza-popolare|RAGÙ DI PARMIGIANA DI MELANZANE': 'pp-10', // was "Parmigiana"
  // Rossopomodoro: the old "Pizza del Piazzaiolo" text is today's "Pizzaiolo"; the old "Pizzaiolo" text is today's "Hottie"
  'rossopomodoro|Pizzaiolo': 'rs-9',
  'rossopomodoro|Hottie': 'rs-10',
};

// Restaurants whose previous English item names were entered by the owner: kept ids keep their old name_en.
const KEEP_OLD_NAME_EN = new Set(['askur-pizzeria', 'pizzafjordur']);

const LABEL_BY_TYPE = {
  own_site: 'vef staðarins',
  own_order_page: 'pöntunarsíðu staðarins',
  own_ordering_page: 'pöntunarsíðu staðarins',
  own_site_pdf: 'matseðli staðarins (PDF)',
  wolt: 'Wolt',
};

// ─── Small helpers ───────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const jsonDirArg = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--prev');
if (!jsonDirArg) {
  console.error('usage: node scripts/build-menu-data.mjs <json-dir> [--prev <file>] [--dry]');
  process.exit(1);
}
const JSON_DIR = path.resolve(jsonDirArg);
const OUT_DIR = path.dirname(JSON_DIR);
const DRY = flag('--dry');

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

function cleanText(s) {
  if (s == null) return '';
  return String(s)
    .normalize('NFC')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/[ ​]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
const stripEmoji = (s) => s.replace(/[\p{Extended_Pictographic}️‍]/gu, '').replace(/\s+/g, ' ').trim();
const cleanUrl = (u) => String(u || '').split(' (')[0].trim();
const safeHref = (u) => (/[^\x00-\x7F]/.test(u) ? encodeURI(u) : u);
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;

function matchKey(name) {
  let s = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  s = s.replace(/\([^)]*\)/g, ' ');
  s = s.replace(/\s+\d{1,2}\s*["”″]\s*$/, ''); // trailing inch size: Margherita 12"
  s = s.replace(/[.'’"“”″‘`,:!?]/g, '');
  s = s.replace(/[-–/&|]/g, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/^\d+\s+(?=[a-zþðæ])/, ''); // menu numbers: "1. Melbær", "4 Formaggi"
  s = s.replace(/^pizza\s+(?=\S)/, '');
  s = s.replace(/marg(?:h?e|a)rita/g, 'margherita');
  return s.replace(/\s+/g, '');
}

// ─── Translation (Icelandic -> English, phrase based) ────────────────────────

const SPLIT = /(\s*,\s*|\s*;\s*|\s+·\s+|\s+–\s+|\s+-\s+|(?<!\b(?:sv|gr|bl))\.\s+|\.$)/;
const normPhrase = (p) => p.toLowerCase().replace(/\s+/g, ' ').trim().replace(/\.$/, '');
function withCase(src, out) {
  const m = src.match(/\p{L}/u);
  if (!m || m[0] !== m[0].toUpperCase() || m[0] === m[0].toLowerCase()) return out;
  const i = out.search(/\p{L}/u);
  return i < 0 ? out : out.slice(0, i) + out[i].toUpperCase() + out.slice(i + 1);
}
function translatePhrase(src, missing) {
  const key = normPhrase(src);
  if (!key) return src;
  if (IS_EN[key] !== undefined) return withCase(src, IS_EN[key]);
  if (/\s(og|eða)\s/i.test(src)) {
    const parts = src.split(/\s+(og|eða)\s+/i);
    let out = '';
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 1) out += parts[i].toLowerCase() === 'og' ? ' and ' : ' or ';
      else out += translatePhrase(parts[i], missing);
    }
    return out;
  }
  missing.push(src);
  return src;
}
function translateIsToEn(text, missing) {
  return text
    .split(SPLIT)
    .map((tok, i) => (i % 2 === 1 ? (tok.includes(',') ? ', ' : tok) : translatePhrase(tok, missing)))
    .join('');
}

// ─── Read restaurants from mockData.ts ───────────────────────────────────────

const mockText = fs.readFileSync(MOCK_DATA, 'utf8');
const restaurants = [];
{
  const re = /\n    id: '([^']+)',\n    name: '((?:[^'\\]|\\.)*)',\n    slug: '([^']+)',/g;
  const start = mockText.indexOf('export const mockRestaurants');
  const end = mockText.indexOf('\n];', start);
  const region = mockText.slice(start, end);
  let m;
  while ((m = re.exec(region))) restaurants.push({ id: m[1], name: m[2].replace(/\\'/g, "'"), slug: m[3] });
}
if (restaurants.length === 0) throw new Error('no restaurants found in mockData.ts');
{
  const slugs = new Set(restaurants.map((r) => r.slug));
  for (const f of fs.readdirSync(JSON_DIR).filter((n) => n.endsWith('.json'))) {
    if (!slugs.has(f.slice(0, -5))) throw new Error(`${f}: no restaurant with that slug in mockData.ts`);
  }
  for (const r of restaurants) {
    if (!fs.existsSync(path.join(JSON_DIR, `${r.slug}.json`))) throw new Error(`missing ${r.slug}.json in ${JSON_DIR}`);
  }
}

// ─── Previous ids ────────────────────────────────────────────────────────────

function loadPrev(file) {
  const text = fs.readFileSync(file, 'utf8');
  if (file.endsWith('.json')) return JSON.parse(text);
  const s = text.indexOf('export const mockMenuItems');
  const open = text.indexOf('= [', s) + 3;
  const close = text.indexOf('\n];', open);
  return new Function(`return [${text.slice(open, close)}\n]`)();
}
const prevFile = opt('--prev') ? path.resolve(opt('--prev')) : MENU_DATA;
const prevItems = fs.existsSync(prevFile) ? loadPrev(prevFile) : [];
const retiredIds = fs.existsSync(RETIRED) ? readJson(RETIRED).retired : [];

const usedPrev = new Set();
const claimedIds = new Set(); // every id handed out in this run
const usedOverrides = new Set();
const numbers = {}; // prefix -> highest number ever used
function noteId(id) {
  const m = /^(.+)-(\d+)$/.exec(id);
  if (m) numbers[m[1]] = Math.max(numbers[m[1]] || 0, Number(m[2]));
}
[...prevItems.map((i) => i.id), ...retiredIds].forEach(noteId);
const nextId = (prefix) => `${prefix}-${(numbers[prefix] = (numbers[prefix] || 0) + 1)}`;

// ─── Build items ─────────────────────────────────────────────────────────────

const report = { missing: [], translated: {}, excluded: [], matched: {}, kept: {}, fresh: {}, noteWarnings: [] };
const out = []; // final MenuItem objects with register info attached under `_reg`
const registerRows = [];
const restaurantMeta = {};

function sizeLabelsFor(file, it) {
  const keys = Object.entries(it.sizes_all || {});
  const keyOf = (v) => (keys.find(([, val]) => val === v) || [])[0];
  if (it.price_large != null) {
    const small = file.size_small_label || keyOf(it.price);
    const large = file.size_large_label || keyOf(it.price_large);
    if (!small || !large) report.noteWarnings.push(`${file.slug}|${it.name}: two sizes but no labels`);
    return { small, large };
  }
  let label = '';
  if (keys.length === 1) label = keys[0][0];
  else if (keys.length > 1) label = keyOf(it.price) || '';
  return { small: label, large: undefined };
}

function categoryOf(it, name) {
  if (it.kids === true || /barna|bambini|\bkids\b|krútt/i.test(name)) return 'Barnapizzur';
  if (it.dessert === true || /nutella pizza/i.test(name) || /eftirr[ée]tt/i.test(it.desc_is || '')) return 'Eftirréttapizzur';
  return 'Pizzur';
}

for (const r of restaurants) {
  const file = readJson(path.join(JSON_DIR, `${r.slug}.json`));
  if (file.slug !== r.slug) throw new Error(`${r.slug}.json has slug "${file.slug}"`);
  const baseFile = file.same_menu_as ? readJson(path.join(JSON_DIR, `${file.same_menu_as}.json`)) : file;
  const branch = BRANCH[r.slug];
  const sources = (file.sources || []).map((s) => ({ ...s, url: cleanUrl(s.url) }));
  const prefix = PREFIX[r.slug];
  if (!prefix) throw new Error(`no id prefix for ${r.slug}`);

  // restaurant-level source info
  const preferWolt = file.price_basis === 'delivery_platform' || file.price_basis === 'mixed';
  const main = (preferWolt && sources.find((s) => s.type === 'wolt')) || sources[0];
  if (file.price_basis === 'owner_supplied') {
    // menu entered by the site owner: no web source, so no link
    restaurantMeta[r.slug] = { label: 'upplýsingar skráðar af Pizzadeig.is', verified: file.fetched, basis: 'owner_supplied' };
  } else if (file.price_basis === 'none' || !main) {
    restaurantMeta[r.slug] = { verified: file.fetched, basis: 'none' };
  } else {
    const isPdf = /\.pdf($|\?)/i.test(main.url);
    restaurantMeta[r.slug] = {
      url: safeHref(main.url),
      label: isPdf ? LABEL_BY_TYPE.own_site_pdf : LABEL_BY_TYPE[main.type] || 'vef staðarins',
      verified: file.fetched,
      basis: file.price_basis,
    };
  }

  // select items
  const selected = [];
  for (const it of baseFile.items || []) {
    const raw = cleanText(it.name);
    const exKey = `${r.slug}|${raw}`;
    if (it.seasonal === true) { report.excluded.push(`${r.slug}: ${raw} (seasonal)`); continue; }
    if (Array.isArray(it.only_at) && branch && !it.only_at.includes(branch)) {
      report.excluded.push(`${r.slug}: ${raw} (only at ${it.only_at.join('/')})`); continue;
    }
    if (EXCLUDE[exKey]) { report.excluded.push(`${r.slug}: ${raw} (${EXCLUDE[exKey]})`); continue; }
    if (EXCLUDE_NAME_RE.test(raw)) { report.excluded.push(`${r.slug}: ${raw} (build-your-own / bread)`); continue; }
    selected.push(it);
  }

  const prevHere = prevItems.filter((p) => p.restaurant_id === r.id);
  const built = [];
  for (const it of selected) {
    const raw = cleanText(it.name);
    const keyRaw = `${r.slug}|${raw}`;
    const fix = NAME_FIXES[keyRaw] || {};
    const name_is = fix.name_is || stripEmoji(raw);
    const name_en = fix.name_en || cleanText(it.name_en) || name_is;

    // descriptions
    const ov = DESC_OVERRIDES[keyRaw] || {};
    let is = cleanText(it.desc_is_printed || it.desc_is);
    let en = cleanText(it.desc_en);
    const notes = [];
    if (it.desc_is_printed) notes.push('IS-lýsing úr prentuðum matseðli');
    if (ov.desc_is) { is = ov.desc_is; notes.push('IS-lýsing þýdd úr ensku'); }
    if (ov.desc_en) { en = ov.desc_en; if (!ov.desc_is && !cleanText(it.desc_en)) notes.push('EN-lýsing þýdd úr íslensku'); }
    else if (is && !en) {
      const miss = [];
      en = translateIsToEn(is, miss);
      miss.forEach((p) => report.missing.push(`${r.slug} | ${raw} | ${p}`));
      notes.push('EN-lýsing þýdd úr íslensku');
    }
    if (!is && en) report.missing.push(`${r.slug} | ${raw} | (no Icelandic text, add DESC_OVERRIDES)`);
    const translatedNow = notes.some((n) => n.includes('þýdd'));
    if (translatedNow) (report.translated[r.slug] ||= []).push({ name: name_is, is, en, dir: ov.desc_is ? 'en>is' : 'is>en' });

    const { small, large } = sizeLabelsFor(baseFile, it);
    built.push({ it, raw, name_is, name_en, is, en, notes, small, large, category: categoryOf(it, name_is) });
  }

  // dominant label of the "price" slot, so only items that differ from the rest get a single-price label
  const counts = {};
  built.forEach((b) => { counts[b.small || ''] = (counts[b.small || ''] || 0) + 1; });
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? '';

  // order: source order, kids and dessert pizzas last
  const rank = { Pizzur: 0, Barnapizzur: 1, Eftirréttapizzur: 2 };
  const ordered = built.map((b, i) => ({ b, i })).sort((x, y) => rank[x.b.category] - rank[y.b.category] || x.i - y.i).map((x) => x.b);

  // ids
  const seenKeys = new Map();
  for (const b of ordered) {
    const k = matchKey(b.name_is);
    if (seenKeys.has(k)) throw new Error(`${r.slug}: "${b.name_is}" and "${seenKeys.get(k)}" share the match key "${k}"; add an ID_OVERRIDES entry or fix matchKey`);
    seenKeys.set(k, b.name_is);
  }
  // ids that are assigned explicitly are reserved so name matching cannot take them
  const reserved = new Set();
  for (const b of ordered) {
    const ovKey = `${r.slug}|${b.raw}`;
    if (ID_OVERRIDES[ovKey]) { b.overrideId = ID_OVERRIDES[ovKey]; usedOverrides.add(ovKey); reserved.add(b.overrideId); }
    if (b.it.id) reserved.add(b.it.id);
  }
  const claim = (id) => {
    if (claimedIds.has(id)) throw new Error(`${r.slug}: id ${id} is handed out twice`);
    claimedIds.add(id);
  };
  ordered.forEach((b, idx) => {
    let prev;
    if (b.it.id) { // id pinned in the JSON (owner-supplied menus)
      if (retiredIds.includes(b.it.id)) throw new Error(`${r.slug}: pinned id ${b.it.id} is in retired-ids.json`);
      prev = prevHere.find((p) => p.id === b.it.id);
      b.id = b.it.id;
    } else if (b.overrideId) {
      prev = prevHere.find((p) => p.id === b.overrideId);
      if (!prev) throw new Error(`${r.slug}|${b.raw}: ID_OVERRIDES id ${b.overrideId} is not in the previous data`);
      b.id = prev.id;
    } else {
      const key = matchKey(b.name_is);
      prev = prevHere.find((p) => !usedPrev.has(p.id) && !reserved.has(p.id) && matchKey(p.name_is) === key);
      b.id = prev ? prev.id : nextId(prefix);
    }
    claim(b.id);
    noteId(b.id);
    if (prev) {
      usedPrev.add(prev.id);
      (report.kept[r.slug] ||= []).push(prev.id);
      if (KEEP_OLD_NAME_EN.has(r.slug) && prev.name_en && prev.name_en !== b.name_en) { b.name_en = prev.name_en; b.keptNameEn = true; }
    } else (report.fresh[r.slug] ||= []).push(b.id);
    b.sort_order = idx + 1;
  });
  const dropped = prevHere.filter((p) => !usedPrev.has(p.id)).map((p) => p.id);
  report.matched[r.slug] = { old: prevHere.length, dropped };

  for (const b of ordered) {
    const { it } = b;
    const item = { id: b.id, restaurant_id: r.id, name_is: b.name_is, name_en: b.name_en };
    if (b.is) item.description_is = b.is;
    if (b.en) item.description_en = b.en;
    item.price = it.price;
    if (it.price_large != null) {
      item.price_large = it.price_large;
      item.size_small_label = b.small;
      item.size_large_label = b.large;
    } else if (b.small && b.small !== dominant) {
      item.size_small_label = b.small;
    }
    item.category = b.category;
    item.sort_order = b.sort_order;
    out.push(item);

    // register row
    const owner = file.price_basis === 'owner_supplied';
    const srcUrl = owner ? '' : /^https?:\/\//.test(cleanUrl(it.source_url)) ? cleanUrl(it.source_url) : (sources[0] || {}).url || '';
    const srcType = owner ? 'owner_supplied' : (sources.find((s) => s.url === srcUrl) || sources[0] || {}).type || '';
    const notes = [...b.notes];
    if (it.note) notes.unshift(cleanText(it.note));
    if (it.promo_price != null) notes.push(`tilboðsverð á vef ${it.promo_price} kr., skráð er almennt verð`);
    if (it.price_promo_shown != null) notes.push(`tilboðsverð á vef ${it.price_promo_shown} kr., skráð er almennt verð`);
    if (Array.isArray(it.only_at)) notes.push(`aðeins í boði: ${it.only_at.join(', ')}`);
    if (it.printed_menu_10in_12in) notes.push(`prentaður matseðill (ekki notaður): ${Object.entries(it.printed_menu_10in_12in).map(([k, v]) => `${k} ${v}`).join('; ')}`);
    if (it.sizes_discounted_50pct_shown) notes.push(`50% afsláttarverð á vef (ekki notað): ${Object.entries(it.sizes_discounted_50pct_shown).map(([k, v]) => `${k} ${v}`).join('; ')}`);
    if (b.category !== 'Pizzur') notes.push(`flokkur: ${b.category}`);
    if (b.keptNameEn) notes.push(`enskt heiti úr fyrri skráningu: ${b.name_en}`);
    if (b.name_is !== b.raw && !NAME_FIXES[`${r.slug}|${b.raw}`]?.name_en) notes.push(`heiti í heimild: ${b.raw}`);
    if (file.register_note) notes.push(file.register_note);
    if (baseFile !== file) notes.push(`sami matseðill og ${baseFile.slug}`);
    registerRows.push([
      r.name, r.slug, b.name_is, it.price, it.price_large ?? '',
      Object.entries(it.sizes_all || {}).map(([k, v]) => `${k}: ${v}`).join('; '),
      srcUrl, srcType, it.price_basis_item || (file.price_basis === 'mixed' ? 'in_house' : file.price_basis), file.fetched, notes.join(' | '),
    ]);
  }
  if (!(baseFile.items || []).length) {
    registerRows.push([r.name, r.slug, '', '', '', '', '', '', file.price_basis, file.fetched, cleanText(file.not_found)]);
  }
}

for (const k of Object.keys(ID_OVERRIDES)) {
  if (!usedOverrides.has(k)) throw new Error(`ID_OVERRIDES entry "${k}" matches no item in the JSON; remove it`);
}
{
  const all = out.map((i) => i.id);
  const dup = all.filter((id, i) => all.indexOf(id) !== i);
  if (dup.length) throw new Error(`duplicate ids in output: ${[...new Set(dup)].join(', ')}`);
}

if (report.missing.length) {
  console.error('Untranslated source phrases (add them to scripts/menu-translations.mjs):');
  report.missing.forEach((m) => console.error('  ' + m));
  process.exit(2);
}
if (report.noteWarnings.length) report.noteWarnings.forEach((w) => console.warn('warning: ' + w));

// ─── Write menuData.ts ───────────────────────────────────────────────────────

const fields = ['id', 'restaurant_id', 'name_is', 'name_en', 'description_is', 'description_en', 'price', 'price_large', 'size_small_label', 'size_large_label', 'category', 'sort_order'];
const line = (item) => '  { ' + fields.filter((f) => item[f] !== undefined).map((f) => `${f}: ${typeof item[f] === 'number' ? item[f] : q(item[f])}`).join(', ') + ' },';
let ts = `// GENERATED by scripts/build-menu-data.mjs from seo/matsedlar/*/json - do not edit by hand.\n`;
ts += `// Re-run the script after updating the JSON files; ids of unchanged items are kept so reviews stay attached.\n`;
ts += `import { MenuItem } from '@/types/restaurant';\n\nexport const mockMenuItems: MenuItem[] = [\n`;
for (const r of restaurants) {
  const items = out.filter((i) => i.restaurant_id === r.id);
  const meta = restaurantMeta[r.slug];
  ts += `  // ─── ${r.name} (${meta.verified}${items.length ? '' : ', enginn matseðill aðgengilegur'}) ───\n`;
  items.forEach((i) => { ts += line(i) + '\n'; });
}
ts += `];\n`;

// ─── Update menu_* fields on each restaurant in mockData.ts ──────────────────

function updateRestaurants(text) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith('export const mockRestaurants'));
  for (const r of restaurants) {
    const slugAt = lines.findIndex((l, i) => i > start && l === `    slug: '${r.slug}',`);
    if (slugAt < 0) throw new Error(`slug line not found for ${r.slug}`);
    let end = -1;
    for (let i = slugAt; i < Math.min(lines.length, slugAt + 80); i++) if (lines[i] === '  },') { end = i; break; }
    let begin = -1;
    for (let i = slugAt; i > Math.max(0, slugAt - 80); i--) if (lines[i] === '  {') { begin = i; break; }
    if (end < 0 || begin < 0) throw new Error(`could not find the restaurant block for ${r.slug} in mockData.ts`);
    // drop old menu_* lines
    for (let i = end - 1; i > begin; i--) if (/^    menu_(source_url|source_label|verified_at|price_basis):/.test(lines[i])) { lines.splice(i, 1); end--; }
    const at = lines.findIndex((l, i) => i > slugAt && i < end && /^    price_level:/.test(l));
    if (at < 0) throw new Error(`price_level line not found for ${r.slug}`);
    const m = restaurantMeta[r.slug];
    const add = [];
    if (m.url) add.push(`    menu_source_url: ${q(m.url)},`);
    if (m.label) add.push(`    menu_source_label: ${q(m.label)},`);
    add.push(`    menu_verified_at: ${q(m.verified)},`);
    add.push(`    menu_price_basis: ${q(m.basis)},`);
    lines.splice(at + 1, 0, ...add);
  }
  return lines.join('\n');
}
const newMock = updateRestaurants(mockText);

// ─── CSV register ────────────────────────────────────────────────────────────

const csvHeader = ['stadur', 'slug', 'rettur', 'verd', 'verd_stor', 'staerdir', 'heimild_url', 'heimild_tegund', 'verd_grunnur', 'sott_dags', 'athugasemd'];
const csvCell = (v) => { const s = String(v ?? ''); return /[;",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const csv = '﻿' + [csvHeader, ...registerRows].map((row) => row.map(csvCell).join(';')).join('\r\n') + '\r\n';

// ─── Retired ids ─────────────────────────────────────────────────────────────

const liveIds = new Set(out.map((i) => i.id));
const retired = [...new Set([...retiredIds, ...prevItems.map((i) => i.id)])].filter((id) => !liveIds.has(id)).sort();

// ─── Report + write ──────────────────────────────────────────────────────────

console.log(`restaurants: ${restaurants.length}, items: ${out.length}, register rows: ${registerRows.length}`);
for (const r of restaurants) {
  const m = report.matched[r.slug];
  const n = out.filter((i) => i.restaurant_id === r.id).length;
  console.log(`${r.slug.padEnd(26)} old ${String(m.old).padStart(2)} -> new ${String(n).padStart(2)} | kept ${String((report.kept[r.slug] || []).length).padStart(2)}, fresh ${String((report.fresh[r.slug] || []).length).padStart(2)}, dropped [${m.dropped.join(' ')}] | translated ${(report.translated[r.slug] || []).length}`);
}
console.log('excluded:\n  ' + report.excluded.join('\n  '));

if (DRY) { console.log('(dry run, nothing written)'); process.exit(0); }
fs.writeFileSync(MENU_DATA, ts);
fs.writeFileSync(MOCK_DATA, newMock);
fs.writeFileSync(path.join(OUT_DIR, 'heimildaskra.csv'), csv);
fs.mkdirSync(path.dirname(RETIRED), { recursive: true });
fs.writeFileSync(RETIRED, JSON.stringify({ note: 'Item ids that were dropped from the menus. Never reuse them.', retired }, null, 2) + '\n');
fs.writeFileSync(path.join(OUT_DIR, 'thydingar.json'), JSON.stringify(report.translated, null, 2) + '\n');
console.log('written: src/lib/menuData.ts, src/lib/mockData.ts (menu_* fields), heimildaskra.csv, retired-ids.json, thydingar.json');
