import { Mail, MapPin, Clock } from 'lucide-react';

export default async function TenglidirPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';

  return (
    <main className="flex-1 w-full bg-background min-h-screen pb-20">
      <div className="bg-(--color-bg-secondary) border-b border-(--color-border-light) pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-(--color-text-primary) mb-4">
            {isIs ? 'Tengiliðir' : 'Contact Us'}
          </h1>
          <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto italic">
            {isIs
              ? 'Spurning, athugasemd eða uppástunga? Við heyrum gjarnan frá þér!'
              : 'Question, comment, or suggestion? We\'d love to hear from you!'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl mt-12 space-y-8">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="mailto:thorarinnhjalmarsson@gmail.com?subject=Hæ Pizzadeig.is!"
            className="bg-white border border-(--color-border) rounded-2xl p-6 text-center hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-(--color-brand)/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-(--color-brand)/20 transition-colors">
              <Mail className="w-6 h-6 text-(--color-brand)" />
            </div>
            <h3 className="font-bold text-(--color-text-primary) mb-1">
              {isIs ? 'Tölvupóstur' : 'Email'}
            </h3>
            <p className="text-sm text-(--color-brand) font-medium">thorarinnhjalmarsson@gmail.com</p>
          </a>

          <div className="bg-white border border-(--color-border) rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-bold text-(--color-text-primary) mb-1">
              {isIs ? 'Staðsetning' : 'Location'}
            </h3>
            <p className="text-sm text-(--color-text-secondary)">Reykjavík, Ísland 🇮🇸</p>
          </div>
        </div>

        {/* Extra info */}
        <div className="bg-(--color-bg-secondary) rounded-3xl border border-(--color-border) p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-bold text-(--color-text-secondary) uppercase tracking-wider">
              {isIs ? 'Svartími' : 'Response Time'}
            </span>
          </div>
          <p className="text-(--color-text-secondary)">
            {isIs
              ? 'Við reynum að svara öllum fyrirspurnum innan 24 klukkustunda. Ef spurningin þín snýr að auglýsingum, vinsamlegast hafðu samband í gegnum auglýsingasíðuna okkar.'
              : 'We try to respond to all inquiries within 24 hours. If your question is about advertising, please use our advertising page.'}
          </p>
        </div>
      </div>
    </main>
  );
}
