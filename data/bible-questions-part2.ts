// Part 2: gospels, earlyChurch, wisdom, exile, return, parables
// Uses long-form field names; adapted at merge time in bible-questions.ts

export const PART2: Record<string, any[]> = {
  gospels: [
    {
      question: {
        en: 'In which town was Jesus born?',
        de: 'In welcher Stadt wurde Jesus geboren?'
      },
      options: {
        en: ['Bethlehem', 'Nazareth', 'Jerusalem', 'Capernaum'],
        de: ['Bethlehem', 'Nazareth', 'Jerusalem', 'Kapernaum']
      },
      correctIndex: 0,
      difficulty: 1,
      explanation: {
        en: 'Jesus was born in Bethlehem, just as the prophets foretold.',
        de: 'Jesus wurde in Bethlehem geboren, genau wie die Propheten vorhergesagt hatten.'
      },
      funnyComment: {
        en: 'The smallest town with the biggest birthday ever!',
        de: 'Die kleinste Stadt mit dem größten Geburtstag aller Zeiten!'
      }
    },
    {
      question: {
        en: 'Who baptized Jesus in the Jordan River?',
        de: 'Wer taufte Jesus im Jordan?'
      },
      options: {
        en: ['Peter', 'James', 'Andrew', 'John the Baptist'],
        de: ['Petrus', 'Jakobus', 'Andreas', 'Johannes der Täufer']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: 'John the Baptist baptized Jesus and saw the Spirit descend like a dove.',
        de: 'Johannes der Täufer taufte Jesus und sah den Geist wie eine Taube herabkommen.'
      }
    },
    {
      question: {
        en: 'How many days was Jesus tempted in the wilderness?',
        de: 'Wie viele Tage wurde Jesus in der Wüste versucht?'
      },
      options: {
        en: ['40', '12', '7', '30'],
        de: ['40', '12', '7', '30']
      },
      correctIndex: 0,
      difficulty: 1,
      explanation: {
        en: 'Jesus fasted and was tempted for 40 days and 40 nights.',
        de: 'Jesus fastete und wurde 40 Tage und 40 Nächte lang versucht.'
      }
    },
    {
      question: {
        en: 'What was the first miracle Jesus performed?',
        de: 'Was war das erste Wunder, das Jesus vollbrachte?'
      },
      options: {
        en: ['Healing a blind man', 'Walking on water', 'Feeding 5,000', 'Turning water into wine'],
        de: ['Heilung eines Blinden', 'Auf dem Wasser gehen', 'Speisung der 5.000', 'Wasser in Wein verwandeln']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'At a wedding in Cana, Jesus turned water into wine — his first recorded miracle.',
        de: 'Bei einer Hochzeit in Kana verwandelte Jesus Wasser in Wein — sein erstes aufgezeichnetes Wunder.'
      },
      funnyComment: {
        en: 'Best wedding caterer in history!',
        de: 'Der beste Hochzeitscaterer der Geschichte!'
      }
    },
    {
      question: {
        en: 'How many loaves of bread did Jesus use to feed 5,000 people?',
        de: 'Wie viele Brote benutzte Jesus, um 5.000 Menschen zu speisen?'
      },
      options: {
        en: ['5', '7', '3', '12'],
        de: ['5', '7', '3', '12']
      },
      correctIndex: 0,
      difficulty: 1,
      explanation: {
        en: 'Jesus used 5 loaves and 2 fish to feed over 5,000 people.',
        de: 'Jesus benutzte 5 Brote und 2 Fische, um über 5.000 Menschen zu speisen.'
      }
    },
    {
      question: {
        en: 'Which disciple walked on water toward Jesus but then started sinking?',
        de: 'Welcher Jünger ging auf dem Wasser zu Jesus, begann dann aber zu sinken?'
      },
      options: {
        en: ['John', 'James', 'Andrew', 'Peter'],
        de: ['Johannes', 'Jakobus', 'Andreas', 'Petrus']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Peter walked on water but sank when he took his eyes off Jesus.',
        de: 'Petrus ging auf dem Wasser, sank aber, als er den Blick von Jesus abwandte.'
      },
      funnyComment: {
        en: 'Note to self: don\'t look down!',
        de: 'Merke: Nicht nach unten schauen!'
      }
    },
    {
      question: {
        en: 'What did Jesus say to the storm on the Sea of Galilee?',
        de: 'Was sagte Jesus zu dem Sturm auf dem See Genezareth?'
      },
      options: {
        en: ['Stop now', 'Calm down', 'Go away', 'Peace, be still'],
        de: ['Hör auf', 'Beruhige dich', 'Geh weg', 'Schweig, verstumme']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Jesus commanded "Peace, be still!" and the wind and waves obeyed him.',
        de: 'Jesus gebot „Schweig, verstumme!" und Wind und Wellen gehorchten ihm.'
      }
    },
    {
      question: {
        en: 'Who was the man Jesus raised from the dead after four days?',
        de: 'Wen erweckte Jesus nach vier Tagen von den Toten?'
      },
      options: {
        en: ['Bartimaeus', 'Nicodemus', 'Zacchaeus', 'Lazarus'],
        de: ['Bartimäus', 'Nikodemus', 'Zachäus', 'Lazarus']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Jesus raised his friend Lazarus from the tomb in Bethany.',
        de: 'Jesus erweckte seinen Freund Lazarus aus dem Grab in Bethanien.'
      }
    },
    {
      question: {
        en: 'What is the mountain where Jesus gave his most famous sermon?',
        de: 'Auf welchem Berg hielt Jesus seine berühmteste Predigt?'
      },
      options: {
        en: ['A mountain (Sermon on the Mount)', 'Mount Carmel', 'Mount Sinai', 'Mount Hermon'],
        de: ['Ein Berg (Bergpredigt)', 'Berg Karmel', 'Berg Sinai', 'Berg Hermon']
      },
      correctIndex: 0,
      difficulty: 2,
      explanation: {
        en: 'The Sermon on the Mount is found in Matthew 5–7.',
        de: 'Die Bergpredigt findet sich in Matthäus 5–7.'
      }
    },
    {
      question: {
        en: '"Blessed are the peacemakers" is part of which teaching?',
        de: '„Selig sind die Friedensstifter" gehört zu welcher Lehre?'
      },
      options: {
        en: ['The Lord\'s Prayer', 'The Ten Commandments', 'The Beatitudes', 'The Great Commission'],
        de: ['Das Vaterunser', 'Die Zehn Gebote', 'Die Seligpreisungen', 'Der Missionsbefehl']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'The Beatitudes are blessings Jesus proclaimed at the start of the Sermon on the Mount.',
        de: 'Die Seligpreisungen sind Segnungen, die Jesus zu Beginn der Bergpredigt verkündete.'
      }
    },
    {
      question: {
        en: 'Which prayer did Jesus teach his disciples when they asked how to pray?',
        de: 'Welches Gebet lehrte Jesus seine Jünger, als sie fragten, wie man beten soll?'
      },
      options: {
        en: ['The Psalms', 'The Shema', 'The Aaronic Blessing', 'The Lord\'s Prayer'],
        de: ['Die Psalmen', 'Das Schma', 'Der Aaronitische Segen', 'Das Vaterunser']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: 'Jesus taught the Lord\'s Prayer beginning with "Our Father in heaven."',
        de: 'Jesus lehrte das Vaterunser, das mit „Vater unser im Himmel" beginnt.'
      }
    },
    {
      question: {
        en: 'How many disciples did Jesus choose?',
        de: 'Wie viele Jünger wählte Jesus aus?'
      },
      options: {
        en: ['12', '7', '10', '15'],
        de: ['12', '7', '10', '15']
      },
      correctIndex: 0,
      difficulty: 1,
      explanation: {
        en: 'Jesus chose 12 apostles to follow him and spread the good news.',
        de: 'Jesus wählte 12 Apostel aus, die ihm folgen und die frohe Botschaft verbreiten sollten.'
      },
      funnyComment: {
        en: 'Just enough for a football team plus a sub!',
        de: 'Genug für eine Fußballmannschaft plus einen Ersatzspieler!'
      }
    },
    {
      question: {
        en: 'What were brothers Peter and Andrew doing when Jesus called them?',
        de: 'Was taten die Brüder Petrus und Andreas, als Jesus sie berief?'
      },
      options: {
        en: ['Building a house', 'Farming', 'Collecting taxes', 'Fishing'],
        de: ['Ein Haus bauen', 'Ackerbau betreiben', 'Steuern eintreiben', 'Fischen']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: 'Peter and Andrew were fishermen. Jesus told them he would make them fishers of men.',
        de: 'Petrus und Andreas waren Fischer. Jesus sagte, er würde sie zu Menschenfischern machen.'
      }
    },
    {
      question: {
        en: 'What happened when Jesus healed the man born blind in John chapter 9?',
        de: 'Was geschah, als Jesus den blindgeborenen Mann in Johannes Kapitel 9 heilte?'
      },
      options: {
        en: ['He touched his forehead', 'He said a prayer and clapped', 'He used water from a well', 'He made mud and put it on the man\'s eyes'],
        de: ['Er berührte seine Stirn', 'Er sprach ein Gebet und klatschte', 'Er benutzte Brunnenwasser', 'Er machte Lehm und legte ihn auf die Augen']
      },
      correctIndex: 3,
      difficulty: 3,
      explanation: {
        en: 'Jesus made mud with saliva, put it on the man\'s eyes, and told him to wash in the Pool of Siloam.',
        de: 'Jesus machte Lehm mit Speichel, legte ihn auf die Augen und schickte ihn zum Teich Siloah.'
      }
    },
    {
      question: {
        en: 'What did the voice from heaven say at Jesus\' baptism?',
        de: 'Was sagte die Stimme vom Himmel bei der Taufe Jesu?'
      },
      options: {
        en: ['Go and preach', 'You are the Messiah', 'This is my servant', 'This is my beloved Son'],
        de: ['Geh und predige', 'Du bist der Messias', 'Dies ist mein Diener', 'Dies ist mein geliebter Sohn']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'God said, "This is my beloved Son, in whom I am well pleased."',
        de: 'Gott sagte: „Dies ist mein geliebter Sohn, an dem ich Wohlgefallen habe."'
      }
    },
    {
      question: {
        en: 'Which of the Beatitudes says "they shall inherit the earth"?',
        de: 'Welche der Seligpreisungen sagt „sie werden die Erde erben"?'
      },
      options: {
        en: ['Blessed are the poor in spirit', 'Blessed are the pure in heart', 'Blessed are those who mourn', 'Blessed are the meek'],
        de: ['Selig sind die geistlich Armen', 'Selig sind die reinen Herzens', 'Selig sind die Trauernden', 'Selig sind die Sanftmütigen']
      },
      correctIndex: 3,
      difficulty: 3,
      explanation: {
        en: '"Blessed are the meek, for they shall inherit the earth" (Matthew 5:5).',
        de: '„Selig sind die Sanftmütigen, denn sie werden die Erde erben" (Matthäus 5,5).'
      }
    },
    {
      question: {
        en: 'Where was Jesus when he calmed the storm?',
        de: 'Wo war Jesus, als er den Sturm stillte?'
      },
      options: {
        en: ['In the temple', 'By the Jordan River', 'On a mountain', 'In a boat on the Sea of Galilee'],
        de: ['Im Tempel', 'Am Jordan', 'Auf einem Berg', 'In einem Boot auf dem See Genezareth']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: 'Jesus was sleeping in a boat when the storm arose. He stood and calmed it.',
        de: 'Jesus schlief in einem Boot, als der Sturm aufkam. Er stand auf und stillte ihn.'
      },
      funnyComment: {
        en: 'He slept through a storm and then told it to hush!',
        de: 'Er schlief durch einen Sturm und sagte ihm dann, still zu sein!'
      }
    },
    {
      question: {
        en: 'Which tax collector climbed a tree to see Jesus?',
        de: 'Welcher Steuereinnehmer kletterte auf einen Baum, um Jesus zu sehen?'
      },
      options: {
        en: ['Zacchaeus', 'Levi', 'Matthew', 'Nicodemus'],
        de: ['Zachäus', 'Levi', 'Matthäus', 'Nikodemus']
      },
      correctIndex: 0,
      difficulty: 1,
      explanation: {
        en: 'Zacchaeus was short, so he climbed a sycamore tree to see Jesus passing by.',
        de: 'Zachäus war klein, deshalb kletterte er auf einen Maulbeerfeigenbaum, um Jesus vorbeiziehen zu sehen.'
      },
      funnyComment: {
        en: 'When you\'re short, you get creative!',
        de: 'Wenn man klein ist, wird man kreativ!'
      }
    },
    {
      question: {
        en: 'How many baskets of leftovers remained after Jesus fed the 5,000?',
        de: 'Wie viele Körbe mit Resten blieben übrig, nachdem Jesus die 5.000 gespeist hatte?'
      },
      options: {
        en: ['5', '7', '3', '12'],
        de: ['5', '7', '3', '12']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Twelve baskets of leftovers were collected — more than they started with!',
        de: 'Zwölf Körbe mit Resten wurden eingesammelt — mehr als sie am Anfang hatten!'
      }
    },
    {
      question: {
        en: 'During the temptation, what did the devil ask Jesus to turn stones into?',
        de: 'Was sollte Jesus laut dem Teufel bei der Versuchung aus Steinen machen?'
      },
      options: {
        en: ['Gold', 'Water', 'Bread', 'Fish'],
        de: ['Gold', 'Wasser', 'Brot', 'Fisch']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'The devil said, "If you are the Son of God, tell these stones to become bread."',
        de: 'Der Teufel sagte: „Wenn du Gottes Sohn bist, so sprich, dass diese Steine Brot werden."'
      }
    }
  ],

  earlyChurch: [
    {
      question: {
        en: 'What event happened on the day of Pentecost?',
        de: 'Was geschah am Pfingsttag?'
      },
      options: {
        en: ['The Holy Spirit came upon the believers', 'Jesus ascended to heaven', 'Jesus was baptized', 'The temple was rebuilt'],
        de: ['Der Heilige Geist kam auf die Gläubigen', 'Jesus fuhr in den Himmel auf', 'Jesus wurde getauft', 'Der Tempel wurde wieder aufgebaut']
      },
      correctIndex: 0,
      difficulty: 1,
      explanation: {
        en: 'On Pentecost, the Holy Spirit came with wind and tongues of fire.',
        de: 'An Pfingsten kam der Heilige Geist mit Wind und Feuerzungen.'
      },
      funnyComment: {
        en: 'The original fire sermon!',
        de: 'Die originale Feuerpredigt!'
      }
    },
    {
      question: {
        en: 'What could the believers suddenly do after receiving the Holy Spirit at Pentecost?',
        de: 'Was konnten die Gläubigen plötzlich tun, nachdem sie den Heiligen Geist an Pfingsten empfangen hatten?'
      },
      options: {
        en: ['Fly', 'Read minds', 'Become invisible', 'Speak in other languages'],
        de: ['Fliegen', 'Gedanken lesen', 'Unsichtbar werden', 'In anderen Sprachen reden']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: 'They spoke in different languages so people from many nations could understand.',
        de: 'Sie redeten in verschiedenen Sprachen, damit Menschen aus vielen Nationen sie verstehen konnten.'
      }
    },
    {
      question: {
        en: 'Who was the first Christian martyr stoned to death?',
        de: 'Wer war der erste christliche Märtyrer, der gesteinigt wurde?'
      },
      options: {
        en: ['Paul', 'Peter', 'James', 'Stephen'],
        de: ['Paulus', 'Petrus', 'Jakobus', 'Stephanus']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Stephen was stoned for his faith. He saw heaven open as he died.',
        de: 'Stephanus wurde wegen seines Glaubens gesteinigt. Er sah den Himmel offen, als er starb.'
      }
    },
    {
      question: {
        en: 'What was Saul (Paul) doing when he had his dramatic conversion?',
        de: 'Was tat Saulus (Paulus), als er seine dramatische Bekehrung erlebte?'
      },
      options: {
        en: ['Fishing on a lake', 'Praying in the temple', 'Traveling to Damascus', 'Sitting at home'],
        de: ['Fischen auf einem See', 'Im Tempel beten', 'Auf dem Weg nach Damaskus', 'Zuhause sitzen']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'Saul was on the road to Damascus to arrest Christians when a bright light blinded him.',
        de: 'Saulus war auf dem Weg nach Damaskus, um Christen zu verhaften, als ein helles Licht ihn blendete.'
      },
      funnyComment: {
        en: 'Worst road trip ever turned into the best!',
        de: 'Der schlimmste Roadtrip aller Zeiten wurde zum besten!'
      }
    },
    {
      question: {
        en: 'What happened to Paul after the bright light on the Damascus road?',
        de: 'Was geschah mit Paulus nach dem hellen Licht auf dem Weg nach Damaskus?'
      },
      options: {
        en: ['He turned invisible', 'He could fly', 'He became blind for three days', 'He fell asleep for a week'],
        de: ['Er wurde unsichtbar', 'Er konnte fliegen', 'Er wurde drei Tage lang blind', 'Er schlief eine Woche lang']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'Paul was blind for three days until Ananias came and prayed for him.',
        de: 'Paulus war drei Tage blind, bis Ananias kam und für ihn betete.'
      }
    },
    {
      question: {
        en: 'Who traveled with Paul on his first missionary journey?',
        de: 'Wer reiste mit Paulus auf seiner ersten Missionsreise?'
      },
      options: {
        en: ['Timothy', 'Silas', 'Barnabas', 'Luke'],
        de: ['Timotheus', 'Silas', 'Barnabas', 'Lukas']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'Barnabas, the "Son of Encouragement," accompanied Paul on his first journey.',
        de: 'Barnabas, der „Sohn des Trostes," begleitete Paulus auf seiner ersten Reise.'
      }
    },
    {
      question: {
        en: 'What nickname was Barnabas known by?',
        de: 'Unter welchem Spitznamen war Barnabas bekannt?'
      },
      options: {
        en: ['The Rock', 'Son of Thunder', 'The Beloved', 'Son of Encouragement'],
        de: ['Der Fels', 'Sohn des Donners', 'Der Geliebte', 'Sohn des Trostes']
      },
      correctIndex: 3,
      difficulty: 3,
      explanation: {
        en: 'Barnabas means "Son of Encouragement" — he always lifted people up.',
        de: 'Barnabas bedeutet „Sohn des Trostes" — er ermutigte immer andere.'
      }
    },
    {
      question: {
        en: 'Who replaced Barnabas as Paul\'s travel companion on the second journey?',
        de: 'Wer ersetzte Barnabas als Reisebegleiter von Paulus auf der zweiten Reise?'
      },
      options: {
        en: ['Silas', 'Luke', 'Timothy', 'Titus'],
        de: ['Silas', 'Lukas', 'Timotheus', 'Titus']
      },
      correctIndex: 0,
      difficulty: 2,
      explanation: {
        en: 'Silas joined Paul for the second missionary journey after Paul and Barnabas disagreed.',
        de: 'Silas schloss sich Paulus für die zweite Missionsreise an, nachdem Paulus und Barnabas sich uneinig waren.'
      }
    },
    {
      question: {
        en: 'How old was Timothy approximately when he began traveling with Paul?',
        de: 'Wie alt war Timotheus ungefähr, als er anfing, mit Paulus zu reisen?'
      },
      options: {
        en: ['About 50', 'About 40', 'A young man (teenager or early 20s)', 'A small child'],
        de: ['Etwa 50', 'Etwa 40', 'Ein junger Mann (Teenager oder Anfang 20)', 'Ein kleines Kind']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'Timothy was young. Paul later wrote, "Let no one despise your youth."',
        de: 'Timotheus war jung. Paulus schrieb später: „Niemand verachte deine Jugend."'
      },
      funnyComment: {
        en: 'Proof that kids can do big things for God!',
        de: 'Beweis, dass Kinder Großes für Gott tun können!'
      }
    },
    {
      question: {
        en: 'What happened to the Philippian jailer after an earthquake opened the prison doors?',
        de: 'Was geschah mit dem Gefängniswärter in Philippi, nachdem ein Erdbeben die Gefängnistüren öffnete?'
      },
      options: {
        en: ['He ran away', 'He and his family were baptized', 'He punished the prisoners', 'He locked the doors again'],
        de: ['Er rannte weg', 'Er und seine Familie wurden getauft', 'Er bestrafte die Gefangenen', 'Er schloss die Türen wieder']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'The jailer asked, "What must I do to be saved?" and believed with his whole household.',
        de: 'Der Wärter fragte: „Was muss ich tun, um gerettet zu werden?" und glaubte mit seinem ganzen Haus.'
      }
    },
    {
      question: {
        en: 'What were Paul and Silas doing in prison at midnight before the earthquake?',
        de: 'Was taten Paulus und Silas um Mitternacht im Gefängnis vor dem Erdbeben?'
      },
      options: {
        en: ['Planning an escape', 'Arguing', 'Sleeping', 'Singing and praying'],
        de: ['Eine Flucht planen', 'Streiten', 'Schlafen', 'Singen und beten']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: 'Paul and Silas sang hymns and prayed at midnight, and all the prisoners listened.',
        de: 'Paulus und Silas sangen Loblieder und beteten um Mitternacht, und alle Gefangenen hörten zu.'
      },
      funnyComment: {
        en: 'Midnight prison karaoke with God as the DJ!',
        de: 'Mitternachts-Gefängnis-Karaoke mit Gott als DJ!'
      }
    },
    {
      question: {
        en: 'On which island was Paul shipwrecked on his way to Rome?',
        de: 'Auf welcher Insel erlitt Paulus Schiffbruch auf dem Weg nach Rom?'
      },
      options: {
        en: ['Malta', 'Cyprus', 'Crete', 'Sicily'],
        de: ['Malta', 'Zypern', 'Kreta', 'Sizilien']
      },
      correctIndex: 0,
      difficulty: 3,
      explanation: {
        en: 'Paul was shipwrecked on Malta, where the islanders showed unusual kindness.',
        de: 'Paulus erlitt auf Malta Schiffbruch, wo die Inselbewohner ungewöhnliche Freundlichkeit zeigten.'
      }
    },
    {
      question: {
        en: 'What bit Paul on Malta but did not harm him?',
        de: 'Was biss Paulus auf Malta, schadete ihm aber nicht?'
      },
      options: {
        en: ['A scorpion', 'A dog', 'A viper (poisonous snake)', 'A spider'],
        de: ['Ein Skorpion', 'Ein Hund', 'Eine Viper (Giftschlange)', 'Eine Spinne']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'A viper fastened onto Paul\'s hand, but he shook it off without harm.',
        de: 'Eine Viper biss sich an Paulus\' Hand fest, aber er schüttelte sie ab ohne Schaden.'
      },
      funnyComment: {
        en: 'Snake: 0, Paul: 1!',
        de: 'Schlange: 0, Paulus: 1!'
      }
    },
    {
      question: {
        en: 'How many people survived the shipwreck with Paul?',
        de: 'Wie viele Menschen überlebten den Schiffbruch mit Paulus?'
      },
      options: {
        en: ['276', '76', '12', '100'],
        de: ['276', '76', '12', '100']
      },
      correctIndex: 0,
      difficulty: 3,
      explanation: {
        en: 'All 276 people on board survived, just as Paul said God had promised.',
        de: 'Alle 276 Menschen an Bord überlebten, genau wie Paulus es nach Gottes Verheißung gesagt hatte.'
      }
    },
    {
      question: {
        en: 'Where were believers first called "Christians"?',
        de: 'Wo wurden Gläubige zum ersten Mal „Christen" genannt?'
      },
      options: {
        en: ['Antioch', 'Rome', 'Jerusalem', 'Athens'],
        de: ['Antiochia', 'Rom', 'Jerusalem', 'Athen']
      },
      correctIndex: 0,
      difficulty: 3,
      explanation: {
        en: 'The disciples were first called Christians in Antioch (Acts 11:26).',
        de: 'Die Jünger wurden zum ersten Mal in Antiochia Christen genannt (Apostelgeschichte 11,26).'
      }
    },
    {
      question: {
        en: 'About how many people became believers after Peter\'s sermon at Pentecost?',
        de: 'Wie viele Menschen wurden ungefähr nach der Pfingstpredigt des Petrus gläubig?'
      },
      options: {
        en: ['500', '3,000', '100', '10,000'],
        de: ['500', '3.000', '100', '10.000']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'About 3,000 people were baptized that day after hearing Peter preach.',
        de: 'Etwa 3.000 Menschen wurden an diesem Tag getauft, nachdem sie Petrus predigen gehört hatten.'
      }
    },
    {
      question: {
        en: 'Which of Paul\'s letters was written to a church he praised for their joy?',
        de: 'Welcher Brief von Paulus wurde an eine Gemeinde geschrieben, die er für ihre Freude lobte?'
      },
      options: {
        en: ['Romans', 'Corinthians', 'Galatians', 'Philippians'],
        de: ['Römer', 'Korinther', 'Galater', 'Philipper']
      },
      correctIndex: 3,
      difficulty: 3,
      explanation: {
        en: 'Philippians is known as the "letter of joy" — Paul mentions joy and rejoicing many times.',
        de: 'Der Philipperbrief ist als „Brief der Freude" bekannt — Paulus erwähnt Freude viele Male.'
      }
    },
    {
      question: {
        en: 'Who was a tentmaker by trade, just like Paul?',
        de: 'Wer war wie Paulus von Beruf Zeltmacher?'
      },
      options: {
        en: ['Aquila and Priscilla', 'Silas', 'Barnabas', 'Timothy'],
        de: ['Aquila und Priszilla', 'Silas', 'Barnabas', 'Timotheus']
      },
      correctIndex: 0,
      difficulty: 3,
      explanation: {
        en: 'Aquila and Priscilla were tentmakers who worked alongside Paul in Corinth.',
        de: 'Aquila und Priszilla waren Zeltmacher, die in Korinth mit Paulus zusammenarbeiteten.'
      }
    },
    {
      question: {
        en: 'Which apostle had a vision of a sheet full of animals and was told to eat?',
        de: 'Welcher Apostel hatte eine Vision von einem Tuch voller Tiere und bekam den Befehl zu essen?'
      },
      options: {
        en: ['Paul', 'John', 'Peter', 'James'],
        de: ['Paulus', 'Johannes', 'Petrus', 'Jakobus']
      },
      correctIndex: 2,
      difficulty: 3,
      explanation: {
        en: 'Peter\'s vision taught him that God accepts people from every nation.',
        de: 'Petrus\' Vision lehrte ihn, dass Gott Menschen aus jeder Nation annimmt.'
      }
    },
    {
      question: {
        en: 'What did the early church share with each other?',
        de: 'Was teilten die ersten Christen miteinander?'
      },
      options: {
        en: ['Only prayers', 'Only food', 'Everything they had', 'Only clothing'],
        de: ['Nur Gebete', 'Nur Essen', 'Alles, was sie hatten', 'Nur Kleidung']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'The early believers shared everything and no one was in need (Acts 2:44–45).',
        de: 'Die ersten Gläubigen teilten alles und niemand litt Mangel (Apostelgeschichte 2,44–45).'
      }
    }
  ],

  wisdom: [
    {
      question: {
        en: 'Who wrote most of the Book of Proverbs?',
        de: 'Wer schrieb den Großteil des Buches der Sprüche?'
      },
      options: {
        en: ['Solomon', 'Moses', 'David', 'Samuel'],
        de: ['Salomo', 'Mose', 'David', 'Samuel']
      },
      correctIndex: 0,
      difficulty: 1,
      explanation: {
        en: 'King Solomon, known as the wisest man, wrote most of Proverbs.',
        de: 'König Salomo, bekannt als der weiseste Mann, schrieb den Großteil der Sprüche.'
      },
      funnyComment: {
        en: 'When you have 3,000 proverbs, you write a book!',
        de: 'Wenn man 3.000 Sprüche hat, schreibt man ein Buch!'
      }
    },
    {
      question: {
        en: 'According to Proverbs, what is the beginning of wisdom?',
        de: 'Was ist laut den Sprüchen der Anfang der Weisheit?'
      },
      options: {
        en: ['Going to school', 'Being rich', 'Reading books', 'The fear of the Lord'],
        de: ['Zur Schule gehen', 'Reich sein', 'Bücher lesen', 'Die Furcht des Herrn']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: '"The fear of the Lord is the beginning of wisdom" (Proverbs 9:10).',
        de: '„Die Furcht des Herrn ist der Anfang der Weisheit" (Sprüche 9,10).'
      }
    },
    {
      question: {
        en: 'What book says "there is a time for everything"?',
        de: 'Welches Buch sagt „Alles hat seine Zeit"?'
      },
      options: {
        en: ['Proverbs', 'Ecclesiastes', 'Job', 'Psalms'],
        de: ['Sprüche', 'Prediger', 'Hiob', 'Psalmen']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'Ecclesiastes 3:1 says, "There is a time for everything under the sun."',
        de: 'Prediger 3,1 sagt: „Alles hat seine Zeit unter der Sonne."'
      }
    },
    {
      question: {
        en: 'Who wrote Ecclesiastes?',
        de: 'Wer schrieb den Prediger (Kohelet)?'
      },
      options: {
        en: ['David', 'Isaiah', 'Jeremiah', 'Solomon'],
        de: ['David', 'Jesaja', 'Jeremia', 'Salomo']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Solomon (called "the Preacher") is traditionally credited with writing Ecclesiastes.',
        de: 'Salomo (genannt „der Prediger") wird traditionell als Autor des Predigerbuches angesehen.'
      }
    },
    {
      question: {
        en: 'The Song of Solomon is mainly about what?',
        de: 'Wovon handelt das Hohelied Salomos hauptsächlich?'
      },
      options: {
        en: ['Building the temple', 'War and battles', 'Cooking recipes', 'Love and marriage'],
        de: ['Den Tempelbau', 'Krieg und Schlachten', 'Kochrezepte', 'Liebe und Ehe']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: 'The Song of Solomon is a poetic book celebrating love between a bride and groom.',
        de: 'Das Hohelied ist ein poetisches Buch, das die Liebe zwischen Braut und Bräutigam feiert.'
      }
    },
    {
      question: {
        en: 'What did Job lose at the beginning of his story?',
        de: 'Was verlor Hiob am Anfang seiner Geschichte?'
      },
      options: {
        en: ['Only his money', 'Only his health', 'His wealth, children, and health', 'Only his house'],
        de: ['Nur sein Geld', 'Nur seine Gesundheit', 'Seinen Reichtum, seine Kinder und seine Gesundheit', 'Nur sein Haus']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'Job lost almost everything — his animals, servants, children, and finally his health.',
        de: 'Hiob verlor fast alles — seine Tiere, Diener, Kinder und schließlich seine Gesundheit.'
      }
    },
    {
      question: {
        en: 'How many friends came to "comfort" Job?',
        de: 'Wie viele Freunde kamen, um Hiob zu „trösten"?'
      },
      options: {
        en: ['2', '3', '4', '5'],
        de: ['2', '3', '4', '5']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'Three friends — Eliphaz, Bildad, and Zophar — came to visit Job.',
        de: 'Drei Freunde — Eliphas, Bildad und Zophar — kamen, um Hiob zu besuchen.'
      },
      funnyComment: {
        en: 'With friends like these, who needs enemies?',
        de: 'Mit solchen Freunden braucht man keine Feinde!'
      }
    },
    {
      question: {
        en: 'What did Job\'s friends wrongly say was the reason for his suffering?',
        de: 'Was sagten Hiobs Freunde fälschlicherweise als Grund für sein Leiden?'
      },
      options: {
        en: ['He ate the wrong food', 'He didn\'t pray enough', 'He must have sinned', 'Bad luck'],
        de: ['Er hat das Falsche gegessen', 'Er hat nicht genug gebetet', 'Er muss gesündigt haben', 'Pech']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'Job\'s friends assumed his suffering was punishment for sin, but God said they were wrong.',
        de: 'Hiobs Freunde nahmen an, sein Leiden sei Strafe für Sünde, aber Gott sagte, sie lagen falsch.'
      }
    },
    {
      question: {
        en: 'What did God do for Job at the end of his story?',
        de: 'Was tat Gott für Hiob am Ende seiner Geschichte?'
      },
      options: {
        en: ['Sent him away', 'Made him a king', 'Gave him back double what he lost', 'Nothing'],
        de: ['Schickte ihn weg', 'Machte ihn zum König', 'Gab ihm das Doppelte zurück', 'Nichts']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'God restored Job\'s fortunes and gave him twice as much as before.',
        de: 'Gott stellte Hiobs Wohlstand wieder her und gab ihm doppelt so viel wie zuvor.'
      }
    },
    {
      question: {
        en: 'In Proverbs, wisdom is compared to what precious thing?',
        de: 'Womit wird Weisheit in den Sprüchen verglichen?'
      },
      options: {
        en: ['Diamonds', 'Rubies (more precious than all)', 'Gold', 'Silver'],
        de: ['Diamanten', 'Rubine (kostbarer als alles)', 'Gold', 'Silber']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'Proverbs 3:15 says wisdom is "more precious than rubies."',
        de: 'Sprüche 3,15 sagt, Weisheit ist „kostbarer als Rubine."'
      }
    },
    {
      question: {
        en: 'Proverbs describes a foolish person and a wise person. The wise person builds on what?',
        de: 'Die Sprüche beschreiben einen Narren und einen Weisen. Worauf baut der Weise?'
      },
      options: {
        en: ['Money', 'Sand', 'A strong foundation of knowledge', 'Luck'],
        de: ['Geld', 'Sand', 'Ein starkes Fundament des Wissens', 'Glück']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'Proverbs teaches that wisdom provides a solid foundation for life.',
        de: 'Die Sprüche lehren, dass Weisheit ein solides Fundament für das Leben bietet.'
      }
    },
    {
      question: {
        en: 'Which Psalm says "The Lord is my shepherd, I shall not want"?',
        de: 'Welcher Psalm sagt „Der Herr ist mein Hirte, mir wird nichts mangeln"?'
      },
      options: {
        en: ['Psalm 1', 'Psalm 23', 'Psalm 119', 'Psalm 100'],
        de: ['Psalm 1', 'Psalm 23', 'Psalm 119', 'Psalm 100']
      },
      correctIndex: 1,
      difficulty: 1,
      explanation: {
        en: 'Psalm 23 is one of the most beloved psalms, written by David the shepherd boy.',
        de: 'Psalm 23 ist einer der beliebtesten Psalmen, geschrieben von David, dem Hirtenjungen.'
      }
    },
    {
      question: {
        en: 'What does Ecclesiastes say is "vanity" or "meaningless"?',
        de: 'Was nennt der Prediger „Eitelkeit" oder „nichtig"?'
      },
      options: {
        en: ['Only money', 'Only work', 'Everything without God', 'Only fun'],
        de: ['Nur Geld', 'Nur Arbeit', 'Alles ohne Gott', 'Nur Spaß']
      },
      correctIndex: 2,
      difficulty: 3,
      explanation: {
        en: 'Ecclesiastes teaches that life without God is like chasing the wind.',
        de: 'Der Prediger lehrt, dass das Leben ohne Gott wie das Jagen nach Wind ist.'
      },
      funnyComment: {
        en: 'Ever tried to catch the wind? Exactly.',
        de: 'Schon mal versucht, den Wind zu fangen? Eben.'
      }
    },
    {
      question: {
        en: 'Proverbs says "a gentle answer turns away" what?',
        de: 'Die Sprüche sagen: „Eine sanfte Antwort wendet ab" — was?'
      },
      options: {
        en: ['Happiness', 'Wrath (anger)', 'Rain', 'Friends'],
        de: ['Glück', 'Zorn', 'Regen', 'Freunde']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: '"A gentle answer turns away wrath, but a harsh word stirs up anger" (Proverbs 15:1).',
        de: '„Eine sanfte Antwort wendet den Zorn ab, aber ein hartes Wort erregt Grimm" (Sprüche 15,1).'
      }
    },
    {
      question: {
        en: 'In the Book of Job, who spoke to Job from a whirlwind?',
        de: 'Wer sprach im Buch Hiob aus einem Wirbelsturm zu Hiob?'
      },
      options: {
        en: ['God himself', 'Eliphaz', 'An angel', 'Satan'],
        de: ['Gott selbst', 'Eliphas', 'Ein Engel', 'Satan']
      },
      correctIndex: 0,
      difficulty: 2,
      explanation: {
        en: 'God answered Job out of the whirlwind and showed his power over all creation.',
        de: 'Gott antwortete Hiob aus dem Wirbelsturm und zeigte seine Macht über die ganze Schöpfung.'
      }
    },
    {
      question: {
        en: 'What animal does Proverbs tell lazy people to study?',
        de: 'Welches Tier sollen faule Menschen laut den Sprüchen studieren?'
      },
      options: {
        en: ['The lion', 'The eagle', 'The ox', 'The ant'],
        de: ['Den Löwen', 'Den Adler', 'Den Ochsen', 'Die Ameise']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: '"Go to the ant, you sluggard; consider its ways and be wise!" (Proverbs 6:6).',
        de: '„Geh zur Ameise, du Fauler; sieh ihre Wege an und werde weise!" (Sprüche 6,6).'
      },
      funnyComment: {
        en: 'Even tiny bugs can teach us big lessons!',
        de: 'Selbst kleine Käfer können uns große Lektionen lehren!'
      }
    },
    {
      question: {
        en: 'How many psalms are in the Book of Psalms?',
        de: 'Wie viele Psalmen enthält das Buch der Psalmen?'
      },
      options: {
        en: ['50', '100', '150', '200'],
        de: ['50', '100', '150', '200']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'There are 150 psalms — songs, prayers, and poems praising God.',
        de: 'Es gibt 150 Psalmen — Lieder, Gebete und Gedichte zum Lob Gottes.'
      }
    },
    {
      question: {
        en: 'Proverbs says that "pride goes before" what?',
        de: 'Die Sprüche sagen: „Stolz kommt vor" — was?'
      },
      options: {
        en: ['Success', 'A fall', 'Wealth', 'Wisdom'],
        de: ['Erfolg', 'Dem Fall', 'Reichtum', 'Weisheit']
      },
      correctIndex: 1,
      difficulty: 1,
      explanation: {
        en: '"Pride goes before destruction, and a haughty spirit before a fall" (Proverbs 16:18).',
        de: '„Stolz kommt vor dem Verderben und Hochmut vor dem Fall" (Sprüche 16,18).'
      }
    },
    {
      question: {
        en: 'What did Job say after God spoke to him from the whirlwind?',
        de: 'Was sagte Hiob, nachdem Gott aus dem Wirbelsturm zu ihm gesprochen hatte?'
      },
      options: {
        en: ['He walked away', 'He asked for gold', 'He complained more', 'He repented in dust and ashes'],
        de: ['Er ging weg', 'Er bat um Gold', 'Er beklagte sich mehr', 'Er bereute in Staub und Asche']
      },
      correctIndex: 3,
      difficulty: 3,
      explanation: {
        en: 'Job said, "I repent in dust and ashes" after seeing God\'s greatness.',
        de: 'Hiob sagte: „Ich bereue in Staub und Asche" nachdem er Gottes Größe sah.'
      }
    },
    {
      question: {
        en: 'Which psalm begins with "Make a joyful noise to the Lord"?',
        de: 'Welcher Psalm beginnt mit „Jauchzet dem Herrn"?'
      },
      options: {
        en: ['Psalm 23', 'Psalm 51', 'Psalm 100', 'Psalm 119'],
        de: ['Psalm 23', 'Psalm 51', 'Psalm 100', 'Psalm 119']
      },
      correctIndex: 2,
      difficulty: 3,
      explanation: {
        en: 'Psalm 100 calls everyone to worship God with gladness and singing.',
        de: 'Psalm 100 ruft alle auf, Gott mit Freude und Gesang anzubeten.'
      }
    }
  ],

  exile: [
    {
      question: {
        en: 'Which empire conquered Judah and took the people into exile?',
        de: 'Welches Reich eroberte Juda und führte das Volk in die Verbannung?'
      },
      options: {
        en: ['Egypt', 'Persia', 'Babylon', 'Rome'],
        de: ['Ägypten', 'Persien', 'Babylon', 'Rom']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'The Babylonian Empire under Nebuchadnezzar conquered Judah and destroyed the temple.',
        de: 'Das Babylonische Reich unter Nebukadnezar eroberte Juda und zerstörte den Tempel.'
      }
    },
    {
      question: {
        en: 'Who was the king of Babylon who captured Jerusalem?',
        de: 'Wer war der König von Babylon, der Jerusalem eroberte?'
      },
      options: {
        en: ['Cyrus', 'Darius', 'Nebuchadnezzar', 'Xerxes'],
        de: ['Kyros', 'Darius', 'Nebukadnezar', 'Xerxes']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'King Nebuchadnezzar destroyed Jerusalem and the temple in 586 BC.',
        de: 'König Nebukadnezar zerstörte Jerusalem und den Tempel im Jahr 586 v. Chr.'
      }
    },
    {
      question: {
        en: 'Why was Daniel thrown into the lions\' den?',
        de: 'Warum wurde Daniel in die Löwengrube geworfen?'
      },
      options: {
        en: ['He insulted the king', 'He tried to escape', 'He prayed to God instead of the king', 'He stole food'],
        de: ['Er beleidigte den König', 'Er versuchte zu fliehen', 'Er betete zu Gott statt zum König', 'Er stahl Essen']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'Daniel kept praying to God even when a law said to pray only to King Darius.',
        de: 'Daniel betete weiterhin zu Gott, obwohl ein Gesetz besagte, nur zu König Darius zu beten.'
      },
      funnyComment: {
        en: 'The lions were just big kittens that night!',
        de: 'Die Löwen waren in dieser Nacht nur große Kätzchen!'
      }
    },
    {
      question: {
        en: 'What happened to Daniel in the lions\' den?',
        de: 'Was geschah mit Daniel in der Löwengrube?'
      },
      options: {
        en: ['The lions ate him', 'He escaped by climbing out', 'He tamed the lions', 'God shut the lions\' mouths'],
        de: ['Die Löwen fraßen ihn', 'Er kletterte heraus', 'Er zähmte die Löwen', 'Gott verschloss den Löwen das Maul']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: 'God sent an angel who shut the lions\' mouths. Daniel was completely unharmed.',
        de: 'Gott sandte einen Engel, der den Löwen das Maul verschloss. Daniel blieb völlig unverletzt.'
      }
    },
    {
      question: {
        en: 'How many young men were thrown into the fiery furnace?',
        de: 'Wie viele junge Männer wurden in den Feuerofen geworfen?'
      },
      options: {
        en: ['1', '2', '3', '4'],
        de: ['1', '2', '3', '4']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'Shadrach, Meshach, and Abednego — three friends who refused to bow to the golden statue.',
        de: 'Schadrach, Meschach und Abed-Nego — drei Freunde, die sich weigerten, die goldene Statue anzubeten.'
      }
    },
    {
      question: {
        en: 'What did the king see inside the fiery furnace?',
        de: 'Was sah der König im Feuerofen?'
      },
      options: {
        en: ['Three men', 'An empty furnace', 'Nothing', 'Four figures, one like a son of the gods'],
        de: ['Drei Männer', 'Einen leeren Ofen', 'Nichts', 'Vier Gestalten, eine wie ein Göttersohn']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Nebuchadnezzar saw four people walking in the fire, though only three were thrown in!',
        de: 'Nebukadnezar sah vier Personen im Feuer, obwohl nur drei hineingeworfen wurden!'
      },
      funnyComment: {
        en: 'Unexpected guest at the hottest party ever!',
        de: 'Unerwarteter Gast auf der heißesten Party aller Zeiten!'
      }
    },
    {
      question: {
        en: 'What did Nebuchadnezzar dream about that troubled him greatly?',
        de: 'Wovon träumte Nebukadnezar, das ihn sehr beunruhigte?'
      },
      options: {
        en: ['A talking donkey', 'A flying chariot', 'A golden calf', 'A huge statue made of different materials'],
        de: ['Ein sprechender Esel', 'Ein fliegender Wagen', 'Ein goldenes Kalb', 'Eine riesige Statue aus verschiedenen Materialien']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'The statue had a gold head, silver chest, bronze belly, iron legs, and clay feet.',
        de: 'Die Statue hatte einen goldenen Kopf, silberne Brust, bronzenen Bauch, eiserne Beine und Füße aus Ton.'
      }
    },
    {
      question: {
        en: 'Who interpreted Nebuchadnezzar\'s dream about the statue?',
        de: 'Wer deutete Nebukadnezars Traum von der Statue?'
      },
      options: {
        en: ['Shadrach', 'The queen', 'Daniel', 'A magician'],
        de: ['Schadrach', 'Die Königin', 'Daniel', 'Ein Magier']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'Daniel asked God for wisdom and was able to describe and interpret the dream.',
        de: 'Daniel bat Gott um Weisheit und konnte den Traum beschreiben und deuten.'
      }
    },
    {
      question: {
        en: 'What mysterious thing appeared during Belshazzar\'s feast?',
        de: 'Was Geheimnisvolles erschien während Belsazars Fest?'
      },
      options: {
        en: ['A bright star', 'A burning bush', 'A hand writing on the wall', 'A floating crown'],
        de: ['Ein heller Stern', 'Ein brennender Busch', 'Eine Hand, die an die Wand schrieb', 'Eine schwebende Krone']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'A mysterious hand appeared and wrote words on the wall during the feast.',
        de: 'Eine geheimnisvolle Hand erschien und schrieb Worte an die Wand während des Festes.'
      },
      funnyComment: {
        en: 'The original "writing is on the wall" moment!',
        de: 'Der originale „die Schrift an der Wand" Moment!'
      }
    },
    {
      question: {
        en: 'What did the writing on the wall at Belshazzar\'s feast mean?',
        de: 'Was bedeutete die Schrift an der Wand bei Belsazars Fest?'
      },
      options: {
        en: ['The kingdom would grow', 'The kingdom was numbered, weighed, and divided', 'A new prince would come', 'More food was needed'],
        de: ['Das Reich würde wachsen', 'Das Reich wurde gezählt, gewogen und geteilt', 'Ein neuer Prinz würde kommen', 'Mehr Essen war nötig']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: '"MENE, MENE, TEKEL, UPHARSIN" meant God had judged and ended Belshazzar\'s kingdom.',
        de: '„MENE, MENE, TEKEL, UPHARSIN" bedeutete, dass Gott Belsazars Reich gerichtet und beendet hatte.'
      }
    },
    {
      question: {
        en: 'What food did Daniel and his friends choose to eat instead of the king\'s food?',
        de: 'Welches Essen wählten Daniel und seine Freunde statt des königlichen Essens?'
      },
      options: {
        en: ['Fish and milk', 'Fruit and honey', 'Meat and bread', 'Vegetables and water'],
        de: ['Fisch und Milch', 'Obst und Honig', 'Fleisch und Brot', 'Gemüse und Wasser']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Daniel asked for vegetables and water, and after 10 days they looked healthier than everyone else.',
        de: 'Daniel bat um Gemüse und Wasser, und nach 10 Tagen sahen sie gesünder aus als alle anderen.'
      }
    },
    {
      question: {
        en: 'What vision did Ezekiel have about dry bones?',
        de: 'Was sah Hesekiel in seiner Vision von den trockenen Knochen?'
      },
      options: {
        en: ['They turned to dust', 'They came together and lived again', 'They built a wall', 'They flew away'],
        de: ['Sie wurden zu Staub', 'Sie kamen zusammen und lebten wieder', 'Sie bauten eine Mauer', 'Sie flogen weg']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'God showed Ezekiel dry bones coming to life — a picture of Israel\'s future restoration.',
        de: 'Gott zeigte Hesekiel trockene Knochen, die lebendig wurden — ein Bild von Israels zukünftiger Wiederherstellung.'
      }
    },
    {
      question: {
        en: 'What did the valley of dry bones represent?',
        de: 'Was stellte das Tal der trockenen Knochen dar?'
      },
      options: {
        en: ['A graveyard', 'The people of Israel who would be restored', 'A battlefield', 'The end of the world'],
        de: ['Einen Friedhof', 'Das Volk Israel, das wiederhergestellt wird', 'Ein Schlachtfeld', 'Das Ende der Welt']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'The dry bones symbolized Israel in exile — scattered but destined for new life.',
        de: 'Die trockenen Knochen symbolisierten Israel im Exil — zerstreut, aber für neues Leben bestimmt.'
      }
    },
    {
      question: {
        en: 'Ezekiel was both a prophet and a what?',
        de: 'Hesekiel war sowohl ein Prophet als auch ein was?'
      },
      options: {
        en: ['King', 'Priest', 'Soldier', 'Farmer'],
        de: ['König', 'Priester', 'Soldat', 'Bauer']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'Ezekiel was a priest and a prophet who served God during the exile in Babylon.',
        de: 'Hesekiel war ein Priester und Prophet, der Gott während des Exils in Babylon diente.'
      }
    },
    {
      question: {
        en: 'What bizarre vision did Ezekiel see by the river Chebar?',
        de: 'Welche seltsame Vision hatte Hesekiel am Fluss Kebar?'
      },
      options: {
        en: ['A talking tree', 'Four living creatures with wheels', 'A giant fish', 'A golden city'],
        de: ['Einen sprechenden Baum', 'Vier lebende Wesen mit Rädern', 'Einen riesigen Fisch', 'Eine goldene Stadt']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'Ezekiel saw four living creatures, each with four faces, and wheels within wheels.',
        de: 'Hesekiel sah vier lebende Wesen, jedes mit vier Gesichtern, und Räder in Rädern.'
      },
      funnyComment: {
        en: 'The wildest vision in the whole Bible!',
        de: 'Die wildeste Vision in der ganzen Bibel!'
      }
    },
    {
      question: {
        en: 'How many times a day did Daniel pray, even when it was illegal?',
        de: 'Wie oft am Tag betete Daniel, auch als es verboten war?'
      },
      options: {
        en: ['Once', 'Twice', 'Three times', 'Five times'],
        de: ['Einmal', 'Zweimal', 'Dreimal', 'Fünfmal']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'Daniel prayed three times a day facing Jerusalem, no matter what.',
        de: 'Daniel betete dreimal am Tag in Richtung Jerusalem, egal was geschah.'
      }
    },
    {
      question: {
        en: 'What happened to Nebuchadnezzar because of his pride?',
        de: 'Was geschah mit Nebukadnezar wegen seines Stolzes?'
      },
      options: {
        en: ['He became very sick', 'He lived like a wild animal', 'He lost his crown forever', 'He was thrown in prison'],
        de: ['Er wurde sehr krank', 'Er lebte wie ein wildes Tier', 'Er verlor seine Krone für immer', 'Er wurde ins Gefängnis geworfen']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'God humbled Nebuchadnezzar. He ate grass like an ox until he acknowledged God.',
        de: 'Gott demütigte Nebukadnezar. Er aß Gras wie ein Ochse, bis er Gott anerkannte.'
      },
      funnyComment: {
        en: 'From king to cow — that\'s quite a career change!',
        de: 'Vom König zur Kuh — das ist ein Karrierewechsel!'
      }
    },
    {
      question: {
        en: 'In Daniel\'s vision, what did the four great beasts represent?',
        de: 'Was stellten die vier großen Tiere in Daniels Vision dar?'
      },
      options: {
        en: ['Four seasons', 'Four kingdoms that would rise', 'Four prophets', 'Four angels'],
        de: ['Vier Jahreszeiten', 'Vier Reiche, die aufsteigen würden', 'Vier Propheten', 'Vier Engel']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'The four beasts represented four great empires that would rule the world.',
        de: 'Die vier Tiere stellten vier große Reiche dar, die die Welt regieren würden.'
      }
    },
    {
      question: {
        en: 'Why did Shadrach, Meshach, and Abednego refuse to bow to the golden statue?',
        de: 'Warum weigerten sich Schadrach, Meschach und Abed-Nego, die goldene Statue anzubeten?'
      },
      options: {
        en: ['They were tired', 'They worshiped only the true God', 'They didn\'t hear the music', 'They were too far away'],
        de: ['Sie waren müde', 'Sie beteten nur den wahren Gott an', 'Sie hörten die Musik nicht', 'Sie waren zu weit weg']
      },
      correctIndex: 1,
      difficulty: 1,
      explanation: {
        en: 'They bravely said, "Our God can save us, but even if he doesn\'t, we will not bow."',
        de: 'Sie sagten mutig: „Unser Gott kann uns retten, aber selbst wenn nicht, werden wir uns nicht beugen."'
      }
    },
    {
      question: {
        en: 'What did Ezekiel eat that tasted sweet like honey?',
        de: 'Was aß Hesekiel, das süß wie Honig schmeckte?'
      },
      options: {
        en: ['A cake', 'A scroll (God\'s words)', 'A fruit', 'Some bread'],
        de: ['Einen Kuchen', 'Eine Schriftrolle (Gottes Worte)', 'Eine Frucht', 'Etwas Brot']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'God told Ezekiel to eat a scroll, and it tasted as sweet as honey in his mouth.',
        de: 'Gott sagte Hesekiel, er solle eine Schriftrolle essen, und sie schmeckte süß wie Honig.'
      }
    }
  ],

  return: [
    {
      question: {
        en: 'Which Persian king allowed the Jews to return to Jerusalem?',
        de: 'Welcher persische König erlaubte den Juden die Rückkehr nach Jerusalem?'
      },
      options: {
        en: ['Cyrus', 'Xerxes', 'Artaxerxes', 'Darius'],
        de: ['Kyros', 'Xerxes', 'Artaxerxes', 'Darius']
      },
      correctIndex: 0,
      difficulty: 2,
      explanation: {
        en: 'King Cyrus of Persia issued a decree allowing the Jewish exiles to go home.',
        de: 'König Kyros von Persien erließ ein Dekret, das den jüdischen Exilanten die Rückkehr erlaubte.'
      }
    },
    {
      question: {
        en: 'Who led the first group of exiles back to rebuild the temple?',
        de: 'Wer führte die erste Gruppe von Exilanten zurück, um den Tempel wieder aufzubauen?'
      },
      options: {
        en: ['Ezra', 'Nehemiah', 'Zerubbabel', 'Haggai'],
        de: ['Esra', 'Nehemia', 'Serubbabel', 'Haggai']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'Zerubbabel led the first wave of returning exiles and oversaw temple rebuilding.',
        de: 'Serubbabel führte die erste Welle der Rückkehrer an und beaufsichtigte den Tempelbau.'
      }
    },
    {
      question: {
        en: 'What was Ezra\'s role when he came to Jerusalem?',
        de: 'Was war Esras Aufgabe, als er nach Jerusalem kam?'
      },
      options: {
        en: ['He was a soldier', 'He was a priest and scribe who taught God\'s Law', 'He was a merchant', 'He was a builder'],
        de: ['Er war ein Soldat', 'Er war ein Priester und Schriftgelehrter, der Gottes Gesetz lehrte', 'Er war ein Händler', 'Er war ein Baumeister']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'Ezra was a priest and scribe who helped the people understand and follow God\'s Law.',
        de: 'Esra war ein Priester und Schriftgelehrter, der dem Volk half, Gottes Gesetz zu verstehen und zu befolgen.'
      }
    },
    {
      question: {
        en: 'What did Nehemiah rebuild in Jerusalem?',
        de: 'Was baute Nehemia in Jerusalem wieder auf?'
      },
      options: {
        en: ['The temple', 'The palace', 'The city walls', 'The marketplace'],
        de: ['Den Tempel', 'Den Palast', 'Die Stadtmauern', 'Den Marktplatz']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'Nehemiah organized the people to rebuild Jerusalem\'s broken walls.',
        de: 'Nehemia organisierte das Volk, um die zerstörten Mauern Jerusalems wieder aufzubauen.'
      },
      funnyComment: {
        en: 'History\'s greatest DIY project!',
        de: 'Das größte Heimwerker-Projekt der Geschichte!'
      }
    },
    {
      question: {
        en: 'How long did it take Nehemiah and the people to rebuild the wall?',
        de: 'Wie lange brauchten Nehemia und das Volk, um die Mauer wieder aufzubauen?'
      },
      options: {
        en: ['1 year', '6 months', '52 days', '7 days'],
        de: ['1 Jahr', '6 Monate', '52 Tage', '7 Tage']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'The wall was rebuilt in an amazing 52 days despite fierce opposition.',
        de: 'Die Mauer wurde in erstaunlichen 52 Tagen wiederaufgebaut, trotz starker Opposition.'
      },
      funnyComment: {
        en: '52 days? That\'s faster than most home renovations!',
        de: '52 Tage? Das ist schneller als die meisten Hausrenovierungen!'
      }
    },
    {
      question: {
        en: 'Who tried to stop Nehemiah from rebuilding the wall?',
        de: 'Wer versuchte, Nehemia am Wiederaufbau der Mauer zu hindern?'
      },
      options: {
        en: ['The Egyptians', 'Sanballat and Tobiah', 'The Romans', 'King Cyrus'],
        de: ['Die Ägypter', 'Sanballat und Tobija', 'Die Römer', 'König Kyros']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'Sanballat, Tobiah, and others mocked and threatened the builders, but Nehemiah trusted God.',
        de: 'Sanballat, Tobija und andere verspotteten und bedrohten die Bauleute, aber Nehemia vertraute Gott.'
      }
    },
    {
      question: {
        en: 'What job did Nehemiah have before going to Jerusalem?',
        de: 'Welchen Beruf hatte Nehemia, bevor er nach Jerusalem ging?'
      },
      options: {
        en: ['Farmer', 'Cupbearer to the king', 'Soldier', 'Priest'],
        de: ['Bauer', 'Mundschenk des Königs', 'Soldat', 'Priester']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'Nehemiah was the cupbearer to King Artaxerxes — a trusted and important position.',
        de: 'Nehemia war der Mundschenk von König Artaxerxes — eine vertrauensvolle und wichtige Position.'
      }
    },
    {
      question: {
        en: 'Queen Esther was brave enough to approach the king to save which people?',
        de: 'Königin Esther war mutig genug, zum König zu gehen, um welches Volk zu retten?'
      },
      options: {
        en: ['The Persians', 'The Jewish people', 'The Babylonians', 'The Egyptians'],
        de: ['Die Perser', 'Das jüdische Volk', 'Die Babylonier', 'Die Ägypter']
      },
      correctIndex: 1,
      difficulty: 1,
      explanation: {
        en: 'Esther risked her life to save the Jewish people from Haman\'s evil plot.',
        de: 'Esther riskierte ihr Leben, um das jüdische Volk vor Hamans bösem Plan zu retten.'
      }
    },
    {
      question: {
        en: 'Who was the villain in the Book of Esther who plotted to destroy the Jews?',
        de: 'Wer war der Bösewicht im Buch Esther, der plante, die Juden zu vernichten?'
      },
      options: {
        en: ['Xerxes', 'Sanballat', 'Mordecai', 'Haman'],
        de: ['Xerxes', 'Sanballat', 'Mordechai', 'Haman']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: 'Haman plotted to destroy all Jews, but his plan was exposed by Queen Esther.',
        de: 'Haman plante die Vernichtung aller Juden, aber sein Plan wurde von Königin Esther aufgedeckt.'
      }
    },
    {
      question: {
        en: 'What famous phrase did Mordecai say to Esther about her becoming queen?',
        de: 'Welchen berühmten Satz sagte Mordechai zu Esther über ihr Königin-Werden?'
      },
      options: {
        en: ['You are the chosen one', 'Perhaps you were born for such a time as this', 'The crown suits you', 'Go and be brave'],
        de: ['Du bist die Auserwählte', 'Vielleicht bist du für eine Zeit wie diese geboren', 'Die Krone steht dir', 'Geh und sei mutig']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'Mordecai reminded Esther that God may have placed her as queen for this very moment.',
        de: 'Mordechai erinnerte Esther daran, dass Gott sie vielleicht genau für diesen Moment zur Königin gemacht hatte.'
      }
    },
    {
      question: {
        en: 'Which prophet urged the people to finish rebuilding the temple?',
        de: 'Welcher Prophet drängte das Volk, den Tempel fertig zu bauen?'
      },
      options: {
        en: ['Haggai', 'Jeremiah', 'Isaiah', 'Malachi'],
        de: ['Haggai', 'Jeremia', 'Jesaja', 'Maleachi']
      },
      correctIndex: 0,
      difficulty: 2,
      explanation: {
        en: 'The prophet Haggai encouraged the people to stop delaying and finish God\'s temple.',
        de: 'Der Prophet Haggai ermutigte das Volk, nicht länger zu zögern und Gottes Tempel fertig zu bauen.'
      }
    },
    {
      question: {
        en: 'What did Haggai say the people were doing instead of building God\'s house?',
        de: 'Was taten die Menschen laut Haggai, anstatt Gottes Haus zu bauen?'
      },
      options: {
        en: ['Fighting wars', 'Traveling far away', 'Sleeping all day', 'Building their own fancy houses'],
        de: ['Kriege führen', 'Weit weg reisen', 'Den ganzen Tag schlafen', 'Ihre eigenen schönen Häuser bauen']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Haggai rebuked the people for living in paneled houses while God\'s temple lay in ruins.',
        de: 'Haggai tadelte das Volk, weil es in getäfelten Häusern wohnte, während Gottes Tempel in Trümmern lag.'
      }
    },
    {
      question: {
        en: 'The prophet Zechariah had visions of what coming to Jerusalem?',
        de: 'Der Prophet Sacharja hatte Visionen von was, das nach Jerusalem kommt?'
      },
      options: {
        en: ['A great army', 'A coming King riding on a donkey', 'A flood of water', 'A flock of birds'],
        de: ['Ein großes Heer', 'Ein kommender König, der auf einem Esel reitet', 'Eine Wasserflut', 'Ein Vogelschwarm']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'Zechariah prophesied a gentle King coming on a donkey — fulfilled by Jesus.',
        de: 'Sacharja prophezeite einen sanftmütigen König auf einem Esel — erfüllt durch Jesus.'
      }
    },
    {
      question: {
        en: 'Malachi is the last book of the Old Testament. What does his name mean?',
        de: 'Maleachi ist das letzte Buch des Alten Testaments. Was bedeutet sein Name?'
      },
      options: {
        en: ['My Shepherd', 'My Helper', 'My Messenger', 'My King'],
        de: ['Mein Hirte', 'Mein Helfer', 'Mein Bote', 'Mein König']
      },
      correctIndex: 2,
      difficulty: 3,
      explanation: {
        en: 'Malachi means "My Messenger" — he delivered God\'s final Old Testament message.',
        de: 'Maleachi bedeutet „Mein Bote" — er überbrachte Gottes letzte Botschaft im Alten Testament.'
      }
    },
    {
      question: {
        en: 'What did Malachi challenge the people about regarding their offerings?',
        de: 'Wozu forderte Maleachi das Volk bezüglich seiner Opfergaben heraus?'
      },
      options: {
        en: ['They gave too much', 'They were giving blind and lame animals', 'They gave at the wrong time', 'They gave to the wrong temple'],
        de: ['Sie gaben zu viel', 'Sie gaben blinde und lahme Tiere', 'Sie gaben zur falschen Zeit', 'Sie gaben im falschen Tempel']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'Malachi rebuked them for offering sick animals instead of their best to God.',
        de: 'Maleachi tadelte sie, weil sie kranke Tiere statt ihres Besten Gott opferten.'
      }
    },
    {
      question: {
        en: 'What did the people weep about when they saw the new temple\'s foundation?',
        de: 'Worüber weinten die Menschen, als sie das Fundament des neuen Tempels sahen?'
      },
      options: {
        en: ['It was too big', 'The old people remembered Solomon\'s temple was grander', 'It was the wrong color', 'They were angry'],
        de: ['Es war zu groß', 'Die Alten erinnerten sich, dass Salomos Tempel prächtiger war', 'Es hatte die falsche Farbe', 'Sie waren wütend']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'The elders who remembered Solomon\'s temple wept because the new one seemed smaller.',
        de: 'Die Ältesten, die sich an Salomos Tempel erinnerten, weinten, weil der neue kleiner wirkte.'
      }
    },
    {
      question: {
        en: 'What did the builders hold in one hand while building the wall under Nehemiah?',
        de: 'Was hielten die Bauleute in einer Hand, während sie die Mauer unter Nehemia bauten?'
      },
      options: {
        en: ['Food', 'Weapons', 'Torches', 'Flags'],
        de: ['Essen', 'Waffen', 'Fackeln', 'Flaggen']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'The builders worked with one hand and held a weapon in the other because of threats.',
        de: 'Die Bauleute arbeiteten mit einer Hand und hielten in der anderen eine Waffe wegen der Bedrohungen.'
      },
      funnyComment: {
        en: 'Multitasking level: ancient Israel!',
        de: 'Multitasking-Level: antikes Israel!'
      }
    },
    {
      question: {
        en: 'Who was Esther\'s older cousin who raised her?',
        de: 'Wer war Esthers älterer Cousin, der sie aufzog?'
      },
      options: {
        en: ['Haman', 'Nehemiah', 'Mordecai', 'Ezra'],
        de: ['Haman', 'Nehemia', 'Mordechai', 'Esra']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'Mordecai raised Esther as his own daughter and later helped save the Jewish people.',
        de: 'Mordechai zog Esther wie seine eigene Tochter auf und half später, das jüdische Volk zu retten.'
      }
    },
    {
      question: {
        en: 'What does Malachi say God will send before the great day of the Lord?',
        de: 'Was sagt Maleachi, wird Gott vor dem großen Tag des Herrn senden?'
      },
      options: {
        en: ['A great army', 'The prophet Elijah', 'A golden throne', 'A mighty storm'],
        de: ['Ein großes Heer', 'Den Propheten Elia', 'Einen goldenen Thron', 'Einen mächtigen Sturm']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'Malachi 4:5 says God will send Elijah the prophet before that great day comes.',
        de: 'Maleachi 4,5 sagt, Gott wird den Propheten Elia senden, bevor der große Tag kommt.'
      }
    },
    {
      question: {
        en: 'Which king gave Nehemiah permission to go to Jerusalem?',
        de: 'Welcher König gab Nehemia die Erlaubnis, nach Jerusalem zu gehen?'
      },
      options: {
        en: ['Cyrus', 'Darius', 'Artaxerxes', 'Nebuchadnezzar'],
        de: ['Kyros', 'Darius', 'Artaxerxes', 'Nebukadnezar']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'King Artaxerxes saw Nehemiah\'s sadness and granted him leave to rebuild Jerusalem\'s walls.',
        de: 'König Artaxerxes sah Nehemias Traurigkeit und erlaubte ihm, Jerusalems Mauern wieder aufzubauen.'
      }
    }
  ],

  parables: [
    {
      question: {
        en: 'In the Parable of the Prodigal Son, what did the younger son ask his father for?',
        de: 'Was bat der jüngere Sohn seinen Vater im Gleichnis vom verlorenen Sohn?'
      },
      options: {
        en: ['Permission to travel', 'A horse', 'His share of the inheritance early', 'A new house'],
        de: ['Erlaubnis zu reisen', 'Ein Pferd', 'Seinen Anteil am Erbe im Voraus', 'Ein neues Haus']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'The younger son asked for his inheritance early, then wasted it all.',
        de: 'Der jüngere Sohn bat um sein Erbe im Voraus und verschwendete dann alles.'
      }
    },
    {
      question: {
        en: 'What job did the Prodigal Son end up doing after spending all his money?',
        de: 'Welchen Job hatte der verlorene Sohn, nachdem er all sein Geld ausgegeben hatte?'
      },
      options: {
        en: ['Selling bread', 'Building houses', 'Fishing', 'Feeding pigs'],
        de: ['Brot verkaufen', 'Häuser bauen', 'Fischen', 'Schweine füttern']
      },
      correctIndex: 3,
      difficulty: 1,
      explanation: {
        en: 'He was so poor he ended up feeding pigs and wished he could eat their food.',
        de: 'Er war so arm, dass er Schweine fütterte und sich wünschte, ihr Futter essen zu können.'
      },
      funnyComment: {
        en: 'From riches to pig slop — that\'s quite a downgrade!',
        de: 'Vom Reichtum zum Schweinefutter — das ist ein ziemlicher Abstieg!'
      }
    },
    {
      question: {
        en: 'In the Good Samaritan parable, who walked past the injured man first?',
        de: 'Wer ging im Gleichnis vom barmherzigen Samariter zuerst an dem Verletzten vorbei?'
      },
      options: {
        en: ['A Roman soldier', 'A child', 'A priest', 'A Samaritan'],
        de: ['Ein römischer Soldat', 'Ein Kind', 'Ein Priester', 'Ein Samariter']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'A priest saw the injured man but crossed to the other side of the road.',
        de: 'Ein Priester sah den Verletzten, ging aber auf die andere Straßenseite.'
      }
    },
    {
      question: {
        en: 'In the Parable of the Sower, what happened to seeds that fell on rocky ground?',
        de: 'Was geschah im Gleichnis vom Sämann mit den Samen, die auf felsigen Boden fielen?'
      },
      options: {
        en: ['They grew into tall trees', 'They sprouted quickly but died in the sun', 'Birds ate them', 'They turned into flowers'],
        de: ['Sie wuchsen zu großen Bäumen', 'Sie keimten schnell, vertrockneten aber in der Sonne', 'Vögel fraßen sie', 'Sie wurden zu Blumen']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'Seeds on rocky ground grew fast but had no root, so they withered in the heat.',
        de: 'Samen auf felsigem Boden wuchsen schnell, hatten aber keine Wurzel und vertrockneten.'
      }
    },
    {
      question: {
        en: 'What does the mustard seed grow into in Jesus\' parable?',
        de: 'Wozu wächst das Senfkorn in Jesu Gleichnis heran?'
      },
      options: {
        en: ['A small flower', 'The largest garden plant (like a tree)', 'A vine', 'A bush that stays tiny'],
        de: ['Eine kleine Blume', 'Die größte Gartenpflanze (wie ein Baum)', 'Eine Rebe', 'Ein Busch, der klein bleibt']
      },
      correctIndex: 1,
      difficulty: 1,
      explanation: {
        en: 'The tiny mustard seed grows into the largest garden plant — birds nest in its branches!',
        de: 'Das winzige Senfkorn wächst zur größten Gartenpflanze — Vögel nisten in seinen Zweigen!'
      },
      funnyComment: {
        en: 'Proof that small things can become HUGE!',
        de: 'Beweis, dass kleine Dinge RIESIG werden können!'
      }
    },
    {
      question: {
        en: 'In the Parable of the Lost Sheep, how many sheep did the shepherd leave behind to find the lost one?',
        de: 'Wie viele Schafe ließ der Hirte im Gleichnis vom verlorenen Schaf zurück, um das verlorene zu finden?'
      },
      options: {
        en: ['50', '99', '90', '100'],
        de: ['50', '99', '90', '100']
      },
      correctIndex: 1,
      difficulty: 1,
      explanation: {
        en: 'The shepherd left 99 sheep to search for the 1 that was lost.',
        de: 'Der Hirte ließ 99 Schafe zurück, um das eine verlorene zu suchen.'
      }
    },
    {
      question: {
        en: 'In the Parable of the Lost Coin, how many coins did the woman have before losing one?',
        de: 'Wie viele Münzen hatte die Frau im Gleichnis von der verlorenen Münze, bevor sie eine verlor?'
      },
      options: {
        en: ['5', '10', '20', '100'],
        de: ['5', '10', '20', '100']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'The woman had 10 silver coins and searched the whole house until she found the lost one.',
        de: 'Die Frau hatte 10 Silbermünzen und durchsuchte das ganze Haus, bis sie die verlorene fand.'
      }
    },
    {
      question: {
        en: 'In the Pearl of Great Price parable, what did the merchant do when he found the perfect pearl?',
        de: 'Was tat der Kaufmann im Gleichnis von der kostbaren Perle, als er die perfekte Perle fand?'
      },
      options: {
        en: ['He gave it away', 'He showed it to the king', 'He sold everything he had to buy it', 'He hid it and forgot about it'],
        de: ['Er gab sie weg', 'Er zeigte sie dem König', 'Er verkaufte alles, um sie zu kaufen', 'Er versteckte sie und vergaß sie']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'The merchant sold everything to buy the pearl — like giving all for God\'s kingdom.',
        de: 'Der Kaufmann verkaufte alles, um die Perle zu kaufen — wie alles für Gottes Reich zu geben.'
      }
    },
    {
      question: {
        en: 'In the Parable of the Ten Virgins, what did the foolish ones forget to bring?',
        de: 'Was vergaßen die törichten Jungfrauen im Gleichnis von den zehn Jungfrauen mitzubringen?'
      },
      options: {
        en: ['Their dresses', 'Invitations', 'Food', 'Extra oil for their lamps'],
        de: ['Ihre Kleider', 'Einladungen', 'Essen', 'Zusätzliches Öl für ihre Lampen']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Five foolish virgins brought lamps but no extra oil, so their lamps went out.',
        de: 'Fünf törichte Jungfrauen brachten Lampen mit, aber kein zusätzliches Öl, und ihre Lampen erloschen.'
      }
    },
    {
      question: {
        en: 'In the Parable of the Talents, how many talents did the master give to the first servant?',
        de: 'Wie viele Talente gab der Herr im Gleichnis von den Talenten dem ersten Diener?'
      },
      options: {
        en: ['1', '2', '5', '10'],
        de: ['1', '2', '5', '10']
      },
      correctIndex: 2,
      difficulty: 2,
      explanation: {
        en: 'The first servant received 5 talents and doubled them to 10.',
        de: 'Der erste Diener erhielt 5 Talente und verdoppelte sie auf 10.'
      }
    },
    {
      question: {
        en: 'What did the servant with one talent do with it?',
        de: 'Was tat der Diener mit dem einen Talent?'
      },
      options: {
        en: ['He invested it wisely', 'He gave it to the poor', 'He buried it in the ground', 'He spent it on food'],
        de: ['Er investierte es klug', 'Er gab es den Armen', 'Er vergrub es in der Erde', 'Er gab es für Essen aus']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'The fearful servant buried his talent instead of using it, and the master was disappointed.',
        de: 'Der ängstliche Diener vergrub sein Talent, statt es zu nutzen, und der Herr war enttäuscht.'
      },
      funnyComment: {
        en: 'Worst investment strategy ever!',
        de: 'Die schlechteste Anlagestrategie aller Zeiten!'
      }
    },
    {
      question: {
        en: 'In the Parable of the Rich Fool, what did the rich man plan to build?',
        de: 'Was plante der reiche Mann im Gleichnis vom reichen Toren zu bauen?'
      },
      options: {
        en: ['A temple', 'Bigger barns', 'A castle', 'A ship'],
        de: ['Einen Tempel', 'Größere Scheunen', 'Ein Schloss', 'Ein Schiff']
      },
      correctIndex: 1,
      difficulty: 2,
      explanation: {
        en: 'The rich fool planned bigger barns to store his crops, but God said he would die that night.',
        de: 'Der reiche Tor plante größere Scheunen, aber Gott sagte, er würde in dieser Nacht sterben.'
      }
    },
    {
      question: {
        en: 'What happened to the man without a wedding garment in the Parable of the Wedding Banquet?',
        de: 'Was geschah mit dem Mann ohne Hochzeitskleid im Gleichnis vom Hochzeitsmahl?'
      },
      options: {
        en: ['He was given a new one', 'He was thrown out', 'He sat at the head table', 'He was ignored'],
        de: ['Er bekam ein neues', 'Er wurde hinausgeworfen', 'Er saß am Ehrentisch', 'Er wurde ignoriert']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'The man without proper wedding clothes was cast out — a picture of being unprepared for God\'s kingdom.',
        de: 'Der Mann ohne Hochzeitskleid wurde hinausgeworfen — ein Bild dafür, unvorbereitet für Gottes Reich zu sein.'
      }
    },
    {
      question: {
        en: 'In the Vineyard Workers parable, who complained about their pay?',
        de: 'Wer beschwerte sich im Gleichnis von den Arbeitern im Weinberg über den Lohn?'
      },
      options: {
        en: ['Those hired first (who worked all day)', 'The vineyard owner', 'Those hired last', 'Nobody complained'],
        de: ['Die zuerst Eingestellten (die den ganzen Tag arbeiteten)', 'Der Weinbergbesitzer', 'Die zuletzt Eingestellten', 'Niemand beschwerte sich']
      },
      correctIndex: 0,
      difficulty: 2,
      explanation: {
        en: 'Workers hired early complained because those hired late received the same pay — showing God\'s generous grace.',
        de: 'Die früh Eingestellten beschwerten sich, weil die spät Eingestellten gleich viel bekamen — ein Bild für Gottes großzügige Gnade.'
      }
    },
    {
      question: {
        en: 'What does the Prodigal Son\'s father do when he sees his son returning?',
        de: 'Was tut der Vater des verlorenen Sohnes, als er seinen Sohn zurückkommen sieht?'
      },
      options: {
        en: ['He runs to him and hugs him', 'He ignores him', 'He scolds him', 'He sends a servant'],
        de: ['Er rennt zu ihm und umarmt ihn', 'Er ignoriert ihn', 'Er schimpft ihn aus', 'Er schickt einen Diener']
      },
      correctIndex: 0,
      difficulty: 1,
      explanation: {
        en: 'The father ran to his son, embraced him, and threw a big celebration.',
        de: 'Der Vater rannte zu seinem Sohn, umarmte ihn und veranstaltete ein großes Fest.'
      },
      funnyComment: {
        en: 'Best dad hug in the entire Bible!',
        de: 'Die beste Papa-Umarmung in der ganzen Bibel!'
      }
    },
    {
      question: {
        en: 'In the Good Samaritan parable, why is it surprising that the Samaritan helped?',
        de: 'Warum ist es im Gleichnis vom barmherzigen Samariter überraschend, dass der Samariter half?'
      },
      options: {
        en: ['Samaritans were doctors', 'He was a priest', 'Samaritans were rich', 'Jews and Samaritans didn\'t get along'],
        de: ['Samariter waren Ärzte', 'Er war ein Priester', 'Samariter waren reich', 'Juden und Samariter verstanden sich nicht']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'Jews and Samaritans had a long history of conflict, making the Samaritan\'s kindness remarkable.',
        de: 'Juden und Samariter hatten eine lange Konfliktgeschichte, was die Freundlichkeit des Samariters bemerkenswert macht.'
      }
    },
    {
      question: {
        en: 'In the Parable of the Sower, what do the seeds represent?',
        de: 'Was stellen die Samen im Gleichnis vom Sämann dar?'
      },
      options: {
        en: ['Money', 'People', 'God\'s Word', 'Food'],
        de: ['Geld', 'Menschen', 'Gottes Wort', 'Essen']
      },
      correctIndex: 2,
      difficulty: 1,
      explanation: {
        en: 'The seeds represent God\'s Word being spread to different types of hearts.',
        de: 'Die Samen stellen Gottes Wort dar, das auf verschiedene Arten von Herzen fällt.'
      }
    },
    {
      question: {
        en: 'What did the woman do after finding her lost coin?',
        de: 'Was tat die Frau, nachdem sie ihre verlorene Münze gefunden hatte?'
      },
      options: {
        en: ['She gave it to the poor', 'She hid it somewhere safe', 'She spent it immediately', 'She called her friends to celebrate'],
        de: ['Sie gab sie den Armen', 'Sie versteckte sie sicher', 'Sie gab sie sofort aus', 'Sie rief ihre Freundinnen zum Feiern']
      },
      correctIndex: 3,
      difficulty: 2,
      explanation: {
        en: 'She called her neighbors to rejoice — just like heaven rejoices over one sinner who repents.',
        de: 'Sie rief ihre Nachbarinnen zum Freuen — genau wie der Himmel sich über einen Sünder freut, der umkehrt.'
      }
    },
    {
      question: {
        en: 'In the Parable of the Sower, what choked the seeds that fell among thorns?',
        de: 'Was erstickte die Samen im Gleichnis vom Sämann, die unter die Dornen fielen?'
      },
      options: {
        en: ['Too much water', 'Worries and riches of life', 'Insects', 'Cold weather'],
        de: ['Zu viel Wasser', 'Sorgen und Reichtum des Lebens', 'Insekten', 'Kaltes Wetter']
      },
      correctIndex: 1,
      difficulty: 3,
      explanation: {
        en: 'The thorns represent life\'s worries, riches, and pleasures that choke out God\'s Word.',
        de: 'Die Dornen stehen für die Sorgen, den Reichtum und die Vergnügungen des Lebens, die Gottes Wort ersticken.'
      }
    },
    {
      question: {
        en: 'How many of the ten virgins were wise and how many were foolish?',
        de: 'Wie viele der zehn Jungfrauen waren klug und wie viele töricht?'
      },
      options: {
        en: ['3 wise, 7 foolish', '5 wise, 5 foolish', '7 wise, 3 foolish', '2 wise, 8 foolish'],
        de: ['3 klug, 7 töricht', '5 klug, 5 töricht', '7 klug, 3 töricht', '2 klug, 8 töricht']
      },
      correctIndex: 1,
      difficulty: 1,
      explanation: {
        en: 'Five were wise (they brought extra oil) and five were foolish (they ran out).',
        de: 'Fünf waren klug (sie brachten extra Öl) und fünf waren töricht (ihnen ging es aus).'
      }
    }
  ]
};
