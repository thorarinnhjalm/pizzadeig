'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

const ACTIVITY_FEED = [
  {
    user: 'Gunnar Helga', action: 'Gaf 🍕🍕🍕🍕🍕',
    recipe: 'Elda-Morgun Pizza', time_is: 'fyrir 15 mínútum', time_en: '15 minutes ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy_suCK_Tb2q3-Z-0XiusCfVzxZT469XjmQA2QJrEmiJILQMgURIGFfhyal8MYUAwx379TUhvRJeloq2-9KnN_mCGBUu-gVzT-81BVCf0-XCeA3fkt22lPXNoaomQRQkrcpdi0yXjUztkQ9wvMAxoLeRKdJukbKCboj1twD7VCdl9XrHy0Yc5sHpCVy7N4G4CDoBGxIi3TpR5tcLK5qhYDsbx6QVtASI3LsXsLHQjo7kQsc-PBOcchun1V-5NxZYqejgPKoGoxt3w',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2IbeeTK9UPfvBIcExtef5bHY2I-aHoHocOODs2kFrNsJdFGupwUVBphHF59NJzlBxGUOrLVSr8VvwWRn4pfImfqGwmmUvky7PUl3IJRn5cC3oZtSxIdNSyMsKTWEw6p-1VXzvlUp1Azd0ftIavl6RCHUA9ntJQC-jZaHTb_Qc0dsUN9kao4dE0WqOQ90L3hzk-iXPVJRxkVFJM2RoT6ZF8krtelaptfxENCnj_GuaftnTgK4VeqDSXs4YjGHX7JefIv8Hf3OQRuE',
  },
  {
    user: 'Birta Sól', action: 'Gaf 🍕🍕🍕🍕',
    recipe: 'Súrdeigs Sæla', time_is: 'fyrir 2 klst', time_en: '2 hours ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq-ejf9MHGAJ-SG0m8wvd16KzIy7gprzvWOi6w3EKZg5zWxp57N7NMLEUrpIGJZ6cdmSvEYBtM9udsgdoNG32WcfomZJW1pyufx7PwDj0EifqYLY1-g1CZcDwkOgjSB-4CUtomJcbWfVrf26nIEpz6L_VsA_1hIGnhbqyDSlS5M4RJqp6x9VPqf-OarSBvckb_JSzwfKMgQPWa_RpaLZF-WkWhjF4QrRWhYAuRRqYAb37E514U3WvNGgHMHtN3x199bzS62J2sVMY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh5Pj7V67xc9JIvREsNPjovkifxECY239X6hj5f4WpHrZP04wYsYdBBG3p2XZHklHkbIJrTU1wKnByR5cZWLQuAoigO7Efj9fJpfBKOOMnUgP8nMOfFW6Qc7n70D_e-pCVvMCFoYBb2WBaV05cBwktNC03MBCyL0Ck46i5MGtmajJQAwFev7goKIThi_9fQYs3yVVyVVY-EPVRCA53Oq6iC0ejh8rOb4ryrYDnHLIUJkZt67NaS899nZyi0gWIlnCQYlVWpqU5bTQ',
  },
  {
    user: 'Arnar Freyr', action: 'Gaf 🍕🍕🍕🍕🍕',
    recipe: 'Elda-Sterk Pepperoni', time_is: 'fyrir 5 klst', time_en: '5 hours ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbJXbX9Y7cTd__lC59DA8l-4BexT3rauYc2fJQ1uu2QDw5BRDuzyqOR53D6fLsJ7aPW10AsA7LGzaV61tCSFiMTTvUYKZxbOjio-7z0Aak7MFEBLUJ8kpZIVRGeGw41kJL1nyJI5nDt5aw2RGMTrSYM8NxgoYQUlPHMmVTEIZ6ZP4egXXUPV9zbZcqGpicADup66vj4Qzn3tN1j2jpgnewLpkWbRoynFmVsEQEEYaPrrApKFUlJ-I99s-qMPDvWRDBPPWXgYNbG2Q',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALdvEdg7QOAeUDGYRTPO0G6cmffKjnTxengqnAl5jMYNImF4YlBwsa4km5qghtIbV95JIiUjVpbio2muzmqLnOGN_r1joq75gM9k3tUNtDEF8Rr_E4mipDQpEFUqSbq4Hbo8MssUzK5OjeOzqFVB_-Mh4ZDfQK2S9rJ5Fm3X6aBcLDhFh6gQrU5mJhtWE_MHm2EdqYVNv9otr5gkplh80v97mJKZNmehsfPyV4B9NC_pVXMP_9lIwU48tYeKDeIijksicI2Gt9VIM',
  },
  {
    user: 'Saga Jóns', action: 'Gaf 🍕🍕🍕🍕🍕',
    recipe: 'Sveppa-Lúxus', time_is: 'fyrir 8 klst', time_en: '8 hours ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq_i1ArVddbTU20FVd0delLaVu6zCefmBWgihhvwc6Kwuvrkdq2F-Spo2E6Miq3lvae0aC1K3PiHX4YrOZGHitpZ5i2lzgdpktYVYMNgfZNHulVtpMKduOm51zn8b3Pjew6bvr-MjAVyjk4c-8ozICOeOqEOtZSDfpdbXYn7Z7A7UlwyNbD0-2KVQa5FwGjTxZjuremJC4VMZkNY32Z8-WiFhFF7ERKXtnroj-tdcJosTT26RXYB2QbdsFEkgCxIeG9o4ExmmT0ao',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSQakzG2rzzCOVhxHG_BeTPvyl67PC13U2pnbCuizVxmQIyavICe-2ED2OQUrTEICi2pyTiR3hQryepxIsYOtEhbGVFpJYN1zCtX-KWn3_EpZ6fKZ9_XEwcEjUqSngwgPxj_Af-XnoJwM3XBfj6PuhlNdunmd3S8Qb8wLBwbonZ_ubBG1_mNGrC0eacmg9AExwbAjvQdeIiasukI2mhyZD8RjDZkvBTdiaAfnqSl2PG1vYO-rmpSJtu8GxAb17DjByrC3dugMQubU',
  },
];

