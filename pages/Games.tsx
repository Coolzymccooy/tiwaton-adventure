
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, Zap, Star, Trophy, Rocket, 
  Coins, Lock, CheckCircle2,
  Clock, Landmark, BarChart3, PlusCircle,
  Hash, Utensils, Gamepad2, Sparkles, Flame,
  Brain, Languages, Search, GraduationCap,
  Globe, Trees, Waves, Ghost, Gift, Award,
  Keyboard, Type, Grid, Wand2, MousePointer2
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { AudioService } from '../services/audio';
import { MathPlanet, GameStat } from '../types';

// --- SHARED COMPONENTS ---

const VictoryOverlay: React.FC<{ 
  title: string; 
  xp: number; 
  coins: number;
  badge?: string;
  onNext: () => void; 
  onQuit: () => void 
}> = ({ title, xp, coins, badge, onNext, onQuit }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/98 backdrop-blur-3xl animate-fade-in p-4">
    <div className="text-center max-w-sm w-full animate-float flex flex-col items-center">
      <div className="relative mb-4 sm:mb-6">
        <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-40 animate-pulse"></div>
        <div className="text-7xl sm:text-8xl relative drop-shadow-2xl">🌟</div>
      </div>
      <h2 className="font-display text-4xl sm:text-5xl text-indigo-400 mb-1 italic tracking-tighter drop-shadow-md">{title}</h2>
      <p className="text-white text-base font-black mb-6 uppercase tracking-[0.3em]">Mission AccomplISHED!</p>
      
      {badge && (
          <div className="mb-6 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
              <Award size={14} className="text-yellow-400"/> Badge Unlocked: {badge}
          </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full mb-8">
        <div className="bg-indigo-600/20 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 text-white font-black text-xl">
            <Zap className="text-yellow-300" size={20} /> +{xp}
          </div>
          <div className="text-[8px] text-indigo-400 font-black uppercase tracking-widest mt-1">XP Points</div>
        </div>
        <div className="bg-amber-600/20 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 text-white font-black text-xl">
            <Coins className="text-yellow-400" size={20} /> +{coins}
          </div>
          <div className="text-[8px] text-amber-400 font-black uppercase tracking-widest mt-1">Star Coins</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button 
          onClick={onNext} 
          className="w-full py-5 bg-white text-slate-950 font-black text-xl rounded-2xl shadow-[0_6px_0_rgb(203,213,225)] active:translate-y-1 active:shadow-none transition-all uppercase italic tracking-tighter"
        >
          Next Mission
        </button>
        <button 
          onClick={onQuit} 
          className="w-full py-3 text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] hover:text-white transition-colors"
        >
          Return to Hub
        </button>
      </div>
    </div>
  </div>
);

// --- CROSSWORD PRO ENGINE ---

const CROSSWORD_PRO_BANK = {
  Bible: [
    { answer: "NOAH", clue: "The man who built the giant ark" },
    { answer: "DAVID", clue: "The shepherd boy who defeated a giant" },
    { answer: "JESUS", clue: "The Son of God and Light of the World" },
    { answer: "MOSES", clue: "He led the people across the Red Sea" },
    { answer: "BIBLE", clue: "The most important book ever written" },
    { answer: "ARK", clue: "The big boat full of animals" },
    { answer: "EVE", clue: "The very first woman in the garden" },
    { answer: "ADAM", clue: "The first man created by God" },
    { answer: "PAUL", clue: "A brave traveler who wrote many letters" },
    { answer: "MARY", clue: "The mother of Baby Jesus" },
    { answer: "GOLDE", clue: "The streets in the Heavenly city" },
    { answer: "GRACE", clue: "The free gift of God's love" }
  ],
  Nature: [
    { answer: "TREE", clue: "A tall plant with leaves and wood" },
    { answer: "RIVER", clue: "A long path of flowing water" },
    { answer: "SUN", clue: "The big yellow light in the daytime" },
    { answer: "CLOUD", clue: "A fluffy white thing in the blue sky" },
    { answer: "MOUNTAIN", clue: "A very high rock that touches the sky" },
    { answer: "LEAF", clue: "The green part that grows on branches" },
    { answer: "BUSH", clue: "A short, thick plant with many leaves" },
    { answer: "OCEAN", clue: "A massive area of salty blue water" },
    { answer: "STORM", clue: "Rain, thunder, and lightning combined" },
    { answer: "RAIN", clue: "Water droplets falling from the sky" },
    { answer: "LAKE", clue: "A large area of water surrounded by land" },
    { answer: "STAR", clue: "A twinkling light in the night sky" }
  ],
  Animals: [
    { answer: "LION", clue: "The king of the jungle with a roar" },
    { answer: "TIGER", clue: "A big orange cat with black stripes" },
    { answer: "BEAR", clue: "A large furry animal that sleeps in winter" },
    { answer: "SHARK", clue: "The toothy predator of the deep sea" },
    { answer: "EAGLE", clue: "A powerful bird with very sharp eyes" },
    { answer: "WOLF", clue: "A wild dog that howls at the moon" },
    { answer: "ZEBRA", clue: "A wild horse with black and white stripes" },
    { answer: "SNAKE", clue: "A long reptile that slithers on the ground" },
    { answer: "WHALE", clue: "The biggest animal in the whole ocean" },
    { answer: "FROG", clue: "A green jumper that lives near ponds" },
    { answer: "OWL", clue: "A wise bird that stays awake at night" },
    { answer: "HORSE", clue: "An animal people can ride on" }
  ],
  Tech: [
    { answer: "ROBOT", clue: "A mechanical person made of metal" },
    { answer: "CODE", clue: "Language used to talk to computers" },
    { answer: "APP", clue: "A program you use on your phone" },
    { answer: "WEB", clue: "The network where websites live" },
    { answer: "SCREEN", clue: "The part of the tablet you look at" },
    { answer: "MOUSE", clue: "A tool used to point on a computer" },
    { answer: "GAME", clue: "Something fun you play on a console" },
    { answer: "CHIP", clue: "The tiny brain inside a computer" },
    { answer: "DATA", clue: "Information saved on a digital disk" },
    { answer: "WIRE", clue: "It carries electricity to your devices" },
    { answer: "PHONE", clue: "A device used to call people" },
    { answer: "EMAIL", clue: "A digital letter sent online" }
  ]
};

const generateProCrossword = (selectedWords: any[], pool: any[], gridSize: number) => {
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  const placed: any[] = [];
  const words = [...selectedWords].sort((a,b) => b.answer.length - a.answer.length);

  const canPlace = (word: string, row: number, col: number, dir: 'H' | 'V') => {
    if (dir === 'H' && col + word.length > gridSize) return false;
    if (dir === 'V' && row + word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
      const r = dir === 'V' ? row + i : row;
      const c = dir === 'H' ? col + i : col;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
    }
    return true;
  };

  const getOptions = (correct: string) => {
    const others = pool.filter(p => p.answer !== correct).sort(() => Math.random() - 0.5).slice(0, 3).map(p => p.answer);
    return [correct, ...others].sort(() => Math.random() - 0.5);
  };

  // Place first word
  const first = words[0];
  const startR = Math.floor(gridSize / 2);
  const startC = Math.max(0, Math.floor((gridSize - first.answer.length) / 2));
  for(let i=0; i<first.answer.length; i++) {
    grid[startR][startC + i] = first.answer[i];
  }
  placed.push({ ...first, r: startR, c: startC, dir: 'H', options: getOptions(first.answer) });

  // Intersect others
  for (let w = 1; w < words.length; w++) {
    const word = words[w];
    let found = false;
    for (let p = 0; p < placed.length; p++) {
      const pWord = placed[p];
      for (let i = 0; i < word.answer.length; i++) {
        for (let j = 0; j < pWord.answer.length; j++) {
          if (word.answer[i] === pWord.answer[j]) {
            const newDir = pWord.dir === 'H' ? 'V' : 'H';
            const newR = newDir === 'V' ? pWord.r - i : pWord.r + j;
            const newC = newDir === 'H' ? pWord.c - i : pWord.c + j;
            if (newR >= 0 && newC >= 0 && canPlace(word.answer, newR, newC, newDir)) {
              for (let k = 0; k < word.answer.length; k++) {
                grid[newDir === 'V' ? newR + k : newR][newDir === 'H' ? newC + k : newC] = word.answer[k];
              }
              placed.push({ ...word, r: newR, c: newC, dir: newDir, options: getOptions(word.answer) });
              found = true; break;
            }
          }
        }
        if (found) break;
      }
      if (found) break;
    }
  }
  return { grid, placed };
};

const CrosswordPro: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [stats, setStats] = useState<GameStat>(StorageService.getGameStats());
  const [viewState, setViewState] = useState<'LOADING' | 'PLAYING' | 'VICTORY'>('LOADING');
  const level = stats.wordQuestProgress?.level || 1;
  const [grid, setGrid] = useState<string[][]>([]);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [clues, setClues] = useState<any[]>([]);
  const [activeClueId, setActiveClueId] = useState<string | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  useEffect(() => { generateLevel(); }, [level]);

  const generateLevel = () => {
    setViewState('LOADING');
    const themes = Object.keys(CROSSWORD_PRO_BANK);
    const theme = themes[(level - 1) % themes.length];
    const pool = (CROSSWORD_PRO_BANK as any)[theme];
    
    let candidates = pool.filter((w: any) => !usedWords.has(w.answer));
    if (candidates.length < 4) { setUsedWords(new Set()); candidates = pool; }

    const gridSize = Math.min(8 + Math.floor(level / 5), 12);
    const wordCount = Math.min(3 + Math.floor(level / 3), 6);
    const selected = candidates.sort(() => Math.random() - 0.5).slice(0, wordCount);
    
    const { grid: g, placed } = generateProCrossword(selected, pool, gridSize);
    setGrid(g);
    setUserGrid(Array(g.length).fill(null).map(() => Array(g.length).fill('')));
    setClues(placed);
    
    const nextUsed = new Set(usedWords);
    selected.forEach((w: any) => nextUsed.add(w.answer));
    setUsedWords(nextUsed);

    setViewState('PLAYING');
    setActiveClueId(placed[0].answer);
    window.speechSynthesis?.cancel();
    AudioService.speak(`Crossword Pro Level ${level}. The theme is ${theme}. Select a cell and pick the right word from the options.`, 'sarcastic', 'low');
  };

  const activeClue = clues.find(c => c.answer === activeClueId);
  
  // ✅ Crossword progress (replaces foundWords/targetWords in CrosswordPro)
const totalClues = clues.length;

const solvedClues = clues.filter((clue) => {
  const word = String(clue.answer ?? "");
  if (!word) return false;

  for (let i = 0; i < word.length; i++) {
    const rr = clue.dir === "V" ? clue.r + i : clue.r;
    const cc = clue.dir === "H" ? clue.c + i : clue.c;

    const typed = (userGrid?.[rr]?.[cc] ?? "").toUpperCase();
    if (typed !== word[i].toUpperCase()) return false;
  }
  return true;
}).length;


  const handleCellClick = (r: number, c: number) => {
    if (grid[r][c] === '') return;
    const clue = clues.find(clue => {
      const isH = clue.dir === 'H' && r === clue.r && c >= clue.c && c < clue.c + clue.answer.length;
      const isV = clue.dir === 'V' && c === clue.c && r >= clue.r && r < clue.r + clue.answer.length;
      return isH || isV;
    });
    if (clue) {
      setActiveClueId(clue.answer);
      window.speechSynthesis?.cancel();
      AudioService.speak(clue.clue, 'neutral', 'low');
    }
  };

  const handleOptionSelect = (word: string) => {
    if (!activeClue) return;
    
    // Check if word is correct
    if (word !== activeClue.answer) {
        AudioService.playEffect('wrong');
        AudioService.speak(AudioService.SARCASM.wrong[Math.floor(Math.random()*AudioService.SARCASM.wrong.length)], 'sarcastic', 'low');
        return;
    }

    // Fill Grid
    AudioService.playEffect('correct');
    const newGrid = [...userGrid];
    for (let i = 0; i < word.length; i++) {
        const r = activeClue.dir === 'V' ? activeClue.r + i : activeClue.r;
        const c = activeClue.dir === 'H' ? activeClue.c + i : activeClue.c;
        newGrid[r][c] = word[i];
    }
    setUserGrid(newGrid);
    window.speechSynthesis?.cancel();
    AudioService.speak(AudioService.SARCASM.correct[Math.floor(Math.random()*AudioService.SARCASM.correct.length)], 'excited', 'low');

    // Check Win
    let isComplete = true;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] !== '' && grid[i][j] !== newGrid[i][j]) isComplete = false;
        }
    }
    if (isComplete) setTimeout(() => setShowVictory(true), 1200);
  };

  const handleNext = () => {
    const nextLevel = level + 1;
    const newStats = { 
        ...stats, 
        wordQuestProgress: { level: nextLevel, unlocked: true },
        xp: stats.xp + 300,
        coins: stats.coins + 100
    };
    if (nextLevel === 5 && !newStats.badges.includes("Crossword Crusader")) newStats.badges.push("Crossword Crusader");
    StorageService.saveGameStats(newStats);
    setStats(newStats);
    setShowVictory(false);
    window.speechSynthesis?.cancel();
    AudioService.speak(AudioService.SARCASM.completion[Math.floor(Math.random()*AudioService.SARCASM.completion.length)], 'sarcastic', 'high');
  };

 return (
  <Screen maxWidth="max-w-6xl">
    {showVictory && (
      <VictoryOverlay
        title="LEXICON LEGEND"
        xp={300}
        coins={100}
        badge={level >= 4 ? "Crossword Crusader" : undefined}
        onNext={handleNext}
        onQuit={onBack}
      />
    )}

<header className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-[#050810] border-b border-white/10 shadow-2xl">
  <div className="flex justify-between items-center">
    <button
      onClick={onBack}
      className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-white shadow-xl active:scale-90"
    >
      <ArrowLeft />
    </button>

    <div className="text-center">
      <h2 className="font-display text-2xl sm:text-3xl text-white italic tracking-tighter drop-shadow-2xl leading-none">
        Word Search Pro
      </h2>
      <div className="mt-2 flex items-center justify-center gap-2">
        <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">
          Mission {level}
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
         {solvedClues}/{totalClues} Solved
         
        </div>
      </div>
    </div>

    <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-yellow-400 font-black flex items-center gap-1.5 shadow-xl text-sm min-w-[60px] justify-center">
      <Star size={18} className="fill-yellow-400" /> {stats.xp}
    </div>
  </div>
</header>


    <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 gap-6 sm:gap-10 min-h-0 pb-20">
      {/* Active Clue Panel */}
      <div className="w-full lg:w-72 flex flex-col gap-4 bg-slate-900/40 p-5 rounded-3xl border border-white/5 shadow-2xl shrink-0">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Current Clue
          </p>
          <h4 className="text-xl font-black text-white italic leading-tight tracking-tight">
            {activeClue?.clue || "Select a cell..."}
          </h4>
        </div>

        <div className="h-px bg-white/5 w-full"></div>

        <div className="space-y-3">
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2 animate-pulse">
            <MousePointer2 size={12} /> Pick the Correct Word
          </p>

          <div className="grid grid-cols-1 gap-2">
            {activeClue?.options.map((opt: string) => (
              <button
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all border-b-4 active:translate-y-1 active:border-b-0 ${
                  userGrid[activeClue.r][activeClue.c] === opt[0] &&
                  opt === activeClue.answer
                    ? "bg-emerald-500 border-emerald-700 text-white pointer-events-none opacity-50"
                    : "bg-slate-800 border-slate-950 text-slate-200 hover:bg-indigo-600 hover:border-indigo-800"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Area */}
      <div className="relative w-full max-w-[min(85vw,500px)] aspect-square bg-slate-900/60 backdrop-blur-3xl border-2 border-white/5 p-2 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div
          className="grid h-full gap-1"
          style={{ gridTemplateColumns: `repeat(${grid.length}, 1fr)` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isSelected =
                activeClue &&
                ((activeClue.dir === "H" &&
                  r === activeClue.r &&
                  c >= activeClue.c &&
                  c < activeClue.c + activeClue.answer.length) ||
                  (activeClue.dir === "V" &&
                    c === activeClue.c &&
                    r >= activeClue.r &&
                    r < activeClue.r + activeClue.answer.length));

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`relative flex items-center justify-center rounded-lg text-xs sm:text-lg font-black transition-all border-b-4 ${
                    cell === ""
                      ? "bg-transparent border-transparent"
                      : isSelected
                      ? "bg-emerald-500 border-emerald-700 text-white scale-105 z-10"
                      : "bg-slate-800 border-slate-950 text-white hover:bg-slate-700"
                  }`}
                >
                  {userGrid[r][c]}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  </Screen>
);

};

// --- WORD SEARCH ENGINE ---

// ------------------------------
// Shared layout helpers (keeps every game "compact / true-to-view")
// ------------------------------
type ScreenProps = {
  children: React.ReactNode;
  /** Tailwind max width class e.g. "max-w-md", "max-w-5xl", "max-w-6xl" */
  maxWidth?: string;
  /** When true, center content (useful for smaller panels like Emoji Riddle) */
  center?: boolean;
  /** Extra classes applied to the inner container */
  className?: string;
};

function Screen({ children, maxWidth = "max-w-6xl", center = false, className = "" }: ScreenProps) {
  return (
    <div className="h-full w-full bg-[#050810] animate-fade-in relative overflow-hidden">
      <div
        className={[
          "h-full w-full mx-auto px-4 sm:px-6 pt-6 pb-28",
          maxWidth,
          center ? "flex items-center justify-center" : "flex flex-col",
          className,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

const WORD_SEARCH_BANK = {
    Nature: ["TREE", "SUN", "CLOUD", "RAIN", "RIVER", "BIRD", "FISH", "FLOWER", "ROCK", "LEAF", "FOREST", "STORM"],
    Space: ["MARS", "SUN", "STAR", "MOON", "ROCKET", "COMET", "GALAXY", "ORBIT", "SPACE", "PLANET", "ALIEN", "SATURN"],
    Animals: ["LION", "TIGER", "BEAR", "WOLF", "DEER", "HORSE", "ZEBRA", "SNAKE", "SHARK", "WHALE", "EAGLE", "FROG"],
    Food: ["PIZZA", "BURGER", "TACO", "APPLE", "CAKE", "SUSHI", "PASTA", "BERRY", "HONEY", "CHIPS", "DONUT", "STEAK"],
    Bible: ["NOAH", "MOSES", "DAVID", "ARK", "JESUS", "BIBLE", "STORY", "GRACE", "LIGHT", "LOVE", "PEACE", "TRUTH"]
};

interface WordGridCell {
    char: string;
    row: number;
    col: number;
    isWord: boolean;
    found: boolean;
}

const generateWordSearch = (size: number, words: string[]) => {
    const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
    const placedWords: { word: string; cells: { r: number; c: number }[] }[] = [];
    words.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            attempts++;
            const direction = Math.floor(Math.random() * 3);
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);
            let canPlace = true;
            const cells: { r: number; c: number }[] = [];
            for (let i = 0; i < word.length; i++) {
                const r = direction === 1 ? row + i : direction === 2 ? row + i : row;
                const c = direction === 0 ? col + i : direction === 2 ? col + i : col;
                if (r >= size || c >= size || (grid[r][c] !== '' && grid[r][c] !== word[i])) {
                    canPlace = false; break;
                }
                cells.push({ r, c });
            }
            if (canPlace) {
                cells.forEach((cell, i) => grid[cell.r][cell.c] = word[i]);
                placedWords.push({ word, cells });
                placed = true;
            }
        }
    });
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === '') grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
    }
    return { grid, placedWords };
};

const WordSearchGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [stats, setStats] = useState<GameStat>(StorageService.getGameStats());
    const level = stats.wordQuestProgress?.level || 1;
    const [viewState, setViewState] = useState<'LOADING' | 'PLAYING' | 'VICTORY'>('LOADING');
    const [gridSize, setGridSize] = useState(6);
    const [grid, setGrid] = useState<WordGridCell[][]>([]);
    const [targetWords, setTargetWords] = useState<string[]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [selection, setSelection] = useState<{ r: number; c: number }[]>([]);
    const [showVictory, setShowVictory] = useState(false);
    const foundCount = foundWords.length;
    const targetCount = targetWords.length;


    useEffect(() => { startNewLevel(); }, [level]);

    const startNewLevel = () => {
        setViewState('LOADING');
        const themes = Object.keys(WORD_SEARCH_BANK);
        const theme = themes[(level - 1) % themes.length];
        const wordPool = (WORD_SEARCH_BANK as any)[theme];
        const count = Math.min(3 + Math.floor(level / 3), 8);
        const size = Math.min(6 + Math.floor(level / 2), 12);
        setGridSize(size);
        const selected = [...wordPool].sort(() => Math.random() - 0.5).slice(0, count);
        const { grid: rawGrid, placedWords } = generateWordSearch(size, selected);
        const processedGrid: WordGridCell[][] = rawGrid.map((row, r) => row.map((char, c) => ({
            char, row: r, col: c, found: false,
            isWord: placedWords.some(pw => pw.cells.some(cell => cell.r === r && cell.c === c))
        })));
        setTargetWords(selected);
        setGrid(processedGrid);
        setFoundWords([]);
        setSelection([]);
        setViewState('PLAYING');
        window.speechSynthesis?.cancel();
        AudioService.speak(`Word Search Level ${level}. Focus on ${theme}. Find all hidden treasures!`, 'sarcastic', 'low');
    };

    const handleCellClick = (r: number, c: number) => {
        if (viewState !== 'PLAYING') return;
        const newSelection = [...selection];
        const index = newSelection.findIndex(s => s.r === r && s.c === c);
        if (index > -1) newSelection.splice(index, 1);
        else newSelection.push({ r, c });
        setSelection(newSelection);
        const selectedChars = newSelection.map(s => grid[s.r][s.c].char).join('');
        const reversedChars = selectedChars.split('').reverse().join('');
        const found = targetWords.find(w => (w === selectedChars || w === reversedChars) && !foundWords.includes(w));
        if (found) {
            AudioService.playEffect('correct');
            const newFound = [...foundWords, found];
            setFoundWords(newFound);
            setSelection([]);
            const newGrid = [...grid];
            newSelection.forEach(s => newGrid[s.r][s.c].found = true);
            setGrid(newGrid);
            window.speechSynthesis?.cancel();
            AudioService.speak(AudioService.SARCASM.correct[Math.floor(Math.random() * AudioService.SARCASM.correct.length)], 'excited', 'low');
            if (newFound.length === targetWords.length) setTimeout(() => setShowVictory(true), 1000);
        }
    };

    const handleNextMission = () => {
        const nextLevel = level + 1;
        const newStats = { 
            ...stats, 
            wordQuestProgress: { level: nextLevel, unlocked: true },
            xp: stats.xp + 200,
            coins: stats.coins + 50
        };
        StorageService.saveGameStats(newStats);
        setStats(newStats);
        setShowVictory(false);
        window.speechSynthesis?.cancel();
        AudioService.speak(AudioService.SARCASM.completion[Math.floor(Math.random() * AudioService.SARCASM.completion.length)], 'sarcastic', 'high');
    };

return (  
  <Screen maxWidth="max-w-6xl">
    {showVictory && (
      <VictoryOverlay
        title="LEXICON MASTER"
        xp={200}
        coins={50}
        onNext={handleNextMission}
        onQuit={onBack}
      />
    )}
{/* Sticky header so the title never sits on the grid */}
<header className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-[#050810]/80 backdrop-blur-xl border-b border-white/10">
  <div className="flex justify-between items-center">
    <button
      onClick={onBack}
      className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-white shadow-xl active:scale-90"
    >
      <ArrowLeft />
    </button>

    <div className="text-center">
      <h2 className="font-display text-2xl sm:text-3xl text-white italic tracking-tighter drop-shadow-2xl leading-none">
        Word Search Pro
      </h2>
      <div className="mt-2 flex items-center justify-center gap-2">
        <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">
          Mission {level}
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
          {foundWords.length}/{targetWords.length} Words
        </div>
      </div>
    </div>

    <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-yellow-400 font-black flex items-center gap-1.5 shadow-xl text-xs sm:text-sm">
      <Star size={16} className="fill-yellow-400" /> {stats.xp}
    </div>
  </div>
</header>


{/* ✅ PLAY AREA (real content) */}
<div className="flex-1 min-h-0 flex flex-col lg:flex-row items-center justify-center p-4 pt-6 gap-6 sm:gap-10 pb-20">
  {viewState === "LOADING" ? (
    <div className="text-white/70 font-black text-sm">Loading Word Search…</div>
  ) : (
    <>
      {/* LEFT: Words list */}
      <div className="w-full lg:w-56 bg-slate-900/50 backdrop-blur-md rounded-[1.5rem] lg:rounded-[2rem] border border-white/5 p-3 sm:p-4 flex flex-wrap lg:flex-col gap-1.5 justify-center shrink-0">
        {targetWords.map((word) => {
          const done = foundWords.includes(word);
          return (
            <div
              key={word}
              className={`relative px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black tracking-tighter transition-all flex items-center justify-between ${
                done
                  ? "bg-emerald-500/20 text-emerald-400 opacity-60"
                  : "bg-slate-800 text-white border border-white/5"
              }`}
            >
              {word}
              {done && <CheckCircle2 size={12} className="text-emerald-400 ml-2" />}
            </div>
          );
        })}
      </div>

      {/* CENTER: Grid */}
      <div className="relative w-full max-w-[min(90vw,520px)] aspect-square bg-slate-900/60 backdrop-blur-3xl border-2 border-white/5 p-2 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div
          className="grid h-full gap-1"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selection.some((s) => s.r === r && s.c === c);

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`relative flex items-center justify-center rounded-lg font-black transition-all border-b-4 active:translate-y-1 active:border-b-0 ${
                    cell.found
                      ? "bg-emerald-500 border-emerald-700 text-white"
                      : isSelected
                      ? "bg-indigo-600 border-indigo-800 text-white"
                      : "bg-slate-800 border-slate-950 text-white hover:bg-slate-700"
                  }`}
                >
                  <span className="text-xs sm:text-lg">{cell.char}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: Small status/help panel (optional but useful) */}
      <div className="w-full lg:w-56 bg-slate-900/40 p-4 rounded-3xl border border-white/5 shadow-2xl shrink-0">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
          Progress
        </p>
        <div className="text-white font-black text-lg">
          {foundWords.length}/{targetWords.length}
        </div>
        <p className="text-slate-400 text-[10px] font-bold mt-3">
          Tap letters to select. Find the hidden words.
        </p>
      </div>
    </>
  )}
</div>

  </Screen>
);

};

