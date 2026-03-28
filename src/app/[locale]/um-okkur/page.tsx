import { ChefHat, Heart, Users } from 'lucide-react';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIslandic = locale === 'is';
  
  return (
    <main className="flex-1 bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-8 tracking-tight">
          {isIslandic ? 'Um Okkur' : 'About Us'}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-20 max-w-3xl mx-auto font-medium">
          {isIslandic 
            ? 'Pizzadeig.is er opið samfélag bakara, matgæðinga og pizza-nörda. Yfirlýst markmið okkar er að aðstoða alla við að baka og njóta fullkominna pítsa heima í stofu.'
            : 'Pizzadeig.is is an open community of bakers, foodies, and pizza nerds. Our core mission is to help everyone bake and enjoy the perfect pizza straight from their home kitchen.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
           <div className="bg-secondary p-10 rounded-3xl shadow-sm border border-border hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6">
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{isIslandic ? 'Uppskriftir' : 'Recipes'}</h3>
              <p className="text-muted-foreground leading-relaxed">{isIslandic ? 'Gagnagrunnur sem stækkar daglega og skilar nákvæmum leiðbeiningum að fullkomnun sem reynar hafa verið af sjálfu samfélaginu.' : 'A daily expanding database delivering precise instructions mapped to perfection and rigorously tested by the community itself.'}</p>
           </div>
           
           <div className="bg-secondary p-10 rounded-3xl shadow-sm border border-border hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-500/5 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{isIslandic ? 'Samfélagsdrifið' : 'Community Driven'}</h3>
              <p className="text-muted-foreground leading-relaxed">{isIslandic ? 'Allt á vefnum er opið fyrir einkunnagjöfum og skiptum. Við stuðlum að opnum og frjálsum umræðum um innihaldsefni og bökunaraðferðir.' : 'Everything is open to rating implementations. We encourage entirely uninhibited exchange of ingredient sourcing techniques.'}</p>
           </div>
           
           <div className="bg-secondary p-10 rounded-3xl shadow-sm border border-border hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-ring/5 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-ring" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{isIslandic ? 'Hópastarf' : 'Teamwork'}</h3>
              <p className="text-muted-foreground leading-relaxed">{isIslandic ? 'Þetta gæti byrjað hér á landi, en sjónarhorn okkar er alþjóðlegt með tvítyngdum aðgengisleiðum fyrir unnendur pitsunnar hvert sem þeir fara.' : 'While starting locally alongside the glaciers, our aim is completely global with dual-language tracking spanning international pizza boundaries.'}</p>
           </div>
        </div>
      </div>
    </main>
  );
}
