
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Eraser, Download, Save, Trash2, Palette,
  Wand2, Image as ImageIcon, Sparkles, X, Loader2, Undo2, Redo2,
  PaintBucket, SprayCan, Highlighter, Circle as CircleIcon,
  Square, Star, Split, Stamp, FolderOpen, Edit2,
  Layers, Move, ZoomIn, ZoomOut, Hand, MousePointer2, Settings2, Grid,
  Music, Volume2, VolumeX, Play, Pause, ChevronRight, Check, Home, Trophy, RefreshCcw
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { AudioService } from '../services/audio';
import { Drawing, AppMode, View } from '../types';
import { useI18n } from '../i18n/I18nProvider';
import {
  getRandomPrompt,
  getStudioMissions,
  markPromptCompleted,
  markMissionCompleted,
  getDrawingStats,
  type DrawingTier,
  DRAWING_TIERS,
} from '../services/drawing-engine';
import {
  DRAWING_PROMPTS,
  DRAWING_CATEGORIES,
  type DrawingPrompt,
  type DrawingCategory,
} from '../data/drawing-challenges';

// --- CONFIGURATION ---
const COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef',
  '#f43f5e', '#881337', '#78350f', '#1e293b', '#94a3b8'
];

const STICKERS = ["⭐", "❤️", "🦄", "🦁", "🚀", "REX", "👑", "🌈", "🔥", "⚽", "👀", "🎈", "🦋", "🍄", "🍦", "🎸", "🍕", "🚗", "👻", "🤖", "🐱", "🐶"];

// Simple prompts now come from data/drawing-challenges.ts (120+ bilingual prompts)
// The old 10-item CHALLENGES array has been replaced by the DRAWING_PROMPTS bank.

