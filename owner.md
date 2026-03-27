# 🍕 Pizzadeig.is — Eigandaleiðbeiningar

> Skref-fyrir-skref leiðbeiningar til að setja Pizzadeig.is í loftið.

---

## 1. Lén og DNS

- [ ] Kaupa lénið **pizzadeig.is** hjá [ISNIC](https://isnic.is) eða [Hringdu](https://hringdu.is)
- [ ] Þegar Vercel er tengt (skref 3), bæta við DNS færslum:
  - `A` → `76.76.21.21` (Vercel IP)
  - `CNAME www` → `cname.vercel-dns.com`

---

## 2. Firebase uppsetning

### 2a. Búa til Firebase verkefni
- [ ] Fara á [console.firebase.google.com](https://console.firebase.google.com)
- [ ] Smella á **"Add project"** → nefna `pizzadeig-is`
- [ ] Slökkva á Google Analytics (nema þú viljir það)

### 2b. Virkja þjónustur
- [ ] **Authentication** → Sign-in methods → Virkja **Email/Password** og **Google**
- [ ] **Firestore Database** → Create database → Velja **europe-west1** (næst Íslandi)
- [ ] **Storage** → Get started → Velja sömu staðsetningu

### 2c. Bæta við Web App
- [ ] Í Project Settings → General → **Add app** → Web (</>) 
- [ ] Nefna `pizzadeig-web`
- [ ] Afrita config gildin (apiKey, authDomain, o.s.frv.)
- [ ] Setja þau í `.env.local` skrána þína:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pizzadeig-is.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pizzadeig-is
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pizzadeig-is.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 2d. Firestore öryggisreglur
- [ ] Fara í Firestore → Rules og setja inn:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leyfir lestur á öllum opinberum gögnum
    match /recipes/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /restaurants/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /reviews/{doc} { allow read: if true; allow create: if request.auth != null; }
    match /notifications/{doc} { allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id; }
    match /users/{userId} { allow read: if true; allow write: if request.auth != null && request.auth.uid == userId; }
  }
}
```

### 2e. Storage reglur
- [ ] Fara í Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## 3. Vercel uppsetning

### 3a. Tengja Git repo
- [ ] Fara á [vercel.com](https://vercel.com) og skrá þig inn
- [ ] **Add New Project** → Import frá GitHub/GitLab
- [ ] Velja `pizzadeig` repo
- [ ] Framework: **Next.js** (sjálfvirk greining)

### 3b. Environment Variables
- [ ] Í Vercel → Settings → Environment Variables, bæta við **öllu** úr `.env.local`:

| Variable | Gildi | Athugasemd |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | AIza... | Úr Firebase console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | pizzadeig-is.firebaseapp.com | |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | pizzadeig-is | |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | pizzadeig-is.firebasestorage.app | |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | 123... | |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | 1:123... | |
| `RESEND_API_KEY` | re_... | Úr Resend (sjá skref 4) |
| `RESEND_AUDIENCE_ID` | aud_... | Úr Resend |
| `RESEND_FROM_EMAIL` | Pizzadeig.is <noreply@pizzadeig.is> | |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | AIza... | Úr Google Cloud Console (skref 5) |

### 3c. Lén
- [ ] Vercel → Settings → Domains → Bæta við `pizzadeig.is` og `www.pizzadeig.is`
- [ ] Vercel gefur þér DNS leiðbeiningar → uppfæra hjá ISNIC (skref 1)

### 3d. Deploy
- [ ] Pusha á `main` branch → Vercel deployar sjálfkrafa
- [ ] Athuga build log ef villur koma upp

---

## 4. Resend (Fréttabréf)

- [ ] Skrá þig á [resend.com](https://resend.com)
- [ ] **API Keys** → Create API Key → afrita í `RESEND_API_KEY`
- [ ] **Audiences** → Create Audience → "Pizzadeig áskrifendur" → afrita ID í `RESEND_AUDIENCE_ID` 
- [ ] **Domains** → Bæta við `pizzadeig.is` → Fylgja DNS leiðbeiningum (bæta við MX/TXT records)
- [ ] Þetta gerir þér kleift að senda frá `noreply@pizzadeig.is`

---

## 5. Google Cloud Console (Maps + Leit)

Leitin er **innbyggð** og leitar í öllum uppskriftum og stöðum án ytri þjónustu.
Google Maps API er hins vegar nauðsynlegt fyrir kortasjá staða.

- [ ] Fara á [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Nota sama verkefni og Firebase (`pizzadeig-is`)
- [ ] **APIs & Services** → Enable APIs → Virkja:
  - **Maps JavaScript API**
  - **Places API** (til að sækja Google einkunnir)
  - **Geocoding API** (valfrjálst)
- [ ] **Credentials** → Create API Key → takmarka við Maps JS + Places
- [ ] Setja API key í Vercel: `NEXT_PUBLIC_GOOGLE_MAPS_KEY`

> 💡 Google Maps hefur $200/mán frítt inneign — meira en nóg fyrir byrjun.

---

## 6. Cloud Functions — Valfrjálst í byrjun

Ef þú vilt sjálfvirkar tilkynningar (nýjar umsagnir, followers, o.s.frv.):

```bash
# Í rót verkefnisins
npm install -g firebase-tools
firebase login
firebase init functions
# Velja TypeScript, pizzadeig-is verkefnið

