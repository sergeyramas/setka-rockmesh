export const product = {
  name: 'Сетка стеклопластиковая 5-150×150 мм',
  brand: 'ROCKMESH',
  manufacturer: {
    name: 'ООО «Гален»',
    city: 'Чебоксары',
    address: 'Лапсарский проезд, 15',
    ogrnNumber: '1022100979780',
    email: 'info@galencomposite.ru',
    phone: '+7 (8352) 24-25-90',
    website: 'galencomposite.ru',
  },
  price: 150,
  priceUnit: '₽/м²',
  specs: {
    cell: '150×150 мм',
    diameter: 'Ø 5 мм',
    cards: ['1.5×3 м', '2×3.1 м', '2.1×4.5 м'],
    material: 'Стеклопластик (GRP)',
    weight: 'до 650 г/м²',
  },
  photos: {
    main: '/photos/avito_01.jpg',
    gallery: [
      '/photos/avito_01.jpg',
      '/photos/avito_02.jpg',
      '/photos/avito_03.jpg',
      '/photos/avito_05.jpg',
      '/photos/avito_06.jpg',
    ],
    lab: '/photos/avito_04.jpg',
    compareKustar: '/photos/avito_03.jpg',
    compareRockmesh: '/photos/avito_02.jpg',
    certIso: '/photos/avito_09.jpg',
    certRustest: '/photos/avito_10.jpg',
  },
  certificates: [
    {
      name: 'ISO 9001:2015',
      issuer: 'Bureau Veritas',
      image: '/photos/avito_09.jpg',
    },
    {
      name: 'Сертификат соответствия',
      number: 'РОСС RU.АГ25.Н12228',
      issuer: 'Рус-Тест',
      image: '/photos/avito_10.jpg',
    },
  ],
  contact: {
    phone: '+7 (800) 200-18-49',           // PLACEHOLDER — BetaLine
    phoneDisplay: '8 (800) 200-18-49',      // PLACEHOLDER
    whatsappHandle: '@Andrei_Stanislavovich', // PLACEHOLDER
    whatsappLink: 'https://wa.me/78002001849', // PLACEHOLDER
  },
  carriers: ['СДЭК', 'Деловые Линии'],      // PLACEHOLDER
  seller: {
    name: 'Андрей',
    company: 'ООО',
    rating: 5 as const,
    reviews: 32,
    since: 2017,
    badges: ['Надёжный продавец', 'Реквизиты проверены'] as const,
  },
  objects: [                                 // PLACEHOLDER — заменить реальными
    {
      name: 'Лувр Абу-Даби',
      location: 'ОАЭ',
      image: '/codex/galen-factory.png',
    },
    {
      name: 'ЖК «Нанодом»',
      location: 'Москва',
      image: '/codex/galen-factory.png',
    },
    {
      name: 'ЖК «Снегири Эко»',
      location: 'Москва',
      image: '/codex/galen-factory.png',
    },
  ],
  composition: [
    {
      key: 'fiber',
      label: 'Стеклопластиковое волокно',
      sub: 'Внутренняя несущая жила из E-glass',
      image: '/codex/composition-fiber.png',
    },
    {
      key: 'resin',
      label: 'Эпоксидно-аминная смола',
      sub: 'Аминные отвердители защищают от щёлочи',
      image: '/codex/composition-resin.png',
    },
    {
      key: 'sand',
      label: 'Кварцево-песчаное покрытие',
      sub: 'Обеспечивает надёжное сцепление с бетоном',
      image: '/codex/composition-sand.png',
    },
    {
      key: 'knot',
      label: 'Полимерный узел вязки',
      sub: 'Фиксирует геометрию ячейки под нагрузкой',
      image: '/codex/composition-knot.png',
    },
  ],
  useCases: [
    {
      key: 'masonry',
      label: 'Кладка стен из кирпича и блоков',
      image: '/codex/usecase-masonry.png',
    },
    {
      key: 'screed',
      label: 'Заливка бетонных полов и стяжек',
      image: '/codex/usecase-screed.png',
    },
    {
      key: 'path',
      label: 'Строительство дорожек и площадок',
      image: '/codex/usecase-path.png',
    },
    {
      key: 'facade',
      label: 'Укрепление фундаментов и отмосток',
      image: '/codex/usecase-facade.png',
    },
  ],
} as const
