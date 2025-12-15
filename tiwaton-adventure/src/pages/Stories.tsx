import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, Mic, Sparkles, ChevronDown, ChevronUp, StopCircle } from 'lucide-react';
import type { Story } from '../types';
import { StorageService } from '../services/storage';

const DEFAULT_STORIES: Story[] = [
  {
    id: '1',
    title: 'The Brave Umbrella',
    content: "It was raining after church, and there was only one umbrella.\n\nMum opened it and covered the children first, even though her own clothes were getting wet.\n\n'Why, Mum?' they asked.\n\nShe smiled and said, 'Because parents are like umbrellas. We might get a little wet so you can stay dry.'\n\nThe children cuddled closer, feeling warm and safe under Mum’s brave umbrella.",
    isUserCreated: false
  },
  {
    id: '2',
    title: 'The Sharing Game',
    content: "David loved his new toy car so much that he did not want anyone to touch it.\n\nWhen his cousin visited, he watched the car from far away, looking a bit sad.\n\nDavid remembered how Jesus shared His time and stories with everyone.\n\nHe took a deep breath, walked over, and placed the car gently in his cousin’s hand.\n\n'Let’s race together,' he said.\n\nThe game became twice as fun when it was shared.",
    isUserCreated: false
  },
  {
    id: '3',
    title: 'The Little Star That Could',
    content: "Once there was a tiny star named Twinkle. He was smaller than all the other stars in the sky.\n\n'I'm too small to light up the dark,' he sighed.\n\nBut one cloudy night, the moon was hidden. The big stars were too far away to help a lost puppy find his way home.\n\nTwinkle squeezed his eyes shut and glowed as bright as he could. It was just enough light for the puppy to see the path!\n\nTwinkle learned that no matter how small you are, you can shine bright.",
    isUserCreated: false
  },
  {
    id: '4',
    title: 'Benny the Bear\'s Berry Pie',
    content: "Benny the Bear loved blueberries. He picked a whole basket full to make a pie.\n\nOn his way home, he saw a sad rabbit who was hungry. Benny gave him a handful of berries.\n\nThen he saw a bird with a hurt wing. He gave her some berries too.\n\nBy the time he got home, he only had a few berries left. 'Oh no, no pie for me,' he thought.\n\nBut just then, the rabbit and bird arrived with their friends, carrying strawberries, raspberries, and honey! They made the biggest fruit salad ever, together.",
    isUserCreated: false
  },
  {
    id: '5',
    title: 'The Turtle Who Won the Race',
    content: "You might know the story of the tortoise and the hare. But did you know what happened after?\n\nThe hare was sad he lost. The tortoise saw this and said, 'Hey, winning isn't everything. Do you want to learn how to be steady?'\n\nThe hare smiled. 'And I can teach you how to hop!'\n\nThey didn't race anymore. Instead, they explored the forest together, sometimes fast, sometimes slow, but always as friends.",
    isUserCreated: false
  },
  {
    id: '6',
    title: 'The Moon\'s Night Light',
    content: "One night, the Sun forgot to set. It stayed up late, chatting with the clouds.\n\nThe Moon waited and waited. 'It's my turn!' said the Moon.\n\nThe children below couldn't sleep because it was too bright.\n\nFinally, the Moon gently tapped the Sun on the shoulder. 'Go to sleep, Sun. I'll watch over them now.'\n\nThe Sun yawned and dipped below the horizon. The Moon turned on its soft, silver glow, and the whole world drifted into sweet dreams.",
    isUserCreated: false
  },
  {
    id: '7',
    title: 'Sarah\'s Magic Red Shoes',
    content: "Sarah had red shoes. She believed they made her run faster than the wind.\n\nOne day, she fell down and scraped her knee. 'My shoes didn't work!' she cried.\n\nHer dad hugged her. 'The magic isn't in the shoes, Sarah. It's in your legs and your brave heart.'\n\nSarah stood up, wiped her tears, and ran again. She was faster than ever, even without magic shoes.",
    isUserCreated: false
  },
  {
    id: '8',
    title: 'The Cloud That Giggled',
    content: "There was a fluffy white cloud named Puffy who was very ticklish.\n\nWhenever an airplane flew through him, he would giggle. 'Hee hee hee!'\n\nHis giggles shook the sky and sounded like thunder to the people below.\n\nOne day, a rainbow tickled him. Puffy laughed so hard that raindrops fell out.\n\n'Look! It's raining sunshine!' shouted the kids below. Puffy was happy to share his joy.",
    isUserCreated: false
  },
  {
    id: '9',
    title: 'Andy the Ant\'s Big Dream',
    content: "Andy was a very small ant with a very big dream. He wanted to see the top of the Great Oak Tree.\n\n'It's too high!' said his friends.\n\nAndy started climbing. One branch. Two branches. He got tired, but he didn't stop.\n\nA friendly butterfly offered him a ride, but Andy said, 'Thank you, but I want to do this myself.'\n\nIt took him three days, but when he reached the top, the view was beautiful. He could see the whole garden!",
    isUserCreated: false
  },
  {
    id: '10',
    title: 'Noah\'s Ark Adventure',
    content: "God told Noah to build a big boat because a flood was coming. It was hard work!\n\nPeople laughed at Noah. 'It's not even raining!' they said.\n\nBut Noah trusted God. He gathered animals two by two. Lions, elephants, and even tiny beetles.\n\nThen the rain came. Splash! Splash! But Noah and his family and the animals were safe inside.\n\nWhen the rain stopped, God sent a rainbow as a promise to never flood the earth again.",
    isUserCreated: false
  },
  {
    id: '11',
    title: 'David and Goliath',
    content: "Goliath was a giant soldier. He was big, scary, and mean. Everyone was afraid of him.\n\nEveryone except David. David was just a shepherd boy, but he loved God.\n\n'I am not afraid,' David said. He didn't wear heavy armor. He just took his slingshot and five smooth stones.\n\nWith one *woosh* and a *pop*, the stone hit Goliath, and the giant fell down!\n\nDavid showed that with God, even the smallest person can be brave.",
    isUserCreated: false
  },
  {
    id: '12',
    title: 'The Good Samaritan',
    content: "A man was hurt on the side of the road. A priest walked by but didn't stop. A helper walked by but didn't stop.\n\nThen a Samaritan man came. People thought Samaritans were not friendly.\n\nBut this man stopped. He cleaned the hurt man's wounds and took him to a safe place.\n\nJesus told this story to teach us that a neighbor is anyone who needs our help, no matter who they are.",
    isUserCreated: false
  },
  {
    id: '13',
    title: 'Daniel in the Lions\' Den',
    content: "King Darius liked Daniel, but some bad men tricked the King into making a law: 'No praying to God!'\n\nDaniel prayed anyway. He opened his window and talked to God three times a day.\n\nThe King had to throw Daniel into a pit full of hungry lions.\n\nBut God sent an angel to shut the lions' mouths! In the morning, Daniel was safe without a scratch.\n\nThe King was so happy and told everyone to honor Daniel's God.",
    isUserCreated: false
  },
  {
    id: '14',
    title: 'Jonah and the Big Fish',
    content: "God told Jonah to go to Nineveh. Jonah said 'No!' and got on a boat going the other way.\n\nA huge storm came. The sailors were scared. Jonah knew God sent the storm, so he told them to throw him into the water.\n\nGulp! A giant fish swallowed Jonah.\n\nJonah prayed inside the fish for three days. Then the fish spat him out on the beach.\n\nThis time, Jonah ran straight to Nineveh to do what God asked!",
    isUserCreated: false
  },
  {
    id: '15',
    title: 'The Tree That Whispered Secrets',
    content: "In the middle of the park stood an old willow tree with long, drooping branches.\n\nIf you sat very still under it, you could hear it whisper secrets of the wind.\n\n'Be kind,' it rustled.\n\n'Be patient,' it swayed.\n\nOne day, a boy sat under it feeling angry. The tree dropped a single leaf on his nose. The boy laughed. The tree had whispered a joke!",
    isUserCreated: false
  },
  {
    id: '16',
    title: 'Rusty the Robot\'s Garden',
    content: "Rusty was a robot made of metal, but he loved soft, colorful flowers.\n\nHe couldn't smell them, but he loved to watch them grow.\n\nOne summer, it didn't rain. The flowers started to droop.\n\nRusty had an idea! He used his oil can to carry water from the creek, back and forth, all day long.\n\nThe flowers drank the water and bloomed brighter than ever, hugging Rusty's metal legs.",
    isUserCreated: false
  },
  {
    id: '17',
    title: 'The Mystery of Invisible Ink',
    content: "Timmy received a blank piece of paper in the mail. 'What is this?' he asked.\n\nHis grandma called. 'Hold it up to the light, Timmy!'\n\nTimmy held the paper to the lamp. Slowly, letters appeared.\n\n'I LOVE YOU!' it said.\n\nTimmy learned that some of the best things are hidden until you look at them in the right light.",
    isUserCreated: false
  },
  {
    id: '18',
    title: 'Max the Monkey\'s Bananas',
    content: "Max the Monkey had 10 bananas. He wanted to eat them all.\n\nBut his tummy was small. He ate one. He ate two. He felt full.\n\nHe saw his friends looking at the yellow pile.\n\nMax threw a banana to Ellie the Elephant. He threw one to George the Giraffe.\n\nSoon, everyone was eating. Max realized that watching his friends eat was just as sweet as eating the bananas himself.",
    isUserCreated: false
  },
  {
    id: '19',
    title: 'The Boomerang of Kindness',
    content: "Jenny smiled at the bus driver. The bus driver smiled at a passenger.\n\nThe passenger helped a lady drop her heavy bag. The lady bought a coffee for a stranger.\n\nThe stranger came home and hugged his daughter.\n\nThat daughter was Jenny!\n\nHer kindness had traveled all around the town and came right back to her.",
    isUserCreated: false
  },
  {
    id: '20',
    title: 'The Little Engine That Could',
    content: "A train was stuck at the bottom of a hill. It was carrying toys for children.\n\n'I can't pull it,' said the Big Engine. 'I'm too tired.'\n\nThen came a Little Blue Engine. She was small, but she was brave.\n\n'I think I can, I think I can,' she puffed.\n\nShe pulled and tugged. Chug, chug, chug. Up the hill she went!\n\n'I thought I could!' she cheered as she zoomed down the other side.",
    isUserCreated: false
  },
  {
    id: '21',
    title: 'Goldilocks and the Three Bears',
    content: "Goldilocks saw a cottage in the woods. She went inside.\n\nShe tried Papa Bear's porridge. 'Too hot!'\n\nShe tried Mama Bear's porridge. 'Too cold!'\n\nShe tried Baby Bear's porridge. 'Just right!' And she ate it all up.\n\nWhen the bears came home, they weren't angry. They were just surprised.\n\nGoldilocks said 'Sorry!' and helped them make a new batch of porridge. They all ate together.",
    isUserCreated: false
  }
];