const LIBRARY_CATEGORIES = [
  { id: 'animals', label: 'Animals', emoji: '🦁', prompt: 'a cute baby animal', type: 'ai' },
  { id: 'dinos', label: 'Dinosaurs', emoji: '🦖', prompt: 'a friendly dinosaur', type: 'ai' },
  { id: 'space', label: 'Space', emoji: '🚀', prompt: 'rockets and planets', type: 'ai' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🦄', prompt: 'a unicorn', type: 'ai' },
  { id: 'ocean', label: 'Ocean', emoji: '🐠', prompt: 'fish under water', type: 'ai' },
  { id: 'cars', label: 'Cars', emoji: '🚗', prompt: 'race car', type: 'ai' },
  { id: 'instant_mandala', label: 'Mandala', emoji: '🌸', type: 'instant', url: 'https://cdn.pixabay.com/photo/2022/03/30/15/34/mandala-7101569_960_720.png' },
  { id: 'instant_butterfly', label: 'Butterfly', emoji: '🦋', type: 'instant', url: 'https://cdn.pixabay.com/photo/2016/04/01/09/59/butterfly-1299967_960_720.png' },
  { id: 'instant_robot', label: 'Robot', emoji: '🤖', type: 'instant', url: 'https://cdn.pixabay.com/photo/2013/07/12/12/48/robot-146313_960_720.png' },
  { id: 'instant_flower', label: 'Flower', emoji: '🌻', type: 'instant', url: 'https://cdn.pixabay.com/photo/2014/04/03/10/38/flower-310952_960_720.png' }
];

const DRAWING_DRAFT_PREFIX = 'tiwaton_drawing_draft';
const DRAWING_QUEUE_PREFIX = 'tiwaton_drawing_queue';
const AUTO_SAVE_INTERVAL_MS = 20000;

const safeLocalStorage = {
  getItem: (key: string) => {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  setItem: (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  removeItem: (key: string) => {
    try { window.localStorage.removeItem(key); } catch { }
  }
};

type DrawingDraft = {
  dataUrl: string;
  title: string;
  projectId: string;
  version: number;
  updatedAt: number;
};

const MUSIC_TRACKS = [
  { id: 'calm', label: 'Calm Forest', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
  { id: 'happy', label: 'Happy Day', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3' },
  { id: 'adventure', label: 'Adventure', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3' },
  { id: 'fun', label: 'Fun Play', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_27315e9854.mp3' },
  { id: 'uplifting', label: 'Uplifting', url: 'https://cdn.pixabay.com/download/audio/2024/09/25/audio_03138382c2.mp3' },
  { id: 'piano', label: 'Soft Piano', url: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc8c63959c.mp3' },
  { id: 'ukulele', label: 'Ukulele', url: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3' },
  { id: 'jazz', label: 'Kids Jazz', url: 'https://cdn.pixabay.com/download/audio/2023/06/23/audio_732b144883.mp3' },
  { id: 'ambient', label: 'Space Ambient', url: 'https://cdn.pixabay.com/download/audio/2023/09/06/audio_243764b85c.mp3' },
  { id: 'lullaby', label: 'Lullaby', url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_145b53e7f4.mp3' }
];

type ToolType = 'brush' | 'pencil' | 'marker' | 'neon' | 'spray' | 'rainbow' | 'eraser' | 'fill' | 'rect' | 'circle' | 'star' | 'sticker' | 'watercolor' | 'pan';
type StoryBuilderStep = 'NONE' | 'HERO' | 'VILLAIN' | 'SETTING' | 'GENERATING' | 'DONE';
type ChallengeGoalKind = 'colors' | 'tools' | 'strokes' | 'sticker' | 'symmetry' | 'fill';

interface ChallengeGoal {
  kind: ChallengeGoalKind;
  label: string;
  count?: number;
}

interface StudioChallenge {
  id: string;
  title: string;
  prompt: string;
  setup: string;
  reward: string;
  difficulty: 'Rookie' | 'Brave' | 'Legend';
  timeLimitSec: number;
  goals: ChallengeGoal[];
}

interface ChallengeStats {
  colorsUsed: string[];
  toolsUsed: ToolType[];
  strokes: number;
  stickersPlaced: number;
  symmetryMoves: number;
  fillsUsed: number;
  timeLeftSec: number;
}

interface ChallengeResult {
  title: string;
  reward: string;
  stars: number;
  beatClock: boolean;
  completedGoals: number;
  totalGoals: number;
  aiMatchedPrompt?: boolean;
  aiCreativityScore?: number;
  aiMissionScore?: number;
  aiFeedback?: string;
  aiHighlights?: string[];
}

interface DrawingPageProps {
  onNavigate?: (view: View) => void;
}

// Studio challenges now come from data/drawing-challenges.ts (30 bilingual missions)
// Served via services/drawing-engine.ts with no-repeat tracking.

/** Convert a bilingual StudioMission to the local StudioChallenge format */
function missionToChallenge(m: import('../data/drawing-challenges').StudioMission, locale: 'en' | 'de'): StudioChallenge {
  return {
    id: m.id,
    title: m.title[locale],
    prompt: m.prompt[locale],
    setup: m.setup[locale],
    reward: m.reward,
    difficulty: m.difficulty,
    timeLimitSec: m.timeLimitSec,
    goals: m.goals.map(g => ({ kind: g.kind as ChallengeGoalKind, count: g.count, label: g.label[locale] })),
  };
}

const formatTimeLeft = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const secs = (totalSeconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const addUnique = <T,>(items: T[], item: T) => (
  items.includes(item) ? items : [...items, item]
);

const getGoalProgress = (goal: ChallengeGoal, stats: ChallengeStats) => {
  switch (goal.kind) {
    case 'colors': {
      const target = goal.count || 0;
      const current = stats.colorsUsed.length;
      return { current, target, done: current >= target, label: goal.label };
    }
    case 'tools': {
      const target = goal.count || 0;
      const current = stats.toolsUsed.length;
      return { current, target, done: current >= target, label: goal.label };
    }
    case 'strokes': {
      const target = goal.count || 0;
      const current = stats.strokes;
      return { current, target, done: current >= target, label: goal.label };
    }
    case 'sticker': {
      const target = goal.count || 1;
      const current = stats.stickersPlaced;
      return { current, target, done: current >= target, label: goal.label };
    }
    case 'fill': {
      const target = goal.count || 1;
      const current = stats.fillsUsed;
      return { current, target, done: current >= target, label: goal.label };
    }
    case 'symmetry': {
      const current = stats.symmetryMoves > 0 ? 1 : 0;
      return { current, target: 1, done: current >= 1, label: goal.label };
    }
  }
};

const DrawingPage: React.FC<DrawingPageProps> = ({ onNavigate }) => {
  const { t, locale } = useI18n();
  const profile = StorageService.getCurrentProfile();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });

  const [tool, setTool] = useState<ToolType>('marker');
  const [color, setColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(10);
  const [selectedSticker, setSelectedSticker] = useState<string>(STICKERS[0]);
  const [isSymmetry, setIsSymmetry] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const historyRef = useRef<string[]>([]);
  const historyStepRef = useRef(-1);
  const canvasSnapshotRef = useRef<string | null>(null);
  const draftLoadedRef = useRef(false);

  const [appMode, setAppMode] = useState<AppMode>(profile?.mode || 'KIDS');
  const [showLibrary, setShowLibrary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState(t('drawing.loadingMagicDust'));
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<Drawing[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'queued' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('Auto-saved');
  const [queuedDrawings, setQueuedDrawings] = useState<Drawing[]>([]);
  const [pendingDraft, setPendingDraft] = useState<DrawingDraft | null>(null);
  const [projectTitle, setProjectTitle] = useState('Untitled Masterpiece');
  const [projectId, setProjectId] = useState(() => `drawing-${Date.now()}`);
  const [projectVersion, setProjectVersion] = useState(1);

  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const [storyStep, setStoryStep] = useState<StoryBuilderStep>('NONE');
  const [storyAssets, setStoryAssets] = useState<string[]>([]);
  const [storyResult, setStoryResult] = useState<{ title: string, content: string } | null>(null);

  const [activeChallenge, setActiveChallenge] = useState<StudioChallenge | null>(null);
  const [challengeStats, setChallengeStats] = useState<ChallengeStats | null>(null);
  const [challengeResult, setChallengeResult] = useState<ChallengeResult | null>(null);

  const draftKey = `${DRAWING_DRAFT_PREFIX}_${profile?.id || 'guest'}`;
  const queueKey = `${DRAWING_QUEUE_PREFIX}_${profile?.id || 'guest'}`;

  useEffect(() => {
    const handleResize = () => setTimeout(initCanvas, 100);
    window.addEventListener('resize', handleResize);
    setTimeout(initCanvas, 300);
    loadGallery();
    return () => {
      window.removeEventListener('resize', handleResize);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentTrack) {
      const trackUrl = MUSIC_TRACKS.find(t => t.id === currentTrack)?.url;
      if (trackUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio(trackUrl);
          audioRef.current.loop = true;
          audioRef.current.onerror = () => { console.log("Audio load error"); setIsMusicPlaying(false); };
        } else {
          if (audioRef.current.src !== trackUrl) {
            audioRef.current.src = trackUrl;
          }
        }
        audioRef.current.volume = volume;
        if (isMusicPlaying) audioRef.current.play().catch(e => console.log("Audio play blocked"));
        else audioRef.current.pause();
      }
    } else {
      if (audioRef.current) audioRef.current.pause();
    }
  }, [currentTrack, isMusicPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const readQueuedDrawings = useCallback((): Drawing[] => {
    const raw = safeLocalStorage.getItem(queueKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed as Drawing[] : [];
    } catch {
      return [];
    }
  }, [queueKey]);

  const writeQueuedDrawings = useCallback((items: Drawing[]) => {
    safeLocalStorage.setItem(queueKey, JSON.stringify(items));
    setQueuedDrawings(items);
  }, [queueKey]);

  const queueDrawingForRetry = useCallback((drawing: Drawing) => {
    const existing = readQueuedDrawings();
    const queued = [{ ...drawing, queuedAt: Date.now() }, ...existing.filter(item => item.id !== drawing.id)].slice(0, 20);
    writeQueuedDrawings(queued);
  }, [readQueuedDrawings, writeQueuedDrawings]);

  const retryQueuedSaves = useCallback(async () => {
    const queued = readQueuedDrawings();
    if (queued.length === 0) return;

    setSaveStatus('saving');
    setSaveMessage(`Retrying ${queued.length} backed-up save${queued.length === 1 ? '' : 's'}…`);

    const stillQueued: Drawing[] = [];
    for (const drawing of queued) {
      try {
        await StorageService.saveDrawing(drawing);
      } catch (error) {
        console.error('Retry drawing save failed', error);
        stillQueued.push(drawing);
      }
    }

    writeQueuedDrawings(stillQueued);
    await loadGallery();

    if (stillQueued.length === 0) {
      setSaveStatus('saved');
      setSaveMessage('All backed-up art saved to gallery');
    } else {
      setSaveStatus('queued');
      setSaveMessage(`${stillQueued.length} local backup${stillQueued.length === 1 ? '' : 's'} waiting to retry`);
    }
  }, [readQueuedDrawings, writeQueuedDrawings]);

  const writeDraftBackup = useCallback((dataUrl: string) => {
    const draft: DrawingDraft = {
      dataUrl,
      title: projectTitle.trim() || 'Untitled Masterpiece',
      projectId,
      version: projectVersion,
      updatedAt: Date.now()
    };

    const stored = safeLocalStorage.setItem(draftKey, JSON.stringify(draft));
    if (stored) {
      setSaveStatus('saved');
      setSaveMessage(`Local draft saved ${new Date(draft.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } else {
      setSaveStatus('error');
      setSaveMessage('Device storage is full. Download or gallery-save this art now.');
    }
  }, [draftKey, projectId, projectTitle, projectVersion]);

  const readDraftBackup = useCallback((): DrawingDraft | null => {
    const raw = safeLocalStorage.getItem(draftKey);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      if (parsed?.dataUrl) return parsed as DrawingDraft;
    } catch {
      return {
        dataUrl: raw,
        title: 'Recovered Masterpiece',
        projectId: `drawing-${Date.now()}`,
        version: 1,
        updatedAt: Date.now()
      };
    }

    return null;
  }, [draftKey]);

  useEffect(() => {
    setQueuedDrawings(readQueuedDrawings());
  }, [readQueuedDrawings]);

  useEffect(() => {
    const onOnline = () => {
      retryQueuedSaves();
    };

    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [retryQueuedSaves]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (canvasSnapshotRef.current) {
        writeDraftBackup(canvasSnapshotRef.current);
      }
    }, AUTO_SAVE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [writeDraftBackup]);
  useEffect(() => {
    if (!activeChallenge || !challengeStats || challengeStats.timeLeftSec <= 0) return;
    const timer = window.setInterval(() => {
      setChallengeStats(prev => {
        if (!prev) return prev;
        return { ...prev, timeLeftSec: Math.max(0, prev.timeLeftSec - 1) };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeChallenge, challengeStats]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !bgCanvas || !tempCanvas) return;

    if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const savedData = canvasSnapshotRef.current || (historyStepRef.current >= 0 ? historyRef.current[historyStepRef.current] : null);

      [canvas, bgCanvas, tempCanvas].forEach(c => {
        c.width = w;
        c.height = h;
      });

      const bgCtx = bgCanvas.getContext('2d');
      if (bgCtx) {
        bgCtx.fillStyle = '#ffffff';
        bgCtx.fillRect(0, 0, w, h);
      }

      const ctx = canvas.getContext('2d');
      if (ctx && savedData) {
        const img = new Image();
        img.src = savedData;
        img.onload = () => ctx.drawImage(img, 0, 0);
      } else if (ctx && !savedData) {
        saveHistory();
      }
    }

    if (!draftLoadedRef.current) {
      draftLoadedRef.current = true;
      const draft = readDraftBackup();
      if (draft) setPendingDraft(draft);
    }
  }, [readDraftBackup]);

  const loadGallery = async () => {
    const g = await StorageService.getDrawings();
    setGallery(g);
  };

  const resetChallengeStats = (challenge: StudioChallenge) => {
    setChallengeStats({
      colorsUsed: [],
      toolsUsed: [],
      strokes: 0,
      stickersPlaced: 0,
      symmetryMoves: 0,
      fillsUsed: 0,
      timeLeftSec: challenge.timeLimitSec,
    });
  };

  const updateChallengeStats = (updates: Partial<ChallengeStats> & { toolUsed?: ToolType; colorUsed?: string }) => {
    if (!activeChallenge) return;
    setChallengeStats(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        colorsUsed: updates.colorUsed ? addUnique(prev.colorsUsed, updates.colorUsed) : prev.colorsUsed,
        toolsUsed: updates.toolUsed ? addUnique(prev.toolsUsed, updates.toolUsed) : prev.toolsUsed,
        strokes: prev.strokes + (updates.strokes || 0),
        stickersPlaced: prev.stickersPlaced + (updates.stickersPlaced || 0),
        symmetryMoves: prev.symmetryMoves + (updates.symmetryMoves || 0),
        fillsUsed: prev.fillsUsed + (updates.fillsUsed || 0),
      };
    });
  };

  const handleSaveToGallery = async (customDataUrl?: string, isMagic = false) => {
    if (!canvasRef.current && !customDataUrl) return;
    setSaveStatus('saving');
    let dataUrl = customDataUrl;
    if (!dataUrl && canvasRef.current) {
      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.width = canvasRef.current.width;
      combinedCanvas.height = canvasRef.current.height;
      const ctx = combinedCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
        ctx.drawImage(canvasRef.current, 0, 0);
      }
      dataUrl = combinedCanvas.toDataURL('image/png');
    }

    if (dataUrl && profile) {
      const newDrawing: Drawing = {
        id: Date.now().toString(),
        dataUrl,
        author: profile.name,
        title: projectTitle.trim() || 'Untitled Masterpiece',
        projectId,
        version: projectVersion,
        timestamp: Date.now(),
        isMagic
      };
      try {
        await StorageService.saveDrawing(newDrawing);
        safeLocalStorage.removeItem(draftKey);
        await loadGallery();
        setSaveStatus('saved');
        setSaveMessage(`Saved ${newDrawing.title} v${newDrawing.version} to gallery`);
        setProjectVersion(prev => prev + 1);
        AudioService.speak("Saved to gallery!");
        if (!isMagic && !activeChallenge) setShowGallery(true);
      } catch (error) {
        console.error('Drawing save failed', error);
        queueDrawingForRetry(newDrawing);
        setSaveStatus('queued');
        setSaveMessage('Gallery save failed. Local backup queued for retry.');
        AudioService.speak("I saved a local backup. Please try gallery save again.");
      }
    }
  };

  const startChallengeMode = () => {
    const missions = getStudioMissions(); // shuffled, no-repeat
    const mission = missions[0];
    if (!mission) return;
    const challenge = missionToChallenge(mission, locale as 'en' | 'de');
    setChallengeResult(null);
    setActiveChallenge(challenge);
    resetChallengeStats(challenge);
    setTool('marker');
    setBrushSize(10);
    setIsSymmetry(false);
    setTransform({ x: 0, y: 0, scale: 1 });
    setShowGallery(false);
    setShowLibrary(false);
    setStoryStep('NONE');
    setTransformedImage(null);
    AudioService.speak(`Challenge accepted. ${challenge.title}. ${challenge.prompt}`);
    handleClearCanvas(false);
  };

  const finishChallenge = async () => {
    if (!activeChallenge || !challengeStats) return;

    const totalMoves = challengeStats.strokes + challengeStats.stickersPlaced + challengeStats.fillsUsed;
    if (totalMoves === 0) {
      AudioService.speak("Add a few marks before you score this challenge.");
      return;
    }

    const completedGoals = activeChallenge.goals.filter(goal => getGoalProgress(goal, challengeStats).done).length;
    const beatClock = challengeStats.timeLeftSec > 0;
    const clearedChallenge = completedGoals === activeChallenge.goals.length;
    let aiJudgement: Awaited<ReturnType<typeof AIService.judgeChallengeDrawing>> = null;

    if (canvasRef.current) {
      setIsGenerating(true);
      setLoadingText('AI judge is reviewing your mission...');
      aiJudgement = await AIService.judgeChallengeDrawing(canvasRef.current.toDataURL('image/png'), {
        title: activeChallenge.title,
        prompt: activeChallenge.prompt,
        setup: activeChallenge.setup,
        goals: activeChallenge.goals.map(goal => goal.label),
      });
      setIsGenerating(false);
    }

    let stars = clearedChallenge ? (beatClock ? 3 : 2) : 1;
    if (aiJudgement?.matchedPrompt && aiJudgement.creativityScore >= 7 && stars < 3) {
      stars += 1;
    }
    if (aiJudgement && !aiJudgement.matchedPrompt && stars > 1) {
      stars -= 1;
    }

    if (clearedChallenge && (aiJudgement?.matchedPrompt ?? true)) {
      AudioService.playEffect('achievement');
      AudioService.speak(beatClock ? "Brilliant. You beat the clock." : "Challenge cleared. Strong finish.");
    } else if (aiJudgement && !aiJudgement.matchedPrompt) {
      AudioService.playEffect('click');
      AudioService.speak("Strong effort. The AI wants a closer match to the mission.");
    } else {
      AudioService.playEffect('click');
      AudioService.speak("Nice try. You earned a practice star and saved your work.");
    }

    setChallengeResult({
      title: activeChallenge.title,
      reward: clearedChallenge && (aiJudgement?.matchedPrompt ?? true) ? activeChallenge.reward : 'Practice Star',
      stars,
      beatClock,
      completedGoals,
      totalGoals: activeChallenge.goals.length,
      aiMatchedPrompt: aiJudgement?.matchedPrompt,
      aiCreativityScore: aiJudgement?.creativityScore,
      aiMissionScore: aiJudgement?.missionScore,
      aiFeedback: aiJudgement?.feedback,
      aiHighlights: aiJudgement?.highlights || [],
    });
    await handleSaveToGallery(undefined, false); // Auto-save their challenge masterpiece
    if (activeChallenge) markMissionCompleted(activeChallenge.id);
    setActiveChallenge(null);
    setChallengeStats(null);
  };

  const handleClearCanvas = (wipeHistory = true, resetCurrentChallenge = false) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (wipeHistory) saveHistory();
      if (resetCurrentChallenge && activeChallenge) resetChallengeStats(activeChallenge);
    }
  };

  const closeStoryModal = () => {
    setStoryResult(null);
    setStoryStep('NONE');
  };

  const downloadStoryTxt = (title: string, content: string) => {
    const safeTitle = (title || "story").replace(/[^\w\- ]+/g, "").trim() || "story";
    const text = `${title}\n\n${content}\n`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const saveStoryToLibrary = async (title: string, content: string) => {
    await StorageService.addStory({
      id: crypto.randomUUID(),
      title,
      content,
      isUserCreated: true,
    });
  };

  useEffect(() => {
    if (!storyResult) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeStoryModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [storyResult]);


  const restoreCanvasImage = (dataUrl: string, pushToHistory = true) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasSnapshotRef.current = canvasRef.current.toDataURL('image/png');
        if (pushToHistory) saveHistory();
      }
    };
  };

  const restoreDraft = (draft: DrawingDraft) => {
    setProjectTitle(draft.title || 'Recovered Masterpiece');
    setProjectId(draft.projectId || `drawing-${Date.now()}`);
    setProjectVersion(draft.version || 1);
    restoreCanvasImage(draft.dataUrl, true);
    setSaveStatus('saved');
    setSaveMessage(`Restored local draft from ${new Date(draft.updatedAt).toLocaleString()}`);
    setPendingDraft(null);
  };

  const discardDraft = () => {
    safeLocalStorage.removeItem(draftKey);
    setPendingDraft(null);
    setSaveStatus('idle');
    setSaveMessage('Draft discarded');
  };

  const handleLoadFromGallery = (drawing: Drawing) => {
    setProjectTitle(drawing.title || 'Edited Masterpiece');
    setProjectId(drawing.projectId || `drawing-${Date.now()}`);
    setProjectVersion((drawing.version || 1) + 1);
    restoreCanvasImage(drawing.dataUrl);
    AudioService.speak("Ready to edit!");
    setShowGallery(false);
  };

  const handleDownload = (urlToDownload?: string) => {
    const targetUrl = urlToDownload || canvasRef.current?.toDataURL('image/png');
    if (!targetUrl) return;
    AudioService.speak("Downloading!");
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = `tiwaton-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTemplateSelection = async (item: any) => {
    setShowLibrary(false);
    if (item.type === 'instant' && item.url) {
      setIsGenerating(true);
      setLoadingText(t('drawing.loadingTemplate'));
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = item.url;
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          saveHistory();
          AudioService.speak("Ready!");
        }
        setIsGenerating(false);
      };
      img.onerror = () => {
        setIsGenerating(false);
        alert("Could not load image. Try another.");
      }
    } else {
      setIsGenerating(true);
      setLoadingText(t('drawing.loadingDrawing'));
      AudioService.speak("I'm drawing it now!");
      const imageUrl = await AIService.generateColoringPage(item.prompt);
      setIsGenerating(false);
      if (imageUrl && canvasRef.current) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            saveHistory();
          }
        };
      } else {
        AudioService.speak("Oops, magic failed.");
      }
    }
  };

  const handleMagicTransform = async () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);
    setLoadingText(t('drawing.loadingTransform'));
    AudioService.speak("Adding magic!");
    const currentImage = canvasRef.current.toDataURL('image/png');
    const result = await AIService.transformSketch(currentImage);
    setIsGenerating(false);
    if (result) {
      setTransformedImage(result);
      AudioService.speak("Wow! Saved to your gallery.");
      await handleSaveToGallery(result, true);
    } else {
      AudioService.speak("Magic spell failed.");
    }
  };

  const handleAutoFix = async () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);
    setLoadingText(t('drawing.loadingClean'));
    const current = canvasRef.current.toDataURL();
    const cleaned = await AIService.cleanupDrawing(current);
    setIsGenerating(false);
    if (cleaned) {
      const img = new Image();
      img.src = cleaned;
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
          saveHistory();
        }
      }
      AudioService.speak("All clean.");
    }
  };

  const startStoryMode = () => {
    setStoryStep('HERO');
    setStoryAssets([]);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    saveHistory();
    AudioService.speak("Story Mode! Draw the Hero.");
  };

  const advanceStory = async () => {
    if (!canvasRef.current) return;
    const data = canvasRef.current.toDataURL('image/png');
    const newAssets = [...storyAssets, data];
    setStoryAssets(newAssets);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveHistory();
    if (storyStep === 'HERO') {
      setStoryStep('VILLAIN');
      AudioService.speak("Now draw the Villain.");
    } else if (storyStep === 'VILLAIN') {
      setStoryStep('SETTING');
      AudioService.speak("Now draw the Setting.");
    } else if (storyStep === 'SETTING') {
      setStoryStep('GENERATING');
      setLoadingText(t('drawing.loadingDrawing'));
      setIsGenerating(true);
      const story = await AIService.generateStoryFromAssets(newAssets);
      setIsGenerating(false);
      if (story) {
        setStoryResult({ title: story.title, content: story.content });
        setStoryStep('DONE');
        AudioService.speak("Story ready!");
      } else {
        setStoryStep('NONE');
        AudioService.speak("Oops, magic failed.");
      }
    }
  };

  const toCanvasSpace = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const cRect = container.getBoundingClientRect();
    const mouseX = clientX - cRect.left;
    const mouseY = clientY - cRect.top;
    return {
      x: (mouseX - transform.x) / transform.scale,
      y: (mouseY - transform.y) / transform.scale
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

    if (tool === 'pan' || (e as React.MouseEvent).button === 1) {
      setIsPanning(true);
      setLastPan({ x: clientX, y: clientY });
      return;
    }
    const { x, y } = toCanvasSpace(clientX, clientY);
    setStartPos({ x, y });
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    if (tool === 'fill') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      updateChallengeStats({ toolUsed: 'fill', colorUsed: color, strokes: 1, fillsUsed: 1 });
      saveHistory();
      AudioService.playEffect('click');
      setIsDrawing(false);
      return;
    }
    if (tool === 'sticker') {
      ctx.font = `${brushSize * 3}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedSticker, x, y);
      AudioService.playEffect('click');
      if (isSymmetry) ctx.fillText(selectedSticker, canvasRef.current.width - x, y);
      updateChallengeStats({
        toolUsed: 'sticker',
        colorUsed: color,
        strokes: 1,
        stickersPlaced: 1,
        symmetryMoves: isSymmetry ? 1 : 0
      });
      saveHistory();
      setIsDrawing(false);
      return;
    }
    updateChallengeStats({
      toolUsed: tool,
      colorUsed: tool === 'eraser' ? undefined : color,
      symmetryMoves: isSymmetry ? 1 : 0
    });
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    if (tool === 'pencil') ctx.lineWidth = Math.max(1, brushSize / 4);
    else if (tool === 'neon') {
      ctx.lineWidth = brushSize;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
    }
    else if (tool === 'watercolor') {
      ctx.lineWidth = brushSize * 1.5;
      ctx.globalAlpha = 0.3;
    }
    else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
    }
    else ctx.lineWidth = brushSize;
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

    if (isPanning) {
      const dx = clientX - lastPan.x;
      const dy = clientY - lastPan.y;
      setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
      setLastPan({ x: clientX, y: clientY });
      return;
    }
    if (!isDrawing) return;
    const { x, y } = toCanvasSpace(clientX, clientY);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    if (['rect', 'circle', 'star'].includes(tool) && startPos) {
      const tempCtx = tempCanvasRef.current?.getContext('2d');
      if (tempCtx) {
        tempCtx.clearRect(0, 0, tempCanvasRef.current!.width, tempCanvasRef.current!.height);
        tempCtx.strokeStyle = color;
        tempCtx.lineWidth = 2;
        const w = x - startPos.x;
        const h = y - startPos.y;
        tempCtx.beginPath();
        if (tool === 'rect') tempCtx.rect(startPos.x, startPos.y, w, h);
        else if (tool === 'circle') tempCtx.ellipse(startPos.x + w / 2, startPos.y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, 2 * Math.PI);
        tempCtx.stroke();
      }
      return;
    }
    if (tool === 'rainbow') {
      const hue = (Date.now() / 5) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    if (isSymmetry) {
      const width = canvasRef.current.width;
      ctx.fillRect(width - x, y, brushSize, brushSize);
    }
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    if (!isDrawing) return;
    setIsDrawing(false);
    if (['rect', 'circle', 'star'].includes(tool) && startPos && canvasRef.current) {
      const tempCtx = tempCanvasRef.current?.getContext('2d');
      if (tempCtx) tempCtx.clearRect(0, 0, tempCanvasRef.current!.width, tempCanvasRef.current!.height);
    }
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.closePath();
    updateChallengeStats({ strokes: 1 });
    saveHistory();
  };

  const saveHistory = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    canvasSnapshotRef.current = dataUrl;
    writeDraftBackup(dataUrl);

    const newHistory = historyRef.current.slice(0, historyStepRef.current + 1);
    newHistory.push(dataUrl);
    if (newHistory.length > 20) newHistory.shift();

    historyRef.current = newHistory;
    historyStepRef.current = newHistory.length - 1;
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStepRef.current > 0) {
      const prev = historyStepRef.current - 1;
      const img = new Image();
      img.src = historyRef.current[prev];
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
          canvasSnapshotRef.current = canvasRef.current.toDataURL('image/png');
          writeDraftBackup(canvasSnapshotRef.current);
          historyStepRef.current = prev;
          setHistoryStep(prev);
        }
      };
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col relative select-none overflow-hidden bg-slate-100">

      {isGenerating && (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
          <Loader2 className="w-16 h-16 text-amber-400 animate-spin mb-4" />
          <h3 className="text-2xl font-display text-white animate-pulse">{loadingText}</h3>
        </div>
      )}

      {transformedImage && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4">
          <div className="bg-slate-800 p-4 rounded-2xl max-w-4xl w-full flex flex-col gap-4 border border-amber-400/30 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display text-amber-400">Magic Result</h3>
              <button onClick={() => setTransformedImage(null)} title="Close" className="p-2 hover:bg-slate-700 rounded-full text-white"><X /></button>
            </div>
            <img src={transformedImage} className="max-h-[60vh] object-contain rounded-lg shadow-2xl bg-black" />
            <div className="flex justify-end gap-2">
              <button onClick={() => handleDownload(transformedImage)} title="Save Image" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2">
                <Download size={18} /> Download
              </button>
            </div>
            <p className="text-slate-400 text-sm text-center">Automatically saved to Parent Gallery.</p>
          </div>
        </div>
      )}

      {pendingDraft && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-400/40 rounded-2xl p-5 max-w-md w-full shadow-2xl text-white">
            <h3 className="text-xl font-display text-amber-300 mb-2">Restore unsaved art?</h3>
            <p className="text-sm text-slate-300 mb-4">
              I found a local backup for <span className="font-bold text-white">{pendingDraft.title}</span> from {new Date(pendingDraft.updatedAt).toLocaleString()}.
            </p>
            <img src={pendingDraft.dataUrl} className="w-full h-40 object-contain bg-white rounded-xl mb-4" />
            <div className="flex gap-2 justify-end">
              <button onClick={discardDraft} className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm font-bold">Discard</button>
              <button onClick={() => restoreDraft(pendingDraft)} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-black">Restore</button>
            </div>
          </div>
        </div>
      )}

      {storyResult && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-900/80 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            // close only when clicking the dark backdrop
            if (e.target === e.currentTarget) closeStoryModal();
          }}
        >
          <div className="max-w-2xl w-full bg-white rounded-2xl p-6 relative shadow-2xl max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-2xl text-indigo-600 pr-10">
                {storyResult.title}
              </h2>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeStoryModal();
                }}
                className="shrink-0 inline-flex items-center justify-center rounded-full w-8 h-8 bg-slate-100 hover:bg-slate-200"
                aria-label="Close story"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-2 mb-3 justify-center">
              {storyAssets.map((s, i) => (
                <img
                  key={i}
                  src={s}
                  className="w-16 h-16 border rounded object-contain bg-slate-50"
                  alt={`Story asset ${i + 1}`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="overflow-auto max-h-[50vh] rounded-xl border p-3">
              <p className="whitespace-pre-wrap text-sm sm:text-base font-sans text-slate-800 leading-relaxed">
                {storyResult.content}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={async () => {
                  await saveStoryToLibrary(storyResult.title, storyResult.content);
                  AudioService.speak(t('drawing.storySaved'));
                }}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-slate-900 text-white hover:bg-slate-800"
              >
                <Save className="w-4 h-4" /> {t('drawing.saveLabel')}
              </button>

              <button
                type="button"
                onClick={() => downloadStoryTxt(storyResult.title, storyResult.content)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Download className="w-4 h-4" /> {t('drawing.downloadLabel')}
              </button>

              <button
                type="button"
                onClick={closeStoryModal}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-slate-100 hover:bg-slate-200"
              >
                {t('drawing.closeLabel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {challengeResult && (
        <div className="absolute inset-0 z-50 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-amber-400/30 bg-slate-900 text-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-3">{'★'.repeat(challengeResult.stars)}{'☆'.repeat(3 - challengeResult.stars)}</div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-amber-300 font-black">Challenge Result</p>
              <h3 className="mt-2 text-3xl font-display text-white">{challengeResult.title}</h3>
              <p className="mt-3 text-amber-200 font-bold">{challengeResult.reward}</p>
              <p className="mt-2 text-sm text-slate-300">
                Goals cleared: {challengeResult.completedGoals}/{challengeResult.totalGoals}
                {challengeResult.beatClock ? ' | Clock bonus earned' : ''}
              </p>
            </div>
            {challengeResult.aiFeedback && (
              <div className="mt-5 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
                <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300">
                  <span>AI Judge</span>
                  <span>
                    Mission {challengeResult.aiMissionScore}/10 | Creative {challengeResult.aiCreativityScore}/10
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-100">{challengeResult.aiFeedback}</p>
                {challengeResult.aiHighlights && challengeResult.aiHighlights.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {challengeResult.aiHighlights.map((highlight) => (
                      <span key={highlight} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-200 border border-white/10">
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!challengeResult.aiFeedback && (
              <p className="mt-5 text-center text-xs text-slate-400">AI judging was unavailable, so this score used the mission goals and timer only.</p>
            )}
            <div className="mt-6 flex gap-2 justify-center">
              <button
                onClick={startChallengeMode}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-slate-950 font-black hover:brightness-110"
              >
                <RefreshCcw size={16} /> Another
              </button>
              <button
                onClick={() => setChallengeResult(null)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2 text-white font-bold hover:bg-slate-600"
              >
                <Check size={16} /> Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* CHALLENGE BANNER OVERLAY */}
      {activeChallenge && challengeStats && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-[min(92vw,36rem)] rounded-3xl border-2 border-amber-400 bg-slate-900/95 text-white p-4 shadow-2xl animate-slide-in-top">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">
                <Trophy size={12} />
                <span>{activeChallenge.difficulty} Challenge</span>
              </div>
              <h3 className="mt-1 text-2xl font-display text-white">{activeChallenge.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{activeChallenge.prompt}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-indigo-300">{activeChallenge.setup}</p>
            </div>
            <div className={`shrink-0 rounded-2xl px-3 py-2 text-center font-black ${challengeStats.timeLeftSec > 30 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
              <div className="text-[9px] uppercase tracking-[0.25em]">Clock</div>
              <div className="text-lg">{formatTimeLeft(challengeStats.timeLeftSec)}</div>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {activeChallenge.goals.map(goal => {
              const progress = getGoalProgress(goal, challengeStats);
              return (
                <div
                  key={goal.label}
                  className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-sm ${progress.done ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-slate-800/80 text-slate-300'}`}
                >
                  <span>{progress.label}</span>
                  <span className="font-mono text-xs">{progress.current}/{progress.target}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span>Colors {challengeStats.colorsUsed.length}</span>
            <span>Tools {challengeStats.toolsUsed.length}</span>
            <span>Moves {challengeStats.strokes}</span>
            <span>Stickers {challengeStats.stickersPlaced}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={finishChallenge} title="Score this challenge" className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2 shadow-lg">
              <Check size={18} /> Score It
            </button>
            <button onClick={startChallengeMode} title="Try a new challenge" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2 shadow-lg">
              <RefreshCcw size={18} /> Reroll
            </button>
            <button onClick={() => { setActiveChallenge(null); setChallengeStats(null); }} title="End challenge" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-bold transition-all hover:scale-105">
              End
            </button>
          </div>
        </div>
      )}

      {showLibrary && (
        <div className="absolute inset-0 z-40 bg-slate-900/95 flex items-center justify-center p-4 rounded-3xl animate-fade-in">
          <div className="bg-slate-800 p-5 rounded-2xl max-w-3xl w-full border border-slate-700 shadow-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-display text-white">{t('drawing.templateHeader')}</h3>
              <button onClick={() => setShowLibrary(false)} className="text-white"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {LIBRARY_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleTemplateSelection(cat)}
                  data-tooltip={`Draw a ${cat.label}`}
                  className={`p-3 rounded-xl transition-all flex flex-col items-center gap-2 group border hover:border-indigo-400 ${cat.type === 'instant' ? 'bg-indigo-900/50 border-indigo-500' : 'bg-slate-700 border-slate-600'}`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                  <span className="text-sm font-bold text-white">{cat.label}</span>
                  {cat.type === 'instant' && <span className="text-[9px] bg-green-500 text-white px-2 rounded-full">INSTANT</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {storyStep !== 'NONE' && storyStep !== 'DONE' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-4 animate-bounce-in border-2 border-white">
          <span className="font-bold text-lg">
            {storyStep === 'HERO' ? t('drawing.storyStepHero') : storyStep === 'VILLAIN' ? t('drawing.storyStepVillain') : t('drawing.storyStepSetting')}
          </span>
          <button onClick={advanceStory} title={t('drawing.storyNextButton')} className="bg-white text-indigo-600 px-4 py-1 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-1">
            {t('drawing.storyNextButton')} <ChevronRight size={16} />
          </button>
        </div>
      )}

      <div className="flex-1 relative bg-slate-200 overflow-hidden cursor-crosshair touch-none" ref={containerRef}>
        <div
          className="absolute origin-top-left"
          style={{
            width: '100%',
            height: '100%',
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
          }}
        >
          <canvas ref={bgCanvasRef} className="absolute inset-0 pointer-events-none" />
          {showGrid && <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 touch-none"
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />
          <canvas ref={tempCanvasRef} className="absolute inset-0 pointer-events-none" />
        </div>

        <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate && onNavigate(View.HOME)}
              data-tooltip="Return to Hub"
              data-tooltip-pos="bottom"
              className="bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold border border-slate-600 shadow-lg flex items-center gap-2 hover:bg-slate-700"
            >
              <Home size={14} /> Exit
            </button>
            <button
              onClick={() => setAppMode(appMode === 'KIDS' ? 'STUDIO' : 'KIDS')}
              data-tooltip="Switch Studio Difficulty"
              data-tooltip-pos="bottom"
              className="bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold border border-slate-600 shadow-lg flex items-center gap-2"
            >
              <Settings2 size={14} /> {appMode} MODE
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMusicMenu(!showMusicMenu)}
                data-tooltip="Ambient Music Player"
                data-tooltip-pos="bottom"
                className={`px-3 py-2 rounded-lg border shadow-lg flex items-center gap-2 ${isMusicPlaying ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-800 text-slate-300 border-slate-600'}`}
              >
                {isMusicPlaying ? <Volume2 size={16} className="animate-pulse" /> : <VolumeX size={16} />}
              </button>
              {showMusicMenu && (
                <div className="absolute top-full left-0 mt-2 bg-slate-900 border border-slate-700 p-2 rounded-xl w-48 shadow-xl flex flex-col gap-1">
                  <div className="text-xs font-bold text-slate-500 px-2 py-1">SOUNDTRACKS</div>
                  {MUSIC_TRACKS.map(track => (
                    <button
                      key={track.id}
                      onClick={() => {
                        if (currentTrack === track.id && isMusicPlaying) {
                          setIsMusicPlaying(false);
                        } else {
                          setCurrentTrack(track.id);
                          setIsMusicPlaying(true);
                        }
                      }}
                      className={`text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center ${currentTrack === track.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      {track.label}
                      {currentTrack === track.id && isMusicPlaying && <Music size={12} className="animate-bounce" />}
                    </button>
                  ))}
                  <div className="h-px bg-slate-700 my-1"></div>
                  <div className="px-2 py-1 flex items-center gap-2">
                    <Volume2 size={12} className="text-slate-400" />
                    <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full accent-indigo-500 h-1" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-30 flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            onBlur={() => {
              if (canvasSnapshotRef.current) writeDraftBackup(canvasSnapshotRef.current);
            }}
            className="w-52 max-w-[55vw] bg-slate-900/90 text-white border border-slate-600 rounded-xl px-3 py-2 text-xs font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Drawing project name"
          />
          {queuedDrawings.length > 0 && (
            <button
              onClick={retryQueuedSaves}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-black shadow-lg"
            >
              Retry {queuedDrawings.length} save{queuedDrawings.length === 1 ? '' : 's'}
            </button>
          )}
        </div>

        {appMode === 'STUDIO' && (
          <div className="absolute bottom-24 right-4 z-30 flex flex-col gap-2 bg-slate-800 p-2 rounded-xl border border-slate-600 shadow-xl">
            <button onClick={() => setTransform(t => ({ ...t, scale: Math.min(5, t.scale + 0.2) }))} data-tooltip="Zoom In" className="p-2 text-white hover:bg-slate-700 rounded"><ZoomIn size={20} /></button>
            <button onClick={() => setTransform(t => ({ ...t, scale: Math.max(0.5, t.scale - 0.2) }))} data-tooltip="Zoom Out" className="p-2 text-white hover:bg-slate-700 rounded"><ZoomOut size={20} /></button>
            <button onClick={() => setTool('pan')} data-tooltip="Pan Canvas" className={`p-2 rounded ${tool === 'pan' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}><Hand size={20} /></button>
            <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })} data-tooltip="Reset Viewport" className="p-2 text-white hover:bg-slate-700 rounded text-xs font-bold">100%</button>
            <button onClick={() => setShowGrid(!showGrid)} data-tooltip="Toggle Guides" className={`p-2 rounded ${showGrid ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}><Grid size={20} /></button>
          </div>
        )}
      </div>

      <div className="bg-slate-800 border-t border-slate-700 p-2 flex flex-col gap-2 shrink-0 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">

        {/* UPPER TOOLBAR (Actions) */}
        <div className="flex justify-between items-center px-1 overflow-x-auto gap-2">
          {/* Main Drawing Actions */}
          <div className="flex gap-1 shrink-0 bg-slate-700/50 p-1 rounded-xl">
            <button onClick={undo} data-tooltip="Undo Last Stroke" className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"><Undo2 size={18} /></button>
            <button onClick={() => { }} data-tooltip="Redo Action" className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"><Redo2 size={18} /></button>
            <div className="w-px bg-slate-600 mx-1"></div>
            <button onClick={() => handleClearCanvas(true, Boolean(activeChallenge))} data-tooltip="Clear Canvas" className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"><Trash2 size={18} /></button>
            <button onClick={() => setIsSymmetry(!isSymmetry)} data-tooltip="Mirror Symmetry" className={`p-2 rounded-lg ${isSymmetry ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}><Split size={18} /></button>
          </div>

          {/* AI and Creative Actions */}
          <div className="flex gap-2 shrink-0">
            {/* CHALLENGE BUTTON */}
            <button
              onClick={startChallengeMode}
              data-tooltip={activeChallenge ? "Start a fresh challenge" : "Start a real art mission"}
              className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-black shadow-lg hover:brightness-110"
            >
              <Trophy size={14} className="animate-pulse" /> {activeChallenge ? 'New Challenge' : 'Challenge!'}
            </button>
            <button onClick={() => setShowLibrary(true)} data-tooltip="Open Coloring Library" className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-600">
              <ImageIcon size={14} /> {t('drawing.templatesLabel')}
            </button>
            <button onClick={startStoryMode} data-tooltip={t('drawing.storyModeHint')} className="flex items-center gap-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow hover:brightness-110 hidden sm:flex">
              <Layers size={14} /> {t('drawing.storyModeLabel')}
            </button>
            <button onClick={handleAutoFix} data-tooltip="AI Line Cleanup" className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow">
              <Wand2 size={14} /> Fix
            </button>
            <button onClick={handleMagicTransform} data-tooltip="3D Magic Realism" className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow hover:brightness-110 hidden sm:flex">
              <Sparkles size={14} /> Real!
            </button>
          </div>

          {/* Save/Gallery */}
          <div className="flex items-center gap-2 shrink-0 bg-slate-700/30 p-1 rounded-xl">
            <span
              title={saveMessage}
              className={`hidden sm:inline text-[10px] font-bold px-2 ${saveStatus === 'error' ? 'text-red-300' : saveStatus === 'queued' ? 'text-amber-300' : saveStatus === 'saving' ? 'text-amber-300' : 'text-emerald-300'}`}
            >
              {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'queued' ? `${queuedDrawings.length} queued` : saveStatus === 'error' ? 'Storage warning' : 'Auto-saved'}
            </span>
            <button onClick={() => handleSaveToGallery()} data-tooltip="Save Masterpiece" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"><Save size={18} /></button>
            <button onClick={() => handleDownload()} data-tooltip="Save to Device" className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg"><Download size={18} /></button>
            <button onClick={() => setShowGallery(true)} data-tooltip="View Gallery" className="p-2 bg-slate-700 hover:bg-slate-600 text-amber-400 rounded-lg"><FolderOpen size={18} /></button>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex gap-1 shrink-0 pl-1">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                data-tooltip={`Switch to ${c}`}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${color === c ? 'border-white scale-110 ring-2 ring-indigo-500 ring-offset-1 ring-offset-slate-800' : 'border-slate-600 hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-slate-600 ml-1" data-tooltip="Custom Color Picker">
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="absolute inset-0 w-full h-full p-0 border-0 opacity-0 cursor-pointer" title="Custom Color" />
              <div className="w-full h-full" style={{ backgroundColor: color }}></div>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-700 shrink-0"></div>

          <div className="flex gap-1 shrink-0">
            <ToolBtn active={tool === 'marker'} onClick={() => setTool('marker')} icon={<Palette size={18} />} tooltip="Magic Marker" />
            <ToolBtn active={tool === 'pencil'} onClick={() => setTool('pencil')} icon={<Edit2 size={18} />} tooltip="Sketch Pencil" />
            <ToolBtn active={tool === 'fill'} onClick={() => setTool('fill')} icon={<PaintBucket size={18} />} tooltip="Fill Nebula" />
            <ToolBtn active={tool === 'spray'} onClick={() => setTool('spray')} icon={<SprayCan size={18} />} tooltip="Spray Dust" />
            <ToolBtn active={tool === 'eraser'} onClick={() => setTool('eraser')} icon={<Eraser size={18} />} tooltip="Black Hole Eraser" />
            <ToolBtn active={tool === 'sticker'} onClick={() => setTool('sticker')} icon={<Stamp size={18} />} tooltip="Place Sticker" />
          </div>

          <div className="w-24 shrink-0 px-2" data-tooltip="Adjust Brush Size">
            <input type="range" min="2" max="50" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} className="w-full accent-indigo-500 h-1.5 bg-slate-600 rounded-lg cursor-pointer" title="Brush Size" />
          </div>
        </div>

        {tool === 'sticker' && (
          <div className="flex gap-2 overflow-x-auto pb-1 px-1 border-t border-slate-700 pt-2 animate-fade-in">
            {STICKERS.map(s => (
              <button key={s} onClick={() => setSelectedSticker(s)} className={`text-2xl p-2 rounded-xl transition-all hover:bg-slate-700 ${selectedSticker === s ? 'bg-slate-700 scale-110 shadow-inner' : ''}`} data-tooltip={`Pick ${s}`}>{s}</button>
            ))}
          </div>
        )}
      </div>

      {showGallery && (
        <div className="absolute top-0 right-0 bottom-0 z-50 w-72 bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col p-4 animate-slide-in-right">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2"><FolderOpen size={18} className="text-amber-400" /> My Art</h3>
            <button onClick={() => setShowGallery(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
            {gallery.length === 0 && <p className="text-slate-500 text-center text-sm py-10">{t('drawing.galleryEmpty')}</p>}
            {gallery.map(img => (
              <div key={img.id} className="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-colors">
                <img src={img.dataUrl} className="w-full h-40 object-contain bg-white" />
                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleLoadFromGallery(img)} data-tooltip="Load in Studio" className="p-2 bg-indigo-600 rounded-full text-white hover:scale-110 transition-transform"><Edit2 size={16} /></button>
                  <button onClick={() => handleDownload(img.dataUrl)} data-tooltip="Download High-Res" className="p-2 bg-green-600 rounded-full text-white hover:scale-110 transition-transform"><Download size={16} /></button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-[10px] text-slate-300 font-mono flex justify-between">
                    <span>{img.title || new Date(img.timestamp).toLocaleDateString()} {img.version ? `v${img.version}` : ''}</span>
                    {img.isMagic && <Sparkles size={10} className="text-amber-400" />}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ToolBtn = ({ active, onClick, icon, tooltip }: any) => (
  <button
    onClick={onClick}
    data-tooltip={tooltip}
    className={`p-2.5 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
  >
    {icon}
  </button>
)

export default DrawingPage;
