import { INotifyEcommerceProduct } from '@notify/interfaces';

export const ecommerceProducts: INotifyEcommerceProduct[] = [
  {
    id: 'basic-pvc',
    type: 'notify',
    name: 'Basic PVC ',
    price: 29.99,
    hero: '/assets/shop/tier-1.webp',
    images: [
      '/assets/shop/Tessere shop - Nero.webp',
      '/assets/shop/Tessere shop - Rosa.webp',
      '/assets/shop/Tessere shop - Rosso.webp',
      '/assets/shop/Tessere shop - Verde.webp',
      '/assets/shop/Tessere shop - Blu.webp',
      '/assets/shop/Tessere shop - Banana pattern Azzurro.webp',
      '/assets/shop/Tessere shop - Banana pattern Fucsia.webp',
      '/assets/shop/Tessere shop - Banana pattern Giallo.webp',
      '/assets/shop/Tessere shop - Hexagon Pattern Azzurro.webp',
      '/assets/shop/Tessere shop - Hexagon Pattern Fucsia.webp',
      '/assets/shop/Tessere shop - Hexagon Pattern Giallo.webp',
      '/assets/shop/Tessere shop - Hive Pattern Giallo.webp',
      '/assets/shop/Tessere shop - Hive Pattern Azzurro.webp',
      '/assets/shop/Tessere shop - Hive Pattern Fucsia.webp',
    ],
    short_description:
      'Card in PVC con grafica Notify, disponibile in diversi stili.',
    long_description: `Presentati con eleganza e innovazione con una tessera Basic PVC. Questo biglietto da visita unisce il prestigio di una tessera di alta qualità con la tecnologia NFC, permettendo ai tuoi contatti di accedere ai tuoi dettagli con un semplice tocco. Il logo Notify, sinonimo di avanguardia e professionalità, fa da cornice a un'esperienza di networking indimenticabile.
  
          Acquistando una card Basic PVC riceverai:
          - La card con lo stile che hai scelto.
          - Una licenza d'uso per Notify (in caso di acquisto multiplo sarà aggiunto uno slot utente alla licenza ricevuta).
          `,
    options: {
      usersInfo: false,
      qrCode: true,
      colors: [
        {
          label: 'Nero',
          id: 'nero',
          thumbnail: '/assets/cards/pastello/black_thumb.webp',
          image: '/assets/shop/Tessere shop - Nero.webp',
        },
        {
          label: 'Rosa',
          id: 'rosa',
          thumbnail: '/assets/cards/pastello/pink_thumb.webp',
          image: '/assets/shop/Tessere shop - Rosa.webp',
        },
        {
          label: 'Rosso',
          id: 'rosso',
          thumbnail: '/assets/cards/pastello/red_thumb.webp',
          image: '/assets/shop/Tessere shop - Rosso.webp',
        },
        {
          label: 'Blu',
          id: 'blu',
          thumbnail: '/assets/cards/pastello/blue_thumb.webp',
          image: '/assets/shop/Tessere shop - Blu.webp',
        },
        {
          label: 'Verde',
          id: 'verde',
          thumbnail: '/assets/cards/pastello/green_thumb.webp',
          image: '/assets/shop/Tessere shop - Verde.webp',
        },
        {
          label: 'Worms Pattern Azzurro',
          id: 'banana-azzurro',
          thumbnail: '/assets/cards/vermicelli/river_thumb.webp',
          image: '/assets/shop/Tessere shop - Banana pattern Azzurro.webp',
        },
        {
          label: 'Worms Pattern Fucsia',
          id: 'banana-fucsia',
          thumbnail: '/assets/cards/vermicelli/neon_thumb.webp',
          image: '/assets/shop/Tessere shop - Banana pattern Fucsia.webp',
        },
        {
          label: 'Worms Pattern Giallo',
          id: 'banana-giallo',
          thumbnail: '/assets/cards/vermicelli/banana_thumb.webp',
          image: '/assets/shop/Tessere shop - Banana pattern Giallo.webp',
        },
        {
          label: 'Hexagon Pattern Azzurro',
          id: 'cubi-azzurro',
          thumbnail: '/assets/cards/rombi/river_thumb.webp',
          image: '/assets/shop/Tessere shop - Hexagon Pattern Azzurro.webp',
        },
        {
          label: 'Hexagon Pattern Fucsia',
          id: 'cubi-fucsia',
          thumbnail: '/assets/cards/rombi/neon_thumb.webp',
          image: '/assets/shop/Tessere shop - Hexagon Pattern Fucsia.webp',
        },
        {
          label: 'Hexagon Pattern Giallo',
          id: 'cubi-giallo',
          thumbnail: '/assets/cards/rombi/banana_thumb.webp',
          image: '/assets/shop/Tessere shop - Hexagon Pattern Giallo.webp',
        },
        {
          label: 'Hive Pattern Azzurro',
          id: 'Hive-azzurro',
          thumbnail: '/assets/cards/esagoni/river_thumb.webp',
          image: '/assets/shop/Tessere shop - Hive Pattern Azzurro.webp',
        },
        {
          label: 'Hive Pattern Fucsia',
          id: 'Hive-fucsia',
          thumbnail: '/assets/cards/esagoni/neon_thumb.webp',
          image: '/assets/shop/Tessere shop - Hive Pattern Fucsia.webp',
        },
        {
          label: 'Hive Pattern Giallo',
          id: 'Hive-giallo',
          thumbnail: '/assets/cards/esagoni/banana_thumb.webp',
          image: '/assets/shop/Tessere shop - Hive Pattern Giallo.webp',
        },
      ],
      includesLicense: true,
    },
  },
  {
    id: 'personal-pvc',
    long_description: `Il biglietto da visita che combina il design sofisticato Notify con la tua identità personale. Il tuo nome è impresso sulla carta, rendendo ogni interazione unica e memorabile. Perfetto per chi desidera un tocco personale senza rinunciare all'innovazione.
  
          Acquistando una card Personal PVC riceverai:
          - La card con lo stile che hai scelto.
          - Una licenza d'uso per Notify (in caso di acquisto multiplo sarà aggiunto uno slot utente alla licenza ricevuta).`,
    type: 'notify',
    name: 'Personal PVC',
    price: 34.99,
    hero: '/assets/shop/tier-2.webp',
    images: [
      '/assets/shop/Tessere shop - Tier2 - Nero.webp',
      '/assets/shop/Tessere shop - Tier2 - Bianco.webp',
    ],
    short_description:
      'Card in PVC con logo e nome personalizzati, disponibile in 2 stili.',
    options: {
      usersInfo: true,
      logo: true,
      qrCode: true,
      includesLicense: true,
      colors: [
        {
          label: 'Bianco',
          id: 'white',
          thumbnail: '/assets/cards/personal/white_thumb.webp',
          image: '/assets/shop/Tessere shop - Tier2 - Bianco.webp',
        },
        {
          label: 'Nero',
          id: 'black',
          thumbnail: '/assets/cards/personal/black_thumb.webp',
          image: '/assets/shop/Tessere shop - Tier2 - Nero.webp',
        },
      ],
    },
  },
  {
    id: 'custom-pvc',
    long_description: `Crea un biglietto da visita che rispecchia al 100% il tuo brand, completamente personalizzato. Scegli ogni dettaglio, dal design ai colori, per un biglietto che parla davvero di te. 
        Con la tecnologia NFC integrata, basta un tocco per condividere i tuoi contatti, mentre il design su misura garantisce un'impressione duratura.
  
          Acquistando una card Personal PVC riceverai:
          - La card personalizzata.
          - Una licenza d'uso per Notify (in caso di acquisto multiplo sarà aggiunto uno slot utente alla licenza ricevuta).
  
        Il nostro team grafico ti contatterà per definire i dettagli della tua card una volta effettuato l'ordine.`,
    images: [
      // '/assets/shop/Tessere shop - custom - 4.webp',
      '/assets/shop/Tessere shop - custom - 1.webp',
      '/assets/shop/Tessere shop - custom - 2.webp',
      '/assets/shop/Tessere shop - custom - 3.webp',
      '/assets/shop/Tessere shop - custom - 5.webp',
    ],
    type: 'notify',
    name: 'Custom PVC',
    price: 44.99,
    hero: '/assets/shop/tier-3.webp',
    short_description:
      'Card in PVC interamente personalizzata secondo le tue esigenze.',
    options: {
      qrCode: true,
      includesLicense: true,
    },
  },
  {
    id: 'notify-digital',
    long_description:
      'Semplifica il tuo networking con Notify Digital, la soluzione digitale che trasforma il tuo smartphone in un biglietto da visita interattivo. Personalizza le informazioni in tempo reale, condividi i tuoi contatti istantaneamente e ottieni analisi dettagliate su chi visualizza il tuo profilo. Perfetto per chi vuole un approccio moderno ed ecologico senza la necessità di supporti fisici.',
    images: [
      '/assets/shop/Tessere shop - digital - 1.webp',
      '/assets/features/desktop-analytics.webp',
      '/assets/features/desktop-coworking.webp',
      '/assets/features/desktop-feedback.webp',
      '/assets/features/desktop-leads.webp',
      '/assets/features/desktop-notifications.webp',
      '/assets/features/desktop-profile.webp',
      '/assets/features/desktop-projects.webp',
      '/assets/features/desktop-sharing.webp',
      '/assets/features/desktop-team.webp',
    ],
    type: 'notify',
    name: 'Solo Licenza',
    price: 19.99,
    hero: '/assets/shop/license.webp',
    short_description:
      'La soluzione perfetta per chi vuole usare Notify senza una card fisiche.',
    options: {
      userCount: true,
      noQuantity: true,
    },
  },
  {
    id: 'google-review',
    long_description: '',
    images: [],
    type: 'reviews',
    name: 'Google',
    price: 19.99,
    hero: '/assets/shop/tier-2.webp',
    short_description:
      'Ottieni rapidamente recensioni positive su Google per il tuo business.',
    options: {},
  },
  {
    id: 'tripadvisor-review',
    long_description: '',
    images: [],
    type: 'reviews',
    name: 'Tripadvisor',
    price: 19.99,
    hero: '/assets/shop/tier-2.webp',
    short_description:
      'Ottieni rapidamente recensioni positive su Tripadvisor per il tuo business.',
    options: {},
  },
  {
    id: 'intagram-review',
    long_description: '',
    images: [],
    type: 'reviews',
    name: 'Instagram',
    price: 19.99,
    hero: '/assets/shop/tier-2.webp',
    short_description:
      'Ottieni rapidamente followers su Instagram per il tuo business.',
    options: {},
  },
];
