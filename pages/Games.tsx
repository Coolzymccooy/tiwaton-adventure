
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft, Zap, Star, Trophy, Rocket,
  Coins, Lock, CheckCircle2,
  Clock, Landmark, BarChart3, PlusCircle,
  Hash, Utensils, Gamepad2, Sparkles, Flame,
  Brain, Languages, Search, GraduationCap,
  Globe, Trees, Waves, Ghost, Gift, Award,
  Keyboard, Type, Grid, Wand2, MousePointer2,
  Shapes, Ruler, Infinity, X, Divide, CircleDot,
  Percent, Variable, BookOpen, Shuffle, Link2, Scan,
  Volume2, Loader2, Home
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { AudioService } from '../services/audio';
import { AIService } from '../services/ai';
import { MathPlanet, GameStat } from '../types';

// --- SHARED COMPONENTS ---

const V_ANIM_CSS = `
  @keyframes firework {
    0% { transform: translate(var(--x), var(--initialY)); width: var(--initialSize); opacity: 1; }
    50% { width: 0.5rem; opacity: 1; }
    100% { width: var(--finalSize); opacity: 0; transform: translate(var(--x), var(--y)); }
  }
  .firework, .firework::before, .firework::after {
    --initialSize: 0.5vmin;
    --finalSize: 45vmin;
    --particleSize: 0.2vmin;
    --color1: yellow; --color2: khaki; --color3: white; --color4: palevioletred; --color5: RosyBrown; --color6: mediumseagreen;
    --y: -30vmin; --x: -50%; --initialY: 60vmin;
    content: ""; position: absolute; top: 50%; left: 50%; width: var(--initialSize); aspect-ratio: 1;
    background: radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 50% 0%, radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 50%, radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 50% 100%, radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 0% 50%, radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 80% 90%, radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 95% 90%, radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 90% 70%, radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 60%, radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 55% 80%, radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 70% 77%, radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 22% 90%, radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 45% 90%, radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 33% 70%, radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 10% 60%, radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 31% 80%, radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 28% 77%, radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 13% 72%;
    background-size: var(--initialSize) var(--initialSize); background-repeat: no-repeat;
    transform: translate(-50%, -50%);
    animation: firework 2s infinite;
  }
  .firework::before { --x: -20%; --y: -40%; --initialY: -50%; transform: translate(-50%, -50%) rotate(40deg) scale(1.3) rotateY(40deg); }
  .firework::after { --x: -15%; --y: -50%; --initialY: -50%; transform: translate(-50%, -50%) rotate(170deg) scale(1.15) rotateY(-30deg); }
  .firework:nth-child(2) { --x: 30vmin; }
  .firework:nth-child(2), .firework:nth-child(2)::before, .firework:nth-child(2)::after { --color1: pink; --color2: violet; --color3: fuchsia; --color4: orchid; --color5: plum; --color6: lavender; --finalSize: 40vmin; left: 30%; top: 60%; animation-delay: -0.25s; }
  .firework:nth-child(3) { --x: -30vmin; --y: -50vmin; }
  .firework:nth-child(3), .firework:nth-child(3)::before, .firework:nth-child(3)::after { --color1: cyan; --color2: lightcyan; --color3: lightblue; --color4: PaleTurquoise; --color5: SkyBlue; --color6: lavender; --finalSize: 35vmin; left: 70%; top: 60%; animation-delay: -0.4s; }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
`;

