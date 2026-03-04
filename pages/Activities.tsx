
import React, { useState, useEffect, useRef } from 'react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { AudioService } from '../services/audio';
import { View } from '../types';
import {
  Loader2, BrainCircuit, Trophy, Star, Music, Book,
  ArrowRight, Check, X, ArrowLeft, Zap, ScrollText, Music2, Goal,
  AlertCircle, RefreshCcw, Flame, Crown, Sparkles, Lock, Home
} from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

interface ActivitiesPageProps {
  onNavigate?: (view: View) => void;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  funnyComment?: string;
}

type LocalBibleQuestion = {
  question: { en: string; de: string };
  options: { en: string[]; de: string[] };
  correctIndex: number;
  explanation: { en: string; de: string };
  funnyComment?: { en: string; de: string };
};

const LOCAL_BIBLE_BANK: Record<string, LocalBibleQuestion[]> = {
  creation: [
    {
      question: {
        en: 'Who built the ark to survive the flood?',
        de: 'Wer baute die Arche, um die Sintflut zu überstehen?'
      },
      options: {
        en: ['Noah', 'Abraham', 'Moses', 'Isaac'],
        de: ['Noah', 'Abraham', 'Mose', 'Isaak']
      },
      correctIndex: 0,
      explanation: {
        en: 'Noah obeyed God and built the ark exactly as instructed.',
        de: 'Noah gehorchte Gott und baute die Arche genau nach Anweisung.'
      },
      funnyComment: {
        en: 'Boat-building masterclass.',
        de: 'Bootsbau-Meisterklasse.'
      }
    },
    {
      question: {
        en: 'What did God create on the first day?',
        de: 'Was schuf Gott am ersten Tag?'
      },
      options: {
        en: ['Light', 'Animals', 'People', 'Plants'],
        de: ['Licht', 'Tiere', 'Menschen', 'Pflanzen']
      },
      correctIndex: 0,
      explanation: {
        en: 'God said, “Let there be light” before anything else.',
        de: 'Gott sprach: „Es werde Licht“ noch bevor etwas anderes entstand.'
      }
    }
  ],
  patriarchs: [
    {
      question: {
        en: 'Who received the promise of descendants as numerous as the stars?',
        de: 'Wer erhielt das Versprechen zahlreicher Nachkommen wie die Sterne?'
      },
      options: {
        en: ['Isaac', 'Jacob', 'Abraham', 'Moses'],
        de: ['Isaak', 'Jakob', 'Abraham', 'Mose']
      },
      correctIndex: 2,
      explanation: {
        en: 'God made that covenant with Abraham.',
        de: 'Gott schloss diesen Bund mit Abraham.'
      }
    },
    {
      question: {
        en: 'Which wife became pregnant with Isaac after many years of waiting?',
        de: 'Welche Frau wurde nach langer Wartezeit Mutter von Isaak?'
      },
      options: {
        en: ['Sarah', 'Rebekah', 'Rachel', 'Leah'],
        de: ['Sarah', 'Rebekka', 'Rachel', 'Lea']
      },
      correctIndex: 0,
      explanation: {
        en: 'Sarah finally trusted God and Isaac was born.',
        de: 'Sarah vertraute Gott und Isaak wurde geboren.'
      }
    }
  ],
  exodus: [
    {
      question: {
        en: 'Who led the Israelites out of Egypt?',
        de: 'Wer führte die Israeliten aus Ägypten?'
      },
      options: {
        en: ['Moses', 'Aaron', 'Joshua', 'Joseph'],
        de: ['Mose', 'Aaron', 'Josua', 'Josef']
      },
      correctIndex: 0,
      explanation: {
        en: 'Moses trusted God and stood before Pharaoh.',
        de: 'Mose vertraute Gott und trat vor den Pharao.'
      }
    },
    {
      question: {
        en: 'Which sea did Moses part for the people to pass through?',
        de: 'Welches Meer teilte Mose, damit das Volk hindurchziehen konnte?'
      },
      options: {
        en: ['Red Sea', 'Dead Sea', 'Sea of Galilee', 'Mediterranean'],
        de: ['Rotes Meer', 'Totes Meer', 'See Genezareth', 'Mittelmeer']
      },
      correctIndex: 0,
      explanation: {
        en: 'God told Moses to stretch out his staff over the Red Sea.',
        de: 'Gott sagte Mose, er solle seinen Stab über das Rote Meer halten.'
      }
    }
  ],
  judges: [
    {
      question: {
        en: 'Which judge defeated the Midianites with just 300 men and torches?',
        de: 'Welcher Richter besiegte die Midianiter mit nur 300 Männern und Fackeln?'
      },
      options: {
        en: ['Gideon', 'Samson', 'Deborah', 'Samuel'],
        de: ['Gideon', 'Simson', 'Debora', 'Samuel']
      },
      correctIndex: 0,
      explanation: {
        en: 'Gideon trusted God and surprised the enemy at night.',
        de: 'Gideon vertraute Gott und überraschte den Feind nachts.'
      }
    },
    {
      question: {
        en: 'Who was the prophetess judge that led Israel and sang a victory song?',
        de: 'Welche Prophetin-Richterin führte Israel und sang einen Siegesgesang?'
      },
      options: {
        en: ['Deborah', 'Ruth', 'Esther', 'Miriam'],
        de: ['Debora', 'Rut', 'Esther', 'Mirjam']
      },
      correctIndex: 0,
      explanation: {
        en: 'Deborah led the people with courage and praised God after the win.',
        de: 'Debora führte das Volk mutig und lobte Gott nach dem Sieg.'
      }
    }
  ],
  kings: [
    {
      question: {
        en: 'Which shepherd boy was anointed to become king of Israel?',
        de: 'Welcher Hirtenjunge wurde gesalbt, um König von Israel zu werden?'
      },
      options: {
        en: ['David', 'Saul', 'Solomon', 'Hezekiah'],
        de: ['David', 'Saul', 'Salomo', 'Hiskia']
      },
      correctIndex: 0,
      explanation: {
        en: 'David was chosen by Samuel while tending sheep.',
        de: 'David wurde von Samuel während der Schafhütung ausgewählt.'
      }
    },
    {
      question: {
        en: 'Which king built the temple in Jerusalem?',
        de: 'Welcher König ließ den Tempel in Jerusalem bauen?'
      },
      options: {
        en: ['David', 'Solomon', 'Rehoboam', 'Uzziah'],
        de: ['David', 'Salomo', 'Rehabeam', 'Usija']
      },
      correctIndex: 1,
      explanation: {
        en: 'Solomon built the temple to honor God with beautiful structure.',
        de: 'Salomo baute den Tempel, um Gott mit einem prächtigen Bau zu ehren.'
      }
    }
  ],
  prophets: [
    {
      question: {
        en: 'Which prophet saw dry bones come back to life in a vision?',
        de: 'Welcher Prophet sah in einer Vision trockene Knochen wieder lebendig werden?'
      },
      options: {
        en: ['Ezekiel', 'Isaiah', 'Daniel', 'Amos'],
        de: ['Ezechiel', 'Jesaja', 'Daniel', 'Amos']
      },
      correctIndex: 0,
      explanation: {
        en: 'Ezekiel’s vision showed God bringing hope and new life.',
        de: 'Ezechiels Vision zeigte, dass Gott Hoffnung und neues Leben schenkt.'
      }
    },
    {
      question: {
        en: 'Which prophet reminded kings to act justly and love mercy?',
        de: 'Welcher Prophet erinnerte Könige daran, gerecht zu handeln und Barmherzigkeit zu lieben?'
      },
      options: {
        en: ['Micah', 'Jonah', 'Hosea', 'Nahum'],
        de: ['Micha', 'Jona', 'Hosea', 'Nahum']
      },
      correctIndex: 0,
      explanation: {
        en: 'Micah wrote that God wants justice, mercy, and humility.',
        de: 'Micha schrieb, dass Gott Gerechtigkeit, Barmherzigkeit und Demut möchte.'
      }
    }
  ],
  gospels: [
    {
      question: {
        en: 'What did Jesus turn water into at the wedding in Cana?',
        de: 'Wasserde Jesus bei der Hochzeit zu Kana verwandelt?'
      },
      options: {
        en: ['Wine', 'Bread', 'Fish', 'Milk'],
        de: ['Wein', 'Brot', 'Fisch', 'Milch']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jesus turned water into wine to bless the celebration.',
        de: 'Jesus verwandelte Wasser in Wein, um die Feier zu segnen.'
      }
    },
    {
      question: {
        en: 'Which gospel writer described Jesus feeding 5,000 people?',
        de: 'Welcher Evangelist beschrieb, wie Jesus 5.000 Menschen speiste?'
      },
      options: {
        en: ['Matthew', 'Mark', 'Luke', 'John'],
        de: ['Matthäus', 'Markus', 'Lukas', 'Johannes']
      },
      correctIndex: 3,
      explanation: {
        en: 'John wrote about the miracle beside the Sea of Galilee.',
        de: 'Johannes berichtete von dem Wunder am See Genezareth.'
      }
    }
  ],
  earlyChurch: [
    {
      question: { en: 'Which apostle wrote many letters to the churches?', de: 'Welcher Apostel schrieb viele Briefe an die Gemeinden?' },
      options: { en: ['Paul', 'Peter', 'James', 'John'], de: ['Paulus', 'Petrus', 'Jakobus', 'Johannes'] },
      correctIndex: 0,
      explanation: { en: 'Paul traveled widely and penned letters to believers.', de: 'Paulus reiste weit und schrieb Briefe an Gläubige.' }
    },
    {
      question: { en: 'In which city were believers first called Christians?', de: 'In welcher Stadt nannte man die Gläubigen zuerst Christen?' },
      options: { en: ['Jerusalem', 'Antioch', 'Rome', 'Corinth'], de: ['Jerusalem', 'Antiochia', 'Rom', 'Korinth'] },
      correctIndex: 1,
      explanation: { en: 'The believers in Antioch were the first to bear the name Christian.', de: 'In Antiochia wurden die Gläubigen erstmals Christen genannt.' }
    }
  ],
  wisdom: [
    {
      question: { en: 'Which book is filled with wise sayings from Solomon?', de: 'Welches Buch ist voll von weisen Sprüchen Salomos?' },
      options: { en: ['Proverbs', 'Psalms', 'Job', 'Ecclesiastes'], de: ['Sprüche', 'Psalmen', 'Hiob', 'Prediger'] },
      correctIndex: 0,
      explanation: { en: 'Proverbs is known as the book of wisdom.', de: 'Sprüche ist als das Buch der Weisheit bekannt.' }
    },
    {
      question: { en: 'Which man remained faithful to God even after losing everything?', de: 'Welcher Mann blieb Gott treu, auch nachdem er alles verloren hatte?' },
      options: { en: ['Job', 'David', 'Saul', 'Solomon'], de: ['Hiob', 'David', 'Saul', 'Salomo'] },
      correctIndex: 0,
      explanation: { en: 'Job trusted God through immense suffering.', de: 'Hiob vertraute Gott in großem Leid.' }
    }
  ],
  exile: [
    {
      question: { en: 'Which prophet was thrown into the lions den?', de: 'Welcher Prophet wurde in die Löwengrube geworfen?' },
      options: { en: ['Daniel', 'Ezekiel', 'Jeremiah', 'Isaiah'], de: ['Daniel', 'Ezechiel', 'Jeremia', 'Jesaja'] },
      correctIndex: 0,
      explanation: { en: 'Daniel prayed faithfully despite the kings decree.', de: 'Daniel betete treu trotz des Erlasses des Königs.' }
    },
    {
      question: { en: 'Which three men were thrown into the fiery furnace?', de: 'Welche drei Männer wurden in den Feuerofen geworfen?' },
      options: { en: ['Shadrach, Meshach, Abednego', 'Peter, James, John', 'Abraham, Isaac, Jacob', 'Moses, Aaron, Miriam'], de: ['Schadrach, Meschach, Abednego', 'Petrus, Jakobus, Johannes', 'Abraham, Isaak, Jakob', 'Mose, Aaron, Mirjam'] },
      correctIndex: 0,
      explanation: { en: 'They refused to bow to the golden statue.', de: 'Sie weigerten sich, sich vor der goldenen Statue zu beugen.' }
    }
  ],
  return: [
    {
      question: { en: 'Who led the rebuilding of the walls of Jerusalem?', de: 'Wer leitete den Wiederaufbau der Mauern von Jerusalem?' },
      options: { en: ['Nehemiah', 'Ezra', 'Zerubbabel', 'Esther'], de: ['Nehemia', 'Esra', 'Serubbabel', 'Esther'] },
      correctIndex: 0,
      explanation: { en: 'Nehemiah prayed and acted boldly to rebuild the walls.', de: 'Nehemia betete und handelte mutig, um die Mauern wieder aufzubauen.' }
    },
    {
      question: { en: 'Who read the Law to the people after they returned?', de: 'Wer las dem Volk nach ihrer Rückkehr das Gesetz vor?' },
      options: { en: ['Ezra', 'Nehemiah', 'Malachi', 'Haggai'], de: ['Esra', 'Nehemia', 'Maleachi', 'Haggai'] },
      correctIndex: 0,
      explanation: { en: 'Ezra the priest brought the Book of the Law of Moses.', de: 'Esra, der Priester, brachte das Buch des Gesetzes des Mose.' }
    }
  ],
  parables: [
    {
      question: { en: 'In the parable of the sower, what does the seed represent?', de: 'Was stellt der Same im Gleichnis vom Sämann dar?' },
      options: { en: ['The Word of God', 'Money', 'Faith', 'Love'], de: ['Das Wort Gottes', 'Geld', 'Glaube', 'Liebe'] },
      correctIndex: 0,
      explanation: { en: 'Jesus explained that the seed is the word of God scattered into hearts.', de: 'Jesus erklärte, dass der Same das Wort Gottes ist, das in die Herzen gestreut wird.' }
    },
    {
      question: { en: 'Which parable tells of a son who wastes his inheritance?', de: 'Welches Gleichnis erzählt von einem Sohn, der sein Erbe verschwendet?' },
      options: { en: ['The Prodigal Son', 'The Good Samaritan', 'The Lost Sheep', 'The Ten Virgins'], de: ['Der verlorene Sohn', 'Der barmherzige Samariter', 'Das verlorene Schaf', 'Die zehn Jungfrauen'] },
      correctIndex: 0,
      explanation: { en: 'The father welcomes back the Prodigal Son with open arms.', de: 'Der Vater heißt den verlorenen Sohn mit offenen Armen willkommen.' }
    }
  ],
  passion: [
    {
      question: { en: 'Which disciple betrayed Jesus with a kiss?', de: 'Welcher Jünger verriet Jesus mit einem Kuss?' },
      options: { en: ['Judas Iscariot', 'Peter', 'Thomas', 'John'], de: ['Judas Iskariot', 'Petrus', 'Thomas', 'Johannes'] },
      correctIndex: 0,
      explanation: { en: 'Judas betrayed Jesus for 30 pieces of silver.', de: 'Judas verriet Jesus für 30 Silberlinge.' }
    },
    {
      question: { en: 'Where did Jesus pray before his arrest?', de: 'Wo betete Jesus vor seiner Verhaftung?' },
      options: { en: ['Garden of Gethsemane', 'Mount of Olives', 'Temple', 'Upper Room'], de: ['Garten Gethsemane', 'Ölberg', 'Tempel', 'Oberes Zimmer'] },
      correctIndex: 0,
      explanation: { en: 'Jesus faced enormous agony submitting to the Fathers will.', de: 'Jesus erlitt enorme Qualen, als er sich dem Willen des Vaters unterwarf.' }
    }
  ],
  resurrection: [
    {
      question: { en: 'Who was the first person to see the risen Jesus?', de: 'Wer war die erste Person, die den auferstandenen Jesus sah?' },
      options: { en: ['Mary Magdalene', 'Peter', 'John', 'Thomas'], de: ['Maria Magdalena', 'Petrus', 'Johannes', 'Thomas'] },
      correctIndex: 0,
      explanation: { en: 'Mary stayed crying at the tomb until Jesus spoke to her.', de: 'Maria blieb weinend am Grab, bis Jesus mit ihr sprach.' }
    },
    {
      question: { en: 'Which disciple doubted until he touched Jesus scars?', de: 'Welcher Jünger zweifelte, bis er die Narben Jesu berührte?' },
      options: { en: ['Thomas', 'Peter', 'Andrew', 'Philip'], de: ['Thomas', 'Petrus', 'Andreas', 'Philippus'] },
      correctIndex: 0,
      explanation: { en: 'Jesus said, "Blessed are those who have not seen and yet have believed."', de: 'Jesus sagte: "Selig, die nicht sehen und doch glauben."' }
    }
  ],
  holySpirit: [
    {
      question: { en: 'On what day did the Holy Spirit descend as tongues of fire?', de: 'An welchem Tag kam der Heilige Geist wie Feuerzungen herab?' },
      options: { en: ['Pentecost', 'Passover', 'Tabernacles', 'Atonement'], de: ['Pfingsten', 'Passah', 'Laubhüttenfest', 'Versöhnungstag'] },
      correctIndex: 0,
      explanation: { en: 'Pentecost marked the birth of the church with power.', de: 'Pfingsten markierte die Geburt der Gemeinde mit Kraft.' }
    },
    {
      question: { en: 'What is listed as a fruit of the Spirit?', de: 'Was wird als Frucht des Geistes aufgeführt?' },
      options: { en: ['Joy', 'Wealth', 'Power', 'Fame'], de: ['Freude', 'Reichtum', 'Macht', 'Ruhm'] },
      correctIndex: 0,
      explanation: { en: 'The fruit of the Spirit includes love, joy, peace, patience...', de: 'Die Frucht des Geistes umfasst Liebe, Freude, Friede, Geduld...' }
    }
  ],
  revelation: [
    {
      question: { en: 'Who wrote the book of Revelation while exiled?', de: 'Wer schrieb das Buch der Offenbarung im Exil?' },
      options: { en: ['John', 'Paul', 'Peter', 'James'], de: ['Johannes', 'Paulus', 'Petrus', 'Jakobus'] },
      correctIndex: 0,
      explanation: { en: 'John was exiled to the island of Patmos when he received the visions.', de: 'Johannes befand sich im Exil auf der Insel Patmos, als er die Visionen erhielt.' }
    },
    {
      question: { en: 'What name is Jesus called in Revelation that signifies the end?', de: 'Wie wird Jesus in der Offenbarung genannt, was das Ende bedeutet?' },
      options: { en: ['The Omega', 'The Alpha', 'The Lion', 'The Lamb'], de: ['Das Omega', 'Das Alpha', 'Der Löwe', 'Das Lamm'] },
      correctIndex: 0,
      explanation: { en: 'He is the Alpha and the Omega, the First and the Last.', de: 'Er ist das Alpha und das Omega, der Erste und der Letzte.' }
    }
  ],
  heroes: [
    {
      question: { en: 'Which boy defeated the heavily armed Goliath?', de: 'Welcher Junge besiegte den schwer bewaffneten Goliath?' },
      options: { en: ['David', 'Jonathan', 'Saul', 'Absalom'], de: ['David', 'Jonathan', 'Saul', 'Absalom'] },
      correctIndex: 0,
      explanation: { en: 'David defeated Goliath with a sling and God’s power.', de: 'David besiegte Goliath mit einer Schleuder und Gottes Kraft.' }
    },
    {
      question: { en: 'Who was swallowed by a great fish when running from God?', de: 'Wer wurde von einem großen Fisch verschluckt, als er vor Gott floh?' },
      options: { en: ['Jonah', 'Noah', 'Moses', 'Elijah'], de: ['Jona', 'Noah', 'Mose', 'Elia'] },
      correctIndex: 0,
      explanation: { en: 'Jonah stayed in the belly of the fish for three days and three nights.', de: 'Jona blieb drei Tage und drei Nächte im Bauch des Fisches.' }
    }
  ],
  womenOfFaith: [
    {
      question: { en: 'Which queen risked her life to save the Jewish people?', de: 'Welche Königin riskierte ihr Leben, um das jüdische Volk zu retten?' },
      options: { en: ['Esther', 'Ruth', 'Mary', 'Naomi'], de: ['Esther', 'Ruth', 'Maria', 'Naomi'] },
      correctIndex: 0,
      explanation: { en: 'Esther bravely approached the king without an invitation.', de: 'Esther näherte sich mutig dem König ohne Einladung.' }
    },
    {
      question: { en: 'Who stayed loyal to her mother-in-law, Naomi?', de: 'Wer blieb ihrer Schwiegermutter Naomi treu?' },
      options: { en: ['Ruth', 'Orpah', 'Rachel', 'Leah'], de: ['Ruth', 'Orpa', 'Rahel', 'Lea'] },
      correctIndex: 0,
      explanation: { en: 'Ruth said, "Your people will be my people, and your God my God."', de: 'Ruth sagte: "Dein Volk ist mein Volk, und dein Gott ist mein Gott."' }
    }
  ]
};

