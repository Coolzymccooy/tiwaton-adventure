import React, { useState, useEffect } from 'react';
import { Calculator, Search, HelpCircle, ArrowLeft, RefreshCw, Trophy, Star, XCircle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { AudioService } from '../services/audio';

// --- MATH BATTLE COMPONENT ---
const MathBattle: React.FC<{onBack: () => void}> = ({onBack}) => {
  const [heroHp, setHeroHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState("A wild Number Monster appeared!");

  const [stats, setStats] = useState(StorageService.getGameStats());
  const [currentLevel, setCurrentLevel] = useState(stats.mathLevel || 1);
  const [progress, setProgress] = useState(stats.mathProgress || 0); 
  
  const [question, setQuestion] = useState(generateQuestion(stats.mathLevel || 1));

  useEffect(() => {
    AudioService.speak(`Math Level ${currentLevel}. Battle Start!`);
    AudioService.speak(question.text);
  }, []);

  function generateQuestion(lvl: number) {
    let a, b, isPlus, isMult;
    if (lvl === 1) {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        isPlus = true;
    } else if (lvl === 2) {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        isPlus = Math.random() > 0.5;
    } else if (lvl === 3) {
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        isPlus = Math.random() > 0.5;
    } else {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        isMult = Math.random() > 0.7;
        isPlus = Math.random() > 0.5;
    }

    let answer, text;
    if (isMult) {
        answer = a * b;
        text = `${a} × ${b}`;
    } else if (isPlus) {
        answer = a + b;
        text = `${a} + ${b}`;
    } else {
        if (a < b) [a, b] = [b, a];
        answer = a - b;
        text = `${a} - ${b}`;
    }

    return {
      text: `${text} = ?`,
      ttsText: text.replace('+', 'plus').replace('-', 'minus').replace('×', 'times'),
      answer: answer,
      options: generateOptions(answer)
    };
  }

  function generateOptions(ans: number) {
    const opts = new Set([ans]);
    while (opts.size < 3) {
      opts.add(ans + Math.floor(Math.random() * 10) - 5);
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  }

  const handleAnswer = (val: number) => {
    if (val === question.answer) {
      AudioService.playEffect('correct');
      const dmg = 20 + (streak * 5);
      setEnemyHp(prev => Math.max(0, prev - dmg));
      setStreak(s => s + 1);
      setMessage(`POW! You dealt ${dmg} damage!`);
      
      const newProgress = progress + 1;
      
      if (newProgress >= 10) {
          const newLevel = currentLevel + 1;
          AudioService.speak(`Incredible! Level ${newLevel} Unlocked!`);
          setMessage(`LEVEL UP! Now entering Level ${newLevel}`);
          setCurrentLevel(newLevel);
          setProgress(0);
          
          const newStats = { ...stats, mathLevel: newLevel, mathProgress: 0, xp: stats.xp + 100 };
          StorageService.saveGameStats(newStats);
          setStats(newStats);

          setTimeout(() => {
              setEnemyHp(100);
              const q = generateQuestion(newLevel);
              setQuestion(q);
              AudioService.speak(q.ttsText);
          }, 2000);
      } else {
          setProgress(newProgress);
          const newStats = { ...stats, mathProgress: newProgress, xp: stats.xp + 10 };
          StorageService.saveGameStats(newStats);
          setStats(newStats);

          if (enemyHp - dmg <= 0) {
             setEnemyHp(100);
             setMessage("Monster Defeated! Another one appears!");
             AudioService.speak("Monster defeated! Keep going!");
          }

          setTimeout(() => {
              const q = generateQuestion(currentLevel);
              setQuestion(q);
              AudioService.speak(q.ttsText);
          }, 1000);
      }
    } else {
      AudioService.playEffect('wrong');
      AudioService.speak("Oops, try again!");
      setHeroHp(prev => Math.max(0, prev - 15));
      setStreak(0);
      setMessage("Ouch! The monster attacked you!");
      if (heroHp - 15 <= 0) {
        setMessage("Oh no! Retreat and try again.");
        AudioService.speak("Oh no, you need to rest. Try again later.");
        setTimeout(onBack, 2000);
      }
    }
  };

  return (
    <div className="relative">
      <button onClick={onBack} title="Quit Math Battle" className="mb-4 flex items-center gap-2 bg-red-500/10 text-red-300 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all font-bold">
        <XCircle size={20}/> Quit Game
      </button>

      <div className="max-w-xl mx-auto bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-4 bg-slate-900 p-2 rounded-xl border border-indigo-500/30">
            <div className="flex items-center gap-2">
                <Trophy className="text-yellow-400" size={20}/>
                <span className="font-bold text-white">Level {currentLevel}</span>
            </div>
            <div className="flex flex-col items-end w-32">
                <span className="text-xs text-slate-400 mb-1">Challenge {progress}/10</span>
                <div className="w-full h-2 bg-slate-700 rounded-full">
                    <div className="h-full bg-yellow-400 rounded-full transition-all" style={{width: `${(progress/10)*100}%`}}></div>
                </div>
            </div>
        </div>
        <div className="flex justify-between mb-4 font-bold text-xs uppercase tracking-widest text-slate-500">
           <span>Hero</span>
           <span>Monster</span>
        </div>
        <div className="absolute top-24 left-0 w-full h-2 bg-slate-700"><div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${heroHp}%` }}></div></div>
        <div className="absolute top-24 right-0 w-full h-2 bg-slate-700 mt-1"><div className="h-full bg-red-500 ml-auto transition-all duration-500" style={{ width: `${enemyHp}%` }}></div></div>

        <div className="text-center py-8 mt-4">
            <div className="text-6xl mb-4 animate-bounce">👾</div>
            <h3 className="text-2xl font-black text-white mb-2">{message}</h3>
            <div className="bg-slate-900 p-8 rounded-2xl mb-6 border-4 border-indigo-500 cursor-pointer" onClick={() => AudioService.speak(question.ttsText)} title="Hear Question">
              <span className="text-5xl font-black text-white">{question.text}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
            {question.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)} title={`Select ${opt}`} className="py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-2xl shadow-lg transform hover:-translate-y-1 transition-all active:scale-95">{opt}</button>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- GUESS GAME COMPONENT (Multiple Choice) ---
const GuessGame: React.FC<{onBack: () => void}> = ({onBack}) => {
    const allPuzzles = [
        { emoji: "🦁👑", answer: "LION KING" },
        { emoji: "🕷️👨", answer: "SPIDER MAN" },
        { emoji: "❄️👸", answer: "FROZEN" },
        { emoji: "🦇👨", answer: "BATMAN" },
        { emoji: "🐼🥋", answer: "KUNG FU PANDA" },
        { emoji: "🐠🔍", answer: "FINDING NEMO" },
        { emoji: "🚗🏁", answer: "CARS" },
        { emoji: "🧸🤠", answer: "TOY STORY" },
        { emoji: "🐀👨‍🍳", answer: "RATATOUILLE" },
        { emoji: "🧞‍♂️✨", answer: "ALADDIN" },
        { emoji: "👻🚫", answer: "GHOSTBUSTERS" },
        { emoji: "🦕🦖park", answer: "JURASSIC PARK" },
        { emoji: "⚡👓", answer: "HARRY POTTER" },
        { emoji: "🍫🏭", answer: "CHARLIE CHOCOLATE" },
        { emoji: "👹👸", answer: "BEAUTY AND BEAST" }
    ];

    const stats = StorageService.getGameStats();
    const [currentIndex, setCurrentIndex] = useState((stats.emojiProgress || 0) % allPuzzles.length);
    const [options, setOptions] = useState<string[]>([]);
    
    useEffect(() => {
       AudioService.speak("Guess the movie from the emojis!");
       generateOptions();
    }, [currentIndex]);

    const currentPuzzle = allPuzzles[currentIndex];

    const generateOptions = () => {
        const correct = currentPuzzle.answer;
        const others = allPuzzles.filter(p => p.answer !== correct).map(p => p.answer);
        const shuffled = others.sort(() => 0.5 - Math.random()).slice(0, 3);
        const combined = [...shuffled, correct].sort(() => 0.5 - Math.random());
        setOptions(combined);
    };

    const handleAnswer = (val: string) => {
        if (val === currentPuzzle.answer) {
            AudioService.playEffect('correct');
            AudioService.speak("Correct! You are amazing.");
            
            const newIndex = (currentIndex + 1) % allPuzzles.length;
            const newProgress = (stats.emojiProgress || 0) + 1;
            
            if (newProgress > 0 && newProgress % 10 === 0) {
                AudioService.speak("Level Up! You are an Emoji Master!");
                alert("LEVEL UP!");
            }

            const newStats = { ...stats, emojiProgress: newProgress, xp: stats.xp + 50 };
            StorageService.saveGameStats(newStats);
            setCurrentIndex(newIndex);
        } else {
            AudioService.playEffect('wrong');
            AudioService.speak("Not quite. Try again!");
        }
    }

    return (
        <div className="max-w-md mx-auto text-center">
             <button onClick={onBack} title="Quit Emoji Game" className="mb-4 flex items-center gap-2 bg-red-500/10 text-red-300 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all font-bold">
               <XCircle size={20}/> Quit Game
             </button>

             <div className="bg-slate-800 p-8 rounded-3xl border-4 border-pink-500">
                <div className="flex justify-between text-xs font-bold text-pink-300 mb-6">
                    <span>Puzzle #{currentIndex + 1}</span>
                    <span>Total Solved: {stats.emojiProgress || 0}</span>
                </div>
                
                <div className="text-6xl mb-8 animate-pulse bg-slate-900 p-6 rounded-2xl">{currentPuzzle.emoji}</div>
                
                <div className="grid grid-cols-1 gap-3">
                    {options.map((opt, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleAnswer(opt)}
                            title={`Select ${opt}`}
                            className="bg-slate-700 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-colors uppercase tracking-widest shadow-lg"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                <p className="mt-4 text-xs text-slate-500">Hint: It's a famous movie!</p>
             </div>
        </div>
    )
}

// --- WORD SEARCH COMPONENT (Progressive) ---
const WordSearch: React.FC<{onBack: () => void}> = ({onBack}) => {
    const [level, setLevel] = useState(1);
    const [found, setFound] = useState<string[]>([]);
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const [gridData, setGridData] = useState<{grid: string[][], words: string[]} | null>(null);

    // Dictionary for levels
    const LEVEL_WORDS = [
        ["CAT", "DOG", "PIG", "COW"],
        ["RED", "BLUE", "PINK", "GOLD"],
        ["CAR", "BUS", "BIKE", "SHIP"],
        ["LION", "TIGER", "BEAR", "WOLF"]
    ];

    useEffect(() => {
        startLevel(1);
        AudioService.speak("Find the hidden words. Tap the letters!");
    }, []);

    const startLevel = (lvl: number) => {
        setLevel(lvl);
        setFound([]);
        setSelectedCells(new Set());
        const wordList = LEVEL_WORDS[(lvl - 1) % LEVEL_WORDS.length];
        setGridData(generateGrid(wordList));
    };

    const generateGrid = (words: string[]) => {
        // Simple 7x7 grid generation
        const size = 7;
        const grid = Array(size).fill(null).map(() => Array(size).fill(''));
        const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        // Place words (Simplified horizontal/vertical placement)
        for(let word of words) {
            let placed = false;
            let attempts = 0;
            while(!placed && attempts < 50) {
                const dir = Math.random() > 0.5 ? 'H' : 'V';
                const row = Math.floor(Math.random() * size);
                const col = Math.floor(Math.random() * size);
                
                // Check bounds
                if (dir === 'H' && col + word.length > size) { attempts++; continue; }
                if (dir === 'V' && row + word.length > size) { attempts++; continue; }

                // Check collision
                let fits = true;
                for(let i=0; i<word.length; i++) {
                   const r = dir === 'V' ? row + i : row;
                   const c = dir === 'H' ? col + i : col;
                   if (grid[r][c] !== '' && grid[r][c] !== word[i]) fits = false;
                }

                if (fits) {
                    for(let i=0; i<word.length; i++) {
                        const r = dir === 'V' ? row + i : row;
                        const c = dir === 'H' ? col + i : col;
                        grid[r][c] = word[i];
                    }
                    placed = true;
                }
                attempts++;
            }
        }

        // Fill empty
        for(let r=0; r<size; r++) {
            for(let c=0; c<size; c++) {
                if(grid[r][c] === '') grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
            }
        }
        return { grid, words };
    };

    const handleCellClick = (r: number, c: number) => {
       if (!gridData) return;
       const key = `${r}-${c}`;
       const newSet = new Set<string>(selectedCells);
       if (newSet.has(key)) newSet.delete(key);
       else {
           newSet.add(key);
           AudioService.playEffect('click');
       }
       
       setSelectedCells(newSet);

       const selectionArr = Array.from(newSet).map(k => {
           const [row, col] = k.split('-').map(Number);
           return {r: row, c: col, char: gridData.grid[row][col]};
       }).sort((a,b) => (a.r - b.r) || (a.c - b.c));

       const text = selectionArr.map(x => x.char).join('');
       
       if (gridData.words.includes(text)) {
           if (!found.includes(text)) {
               AudioService.playEffect('correct');
               AudioService.speak(`You found ${text}!`);
               const newFound = [...found, text];
               setFound(newFound);
               setSelectedCells(new Set());
               
               // Level Complete check
               if (newFound.length === gridData.words.length) {
                   setTimeout(() => {
                       alert("LEVEL COMPLETE!");
                       const stats = StorageService.getGameStats();
                       stats.xp += 50;
                       StorageService.saveGameStats(stats);
                       startLevel(level + 1);
                   }, 1000);
               }
           }
       }
    };

    if (!gridData) return <div>Loading...</div>;

    return (
        <div className="max-w-md mx-auto">
             <button onClick={onBack} title="Quit Word Search" className="mb-4 flex items-center gap-2 bg-red-500/10 text-red-300 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all font-bold">
               <XCircle size={20}/> Quit Game
             </button>

             <div className="bg-slate-800 p-6 rounded-3xl border-4 border-emerald-500 text-center">
                 <h3 className="text-xl text-emerald-300 font-bold mb-4">Word Search Lv {level}</h3>
                 
                 <div className="bg-slate-900 p-4 rounded-xl inline-block mb-6 shadow-inner">
                     <div className="grid grid-cols-7 gap-1">
                     {gridData.grid.map((row, r) => row.map((char, c) => {
                         const isSelected = selectedCells.has(`${r}-${c}`);
                         return (
                             <div 
                               key={`${r}-${c}`} 
                               onClick={() => handleCellClick(r, c)}
                               title={`Select ${char}`}
                               className={`w-10 h-10 flex items-center justify-center rounded font-black cursor-pointer transition-all select-none
                                  ${isSelected ? 'bg-emerald-500 text-white scale-110 shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                               `}
                             >
                               {char}
                             </div>
                         )
                     }))}
                     </div>
                 </div>

                 <div className="flex flex-wrap gap-2 justify-center">
                     {gridData.words.map(w => (
                         <span key={w} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${found.includes(w) ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-700 text-slate-500'}`}>
                             {w} {found.includes(w) && '✓'}
                         </span>
                     ))}
                 </div>
             </div>
        </div>
    )
}