const VictoryOverlay: React.FC<{
  title: string;
  xp: number;
  coins: number;
  badge?: string;
  onNext: () => void;
  onQuit: () => void;
}> = ({ title, xp, coins, badge, onNext, onQuit }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-3xl animate-fade-in p-4 overflow-hidden">
    <style>{V_ANIM_CSS}</style>
    <div className="absolute inset-0 pointer-events-none">
      <div className="firework"></div>
      <div className="firework"></div>
      <div className="firework"></div>
    </div>
    <div className="text-center max-w-sm w-full animate-float flex flex-col items-center relative z-10">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-yellow-500 blur-[60px] opacity-60 animate-pulse scale-150"></div>
        <div className="text-6xl relative drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]">🏆</div>
      </div>
      <h2 className="font-display text-3xl sm:text-4xl text-yellow-400 mb-1 italic tracking-tighter drop-shadow-md">{title}</h2>
      <p className="text-white text-xs font-black mb-5 uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">Mission AccomplISHED!</p>

      {badge && (
        <div className="mb-5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-1.5">
          <Award size={12} className="text-yellow-400" /> Badge Unlocked: {badge}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 w-full mb-6">
        <div className="bg-indigo-600/20 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-center gap-1.5 text-white font-black text-lg">
            <Zap className="text-yellow-300" size={16} /> +{xp}
          </div>
          <div className="text-[7px] text-indigo-400 font-black uppercase tracking-widest mt-1">XP Points</div>
        </div>
        <div className="bg-amber-600/20 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-center gap-1.5 text-white font-black text-lg">
            <Coins className="text-yellow-400" size={16} /> +{coins}
          </div>
          <div className="text-[7px] text-amber-400 font-black uppercase tracking-widest mt-1">Star Coins</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={onNext}
          className="w-full py-4 text-white font-black text-lg rounded-xl shadow-[0_4px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none transition-all uppercase italic tracking-tighter
                     bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 border border-yellow-300/30 object-contain ring-4 ring-yellow-500/20"
        >
          Next Mission
        </button>
        <button
          onClick={onQuit}
          className="w-full py-2.5 text-slate-500 font-black text-[9px] uppercase tracking-[0.3em] hover:text-white transition-colors"
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
  const words = [...selectedWords].sort((a, b) => b.answer.length - a.answer.length);

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
  for (let i = 0; i < first.answer.length; i++) {
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

    // Pick theme randomly instead of linearly
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const pool = (CROSSWORD_PRO_BANK as any)[theme];

    let candidates = pool.filter((w: any) => !usedWords.has(w.answer));
    if (candidates.length < 4) { setUsedWords(new Set()); candidates = pool; }

    const gridSize = Math.min(8 + Math.floor(level / 5), 12);
    const wordCount = Math.min(3 + Math.floor(level / 3), 6);

    // Truly shuffle candidates
    const selected = [...candidates].sort(() => Math.random() - 0.5).slice(0, wordCount);

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
    AudioService.speak(`Crossword Pro Level ${level}. The theme is ${theme}. Select a cell and pick the right word from the options.`, 'sarcastic');
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
      AudioService.speak(clue.clue, 'neutral');
    }
  };

  const handleOptionSelect = (word: string) => {
    if (!activeClue) return;

    // Check if word is correct
    if (word !== activeClue.answer) {
      AudioService.playEffect('wrong');
      AudioService.speak(AudioService.SARCASM.wrong[Math.floor(Math.random() * AudioService.SARCASM.wrong.length)], 'sarcastic');
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
    AudioService.speak(AudioService.SARCASM.correct[Math.floor(Math.random() * AudioService.SARCASM.correct.length)], 'excited');

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
    AudioService.speak(AudioService.SARCASM.completion[Math.floor(Math.random() * AudioService.SARCASM.completion.length)], 'sarcastic');
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


      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 gap-4 sm:gap-6 pb-20 w-full">
        {/* Active Clue Panel */}
        <div className="w-full lg:w-64 flex flex-col gap-3 bg-slate-900/40 p-4 rounded-2xl border border-white/5 shadow-2xl shrink-0">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Current Clue
            </p>
            <h4 className="text-lg font-black text-white italic leading-tight tracking-tight">
              {activeClue?.clue || "Select a cell..."}
            </h4>
          </div>

          <div className="h-px bg-white/5 w-full"></div>

          <div className="space-y-2">
            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.1em] flex items-center gap-1.5 animate-pulse">
              <MousePointer2 size={10} /> Pick Correct Word
            </p>

            <div className="grid grid-cols-1 gap-1.5">
              {activeClue?.options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => handleOptionSelect(opt)}
                  className={`w-full py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all border-b-2 active:translate-y-[1px] active:border-b-0 ${userGrid[activeClue.r][activeClue.c] === opt[0] &&
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
        <div className="relative w-full max-w-[min(85vw,400px)] aspect-square bg-slate-900/60 backdrop-blur-3xl border border-white/5 p-1.5 rounded-2xl shadow-2xl overflow-hidden">
          <div
            className="grid h-full gap-0.5"
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
                    className={`relative flex items-center justify-center rounded text-xs sm:text-sm font-black transition-all border-b-2 ${cell === ""
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
    <div className="min-h-full w-full bg-[#050810] animate-fade-in flex flex-col">
      <div
        className={[
          "w-full mx-auto px-4 sm:px-6 pt-6 pb-28 flex-1",
          maxWidth,
          center ? "flex flex-col justify-center items-center" : "flex flex-col",
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

    // Randomize category selection
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const wordPool = (WORD_SEARCH_BANK as any)[theme];

    // Increase word count dynamically but randomize selection
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
    AudioService.speak(`Word Search Level ${level}. Focus on ${theme}. Find all hidden treasures!`, 'sarcastic');
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
      AudioService.speak(AudioService.SARCASM.correct[Math.floor(Math.random() * AudioService.SARCASM.correct.length)], 'excited');
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
    AudioService.speak(AudioService.SARCASM.completion[Math.floor(Math.random() * AudioService.SARCASM.completion.length)], 'sarcastic');
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
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 pt-6 gap-4 sm:gap-6 w-full pb-20">
        {viewState === "LOADING" ? (
          <div className="text-white/70 font-black text-sm">Loading Word Search…</div>
        ) : (
          <>
            {/* LEFT: Words list */}
            <div className="w-full lg:w-48 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-3 flex flex-wrap lg:flex-col gap-1.5 justify-center shrink-0">
              {targetWords.map((word) => {
                const done = foundWords.includes(word);
                return (
                  <div
                    key={word}
                    className={`relative px-2.5 py-1.5 rounded-md text-[9px] sm:text-[10px] font-black tracking-tighter transition-all flex items-center justify-between ${done
                      ? "bg-emerald-500/20 text-emerald-400 opacity-60"
                      : "bg-slate-800 text-white border border-white/5"
                      }`}
                  >
                    {word}
                    {done && <CheckCircle2 size={10} className="text-emerald-400 ml-1.5" />}
                  </div>
                );
              })}
            </div>

            {/* CENTER: Grid */}
            <div className="relative w-full max-w-[min(90vw,420px)] aspect-square bg-slate-900/60 backdrop-blur-3xl border border-white/5 p-1.5 rounded-2xl shadow-xl overflow-hidden">
              <div
                className="grid h-full gap-0.5"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
              >
                {grid.map((row, r) =>
                  row.map((cell, c) => {
                    const isSelected = selection.some((s) => s.r === r && s.c === c);

                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => handleCellClick(r, c)}
                        className={`relative flex items-center justify-center rounded font-black transition-all border-b-2 active:translate-y-[1px] active:border-b-0 ${cell.found
                          ? "bg-emerald-500 border-emerald-700 text-white"
                          : isSelected
                            ? "bg-indigo-600 border-indigo-800 text-white"
                            : "bg-slate-800 border-slate-950 text-white hover:bg-slate-700"
                          }`}
                      >
                        <span className="text-xs sm:text-sm">{cell.char}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT: Small status/help panel (optional but useful) */}
            <div className="w-full lg:w-48 bg-slate-900/40 p-3 rounded-2xl border border-white/5 shadow-xl shrink-0">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                Progress
              </p>
              <div className="text-white font-black text-base">
                {foundWords.length}/{targetWords.length}
              </div>
              <p className="text-slate-400 text-[9px] font-bold mt-2 leading-tight">
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
  const [missionAttempts, setMissionAttempts] = useState(0);
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
    { id: 'Data' as MathPlanet, label: 'Data Depot', icon: BarChart3, color: 'from-purple-600 to-violet-900', desc: 'Graph Safari' },
    { id: 'Logic' as MathPlanet, label: 'Logic Labyrinth', icon: Brain, color: 'from-pink-600 to-rose-900', desc: 'Puzzle Grid' },
    { id: 'Geometry' as MathPlanet, label: 'Shape Sector', icon: Shapes, color: 'from-cyan-500 to-blue-800', desc: 'Area & Angles' },
    { id: 'Measurements' as MathPlanet, label: 'Measure Moon', icon: Ruler, color: 'from-lime-500 to-green-800', desc: 'Lengths & Weight' },
    { id: 'Patterns' as MathPlanet, label: 'Pattern Planet', icon: Infinity, color: 'from-sky-400 to-indigo-800', desc: 'Sequences' },
    { id: 'Multiplication' as MathPlanet, label: 'Times Trench', icon: X, color: 'from-orange-500 to-red-800', desc: 'Multiples' },
    { id: 'Division' as MathPlanet, label: 'Divide Dome', icon: Divide, color: 'from-violet-500 to-fuchsia-800', desc: 'Sharing' },
    { id: 'Probability' as MathPlanet, label: 'Chance Core', icon: CircleDot, color: 'from-rose-400 to-pink-800', desc: 'Odds & Ends' },
    { id: 'Decimals' as MathPlanet, label: 'Decimal Dust', icon: Scan, color: 'from-teal-400 to-emerald-800', desc: 'Dot Math' },
    { id: 'Percentages' as MathPlanet, label: 'Percent Peak', icon: Percent, color: 'from-fuchsia-500 to-purple-800', desc: '100 Parts' },
    { id: 'Algebra' as MathPlanet, label: 'Algebra Asteroid', icon: Variable, color: 'from-blue-400 to-cyan-800', desc: 'Find X' },
    { id: 'WordProblems' as MathPlanet, label: 'Story Star', icon: BookOpen, color: 'from-green-400 to-lime-800', desc: 'Read & Solve' },
    { id: 'RomanNumerals' as MathPlanet, label: 'Roman Ring', icon: Landmark, color: 'from-yellow-500 to-amber-800', desc: 'V, X, L' },
    { id: 'Ratios' as MathPlanet, label: 'Ratio Rift', icon: Link2, color: 'from-indigo-400 to-blue-800', desc: 'Comparisons' },
    { id: 'NumberBonds' as MathPlanet, label: 'Bond Base', icon: Shuffle, color: 'from-red-400 to-rose-800', desc: 'Number Pairs' },
    { id: 'EvensOdds' as MathPlanet, label: 'Evens & Odds', icon: Hash, color: 'from-amber-400 to-orange-800', desc: 'Skip Logic' }
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
    } else if (planet === 'Fractions') {
      const denominators = [2, 3, 4, 6, 8];
      const denom = denominators[Math.floor(Math.random() * denominators.length)];
      const numeratorMax = Math.min(denom - 1, currentLevel + 2);
      let numerA = Math.floor(Math.random() * numeratorMax) + 1;
      let numerB = Math.floor(Math.random() * numeratorMax) + 1;
      const isAdd = Math.random() > 0.3;
      let resultNumer = isAdd ? numerA + numerB : numerA - numerB;
      if (resultNumer < 0) {
        [numerA, numerB] = [Math.max(numerA, numerB), Math.min(numerA, numerB)];
        resultNumer = numerA - numerB;
      }
      const base =
        isAdd || numerA >= numerB
          ? `${numerA}/${denom}` + (isAdd ? ` + ${numerB}/${denom}` : ` - ${numerB}/${denom}`)
          : `${numerA}/${denom} + ${numerB}/${denom}`;
      const answer = Number((resultNumer / denom).toFixed(3));
      q = {
        text: `What is ${isAdd ? 'the sum of' : 'the difference between'} ${numerA}/${denom} and ${numerB}/${denom}?`,
        ans: answer,
        speak: `What is ${numerA}/${denom} ${isAdd ? 'plus' : 'minus'} ${numerB}/${denom}?`,
        visual: null,
      };
      const delta = Math.max(0.25, 1 / denom);
      opts = [
        answer,
        Number((answer + delta).toFixed(3)),
        Math.max(0, Number((answer - delta).toFixed(3))),
        Number((answer + delta * 2).toFixed(3)),
      ];
    } else if (planet === 'Time') {
      const hours = Math.floor(Math.random() * Math.min(4, currentLevel + 2)) + 1;
      const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const totalMinutes = hours * 60 + minutes;
      q = {
        text: `How many minutes are in ${hours} hour${hours > 1 ? 's' : ''}${minutes ? ` and ${minutes} minutes` : ''}?`,
        ans: totalMinutes,
        speak: `How many minutes are in ${hours} hours and ${minutes} minutes?`,
        visual: null,
      };
      opts = [
        totalMinutes,
        totalMinutes + 5,
        Math.max(10, totalMinutes - 5),
        totalMinutes + 15,
      ];
    } else if (planet === 'Money') {
      const priceA = Number((Math.random() * 5 + 1).toFixed(2));
      const priceB = Number((Math.random() * 4 + 0.5).toFixed(2));
      const totalCost = Number((priceA + priceB).toFixed(2));
      q = {
        text: `You spend $${priceA} on one toy and $${priceB} on another. What is the total cost?`,
        ans: totalCost,
        speak: `If you spend ${priceA} dollars and ${priceB} dollars, what is the total?`,
        visual: null,
      };
      opts = [
        totalCost,
        Number((totalCost + 0.5).toFixed(2)),
        Number(Math.max(0, (totalCost - 0.75)).toFixed(2)),
        Number((totalCost + 1).toFixed(2)),
      ];
    } else if (planet === 'Data') {
      const items = ["Apples", "Bananas", "Cherries", "Dates"];
      const values = items.map(() => Math.floor(Math.random() * 10) + 5);
      const statTotal = values.reduce((acc, val) => acc + val, 0);
      const maxLabel = items[values.indexOf(Math.max(...values))];
      q = {
        text: `The chart shows ${items[0]}: ${values[0]}, ${items[1]}: ${values[1]}, ${items[2]}: ${values[2]}, ${items[3]}: ${values[3]}. How many pieces are there in total?`,
        ans: statTotal,
        speak: `Add up the numbers for ${items[0]}, ${items[1]}, ${items[2]}, and ${items[3]}. What is the total?`,
        visual: [],
      };
      opts = [
        statTotal,
        statTotal + 3,
        Math.max(0, statTotal - 2),
        statTotal + 5,
      ];
    } else if (planet === 'Logic') {
      const isTrue = Math.random() > 0.5;
      const num1 = Math.floor(Math.random() * 10) + currentLevel;
      const num2 = Math.floor(Math.random() * 10) + currentLevel;
      const op = Math.random() > 0.5 ? '>' : '<';
      const statement = op === '>' ? `${num1} is greater than ${num2}` : `${num1} is less than ${num2}`;
      const actualTruth = op === '>' ? num1 > num2 : num1 < num2;
      const ans = actualTruth ? 1 : 0;
      q = { text: `Is it true: ${statement}? (1=Yes, 0=No)`, ans, speak: statement + '. Is this true? 1 for yes, 0 for no.', visual: null };
      opts = [1, 0];
    } else if (planet === 'Geometry') {
      const shapes = [
        { name: 'Triangle', sides: 3 }, { name: 'Square', sides: 4 },
        { name: 'Pentagon', sides: 5 }, { name: 'Hexagon', sides: 6 },
        { name: 'Octagon', sides: 8 }, { name: 'Decagon', sides: 10 }
      ];
      const target = shapes[Math.floor(Math.random() * Math.min(shapes.length, currentLevel + 2))];
      q = { text: `How many sides does a ${target.name} have?`, ans: target.sides, speak: `How many sides does a ${target.name} have?`, visual: null };
      opts = [target.sides, target.sides + 1, Math.max(0, target.sides - 1), target.sides + 2];
    } else if (planet === 'Measurements') {
      const baseLen = (Math.floor(Math.random() * 20) + 10) * currentLevel;
      const cut = Math.floor(Math.random() * (baseLen - 5)) + 1;
      const left = baseLen - cut;
      q = { text: `A string is ${baseLen}cm. You cut ${cut}cm. Left?`, ans: left, speak: `A string is ${baseLen} centimeters. You cut ${cut} centimeters off. What is left?`, visual: null };
      opts = [left, left + 2, Math.max(0, left - 5), left + 10];
    } else if (planet === 'Patterns') {
      const start = Math.floor(Math.random() * 10) + 1;
      const step = Math.floor(Math.random() * Math.min(5, currentLevel)) + 1;
      const t1 = start, t2 = start + step, t3 = start + step * 2, t4 = start + step * 3;
      q = { text: `${t1}, ${t2}, ${t3}, ?`, ans: t4, speak: `What comes next in the pattern? ${t1}, ${t2}, ${t3}?`, visual: null };
      opts = [t4, t4 + 1, t4 - 1, t4 + step];
    } else if (planet === 'Multiplication') {
      const maxTable = age <= 6 ? 5 : (currentLevel * 3 + 5);
      const a = Math.floor(Math.random() * maxTable) + 1;
      const b = Math.floor(Math.random() * Math.min(10, currentLevel + 2)) + 1;
      const ans = a * b;
      q = { text: `${a} × ${b}`, ans, speak: `What is ${a} times ${b}?`, visual: null };
      opts = [ans, ans + a, Math.max(0, ans - b), ans + 2];
    } else if (planet === 'Division') {
      const divisor = Math.floor(Math.random() * Math.min(10, currentLevel + 2)) + 1;
      const quotient = Math.floor(Math.random() * 10) + 1;
      const dividend = divisor * quotient;
      q = { text: `${dividend} ÷ ${divisor}`, ans: quotient, speak: `What is ${dividend} divided by ${divisor}?`, visual: null };
      opts = [quotient, quotient + 1, Math.max(0, quotient - 1), quotient + 2];
    } else if (planet === 'Probability') {
      const red = Math.floor(Math.random() * 5) + 1;
      const blue = Math.floor(Math.random() * 5) + 1;
      const total = red + blue;
      q = { text: `${red} red balls, ${blue} blue. Total balls?`, ans: total, speak: `If you have ${red} red balls and ${blue} blue balls, how many in total?`, visual: null };
      opts = [total, total + 1, Math.max(0, total - 1), total + 2];
    } else if (planet === 'Decimals') {
      const a = Number((Math.random() * 10).toFixed(1));
      const b = Number((Math.random() * 5).toFixed(1));
      const isAdd = Math.random() > 0.5;
      const ans = isAdd ? Number((a + b).toFixed(1)) : Number(Math.max(0.1, a - b).toFixed(1));
      q = { text: `${a} ${isAdd ? '+' : '-'} ${b}`, ans, speak: `What is ${a} ${isAdd ? 'plus' : 'minus'} ${b}?`, visual: null };
      opts = [ans, Number((ans + 0.5).toFixed(1)), Number(Math.max(0, ans - 0.2).toFixed(1)), Number((ans + 1.1).toFixed(1))];
    } else if (planet === 'Percentages') {
      const bases = [10, 20, 50, 100, 200];
      const base = bases[Math.floor(Math.random() * bases.length)];
      const perc = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      const ans = (perc / 100) * base;
      q = { text: `What is ${perc}% of ${base}?`, ans, speak: `What is ${perc} percent of ${base}?`, visual: null };
      opts = [ans, ans + 5, Math.max(0, ans - 2), ans + 10];
    } else if (planet === 'Algebra') {
      const x = Math.floor(Math.random() * 10 * currentLevel) + 1;
      const a = Math.floor(Math.random() * 15) + 1;
      const b = x + a;
      q = { text: `X + ${a} = ${b}. What is X?`, ans: x, speak: `If X plus ${a} equals ${b}. What is X?`, visual: null };
      opts = [x, x + 1, Math.max(0, x - 2), x + 5];
    } else if (planet === 'WordProblems') {
      const initial = Math.floor(Math.random() * 20) + 10;
      const lost = Math.floor(Math.random() * 9) + 1;
      const ans = initial - lost;
      q = { text: `Had ${initial} apples. Lost ${lost}. Left?`, ans, speak: `You had ${initial} apples and lost ${lost}. How many are left?`, visual: null };
      opts = [ans, ans + 2, Math.max(0, ans - 1), ans + 3];
    } else if (planet === 'RomanNumerals') {
      const roms = [{ r: 'I', v: 1 }, { r: 'V', v: 5 }, { r: 'X', v: 10 }, { r: 'L', v: 50 }, { r: 'C', v: 100 }];
      const maxIdx = Math.min(roms.length, currentLevel + 1);
      const target = roms[Math.floor(Math.random() * maxIdx)];
      q = { text: `Value of Roman Numeral '${target.r}'?`, ans: target.v, speak: `What is the value of the Roman numeral ${target.r}?`, visual: null };
      opts = [target.v, target.v + 5, target.v + 10, target.v === 1 ? 2 : target.v - 1];
    } else if (planet === 'Ratios') {
      const m = Math.floor(Math.random() * 5) + 2;
      q = { text: `If ratio is 1:${m}, and you have 2. The other is?`, ans: 2 * m, speak: `If the ratio is 1 to ${m}, and you have 2 of the first, how much of the second?`, visual: null };
      opts = [2 * m, 2 * m + 1, m, 2 * m + 2];
    } else if (planet === 'NumberBonds') {
      const total = Math.floor(Math.random() * 10 * currentLevel) + 10;
      const part1 = Math.floor(Math.random() * (total - 2)) + 1;
      const part2 = total - part1;
      q = { text: `${part1} + ? = ${total}`, ans: part2, speak: `What number plus ${part1} equals ${total}?`, visual: null };
      opts = [part2, part2 + 1, Math.max(0, part2 - 2), part2 + 5];
    } else if (planet === 'EvensOdds') {
      const num = Math.floor(Math.random() * 100) + 1;
      const isEven = num % 2 === 0;
      q = { text: `Is ${num} Even or Odd? (2=Even, 1=Odd)`, ans: isEven ? 2 : 1, speak: `Is ${num} even or odd? Press 2 for Even, 1 for Odd.`, visual: null };
      opts = [2, 1];
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
      AudioService.speak(q.speak, "sarcastic");
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
        "excited"
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
      "sarcastic"
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
              className="p-2 sm:p-3 bg-slate-900 border border-white/10 rounded-xl sm:rounded-2xl text-white shadow-xl active:scale-90"
            >
              <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
            </button>

            <div className="text-center">
              <h2 className="font-display text-2xl sm:text-3xl text-white italic tracking-tight leading-none drop-shadow-md">
                Math Galaxy
              </h2>
            </div>

            <div className="bg-slate-900 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/10 shadow-xl flex items-center gap-1.5">
              <Rocket size={14} className="text-indigo-400 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-tighter">
                Level {stats.mathPlanetProgress?.find(p => p.planet === selectedPlanet)?.level ?? 1}
              </span>
            </div>
          </header>

          {/* Compact grid: no forced scroll */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto w-full mb-10">
            {PLANET_DATA.map((planet) => {
              const isUnlocked =
                stats.mathPlanetProgress?.find((p) => p.planet === planet.id)?.unlocked ?? false;

              return (
                <button
                  key={planet.id}
                  // keep clickable even if locked (as you were doing)
                  disabled={false}
                  onClick={() => startPlanet(planet.id)}
                  className={`group relative p-3 sm:p-4 rounded-[1.5rem] border transition-all flex flex-col items-center text-center overflow-hidden shadow-lg ${isUnlocked
                    ? "bg-slate-900 border-white/10 hover:border-indigo-500 hover:-translate-y-1"
                    : "bg-slate-950 border-slate-900 opacity-40 grayscale"
                    }`}
                >
                  <div
                    className={`text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-500 ${isUnlocked ? "drop-shadow-[0_0_15px_rgba(99,102,241,0.25)]" : ""
                      }`}
                  >
                    <planet.icon size={28} className={isUnlocked ? "text-indigo-400" : "text-slate-700"} />
                  </div>

                  <h3 className="text-xs sm:text-sm font-black text-white uppercase italic tracking-tight leading-none mb-1">
                    {planet.label}
                  </h3>

                  <p className="text-slate-500 font-bold text-[8px] uppercase tracking-widest leading-tight">
                    {planet.desc}
                  </p>

                  {!isUnlocked && (
                    <Lock className="absolute top-3 right-3 text-slate-700" size={14} />
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
              className="p-2 sm:p-3 bg-slate-900 border border-white/10 rounded-xl sm:rounded-2xl text-white shadow-xl active:scale-90"
            >
              <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
            </button>

            <div className="text-center">
              <h2 className="font-display text-xl sm:text-2xl text-white italic tracking-tight leading-none drop-shadow-md">
                {planetMeta?.label || "Math Galaxy"}
              </h2>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">
                Score {score}/{missionTarget}
              </p>
            </div>

            <div className="bg-slate-900 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/10 shadow-xl flex items-center gap-1.5">
              <Rocket size={14} className="text-indigo-400 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-tighter">
                Level {stats.mathPlanetProgress?.find(p => p.planet === selectedPlanet)?.level ?? 1}

              </span>
            </div>
          </header>

          {/* Question panel */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 pb-10">
            <div className="w-full max-w-xl bg-slate-900/50 border border-white/10 rounded-[1.5rem] p-4 text-center shadow-xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                Solve this
              </p>

              <div className="text-3xl sm:text-4xl font-black text-white italic tracking-tight drop-shadow-lg">
                {question.text}
              </div>

              {feedback && (
                <div
                  className={`mt-2 text-[10px] font-black uppercase tracking-[0.2em] ${feedback.type === "CORRECT" ? "text-emerald-400" : "text-rose-400"
                    }`}
                >
                  {feedback.msg}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="w-full max-w-xl grid grid-cols-2 gap-2">
              {options.map((opt: number) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="bg-slate-900/70 border-b-2 border-slate-950 hover:bg-indigo-600 hover:border-indigo-800 transition-all active:translate-y-[1px] active:border-b-0 rounded-xl py-3 text-white font-black text-base sm:text-lg"
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
    const next = solved + 1; setSolved(next); AudioService.speak("Correct! You're a movie buff!", 'excited');
    if (next >= puzzles.length) setShowVictory(true); else setCurrentIndex(currentIndex + 1);
  };
  return (
    <Screen maxWidth="max-w-md" center>
      {showVictory && <VictoryOverlay title="BRAIN MASTER" xp={50} coins={10} onNext={() => { setSolved(0); setCurrentIndex(0); setShowVictory(false); }} onQuit={onBack} />}
      <button onClick={onBack} className="absolute top-8 left-8 p-4 bg-slate-900 rounded-2xl text-white border border-white/10 shadow-xl active:scale-90"><ArrowLeft /></button>
      <div className="bg-slate-900/50 backdrop-blur-3xl border-2 border-white/5 p-8 sm:p-12 rounded-[4rem] text-center shadow-2xl max-w-sm w-full my-12 shrink-0">
        <div className="text-6xl sm:text-8xl mb-8 sm:mb-12 drop-shadow-2xl animate-float">{puzzles[currentIndex].emoji}</div>
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

type EnglishMissionMode = 'DAILY' | 'VOCAB' | 'SPELL' | 'READ';

type EnglishWord = {
  word: string;
  meaning: string;
  sentence: string;
  options: string[];
};

const ENGLISH_WORD_BANK: EnglishWord[] = [
  {
    word: 'curious',
    meaning: 'wanting to learn or know more',
    sentence: 'The curious child asked how the rainbow formed.',
    options: ['wanting to learn', 'very sleepy', 'moving quickly', 'full of water']
  },
  {
    word: 'brave',
    meaning: 'ready to face something scary or hard',
    sentence: 'Maya was brave when she read aloud to the class.',
    options: ['ready to face fear', 'very tiny', 'made of glass', 'not telling the truth']
  },
  {
    word: 'observe',
    meaning: 'to look carefully and notice details',
    sentence: 'Scientists observe the moon through telescopes.',
    options: ['look carefully', 'run away', 'forget quickly', 'paint red']
  },
  {
    word: 'protect',
    meaning: 'to keep safe',
    sentence: 'A helmet can protect your head when you ride a bike.',
    options: ['keep safe', 'make louder', 'throw away', 'turn around']
  },
  {
    word: 'compare',
    meaning: 'to find what is alike and different',
    sentence: 'We compare two stories to see how they are similar.',
    options: ['find alike and different', 'hide under a table', 'sing quietly', 'count backward']
  },
  {
    word: 'invent',
    meaning: 'to create something new',
    sentence: 'The team worked together to invent a helpful robot.',
    options: ['create something new', 'sleep outside', 'walk in circles', 'eat breakfast']
  }
];

const READING_PASSAGES = [
  {
    title: 'The Garden Scientist',
    passage: 'Zara planted two beans in soft soil. Each morning, she observed the leaves and measured the stems. One plant grew near the sunny window. The other stayed in a dark corner. Zara learned that plants need light to grow strong.',
    question: 'What did Zara learn?',
    options: ['Plants need light to grow strong.', 'Plants grow best in dark corners.', 'Beans do not need soil.', 'Measuring plants stops them growing.'],
    answer: 0
  },
  {
    title: 'The Helpful Map',
    passage: 'Leo and Amara visited a museum. They used a map to compare the animal room, space room, and art room. The map helped them plan the shortest path. They reached every room before lunch and still had time to sketch their favorite exhibit.',
    question: 'Why was the map helpful?',
    options: ['It helped them plan a short path.', 'It cooked their lunch.', 'It turned into a spaceship.', 'It hid the art room.'],
    answer: 0
  }
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const EnglishLearningQuest: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const profile = StorageService.getCurrentProfile();
  const [stats, setStats] = useState<GameStat>(StorageService.getGameStats());
  const [mode, setMode] = useState<EnglishMissionMode>('DAILY');
  const [activeWord, setActiveWord] = useState(() => shuffle(ENGLISH_WORD_BANK)[0]);
  const [passage, setPassage] = useState(() => shuffle(READING_PASSAGES)[0]);
  const [spellInput, setSpellInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [aiQuestions, setAiQuestions] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [missionAttempts, setMissionAttempts] = useState(0);
  const wordLevel = stats.wordQuestProgress?.level || 1;

  const awardEnglishXp = (xp: number, coins: number, modeType: 'VOCAB' | 'SPELL' | 'READ' | 'AI', words: string[], summary: string) => {
    const attempts = Math.max(missionAttempts + 1, score + 1, 1);
    const finalScore = modeType === 'READ' ? Math.max(score + 1, 2) : Math.max(score + 1, 3);
    const nextStats: GameStat = {
      ...stats,
      xp: stats.xp + xp,
      coins: stats.coins + coins,
      wordQuestProgress: { level: wordLevel + 1, unlocked: true }
    };
    if (!nextStats.badges?.includes('English Explorer') && wordLevel >= 2) {
      nextStats.badges = [...(nextStats.badges || []), 'English Explorer'];
    }
    StorageService.saveGameStats(nextStats);
    StorageService.saveEnglishProgress({
      mode: modeType,
      score: finalScore,
      attempts,
      accuracy: Math.round((finalScore / attempts) * 100),
      wordsPracticed: words,
      summary,
      xpEarned: xp,
      coinsEarned: coins
    }).catch(error => console.error('English progress save failed', error));
    setStats(nextStats);
  };

  const nextWord = () => {
    setActiveWord(shuffle(ENGLISH_WORD_BANK)[0]);
    setSpellInput('');
    setFeedback('');
  };

  const startAiMission = async () => {
    setAiLoading(true);
    setFeedback('');
    const generated = await AIService.generateQuiz('English', wordLevel, 'vocabulary, spelling, reading comprehension', profile?.age || 7);
    setAiQuestions(generated.slice(0, 3));
    setAiLoading(false);
    if (!generated.length) {
      setFeedback('AI is warming up. Practice with the daily missions below.');
      AudioService.speak('AI is warming up. Try the daily English missions.');
    } else {
      StorageService.saveEnglishProgress({
        mode: 'AI',
        score: 0,
        attempts: generated.length,
        accuracy: 0,
        wordsPracticed: ['AI Mission'],
        summary: `Generated ${generated.length} AI English practice questions.`,
        xpEarned: 0,
        coinsEarned: 0
      }).catch(error => console.error('AI English progress save failed', error));
      AudioService.speak('AI English mission ready. Answer the coach questions.');
    }
  };

  const handleVocabAnswer = (choice: string) => {
    setMissionAttempts(prev => prev + 1);
    const correct = choice === activeWord.options[0];
    if (correct) {
      setScore(prev => prev + 1);
      setFeedback(`Correct! ${activeWord.word} means ${activeWord.meaning}.`);
      AudioService.playEffect('correct');
      AudioService.speak(`Correct. ${activeWord.word} means ${activeWord.meaning}.`);
      if (score + 1 >= 3) {
        awardEnglishXp(180, 45, 'VOCAB', [activeWord.word], 'Completed Vocabulary Quest practice.');
        setShowVictory(true);
      } else {
        setTimeout(nextWord, 900);
      }
    } else {
      setFeedback(`Almost. Listen: ${activeWord.sentence}`);
      AudioService.playEffect('wrong');
      AudioService.speak(activeWord.sentence);
    }
  };

  const handleSpellSubmit = () => {
    setMissionAttempts(prev => prev + 1);
    const correct = spellInput.trim().toLowerCase() === activeWord.word.toLowerCase();
    if (correct) {
      setScore(prev => prev + 1);
      setFeedback('Spelling star! New word coming up.');
      AudioService.playEffect('correct');
      AudioService.speak('Spelling star!');
      if (score + 1 >= 3) {
        awardEnglishXp(200, 50, 'SPELL', [activeWord.word], 'Completed Spelling Bee practice.');
        setShowVictory(true);
      } else {
        setTimeout(nextWord, 700);
      }
    } else {
      setFeedback(`Try again. The word sounds like: ${activeWord.word.split('').join(' - ')}`);
      AudioService.playEffect('wrong');
      AudioService.speak(activeWord.word);
    }
  };

  const handleReadingAnswer = (idx: number) => {
    setMissionAttempts(prev => prev + 1);
    if (idx === passage.answer) {
      setScore(prev => prev + 1);
      setFeedback('Great reading detective work!');
      AudioService.playEffect('correct');
      AudioService.speak('Great reading detective work!');
      if (score + 1 >= 2) {
        awardEnglishXp(220, 60, 'READ', [passage.title], 'Completed Reading Coach comprehension practice.');
        setShowVictory(true);
      } else {
        setPassage(shuffle(READING_PASSAGES)[0]);
      }
    } else {
      setFeedback('Read the passage again and look for the key detail.');
      AudioService.playEffect('wrong');
    }
  };

  const renderMission = () => {
    if (mode === 'VOCAB') {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.25em]">Vocabulary Quest</p>
            <h3 className="text-5xl font-display text-white italic">{activeWord.word}</h3>
            <p className="text-slate-300 mt-2">{activeWord.sentence}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {shuffle(activeWord.options).map(choice => (
              <button key={choice} onClick={() => handleVocabAnswer(choice)} className="bg-slate-800 hover:bg-emerald-600 border-b-4 border-slate-950 rounded-2xl p-4 text-white font-black active:translate-y-1 active:border-b-0">
                {choice}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (mode === 'SPELL') {
      return (
        <div className="space-y-5 text-center">
          <p className="text-[10px] font-black text-amber-300 uppercase tracking-[0.25em]">Spelling Bee Arena</p>
          <button onClick={() => AudioService.speak(activeWord.word)} className="mx-auto bg-amber-500 text-slate-950 px-5 py-3 rounded-full font-black flex items-center gap-2">
            <Volume2 size={18} /> Hear Word
          </button>
          <p className="text-slate-300">{activeWord.meaning}</p>
          <input value={spellInput} onChange={e => setSpellInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSpellSubmit()} autoFocus className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-2xl p-5 text-center text-3xl text-white font-black outline-none" placeholder="type word" />
          <button onClick={handleSpellSubmit} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl py-4 font-black">Check Spelling</button>
        </div>
      );
    }

    if (mode === 'READ') {
      return (
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-black text-sky-300 uppercase tracking-[0.25em]">Reading Coach</p>
            <h3 className="text-3xl font-display text-white italic">{passage.title}</h3>
            <p className="text-slate-200 bg-slate-950/60 rounded-2xl p-4 leading-relaxed mt-3">{passage.passage}</p>
          </div>
          <button onClick={() => AudioService.speak(passage.passage)} className="bg-sky-500/20 text-sky-200 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
            <Volume2 size={16} /> Read aloud
          </button>
          <p className="text-white font-black">{passage.question}</p>
          <div className="grid gap-2">
            {passage.options.map((opt, idx) => (
              <button key={opt} onClick={() => handleReadingAnswer(idx)} className="text-left bg-slate-800 hover:bg-sky-600 rounded-xl p-3 text-white font-bold">
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="grid sm:grid-cols-3 gap-3">
          <button onClick={() => { setMode('VOCAB'); setScore(0); setMissionAttempts(0); nextWord(); }} className="bg-emerald-600/20 border border-emerald-400/30 rounded-3xl p-5 text-left hover:bg-emerald-600/30">
            <Languages className="text-emerald-300 mb-3" />
            <h3 className="font-black text-white">Vocabulary Quest</h3>
            <p className="text-xs text-slate-300 mt-1">Meaning, context, and sentence power.</p>
          </button>
          <button onClick={() => { setMode('SPELL'); setScore(0); setMissionAttempts(0); nextWord(); }} className="bg-amber-600/20 border border-amber-400/30 rounded-3xl p-5 text-left hover:bg-amber-600/30">
            <Keyboard className="text-amber-300 mb-3" />
            <h3 className="font-black text-white">Spelling Bee</h3>
            <p className="text-xs text-slate-300 mt-1">Hear words and spell them correctly.</p>
          </button>
          <button onClick={() => { setMode('READ'); setScore(0); setMissionAttempts(0); setPassage(shuffle(READING_PASSAGES)[0]); }} className="bg-sky-600/20 border border-sky-400/30 rounded-3xl p-5 text-left hover:bg-sky-600/30">
            <BookOpen className="text-sky-300 mb-3" />
            <h3 className="font-black text-white">Reading Coach</h3>
            <p className="text-xs text-slate-300 mt-1">Read, listen, and answer comprehension.</p>
          </button>
        </div>

        <div className="bg-indigo-600/10 border border-indigo-400/20 rounded-3xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.25em]">AI Daily Path</p>
              <h3 className="font-black text-white text-xl">Personal English Coach</h3>
              <p className="text-slate-300 text-sm">Generate age-aware English questions for vocabulary, spelling, and comprehension.</p>
            </div>
            <button onClick={startAiMission} disabled={aiLoading} className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white px-4 py-3 rounded-2xl font-black flex items-center gap-2">
              {aiLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} AI Mission
            </button>
          </div>
          {aiQuestions.length > 0 && (
            <div className="grid gap-2 mt-4">
              {aiQuestions.map((q, idx) => (
                <div key={`${q.question}-${idx}`} className="bg-slate-950/50 rounded-2xl p-3">
                  <p className="text-white font-bold">{idx + 1}. {q.question}</p>
                  <p className="text-xs text-indigo-200 mt-1">{Array.isArray(q.options) ? q.options.join(' • ') : 'Think, answer, and explain why.'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Screen maxWidth="max-w-5xl">
      {showVictory && (
        <VictoryOverlay
          title="ENGLISH HERO"
          xp={220}
          coins={60}
          badge={wordLevel >= 2 ? 'English Explorer' : undefined}
          onNext={() => {
            setShowVictory(false);
            setMode('DAILY');
            setScore(0);
            setMissionAttempts(0);
            setFeedback('');
          }}
          onQuit={onBack}
        />
      )}
      <header className="flex justify-between items-center mb-5">
        <button onClick={onBack} className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-white shadow-xl active:scale-90">
          <ArrowLeft />
        </button>
        <div className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white italic tracking-tight">English Quest AI</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Level {wordLevel} • Score {score}</p>
        </div>
        <button onClick={() => { setMode('DAILY'); setFeedback(''); }} className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-indigo-300 shadow-xl">
          <Home size={18} />
        </button>
      </header>

      <div className="bg-slate-900/70 border border-white/10 rounded-[2rem] p-5 sm:p-7 shadow-2xl">
        {renderMission()}
        {feedback && (
          <div className="mt-5 bg-slate-950/70 border border-white/10 rounded-2xl p-4 text-center text-sm font-bold text-amber-200">
            {feedback}
          </div>
        )}
      </div>
    </Screen>
  );
};

const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'MATH' | 'GUESS' | 'SEARCH' | 'CROSSWORD' | 'MOUNTAIN' | 'ENGLISH' | null>(null);
  if (activeGame === 'MATH') return <MathGalaxy onBack={() => setActiveGame(null)} />;
  if (activeGame === 'GUESS') return <EmojiRiddle onBack={() => setActiveGame(null)} />;
  if (activeGame === 'SEARCH') return <WordSearchGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'CROSSWORD') return <CrosswordPro onBack={() => setActiveGame(null)} />;
  if (activeGame === 'MOUNTAIN') return <MultiplicationMountain onQuit={() => setActiveGame(null)} onComplete={() => setActiveGame(null)} />;
  if (activeGame === 'ENGLISH') return <EnglishLearningQuest onBack={() => setActiveGame(null)} />;
  return (
    <div className="h-full flex flex-col px-4 sm:px-6 pt-6 pb-10 animate-fade-in mx-auto max-w-5xl">
      <div className="text-center mb-6">
        <h2 className="font-display text-4xl sm:text-5xl text-white italic tracking-tight drop-shadow-xl mb-1">Arcade Zone</h2>
        <p className="text-slate-400 text-sm font-medium tracking-tight">Level up and earn Star Treasures!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <GameCard onClick={() => setActiveGame('ENGLISH')} icon="📚" title="English Quest AI" tag="AI Reading" color="from-sky-600 to-indigo-700" />
        <GameCard onClick={() => setActiveGame('MATH')} icon="🌌" title="Math Galaxy" tag="Logic" color="from-indigo-600 to-blue-700" />
        <GameCard onClick={() => setActiveGame('MOUNTAIN')} icon="🏔️" title="Multiplication Mountain" tag="Math" color="from-amber-600 to-orange-700" />
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
    className="group relative bg-slate-900/70 backdrop-blur-xl p-5 sm:p-6 rounded-[1.5rem] border border-white/10 hover:border-indigo-500/50 transition-all hover:-translate-y-1 overflow-hidden flex flex-col items-center shadow-lg"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity`} />

    <div className="relative text-4xl sm:text-5xl mb-4 group-hover:scale-105 transition-transform duration-500 group-hover:rotate-3">
      {icon}
    </div>

    <h3 className="relative text-lg sm:text-xl font-black text-white uppercase italic tracking-tight mb-1">
      {title}
    </h3>

    <p className="relative text-indigo-300 font-bold text-[9px] uppercase tracking-widest bg-indigo-400/10 px-2 py-0.5 rounded-full border border-indigo-400/20">
      {tag} Challenge
    </p>
  </button>
);

// --- MULTIPLICATION MOUNTAIN ---

const MultiplicationMountain: React.FC<{
  onComplete: (xp: number, coins: number) => void;
  onQuit: () => void;
}> = ({ onComplete, onQuit }) => {
  const [stage, setStage] = useState(1);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [shake, setShake] = useState(false);

  const camps = [
    { id: 1, name: "Base Camp", tables: [2, 10], color: "text-emerald-400" },
    { id: 2, name: "Pine Forest", tables: [5, 3], color: "text-green-500" },
    { id: 3, name: "Rocky Cliff", tables: [4, 6], color: "text-slate-400" },
    { id: 4, name: "Snowy Slope", tables: [7, 8, 9], color: "text-blue-200" },
    { id: 5, name: "The Summit", tables: [11, 12], color: "text-amber-400" },
  ];

  const generateQuestion = () => {
    const currentCamp = camps[stage - 1];
    const table = currentCamp.tables[Math.floor(Math.random() * currentCamp.tables.length)];
    const other = Math.floor(Math.random() * 12) + 1;
    setNum1(table);
    setNum2(other);
    setAnswer('');
    setFeedback('');
  };

  useEffect(() => {
    generateQuestion();
    AudioService.speak(`Welcome to ${camps[0].name}! Let's start climbing.`, 'excited');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = num1 * num2;
    if (parseInt(answer) === correct) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setFeedback('Great climb! 🏔️');

      if (newStreak % 5 === 0) {
        AudioService.speak(`Incredible! A ${newStreak} answer streak! You're racing up the mountain!`, 'excited');
      }

      if (newScore >= stage * 5) {
        if (stage < 5) {
          const nextCamp = camps[stage];
          AudioService.speak(`Camp ${stage} reached! Moving to ${nextCamp.name}. Keep going!`, 'excited');
          setStage(stage + 1);
          setScore(0);
        } else {
          setShowVictory(true);
          AudioService.speak("Congratulations! You've conquered Multiplication Mountain! You are a math champion!", 'excited');
        }
      }
      setTimeout(generateQuestion, 600);
    } else {
      setShake(true);
      setStreak(0);
      setFeedback('Slip! Try again.');
      AudioService.speak('Careful! Watch your footing.', 'soft');
      setTimeout(() => setShake(false), 500);
    }
  };

  if (showVictory) {
    return (
      <VictoryOverlay
        title="Mountain Conqueror"
        xp={500}
        coins={250}
        badge="Summit Master"
        onNext={() => {
          onComplete(500, 250);
          onQuit();
        }}
        onQuit={onQuit}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4 bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl relative overflow-hidden mx-auto max-w-xl my-10">
      <div className="w-full max-w-md mb-8 px-4">
        <div className="flex justify-between mb-2">
          {camps.map((c) => (
            <div key={c.id} className={`flex flex-col items-center group`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${stage >= c.id ? 'bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-slate-700 text-slate-500'}`}>
                {stage > c.id ? <CheckCircle2 size={16} /> : c.id}
              </div>
              <span className={`text-[8px] mt-1 font-bold uppercase tracking-tighter ${stage === c.id ? 'text-amber-400' : 'text-slate-500'}`}>{c.name}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-1000" style={{ width: `${(stage / 5) * 100}%` }}></div>
        </div>
      </div>

      <div className={`text-center transition-transform ${shake ? 'animate-shake' : ''}`}>
        <div className="text-6xl sm:text-7xl font-display mb-8 text-white flex items-center justify-center gap-4">
          <span className="bg-slate-800 px-6 py-4 rounded-2xl border-2 border-slate-700 shadow-lg">{num1}</span>
          <span className="text-4xl text-amber-500">×</span>
          <span className="bg-slate-800 px-6 py-4 rounded-2xl border-2 border-slate-700 shadow-lg">{num2}</span>
        </div>

        <form onSubmit={handleSubmit} className="relative max-w-[200px] mx-auto">
          <input
            autoFocus
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full bg-slate-900 border-4 border-slate-700 rounded-2xl py-6 text-4xl text-center text-white outline-none focus:border-amber-500 transition-all shadow-inner"
            placeholder="?"
          />
          <p className={`mt-4 font-bold text-lg animate-bounce ${feedback.includes('Slip') ? 'text-red-400' : 'text-emerald-400'}`}>
            {feedback}
          </p>
        </form>

        <div className="mt-8 flex gap-4 justify-center">
          <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
            <p className="text-[10px] text-slate-500 uppercase font-black">Score</p>
            <p className="text-2xl font-display text-white">{score}/{stage * 5}</p>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
            <p className="text-[10px] text-slate-500 uppercase font-black">Streak</p>
            <p className="text-2xl font-display text-amber-500">{streak} 🔥</p>
          </div>
        </div>
      </div>

      <button onClick={onQuit} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors">
        <X size={24} />
      </button>
    </div>
  );
};

export default GamesPage;