const getOfflineQuestions = (worldId: string, locale: 'en' | 'de'): Question[] => {
  const bucket = LOCAL_BIBLE_BANK[worldId] || [];

  // Clone the bucket before shuffling so we don't mutate the global state
  const bucketClone = [...bucket].sort(() => Math.random() - 0.5);

  return bucketClone.map((entry) => {
    // We must shuffle the options while keeping track of the correct answer string 
    // to determine its new `correctIndex` in the randomized array.
    const opts = [...entry.options[locale]];
    const correctAnswerString = opts[entry.correctIndex];

    // Fisher-Yates approach for option shuffling
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }

    const newCorrectIndex = opts.indexOf(correctAnswerString);

    return {
      question: entry.question[locale],
      options: opts,
      correctIndex: newCorrectIndex,
      explanation: entry.explanation[locale],
      funnyComment: entry.funnyComment ? entry.funnyComment[locale] : undefined,
    };
  });
};

const BIBLE_WORLDS = [
  { id: 'creation', label: 'The Beginning', icon: '🌅', desc: 'Creation & Eden', badge: 'Genesis Star' },
  { id: 'patriarchs', label: 'Patriarch Promise', icon: '🛕', desc: 'Abraham & Sarah', badge: 'Promise Keeper' },
  { id: 'exodus', label: 'Exodus Trail', icon: '🔥', desc: 'Moses & the Wilderness', badge: 'Desert Guide' },
  { id: 'judges', label: 'Judges & Courage', icon: '🛡️', desc: 'Deborah to Samson', badge: 'Courage Shield' },
  { id: 'kings', label: 'Kingdom Builders', icon: '👑', desc: 'David, Solomon & the Temple', badge: 'Royal Honor' },
  { id: 'prophets', label: 'Voice of Prophets', icon: '📜', desc: 'Isaiah, Jeremiah & Hope', badge: 'Prophet Quill' },
  { id: 'gospels', label: 'Good News', icon: '✝️', desc: 'Jesus & Miracles', badge: 'Good News Badge' },
  { id: 'earlyChurch', label: 'Early Church', icon: '✨', desc: 'Acts & Letters', badge: 'Faith Flame' },
  { id: 'wisdom', label: 'Proverbs & Wisdom', icon: '🧠', desc: 'Solomon & Job', badge: 'Wisdom Owl' },
  { id: 'exile', label: 'Exile & Lions', icon: '🦁', desc: 'Daniel & The Furnace', badge: 'Lion Tamer' },
  { id: 'return', label: 'The Wall Builder', icon: '🧱', desc: 'Nehemiah & Ezra', badge: 'Master Builder' },
  { id: 'parables', label: 'Parables', icon: '🌾', desc: 'Stories of Jesus', badge: 'Story Sower' },
  { id: 'passion', label: 'The Passion', icon: '🍷', desc: 'The Garden & Cross', badge: 'Atonement Cup' },
  { id: 'resurrection', label: 'He is Risen', icon: '🕊️', desc: 'The Empty Tomb', badge: 'Risen Glory' },
  { id: 'holySpirit', label: 'Pentecost Fire', icon: '🌪️', desc: 'The Holy Spirit', badge: 'Spirit Wind' },
  { id: 'revelation', label: 'The Revelation', icon: '👁️', desc: 'Alpha & Omega', badge: 'Omega Crown' },
  { id: 'heroes', label: 'Heroes of Faith', icon: '🦸', desc: 'David vs Goliath', badge: 'Hero Shield' },
  { id: 'womenOfFaith', label: 'Women of Faith', icon: '👸', desc: 'Esther & Ruth', badge: 'Faith Queen' }
];