# Afrita scaffold skrána
cp src/lib/cloudFunctions.scaffold.ts functions/src/index.ts

# Deploy
cd functions
npm install
firebase deploy --only functions
```

---

## 7. PWA ikon

- [ ] Búa til 192x192 og 512x512 PNG ikon (pizzu ikon eða lógó)
- [ ] Setja í `public/icons/icon-192.png` og `public/icons/icon-512.png`
- [ ] Uppfæra `public/manifest.json` ef þarf

---

## 8. Gögn

### Uppskriftir
- [x] **15 uppskriftir** þegar inni: 4 deig, 3 sósur, 1 ostaleiðbeiningar, 2 álegg, 5 pizzur
- [ ] Bæta við fleiri uppskriftum í Firestore (`recipes` collection)
- [ ] Nota admin síðuna (`/admin`) til að stjórna efni

### Pizzustaðir
- [x] **34 staðir** þegar í mock data — Rvk, Akureyri, Keflavík, Selfoss, Vestmannaeyjar, Húsavík, Ísafjörður, Egilsstaðir, Eskifjörður, Stykkishólmur, Hfj, Kóp, Gbr, Mos
- [ ] Seinna: Flytja í Firestore og leyfa eigendum að uppfæra
- [ ] Bæta við raunverulegum Google Place IDs og TripAdvisor tenglum

### Myndir
- [ ] Skipta út Unsplash myndum fyrir raunverulegar myndir
- [ ] Hlaða hero mynd (`public/images/hero_bg.png`) sem er þín eigin

---

## 9. Prófanir fyrir opnun

- [ ] Opna síðuna á vafra → Athuga forsíðu, uppskriftir, staði
- [ ] Prófa innskráningu (Email + Google)
- [ ] Prófa leit
- [ ] Prófa fréttabréfsskráningu
- [ ] Skoða á síma (responsive)
- [ ] Athuga 404 síðu (fara á `/ekkert`)
- [ ] Keyra `npm run build` til að athuga villur

---

## 10. Eftir opnun

- [ ] Setja upp Google Analytics eða Vercel Analytics
- [ ] Setja upp custom error monitoring (Sentry)
- [ ] Deila á samfélagsmiðlum!
- [ ] Bjóða vinum að prófa og gefa einkunnir

---

## Tæknigögn

| Þjónusta | Tilgangur | Kostnaður |
|---|---|---|
| **Vercel** | Hosting + API routes | Ókeypis (Hobby) |
| **Firebase Auth** | Innskráning | Ókeypis (< 50k notendur) |
| **Firestore** | Gagnagrunnur | Ókeypis (< 50k reads/dag) |
| **Firebase Storage** | Myndageymslur | Ókeypis (< 5GB) |
| **Resend** | Fréttabréf | Ókeypis (< 3k emails/mán) |
| **Google Maps** | Kort + staðsetning | Ókeypis ($200/mán inneign) |
| **Leit** | Innbyggð | Ókeypis (engin þriðji aðili) |
| **ISNIC** | .is lén | ~3.000 kr/ár |

> 💡 **Heildarkostnaður í byrjun: ~3.000 kr/ár** (bara lénið)
