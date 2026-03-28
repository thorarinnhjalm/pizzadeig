export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'is' ? 'Skilmálar og Persónuvernd | Pizzadeig.is' : 'Terms and Privacy Policy | Pizzadeig.is',
    robots: 'noindex, follow', // Classic terms page bots rule
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIslandic = locale === 'is';
  
  return (
    <main className="flex-1 bg-secondary py-16 md:py-24 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="prose prose-lg md:prose-xl max-w-none text-foreground">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-foreground">
            {isIslandic ? 'Skilmálar og Persónuvernd' : 'Terms & Privacy Policy'}
          </h1>
          
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-12">
            <h2 className="text-2xl font-bold mt-0 mb-4 text-[#1D3557]">{isIslandic ? 'Almenn Notkun' : 'General Usage'}</h2>
            <p className="text-(--color-text-secondary) leading-relaxed">
              {isIslandic 
                ? 'Efnisveitan er einungis ætluð til fróðleiks og skemmtunar. Gögnum sem skráð eru af aðilum er dreift "eins og þau koma fyrir" án ábyrgðar vefstjóra.' 
                : 'The platform serves exclusively as an educational tool. Content provided by users is distributed "as is" completely free of administrative liability.'}
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-12">
            <h2 className="text-2xl font-bold mt-0 mb-4 text-[#1D3557]">{isIslandic ? 'Persónuverndarstefna' : 'Privacy Protection'}</h2>
            <p className="text-(--color-text-secondary) leading-relaxed mb-4">
              {isIslandic 
                ? 'Við söfnum engum persónugreinanlegum gögnum (PII) að óþörfu. Öll notkun á síðunni, þar með talið skráningar á auglýsingabirtingum er handahófskennd.' 
                : 'We do not collect Personally Identifiable Information unnecessarily. Any analytic tracing—including ad payload monitoring—is strictly anonymized.'}
            </p>
            <ul className="list-disc pl-6 text-(--color-text-secondary) space-y-2">
              <li>{isIslandic ? 'Vafrakökur (Cookies) eru stýrðar sjálfvirkt af kerfum og háðar stillingum vafra.' : 'Cookies are auto-managed completely subject to arbitrary client bounds.'}</li>
              <li>{isIslandic ? 'Skýragrunnar eru keyrðir með vottuðum evrópskum netföngum yfir ströng net.' : 'Data clusters operate purely under ISO certified European zones natively.'}</li>
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground font-bold tracking-widest uppercase mt-20 border-t pt-8">
            {isIslandic ? 'Síðast uppfært: 26. Mars 2026' : 'Last updated: March 26, 2026'}
          </p>
        </div>
      </div>
    </main>
  );
}