// --- MATH GALAXY ENGINE ---

const MathGalaxy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const speakTokenRef = useRef(0);
  const profile = StorageService.getCurrentProfile();
  const [stats, setStats] = useState<GameStat>(StorageService.getGameStats());
  const [view, setView] = useState<'MAP' | 'PLAYING'>('MAP');
  const [selectedPlanet, setSelectedPlanet] = useState<MathPlanet | null>(null);
  const [question, setQuestion] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [missionTarget] = useState(5);
  const [showVictory, setShowVictory] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'CORRECT' | 'WRONG', msg: string } | null>(null);
  const age = profile?.age || 6;

  const PLANET_DATA = [
    { id: 'Numbers' as MathPlanet, label: 'Number Nebula', icon: Hash, color: 'from-blue-600 to-indigo-900', desc: 'Values & Counting' },
    { id: 'Operations' as MathPlanet, label: 'Ops Orbit', icon: PlusCircle, color: 'from-red-600 to-rose-900', desc: 'Arithmetic Battle' },
    { id: 'Fractions' as MathPlanet, label: 'Fraction Field', icon: Utensils, color: 'from-emerald-600 to-teal-900', desc: 'Bakery Fractions' },
    { id: 'Time' as MathPlanet, label: 'Clockwork Comet', icon: Clock, color: 'from-amber-600 to-orange-900', desc: 'Time Mastery' },
    { id: 'Money' as MathPlanet, label: 'Cash Star', icon: Landmark, color: 'from-yellow-600 to-amber-900', desc: 'Shopping Math' },
    { id: 'Data' as MathPlanet, label: 'Data Depot', icon: BarChart3, color: 'from-purple-600 to-violet-900', desc: 'Graph Safari' }
  ];

  const generateMissionQuestion = (planet: MathPlanet, currentLevel: number) => {
    let q = { text: '', ans: 0, speak: '', visual: null as any };
    let opts: any[] = [];
    const levelJump = (currentLevel - 1) * 15;
    const range = (age <= 5 ? 10 : 20) + levelJump;
    if (planet === 'Numbers') {
      const n = Math.floor(Math.random() * range) + (currentLevel * 5);
      q = { text: `${n}`, ans: n, speak: `Find the number ${n}`, visual: null };
      opts = [n, n + 1, n - 1, n + 10].filter(x => x >= 0);
    } else if (planet === 'Operations') {
      let a = Math.floor(Math.random() * range), b = Math.floor(Math.random() * range);
      const isAdd = Math.random() > 0.5;
      if (!isAdd && b > a) [a, b] = [b, a]; 
      const res = isAdd ? a + b : a - b;
      q = { text: `${a} ${isAdd ? '+' : '-'} ${b}`, ans: res, speak: `${a} ${isAdd ? 'plus' : 'minus'} ${b}. What is the answer?`, visual: null };
      opts = [res, res + (Math.random() > 0.5 ? 1 : 10), res - (Math.random() > 0.5 ? 1 : 5), res + 2].sort(() => Math.random() - 0.5);
    } else {
      q = { text: `${currentLevel} + ${currentLevel}`, ans: currentLevel * 2, speak: `What is ${currentLevel} plus ${currentLevel}?`, visual: null };
      opts = [currentLevel * 2, currentLevel + 1, currentLevel - 1, currentLevel + 5];
    }
    setQuestion(q);
    setOptions([...new Set(opts)].sort(() => Math.random() - 0.5));
    const token = ++speakTokenRef.current;
setTimeout(() => {
  if (token !== speakTokenRef.current) return;
  window.speechSynthesis?.cancel();
  AudioService.speak(q.speak, "sarcastic", "low");
}, 250);

  };

  const startPlanet = (p: MathPlanet) => {
    setSelectedPlanet(p); setScore(0); setView('PLAYING'); setShowVictory(false); setFeedback(null);
    generateMissionQuestion(p, stats.mathLevel || 1);
  };

 const handleAnswer = (val: number) => {
  if (!question) return;
  if (!selectedPlanet) return;
  if (feedback || showVictory) return;

  const nextScore = score + 1;

  // stop any queued speech so it doesn't spill over
  window.speechSynthesis?.cancel();

  if (val === question.ans) {
    AudioService.playEffect("correct");
    setFeedback({ type: "CORRECT", msg: "SENSATIONAL!" });
    setScore(nextScore);

    // cancel again (some browsers queue fast)
    window.speechSynthesis?.cancel();
    AudioService.speak(
      AudioService.SARCASM.correct[
        Math.floor(Math.random() * AudioService.SARCASM.correct.length)
      ],
      "excited",
      "low"
    );

    // ✅ mission complete => next stage
  if (nextScore >= missionTarget) {
  setTimeout(() => {
    const MAX_PLANET_LEVEL = 5;

    // reset mission score for next stage
    setScore(0);
    setFeedback(null);

    // ✅ get current planet progress (or create default)
    const current =
      (stats.mathPlanetProgress ?? []).find((p) => p.planet === selectedPlanet) ?? {
        planet: selectedPlanet!,
        unlocked: true,
        stars: 0,
        highScore: 0,
        level: 1,
      };

    const nextPlanetLevel = Math.min((current.level ?? 1) + 1, MAX_PLANET_LEVEL);

    // ✅ update stats for THIS planet
 const nextStats: GameStat = {
  ...stats,
  mathPlanetProgress: [
    ...((stats.mathPlanetProgress ?? []).filter((p) => p.planet !== selectedPlanet)),
    { ...current, planet: selectedPlanet!, level: nextPlanetLevel },
  ],
};


    // ✅ unlock next planet automatically when current hits level 5
    const i = PLANET_DATA.findIndex((x) => x.id === selectedPlanet);
    const nextPlanetId = i >= 0 ? PLANET_DATA[i + 1]?.id : undefined;

    const planetFinished = nextPlanetLevel >= MAX_PLANET_LEVEL;

    if (planetFinished && nextPlanetId) {
      const existingNext = (nextStats.mathPlanetProgress ?? []).find(
        (p) => p.planet === nextPlanetId
      );

      nextStats.mathPlanetProgress = [
        ...(nextStats.mathPlanetProgress ?? []).filter((p) => p.planet !== nextPlanetId),
        {
          planet: nextPlanetId,
          unlocked: true,
          stars: existingNext?.stars ?? 0,
          highScore: existingNext?.highScore ?? 0,
          level: existingNext?.level ?? 1,
        },
      ];
    }

    StorageService.saveGameStats(nextStats);
    setStats(nextStats);

    // ✅ show celebration overlay on every mission completion
    setShowVictory(true);
  }, 900);

  return;
}

    // normal next question (same level)
    setTimeout(() => {
      setFeedback(null);
      generateMissionQuestion(selectedPlanet, stats.mathLevel || 1);
    }, 400);

    return;
  }

  // ❌ wrong answer
  AudioService.playEffect("wrong");
  setFeedback({ type: "WRONG", msg: "SYSTEM ERROR" });

  window.speechSynthesis?.cancel();
  AudioService.speak(
    AudioService.SARCASM.wrong[
      Math.floor(Math.random() * AudioService.SARCASM.wrong.length)
    ],
    "sarcastic",
    "low"
  );

  setTimeout(() => setFeedback(null), 900);
};


