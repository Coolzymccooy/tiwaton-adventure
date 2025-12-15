import React, { useRef, useState, useEffect } from 'react';
import { 
  Eraser, Download, Save, Trash2, Palette, 
  Wand2, Image as ImageIcon, Music, Upload, 
  Sparkles, X, Loader2, PenTool, ScanLine, Pipette
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { AudioService } from '../services/audio'; // TTS
import type { Drawing } from '../types';


const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#ffffff', '#94a3b8', '#1e293b', '#000000'];

const LIBRARY_CATEGORIES = [
  { id: 'animals', label: 'Animals', prompt: 'a cute baby animal' },
  { id: 'space', label: 'Space', prompt: 'rockets and planets in space' },
  { id: 'fantasy', label: 'Fantasy', prompt: 'a dragon or unicorn castle' },
  { id: 'ocean', label: 'Ocean', prompt: 'fish and coral reef under water' },
  { id: 'dinos', label: 'Dinos', prompt: 'a friendly dinosaur' },
];

const DrawingPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'pencil' | 'eraser' | 'magic' | 'pipette'>('brush');
  
  const [gallery, setGallery] = useState<Drawing[]>([]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  
  // Modals & Loading
  const [showLibrary, setShowLibrary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("Sprinkling Magic Dust...");
  const [transformedImage, setTransformedImage] = useState<string | null>(null);

  // --- Initialization with Retry Mechanism ---
  
  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container || container.clientWidth === 0) {
        return false;
    }

    if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
        const savedData = canvas.toDataURL();
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (context) {
            context.lineCap = 'round';
            context.lineJoin = 'round';
            
            const img = new Image();
            img.src = savedData;
            img.onload = () => {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            if (savedData.length < 1000) { 
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
            setCtx(context);
        }
    }
    return true;
  };

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
        const success = initCanvas();
        attempts++;
        if (success || attempts > 20) clearInterval(interval);
    }, 50);

    const handleResize = () => setTimeout(initCanvas, 100);
    window.addEventListener('resize', handleResize);
    
    // Audio lazy loading moved to toggleMusic

    loadGallery();
    AudioService.speak("Welcome to the Art Studio! Let's paint something amazing.");

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // --- Handlers ---

  const selectTool = (t: 'brush' | 'pencil' | 'eraser' | 'magic' | 'pipette') => {
      setTool(t);
      if (t === 'magic') AudioService.speak("Magic Brush activated!");
      else if (t === 'eraser') AudioService.speak("Eraser ready.");
      else if (t === 'pencil') AudioService.speak("Pencil ready.");
      else if (t === 'pipette') AudioService.speak("Color picker ready. Tap a color!");
      else AudioService.speak("Paint brush ready.");
  }

  const toggleMusic = () => {
    if (!audioRef.current) {
      // Lazy load audio only when requested
      audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    
    if (isPlayingMusic) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio autoplay blocked", e));
    }
    setIsPlayingMusic(!isPlayingMusic);
  };

  const loadGallery = async () => {
    const drawings = await StorageService.getDrawings();
    setGallery(drawings);
  };

  // --- Drawing Logic ---

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const pickColor = (x: number, y: number) => {
    if (!ctx) return;
    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      // Convert to hex
      const hex = "#" + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
      setColor(hex);
      setTool('brush'); // Switch back to brush after picking
      AudioService.speak("Color picked!");
    } catch(e) {
      console.warn("Could not pick color", e);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx) return;
    const { x, y } = getPos(e);
    
    if (tool === 'pipette') {
        pickColor(x, y);
        return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx || tool === 'pipette') return;
    e.preventDefault(); 
    const { x, y } = getPos(e);
    
    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 1.5;
    } else if (tool === 'pencil') {
      // Pencil uses the same color but thinner line usually
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, brushSize / 3); // Thinner line
    } else if (tool === 'magic') {
      const hue = (Date.now() / 10) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.lineWidth = brushSize;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    
    if (tool === 'magic') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctx) ctx.closePath();
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    AudioService.speak("Canvas cleared!");
  };

  // --- Custom Cursors logic using Inline SVG ---
  const getCursorStyle = () => {
      // Encode SVGs for cursors
      const brushSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(color)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L12 22"/><path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" fill="${encodeURIComponent(color)}"/></svg>`;
      const pencilSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(color)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`;
      const eraserSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" fill="white"/></svg>`;
      const pipetteSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22l5-5 9-9c1.6-1.6 1.6-4.2 0-5.8l-3.2-3.2c-1.6-1.6-4.2-1.6-5.8 0l-9 9 5 5z"/><path d="M14 6l4 4"/></svg>`;

      if (tool === 'eraser') return `url('data:image/svg+xml;utf8,${eraserSvg}') 12 12, auto`;
      if (tool === 'pencil') return `url('data:image/svg+xml;utf8,${pencilSvg}') 0 24, crosshair`;
      if (tool === 'pipette') return `url('data:image/svg+xml;utf8,${pipetteSvg}') 0 24, crosshair`;
      if (tool === 'brush' || tool === 'magic') return `url('data:image/svg+xml;utf8,${brushSvg}') 12 24, crosshair`;
      return 'crosshair';
  };

  // --- Image Helpers & Watermarking ---

  const addWatermark = (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(imageUrl); return; }
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Watermark Config
        const text = "Tiwaton Adventure";
        const fontSize = Math.max(20, Math.floor(img.width * 0.05));
        ctx.font = `bold ${fontSize}px "Pacifico", cursive`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        const margin = fontSize;
        
        // Shadow/Outline for visibility on any background
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.strokeText(text, canvas.width - margin, canvas.height - margin);
        
        // Main Text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowBlur = 0;
        ctx.fillText(text, canvas.width - margin, canvas.height - margin);
        
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(imageUrl);
    });
  };

  const handleDownload = async (url: string) => {
      const watermarked = await addWatermark(url);
      const link = document.createElement('a');
      link.href = watermarked;
      link.download = `tiwaton-art-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      AudioService.speak("Downloading your masterpiece!");
  };

  const handleDownloadCanvas = async () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    await handleDownload(dataUrl);
  };

  const drawImageOnCanvas = (dataUrl: string) => {
    const img = new Image();
    img.src = dataUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!ctx || !canvasRef.current) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const scale = Math.min(canvasRef.current.width / img.width, canvasRef.current.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (canvasRef.current.width - w) / 2;
      const y = (canvasRef.current.height - h) / 2;
      ctx.drawImage(img, x, y, w, h);
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) drawImageOnCanvas(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateTemplate = async (prompt: string) => {
    setShowLibrary(false);
    setIsGenerating(true);
    setLoadingText("Calling the Doodling Elves...");
    AudioService.speak("I'm drawing a picture for you, please wait!");
    const imageUrl = await AIService.generateColoringPage(prompt);
    setIsGenerating(false);
    if (imageUrl) {
      drawImageOnCanvas(imageUrl);
      AudioService.speak("Here is your picture!");
    } else {
      AudioService.speak("Oops, the elves are sleeping.");
    }
  };

  const handleConvertToLineArt = async () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);
    setLoadingText("Turning photo into a drawing...");
    AudioService.speak("I'm turning your picture into a coloring page!");
    const currentImage = canvasRef.current.toDataURL('image/png');
    const result = await AIService.generateLineArt(currentImage);
    setIsGenerating(false);
    if (result) {
        drawImageOnCanvas(result);
        AudioService.speak("All done! Now you can color it.");
    } else {
        AudioService.speak("Sorry, I couldn't trace it properly.");
    }
  };

  const handleMagicTransform = async () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);
    setLoadingText("Transforming your art...");
    AudioService.speak("Transforming your art into a masterpiece!");
    const currentImage = canvasRef.current.toDataURL('image/png');
    const result = await AIService.transformSketch(currentImage);
    setIsGenerating(false);
    if (result) {
      setTransformedImage(result);
      AudioService.speak("Wow, look at that!");
    } else {
      AudioService.speak("Magic spell failed, try again.");
    }
  };

  const saveDrawing = async () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const newDrawing: Drawing = { id: Date.now().toString(), dataUrl, author: 'Little Artist', timestamp: Date.now() };
    await StorageService.saveDrawing(newDrawing);
    const stats = StorageService.getGameStats();
    stats.xp += 25;
    StorageService.saveGameStats(stats);
    alert('Art Saved! +25 XP');
    AudioService.speak("Saved! You earned 25 experience points.");
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-200px)] min-h-[450px] relative">
      
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
          <Loader2 className="w-16 h-16 text-amber-400 animate-spin mb-4" />
          <h3 className="text-2xl font-display text-white animate-pulse">{loadingText}</h3>
        </div>
      )}

      {/* Result Modal */}
      {transformedImage && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4">
          <div className="bg-slate-800 p-4 rounded-2xl max-w-4xl w-full flex flex-col gap-4 border border-amber-400/30 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display text-amber-400 flex items-center gap-2">Magic Result</h3>
              <button onClick={() => setTransformedImage(null)} className="p-2 hover:bg-slate-700 rounded-full" title="Close"><X /></button>
            </div>
            <div className="flex gap-4 overflow-auto justify-center bg-slate-900 rounded-xl p-4">
               <img src={transformedImage} className="max-h-[50vh] object-contain rounded-lg shadow-2xl" />
            </div>
            <div className="flex gap-2 justify-end">
               <button 
                 onClick={() => handleDownload(transformedImage)}
                 className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2"
                 title="Download watermarked image"
               >
                 <Download size={18} /> Download
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Library Modal */}
      {showLibrary && (
        <div className="absolute inset-0 z-40 bg-slate-900/90 flex items-center justify-center p-4 rounded-3xl">
           <div className="bg-slate-800 p-6 rounded-2xl max-w-2xl w-full border border-slate-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-display text-white">Magic Coloring Book</h3>
              <button onClick={() => setShowLibrary(false)} title="Close Library"><X /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {LIBRARY_CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => handleGenerateTemplate(cat.prompt)} 
                  className="p-4 bg-slate-700 hover:bg-indigo-600 rounded-xl transition-all flex flex-col items-center gap-2 group"
                  title={`Color a ${cat.label}`}
                >
                   <span className="text-3xl group-hover:scale-125 transition-transform">{cat.id === 'animals' ? '🦁' : cat.id === 'space' ? '🚀' : cat.id === 'fantasy' ? '🦄' : '🐠'}</span>
                   <span className="font-bold">{cat.label}</span>
                </button>
              ))}
            </div>
           </div>
        </div>
      )}

      {/* Main Interface */}
      <div className="flex flex-col lg:flex-row gap-4 h-full">
         <div className="lg:w-20 flex lg:flex-col items-center justify-between bg-slate-800 p-2 rounded-2xl border border-slate-700 gap-2 overflow-x-auto">
            <button onClick={() => selectTool('brush')} title="Brush Tool" className={`p-3 rounded-xl ${tool === 'brush' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}><Palette /></button>
            <button onClick={() => selectTool('pencil')} title="Pencil Tool" className={`p-3 rounded-xl ${tool === 'pencil' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}><PenTool /></button>
            <button onClick={() => selectTool('magic')} title="Rainbow Magic Brush" className={`p-3 rounded-xl ${tool === 'magic' ? 'bg-purple-500 text-white' : 'text-slate-400'}`}><Wand2 /></button>
            <button onClick={() => selectTool('eraser')} title="Eraser Tool" className={`p-3 rounded-xl ${tool === 'eraser' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}><Eraser /></button>
            <button onClick={() => selectTool('pipette')} title="Color Picker (Eyedropper)" className={`p-3 rounded-xl ${tool === 'pipette' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}><Pipette /></button>
            
            <div className="w-px h-8 lg:h-px lg:w-8 bg-slate-700 my-1"></div>
            
            <button onClick={() => setShowLibrary(true)} title="Open Coloring Library" className="p-3 text-slate-300 hover:bg-slate-700 rounded-xl"><ImageIcon /></button>
            <button onClick={() => fileInputRef.current?.click()} title="Upload Photo" className="p-3 text-slate-300 hover:bg-slate-700 rounded-xl"><Upload /></button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            
            <button onClick={handleConvertToLineArt} className="p-3 text-slate-300 hover:bg-slate-700 rounded-xl" title="Sketchify: Turn photo into coloring page"><ScanLine /></button>
            
            <button onClick={toggleMusic} title="Toggle Relaxing Music" className={`p-3 rounded-xl ${isPlayingMusic ? 'bg-green-500/20 text-green-400' : 'text-slate-300'}`}><Music /></button>
         </div>

         <div className="flex-1 flex flex-col gap-2 h-full">
            <div ref={containerRef} className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-slate-700 touch-none relative">
               <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ cursor: getCursorStyle() }}
                  className="absolute inset-0"
                  title="Draw here!"
               />
            </div>
            
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-4">
               <div className="flex gap-2">
                  {COLORS.map(c => (
                     <button key={c} title={`Select color ${c}`} onClick={() => { setColor(c); if(tool === 'eraser') setTool('brush'); }} className="w-6 h-6 rounded-full border border-slate-500" style={{backgroundColor: c}} />
                  ))}
               </div>
               <input type="range" title="Brush Size" min="2" max="40" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-24 accent-indigo-500" />
               <div className="flex gap-2">
                  <button onClick={handleMagicTransform} title="Turn sketch into Real Image!" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex gap-2 items-center"><Sparkles size={16}/> Real!</button>
                  <button onClick={saveDrawing} title="Save to Gallery" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><Save size={16}/></button>
                  <button onClick={handleDownloadCanvas} title="Download Drawing" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><Download size={16}/></button>
                  <button onClick={clearCanvas} title="Clear Canvas" className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-bold text-sm"><Trash2 size={16}/></button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DrawingPage;