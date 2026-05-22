import { HeroKey } from '../store/heroScoring';

// ─────────────────────────────────────────────────────────────────────────────
// HERO META TYPE
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroMeta {
  name: string;
  tagline: string;
  era: string;
  tag: string;
  description: string;
  traits: { iconName: string; label: string; sublabel: string }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO CATALOGUE
// Maps every HeroKey to the display data shown on the result screen.
// Add / edit entries here as the roster grows.
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_CATALOGUE: Record<HeroKey, HeroMeta> = {
  jose_rizal: {
    name: 'Jose Rizal',
    tagline: 'Ilustrado · Manunulat · Bayani ng Bansa',
    era: '1861 – 1896',
    tag: 'ILUSTRADO',
    description:
      'Your personality aligns with the national hero of the Philippines. Like Rizal, you value education, intellect, and peaceful reform. You believe that the pen is mightier than the sword.',
    traits: [
      { iconName: 'book',    label: 'Makatalino', sublabel: 'Intellectual' },
      { iconName: 'pencil',  label: 'Malikhaing', sublabel: 'Creative'     },
      { iconName: 'heart',   label: 'Makatao',    sublabel: 'Humanist'     },
      { iconName: 'globe',   label: 'Makabayan',  sublabel: 'Nationalist'  },
    ],
  },
  andres_bonifacio: {
    name: 'Andres Bonifacio',
    tagline: 'Mandirigma · Lider ng Masa · Ama ng Rebolusyon',
    era: '1863 – 1897',
    tag: 'MAGITING',
    description:
      'You share the fire of the Supremo. Like Bonifacio, you champion the oppressed, act with urgency, and believe that freedom is worth any sacrifice.',
    traits: [
      { iconName: 'fist',  label: 'Matapang',    sublabel: 'Courageous' },
      { iconName: 'users', label: 'Maka-masa',   sublabel: 'Pro-people' },
      { iconName: 'bolt',  label: 'Determinado', sublabel: 'Determined' },
      { iconName: 'heart', label: 'Mapagmahal',  sublabel: 'Passionate' },
    ],
  },
  gen_antonio_luna: {
    name: 'Gen. Antonio Luna',
    tagline: 'Heneral · Siyentipiko · Disiplinado',
    era: '1866 – 1899',
    tag: 'HENERAL',
    description:
      'You carry the intensity and brilliance of General Luna. You hold others — and yourself — to the highest standards, and you refuse to compromise on what is right.',
    traits: [
      { iconName: 'shield', label: 'Disiplinado', sublabel: 'Disciplined' },
      { iconName: 'bolt',   label: 'Mabilis',     sublabel: 'Swift'       },
      { iconName: 'star',   label: 'Mahuhusay',   sublabel: 'Excellent'   },
      { iconName: 'eye',    label: 'Mapanuri',    sublabel: 'Analytical'  },
    ],
  },
  apolinario_mabini: {
    name: 'Apolinario Mabini',
    tagline: 'Utak ng Rebolusyon · Manunulat · Estratehista',
    era: '1864 – 1903',
    tag: 'UTAK',
    description:
      'Like Mabini, you are the quiet strategist whose mind shapes events. You think before you act and your principles are unshakeable even under pressure.',
    traits: [
      { iconName: 'lightbulb-o',   label: 'Matalino',     sublabel: 'Brilliant' },
      { iconName: 'balance-scale', label: 'Makatarungan', sublabel: 'Just'      },
      { iconName: 'pencil',        label: 'Manunulat',    sublabel: 'Writer'    },
      { iconName: 'anchor',        label: 'Matatag',      sublabel: 'Steadfast' },
    ],
  },
  marcelo_del_pilar: {
    name: 'Marcelo del Pilar',
    tagline: 'Propagandista · Editor · Kritiko',
    era: '1850 – 1896',
    tag: 'PROPAGANDISTA',
    description:
      'You wield words as weapons for truth. Like del Pilar, you challenge authority through sharp wit and refuse to let injustice go unaddressed.',
    traits: [
      { iconName: 'pencil',   label: 'Manunulat',   sublabel: 'Writer'   },
      { iconName: 'bullhorn', label: 'Mapanghamon', sublabel: 'Bold'     },
      { iconName: 'search',   label: 'Kritikal',    sublabel: 'Critical' },
      { iconName: 'globe',    label: 'Makabayan',   sublabel: 'Patriot'  },
    ],
  },
  graciano_lopez_jaena: {
    name: 'Graciano Lopez Jaena',
    tagline: 'Manunulat · Orador · Propagandista',
    era: '1856 – 1896',
    tag: 'ORADOR',
    description:
      'Your voice carries the power of Lopez Jaena. You speak truth to power and inspire others through your eloquence and passion for justice.',
    traits: [
      { iconName: 'microphone', label: 'Marunong magsalita', sublabel: 'Eloquent'  },
      { iconName: 'fire',       label: 'Maningas',           sublabel: 'Passionate' },
      { iconName: 'pencil',     label: 'Manunulat',          sublabel: 'Writer'    },
      { iconName: 'heart',      label: 'Mapagmalasakit',     sublabel: 'Caring'    },
    ],
  },
  emilio_jacinto: {
    name: 'Emilio Jacinto',
    tagline: 'Utak ng Katipunan · Manunulat · Rebolusyonaryo',
    era: '1875 – 1899',
    tag: 'KATIPUNERO',
    description:
      'You share the rare combination of intellect and revolutionary fire that defined Emilio Jacinto. Your idealism drives you to fight for genuine change.',
    traits: [
      { iconName: 'book',   label: 'Edukado',        sublabel: 'Educated'      },
      { iconName: 'fire',   label: 'Rebolusyonaryo', sublabel: 'Revolutionary' },
      { iconName: 'pencil', label: 'Manunulat',      sublabel: 'Writer'        },
      { iconName: 'star',   label: 'Perpeksyonista', sublabel: 'Idealist'      },
    ],
  },
  gen_gregorio_del_pilar: {
    name: 'Gen. Gregorio del Pilar',
    tagline: 'Batang Heneral · Bayani ng Tirad Pass',
    era: '1875 – 1899',
    tag: 'BATANG HENERAL',
    description:
      'Young, brave, and selfless — like the Boy General. You lead from the front and are willing to give everything for those who depend on you.',
    traits: [
      { iconName: 'shield', label: 'Matapang',   sublabel: 'Brave'       },
      { iconName: 'users',  label: 'Tapat',      sublabel: 'Loyal'       },
      { iconName: 'star',   label: 'Sakripisyo', sublabel: 'Sacrificial' },
      { iconName: 'heart',  label: 'Mapagmahal', sublabel: 'Devoted'     },
    ],
  },
  gen_emilio_aguinaldo: {
    name: 'Gen. Emilio Aguinaldo',
    tagline: 'Unang Pangulo · Heneral · Estadista',
    era: '1869 – 1964',
    tag: 'PANGULO',
    description:
      'Like Aguinaldo, you are a pragmatic leader who navigates complex situations with calculated resolve, always keeping the bigger picture in mind.',
    traits: [
      { iconName: 'flag',   label: 'Lider',        sublabel: 'Leader'      },
      { iconName: 'cogs',   label: 'Estratehista', sublabel: 'Strategist'  },
      { iconName: 'shield', label: 'Matatag',      sublabel: 'Resilient'   },
      { iconName: 'globe',  label: 'Makabayan',    sublabel: 'Nationalist' },
    ],
  },
  gabriela_silang: {
    name: 'Gabriela Silang',
    tagline: 'Mandirigma · Lider · Bayani ng Ilocos',
    era: '1731 – 1763',
    tag: 'MANDIRIGMA',
    description:
      'You carry the indomitable spirit of Gabriela Silang. You rise even in the face of loss and fight for your people with unwavering courage.',
    traits: [
      { iconName: 'shield', label: 'Matapang',    sublabel: 'Courageous' },
      { iconName: 'heart',  label: 'Matatag',     sublabel: 'Resilient'  },
      { iconName: 'users',  label: 'Lider',       sublabel: 'Leader'     },
      { iconName: 'star',   label: 'Inspirasyon', sublabel: 'Inspiring'  },
    ],
  },
  diego_silang: {
    name: 'Diego Silang',
    tagline: 'Rebolusyonaryo · Lider ng Ilocos',
    era: '1730 – 1763',
    tag: 'REBELDE',
    description:
      'Like Diego Silang, you are a bold rebel who challenges unjust systems and rallies others to demand what is rightfully theirs.',
    traits: [
      { iconName: 'bolt',  label: 'Matapang',            sublabel: 'Daring'     },
      { iconName: 'users', label: 'Tagasuporta ng masa', sublabel: 'Champion'   },
      { iconName: 'fire',  label: 'Determinado',         sublabel: 'Determined' },
      { iconName: 'globe', label: 'Makabayan',           sublabel: 'Patriot'    },
    ],
  },
  melchora_aquino: {
    name: 'Melchora Aquino',
    tagline: 'Tandang Sora · Ina ng Rebolusyon',
    era: '1812 – 1919',
    tag: 'INA NG BAYAN',
    description:
      'Like Tandang Sora, you are the quiet backbone of every struggle — nurturing, steadfast, and selflessly devoted to those you protect.',
    traits: [
      { iconName: 'heart',  label: 'Mapagmalasakit', sublabel: 'Caring'    },
      { iconName: 'anchor', label: 'Matatag',        sublabel: 'Steadfast' },
      { iconName: 'users',  label: 'Mapagbigay',     sublabel: 'Generous'  },
      { iconName: 'shield', label: 'Matibay',        sublabel: 'Resilient' },
    ],
  },
  gregoria_de_jesus: {
    name: 'Gregoria de Jesus',
    tagline: 'Lakambini ng Katipunan · Mandirigma',
    era: '1875 – 1943',
    tag: 'LAKAMBINI',
    description:
      'You embody the quiet fire of Gregoria de Jesus — fiercely loyal, deeply principled, and willing to endure anything for the cause you love.',
    traits: [
      { iconName: 'heart',  label: 'Tapat na pagmamahal', sublabel: 'Devoted'   },
      { iconName: 'shield', label: 'Matapang',            sublabel: 'Brave'     },
      { iconName: 'star',   label: 'Inspirasyon',         sublabel: 'Inspiring' },
      { iconName: 'anchor', label: 'Matatag',             sublabel: 'Steadfast' },
    ],
  },
  lapu_lapu: {
    name: 'Lapu-Lapu',
    tagline: 'Unang Bayani · Tagapagtanggol ng Mactan',
    era: 'c. 1491 – unknown',
    tag: 'UNANG BAYANI',
    description:
      'You stand firm like Lapu-Lapu — unwilling to surrender your freedom or identity to any force, no matter how powerful.',
    traits: [
      { iconName: 'shield', label: 'Matapang',       sublabel: 'Fearless'   },
      { iconName: 'anchor', label: 'Hindi sumusuko', sublabel: 'Unyielding' },
      { iconName: 'flag',   label: 'Lider',          sublabel: 'Leader'     },
      { iconName: 'heart',  label: 'Makabayan',      sublabel: 'Patriot'    },
    ],
  },
  juan_luna: {
    name: 'Juan Luna',
    tagline: 'Pintor · Propagandista · Bayani',
    era: '1857 – 1899',
    tag: 'PINTOR',
    description:
      'Like Juan Luna, your greatest strength is your art and your passion. You express your love of country through your creativity and refuse to be silenced.',
    traits: [
      { iconName: 'paint-brush', label: 'Malikhaing', sublabel: 'Creative'  },
      { iconName: 'fire',        label: 'Maningas',   sublabel: 'Passionate' },
      { iconName: 'globe',       label: 'Makabayan',  sublabel: 'Patriot'   },
      { iconName: 'star',        label: 'Mahuhusay',  sublabel: 'Excellent' },
    ],
  },
  epifanio_de_los_santos: {
    name: 'Epifanio de los Santos',
    tagline: 'Mananalaysay · Iskolar · Tagapagtago ng Kasaysayan',
    era: '1871 – 1928',
    tag: 'ISKOLAR',
    description:
      'Like E. de los Santos, you are the keeper of memory — you believe that knowing the past is essential to shaping the future.',
    traits: [
      { iconName: 'book',    label: 'Iskolar',     sublabel: 'Scholar'         },
      { iconName: 'search',  label: 'Mapanuri',    sublabel: 'Research-minded' },
      { iconName: 'archive', label: 'Tagapagtago', sublabel: 'Preserver'       },
      { iconName: 'globe',   label: 'Makabayan',   sublabel: 'Nationalist'     },
    ],
  },
  mariano_ponce: {
    name: 'Mariano Ponce',
    tagline: 'Doktor · Propagandista · Diplomat',
    era: '1863 – 1918',
    tag: 'DIPLOMAT',
    description:
      'Like Mariano Ponce, you work quietly behind the scenes — building alliances, gathering resources, and ensuring the mission succeeds through careful diplomacy.',
    traits: [
      { iconName: 'handshake-o', label: 'Diplomatiko',  sublabel: 'Diplomatic' },
      { iconName: 'globe',       label: 'Makabayan',    sublabel: 'Nationalist' },
      { iconName: 'cogs',        label: 'Estratehista', sublabel: 'Strategic'  },
      { iconName: 'pencil',      label: 'Manunulat',    sublabel: 'Writer'     },
    ],
  },
  felipe_agoncillo: {
    name: 'Felipe Agoncillo',
    tagline: 'Unang Diplomat ng Pilipinas',
    era: '1859 – 1941',
    tag: 'DIPLOMAT',
    description:
      'You carry the precision and patience of Agoncillo. You believe in winning battles through negotiation, persuasion, and well-timed advocacy.',
    traits: [
      { iconName: 'handshake-o',   label: 'Diplomatiko',  sublabel: 'Diplomatic' },
      { iconName: 'balance-scale', label: 'Makatarungan', sublabel: 'Just'       },
      { iconName: 'globe',         label: 'Makabayan',    sublabel: 'Nationalist' },
      { iconName: 'cogs',          label: 'Matalino',     sublabel: 'Clever'     },
    ],
  },
  rafael_palma: {
    name: 'Rafael Palma',
    tagline: 'Senador · Manunulat · Edukador',
    era: '1874 – 1939',
    tag: 'EDUKADOR',
    description:
      'Like Rafael Palma, you believe that education and integrity are the foundations of a just society. You lead by example and uplift those around you.',
    traits: [
      { iconName: 'graduation-cap', label: 'Edukador',  sublabel: 'Educator'   },
      { iconName: 'balance-scale',  label: 'Matapat',   sublabel: 'Principled' },
      { iconName: 'pencil',         label: 'Manunulat', sublabel: 'Writer'     },
      { iconName: 'users',          label: 'Lider',     sublabel: 'Leader'     },
    ],
  },
  panday_pira: {
    name: 'Panday Pira',
    tagline: 'Pandaykanlero · Tagagawa ng Kanyon',
    era: 'c. 1483 – c. 1576',
    tag: 'PANDAYKANLERO',
    description:
      'Like Panday Pira, you are the craftsman whose work changes the course of history — precise, dedicated, and proud of your skill.',
    traits: [
      { iconName: 'wrench', label: 'Bihasang manggagawa', sublabel: 'Craftsman'  },
      { iconName: 'cogs',   label: 'Malikhain',           sublabel: 'Innovative' },
      { iconName: 'star',   label: 'Mahuhusay',           sublabel: 'Expert'     },
      { iconName: 'flag',   label: 'Makabayan',           sublabel: 'Patriot'    },
    ],
  },
  leona_florentino: {
    name: 'Leona Florentino',
    tagline: 'Ina ng Panitikang Pilipino · Makata',
    era: '1849 – 1884',
    tag: 'MAKATA',
    description:
      'Like Leona Florentino, you use the power of language and art to preserve what is beautiful and true about your culture.',
    traits: [
      { iconName: 'pencil', label: 'Makata',       sublabel: 'Poet'      },
      { iconName: 'heart',  label: 'Sensitibo',    sublabel: 'Sensitive' },
      { iconName: 'book',   label: 'Mapag-aralan', sublabel: 'Learned'   },
      { iconName: 'star',   label: 'Natatangi',    sublabel: 'Unique'    },
    ],
  },
  francisco_baltazar: {
    name: 'Francisco Baltazar',
    tagline: 'Balagtas · Prinsipe ng Makatang Pilipino',
    era: '1788 – 1862',
    tag: 'BALAGTAS',
    description:
      'You carry the soul of Balagtas — your artistry speaks of truth, love, and the enduring beauty of the Filipino spirit.',
    traits: [
      { iconName: 'pencil', label: 'Makata',     sublabel: 'Poet'     },
      { iconName: 'heart',  label: 'Mapagmahal', sublabel: 'Loving'   },
      { iconName: 'book',   label: 'Edukado',    sublabel: 'Educated' },
      { iconName: 'star',   label: 'Malikhaing', sublabel: 'Creative' },
    ],
  },
  trinidad_tecson: {
    name: 'Trinidad Tecson',
    tagline: 'Ina ng Biak-na-Bato · Mandirigma',
    era: '1848 – 1928',
    tag: 'INA NG DIGMAAN',
    description:
      'Like Tecson, you are fierce and tireless in protecting those you love. You stand in the front lines so others may live.',
    traits: [
      { iconName: 'shield', label: 'Matapang',       sublabel: 'Brave'     },
      { iconName: 'heart',  label: 'Mapagmalasakit', sublabel: 'Caring'    },
      { iconName: 'anchor', label: 'Matatag',        sublabel: 'Steadfast' },
      { iconName: 'users',  label: 'Tagapagtanggol', sublabel: 'Protector' },
    ],
  },
  artemio_ricarte: {
    name: 'Artemio Ricarte',
    tagline: 'Heneral · Vibora · Hindi Sumusuko',
    era: '1866 – 1945',
    tag: 'VIBORA',
    description:
      'Like Ricarte, your loyalty to your principles is absolute. You refuse to compromise your convictions, even at great personal cost.',
    traits: [
      { iconName: 'shield', label: 'Matibay ang loob', sublabel: 'Resolute'        },
      { iconName: 'anchor', label: 'Hindi nagbibigay', sublabel: 'Uncompromising'  },
      { iconName: 'star',   label: 'Tapat',            sublabel: 'Loyal'           },
      { iconName: 'bolt',   label: 'Determinado',      sublabel: 'Determined'      },
    ],
  },
  isabelo_de_los_reyes: {
    name: 'Isabelo de los Reyes',
    tagline: 'Mananalaysay · Manggagawa · Reformista',
    era: '1864 – 1938',
    tag: 'REFORMISTA',
    description:
      'Like Don Belong, you believe in the power of workers, culture, and truth to reshape society from the ground up.',
    traits: [
      { iconName: 'book',   label: 'Mananalaysay',   sublabel: 'Historian'      },
      { iconName: 'users',  label: 'Pro-manggagawa', sublabel: 'Labor advocate' },
      { iconName: 'pencil', label: 'Manunulat',      sublabel: 'Writer'         },
      { iconName: 'globe',  label: 'Makabayan',      sublabel: 'Nationalist'    },
    ],
  },
  jose_burgos: {
    name: 'Fr. Jose Burgos',
    tagline: 'Martir · Pari · Reformista',
    era: '1837 – 1872',
    tag: 'MARTIR',
    description:
      'You speak the truth even when silence would be safer. Like Burgos, you believe that clergy and citizens alike must stand against injustice.',
    traits: [
      { iconName: 'bullhorn',      label: 'Matapang',     sublabel: 'Bold'        },
      { iconName: 'balance-scale', label: 'Makatarungan', sublabel: 'Just'        },
      { iconName: 'heart',         label: 'Maka-Diyos',  sublabel: 'Faithful'    },
      { iconName: 'star',          label: 'Sakripisyo',  sublabel: 'Sacrificial' },
    ],
  },
  mariano_gomez: {
    name: 'Fr. Mariano Gomez',
    tagline: 'Martir · Pari · GomBurZa',
    era: '1799 – 1872',
    tag: 'MARTIR',
    description:
      'Like Fr. Gomez, your quiet dedication and moral courage inspire generations long after you are gone.',
    traits: [
      { iconName: 'heart',  label: 'Maka-Diyos',  sublabel: 'Faithful'    },
      { iconName: 'anchor', label: 'Matatag',      sublabel: 'Steadfast'   },
      { iconName: 'users',  label: 'Mapaglingkod', sublabel: 'Servant'     },
      { iconName: 'star',   label: 'Sakripisyo',  sublabel: 'Sacrificial' },
    ],
  },
  jacinto_zamora: {
    name: 'Fr. Jacinto Zamora',
    tagline: 'Martir · Pari · GomBurZa',
    era: '1835 – 1872',
    tag: 'MARTIR',
    description:
      'Like Fr. Zamora, you believe that justice is sacred and worth defending at any cost, even when the odds are overwhelmingly against you.',
    traits: [
      { iconName: 'heart',         label: 'Maka-Diyos',   sublabel: 'Faithful'    },
      { iconName: 'balance-scale', label: 'Makatarungan', sublabel: 'Just'        },
      { iconName: 'shield',        label: 'Matibay',      sublabel: 'Resilient'   },
      { iconName: 'star',          label: 'Sakripisyo',  sublabel: 'Sacrificial' },
    ],
  },
  rajah_sulayman: {
    name: 'Rajah Sulayman',
    tagline: 'Pinuno ng Maynila · Tagapagtanggol ng Kalayaan',
    era: 'c. 1558 – 1575',
    tag: 'RAJAH',
    description:
      'Like Sulayman, you refuse to bow to foreign power. You defend your home and your people with the full force of your conviction.',
    traits: [
      { iconName: 'flag',   label: 'Lider',         sublabel: 'Leader'     },
      { iconName: 'shield', label: 'Matapang',       sublabel: 'Fearless'   },
      { iconName: 'anchor', label: 'Hindi sumusuko', sublabel: 'Unyielding' },
      { iconName: 'heart',  label: 'Makabayan',      sublabel: 'Patriot'    },
    ],
  },
  lakandula: {
    name: 'Lakandula',
    tagline: 'Pinuno ng Tondo · Diplomat',
    era: 'c. 1515 – 1589',
    tag: 'LAKAN',
    description:
      'Like Lakandula, you seek peace through wisdom — but you will act decisively when those you lead are threatened.',
    traits: [
      { iconName: 'handshake-o',   label: 'Diplomatiko',    sublabel: 'Diplomatic' },
      { iconName: 'users',         label: 'Lider',          sublabel: 'Leader'     },
      { iconName: 'balance-scale', label: 'Matalino',       sublabel: 'Wise'       },
      { iconName: 'heart',         label: 'Mapagmalasakit', sublabel: 'Caring'     },
    ],
  },
  leonor_rivera: {
    name: 'Leonor Rivera',
    tagline: 'Kasintahan ni Rizal · Matatag na Pag-ibig',
    era: '1867 – 1893',
    tag: 'MATATAG',
    description:
      'Like Leonor Rivera, your love and loyalty are your strength. You endure quietly, but your devotion fuels those who fight beside you.',
    traits: [
      { iconName: 'heart',  label: 'Tapat na pagmamahal', sublabel: 'Devoted'    },
      { iconName: 'anchor', label: 'Matatag',             sublabel: 'Steadfast'  },
      { iconName: 'star',   label: 'Mapagbigay',          sublabel: 'Selfless'   },
      { iconName: 'users',  label: 'Mapagalalay',         sublabel: 'Supportive' },
    ],
  },
  marcela_agoncillo: {
    name: 'Marcela Agoncillo',
    tagline: 'Manahi ng Bandila · Bayani sa Tahanan',
    era: '1860 – 1946',
    tag: 'MANAHI',
    description:
      'Like Marcela Agoncillo, you shape history through craft, love, and the quiet power of what you build with your own hands.',
    traits: [
      { iconName: 'heart', label: 'Malikhaing', sublabel: 'Creative'   },
      { iconName: 'star',  label: 'Mapagbigay', sublabel: 'Selfless'   },
      { iconName: 'users', label: 'Maaasahan',  sublabel: 'Dependable' },
      { iconName: 'flag',  label: 'Makabayan',  sublabel: 'Patriot'    },
    ],
  },
  galicano_apacible: {
    name: 'Galicano Apacible',
    tagline: 'Propagandista · Diplomat · Abogado',
    era: '1864 – 1949',
    tag: 'PROPAGANDISTA',
    description:
      'Like Apacible, you work steadily behind the scenes — building networks, writing, and advocating until the right moment arrives.',
    traits: [
      { iconName: 'handshake-o', label: 'Diplomatiko',  sublabel: 'Diplomatic' },
      { iconName: 'pencil',      label: 'Manunulat',    sublabel: 'Writer'     },
      { iconName: 'cogs',        label: 'Estratehista', sublabel: 'Strategic'  },
      { iconName: 'globe',       label: 'Makabayan',    sublabel: 'Patriot'    },
    ],
  },
  jose_ma_panganiban: {
    name: 'Jose Ma. Panganiban',
    tagline: 'Manunulat · Propagandista · Makata',
    era: '1863 – 1890',
    tag: 'MAKATA',
    description:
      'Like Panganiban, you celebrate your language and culture as acts of patriotism, expressing your love of country through your art.',
    traits: [
      { iconName: 'pencil', label: 'Makata',     sublabel: 'Poet'     },
      { iconName: 'book',   label: 'Edukado',    sublabel: 'Learned'  },
      { iconName: 'heart',  label: 'Makabayan',  sublabel: 'Patriot'  },
      { iconName: 'star',   label: 'Malikhaing', sublabel: 'Creative' },
    ],
  },
  pedro_paterno: {
    name: 'Pedro Paterno',
    tagline: 'Manunulat · Diplomat · Mananalaysay',
    era: '1857 – 1911',
    tag: 'ISKOLAR',
    description:
      'Like Paterno, you bridge worlds — using your intellect and connections to create opportunities for your people on the world stage.',
    traits: [
      { iconName: 'book',        label: 'Iskolar',     sublabel: 'Scholar'     },
      { iconName: 'handshake-o', label: 'Diplomatiko', sublabel: 'Diplomatic'  },
      { iconName: 'pencil',      label: 'Manunulat',   sublabel: 'Writer'      },
      { iconName: 'globe',       label: 'Makabayan',   sublabel: 'Nationalist' },
    ],
  },
  marina_dizon: {
    name: 'Marina Dizon',
    tagline: 'Katipunera · Lihim na Bayani',
    era: '1875 – 1920',
    tag: 'KATIPUNERA',
    description:
      'Like Marina Dizon, you work quietly but with total commitment — keeping the network alive and carrying the mission forward when others cannot.',
    traits: [
      { iconName: 'users',  label: 'Tapat',          sublabel: 'Loyal'     },
      { iconName: 'shield', label: 'Matapang',        sublabel: 'Brave'     },
      { iconName: 'heart',  label: 'Mapagmalasakit',  sublabel: 'Caring'    },
      { iconName: 'star',   label: 'Dedikado',        sublabel: 'Dedicated' },
    ],
  },
  agueda_esteban: {
    name: 'Agueda Esteban',
    tagline: 'Katipunera · Bayani ng Sambayanan',
    era: 'c. 1875 – unknown',
    tag: 'KATIPUNERA',
    description:
      'Like Agueda Esteban, you are moved by the suffering of others and take action where most would look away.',
    traits: [
      { iconName: 'heart',  label: 'Mapagmalasakit', sublabel: 'Compassionate' },
      { iconName: 'shield', label: 'Matapang',       sublabel: 'Brave'         },
      { iconName: 'users',  label: 'Tagapagtanggol', sublabel: 'Protector'     },
      { iconName: 'star',   label: 'Dedikado',       sublabel: 'Dedicated'     },
    ],
  },
  francisco_dagohoy: {
    name: 'Francisco Dagohoy',
    tagline: 'Pinakamahaba ang Pag-aalsa · Laban sa Kolonya',
    era: '1724 – 1763',
    tag: 'REBELDE',
    description:
      'Like Dagohoy, you are relentless. You wage the long fight — not for glory but for the simple right to live freely on your own land.',
    traits: [
      { iconName: 'anchor', label: 'Hindi sumusuko', sublabel: 'Unyielding' },
      { iconName: 'shield', label: 'Matapang',       sublabel: 'Brave'      },
      { iconName: 'fire',   label: 'Determinado',    sublabel: 'Determined' },
      { iconName: 'heart',  label: 'Makabayan',      sublabel: 'Patriot'    },
    ],
  },
  teresa_magbanua: {
    name: 'Teresa Magbanua',
    tagline: 'Visayan Joan of Arc · Mandirigma',
    era: '1868 – 1947',
    tag: 'MANDIRIGMA',
    description:
      'Like Magbanua, you shatter every expectation. You lead fearlessly where others hesitate and fight not for recognition but for what is right.',
    traits: [
      { iconName: 'shield', label: 'Matapang',    sublabel: 'Fearless'   },
      { iconName: 'users',  label: 'Lider',       sublabel: 'Leader'     },
      { iconName: 'star',   label: 'Inspirasyon', sublabel: 'Inspiring'  },
      { iconName: 'bolt',   label: 'Determinado', sublabel: 'Determined' },
    ],
  },
  fernando_guerrero: {
    name: 'Fernando Ma. Guerrero',
    tagline: 'Makata · Propagandista · Peryodista',
    era: '1873 – 1929',
    tag: 'MAKATA',
    description:
      'Like Guerrero, your pen is your protest. You celebrate the Filipino through language and art, making beauty itself an act of resistance.',
    traits: [
      { iconName: 'pencil', label: 'Makata',     sublabel: 'Poet'       },
      { iconName: 'book',   label: 'Peryodista', sublabel: 'Journalist' },
      { iconName: 'heart',  label: 'Makabayan',  sublabel: 'Patriot'    },
      { iconName: 'star',   label: 'Malikhaing', sublabel: 'Creative'   },
    ],
  },
  jose_palma: {
    name: 'Jose Palma',
    tagline: 'Makata ng Pambansang Awit · Katipunero',
    era: '1876 – 1903',
    tag: 'MAKATA',
    description:
      'Like Jose Palma, you give your country a voice — your words become the anthem that binds a people together.',
    traits: [
      { iconName: 'pencil', label: 'Makata',     sublabel: 'Poet'      },
      { iconName: 'music',  label: 'Malikhaing', sublabel: 'Artistic'  },
      { iconName: 'heart',  label: 'Makabayan',  sublabel: 'Patriot'   },
      { iconName: 'star',   label: 'Inspirasyon', sublabel: 'Inspiring' },
    ],
  },
  julian_felipe: {
    name: 'Julian Felipe',
    tagline: 'Kompositor ng Lupang Hinirang',
    era: '1861 – 1944',
    tag: 'KOMPOSITOR',
    description:
      'Like Julian Felipe, you channel your deepest feelings into something that outlasts you — a gift to every Filipino who comes after.',
    traits: [
      { iconName: 'music',  label: 'Musikero',            sublabel: 'Musician' },
      { iconName: 'heart',  label: 'Malalim na damdamin', sublabel: 'Soulful'  },
      { iconName: 'star',   label: 'Malikhaing',          sublabel: 'Creative' },
      { iconName: 'flag',   label: 'Makabayan',           sublabel: 'Patriot'  },
    ],
  },
};

// ── Fallback hero data if somehow no match ────────────────────────────────────
export const FALLBACK_HERO: HeroMeta = {
  name: 'Bayani ng Pilipinas',
  tagline: 'Mandirigma · Makata · Bayani',
  era: '—',
  tag: 'BAYANI',
  description:
    'Your story is still being written. Every question you answered reflects a part of the Filipino spirit — brave, creative, and devoted to truth.',
  traits: [
    { iconName: 'star',   label: 'Makabayan',  sublabel: 'Nationalist' },
    { iconName: 'heart',  label: 'Mapagmahal', sublabel: 'Loving'      },
    { iconName: 'shield', label: 'Matapang',   sublabel: 'Brave'       },
    { iconName: 'book',   label: 'Matalino',   sublabel: 'Intelligent' },
  ],
};

// ── Helper: convert HeroKey to display name ───────────────────────────────────
export function formatHeroKey(key: HeroKey): string {
  return HERO_CATALOGUE[key]?.name ?? key.replace(/_/g, ' ');
}