// ✅ MAP view (Planet Selection)
  // ---------- RENDER ----------
  if (view === "MAP") {
    return (
      <Screen maxWidth="max-w-6xl">
        <div className="h-full flex flex-col animate-fade-in bg-[#050810] p-3 overflow-hidden">
          <header className="flex justify-between items-center mb-4 shrink-0">
            <button
              onClick={onBack}
              className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-white shadow-xl active:scale-90"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="text-center">
              <h2 className="font-display text-3xl sm:text-4xl text-white italic tracking-tighter leading-none drop-shadow-2xl">
                Math Galaxy
              </h2>
            </div>

            <div className="bg-slate-900 px-3 py-2 rounded-2xl border border-white/10 shadow-xl flex items-center gap-2">
              <Rocket size={18} className="text-indigo-400" />
              <span className="text-sm font-black text-white uppercase tracking-tighter">
                Level {stats.mathPlanetProgress?.find(p => p.planet === selectedPlanet)?.level ?? 1}
              </span>
            </div>
          </header>

          {/* Compact grid: no forced scroll */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto w-full">
            {PLANET_DATA.map((planet) => {
              const isUnlocked =
                stats.mathPlanetProgress?.find((p) => p.planet === planet.id)?.unlocked ?? false;

              return (
                <button
                  key={planet.id}
                  // keep clickable even if locked (as you were doing)
                  disabled={false}
                  onClick={() => startPlanet(planet.id)}
                  className={`group relative p-4 sm:p-5 rounded-[2.25rem] border transition-all flex flex-col items-center text-center overflow-hidden shadow-2xl ${
                    isUnlocked
                      ? "bg-slate-900 border-white/10 hover:border-indigo-500 hover:-translate-y-1"
                      : "bg-slate-950 border-slate-900 opacity-40 grayscale"
                  }`}
                >
                  <div
                    className={`text-4xl sm:text-5xl mb-2 group-hover:scale-110 transition-transform duration-500 ${
                      isUnlocked ? "drop-shadow-[0_0_20px_rgba(99,102,241,0.25)]" : ""
                    }`}
                  >
                    <planet.icon size={36} className={isUnlocked ? "text-indigo-400" : "text-slate-700"} />
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-white uppercase italic tracking-tighter leading-none mb-1">
                    {planet.label}
                  </h3>

                  <p className="text-slate-500 font-bold text-[9px] uppercase tracking-widest">
                    {planet.desc}
                  </p>

                  {!isUnlocked && (
                    <Lock className="absolute top-4 right-4 text-slate-700" size={16} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Screen>
    );
  }

  if (view === "PLAYING") {
  // If something tries to enter PLAYING without a planet/question ready, show a safe screen (not blank)
  if (!selectedPlanet || !question || !options?.length) {
    return (
      <Screen maxWidth="max-w-6xl" center>
        <div className="text-white font-bold text-sm opacity-70">Loading Math Galaxy...</div>
      </Screen>
    );
  }

  const planetMeta = PLANET_DATA.find((p) => p.id === selectedPlanet);

  return (
    <Screen maxWidth="max-w-6xl">
{showVictory && (
  <VictoryOverlay
    title="MISSION COMPLETE"
    xp={200}
    coins={50}
    onNext={() => {
      setShowVictory(false);
      setFeedback(null);

      // get current planet progress
      const current =
        stats.mathPlanetProgress?.find((p) => p.planet === selectedPlanet) ?? {
          planet: selectedPlanet!,
          unlocked: true,
          stars: 0,
          highScore: 0,
          level: 1,
        };

      const planetFinished = (current.level ?? 1) >= 5;

      if (planetFinished) {
        const i = PLANET_DATA.findIndex((x) => x.id === selectedPlanet);
        const nextPlanetId = i >= 0 ? PLANET_DATA[i + 1]?.id : undefined;

        if (nextPlanetId) {
          setSelectedPlanet(nextPlanetId);
          generateMissionQuestion(nextPlanetId, 1);
          return;
        }

        // no next planet -> back to map
        setSelectedPlanet(null);
        setView("MAP");
        return;
      }

      // continue same planet
      generateMissionQuestion(selectedPlanet!, current.level ?? 1);
    }}
    onQuit={() => {
      setShowVictory(false);
      setFeedback(null);
      setSelectedPlanet(null);
      setView("MAP");
    }}
  />
)}


      <div className="h-full flex flex-col animate-fade-in bg-[#050810] p-3 overflow-hidden">
        <header className="flex justify-between items-center mb-4 shrink-0">
          {/* Back to MAP (so you can pick another planet) */}
          <button
            onClick={() => {
              setView("MAP");
              setSelectedPlanet(null);
              setFeedback(null);
              setShowVictory(false);
            }}
            className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-white shadow-xl active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="text-center">
            <h2 className="font-display text-2xl sm:text-3xl text-white italic tracking-tighter leading-none drop-shadow-2xl">
              {planetMeta?.label || "Math Galaxy"}
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
              Score {score}/{missionTarget}
            </p>
          </div>

          <div className="bg-slate-900 px-3 py-2 rounded-2xl border border-white/10 shadow-xl flex items-center gap-2">
            <Rocket size={18} className="text-indigo-400" />
            <span className="text-sm font-black text-white uppercase tracking-tighter">
              Level {stats.mathPlanetProgress?.find(p => p.planet === selectedPlanet)?.level ?? 1}

            </span>
          </div>
        </header>

        {/* Question panel */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pb-10">
          <div className="w-full max-w-2xl bg-slate-900/50 border border-white/10 rounded-[2rem] p-5 sm:p-6 text-center shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
              Solve this
            </p>

            <div className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter drop-shadow-2xl">
              {question.text}
            </div>

            {feedback && (
              <div
                className={`mt-3 text-xs font-black uppercase tracking-[0.3em] ${
                  feedback.type === "CORRECT" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {feedback.msg}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="w-full max-w-2xl grid grid-cols-2 gap-3">
            {options.map((opt: number) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="bg-slate-900/70 border-b-4 border-slate-950 hover:bg-indigo-600 hover:border-indigo-800 transition-all active:translate-y-1 active:border-b-0 rounded-2xl py-4 text-white font-black text-lg"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}

return (
  <Screen maxWidth="max-w-6xl" center>
    <div className="text-white font-bold text-sm opacity-70">Loading Math Galaxy...</div>
  </Screen>
);
};
// --- EMOJI RIDDLE ---
const EmojiRiddle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solved, setSolved] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const puzzles = [{ emoji: "🦁👑", ans: "LION KING" }, { emoji: "🕸️🕷️👨", ans: "SPIDER MAN" }, { emoji: "🐠🔍", ans: "FINDING NEMO" }, { emoji: "❄️👸", ans: "FROZEN" }];
  const handleCorrect = () => {
    AudioService.playEffect('correct');
    const next = solved + 1; setSolved(next); AudioService.speak("Correct! You're a movie buff!", 'excited', 'low');
    if (next >= puzzles.length) setShowVictory(true); else setCurrentIndex(currentIndex + 1);
  };
  return (
    <Screen maxWidth="max-w-md" center>
      {showVictory && <VictoryOverlay title="BRAIN MASTER" xp={50} coins={10} onNext={() => { setSolved(0); setCurrentIndex(0); setShowVictory(false); }} onQuit={onBack} />}
      <button onClick={onBack} className="absolute top-8 left-8 p-4 bg-slate-900 rounded-2xl text-white border border-white/10 shadow-xl active:scale-90"><ArrowLeft/></button>
      <div className="bg-slate-900/50 backdrop-blur-3xl border-2 border-white/5 p-12 rounded-[4rem] text-center shadow-2xl max-w-sm w-full">
        <div className="text-8xl mb-12 drop-shadow-2xl animate-float">{puzzles[currentIndex].emoji}</div>
        <div className="grid gap-4">
           {[puzzles[currentIndex].ans, "TOY STORY", "CARS"].sort().map((opt, i) => (
             <button key={i} onClick={() => opt === puzzles[currentIndex].ans ? handleCorrect() : AudioService.playEffect('wrong')} className="bg-slate-800 p-6 rounded-3xl text-white font-black text-xl uppercase italic border-b-8 border-slate-950 hover:bg-indigo-600 transition-all active:translate-y-1">
               {opt}
             </button>
           ))}
        </div>
      </div>
    </Screen>
  );
};

const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'MATH' | 'GUESS' | 'SEARCH' | 'CROSSWORD' | null>(null);
  if (activeGame === 'MATH') return <MathGalaxy onBack={() => setActiveGame(null)} />;
  if (activeGame === 'GUESS') return <EmojiRiddle onBack={() => setActiveGame(null)} />;
  if (activeGame === 'SEARCH') return <WordSearchGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'CROSSWORD') return <CrosswordPro onBack={() => setActiveGame(null)} />;
  return (
    <div className="h-full flex flex-col px-4 sm:px-6 pt-6 pb-10 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="font-display text-5xl sm:text-6xl text-white italic tracking-tighter drop-shadow-2xl mb-2">Arcade Zone</h2>
        <p className="text-slate-400 text-sm sm:text-base font-medium tracking-tight">Level up and earn Star Treasures!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto w-full">
          <GameCard onClick={() => setActiveGame('MATH')} icon="🌌" title="Math Galaxy" tag="Logic" color="from-indigo-600 to-blue-700" />
          <GameCard onClick={() => setActiveGame('SEARCH')} icon="🧩" title="Word Search" tag="Reading" color="from-emerald-600 to-teal-700" />
          <GameCard onClick={() => setActiveGame('CROSSWORD')} icon="⌨️" title="Crossword Pro" tag="Spelling" color="from-purple-600 to-violet-700" />
          <GameCard onClick={() => setActiveGame('GUESS')} icon="🧠" title="Emoji Riddle" tag="Brain" color="from-pink-600 to-rose-700" />
      </div>
    </div>
  );
};

type GameCardProps = {
  icon: React.ReactNode;
  title: string;
  tag: string;
  color: string;
  onClick: () => void;
};


const GameCard: React.FC<GameCardProps> = ({ icon, title, tag, color, onClick }) => (
  <button
    onClick={onClick}
    className="group relative bg-slate-900/70 backdrop-blur-xl p-6 sm:p-7 rounded-[2.25rem] border border-white/10 hover:border-indigo-500/50 transition-all hover:-translate-y-1 overflow-hidden flex flex-col items-center shadow-2xl"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity`} />

    <div className="relative text-5xl sm:text-6xl mb-5 sm:mb-6 group-hover:scale-105 transition-transform duration-500 group-hover:rotate-3">
      {icon}
    </div>

    <h3 className="relative text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
      {title}
    </h3>

    <p className="relative text-indigo-300 font-black text-[10px] uppercase tracking-widest bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">
      {tag} Challenge
    </p>
  </button>
);

export default GamesPage;