const CATEGORY_META = {
  Bible: { label: 'Bible Quest', color: 'from-amber-600 to-orange-800', accent: 'text-amber-400', icon: ScrollText, music: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3' },
  Music: { label: 'Melody Master', color: 'from-pink-600 to-rose-800', accent: 'text-pink-400', icon: Music2, music: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3' },
  Football: { label: 'Football Pro', color: 'from-emerald-600 to-teal-800', accent: 'text-emerald-400', icon: Goal, music: 'https://cdn.pixabay.com/download/audio/2022/02/12/audio_f5f661d431.mp3' }
};

const CorrectionCard: React.FC<{
  question: Question;
  selectedIndex: number;
  onNext: () => void
}> = ({ question, selectedIndex, onNext }) => {
  const { t } = useI18n();
  useEffect(() => {
    AudioService.speak(`Incorrect. ${question.explanation}`);
  }, [question]);
  const incorrectText = t('activities.incorrectDescription', undefined, { option: question.options[selectedIndex] });
  const funny = question.funnyComment ? ` ${question.funnyComment}` : '';

  return (
    <div className="absolute inset-x-0 bottom-0 top-[20%] z-[60] bg-slate-950/95 backdrop-blur-3xl rounded-t-[3rem] border-t-4 border-rose-500 p-6 sm:p-10 flex flex-col animate-slide-up shadow-[0_-40px_100px_rgba(244,63,94,0.3)]">
      <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
        <div className="flex items-center gap-3 mb-4 text-rose-400">
          <X size={32} className="bg-rose-500/20 p-1.5 rounded-xl" />
          <h3 className="text-3xl font-black italic uppercase tracking-tighter">{t('activities.incorrectTitle')}</h3>
        </div>

        <p className="text-white text-lg mb-6 font-medium leading-tight opacity-90">
          {incorrectText}
          {funny}
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
          <p className="text-emerald-400 font-black text-[9px] uppercase tracking-[0.3em] mb-2">{t('activities.correctionPrompt')}</p>
          <h4 className="text-2xl font-black text-white mb-2 italic tracking-tight">{question.options[question.correctIndex]}</h4>
          <p className="text-slate-300 text-sm leading-relaxed font-sans">{question.explanation}</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xl rounded-2xl shadow-[0_6px_0_rgb(159,18,57)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
      >
        {t('activities.correctionButton')} <ArrowRight size={22} />
      </button>
    </div>
  );
};

const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ onNavigate }) => {
  const profile = StorageService.getCurrentProfile();
  const [mode, setMode] = useState<'MENU' | 'PLAYING'>('MENU');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState('creation');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stats = StorageService.getGameStats();
  const bibleProgress = stats.quizProgress.find(p => p.category === 'Bible')?.bibleWorldLevel || 0;
  const { t, locale } = useI18n();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startLevel = async (worldId: string) => {
    const world = BIBLE_WORLDS.find(w => w.id === worldId);
    const fallbackQuestions = getOfflineQuestions(worldId, locale);
    setSelectedWorldId(worldId);
    setLoading(true);
    setMode('PLAYING');
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setShowCorrection(false);
    setSelectedOption(null);
    setShowVictory(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(CATEGORY_META.Bible.music);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.05;
    audioRef.current.play().catch(() => { });

    AudioService.speak(`${world?.label} Tournament. Let's find out how much you know!`);

    try {
      const q = await AIService.generateQuiz('Bible', 1, world?.label, profile?.age || 6);
      if (q && q.length > 0) {
        setQuestions(q);
        setLoading(false);
        setTimeout(() => AudioService.speak(q[0].question), 800);
      } else {
        throw new Error("No questions generated.");
      }
    } catch (e) {
      console.error("Failed to load quiz", e);
      setLoading(false);
      if (fallbackQuestions.length > 0) {
        setQuestions(fallbackQuestions);
        setTimeout(() => AudioService.speak(fallbackQuestions[0].question), 800);
        AudioService.speak(t('activities.offlineNote'));
      } else {
        setMode('MENU');
      }
      alert(t('activities.fallbackAlert'));
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null || questions.length === 0) return;
    setSelectedOption(index);
    const isCorrect = index === questions[currentIndex].correctIndex;

    if (isCorrect) {
      AudioService.playEffect('correct');
      setScore(s => s + 1);
      setStreak(s => s + 1);
      const currentQ = questions[currentIndex];
      AudioService.speak(currentQ.funnyComment || "Brilliant! Correct!");

      setTimeout(() => {
        advanceToNext();
      }, 1500);
    } else {
      AudioService.playEffect('wrong');
      setStreak(0);
      setShowCorrection(true);
    }
  };

  const advanceToNext = () => {
    setShowCorrection(false);
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeout(() => AudioService.speak(questions[nextIdx].question), 500);
    } else {
      const minRequired = Math.max(1, Math.ceil(questions.length * 0.6));
      const passed = score >= minRequired;
      if (passed) {
        const newStats = { ...stats };
        const bibleIdx = newStats.quizProgress.findIndex(p => p.category === 'Bible');
        const currentWorldIdx = BIBLE_WORLDS.findIndex(w => w.id === selectedWorldId);

        if (bibleIdx >= 0) {
          newStats.quizProgress[bibleIdx].bibleWorldLevel = Math.max(newStats.quizProgress[bibleIdx].bibleWorldLevel || 0, currentWorldIdx + 1);
        }

        newStats.xp += 150;
        const badge = BIBLE_WORLDS[currentWorldIdx].badge;
        if (!newStats.badges.includes(badge)) newStats.badges.push(badge);

        StorageService.saveGameStats(newStats);
        setShowVictory(true);
        AudioService.speak(`Masterful! You earned the ${badge} badge!`);
      } else {
        setMode('MENU');
        AudioService.speak("Tough round! Let's study more and try again.");
      }
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-8 animate-fade-in bg-[#050810]">
      <div className="relative">
        <Loader2 className="w-24 h-24 text-indigo-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">📜</div>
      </div>
      <div>
        <h2 className="text-3xl font-display text-white mb-2 animate-pulse tracking-tight">{t('activities.loadingTitle')}</h2>
        <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">{t('activities.loadingSubtitle')}</p>
      </div>
    </div>
  );

  if (mode === 'PLAYING' && questions.length > 0) {
    const q = questions[currentIndex];
    const world = BIBLE_WORLDS.find(w => w.id === selectedWorldId);

    return (
      <div className="min-h-full flex flex-col relative animate-fade-in bg-[#050810] pb-24">
        {showVictory && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 p-8 backdrop-blur-3xl animate-fade-in fixed">
            <div className="text-center max-w-sm animate-float">
              <div className="text-8xl mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">{world?.icon}</div>
              <h2 className="text-5xl font-display text-yellow-400 mb-2 italic tracking-tighter uppercase">{t('activities.victoryTitle')}</h2>
              <p className="text-white text-lg font-bold mb-6">{t('activities.victorySubtitle')}</p>
              <div className="bg-indigo-600/30 p-6 rounded-[2rem] border border-white/10 mb-6">
                <div className="flex items-center justify-center gap-3 text-white font-black text-3xl mb-1">
                  <Zap className="text-yellow-300" /> +150
                </div>
                <p className="text-indigo-300 font-black uppercase text-[9px] tracking-widest">{t('activities.victoryXpLabel')}</p>
              </div>
              <button onClick={() => setMode('MENU')} className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl rounded-2xl shadow-[0_6px_0_rgb(161,98,7)] transition-all active:scale-95">{t('activities.retryButton')}</button>
            </div>
          </div>
        )}

        {showCorrection && q && (
          <CorrectionCard question={q} selectedIndex={selectedOption!} onNext={advanceToNext} />
        )}

        {/* HUD - Compact */}
        <div className="flex justify-between items-center p-4 pt-2 z-10 shrink-0">
          <button onClick={() => { setMode('MENU'); if (audioRef.current) audioRef.current.pause(); }} className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-white hover:bg-slate-800 transition-all shadow-xl"><ArrowLeft size={20} /></button>
          <div className="text-center">
            <h3 className="font-display text-2xl text-white italic tracking-tighter">{world?.label}</h3>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <div className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">Quest {currentIndex + 1}/{questions.length}</div>
              {streak > 1 && <div className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-orange-500/20 flex items-center gap-1"><Flame size={8} /> {streak} Streak</div>}
            </div>
          </div>
          <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-yellow-400 font-black flex items-center gap-1.5 shadow-xl text-sm">
            <Trophy size={16} /> {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 flex gap-1.5 mb-4 shrink-0">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${i < currentIndex ? 'bg-emerald-400' : i === currentIndex ? 'bg-white animate-pulse' : 'bg-slate-900'}`} />
          ))}
        </div>

        {/* Question Area - True to View */}
        <div className="flex-1 px-4 pb-6 flex flex-col justify-center items-center gap-4 sm:gap-6 max-w-xl mx-auto w-full overflow-hidden">
          <div className="relative shrink-0">
            <div className={`text-7xl sm:text-8xl transition-all duration-500 drop-shadow-2xl ${selectedOption !== null ? (selectedOption === q.correctIndex ? 'animate-bounce scale-110' : 'animate-shake opacity-40') : 'animate-float'}`}>
              {selectedOption === null ? (['📜', '🗺️', '🔭', '🎒'][currentIndex % 4]) : (selectedOption === q.correctIndex ? '✨' : '🤕')}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl p-6 sm:p-8 rounded-[2.5rem] border-2 border-white/5 shadow-2xl relative text-center w-full shrink-0">
            <p className="text-2xl sm:text-3xl font-black text-white leading-tight italic tracking-tighter drop-shadow-lg">{q.question}</p>
          </div>

          <div className="grid gap-2.5 w-full pr-1">
            {q.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === q.correctIndex;
              return (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleAnswer(idx)}
                  className={`group relative p-4 sm:p-5 rounded-2xl border-2 text-left font-black text-lg sm:text-xl transition-all flex items-center gap-4 shadow-lg active:scale-95 ${selectedOption === null
                    ? 'bg-slate-900/40 border-slate-800 hover:border-indigo-500'
                    : (isSelected
                      ? (isCorrect ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-rose-600 border-rose-400 text-white')
                      : (isCorrect ? 'bg-emerald-600 border-emerald-400 text-white' : 'opacity-40 bg-slate-900 border-slate-800'))
                    }`}
                >
                  <span className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-indigo-400 font-mono text-[10px] border border-white/5 shrink-0">{String.fromCharCode(65 + idx)}</span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 animate-fade-in custom-scrollbar overflow-y-auto bg-[#050810]">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => onNavigate && onNavigate(View.HOME)}
          className="flex items-center gap-2 bg-slate-900/60 border border-white/10 px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
        >
          <Home size={16} /> EXIT TO HUB
        </button>
        <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
          <BrainCircuit size={12} /> {t('activities.header')}
        </div>
      </div>

      <header className="text-center mb-8">
        <h1 className="font-display text-6xl text-white italic tracking-tighter drop-shadow-2xl mb-2">{t('activities.header')}</h1>
        <p className="text-slate-500 text-lg font-medium tracking-tight px-4">{t('activities.description')}</p>
      </header>

      {/* World Selection Grid - Optimized */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20 max-w-6xl mx-auto w-full">
        {BIBLE_WORLDS.map((world, idx) => {
          const isUnlocked = idx <= bibleProgress;
          const isCurrent = idx === bibleProgress;
          return (
            <button
              key={world.id}
              disabled={!isUnlocked}
              onClick={() => startLevel(world.id)}
              className={`group relative p-8 rounded-[3rem] border-2 transition-all flex flex-col items-center text-center overflow-hidden shadow-2xl ${isUnlocked
                ? (isCurrent ? 'bg-indigo-600 border-indigo-400 hover:scale-105' : 'bg-slate-900 border-slate-800 hover:border-indigo-500 hover:-translate-y-2')
                : 'bg-slate-950/50 border-slate-900 opacity-40 grayscale pointer-events-none'
                }`}
            >
              {!isUnlocked && <Lock className="absolute top-6 right-6 text-slate-700" size={20} />}
              {isUnlocked && isCurrent && <Sparkles className="absolute top-6 right-6 text-yellow-300 animate-pulse" size={20} />}

              <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6 drop-shadow-xl">{world.icon}</div>
              <h3 className="text-2xl font-black text-white italic tracking-tighter mb-1 uppercase leading-tight">{world.label}</h3>
              <p className="text-indigo-400 font-black text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100">{world.desc}</p>

              {isUnlocked && stats.badges.includes(world.badge) && (
                <div className="mt-6 px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-yellow-400/30 flex items-center gap-1.5">
                  <Crown size={10} /> {world.badge}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.2s linear 3; }
      `}</style>
    </div>
  );
};

export default ActivitiesPage;
