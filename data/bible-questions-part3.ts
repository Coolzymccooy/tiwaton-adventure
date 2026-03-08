// Part 3: passion, resurrection, holySpirit, revelation, heroes, womenOfFaith
// Uses long-form field names; adapted at merge time in bible-questions.ts

export const PART3: Record<string, any[]> = {
  passion: [
    {
      question: {
        en: 'What meal did Jesus share with His disciples before He was arrested?',
        de: 'Welches Mahl teilte Jesus mit Seinen Jüngern, bevor Er verhaftet wurde?'
      },
      options: {
        en: ['The Last Supper', 'A birthday feast', 'A wedding banquet', 'A Sabbath dinner'],
        de: ['Das Letzte Abendmahl', 'Ein Geburtstagsfest', 'Ein Hochzeitsmahl', 'Ein Sabbatessen']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jesus shared bread and wine with His twelve disciples the night before His crucifixion.',
        de: 'Jesus teilte Brot und Wein mit seinen zwölf Jüngern in der Nacht vor seiner Kreuzigung.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What did Jesus do for His disciples at the Last Supper that surprised them?',
        de: 'Was tat Jesus für Seine Jünger beim Letzten Abendmahl, das sie überraschte?'
      },
      options: {
        en: ['He washed their feet', 'He sang a song', 'He gave them gifts', 'He told jokes'],
        de: ['Er wusch ihre Füße', 'Er sang ein Lied', 'Er gab ihnen Geschenke', 'Er erzählte Witze']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jesus humbly washed His disciples\' feet to teach them about serving others.',
        de: 'Jesus wusch demütig die Füße seiner Jünger, um ihnen zu zeigen, wie man anderen dient.'
      },
      difficulty: 1,
      funnyComment: {
        en: 'The King of the universe doing pedicures!',
        de: 'Der König des Universums macht Pediküre!'
      }
    },
    {
      question: {
        en: 'Where did Jesus go to pray before He was arrested?',
        de: 'Wohin ging Jesus zum Beten, bevor Er verhaftet wurde?'
      },
      options: {
        en: ['The temple', 'The Garden of Gethsemane', 'A mountain top', 'The River Jordan'],
        de: ['Der Tempel', 'Der Garten Gethsemane', 'Ein Berggipfel', 'Der Fluss Jordan']
      },
      correctIndex: 1,
      explanation: {
        en: 'Jesus prayed in the Garden of Gethsemane on the Mount of Olives.',
        de: 'Jesus betete im Garten Gethsemane auf dem Ölberg.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'How did Judas betray Jesus to the soldiers?',
        de: 'Wie verriet Judas Jesus an die Soldaten?'
      },
      options: {
        en: ['He pointed at Him', 'He called His name', 'He drew a picture', 'He kissed Him'],
        de: ['Er zeigte auf Ihn', 'Er rief Seinen Namen', 'Er zeichnete ein Bild', 'Er küsste Ihn']
      },
      correctIndex: 3,
      explanation: {
        en: 'Judas kissed Jesus on the cheek as a signal to identify Him to the soldiers.',
        de: 'Judas küsste Jesus auf die Wange als Zeichen, um Ihn den Soldaten zu zeigen.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'How many silver coins did Judas receive for betraying Jesus?',
        de: 'Wie viele Silbermünzen erhielt Judas für den Verrat an Jesus?'
      },
      options: {
        en: ['10', '20', '50', '30'],
        de: ['10', '20', '50', '30']
      },
      correctIndex: 3,
      explanation: {
        en: 'Judas was paid thirty pieces of silver by the chief priests.',
        de: 'Judas erhielt dreißig Silberlinge von den Hohenpriestern.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'Worst deal in history.',
        de: 'Das schlechteste Geschäft der Geschichte.'
      }
    },
    {
      question: {
        en: 'How many times did Peter deny knowing Jesus?',
        de: 'Wie oft verleugnete Petrus, Jesus zu kennen?'
      },
      options: {
        en: ['Once', 'Twice', 'Three times', 'Four times'],
        de: ['Einmal', 'Zweimal', 'Dreimal', 'Viermal']
      },
      correctIndex: 2,
      explanation: {
        en: 'Peter denied Jesus three times before the rooster crowed, just as Jesus predicted.',
        de: 'Petrus verleugnete Jesus dreimal, bevor der Hahn krähte, genau wie Jesus vorhergesagt hatte.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What sound reminded Peter that he had denied Jesus?',
        de: 'Welches Geräusch erinnerte Petrus daran, dass er Jesus verleugnet hatte?'
      },
      options: {
        en: ['A bell ringing', 'Thunder', 'A trumpet', 'A rooster crowing'],
        de: ['Ein Glockenläuten', 'Donner', 'Eine Trompete', 'Ein Hahnenschrei']
      },
      correctIndex: 3,
      explanation: {
        en: 'When the rooster crowed, Peter remembered Jesus\' words and wept bitterly.',
        de: 'Als der Hahn krähte, erinnerte sich Petrus an Jesu Worte und weinte bitterlich.'
      },
      difficulty: 1,
      funnyComment: {
        en: 'The rooster was basically an alarm clock for Peter\'s conscience.',
        de: 'Der Hahn war quasi ein Wecker für Petrus\' Gewissen.'
      }
    },
    {
      question: {
        en: 'Which Roman governor judged Jesus and sentenced Him to death?',
        de: 'Welcher römische Statthalter verurteilte Jesus zum Tode?'
      },
      options: {
        en: ['Pontius Pilate', 'Caesar Augustus', 'King Herod', 'Governor Felix'],
        de: ['Pontius Pilatus', 'Kaiser Augustus', 'König Herodes', 'Statthalter Felix']
      },
      correctIndex: 0,
      explanation: {
        en: 'Pontius Pilate was the Roman governor who sentenced Jesus to be crucified.',
        de: 'Pontius Pilatus war der römische Statthalter, der Jesus zur Kreuzigung verurteilte.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'To which king did Pilate send Jesus during the trial?',
        de: 'Zu welchem König schickte Pilatus Jesus während des Prozesses?'
      },
      options: {
        en: ['King David', 'King Herod', 'King Solomon', 'King Nebuchadnezzar'],
        de: ['König David', 'König Herodes', 'König Salomo', 'König Nebukadnezar']
      },
      correctIndex: 1,
      explanation: {
        en: 'Pilate sent Jesus to Herod Antipas, who was curious to see miracles.',
        de: 'Pilatus schickte Jesus zu Herodes Antipas, der neugierig war, Wunder zu sehen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'Which prisoner did the crowd choose to free instead of Jesus?',
        de: 'Welchen Gefangenen wählte die Menge zur Freilassung anstelle von Jesus?'
      },
      options: {
        en: ['Simon', 'Lazarus', 'Nicodemus', 'Barabbas'],
        de: ['Simon', 'Lazarus', 'Nikodemus', 'Barabbas']
      },
      correctIndex: 3,
      explanation: {
        en: 'The crowd asked Pilate to release Barabbas, a criminal, instead of Jesus.',
        de: 'Die Menge bat Pilatus, Barabbas, einen Verbrecher, anstelle von Jesus freizulassen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What did Pilate do to show he was not responsible for Jesus\' death?',
        de: 'Was tat Pilatus, um zu zeigen, dass er nicht für Jesu Tod verantwortlich war?'
      },
      options: {
        en: ['He washed his hands', 'He closed his eyes', 'He turned away', 'He left the room'],
        de: ['Er wusch seine Hände', 'Er schloss seine Augen', 'Er drehte sich weg', 'Er verließ den Raum']
      },
      correctIndex: 0,
      explanation: {
        en: 'Pilate washed his hands in front of the crowd, saying he was innocent of Jesus\' blood.',
        de: 'Pilatus wusch seine Hände vor der Menge und sagte, er sei unschuldig an Jesu Blut.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'Soap doesn\'t wash away that kind of guilt.',
        de: 'Seife wäscht solche Schuld nicht ab.'
      }
    },
    {
      question: {
        en: 'What did the soldiers place on Jesus\' head to mock Him?',
        de: 'Was setzten die Soldaten Jesus auf den Kopf, um Ihn zu verspotten?'
      },
      options: {
        en: ['A hat', 'A wreath of flowers', 'A golden crown', 'A crown of thorns'],
        de: ['Einen Hut', 'Einen Blumenkranz', 'Eine goldene Krone', 'Eine Dornenkrone']
      },
      correctIndex: 3,
      explanation: {
        en: 'The soldiers twisted together a crown of thorns and pressed it on Jesus\' head.',
        de: 'Die Soldaten flochten eine Dornenkrone und drückten sie auf Jesu Haupt.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'Who was forced to carry the cross for Jesus?',
        de: 'Wer wurde gezwungen, das Kreuz für Jesus zu tragen?'
      },
      options: {
        en: ['Peter', 'Simon of Cyrene', 'John', 'Andrew'],
        de: ['Petrus', 'Simon von Kyrene', 'Johannes', 'Andreas']
      },
      correctIndex: 1,
      explanation: {
        en: 'Simon of Cyrene was pulled from the crowd to help carry Jesus\' cross.',
        de: 'Simon von Kyrene wurde aus der Menge geholt, um Jesu Kreuz zu tragen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What happened to the sky when Jesus was on the cross?',
        de: 'Was geschah mit dem Himmel, als Jesus am Kreuz hing?'
      },
      options: {
        en: ['It became dark for three hours', 'A rainbow appeared', 'It rained', 'Stars appeared'],
        de: ['Es wurde drei Stunden lang dunkel', 'Ein Regenbogen erschien', 'Es regnete', 'Sterne erschienen']
      },
      correctIndex: 0,
      explanation: {
        en: 'Darkness covered the land from noon until three in the afternoon while Jesus was on the cross.',
        de: 'Finsternis bedeckte das Land von Mittag bis drei Uhr nachmittags, während Jesus am Kreuz hing.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What did Jesus say to the criminal on the cross next to Him who believed?',
        de: 'Was sagte Jesus zum Verbrecher am Kreuz neben Ihm, der glaubte?'
      },
      options: {
        en: ['\"Wait for the kingdom\"', '\"Pray for forgiveness\"', '\"Go in peace\"', '\"Today you will be with Me in paradise\"'],
        de: ['„Warte auf das Königreich"', '„Bete um Vergebung"', '„Geh in Frieden"', '„Heute noch wirst du mit Mir im Paradies sein"']
      },
      correctIndex: 3,
      explanation: {
        en: 'Jesus promised the repentant criminal that he would be in paradise that very day.',
        de: 'Jesus versprach dem reuigen Verbrecher, dass er noch am selben Tag im Paradies sein würde.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What did Jesus cry out on the cross meaning "My God, why have you forsaken me?"',
        de: 'Was rief Jesus am Kreuz, was bedeutet „Mein Gott, warum hast du mich verlassen?"'
      },
      options: {
        en: ['Hosanna', 'Hallelujah', 'Eli, Eli, lema sabachthani', 'Maranatha'],
        de: ['Hosanna', 'Halleluja', 'Eli, Eli, lema sabachthani', 'Maranatha']
      },
      correctIndex: 2,
      explanation: {
        en: 'These Aramaic words are a quote from Psalm 22 that Jesus spoke on the cross.',
        de: 'Diese aramäischen Worte sind ein Zitat aus Psalm 22, das Jesus am Kreuz sprach.'
      },
      difficulty: 3
    },
    {
      question: {
        en: 'What happened in the temple when Jesus died?',
        de: 'Was geschah im Tempel, als Jesus starb?'
      },
      options: {
        en: ['The curtain tore in two', 'The doors opened', 'The walls fell', 'Fire appeared'],
        de: ['Der Vorhang zerriss in zwei Teile', 'Die Türen öffneten sich', 'Die Wände stürzten ein', 'Feuer erschien']
      },
      correctIndex: 0,
      explanation: {
        en: 'The thick temple curtain was torn from top to bottom, showing that God opened the way to Himself.',
        de: 'Der dicke Tempelvorhang zerriss von oben bis unten und zeigte, dass Gott den Weg zu sich geöffnet hat.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'God doesn\'t need scissors.',
        de: 'Gott braucht keine Schere.'
      }
    },
    {
      question: {
        en: 'Who asked Pilate for permission to bury Jesus\' body?',
        de: 'Wer bat Pilatus um die Erlaubnis, Jesu Leichnam zu begraben?'
      },
      options: {
        en: ['Peter', 'Nicodemus', 'John', 'Joseph of Arimathea'],
        de: ['Petrus', 'Nikodemus', 'Johannes', 'Josef von Arimathäa']
      },
      correctIndex: 3,
      explanation: {
        en: 'Joseph of Arimathea, a wealthy and secret follower of Jesus, asked for His body.',
        de: 'Josef von Arimathäa, ein wohlhabender und heimlicher Anhänger Jesu, bat um Seinen Leichnam.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'Where was Jesus\' body placed after He died?',
        de: 'Wohin wurde Jesu Leichnam nach Seinem Tod gelegt?'
      },
      options: {
        en: ['In a cave-tomb carved from rock', 'In the ground', 'In a wooden box', 'In the river'],
        de: ['In ein Felsengrab', 'In die Erde', 'In eine Holzkiste', 'In den Fluss']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jesus was laid in a new tomb cut out of rock, and a large stone was rolled across the entrance.',
        de: 'Jesus wurde in ein neues, aus Fels gehauenes Grab gelegt, und ein großer Stein wurde vor den Eingang gerollt.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What were Jesus\' last words on the cross?',
        de: 'Was waren Jesu letzte Worte am Kreuz?'
      },
      options: {
        en: ['\"It is finished\"', '\"I will return\"', '\"Goodbye\"', '\"Be strong\"'],
        de: ['„Es ist vollbracht"', '„Ich werde zurückkommen"', '„Auf Wiedersehen"', '„Seid stark"']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jesus declared \"It is finished\" meaning He had completed His mission to save the world.',
        de: 'Jesus rief „Es ist vollbracht" und zeigte damit, dass Er Seine Mission zur Rettung der Welt erfüllt hatte.'
      },
      difficulty: 1,
      funnyComment: {
        en: 'The most powerful mic-drop of all time.',
        de: 'Der mächtigste Mic-Drop aller Zeiten.'
      }
    }
  ],

  resurrection: [
    {
      question: {
        en: 'On which day did Jesus rise from the dead?',
        de: 'An welchem Tag ist Jesus von den Toten auferstanden?'
      },
      options: {
        en: ['Friday', 'Saturday', 'The third day (Sunday)', 'Monday'],
        de: ['Freitag', 'Samstag', 'Am dritten Tag (Sonntag)', 'Montag']
      },
      correctIndex: 2,
      explanation: {
        en: 'Jesus rose from the dead on the third day, which was a Sunday morning.',
        de: 'Jesus ist am dritten Tag von den Toten auferstanden, an einem Sonntagmorgen.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What did the women find when they arrived at Jesus\' tomb?',
        de: 'Was fanden die Frauen, als sie an Jesu Grab ankamen?'
      },
      options: {
        en: ['The stone rolled away and the tomb empty', 'Jesus sleeping', 'Soldiers guarding it', 'The tomb sealed shut'],
        de: ['Den Stein weggerollt und das Grab leer', 'Jesus schlafend', 'Soldaten, die es bewachten', 'Das Grab versiegelt']
      },
      correctIndex: 0,
      explanation: {
        en: 'The large stone had been rolled away and the tomb was empty — Jesus had risen!',
        de: 'Der große Stein war weggerollt und das Grab war leer — Jesus war auferstanden!'
      },
      difficulty: 1,
      funnyComment: {
        en: 'Best empty room ever.',
        de: 'Der beste leere Raum aller Zeiten.'
      }
    },
    {
      question: {
        en: 'Who were the shining figures the women saw at the empty tomb?',
        de: 'Wer waren die leuchtenden Gestalten, die die Frauen am leeren Grab sahen?'
      },
      options: {
        en: ['Prophets', 'Disciples', 'Priests', 'Angels'],
        de: ['Propheten', 'Jünger', 'Priester', 'Engel']
      },
      correctIndex: 3,
      explanation: {
        en: 'Angels appeared at the tomb and told the women that Jesus had risen from the dead.',
        de: 'Engel erschienen am Grab und sagten den Frauen, dass Jesus von den Toten auferstanden war.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'Who was the first person to see the risen Jesus?',
        de: 'Wer war die erste Person, die den auferstandenen Jesus sah?'
      },
      options: {
        en: ['Peter', 'Mary Magdalene', 'John', 'Thomas'],
        de: ['Petrus', 'Maria Magdalena', 'Johannes', 'Thomas']
      },
      correctIndex: 1,
      explanation: {
        en: 'Mary Magdalene was the first person Jesus appeared to after His resurrection.',
        de: 'Maria Magdalena war die erste Person, der Jesus nach seiner Auferstehung erschien.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What did Mary Magdalene first think when she saw Jesus near the tomb?',
        de: 'Was dachte Maria Magdalena zuerst, als sie Jesus am Grab sah?'
      },
      options: {
        en: ['She recognized Him immediately', 'She thought He was an angel', 'She thought He was the gardener', 'She thought He was a soldier'],
        de: ['Sie erkannte Ihn sofort', 'Sie dachte, Er sei ein Engel', 'Sie dachte, Er sei der Gärtner', 'Sie dachte, Er sei ein Soldat']
      },
      correctIndex: 2,
      explanation: {
        en: 'Mary mistook Jesus for the gardener until He called her by name.',
        de: 'Maria verwechselte Jesus mit dem Gärtner, bis Er sie beim Namen rief.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'To be fair, the garden was His creation.',
        de: 'Um fair zu sein, der Garten war Seine Schöpfung.'
      }
    },
    {
      question: {
        en: 'On the road to Emmaus, two followers walked with Jesus without recognizing Him. When did they finally know it was Him?',
        de: 'Auf dem Weg nach Emmaus gingen zwei Jünger mit Jesus, ohne Ihn zu erkennen. Wann erkannten sie Ihn?'
      },
      options: {
        en: ['When He prayed', 'When He broke bread', 'When He sang', 'When He told a parable'],
        de: ['Als Er betete', 'Als Er das Brot brach', 'Als Er sang', 'Als Er ein Gleichnis erzählte']
      },
      correctIndex: 1,
      explanation: {
        en: 'Their eyes were opened when Jesus broke bread at the table with them.',
        de: 'Ihre Augen wurden geöffnet, als Jesus mit ihnen am Tisch das Brot brach.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'Which disciple said he would not believe Jesus was alive unless he touched His wounds?',
        de: 'Welcher Jünger sagte, er würde nicht glauben, dass Jesus lebt, ohne Seine Wunden zu berühren?'
      },
      options: {
        en: ['Peter', 'James', 'Andrew', 'Thomas'],
        de: ['Petrus', 'Jakobus', 'Andreas', 'Thomas']
      },
      correctIndex: 3,
      explanation: {
        en: 'Thomas doubted until Jesus appeared and invited him to touch His hands and side.',
        de: 'Thomas zweifelte, bis Jesus erschien und ihn einlud, Seine Hände und Seite zu berühren.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What did Jesus say to Thomas after Thomas believed?',
        de: 'Was sagte Jesus zu Thomas, nachdem Thomas glaubte?'
      },
      options: {
        en: ['\"Blessed are those who have not seen and yet believed\"', '\"You are forgiven\"', '\"Follow Me\"', '\"Go and tell the others\"'],
        de: ['„Selig sind, die nicht sehen und doch glauben"', '„Dir ist vergeben"', '„Folge Mir"', '„Geh und sag es den anderen"']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jesus blessed all future believers who would trust without physically seeing Him.',
        de: 'Jesus segnete alle zukünftigen Gläubigen, die vertrauen würden, ohne Ihn physisch zu sehen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What did Jesus cook for His disciples by the Sea of Galilee after the resurrection?',
        de: 'Was kochte Jesus für Seine Jünger am See Genezareth nach der Auferstehung?'
      },
      options: {
        en: ['Bread and fish', 'Lamb stew', 'Fruit and honey', 'Roasted chicken'],
        de: ['Brot und Fisch', 'Lammgulasch', 'Obst und Honig', 'Gebratenes Hähnchen']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jesus prepared a breakfast of bread and fish on the shore for His disciples.',
        de: 'Jesus bereitete ein Frühstück aus Brot und Fisch am Ufer für Seine Jünger vor.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'The risen Lord also cooks breakfast. What can\'t He do?',
        de: 'Der auferstandene Herr kocht auch Frühstück. Was kann Er nicht?'
      }
    },
    {
      question: {
        en: 'How many times did Jesus ask Peter \"Do you love me?\" by the sea?',
        de: 'Wie oft fragte Jesus Petrus „Liebst du mich?" am See?'
      },
      options: {
        en: ['Once', 'Twice', 'Three times', 'Five times'],
        de: ['Einmal', 'Zweimal', 'Dreimal', 'Fünfmal']
      },
      correctIndex: 2,
      explanation: {
        en: 'Jesus asked Peter three times, once for each time Peter had denied Him.',
        de: 'Jesus fragte Petrus dreimal, einmal für jedes Mal, als Petrus Ihn verleugnet hatte.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What is the Great Commission that Jesus gave His followers?',
        de: 'Was ist der Missionsbefehl, den Jesus Seinen Nachfolgern gab?'
      },
      options: {
        en: ['Build a temple', 'Write the Bible', 'Stay in Jerusalem forever', 'Go and make disciples of all nations'],
        de: ['Baut einen Tempel', 'Schreibt die Bibel', 'Bleibt für immer in Jerusalem', 'Geht hin und macht alle Völker zu Jüngern']
      },
      correctIndex: 3,
      explanation: {
        en: 'Jesus told His followers to go into all the world and share the good news.',
        de: 'Jesus sagte Seinen Nachfolgern, in die ganze Welt zu gehen und die frohe Botschaft zu verkünden.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'How did Jesus leave the earth after the resurrection?',
        de: 'Wie verließ Jesus die Erde nach der Auferstehung?'
      },
      options: {
        en: ['He walked away', 'He disappeared in a flash', 'He sailed away', 'He ascended into heaven on a cloud'],
        de: ['Er ging weg', 'Er verschwand in einem Blitz', 'Er segelte davon', 'Er fuhr in einer Wolke zum Himmel auf']
      },
      correctIndex: 3,
      explanation: {
        en: 'Jesus was taken up into heaven while His disciples watched, and a cloud hid Him from their sight.',
        de: 'Jesus wurde vor den Augen Seiner Jünger in den Himmel aufgenommen, und eine Wolke entzog Ihn ihren Blicken.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'How many days did Jesus appear to people after His resurrection before ascending?',
        de: 'Wie viele Tage erschien Jesus den Menschen nach Seiner Auferstehung, bevor Er auffuhr?'
      },
      options: {
        en: ['7 days', '12 days', '40 days', '100 days'],
        de: ['7 Tage', '12 Tage', '40 Tage', '100 Tage']
      },
      correctIndex: 2,
      explanation: {
        en: 'Jesus appeared over a period of 40 days, teaching and encouraging His followers.',
        de: 'Jesus erschien über einen Zeitraum von 40 Tagen, um Seine Nachfolger zu lehren und zu ermutigen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What did the angels say to the disciples as Jesus ascended into heaven?',
        de: 'Was sagten die Engel zu den Jüngern, als Jesus in den Himmel auffuhr?'
      },
      options: {
        en: ['\"Go home\"', '\"Build a church here\"', '\"He will come back the same way\"', '\"Do not be afraid\"'],
        de: ['„Geht nach Hause"', '„Baut hier eine Kirche"', '„Er wird auf dieselbe Weise zurückkommen"', '„Fürchtet euch nicht"']
      },
      correctIndex: 2,
      explanation: {
        en: 'Two angels told the disciples that Jesus would return in the same way they saw Him go.',
        de: 'Zwei Engel sagten den Jüngern, dass Jesus auf dieselbe Weise zurückkommen wird, wie sie Ihn gehen sahen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'To how many people did Jesus appear at one time after His resurrection, according to Paul?',
        de: 'Wie vielen Menschen erschien Jesus laut Paulus gleichzeitig nach Seiner Auferstehung?'
      },
      options: {
        en: ['12', 'More than 500', '100', '50'],
        de: ['12', 'Mehr als 500', '100', '50']
      },
      correctIndex: 1,
      explanation: {
        en: 'Paul wrote that Jesus appeared to more than 500 people at the same time.',
        de: 'Paulus schrieb, dass Jesus mehr als 500 Menschen gleichzeitig erschien.'
      },
      difficulty: 3
    },
    {
      question: {
        en: 'What did the guards at the tomb tell the chief priests happened?',
        de: 'Was erzählten die Wächter am Grab den Hohenpriestern?'
      },
      options: {
        en: ['Nothing happened', 'They fell asleep', 'They ran away', 'An earthquake and angel appeared'],
        de: ['Nichts geschah', 'Sie schliefen ein', 'Sie rannten davon', 'Ein Erdbeben und ein Engel erschienen']
      },
      correctIndex: 3,
      explanation: {
        en: 'There was a great earthquake and an angel rolled away the stone; the guards were terrified.',
        de: 'Es gab ein großes Erdbeben und ein Engel rollte den Stein weg; die Wächter waren erschrocken.'
      },
      difficulty: 3,
      funnyComment: {
        en: 'Toughest guards, still no match for an angel.',
        de: 'Die härtesten Wächter, trotzdem kein Gegner für einen Engel.'
      }
    },
    {
      question: {
        en: 'What did Jesus show His disciples to prove He was really alive?',
        de: 'Was zeigte Jesus Seinen Jüngern, um zu beweisen, dass Er wirklich lebte?'
      },
      options: {
        en: ['His hands and side with the wounds', 'A sign from heaven', 'A written letter', 'His shining face'],
        de: ['Seine Hände und Seite mit den Wunden', 'Ein Zeichen vom Himmel', 'Einen geschriebenen Brief', 'Sein leuchtendes Gesicht']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jesus showed them the nail marks in His hands and the wound in His side.',
        de: 'Jesus zeigte ihnen die Nägelmale in Seinen Händen und die Wunde in Seiner Seite.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'Where did Jesus tell His disciples to wait after the ascension?',
        de: 'Wo sollten die Jünger nach der Himmelfahrt warten?'
      },
      options: {
        en: ['Bethlehem', 'Jerusalem', 'Nazareth', 'Egypt'],
        de: ['Bethlehem', 'Jerusalem', 'Nazareth', 'Ägypten']
      },
      correctIndex: 1,
      explanation: {
        en: 'Jesus told them to wait in Jerusalem until they received power from the Holy Spirit.',
        de: 'Jesus sagte ihnen, in Jerusalem zu warten, bis sie die Kraft des Heiligen Geistes empfangen würden.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'Which mountain did Jesus ascend to heaven from?',
        de: 'Von welchem Berg fuhr Jesus zum Himmel auf?'
      },
      options: {
        en: ['Mount Sinai', 'Mount of Olives', 'Mount Carmel', 'Mount Hermon'],
        de: ['Berg Sinai', 'Ölberg', 'Berg Karmel', 'Berg Hermon']
      },
      correctIndex: 1,
      explanation: {
        en: 'Jesus ascended into heaven from the Mount of Olives, near Jerusalem.',
        de: 'Jesus fuhr vom Ölberg nahe Jerusalem in den Himmel auf.'
      },
      difficulty: 3
    },
    {
      question: {
        en: 'What did Jesus do with the disciples at Emmaus before He vanished?',
        de: 'Was tat Jesus mit den Jüngern in Emmaus, bevor Er verschwand?'
      },
      options: {
        en: ['He ate a meal with them', 'He healed them', 'He baptized them', 'He gave them money'],
        de: ['Er aß mit ihnen', 'Er heilte sie', 'Er taufte sie', 'Er gab ihnen Geld']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jesus sat down to eat with them, blessed and broke the bread, and then vanished from their sight.',
        de: 'Jesus setzte sich mit ihnen zum Essen, segnete und brach das Brot und verschwand dann vor ihren Augen.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'The original dinner-and-dash, divine edition.',
        de: 'Das originale Essen-und-Verschwinden, göttliche Ausgabe.'
      }
    }
  ],

  holySpirit: [
    {
      question: {
        en: 'What Jewish feast day was it when the Holy Spirit came?',
        de: 'Welcher jüdische Feiertag war es, als der Heilige Geist kam?'
      },
      options: {
        en: ['Passover', 'Hanukkah', 'Purim', 'Pentecost'],
        de: ['Pessach', 'Chanukka', 'Purim', 'Pfingsten']
      },
      correctIndex: 3,
      explanation: {
        en: 'The Holy Spirit came on the day of Pentecost, 50 days after Passover.',
        de: 'Der Heilige Geist kam am Pfingsttag, 50 Tage nach Pessach.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What appeared above the heads of the believers at Pentecost?',
        de: 'Was erschien über den Köpfen der Gläubigen an Pfingsten?'
      },
      options: {
        en: ['Stars', 'Tongues of fire', 'Doves', 'Crowns'],
        de: ['Sterne', 'Feuerzungen', 'Tauben', 'Kronen']
      },
      correctIndex: 1,
      explanation: {
        en: 'Tongues of fire rested on each person as the Holy Spirit filled them.',
        de: 'Feuerzungen ruhten auf jeder Person, als der Heilige Geist sie erfüllte.'
      },
      difficulty: 1,
      funnyComment: {
        en: 'Hottest hairstyle in history.',
        de: 'Die heißeste Frisur der Geschichte.'
      }
    },
    {
      question: {
        en: 'What amazing thing happened to the believers at Pentecost besides fire?',
        de: 'Was geschah Erstaunliches mit den Gläubigen an Pfingsten neben dem Feuer?'
      },
      options: {
        en: ['They spoke in other languages', 'They could fly', 'They became invisible', 'They glowed'],
        de: ['Sie sprachen in anderen Sprachen', 'Sie konnten fliegen', 'Sie wurden unsichtbar', 'Sie leuchteten']
      },
      correctIndex: 0,
      explanation: {
        en: 'The believers spoke in languages they had never learned, so visitors from many nations could understand.',
        de: 'Die Gläubigen sprachen in Sprachen, die sie nie gelernt hatten, sodass Besucher aus vielen Nationen verstehen konnten.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'Who preached a powerful sermon on the day of Pentecost?',
        de: 'Wer hielt an Pfingsten eine kraftvolle Predigt?'
      },
      options: {
        en: ['Paul', 'John', 'James', 'Peter'],
        de: ['Paulus', 'Johannes', 'Jakobus', 'Petrus']
      },
      correctIndex: 3,
      explanation: {
        en: 'Peter stood up boldly and preached about Jesus to the crowd in Jerusalem.',
        de: 'Petrus stand mutig auf und predigte der Menge in Jerusalem über Jesus.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'How many people were baptized and saved after Peter\'s sermon at Pentecost?',
        de: 'Wie viele Menschen wurden nach Petrus\' Predigt an Pfingsten getauft und gerettet?'
      },
      options: {
        en: ['300', '1,000', 'About 3,000', '100'],
        de: ['300', '1.000', 'Etwa 3.000', '100']
      },
      correctIndex: 2,
      explanation: {
        en: 'About 3,000 people believed and were baptized on that single day!',
        de: 'Etwa 3.000 Menschen glaubten und wurden an diesem einen Tag getauft!'
      },
      difficulty: 2,
      funnyComment: {
        en: 'That\'s a LOT of baptisms in one afternoon.',
        de: 'Das sind VIELE Taufen an einem Nachmittag.'
      }
    },
    {
      question: {
        en: 'Which is NOT a fruit of the Spirit listed in Galatians?',
        de: 'Welche ist KEINE Frucht des Geistes, die in Galater aufgelistet ist?'
      },
      options: {
        en: ['Love', 'Joy', 'Popularity', 'Kindness'],
        de: ['Liebe', 'Freude', 'Beliebtheit', 'Freundlichkeit']
      },
      correctIndex: 2,
      explanation: {
        en: 'Popularity is not a fruit of the Spirit. The fruits include love, joy, peace, patience, kindness, and more.',
        de: 'Beliebtheit ist keine Frucht des Geistes. Die Früchte umfassen Liebe, Freude, Frieden, Geduld, Freundlichkeit und mehr.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'How many fruits of the Spirit are listed in Galatians 5?',
        de: 'Wie viele Früchte des Geistes werden in Galater 5 aufgelistet?'
      },
      options: {
        en: ['7', '12', '5', '9'],
        de: ['7', '12', '5', '9']
      },
      correctIndex: 3,
      explanation: {
        en: 'There are nine fruits: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.',
        de: 'Es gibt neun Früchte: Liebe, Freude, Frieden, Geduld, Freundlichkeit, Güte, Treue, Sanftmut und Selbstbeherrschung.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What happened to Ananias and Sapphira when they lied to the Holy Spirit?',
        de: 'Was geschah mit Ananias und Saphira, als sie den Heiligen Geist belogen?'
      },
      options: {
        en: ['They were forgiven immediately', 'They fell down and died', 'They were put in prison', 'They lost their sight'],
        de: ['Ihnen wurde sofort vergeben', 'Sie fielen um und starben', 'Sie kamen ins Gefängnis', 'Sie verloren ihr Augenlicht']
      },
      correctIndex: 1,
      explanation: {
        en: 'Both Ananias and Sapphira died after lying about how much money they gave to the church.',
        de: 'Sowohl Ananias als auch Saphira starben, nachdem sie darüber gelogen hatten, wie viel Geld sie der Gemeinde gaben.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'Note to self: don\'t try to trick God.',
        de: 'Notiz an mich selbst: Versuche nicht, Gott auszutricksen.'
      }
    },
    {
      question: {
        en: 'What did Ananias and Sapphira lie about?',
        de: 'Worüber logen Ananias und Saphira?'
      },
      options: {
        en: ['Their names', 'Where they lived', 'The price of their land', 'Their age'],
        de: ['Ihre Namen', 'Wo sie wohnten', 'Den Preis ihres Grundstücks', 'Ihr Alter']
      },
      correctIndex: 2,
      explanation: {
        en: 'They sold property but kept some money while pretending to give all of it to the church.',
        de: 'Sie verkauften ein Grundstück, behielten aber etwas Geld, während sie vorgaben, alles der Gemeinde zu geben.'
      },
      difficulty: 3
    },
    {
      question: {
        en: 'Who did the Holy Spirit tell Philip to go and meet on a desert road?',
        de: 'Wen sollte Philippus laut dem Heiligen Geist auf einer Wüstenstraße treffen?'
      },
      options: {
        en: ['A Roman soldier', 'A Greek philosopher', 'An Egyptian priest', 'An Ethiopian official'],
        de: ['Einen römischen Soldaten', 'Einen griechischen Philosophen', 'Einen ägyptischen Priester', 'Einen äthiopischen Beamten']
      },
      correctIndex: 3,
      explanation: {
        en: 'Philip was guided by the Spirit to meet an Ethiopian official who was reading the book of Isaiah.',
        de: 'Philippus wurde vom Geist geleitet, einen äthiopischen Beamten zu treffen, der das Buch Jesaja las.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What was the Ethiopian official doing when Philip found him?',
        de: 'Was tat der äthiopische Beamte, als Philippus ihn fand?'
      },
      options: {
        en: ['Reading Scripture', 'Praying', 'Sleeping', 'Eating'],
        de: ['Die Schrift lesen', 'Beten', 'Schlafen', 'Essen']
      },
      correctIndex: 0,
      explanation: {
        en: 'He was sitting in his chariot reading from the prophet Isaiah but did not understand it.',
        de: 'Er saß in seinem Wagen und las den Propheten Jesaja, verstand es aber nicht.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What did the Ethiopian official ask Philip to do after hearing about Jesus?',
        de: 'Was bat der äthiopische Beamte Philippus zu tun, nachdem er von Jesus gehört hatte?'
      },
      options: {
        en: ['Write it down', 'Travel with him', 'Pray for him', 'Baptize him'],
        de: ['Es aufschreiben', 'Mit ihm reisen', 'Für ihn beten', 'Ihn taufen']
      },
      correctIndex: 3,
      explanation: {
        en: 'When they came to some water, the official asked to be baptized right away.',
        de: 'Als sie zu einem Gewässer kamen, bat der Beamte sofort um die Taufe.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'Which gift of the Spirit means speaking God\'s message to people?',
        de: 'Welche Gabe des Geistes bedeutet, Gottes Botschaft an die Menschen weiterzugeben?'
      },
      options: {
        en: ['Healing', 'Administration', 'Giving', 'Prophecy'],
        de: ['Heilung', 'Verwaltung', 'Geben', 'Prophetie']
      },
      correctIndex: 3,
      explanation: {
        en: 'The gift of prophecy is speaking God\'s truth and messages to encourage and guide people.',
        de: 'Die Gabe der Prophetie ist das Aussprechen von Gottes Wahrheit und Botschaften zur Ermutigung und Führung der Menschen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What sound filled the house when the Holy Spirit came at Pentecost?',
        de: 'Welches Geräusch erfüllte das Haus, als der Heilige Geist an Pfingsten kam?'
      },
      options: {
        en: ['A rushing mighty wind', 'Singing', 'Thunder', 'A whisper'],
        de: ['Ein gewaltiges Brausen', 'Gesang', 'Donner', 'Ein Flüstern']
      },
      correctIndex: 0,
      explanation: {
        en: 'A sound like a mighty rushing wind filled the entire house where they were sitting.',
        de: 'Ein Geräusch wie ein gewaltiges Brausen erfüllte das ganze Haus, in dem sie saßen.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What did some people in the crowd wrongly think about the Spirit-filled believers?',
        de: 'Was dachten manche Leute in der Menge fälschlicherweise über die geisterfüllten Gläubigen?'
      },
      options: {
        en: ['They were angels', 'They were magicians', 'They were crazy', 'They were drunk'],
        de: ['Sie seien Engel', 'Sie seien Zauberer', 'Sie seien verrückt', 'Sie seien betrunken']
      },
      correctIndex: 3,
      explanation: {
        en: 'Some mocked the believers, saying they had drunk too much wine.',
        de: 'Manche verspotteten die Gläubigen und sagten, sie hätten zu viel Wein getrunken.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'Peter said it was only 9 AM — too early for wine!',
        de: 'Petrus sagte, es war erst 9 Uhr morgens — zu früh für Wein!'
      }
    },
    {
      question: {
        en: 'In Acts, who did the Holy Spirit prevent Paul from going to preach in?',
        de: 'In der Apostelgeschichte, in welche Region hinderte der Heilige Geist Paulus am Predigen?'
      },
      options: {
        en: ['Asia', 'Rome', 'Egypt', 'Greece'],
        de: ['Asien', 'Rom', 'Ägypten', 'Griechenland']
      },
      correctIndex: 0,
      explanation: {
        en: 'The Holy Spirit kept Paul from preaching in the province of Asia, guiding him instead to Macedonia.',
        de: 'Der Heilige Geist hinderte Paulus daran, in der Provinz Asien zu predigen, und führte ihn stattdessen nach Mazedonien.'
      },
      difficulty: 3
    },
    {
      question: {
        en: 'What does the Bible call the Holy Spirit that means "helper" or "comforter"?',
        de: 'Wie nennt die Bibel den Heiligen Geist, was „Helfer" oder „Tröster" bedeutet?'
      },
      options: {
        en: ['Shepherd', 'Prophet', 'Advocate (Paraclete)', 'Messiah'],
        de: ['Hirte', 'Prophet', 'Beistand (Paraklet)', 'Messias']
      },
      correctIndex: 2,
      explanation: {
        en: 'Jesus called the Holy Spirit the Advocate or Comforter who would be with believers forever.',
        de: 'Jesus nannte den Heiligen Geist den Beistand oder Tröster, der für immer bei den Gläubigen sein würde.'
      },
      difficulty: 3
    },
    {
      question: {
        en: 'What symbol of the Holy Spirit appeared at Jesus\' baptism?',
        de: 'Welches Symbol des Heiligen Geistes erschien bei Jesu Taufe?'
      },
      options: {
        en: ['A cloud', 'A rainbow', 'A flame', 'A dove'],
        de: ['Eine Wolke', 'Ein Regenbogen', 'Eine Flamme', 'Eine Taube']
      },
      correctIndex: 3,
      explanation: {
        en: 'The Holy Spirit descended on Jesus like a dove when He was baptized in the Jordan.',
        de: 'Der Heilige Geist kam wie eine Taube auf Jesus herab, als Er im Jordan getauft wurde.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What did the early church share because the Spirit united them?',
        de: 'Was teilte die frühe Gemeinde, weil der Geist sie vereinte?'
      },
      options: {
        en: ['Everything they had', 'Only prayers', 'Just food', 'Only songs'],
        de: ['Alles, was sie hatten', 'Nur Gebete', 'Nur Essen', 'Nur Lieder']
      },
      correctIndex: 0,
      explanation: {
        en: 'The believers shared all their possessions so that no one among them was in need.',
        de: 'Die Gläubigen teilten all ihren Besitz, sodass niemand unter ihnen in Not war.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'Which deacon, full of the Holy Spirit, became the first Christian martyr?',
        de: 'Welcher Diakon, voll des Heiligen Geistes, wurde der erste christliche Märtyrer?'
      },
      options: {
        en: ['Philip', 'Stephen', 'Timothy', 'Barnabas'],
        de: ['Philippus', 'Stephanus', 'Timotheus', 'Barnabas']
      },
      correctIndex: 1,
      explanation: {
        en: 'Stephen was stoned to death for his faith but saw a vision of heaven as he died.',
        de: 'Stephanus wurde für seinen Glauben gesteinigt, sah aber eine Vision des Himmels, als er starb.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'He literally saw heaven opening — talk about going out with a view!',
        de: 'Er sah buchstäblich den Himmel offen — das nennt man Abgang mit Aussicht!'
      }
    }
  ],

  revelation: [
    {
      question: {
        en: 'Who wrote the book of Revelation?',
        de: 'Wer schrieb das Buch der Offenbarung?'
      },
      options: {
        en: ['Paul', 'John', 'Peter', 'Luke'],
        de: ['Paulus', 'Johannes', 'Petrus', 'Lukas']
      },
      correctIndex: 1,
      explanation: {
        en: 'The apostle John wrote Revelation while he was exiled on the island of Patmos.',
        de: 'Der Apostel Johannes schrieb die Offenbarung, während er auf der Insel Patmos verbannt war.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'On which island was John when he received the visions of Revelation?',
        de: 'Auf welcher Insel war Johannes, als er die Visionen der Offenbarung empfing?'
      },
      options: {
        en: ['Crete', 'Cyprus', 'Malta', 'Patmos'],
        de: ['Kreta', 'Zypern', 'Malta', 'Patmos']
      },
      correctIndex: 3,
      explanation: {
        en: 'John was imprisoned on the small island of Patmos for preaching about Jesus.',
        de: 'Johannes war auf der kleinen Insel Patmos eingesperrt, weil er über Jesus gepredigt hatte.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'How many churches did Jesus send messages to in Revelation?',
        de: 'An wie viele Gemeinden sandte Jesus Botschaften in der Offenbarung?'
      },
      options: {
        en: ['3', '5', '7', '12'],
        de: ['3', '5', '7', '12']
      },
      correctIndex: 2,
      explanation: {
        en: 'Jesus sent letters to seven churches in Asia Minor with encouragement and correction.',
        de: 'Jesus sandte Briefe an sieben Gemeinden in Kleinasien mit Ermutigung und Ermahnung.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'How many horsemen are described in Revelation?',
        de: 'Wie viele Reiter werden in der Offenbarung beschrieben?'
      },
      options: {
        en: ['2', '3', '4', '7'],
        de: ['2', '3', '4', '7']
      },
      correctIndex: 2,
      explanation: {
        en: 'The four horsemen ride horses of white, red, black, and pale green.',
        de: 'Die vier Reiter reiten auf weißen, roten, schwarzen und fahlen Pferden.'
      },
      difficulty: 1,
      funnyComment: {
        en: 'The original horse squad.',
        de: 'Das Original-Pferdeteam.'
      }
    },
    {
      question: {
        en: 'In John\'s vision, what was around God\'s throne in heaven?',
        de: 'Was war in Johannes\' Vision um Gottes Thron im Himmel?'
      },
      options: {
        en: ['Flames', 'Stars', 'Clouds', 'A rainbow that looked like an emerald'],
        de: ['Flammen', 'Sterne', 'Wolken', 'Ein Regenbogen, der wie ein Smaragd aussah']
      },
      correctIndex: 3,
      explanation: {
        en: 'A beautiful rainbow resembling an emerald encircled the throne of God.',
        de: 'Ein wunderschöner Regenbogen, der einem Smaragd glich, umgab den Thron Gottes.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'How many elders sit around God\'s throne in Revelation?',
        de: 'Wie viele Älteste sitzen um Gottes Thron in der Offenbarung?'
      },
      options: {
        en: ['12', '7', '24', '70'],
        de: ['12', '7', '24', '70']
      },
      correctIndex: 2,
      explanation: {
        en: 'Twenty-four elders wearing white robes and golden crowns sit around God\'s throne.',
        de: 'Vierundzwanzig Älteste in weißen Gewändern und mit goldenen Kronen sitzen um Gottes Thron.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What does Jesus call Himself at the beginning and end of Revelation?',
        de: 'Wie nennt sich Jesus am Anfang und Ende der Offenbarung?'
      },
      options: {
        en: ['The Good Shepherd', 'The Bread of Life', 'The Alpha and Omega', 'The King of kings'],
        de: ['Der gute Hirte', 'Das Brot des Lebens', 'Das Alpha und Omega', 'Der König der Könige']
      },
      correctIndex: 2,
      explanation: {
        en: 'Alpha and Omega are the first and last letters of the Greek alphabet, meaning Jesus is the beginning and the end.',
        de: 'Alpha und Omega sind der erste und letzte Buchstabe des griechischen Alphabets, was bedeutet, dass Jesus der Anfang und das Ende ist.'
      },
      difficulty: 1,
      funnyComment: {
        en: 'He\'s got the whole alphabet covered.',
        de: 'Er hat das ganze Alphabet abgedeckt.'
      }
    },
    {
      question: {
        en: 'In Revelation, Jesus is symbolized as what kind of animal?',
        de: 'In der Offenbarung wird Jesus als welches Tier symbolisiert?'
      },
      options: {
        en: ['A lamb', 'A lion', 'An eagle', 'A dove'],
        de: ['Ein Lamm', 'Ein Löwe', 'Ein Adler', 'Eine Taube']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jesus is called the Lamb of God because He was sacrificed for the sins of the world.',
        de: 'Jesus wird das Lamm Gottes genannt, weil Er für die Sünden der Welt geopfert wurde.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'How many seals does the Lamb open in Revelation?',
        de: 'Wie viele Siegel öffnet das Lamm in der Offenbarung?'
      },
      options: {
        en: ['3', '5', '7', '10'],
        de: ['3', '5', '7', '10']
      },
      correctIndex: 2,
      explanation: {
        en: 'The Lamb opens seven seals on a scroll, each one revealing events of the end times.',
        de: 'Das Lamm öffnet sieben Siegel an einer Schriftrolle, jedes enthüllt Ereignisse der Endzeit.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'How many trumpets are blown by angels in Revelation?',
        de: 'Wie viele Posaunen werden von Engeln in der Offenbarung geblasen?'
      },
      options: {
        en: ['4', '7', '10', '12'],
        de: ['4', '7', '10', '12']
      },
      correctIndex: 1,
      explanation: {
        en: 'Seven angels blow seven trumpets, each announcing a different judgment.',
        de: 'Sieben Engel blasen sieben Posaunen, jede kündigt ein anderes Gericht an.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What does God promise to create at the end of Revelation?',
        de: 'Was verspricht Gott am Ende der Offenbarung zu schaffen?'
      },
      options: {
        en: ['A new heaven and a new earth', 'A new kingdom', 'A new temple', 'A new garden'],
        de: ['Einen neuen Himmel und eine neue Erde', 'Ein neues Königreich', 'Einen neuen Tempel', 'Einen neuen Garten']
      },
      correctIndex: 0,
      explanation: {
        en: 'God promises to make everything new — a new heaven and a new earth where there is no more crying or pain.',
        de: 'Gott verspricht, alles neu zu machen — einen neuen Himmel und eine neue Erde, wo es kein Weinen und keinen Schmerz mehr gibt.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What special tree is found in the new Jerusalem in Revelation?',
        de: 'Welcher besondere Baum befindet sich im neuen Jerusalem in der Offenbarung?'
      },
      options: {
        en: ['An olive tree', 'The tree of knowledge', 'The tree of life', 'A fig tree'],
        de: ['Ein Olivenbaum', 'Der Baum der Erkenntnis', 'Der Baum des Lebens', 'Ein Feigenbaum']
      },
      correctIndex: 2,
      explanation: {
        en: 'The tree of life bears twelve kinds of fruit and its leaves are for the healing of the nations.',
        de: 'Der Baum des Lebens trägt zwölf Arten von Früchten und seine Blätter dienen zur Heilung der Völker.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What will there be no need for in the new Jerusalem, because God\'s glory provides it?',
        de: 'Was wird im neuen Jerusalem nicht nötig sein, weil Gottes Herrlichkeit es bietet?'
      },
      options: {
        en: ['Sun or moon (light)', 'Food', 'Water', 'Music'],
        de: ['Sonne oder Mond (Licht)', 'Essen', 'Wasser', 'Musik']
      },
      correctIndex: 0,
      explanation: {
        en: 'There will be no need for the sun or moon because God\'s glory will light up the city.',
        de: 'Es wird keine Sonne oder keinen Mond brauchen, weil Gottes Herrlichkeit die Stadt erleuchtet.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'Saves on the electricity bill!',
        de: 'Spart bei der Stromrechnung!'
      }
    },
    {
      question: {
        en: 'What are the gates of the new Jerusalem made of?',
        de: 'Woraus bestehen die Tore des neuen Jerusalems?'
      },
      options: {
        en: ['Gold', 'Silver', 'Pearls', 'Diamonds'],
        de: ['Gold', 'Silber', 'Perlen', 'Diamanten']
      },
      correctIndex: 2,
      explanation: {
        en: 'Each of the twelve gates is made from a single pearl — the famous "pearly gates."',
        de: 'Jedes der zwölf Tore besteht aus einer einzigen Perle — die berühmten „Perlentore".'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'How many gates does the new Jerusalem have?',
        de: 'Wie viele Tore hat das neue Jerusalem?'
      },
      options: {
        en: ['4', '7', '10', '12'],
        de: ['4', '7', '10', '12']
      },
      correctIndex: 3,
      explanation: {
        en: 'The new Jerusalem has twelve gates, three on each side, named after the twelve tribes of Israel.',
        de: 'Das neue Jerusalem hat zwölf Tore, drei auf jeder Seite, benannt nach den zwölf Stämmen Israels.'
      },
      difficulty: 3
    },
    {
      question: {
        en: 'What is the street of the new Jerusalem made of?',
        de: 'Woraus besteht die Straße des neuen Jerusalems?'
      },
      options: {
        en: ['Silver', 'Pure gold, clear as glass', 'White marble', 'Crystal'],
        de: ['Silber', 'Reines Gold, klar wie Glas', 'Weißer Marmor', 'Kristall']
      },
      correctIndex: 1,
      explanation: {
        en: 'The street of the city is made of pure gold, as transparent as glass.',
        de: 'Die Straße der Stadt besteht aus reinem Gold, so durchsichtig wie Glas.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What does Jesus promise at the very end of Revelation?',
        de: 'Was verspricht Jesus ganz am Ende der Offenbarung?'
      },
      options: {
        en: ['\"I am coming soon\"', '\"Build my temple\"', '\"Fear the end\"', '\"The story is over\"'],
        de: ['„Ich komme bald"', '„Baut meinen Tempel"', '„Fürchtet das Ende"', '„Die Geschichte ist vorbei"']
      },
      correctIndex: 0,
      explanation: {
        en: 'The book ends with Jesus\' promise: "Yes, I am coming soon!" and John replies, "Amen. Come, Lord Jesus!"',
        de: 'Das Buch endet mit Jesu Versprechen: „Ja, ich komme bald!" und Johannes antwortet: „Amen. Komm, Herr Jesus!"'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What does Revelation say will be wiped from every eye?',
        de: 'Was sagt die Offenbarung, das von jedem Auge abgewischt wird?'
      },
      options: {
        en: ['Dust', 'Every tear', 'Sleep', 'Blindness'],
        de: ['Staub', 'Jede Träne', 'Schlaf', 'Blindheit']
      },
      correctIndex: 1,
      explanation: {
        en: 'God will wipe every tear from their eyes, and there will be no more death, sorrow, or pain.',
        de: 'Gott wird jede Träne von ihren Augen abwischen, und es wird keinen Tod, keine Trauer und keinen Schmerz mehr geben.'
      },
      difficulty: 1,
      funnyComment: {
        en: 'Heaven: where tissues are not needed.',
        de: 'Himmel: wo Taschentücher nicht gebraucht werden.'
      }
    },
    {
      question: {
        en: 'What color is the horse of the first horseman in Revelation?',
        de: 'Welche Farbe hat das Pferd des ersten Reiters in der Offenbarung?'
      },
      options: {
        en: ['Red', 'Black', 'Pale green', 'White'],
        de: ['Rot', 'Schwarz', 'Fahlgrün', 'Weiß']
      },
      correctIndex: 3,
      explanation: {
        en: 'The first horseman rides a white horse and carries a bow.',
        de: 'Der erste Reiter reitet ein weißes Pferd und trägt einen Bogen.'
      },
      difficulty: 3
    },
    {
      question: {
        en: 'What river flows from God\'s throne in the new Jerusalem?',
        de: 'Welcher Fluss fließt von Gottes Thron im neuen Jerusalem?'
      },
      options: {
        en: ['River Jordan', 'River of the water of life', 'River Nile', 'River Euphrates'],
        de: ['Fluss Jordan', 'Strom des Lebenswassers', 'Nil', 'Euphrat']
      },
      correctIndex: 1,
      explanation: {
        en: 'A river of the water of life, clear as crystal, flows from the throne of God and the Lamb.',
        de: 'Ein Strom des Lebenswassers, klar wie Kristall, fließt vom Thron Gottes und des Lammes.'
      },
      difficulty: 2
    }
  ],

  heroes: [
    {
      question: {
        en: 'How did young David defeat the giant Goliath?',
        de: 'Wie besiegte der junge David den Riesen Goliath?'
      },
      options: {
        en: ['With a sword', 'With a spear', 'With his bare hands', 'With a sling and a stone'],
        de: ['Mit einem Schwert', 'Mit einem Speer', 'Mit bloßen Händen', 'Mit einer Schleuder und einem Stein']
      },
      correctIndex: 3,
      explanation: {
        en: 'David used a simple sling and a smooth stone to knock down the mighty Goliath.',
        de: 'David benutzte eine einfache Schleuder und einen glatten Stein, um den mächtigen Goliath zu Fall zu bringen.'
      },
      difficulty: 1,
      funnyComment: {
        en: 'Smallest weapon, biggest victory.',
        de: 'Kleinste Waffe, größter Sieg.'
      }
    },
    {
      question: {
        en: 'How many stones did David pick up from the stream before fighting Goliath?',
        de: 'Wie viele Steine nahm David aus dem Bach, bevor er gegen Goliath kämpfte?'
      },
      options: {
        en: ['1', '3', '5', '7'],
        de: ['1', '3', '5', '7']
      },
      correctIndex: 2,
      explanation: {
        en: 'David chose five smooth stones, but he only needed one to defeat Goliath.',
        de: 'David wählte fünf glatte Steine, brauchte aber nur einen, um Goliath zu besiegen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What did the prophet Elijah challenge the prophets of Baal to prove?',
        de: 'Was forderte der Prophet Elia die Propheten des Baal heraus zu beweisen?'
      },
      options: {
        en: ['Who could run faster', 'Who could build a bigger altar', 'Whose god could send fire from heaven', 'Who had more followers'],
        de: ['Wer schneller laufen konnte', 'Wer einen größeren Altar bauen konnte', 'Wessen Gott Feuer vom Himmel senden konnte', 'Wer mehr Anhänger hatte']
      },
      correctIndex: 2,
      explanation: {
        en: 'Elijah challenged the 450 prophets of Baal to a contest: whose God could send fire to burn the sacrifice.',
        de: 'Elia forderte die 450 Propheten des Baal zu einem Wettbewerb heraus: Wessen Gott konnte Feuer senden, um das Opfer zu verbrennen.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What did Elijah pour on his altar to make it even harder for fire to burn?',
        de: 'Was goss Elia auf seinen Altar, um es dem Feuer noch schwerer zu machen?'
      },
      options: {
        en: ['Oil', 'Water', 'Sand', 'Milk'],
        de: ['Öl', 'Wasser', 'Sand', 'Milch']
      },
      correctIndex: 1,
      explanation: {
        en: 'Elijah soaked his altar with water three times to show that only God could send fire.',
        de: 'Elia tränkte seinen Altar dreimal mit Wasser, um zu zeigen, dass nur Gott Feuer senden konnte.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'Ultimate flex: pouring water on your firewood and still winning.',
        de: 'Ultimativer Flexen: Wasser auf dein Feuerholz gießen und trotzdem gewinnen.'
      }
    },
    {
      question: {
        en: 'How did the walls of Jericho fall down?',
        de: 'Wie fielen die Mauern von Jericho?'
      },
      options: {
        en: ['The army marched and blew trumpets', 'An earthquake', 'They used battering rams', 'Rain washed them away'],
        de: ['Die Armee marschierte und blies Posaunen', 'Ein Erdbeben', 'Sie benutzten Rammböcke', 'Regen wusch sie weg']
      },
      correctIndex: 0,
      explanation: {
        en: 'Joshua led the people to march around the city for seven days, and on the seventh day they shouted and the walls fell.',
        de: 'Josua führte das Volk sieben Tage um die Stadt, und am siebten Tag riefen sie und die Mauern fielen.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'How many days did the Israelites march around Jericho?',
        de: 'Wie viele Tage marschierten die Israeliten um Jericho?'
      },
      options: {
        en: ['3', '5', '7', '10'],
        de: ['3', '5', '7', '10']
      },
      correctIndex: 2,
      explanation: {
        en: 'They marched once a day for six days, then seven times on the seventh day.',
        de: 'Sie marschierten sechs Tage lang einmal am Tag, dann sieben Mal am siebten Tag.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'Who was the brave spy who said Israel could conquer the Promised Land when others were afraid?',
        de: 'Wer war der mutige Kundschafter, der sagte, Israel könne das Gelobte Land erobern, als andere Angst hatten?'
      },
      options: {
        en: ['Moses', 'Caleb', 'Aaron', 'Korah'],
        de: ['Mose', 'Kaleb', 'Aaron', 'Korah']
      },
      correctIndex: 1,
      explanation: {
        en: 'Caleb and Joshua were the only two spies who trusted God and said Israel could take the land.',
        de: 'Kaleb und Josua waren die einzigen zwei Kundschafter, die Gott vertrauten und sagten, Israel könne das Land einnehmen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What did Gideon put on the ground to test if God was really speaking to him?',
        de: 'Was legte Gideon auf den Boden, um zu testen, ob Gott wirklich zu ihm sprach?'
      },
      options: {
        en: ['A piece of bread', 'A stone tablet', 'A blanket', 'A wool fleece'],
        de: ['Ein Stück Brot', 'Eine Steintafel', 'Eine Decke', 'Ein Wollvlies']
      },
      correctIndex: 3,
      explanation: {
        en: 'Gideon placed a wool fleece on the ground and asked God to make it wet while the ground stayed dry, then the opposite.',
        de: 'Gideon legte ein Wollvlies auf den Boden und bat Gott, es nass zu machen, während der Boden trocken blieb, und dann umgekehrt.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'How many soldiers did God tell Gideon to use to fight the Midianites?',
        de: 'Wie viele Soldaten sollte Gideon laut Gott gegen die Midianiter einsetzen?'
      },
      options: {
        en: ['30,000', '10,000', '300', '1,000'],
        de: ['30.000', '10.000', '300', '1.000']
      },
      correctIndex: 2,
      explanation: {
        en: 'God reduced Gideon\'s army from 32,000 to just 300 so everyone would know God won the battle.',
        de: 'Gott reduzierte Gideons Armee von 32.000 auf nur 300, damit jeder wusste, dass Gott die Schlacht gewann.'
      },
      difficulty: 2,
      funnyComment: {
        en: '300 vs. thousands — God likes impossible odds.',
        de: '300 gegen Tausende — Gott mag unmögliche Chancen.'
      }
    },
    {
      question: {
        en: 'What did God send upon Egypt when Pharaoh refused to let the Israelites go?',
        de: 'Was sandte Gott über Ägypten, als der Pharao sich weigerte, die Israeliten gehen zu lassen?'
      },
      options: {
        en: ['Ten plagues', 'A flood', 'An army', 'Five plagues'],
        de: ['Zehn Plagen', 'Eine Flut', 'Eine Armee', 'Fünf Plagen']
      },
      correctIndex: 0,
      explanation: {
        en: 'God sent ten plagues including frogs, locusts, darkness, and more to convince Pharaoh.',
        de: 'Gott sandte zehn Plagen, darunter Frösche, Heuschrecken, Finsternis und mehr, um den Pharao zu überzeugen.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What did Moses stretch over the Red Sea to part the waters?',
        de: 'Was streckte Mose über das Rote Meer aus, um die Wasser zu teilen?'
      },
      options: {
        en: ['His hand with a staff', 'A rope', 'A flag', 'His coat'],
        de: ['Seine Hand mit einem Stab', 'Ein Seil', 'Eine Flagge', 'Seinen Mantel']
      },
      correctIndex: 0,
      explanation: {
        en: 'Moses stretched out his hand with his staff over the sea, and God parted the waters.',
        de: 'Mose streckte seine Hand mit seinem Stab über das Meer aus, und Gott teilte die Wasser.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What test did God give Abraham with his son Isaac?',
        de: 'Welche Prüfung gab Gott Abraham mit seinem Sohn Isaak?'
      },
      options: {
        en: ['To leave his home', 'To offer Isaac as a sacrifice', 'To fight a battle', 'To build an altar'],
        de: ['Seine Heimat zu verlassen', 'Isaak als Opfer darzubringen', 'Eine Schlacht zu kämpfen', 'Einen Altar zu bauen']
      },
      correctIndex: 1,
      explanation: {
        en: 'God tested Abraham\'s faith by asking him to sacrifice Isaac, but provided a ram instead.',
        de: 'Gott prüfte Abrahams Glauben, indem Er ihn bat, Isaak zu opfern, stellte aber stattdessen einen Widder bereit.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What did Joseph\'s brothers do to him because they were jealous?',
        de: 'Was taten Josefs Brüder ihm an, weil sie eifersüchtig waren?'
      },
      options: {
        en: ['Ignored him', 'Sent him to school', 'Sold him as a slave', 'Hid his sandals'],
        de: ['Sie ignorierten ihn', 'Sie schickten ihn zur Schule', 'Sie verkauften ihn als Sklaven', 'Sie versteckten seine Sandalen']
      },
      correctIndex: 2,
      explanation: {
        en: 'Joseph\'s brothers sold him to traders who took him to Egypt, where God had a great plan for him.',
        de: 'Josefs Brüder verkauften ihn an Händler, die ihn nach Ägypten brachten, wo Gott einen großen Plan für ihn hatte.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'Where was Joseph put after being falsely accused in Egypt?',
        de: 'Wohin wurde Josef gebracht, nachdem er in Ägypten falsch beschuldigt wurde?'
      },
      options: {
        en: ['A palace', 'Prison', 'A cave', 'A ship'],
        de: ['Ein Palast', 'Gefängnis', 'Eine Höhle', 'Ein Schiff']
      },
      correctIndex: 1,
      explanation: {
        en: 'Joseph was thrown into prison but even there God was with him and gave him the ability to interpret dreams.',
        de: 'Josef wurde ins Gefängnis geworfen, aber auch dort war Gott mit ihm und gab ihm die Fähigkeit, Träume zu deuten.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What were the names of the three friends thrown into the fiery furnace?',
        de: 'Wie hießen die drei Freunde, die in den Feuerofen geworfen wurden?'
      },
      options: {
        en: ['Peter, James, and John', 'Abraham, Isaac, and Jacob', 'Moses, Aaron, and Miriam', 'Shadrach, Meshach, and Abednego'],
        de: ['Petrus, Jakobus und Johannes', 'Abraham, Isaak und Jakob', 'Mose, Aaron und Mirjam', 'Schadrach, Meschach und Abed-Nego']
      },
      correctIndex: 3,
      explanation: {
        en: 'Shadrach, Meshach, and Abednego refused to bow to King Nebuchadnezzar\'s golden statue.',
        de: 'Schadrach, Meschach und Abed-Nego weigerten sich, vor der goldenen Statue König Nebukadnezars niederzuknien.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What happened to Shadrach, Meshach, and Abednego in the furnace?',
        de: 'Was geschah mit Schadrach, Meschach und Abed-Nego im Feuerofen?'
      },
      options: {
        en: ['They were burned', 'They were unharmed and a fourth figure appeared', 'They escaped', 'They put out the fire'],
        de: ['Sie verbrannten', 'Sie blieben unverletzt und eine vierte Gestalt erschien', 'Sie entkamen', 'Sie löschten das Feuer']
      },
      correctIndex: 1,
      explanation: {
        en: 'God protected them and a fourth person, like a son of the gods, was seen walking with them in the fire.',
        de: 'Gott beschützte sie, und eine vierte Person, wie ein Sohn der Götter, wurde mit ihnen im Feuer gesehen.'
      },
      difficulty: 1,
      funnyComment: {
        en: 'Not even a hair singed. Best fire safety ever.',
        de: 'Nicht mal ein Haar versengt. Bester Brandschutz aller Zeiten.'
      }
    },
    {
      question: {
        en: 'How many of each animal did Noah bring onto the ark?',
        de: 'Wie viele von jedem Tier nahm Noah mit auf die Arche?'
      },
      options: {
        en: ['Three', 'Five', 'Two (a pair)', 'One'],
        de: ['Drei', 'Fünf', 'Zwei (ein Paar)', 'Eines']
      },
      correctIndex: 2,
      explanation: {
        en: 'Noah brought two of each kind of animal — one male and one female — onto the ark.',
        de: 'Noah nahm zwei von jeder Art — ein Männchen und ein Weibchen — mit auf die Arche.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What sign did God put in the sky as a promise never to flood the whole earth again?',
        de: 'Welches Zeichen setzte Gott an den Himmel als Versprechen, die ganze Erde nie wieder zu überfluten?'
      },
      options: {
        en: ['A star', 'The moon', 'A cloud', 'A rainbow'],
        de: ['Einen Stern', 'Den Mond', 'Eine Wolke', 'Einen Regenbogen']
      },
      correctIndex: 3,
      explanation: {
        en: 'God placed a rainbow in the sky as a covenant sign of His promise to Noah.',
        de: 'Gott setzte einen Regenbogen an den Himmel als Bundeszeichen Seines Versprechens an Noah.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'How old was Caleb when he said he was still strong enough to take the hill country?',
        de: 'Wie alt war Kaleb, als er sagte, er sei noch stark genug, das Bergland einzunehmen?'
      },
      options: {
        en: ['55', '65', '85', '100'],
        de: ['55', '65', '85', '100']
      },
      correctIndex: 2,
      explanation: {
        en: 'At 85 years old, Caleb declared he was just as strong as when Moses sent him as a spy at 40.',
        de: 'Mit 85 Jahren erklärte Kaleb, er sei genauso stark wie damals, als Mose ihn mit 40 als Kundschafter sandte.'
      },
      difficulty: 3,
      funnyComment: {
        en: '85 and still going strong — Caleb skipped retirement.',
        de: '85 und immer noch fit — Kaleb hat die Rente übersprungen.'
      }
    },
    {
      question: {
        en: 'What special coat did Joseph receive from his father Jacob?',
        de: 'Welchen besonderen Mantel erhielt Josef von seinem Vater Jakob?'
      },
      options: {
        en: ['A coat of many colors', 'A wool coat', 'A leather coat', 'A golden robe'],
        de: ['Einen bunten Mantel', 'Einen Wollmantel', 'Einen Ledermantel', 'Ein goldenes Gewand']
      },
      correctIndex: 0,
      explanation: {
        en: 'Jacob gave Joseph a beautiful coat of many colors, which made his brothers jealous.',
        de: 'Jakob gab Josef einen wunderschönen bunten Mantel, was seine Brüder eifersüchtig machte.'
      },
      difficulty: 1
    }
  ],

  womenOfFaith: [
    {
      question: {
        en: 'Which brave queen risked her life to save the Jewish people from a plot to destroy them?',
        de: 'Welche mutige Königin riskierte ihr Leben, um das jüdische Volk vor einem Vernichtungsplan zu retten?'
      },
      options: {
        en: ['Ruth', 'Deborah', 'Abigail', 'Esther'],
        de: ['Ruth', 'Debora', 'Abigail', 'Ester']
      },
      correctIndex: 3,
      explanation: {
        en: 'Queen Esther bravely went to the king without being summoned to stop Haman\'s evil plan.',
        de: 'Königin Ester ging mutig zum König, ohne gerufen zu werden, um Hamans bösen Plan zu stoppen.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What famous words did Esther\'s cousin Mordecai tell her?',
        de: 'Welche berühmten Worte sagte Esters Cousin Mordechai zu ihr?'
      },
      options: {
        en: ['\"Be brave, little one\"', '\"Trust your heart\"', '\"Run away quickly\"', '\"Perhaps you were born for such a time as this\"'],
        de: ['„Sei tapfer, Kleine"', '„Vertraue deinem Herzen"', '„Lauf schnell weg"', '„Vielleicht bist du für eine solche Zeit geboren"']
      },
      correctIndex: 3,
      explanation: {
        en: 'Mordecai encouraged Esther that God may have placed her as queen for this very moment.',
        de: 'Mordechai ermutigte Ester, dass Gott sie vielleicht für genau diesen Moment als Königin eingesetzt hatte.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'Best motivational speech in the Bible.',
        de: 'Beste Motivationsrede in der Bibel.'
      }
    },
    {
      question: {
        en: 'Who was the loyal daughter-in-law who said, \"Where you go I will go\"?',
        de: 'Wer war die treue Schwiegertochter, die sagte: „Wo du hingehst, will ich auch hingehen"?'
      },
      options: {
        en: ['Esther', 'Hannah', 'Ruth', 'Miriam'],
        de: ['Ester', 'Hanna', 'Ruth', 'Mirjam']
      },
      correctIndex: 2,
      explanation: {
        en: 'Ruth chose to stay with her mother-in-law Naomi and follow God, even in a foreign land.',
        de: 'Ruth entschied sich, bei ihrer Schwiegermutter Naomi zu bleiben und Gott zu folgen, selbst in einem fremden Land.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'Who did Ruth marry in Bethlehem?',
        de: 'Wen heiratete Ruth in Bethlehem?'
      },
      options: {
        en: ['Solomon', 'David', 'Boaz', 'Jesse'],
        de: ['Salomo', 'David', 'Boas', 'Isai']
      },
      correctIndex: 2,
      explanation: {
        en: 'Ruth married Boaz, a kind landowner, and they became ancestors of King David and eventually Jesus.',
        de: 'Ruth heiratete Boas, einen freundlichen Grundbesitzer, und sie wurden Vorfahren von König David und schließlich Jesus.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'Who was the woman judge and leader of Israel who helped defeat the enemy?',
        de: 'Wer war die Richterin und Führerin Israels, die half, den Feind zu besiegen?'
      },
      options: {
        en: ['Miriam', 'Deborah', 'Hannah', 'Rahab'],
        de: ['Mirjam', 'Debora', 'Hanna', 'Rahab']
      },
      correctIndex: 1,
      explanation: {
        en: 'Deborah was a prophetess and judge who led Israel to victory alongside the general Barak.',
        de: 'Debora war eine Prophetin und Richterin, die Israel zusammen mit dem General Barak zum Sieg führte.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'Where did Deborah sit when she judged Israel?',
        de: 'Wo saß Debora, als sie Israel richtete?'
      },
      options: {
        en: ['In a temple', 'On a mountain', 'Under a palm tree', 'In a palace'],
        de: ['In einem Tempel', 'Auf einem Berg', 'Unter einer Palme', 'In einem Palast']
      },
      correctIndex: 2,
      explanation: {
        en: 'Deborah held court under a palm tree between Ramah and Bethel.',
        de: 'Debora hielt Gericht unter einer Palme zwischen Rama und Bethel.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'The original outdoor office.',
        de: 'Das originale Freiluft-Büro.'
      }
    },
    {
      question: {
        en: 'What was the name of Jesus\' mother?',
        de: 'Wie hieß die Mutter von Jesus?'
      },
      options: {
        en: ['Martha', 'Mary', 'Elizabeth', 'Sarah'],
        de: ['Martha', 'Maria', 'Elisabeth', 'Sara']
      },
      correctIndex: 1,
      explanation: {
        en: 'Mary was chosen by God to be the mother of Jesus. She said, \"I am the Lord\'s servant.\"',
        de: 'Maria wurde von Gott auserwählt, die Mutter von Jesus zu sein. Sie sagte: „Ich bin die Magd des Herrn."'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'Which sister sat at Jesus\' feet to listen while her sister Martha was busy cooking?',
        de: 'Welche Schwester saß zu Jesu Füßen und hörte zu, während ihre Schwester Martha mit Kochen beschäftigt war?'
      },
      options: {
        en: ['Mary', 'Elizabeth', 'Salome', 'Joanna'],
        de: ['Maria', 'Elisabeth', 'Salome', 'Johanna']
      },
      correctIndex: 0,
      explanation: {
        en: 'Mary chose to sit and learn from Jesus, and He said she had chosen the better thing.',
        de: 'Maria entschied sich, zu sitzen und von Jesus zu lernen, und Er sagte, sie habe das Bessere gewählt.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What did Martha complain about to Jesus?',
        de: 'Worüber beschwerte sich Martha bei Jesus?'
      },
      options: {
        en: ['That Mary wasn\'t helping with the work', 'The weather', 'That there wasn\'t enough food', 'That the house was too small'],
        de: ['Dass Maria nicht bei der Arbeit half', 'Das Wetter', 'Dass es nicht genug Essen gab', 'Dass das Haus zu klein war']
      },
      correctIndex: 0,
      explanation: {
        en: 'Martha was upset that Mary was sitting with Jesus instead of helping prepare the meal.',
        de: 'Martha war verärgert, dass Maria bei Jesus saß, anstatt beim Essen vorzubereiten zu helfen.'
      },
      difficulty: 1,
      funnyComment: {
        en: 'Every sibling argument ever, but with Jesus as the referee.',
        de: 'Jeder Geschwisterstreit aller Zeiten, aber mit Jesus als Schiedsrichter.'
      }
    },
    {
      question: {
        en: 'Which woman hid the Israelite spies in Jericho and was saved when the city fell?',
        de: 'Welche Frau versteckte die israelitischen Kundschafter in Jericho und wurde gerettet, als die Stadt fiel?'
      },
      options: {
        en: ['Rahab', 'Deborah', 'Ruth', 'Esther'],
        de: ['Rahab', 'Debora', 'Ruth', 'Ester']
      },
      correctIndex: 0,
      explanation: {
        en: 'Rahab hid the spies on her roof and hung a red cord from her window as a sign of protection.',
        de: 'Rahab versteckte die Kundschafter auf ihrem Dach und hängte ein rotes Seil aus ihrem Fenster als Schutzzeichen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'What color cord did Rahab hang from her window?',
        de: 'Welche Farbe hatte das Seil, das Rahab aus ihrem Fenster hängte?'
      },
      options: {
        en: ['Blue', 'Scarlet (red)', 'White', 'Green'],
        de: ['Blau', 'Scharlachrot', 'Weiß', 'Grün']
      },
      correctIndex: 1,
      explanation: {
        en: 'Rahab tied a scarlet cord in her window so the Israelite army would know to spare her family.',
        de: 'Rahab band ein scharlachrotes Seil in ihr Fenster, damit die israelitische Armee wusste, ihre Familie zu verschonen.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'Which woman prayed so desperately for a child that the priest thought she was drunk?',
        de: 'Welche Frau betete so verzweifelt um ein Kind, dass der Priester dachte, sie sei betrunken?'
      },
      options: {
        en: ['Sarah', 'Hannah', 'Rachel', 'Elizabeth'],
        de: ['Sara', 'Hanna', 'Rahel', 'Elisabeth']
      },
      correctIndex: 1,
      explanation: {
        en: 'Hannah prayed silently with such passion that the priest Eli mistook her for being drunk.',
        de: 'Hanna betete so leidenschaftlich und still, dass der Priester Eli dachte, sie sei betrunken.'
      },
      difficulty: 2,
      funnyComment: {
        en: 'When your prayer is so intense it gets misunderstood.',
        de: 'Wenn dein Gebet so intensiv ist, dass es missverstanden wird.'
      }
    },
    {
      question: {
        en: 'What was the name of Hannah\'s son whom she dedicated to God?',
        de: 'Wie hieß Hannas Sohn, den sie Gott weihte?'
      },
      options: {
        en: ['Elijah', 'Solomon', 'Samuel', 'David'],
        de: ['Elia', 'Salomo', 'Samuel', 'David']
      },
      correctIndex: 2,
      explanation: {
        en: 'Hannah named her son Samuel and brought him to serve in the temple as she had promised God.',
        de: 'Hanna nannte ihren Sohn Samuel und brachte ihn in den Tempel zum Dienst, wie sie es Gott versprochen hatte.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'Who was Moses\' sister who watched over him as a baby floating in a basket on the Nile?',
        de: 'Wer war Moses\' Schwester, die über ihn wachte, als er als Baby in einem Körbchen auf dem Nil trieb?'
      },
      options: {
        en: ['Hannah', 'Miriam', 'Deborah', 'Rahab'],
        de: ['Hanna', 'Mirjam', 'Debora', 'Rahab']
      },
      correctIndex: 1,
      explanation: {
        en: 'Miriam bravely watched over baby Moses and cleverly suggested their mother as a nurse to Pharaoh\'s daughter.',
        de: 'Mirjam wachte mutig über den kleinen Mose und schlug klug ihre Mutter als Amme bei Pharaos Tochter vor.'
      },
      difficulty: 1
    },
    {
      question: {
        en: 'What did Miriam do after the Israelites crossed the Red Sea?',
        de: 'Was tat Mirjam, nachdem die Israeliten das Rote Meer durchquert hatten?'
      },
      options: {
        en: ['She cried', 'She led the women in singing and dancing', 'She built an altar', 'She went to sleep'],
        de: ['Sie weinte', 'Sie führte die Frauen im Singen und Tanzen an', 'Sie baute einen Altar', 'Sie ging schlafen']
      },
      correctIndex: 1,
      explanation: {
        en: 'Miriam took a tambourine and led the women in a joyful song of praise to God.',
        de: 'Mirjam nahm ein Tamburin und führte die Frauen in einem freudigen Loblied an Gott an.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'Which wise woman brought food to David to prevent him from taking revenge on her foolish husband Nabal?',
        de: 'Welche kluge Frau brachte David Essen, um ihn davon abzuhalten, sich an ihrem törichten Ehemann Nabal zu rächen?'
      },
      options: {
        en: ['Bathsheba', 'Abigail', 'Michal', 'Ahinoam'],
        de: ['Bathseba', 'Abigail', 'Michal', 'Ahinoam']
      },
      correctIndex: 1,
      explanation: {
        en: 'Abigail quickly prepared food and humbly met David to calm his anger and prevent bloodshed.',
        de: 'Abigail bereitete schnell Essen zu und traf David demütig, um seinen Zorn zu besänftigen und Blutvergießen zu verhindern.'
      },
      difficulty: 3
    },
    {
      question: {
        en: 'Who was the seller of purple cloth in Philippi who became one of the first European Christians?',
        de: 'Wer war die Purpurhändlerin in Philippi, die eine der ersten europäischen Christinnen wurde?'
      },
      options: {
        en: ['Phoebe', 'Dorcas', 'Priscilla', 'Lydia'],
        de: ['Phöbe', 'Dorkas', 'Priszilla', 'Lydia']
      },
      correctIndex: 3,
      explanation: {
        en: 'Lydia listened to Paul\'s message, believed, and opened her home to the missionaries.',
        de: 'Lydia hörte Paulus\' Botschaft, glaubte und öffnete ihr Haus für die Missionare.'
      },
      difficulty: 2
    },
    {
      question: {
        en: 'Which woman, along with her husband Aquila, taught the preacher Apollos more about Jesus?',
        de: 'Welche Frau erklärte zusammen mit ihrem Mann Aquila dem Prediger Apollos mehr über Jesus?'
      },
      options: {
        en: ['Lydia', 'Priscilla', 'Mary Magdalene', 'Joanna'],
        de: ['Lydia', 'Priszilla', 'Maria Magdalena', 'Johanna']
      },
      correctIndex: 1,
      explanation: {
        en: 'Priscilla and Aquila invited Apollos to their home and taught him the way of God more accurately.',
        de: 'Priszilla und Aquila luden Apollos in ihr Haus ein und lehrten ihn den Weg Gottes genauer.'
      },
      difficulty: 3
    },
    {
      question: {
        en: 'What was the name of Moses\' mother who hid him as a baby to save his life?',
        de: 'Wie hieß Moses\' Mutter, die ihn als Baby versteckte, um sein Leben zu retten?'
      },
      options: {
        en: ['Zipporah', 'Hagar', 'Miriam', 'Jochebed'],
        de: ['Zippora', 'Hagar', 'Mirjam', 'Jochebed']
      },
      correctIndex: 3,
      explanation: {
        en: 'Jochebed hid baby Moses for three months and then placed him in a waterproof basket among the reeds of the Nile.',
        de: 'Jochebed versteckte den kleinen Mose drei Monate lang und legte ihn dann in ein wasserdichtes Körbchen ins Schilf des Nils.'
      },
      difficulty: 3,
      funnyComment: {
        en: 'The original baby boat escape plan.',
        de: 'Der originale Baby-Boot-Fluchtplan.'
      }
    },
    {
      question: {
        en: 'What did the angel say to Mary when he told her she would have a baby?',
        de: 'Was sagte der Engel zu Maria, als er ihr sagte, dass sie ein Baby bekommen würde?'
      },
      options: {
        en: ['\"Do not be afraid\"', '\"Be careful\"', '\"Run and hide\"', '\"Tell everyone\"'],
        de: ['„Fürchte dich nicht"', '„Sei vorsichtig"', '„Lauf und versteck dich"', '„Erzähl es allen"']
      },
      correctIndex: 0,
      explanation: {
        en: 'The angel Gabriel said, \"Do not be afraid, Mary, you have found favor with God.\"',
        de: 'Der Engel Gabriel sagte: „Fürchte dich nicht, Maria, du hast Gnade bei Gott gefunden."'
      },
      difficulty: 1
    }
  ]
};
