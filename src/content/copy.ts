// All UI strings. APPROVED = verbatim from Описание проекта.md lines 27-73.
// NEW = written in this file; tone: direct, no superlatives, builder-to-builder.

export const copy = {
  // Section 1.0 — Marketplace header (NEW)
  marketplace: {
    name: 'Рынок.маркет',
    searchPlaceholder: 'Поиск товаров...',
    location: 'Москва',
  },

  // Section 1.2 — Product title (APPROVED)
  product: {
    title: 'Сетка стеклопластиковая 5-150×150 мм',
    subtitle: 'Стеклопластиковая сетка производство Гален для кладки и бетона.',
    inStock: 'В наличии',
    brandBadge: 'ROCKMESH',
    isoBadge: 'ISO 9001',
  },

  // Section 1.3 — Price (APPROVED)
  price: {
    label: 'Цена: всего 150 ₽/м²',
    from: 'от',
    unit: '₽/м²',
  },

  // Section 1.5 — CTA (APPROVED)
  cta: {
    call: 'Позвонить',
    whatsapp: 'WhatsApp',
    callTagline: 'ЗВОНИТЕ или ПИШИТЕ прямо сейчас. Мы на связи!',
  },

  // Section 2.0 — Marquee (NEW)
  marquee: [
    '150 ₽/м²',
    'ISO 9001:2015',
    'ROCKMESH',
    'Производство Гален',
    'В наличии',
    'Доставка по России',
    'Аминные отвердители',
  ],

  // Section 3.1 — Hero (APPROVED)
  hero: {
    h1: 'Выбирая сетку, не экономьте на качестве!',
    h2: 'Дешёвая кустарная сетка не защищена от щёлочи в бетоне и со временем рассыпается.',
    cta: 'Убедитесь в качестве',
  },

  // Section 3.2 — CompareSlider (APPROVED)
  compare: {
    heading: 'Убедитесь в качестве нашей стеклопластиковой сетки:',
    subheading: '80–95% рынка — контрафакт. Посмотрите на торец.',
    labelLeft: 'Кустарное производство',
    labelRight: 'ROCKMESH (Гален)',
    caption: 'Дешёвая кустарная сетка не защищена от щёлочи в бетоне — расслоение видно невооружённым глазом.',
  },

  // Section 3.3 — FourProperties (APPROVED)
  properties: [
    {
      key: 'alkali',
      title: 'Стойкость к воздействиям',
      body: 'Аминные отвердители защищают сетку от разрушающего воздействия щёлочи, влаги и солей.',
    },
    {
      key: 'adhesion',
      title: 'Надёжное сцепление',
      body: 'За счёт песчаного покрытия арматура прочно держится в бетоне.',
    },
    {
      key: 'precision',
      title: 'Не обманем',
      body: 'Диаметр и размеры всегда точные. Каждая партия контролируется в лаборатории.',
    },
    {
      key: 'certified',
      title: 'Всё официально',
      body: 'Вся продукция имеет Сертификат соответствия и международный Сертификат ISO.',
    },
  ],

  // Section 3.4 — Composition (NEW)
  composition: {
    heading: 'Из чего состоит ROCKMESH',
    subheading: 'Кустарная сетка не имеет половины этих компонентов.',
    wowSlot: 'Здесь будет интерактивная разборка сетки',
  },

  // Section 3.5 — UseCases (APPROVED)
  useCases: {
    heading: 'Где используется?',
    items: [
      '✔ Кладка стен из кирпича и блоков',
      '✔ Заливка бетонных полов и стяжек',
      '✔ Укрепление фундаментов и отмосток',
      '✔ Строительство дорожек и площадок',
    ],
  },

  // Section 3.6 — TechSpecs (APPROVED)
  specs: {
    heading: 'Характеристики',
    rows: [
      { label: 'Цена', value: '150 ₽/м²' },
      { label: 'Ячейка', value: '150×150 мм' },
      { label: 'Диаметр прутка', value: '5 мм' },
      { label: 'Карты 1', value: '1,5×3 м' },
      { label: 'Карты 2', value: '2×3,1 м' },
      { label: 'Карты 3', value: '2,1×4,5 м' },
      { label: 'Материал', value: 'Стеклопластик (GRP)' },
      { label: 'Поверхность', value: 'Кварцево-песчаное покрытие' },
    ],
  },

  // Section 3.7 — Manufacturer (APPROVED + NEW)
  manufacturer: {
    heading: 'Производитель «Гален»',
    body: 'Изделия поставляются в десятки стран мира, где по-настоящему ценят надёжность и качество.',
    body2: 'Собственная лаборатория контроля сырья. Каждая партия проходит испытания на соответствие ГОСТу.',
    objectsHeading: 'Объекты с ROCKMESH',
    ogrnLabel: 'ОГРН',
  },

  // Section 3.8 — Certificates (APPROVED)
  certificates: {
    heading: 'Всё официально',
    body: 'Вся продукция имеет Сертификат соответствия и международный Сертификат ISO.',
    disclaimer: 'Сертификаты предоставляются по запросу.',
    clickHint: 'Нажмите для увеличения',
  },

  // Section 3.9 — Delivery (APPROVED + NEW)
  delivery: {
    heading: 'Доставка по всей России',
    body: 'Склад в Чебоксарах — географический центр европейской части России. Отгрузка в день заказа.',
    warehouseLabel: 'Склад отгрузки',
    warehouseCity: 'Чебоксары',
    selfPickup: 'Самовывоз или доставка транспортной компанией.',
    carriersLabel: 'Работаем с ТК:',
  },

  // Section 3.11 — FinalCTA (APPROVED)
  finalCta: {
    heading: 'Остались вопросы?',
    body: 'Звоните, напишите — с удовольствием ответим на все интересующие вас вопросы!',
    call: 'Позвонить',
    whatsapp: 'WhatsApp',
  },

  // MobileStickyCTA (NEW)
  mobileCta: {
    call: 'Позвонить',
    whatsapp: 'WhatsApp',
  },

  // Footer (NEW)
  footer: {
    company: 'ООО «Гален»',
    address: 'г. Чебоксары, Лапсарский проезд, 15',
    ogrnLabel: 'ОГРН',
    emailLabel: 'Email',
    disclaimer:
      'Сертификаты соответствия и ISO предоставляются по запросу. Фотографии носят иллюстративный характер.',
    rights: `© ${new Date().getFullYear()} ROCKMESH. Все права защищены.`,
  },
} as const
