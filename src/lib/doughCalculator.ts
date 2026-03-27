export interface DoughInput {
  numPizzas: number;
  ballWeight: 220 | 260;        // grömm
  bakeDateTime: Date;           // Hvenær borðar þú
}

export interface DoughMethod {
  type: 'hraddeig' | 'kaldhefun';
  label_is: string;
  label_en: string;
  hydration: number;            // 0.65 eða 0.67
  salt_pct: number;             // 0.03
  yeast_pct: number;            // 0.018 eða 0.004
  sugar_pct: number;            // 0.02 eða 0
  oil_pct: number;              // 0.03 eða 0
}

export interface TimelineStep {
  datetime: Date;
  title_is: string;
  title_en: string;
  description_is: string;
  description_en: string;
  notify: boolean;              // Senda tilkynningu á þessu skrefi?
  icon: string;                 // emoji
}

export interface ShoppingItem {
  id: string;
  name_is: string;
  name_en: string;
  amount: number;
  unit: string;
  category: 'dry' | 'wet' | 'other';
}

export interface DoughResult {
  method: DoughMethod;
  totalDough: number;           // grömm
  flour: number;
  water: number;
  salt: number;
  yeast: number;
  sugar: number;
  oil: number;
  timeline: TimelineStep[];
  shoppingList: ShoppingItem[];
}

export function generateTimeline(method: DoughMethod, bakeTime: Date, hoursUntil: number): TimelineStep[] {
  const steps: TimelineStep[] = [];
  const bake = bakeTime.getTime();

  if (method.type === 'kaldhefun') {
    // Skref 1: Blanda deig
    const mixTime = new Date(bake - hoursUntil * 60 * 60 * 1000);
    steps.push({
      datetime: mixTime,
      title_is: 'Blandaðu deigið',
      title_en: 'Mix the dough',
      description_is: 'Blandaðu hveiti, vatni, salti og geri saman. Hnoðaðu í 8-10 mínútur þar til deigið er slétt.',
      description_en: 'Combine flour, water, salt and yeast. Knead for 8-10 minutes until smooth.',
      notify: true,
      icon: '🥣',
    });

    // Skref 2: Setja í ísskáp (15 mín eftir blöndun)
    steps.push({
      datetime: new Date(mixTime.getTime() + 15 * 60 * 1000),
      title_is: 'Settu í ísskáp',
      title_en: 'Put in fridge',
      description_is: 'Smyrðu skál með olíu, settu deigið í og hyljið. Settu í ísskáp.',
      description_en: 'Oil a bowl, place dough inside and cover. Put in fridge.',
      notify: false,
      icon: '🧊',
    });

    // Skref 3: Taka úr ísskáp (mín 10 klst áður ef pláss, hér t.d 10 klst)
    const removeFromFridge = new Date(bake - 10 * 60 * 60 * 1000);
    steps.push({
      datetime: removeFromFridge,
      title_is: 'Taktu úr ísskáp og skiptu í kúlur',
      title_en: 'Remove from fridge and divide into balls',
      description_is: `Taktu deigið úr ísskáp. Skiptu í jafna hluta og mótaðu í kúlur. Hyljið.`,
      description_en: `Remove dough from fridge. Divide into equal portions and shape into balls. Cover.`,
      notify: true,
      icon: '⚪',
    });

    // Skref 4: Herbergishiti (2 klst áður)
    steps.push({
      datetime: new Date(bake - 2 * 60 * 60 * 1000),
      title_is: 'Deigkúlur á herbergishita',
      title_en: 'Bring dough balls to room temperature',
      description_is: 'Taktu deigkúlurnar fram og leyfðu þeim að ná herbergishita í 1-2 klst.',
      description_en: 'Take dough balls out and let them reach room temperature for 1-2 hours.',
      notify: true,
      icon: '🌡️',
    });

    // Skref 5: Kveikja á ofni (40 mín áður)
    steps.push({
      datetime: new Date(bake - 40 * 60 * 1000),
      title_is: 'Kveiktu á ofninum',
      title_en: 'Preheat the oven',
      description_is: 'Kveiktu á ofninum á hæsta hita (240-250°C). Settu pizzustein inn ef þú ert með.',
      description_en: 'Preheat oven to max (240-250°C / 475°F). Put pizza stone in if you have one.',
      notify: true,
      icon: '🔥',
    });

    // Skref 6: Baka
    steps.push({
      datetime: bakeTime,
      title_is: 'Flattu út og bakaðu!',
      title_en: 'Stretch and bake!',
      description_is: 'Flattu deigkúluna út, bættu á sósu og álegi, og bakaðu í 8-12 mín.',
      description_en: 'Stretch the dough ball, add sauce and toppings, and bake for 8-12 min.',
      notify: true,
      icon: '🍕',
    });
  } else {
    // Hraðdeig
    const mixTime = new Date(bake - hoursUntil * 60 * 60 * 1000);

    steps.push({
      datetime: mixTime,
      title_is: 'Blandaðu deigið',
      title_en: 'Mix the dough',
      description_is: 'Blandaðu öll hráefni saman og hnoðaðu í 10 mín. Bættu sykri og olíu við.',
      description_en: 'Combine all ingredients and knead for 10 min. Add sugar and oil.',
      notify: true, icon: '🥣',
    });

    const riseTime = Math.max(60, (hoursUntil - 1) * 60); // mín
    steps.push({
      datetime: new Date(mixTime.getTime() + 15 * 60 * 1000),
      title_is: `Láttu rísa í ${Math.round(riseTime / 60)} klst`,
      title_en: `Let rise for ${Math.round(riseTime / 60)} hours`,
      description_is: 'Hyljið deigið og setjið á hlýjan stað.',
      description_en: 'Cover the dough and place in a warm spot.',
      notify: false, icon: '⏳',
    });

    steps.push({
      datetime: new Date(bake - 40 * 60 * 1000),
      title_is: 'Kveiktu á ofninum',
      title_en: 'Preheat the oven',
      description_is: 'Kveiktu á hæsta hita (240-250°C).',
      description_en: 'Preheat to max (240-250°C / 475°F).',
      notify: true, icon: '🔥',
    });

    steps.push({
      datetime: bakeTime,
      title_is: 'Flattu út og bakaðu!',
      title_en: 'Stretch and bake!',
      description_is: 'Skiptu í kúlur, flattu út, bættu álegi og bakaðu í 8-12 mín.',
      description_en: 'Divide into balls, stretch, add toppings and bake 8-12 min.',
      notify: true, icon: '🍕',
    });
  }

  return steps;
}