const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>(DEFAULT_STORIES);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [speakingStoryId, setSpeakingStoryId] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

  useEffect(() => {
    loadUserStories();
  }, []);

  const loadUserStories = async () => {
    const userStories = await StorageService.getStories();
    setStories([...DEFAULT_STORIES, ...userStories]);
  };

  const handleSpeak = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      if (speakingStoryId === id) {
        window.speechSynthesis.cancel();
        setSpeakingStoryId(null);
        return;
      }
      
      // Cancel any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeakingStoryId(null);
      
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.name.includes('Google US English') || v.lang === 'en-US');
      if (preferred) utterance.voice = preferred;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      window.speechSynthesis.speak(utterance);
      setSpeakingStoryId(id);
    } else {
      alert("Sorry, your browser doesn't support reading aloud!");
    }
  };

  const handleSaveStory = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    
    const story: Story = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      isUserCreated: true,
      author: 'Family'
    };

    await StorageService.addStory(story);
    setNewTitle('');
    setNewContent('');
    loadUserStories();
    const stats = StorageService.getGameStats();
    stats.xp += 50;
    StorageService.saveGameStats(stats);
    alert('Story Saved! +50 XP');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Create Story Section */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h3 className="font-display text-2xl text-pink-400 mb-4 flex items-center gap-2">
          <Sparkles /> Write an Adventure
        </h3>
        <div className="space-y-4">
          <input 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 focus:border-pink-500 outline-none"
              placeholder="Title (e.g. The Magic Sofa)"
              title="Story Title"
            />
          <textarea 
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 focus:border-pink-500 outline-none resize-none"
              placeholder="Once upon a time..."
              title="Story Content"
            />
          <button 
            onClick={handleSaveStory}
            title="Save your new story"
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform"
          >
            Save to Library
          </button>
        </div>
      </div>

      {/* Library Section (Collapsible) */}
      <div className="space-y-4">
        <button 
          onClick={() => setIsLibraryOpen(!isLibraryOpen)}
          title={isLibraryOpen ? "Collapse Library" : "Expand Library"}
          className="w-full flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          <h3 className="font-display text-2xl text-amber-400 flex items-center gap-2">
            <BookOpen /> Story Library ({stories.length})
          </h3>
          {isLibraryOpen ? <ChevronUp /> : <ChevronDown />}
        </button>

        {isLibraryOpen && (
          <div className="grid gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            {stories.map((story) => {
              const isPlaying = speakingStoryId === story.id;
              return (
                <div key={story.id} className={`bg-slate-800/50 border ${isPlaying ? 'border-amber-500 bg-slate-800' : 'border-slate-700'} rounded-xl p-5 hover:bg-slate-800 transition-colors`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-slate-100">{story.title}</h4>
                    {story.isUserCreated && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full uppercase">Family Made</span>}
                  </div>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-3 mb-4">
                    {story.content}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSpeak(story.content, story.id)}
                      title={isPlaying ? "Stop Reading" : "Read Aloud"}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'}`}
                    >
                      {isPlaying ? <><StopCircle size={16} /> Stop Reading</> : <><Volume2 size={16} /> Read Aloud</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;