// --- MAIN GAMES PAGE ---
const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'MATH' | 'GUESS' | 'WORD' | null>(null);

  if (activeGame === 'MATH') return <MathBattle onBack={() => setActiveGame(null)} />;
  if (activeGame === 'GUESS') return <GuessGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'WORD') return <WordSearch onBack={() => setActiveGame(null)} />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="font-display text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
          Arcade Zone
        </h2>
        <p className="text-slate-400 text-lg">Earn badges and level up!</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
          <div onClick={() => setActiveGame('MATH')} title="Play Math Battle" className="cursor-pointer group relative bg-slate-800 rounded-3xl p-1 overflow-hidden hover:scale-105 transition-transform duration-300 shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="relative p-6 text-center flex flex-col items-center h-full">
                 <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-4xl mb-4 border-2 border-indigo-500">🧮</div>
                 <h3 className="text-2xl font-bold text-white">Math Battle</h3>
                 <p className="text-slate-400 text-sm mt-2">Level up your Brain!</p>
             </div>
          </div>

          <div onClick={() => setActiveGame('GUESS')} title="Play Emoji Riddle" className="cursor-pointer group relative bg-slate-800 rounded-3xl p-1 overflow-hidden hover:scale-105 transition-transform duration-300 shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="relative p-6 text-center flex flex-col items-center h-full">
                 <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-4xl mb-4 border-2 border-pink-500">❓</div>
                 <h3 className="text-2xl font-bold text-white">Emoji Riddle</h3>
                 <p className="text-slate-400 text-sm mt-2">Guess the movie</p>
             </div>
          </div>

          <div onClick={() => setActiveGame('WORD')} title="Play Word Search" className="cursor-pointer group relative bg-slate-800 rounded-3xl p-1 overflow-hidden hover:scale-105 transition-transform duration-300 shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="relative p-6 text-center flex flex-col items-center h-full">
                 <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-4xl mb-4 border-2 border-emerald-500">🔍</div>
                 <h3 className="text-2xl font-bold text-white">Word Search</h3>
                 <p className="text-slate-400 text-sm mt-2">Find hidden treasures</p>
             </div>
          </div>
      </div>
    </div>
  );
};

export default GamesPage;