const TOP_CONTRIBUTORS = [
  { name: 'Einar Örn', count: 142, badge: 'Meistari', badgeColor: 'bg-(--color-brand) text-white', borderColor: 'border-(--color-brand)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpZTz8wHBetdsHOk7sxRsalT81jNkxm7xJTVnVwlTvS6-2qc8oOzQ-YU1V9ysrkH5qwDa_gRDEDxw7r-Ozyq1Cq9V34JGkZVO8cfn6JD9K-dOXJpygJOqFauK-ualP6DD4B6lKwUigxGmpfUP5PPVPr5Hw98mhbJyy-3NnBg5jPubC60z22COnaU6ynvyJUApojCTEEEJgG0rAw_Ul6KDaIqgBM_LykoN-P3QL6VYumtbOLKIMYjwyW3J9pxQWsc40YzOthi5jvqM' },
  { name: 'Katrín Lilja', count: 89, badge: 'Ofnþegn', badgeColor: 'bg-(--color-gold) text-white', borderColor: 'border-(--color-gold)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVijJGLp1IMUGEcAuWFd6NhsSzeb6NQYh3aeeVTV3WXpGrcNP5-5Sf07-eura9z1YQuycvSLAPvAqzqekbKgjYw-QdR5gGUqdqwkaZ0MJCxiCvjiuRdcYt_GTIy1V4tOhTV2cvvinepZJR3okpVoFlCnlnAFs71eNU7f3p3GFVgFv6Pf1kFBtadR5d6sUv82xYWWdirzV-aKQDxuTHADvSBxZSeYDl0KujluNqsGvWe_FhzRH-wNFc7FoxR8BSA0sbc17oWKnAwK0' },
  { name: 'Stefán Karl', count: 12, badge: 'Nýliði', badgeColor: 'bg-stone-500 text-white', borderColor: 'border-stone-400',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASGsC4yJxSzRVLcRhi8qI_8v9FLRgy9iNVaLfy7_y1dU9VsxgPtibopupXH9CWVFiB-EeOg16T0cOCeubMqu9FYEiWf77d0Rrtj4Os7d8L5cKqcCrw-HCmAFZUaaIbWPjdrZYY97XJkquwQi1Oj3jTK2ocNXf0tPWBTJ5FulsOQGIk7yHx2MkhExBGQXa8kGkg5YMsqFzaRFxq5VEtVbVAYFd4xgevHu6q2xQRhfuYcziBoMx1fyWooivrSuQTbKreRwagwBsm0bY' },
  { name: 'Guðrún María', count: 156, badge: 'Meistari', badgeColor: 'bg-(--color-brand) text-white', borderColor: 'border-(--color-brand)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0AxgPvc4KXM4c7eWxAEWlwttfmU7qiezClRnVp8NUq1MIey7iZvNN4MvN2kqf1ylhSTr4a3_DDyfIspWMeLwi3wCGdu9O1TChXfNKQz3XTMt5ykPC7Mc7YwmVr-zJ_eKNP68MndCTPzBeqsIVzoDH_AoGCV5MmtGsR0Lq_sQHHphJeLgXCX2-hkJ2c6oqfnpxdtH2imzkhwMiIu0U0vUrboU9wXN3Pk_eYJ81JIUrEppEw0p_YqFfCJK0z3eYphI3KYSG-eN5ow8' },
  { name: 'Páll Viðar', count: 64, badge: 'Ofnþegn', badgeColor: 'bg-(--color-gold) text-white', borderColor: 'border-(--color-gold)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT6a9AShKiIobYl-WhSarpNw2E6Wjci5jxC-Dg5-LscIE7MWoy0GYzHHKGnweXOh5ESS-ue_mYCW2dPWRw2FuUqdGvMVgLDBMc74MBGDc68ywgbSEoxzt4SyOj6KB404QKw2Bbvi45QK9n9YIADgzFdcBg_PhX7ORL0vMq97INfPHvJkK-rvnyeJfAlSmqbIFDkMgH73gnA_yqh37nSLszA--08hReWXhtgPo41RGozDsbsfnyA6NNqoN7iI9GqkCIEGBkOYWT_7U' },
];

export default function SamfelagPage() {
  const locale = useLocale() as 'is' | 'en';
  const isIs = locale === 'is';

  const tools = [
    { icon: '📦', title: isIs ? 'Hvað á ég?' : "What's in my cupboard?", desc: isIs ? 'Finndu uppskriftir miðað við hráefnin í skápnum.' : 'Find recipes based on ingredients you have.', href: '/hvad-a-eg', color: 'bg-amber-50 text-amber-700' },
    { icon: '🧮', title: isIs ? 'Deigreiknivél' : 'Dough Calculator', desc: isIs ? 'Fullkomnaðu prósenturnar í deiginu þínu.' : 'Perfect the ratios in your dough.', href: '/deigreiknivel', color: 'bg-red-50 text-(--color-brand)' },
    { icon: '🏆', title: isIs ? 'Topplisti' : 'Leaderboard', desc: isIs ? 'Sjáðu hvaða pizzur eru vinsælastar þessa vikuna.' : 'See which pizzas are most popular this week.', href: '/uppskriftir', color: 'bg-emerald-50 text-emerald-700' },
    { icon: '➕', title: isIs ? 'Ný uppskrift' : 'New Recipe', desc: isIs ? 'Bættu þinni meistaraverki í safnið okkar.' : 'Add your masterpiece to our collection.', href: '/uppskriftir/ny', color: 'bg-blue-50 text-blue-700' },
  ];

  return (
    <main className="flex-1 min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-display italic font-bold text-(--color-brand) mb-6">
            Samfélag Pizzumeistara
          </h1>
          <p className="text-xl md:text-2xl text-(--color-text-secondary) max-w-2xl mx-auto leading-relaxed">
            {isIs ? 'Deildu, lærðu og baktu með samfélaginu' : 'Share, learn, and bake with the community'}
          </p>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-(--color-brand)/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-(--color-gold)/5 rounded-full blur-3xl" />
      </section>

      {/* Quick Tools — 4 cards */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, i) => (
              <Link
                key={i}
                href={tool.href}
                className="bg-background p-8 rounded-xl border border-border hover:-translate-y-2 transition-transform duration-300 shadow-sm group"
              >
                <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-6 text-2xl`}>
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-(--color-brand) transition-colors">
                  {tool.title}
                </h3>
                <p className="text-(--color-text-secondary) text-sm">
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Feed */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-display font-bold text-foreground">
                {isIs ? 'Nýlegt úr samfélaginu' : 'Recent Activity'}
              </h2>
              <div className="h-1 w-20 bg-(--color-brand) mt-4" />
            </div>
            <span className="text-(--color-brand) font-bold cursor-pointer hover:underline">
              {isIs ? 'Sjá allt' : 'See all'}
            </span>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x" style={{ scrollbarWidth: 'none' }}>
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} className="flex-none w-80 bg-secondary rounded-xl p-5 border border-border snap-start">
                <div className="flex items-center gap-3 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.avatar} alt={item.user} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-sm text-foreground">{item.user}</p>
                    <p className="text-xs text-(--color-text-secondary)">{item.action}</p>
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.recipe} className="w-full h-40 object-cover rounded-lg mb-4" />
                <h4 className="font-display font-bold text-lg mb-1 text-foreground">{item.recipe}</h4>
                <p className="text-xs text-muted-foreground">{isIs ? item.time_is : item.time_en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pizzumeistarar — Top Contributors */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-12 text-foreground">
            {isIs ? 'Pizzumeistarar' : 'Pizza Masters'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {TOP_CONTRIBUTORS.map((person, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative mb-4 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className={`w-24 h-24 rounded-full object-cover border-4 ${person.borderColor} p-1 bg-background group-hover:scale-105 transition-transform`}
                  />
                  <span className={`absolute -bottom-2 -right-2 ${person.badgeColor} text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider shadow-md`}>
                    {person.badge}
                  </span>
                </div>
                <p className="font-bold text-foreground">{person.name}</p>
                <p className="text-sm text-(--color-text-secondary)">{person.count} {isIs ? 'uppskriftir' : 'recipes'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-(--color-brand) opacity-90 z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF4cIM98Y9_rJc6gpUbEeDn8nP_Bu7vz-Tdy5Ax6ittKciGcTZBz_wGawDpwDUMYXE_A01XVok1KBR5rTANslFqAmUIS3TmbH9IKC13yTFw8HXV6GeiW4i9IHSHaF7mqA7956g9pTAJEv8Yvaz_HIJAr9ZQaYQz-qzb7d2ZxddJL5bf5pLhEL5VWyapD7dpJkTCsBB6r-AFh_DfvF5qeMfeBrPqZMLkESkPTyoHC1XjDgjKezXoztMvBC5P7g5XhTrJR8LxG6om64"
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="relative z-20 p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
              {isIs ? 'Ertu tilbúin/n að deila?' : 'Ready to share?'}
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link
                href="/uppskriftir/ny"
                className="bg-white text-(--color-brand) px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-50 active:scale-95 transition-all shadow-lg"
              >
                {isIs ? 'Sendu inn uppskrift' : 'Submit a recipe'}
              </Link>
              <Link
                href="/uppskriftir"
                className="bg-white/20 text-white border-2 border-white/30 backdrop-blur-md px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 active:scale-95 transition-all"
              >
                {isIs ? 'Skoða leiðbeiningar' : 'Browse recipes'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