export function generateShoppingList(ingredients: { flour: number; water: number; salt: number; yeast: number; sugar: number; oil: number }, method: DoughMethod): ShoppingItem[] {
  const list: ShoppingItem[] = [
    { id: '1', name_is: 'Hveiti (00 eða brauðhveiti)', name_en: 'Flour (00 or bread flour)', amount: ingredients.flour, unit: 'g', category: 'dry' },
    { id: '2', name_is: 'Salt', name_en: 'Salt', amount: ingredients.salt, unit: 'g', category: 'dry' },
    { id: '3', name_is: 'Þurrger', name_en: 'Dry yeast', amount: ingredients.yeast, unit: 'g', category: 'dry' },
  ];

  if (method.type === 'hraddeig') {
    list.push({ id: '4', name_is: 'Sykur', name_en: 'Sugar', amount: ingredients.sugar, unit: 'g', category: 'dry' });
    list.push({ id: '5', name_is: 'Ólífuolía', name_en: 'Olive oil', amount: ingredients.oil, unit: 'g', category: 'wet' });
  }

  return list;
}

export function calculateDough(input: DoughInput): DoughResult {
  const now = new Date();
  const hoursUntilBake = (input.bakeDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Velja aðferð (Ef minna en 4 klst þá hraðdeig)
  const method: DoughMethod = hoursUntilBake <= 4
    ? {
        type: 'hraddeig',
        label_is: 'Hraðdeig',
        label_en: 'Quick dough',
        hydration: 0.65,
        salt_pct: 0.03,
        yeast_pct: 0.018,
        sugar_pct: 0.02,
        oil_pct: 0.03,
      }
    : {
        type: 'kaldhefun',
        label_is: 'Kaldhefun',
        label_en: 'Cold ferment',
        hydration: 0.67,
        salt_pct: 0.03,
        yeast_pct: 0.004,
        sugar_pct: 0,
        oil_pct: 0,
      };

  // Reikna hráefni (baker's percentages)
  const totalDough = input.numPizzas * input.ballWeight;
  const divisor = 1 + method.hydration + method.salt_pct + method.yeast_pct + method.sugar_pct + method.oil_pct;
  const flour = Math.round(totalDough / divisor);
  const water = Math.round(flour * method.hydration);
  const salt = Math.round(flour * method.salt_pct * 10) / 10;
  const yeast = Math.round(flour * method.yeast_pct * 10) / 10;
  const sugar = Math.round(flour * method.sugar_pct * 10) / 10;
  const oil = Math.round(flour * method.oil_pct * 10) / 10;

  // Búa til tímalínu
  const timeline = generateTimeline(method, input.bakeDateTime, hoursUntilBake);

  // Innkaupalisti
  const shoppingList = generateShoppingList({ flour, water, salt, yeast, sugar, oil }, method);

  return { method, totalDough, flour, water, salt, yeast, sugar, oil, timeline, shoppingList };
}
