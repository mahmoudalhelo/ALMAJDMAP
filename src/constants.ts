export interface Location {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  type: 'battle' | 'monument' | 'castle' | 'city' | 'palace';
  wikiUrl: string;
  imageUrl: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export const HISTORICAL_LOCATIONS: Location[] = [
  {
    id: 'karameh',
    name: 'موقع معركة الكرامة',
    description: 'موقع المعركة الخالدة عام 1968.',
    lat: 31.9472,
    lng: 35.5458,
    type: 'battle',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%85%D8%B9%D8%B1%D9%83%D8%A9_%D8%A7%D9%84%D9%83%D8%B1%D8%A7%D9%85%D8%A9',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Karameh_Battle_Memorial.jpg/800px-Karameh_Battle_Memorial.jpg'
  },
  {
    id: 'petra',
    name: 'البتراء',
    description: 'المدينة الوردية، إحدى عجائب الدنيا السبع.',
    lat: 30.3222,
    lng: 35.4516,
    type: 'city',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D8%A7%D9%84%D8%A8%D8%AA%D8%B1%D8%A7%D8%A1',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Al_Khazneh_Petra_Jordan_bw_36.jpg/800px-Al_Khazneh_Petra_Jordan_bw_36.jpg'
  },
  {
    id: 'jerash',
    name: 'جرش الأثرية',
    description: 'مدينة الألف عمود الرومانية (جيروزا).',
    lat: 32.2723,
    lng: 35.8914,
    type: 'city',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D8%AC%D8%B1%D8%B4',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Jerash_Oval_Plaza.jpg/800px-Jerash_Oval_Plaza.jpg'
  },
  {
    id: 'karak_castle',
    name: 'قلعة الكرك',
    description: 'قلعة تاريخية شامخة في جنوب الأردن.',
    lat: 31.1811,
    lng: 35.7047,
    type: 'castle',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D9%84%D8%B9%D8%A9_%D8%A7%D9%84%D9%83%D8%B1%D9%83',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Karak_Castle_Jordan.jpg/800px-Karak_Castle_Jordan.jpg'
  },
  {
    id: 'ajloun_castle',
    name: 'قلعة عجلون',
    description: 'قلعة الربض التي بناها عز الدين أسامة.',
    lat: 32.3328,
    lng: 35.7275,
    type: 'castle',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D9%84%D8%B9%D8%A9_%D8%B9%D8%AC%D9%84%D9%88%D9%86',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ajloun_Castle_Jordan.jpg/800px-Ajloun_Castle_Jordan.jpg'
  },
  {
    id: 'roman_theater',
    name: 'المدرج الروماني',
    description: 'مسرح روماني يقع في قلب العاصمة عمان.',
    lat: 31.9513,
    lng: 35.9392,
    type: 'monument',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D8%A7%D9%84%D9%85%D8%AF%D8%B1%D8%AC_%D8%A7%D9%84%D8%B1%D9%88%D9%85%D8%A7%D9%86%D9%8A_(%D8%B9%D9%85%D8%A7%D9%86)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Amman_Roman_Theater.jpg/800px-Amman_Roman_Theater.jpg'
  },
  {
    id: 'martyr_memorial',
    name: 'صرح الشهيد',
    description: 'متحف وطني يخلد ذكرى شهداء الجيش العربي.',
    lat: 31.9872,
    lng: 35.9228,
    type: 'monument',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D8%B5%D8%B1%D8%AD_%D8%A7%D9%84%D8%B4%D9%87%D9%8A%D8%AF',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Martyr%27s_Memorial_Amman.jpg/800px-Martyr%27s_Memorial_Amman.jpg'
  },
  {
    id: 'umm_qais',
    name: 'أم قيس',
    description: 'جدارا القديمة المطلة على بحيرة طبريا.',
    lat: 32.6531,
    lng: 35.6778,
    type: 'city',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D8%A3%D9%85_%D9%82%D9%8A%D8%B3_(%D8%A5%D8%B1%D8%A8%D8%AF)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Umm_Qais_Jordan.jpg/800px-Umm_Qais_Jordan.jpg'
  },
  {
    id: 'madaba',
    name: 'مادبا',
    description: 'مدينة الفسيفساء التاريخية.',
    lat: 31.7175,
    lng: 35.7942,
    type: 'city',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%85%D8%A7%D8%AF%D8%A8%D8%A7',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Madaba_Mosaic_Map.jpg/800px-Madaba_Mosaic_Map.jpg'
  },
  {
    id: 'qasr_amra',
    name: 'قصير عمرة',
    description: 'قصر صحراوي أموي مشهور بجدارياته الفنية الفريدة التي تصور الحياة اليومية والصيد.',
    lat: 31.8019,
    lng: 36.5872,
    type: 'palace',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D8%B5%D8%B1_%D8%B9%D9%85%D8%B1%D8%A9',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Qasr_Amra_Jordan.jpg/800px-Qasr_Amra_Jordan.jpg'
  },
  {
    id: 'tank_museum',
    name: 'متحف الدبابات الملكي',
    description: 'متحف عسكري عالمي يضم آليات عسكرية تاريخية.',
    lat: 31.908576,
    lng: 35.924471,
    type: 'monument',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%85%D8%AA%D8%AD%D9%81_%D8%A7%D9%84%D8%AF%D8%A8%D8%A7%D8%A8%D8%A7%D8%AA_%D8%A7%D9%84%D9%85%D9%84%D9%83%D9%8A',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Royal_Tank_Museum_Amman_Jordan.jpg/800px-Royal_Tank_Museum_Amman_Jordan.jpg'
  },
  {
    id: 'umm_al_jimal',
    name: 'أم الجمال',
    description: 'المدينة النبطية السوداء التاريخية.',
    lat: 32.3267,
    lng: 36.3686,
    type: 'city',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D8%A3%D9%85_%D8%A7%D9%84%D8%AC%D9%85%D8%A7%D9%84_(%D8%A7%D9%84%D9%85%D9%81%D8%B1%D9%82)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Umm_al-Jimal_01.jpg/800px-Umm_al-Jimal_01.jpg'
  },
  {
    id: 'pella',
    name: 'طبقة فحل',
    description: 'بيلا القديمة، إحدى مدن الديكابولس العشر.',
    lat: 32.4439,
    lng: 35.6125,
    type: 'city',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D8%B7%D8%A8%D9%82%D8%A9_%D9%81%D8%AD%D9%84',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Pella_Jordan_01.jpg/800px-Pella_Jordan_01.jpg'
  },
  {
    id: 'shobak_castle',
    name: 'قلعة الشوبك',
    description: 'قلعة تاريخية بناها الصليبيون وتعرف باسم مونتريال.',
    lat: 30.5311,
    lng: 35.5608,
    type: 'castle',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D9%84%D8%B9%D8%A9_%D8%A7%D9%84%D8%B4%D9%88%D8%A8%D9%83',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Shobak_Castle_Jordan.jpg/800px-Shobak_Castle_Jordan.jpg'
  },
  {
    id: 'amman_citadel',
    name: 'جبل القلعة',
    description: 'موقع تاريخي في عمان يضم معبد هرقل والقصر الأموي.',
    lat: 31.9544,
    lng: 35.9351,
    type: 'castle',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D8%AC%D8%A8%D9%84_%D8%A7%D9%84%D9%82%D9%84%D8%B9%D8%A9',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Amman_Citadel_Temple_of_Hercules.jpg/800px-Amman_Citadel_Temple_of_Hercules.jpg'
  },
  {
    id: 'aqaba_castle',
    name: 'قلعة العقبة',
    description: 'قلعة المماليك التاريخية المطلة على خليج العقبة.',
    lat: 29.5217,
    lng: 35.0017,
    type: 'castle',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D9%84%D8%B9%D8%A9_%D8%A7%D9%84%D8%B9%D9%82%D8%A8%D8%A9',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Aqaba_Fort_Jordan.jpg/800px-Aqaba_Fort_Jordan.jpg'
  },
  {
    id: 'azraq_castle',
    name: 'قلعة الأزرق',
    description: 'حصن تاريخي مبني من الحجر البازلتي الأسود.',
    lat: 31.8803,
    lng: 36.8272,
    type: 'castle',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D9%84%D8%B9%D8%A9_%D8%A7%D9%84%D8%A3%D8%B2%D8%B1%D9%82',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Qasr_Azraq_Jordan.jpg/800px-Qasr_Azraq_Jordan.jpg'
  },
  {
    id: 'jordan_museum',
    name: 'متحف الأردن',
    description: 'المتحف الوطني الأكبر في الأردن يقع في منطقة رأس العين.',
    lat: 31.9461,
    lng: 35.9275,
    type: 'monument',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%85%D8%AA%D8%AD%D9%81_%D8%A7%D9%84%D8%A3%D8%B1%D8%AF%D9%86',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Jordan_Museum_Amman.jpg/800px-Jordan_Museum_Amman.jpg'
  },
  {
    id: 'mutah_memorial',
    name: 'صرح شهداء مؤتة',
    description: 'صرح يخلد ذكرى شهداء معركة مؤتة في المزار الجنوبي.',
    lat: 31.0667,
    lng: 35.6967,
    type: 'monument',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D8%A7%D9%84%D9%85%D8%B2%D8%A7%D8%B1_%D8%A7%D9%84%D8%AC%D9%86%D9%88%D8%A8%D9%8A',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Mutah_Battle_Memorial.jpg/800px-Mutah_Battle_Memorial.jpg'
  },
  {
    id: 'great_arab_revolt_square',
    name: 'ساحة الثورة العربية الكبرى',
    description: 'ساحة وطنية هامة في العقبة تضم أطول سارية علم.',
    lat: 29.5211,
    lng: 35.0006,
    type: 'monument',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D8%B3%D8%A7%D8%B1%D9%8A%D8%A9_%D8%A7%D9%84%D8%B9%D9%82%D8%A8%D8%A9',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Great_Arab_Revolt_Plaza_Aqaba.jpg/800px-Great_Arab_Revolt_Plaza_Aqaba.jpg'
  },
  {
    id: 'yarmouk_battle',
    name: 'موقع معركة اليرموك',
    description: 'مطل تاريخي يشرف على موقع معركة اليرموك الخالدة.',
    lat: 32.7483,
    lng: 35.7892,
    type: 'battle',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%85%D8%B9%D8%B1%D9%83%D8%A9_%D8%A7%D9%84%D9%8A%D8%B1%D9%85%D9%88%D9%83',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Yarmouk_River_Valley.jpg/800px-Yarmouk_River_Valley.jpg'
  },
  {
    id: 'mutah_battle',
    name: 'موقع معركة مؤتة',
    description: 'الموقع التاريخي الذي دارت فيه أحداث معركة مؤتة.',
    lat: 31.0733,
    lng: 35.7192,
    type: 'battle',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%85%D8%B9%D8%B1%D9%83%D8%A9_%D9%85%D8%A4%D8%AA%D8%A9',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Mutah_Battlefield.jpg/800px-Mutah_Battlefield.jpg'
  },
  {
    id: 'raghadan_palace',
    name: 'قصر رغدان العامر',
    description: 'أول قصر هاشمي بني في عهد الملك المؤسس عبد الله الأول، وهو رمز للسيادة الوطنية.',
    lat: 31.9611,
    lng: 35.9431,
    type: 'palace',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D8%B5%D8%B1_%D8%B1%D8%BA%D8%AF%D8%A7%D9%86',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Raghadan_Palace_Amman.jpg/800px-Raghadan_Palace_Amman.jpg'
  },
  {
    id: 'kharana_palace',
    name: 'قصر الخرانة',
    description: 'يتميز ببنائه الضخم الذي يشبه القلاع، وكان يستخدم كمكان للاجتماعات السياسية.',
    lat: 31.7289,
    lng: 36.4628,
    type: 'palace',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D8%B5%D8%B1_%D8%A7%D9%84%D8%AE%D8%B1%D8%A7%D9%86%D8%A9',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Qasr_Kharana_Jordan.jpg/800px-Qasr_Kharana_Jordan.jpg'
  },
  {
    id: 'mushatta_palace',
    name: 'قصر المشتى',
    description: 'يقع قرب مطار الملكة علياء، ويشتهر بزخارفه المحفورة بدقة في الحجر.',
    lat: 31.7378,
    lng: 35.9922,
    type: 'palace',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D8%B5%D8%B1_%D8%A7%D9%84%D9%85%D8%B4%D8%AA%D9%89',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Qasr_Mshatta_Jordan.jpg/800px-Qasr_Mshatta_Jordan.jpg'
  },
  {
    id: 'hallabat_palace',
    name: 'قصر الحلابات',
    description: 'كان في الأصل حصناً رومانياً ثم تحول إلى قصر أموي فاخر يضم فسيفساء رائعة.',
    lat: 32.0917,
    lng: 36.3292,
    type: 'palace',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D8%B5%D8%B1_%D8%A7%D9%84%D8%AD%D9%84%D8%A7%D8%A8%D8%A7%D8%AA',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Qasr_Hallabat_Jordan.jpg/800px-Qasr_Hallabat_Jordan.jpg'
  },
  {
    id: 'tuba_palace',
    name: 'قصر الطوبة',
    description: 'قصر ضخم يقع في منطقة نائية، بني من الطوب اللبن والحجر.',
    lat: 31.3258,
    lng: 36.5683,
    type: 'palace',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D8%B5%D8%B1_%D8%B7%D9%88%D8%A8%D8%A9',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Qasr_Tuba_Jordan.jpg/800px-Qasr_Tuba_Jordan.jpg'
  },
  {
    id: 'abd_palace',
    name: 'قصر العبد',
    description: 'يعود للعصر الهلنستي (اليوناني)، وهو فريد من نوعه بتماثيل الأسود المحفورة عليه.',
    lat: 31.9125,
    lng: 35.7511,
    type: 'palace',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D8%B5%D8%B1_%D8%A7%D9%84%D8%B9%D8%A8%D8%AF',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Qasr_al-Abd_Jordan.jpg/800px-Qasr_al-Abd_Jordan.jpg'
  },
  {
    id: 'shabib_castle',
    name: 'قصر شبيب',
    description: 'بناء تاريخي في الزرقاء شهد عصوراً مختلفة من الروماني إلى العثماني.',
    lat: 32.0675,
    lng: 36.0858,
    type: 'palace',
    wikiUrl: 'https://ar.wikipedia.org/wiki/%D9%82%D8%B5%D8%B1_%D8%B4%D8%A8%D9%8A%D8%A8',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Qasr_Shabib_Zarqa.jpg/800px-Qasr_Shabib_Zarqa.jpg'
  }
];

export const CHALLENGES: Record<string, Question> = {
  karameh: {
    id: 'q_karameh',
    text: 'في أي عام وقعت معركة الكرامة؟',
    options: ['1967', '1968', '1970', '1973'],
    correctAnswer: 1
  },
  petra: {
    id: 'q_petra',
    text: 'من هم بناة مدينة البتراء؟',
    options: ['الرومان', 'الأنباط', 'اليونان', 'الأمويون'],
    correctAnswer: 1
  },
  jerash: {
    id: 'q_jerash',
    text: 'ماذا يطلق على مدينة جرش؟',
    options: ['مدينة الشمس', 'مدينة الألف عمود', 'المدينة الوردية', 'مدينة الفسيفساء'],
    correctAnswer: 1
  },
  karak_castle: {
    id: 'q_karak',
    text: 'من الذي بنى قلعة الكرك بشكلها الحالي؟',
    options: ['الصليبيون', 'الأيوبيون', 'المماليك', 'العثمانيون'],
    correctAnswer: 0
  },
  ajloun_castle: {
    id: 'q_ajloun',
    text: 'بنيت قلعة عجلون للتصدي لزحف:',
    options: ['المغول', 'الصليبيين', 'الفرس', 'الروم'],
    correctAnswer: 1
  },
  roman_theater: {
    id: 'q_roman',
    text: 'كم يتسع المدرج الروماني في عمان تقريباً؟',
    options: ['2000 person', '6000 person', '10000 person', '15000 person'],
    correctAnswer: 1
  },
  martyr_memorial: {
    id: 'q_martyr',
    text: 'يحتوي صرح الشهيد على مقتنيات تعود لـ:',
    options: ['الثورة العربية الكبرى', 'العصر الروماني', 'العصر النبطي', 'العصر الحجري'],
    correctAnswer: 0
  },
  umm_qais: {
    id: 'q_umm_qais',
    text: 'ما هو الاسم القديم لمدينة أم قيس؟',
    options: ['فيلادلفيا', 'جدارا', 'بيلا', 'جراسا'],
    correctAnswer: 1
  },
  madaba: {
    id: 'q_madaba',
    text: 'تشتهر مادبا بوجود أقدم خريطة فسيفسائية لـ:',
    options: ['الأردن', 'القدس', 'دمشق', 'القاهرة'],
    correctAnswer: 1
  },
  qasr_amra: {
    id: 'q_amra',
    text: 'يعود بناء قصر عمرة إلى العصر:',
    options: ['الأموي', 'العباسي', 'الفاطمي', 'الأيوبي'],
    correctAnswer: 0
  },
  tank_museum: {
    id: 'q_tank',
    text: 'في أي عام تم افتتاح متحف الدبابات الملكي رسمياً؟',
    options: ['2015', '2018', '2020', '2022'],
    correctAnswer: 1
  },
  umm_al_jimal: {
    id: 'q_umm_al_jimal',
    text: 'ما هو اللون المميز لحجارة مدينة أم الجمال؟',
    options: ['الأبيض', 'الوردي', 'الأسود البازلتي', 'الأصفر'],
    correctAnswer: 2
  },
  pella: {
    id: 'q_pella',
    text: 'تعتبر طبقة فحل (بيلا) إحدى مدن حلف:',
    options: ['المدن العشر (الديكابولس)', 'المدن السبع', 'المدن الخمس', 'المدن الثلاث'],
    correctAnswer: 0
  },
  shobak_castle: {
    id: 'q_shobak',
    text: 'ما هو الاسم الذي أطلقه الصليبيون على قلعة الشوبك؟',
    options: ['الكرك', 'مونتريال', 'بيلفوار', 'عجلون'],
    correctAnswer: 1
  },
  amman_citadel: {
    id: 'q_citadel',
    text: 'يضم جبل القلعة بقايا معبد مخصص للإله:',
    options: ['زيوس', 'هرقل', 'أبولو', 'مارس'],
    correctAnswer: 1
  },
  aqaba_castle: {
    id: 'q_aqaba',
    text: 'تعرف قلعة العقبة أيضاً بقلعة:',
    options: ['الأيوبيين', 'المماليك', 'العثمانيين', 'الأنباط'],
    correctAnswer: 1
  },
  azraq_castle: {
    id: 'q_azraq',
    text: 'ما هو نوع الحجر المستخدم في بناء قلعة الأزرق؟',
    options: ['الجيري', 'الرخام', 'البازلت الأسود', 'الرملي'],
    correctAnswer: 2
  },
  jordan_museum: {
    id: 'q_jordan_museum',
    text: 'أين يقع متحف الأردن الوطني؟',
    options: ['العبدلي', 'رأس العين', 'جبل عمان', 'تلاع العلي'],
    correctAnswer: 1
  },
  mutah_memorial: {
    id: 'q_mutah_memorial',
    text: 'يقع صرح شهداء مؤتة في محافظة:',
    options: ['الطفيلة', 'معان', 'الكرك', 'العقبة'],
    correctAnswer: 2
  },
  great_arab_revolt_square: {
    id: 'q_revolt_square',
    text: 'تضم ساحة الثورة العربية الكبرى في العقبة سارية علم يبلغ طولها:',
    options: ['50 متر', '80 متر', '130 متر', '150 متر'],
    correctAnswer: 2
  },
  yarmouk_battle: {
    id: 'q_yarmouk',
    text: 'من هو القائد المسلم في معركة اليرموك؟',
    options: ['خالد بن الوليد', 'أبو عبيدة عامر بن الجراح', 'عمرو بن العاص', 'شرحبيل بن حسنة'],
    correctAnswer: 0
  },
  mutah_battle: {
    id: 'q_mutah',
    text: 'كم كان عدد قادة المسلمين الذين استشهدوا في معركة مؤتة؟',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1
  },
  raghadan_palace: {
    id: 'q_raghadan',
    text: 'في عهد أي ملك بني قصر رغدان العامر؟',
    options: ['الملك عبد الله الأول', 'الملك طلال', 'الملك الحسين', 'الملك عبد الله الثاني'],
    correctAnswer: 0
  },
  kharana_palace: {
    id: 'q_kharana',
    text: 'ما هي الوظيفة الأساسية المرجحة لقصر الخرانة؟',
    options: ['حصن عسكري', 'مكان للاجتماعات السياسية', 'مستشفى', 'مدرسة'],
    correctAnswer: 1
  },
  mushatta_palace: {
    id: 'q_mushatta',
    text: 'يقع قصر المشتى بالقرب من:',
    options: ['وسط البلد', 'مطار الملكة علياء', 'البحر الميت', 'مدينة جرش'],
    correctAnswer: 1
  },
  hallabat_palace: {
    id: 'q_hallabat',
    text: 'كان قصر الحلابات في الأصل حصناً:',
    options: ['يونانياً', 'رومانياً', 'نبطياً', 'فارسياً'],
    correctAnswer: 1
  },
  tuba_palace: {
    id: 'q_tuba',
    text: 'ما هي المادة الأساسية المستخدمة في بناء قصر الطوبة؟',
    options: ['الرخام', 'الطوب اللبن والحجر', 'الخشب', 'الحديد'],
    correctAnswer: 1
  },
  abd_palace: {
    id: 'q_abd',
    text: 'يعود قصر العبد (عراق الأمير) إلى العصر:',
    options: ['الأموي', 'الهلنستي', 'الروماني', 'الإسلامي'],
    correctAnswer: 1
  },
  shabib_castle: {
    id: 'q_shabib',
    text: 'في أي مدينة يقع قصر شبيب؟',
    options: ['عمان', 'الزرقاء', 'إربد', 'السلط'],
    correctAnswer: 1
  }
};

export const SOUNDS = {
  CLICK: 'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3',
  SUCCESS: 'https://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3',
  FAILURE: 'https://codeskulptor-demos.commondatastorage.googleapis.com/descent/Crumble%20Sound.mp3',
  AMBIENT: 'https://almajdmap.rojnda.com/almajd.mp3',
  PROXIMITY: 'https://codeskulptor-demos.commondatastorage.googleapis.com/descent/spring.mp3'
};

export const DEFAULT_PROFILE_PICTURE = 'https://almajdmap.rojnda.com/almjd.png';
