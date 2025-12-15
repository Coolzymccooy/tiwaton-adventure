import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { AudioService } from '../services/audio'; // TTS
import { Loader2, BrainCircuit, Trophy, Star, Music, Book, Trophy as Cup, ArrowRight, Check, X, XCircle } from 'lucide-react';

type Category = 'Bible' | 'Music' | 'Football';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  funnyComment: string;
}

const ActivitiesPage: React.FC = () => {
  const [mode, setMode] = useState<'MENU' | 'PLAYING' | 'RESULT'>('MENU');
  const [category, setCategory] = useState<Category>('Bible');
  const [level, setLevel] = useState(1);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const stats = StorageService.getGameStats();

  const getProgress = (cat: Category) => {
    return stats.quizProgress?.find(p => p.category === cat)?.level || 1;
  };

  const startQuiz = async (cat: Category) => {
    setCategory(cat);
    setLevel(getProgress(cat));
    setLoading(true);
    setMode('PLAYING');
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedOption(null);
    
    AudioService.speak(`Starting ${cat} quiz level ${getProgress(cat)}`);

    let q = await AIService.generateQuiz(cat, getProgress(cat));
    
    // Fallback Mock Data if AI fails
    if (!q || q.length === 0) {
       q = [
         {
           question: cat === 'Bible' ? "Who built the Ark?" : cat === 'Football' ? "Which shape is a football field?" : "How many strings on a standard guitar?",
           options: cat === 'Bible' ? ["Moses", "Noah", "Iron Man"] : cat === 'Football' ? ["Circle", "Rectangle", "Triangle"] : ["4", "6", "100"],
           correctIndex: 1,
           funnyComment: "Even a goldfish knew that one!"
         },
         {
           question: "Mock Question 2 for " + cat,
           options: ["A", "B", "C"],
           correctIndex: 0,
           funnyComment: "Lucky guess?"
         }
       ];
    }
    setQuestions(q);
    setLoading(false);
    
    // Speak first question
    if (q.length > 0) {
        setTimeout(() => AudioService.speak(q[0].question), 500);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    
    const isCorrect = index === questions[currentIndex].correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
      const msg = questions[currentIndex].funnyComment || "Correct!";
      setFeedback(msg);
      AudioService.playEffect('correct');
      AudioService.speak(msg);
    } else {
      setFeedback("Oh snap! Wrong one.");
      AudioService.playEffect('wrong');
      AudioService.speak("Oh snap, wrong answer.");
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setFeedback(null);
        // Speak next question
        setTimeout(() => AudioService.speak(questions[currentIndex + 1].question), 500);
      } else {
        finishQuiz(isCorrect ? score + 1 : score); 
      }
    }, 2500);
  };

  const finishQuiz = (finalScore: number) => {
    setMode('RESULT');
    const passed = finalScore >= questions.length / 2;
    AudioService.speak(passed ? "Level Complete! You did great!" : "Good try, keep practicing!");

    if (passed) {
       const currentLvl = getProgress(category);
       if (currentLvl < 10) {
         const newStats = { ...stats };
         const progIndex = newStats.quizProgress.findIndex(p => p.category === category);
         if (progIndex >= 0) {
            newStats.quizProgress[progIndex].level = currentLvl + 1;
         } else {
            newStats.quizProgress.push({ category, level: currentLvl + 1, unlocked: true });
         }
         newStats.xp += finalScore * 10;
         StorageService.saveGameStats(newStats);
       }
    }
  };

  // --- RENDERERS ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
        <h2 className="text-2xl font-display animate-pulse">Summoning the Quiz Master...</h2>
      </div>
    );
  }

  if (mode === 'RESULT') {
    const passed = score >= questions.length / 2;
    return (
      <div className="text-center py-12 bg-slate-800 rounded-3xl border-2 border-slate-600 animate-fade-in">
         <div className="text-6xl mb-4">{passed ? '🎉' : '💩'}</div>
         <h2 className="text-4xl font-display mb-2">{passed ? 'Level Complete!' : 'Try Again!'}</h2>
         <p className="text-slate-400 mb-8">You got {score} out of {questions.length} right.</p>
         
         {passed && <div className="text-amber-400 font-bold text-xl mb-6 animate-bounce">+ {score * 10} XP Earned!</div>}
         
         <button onClick={() => setMode('MENU')} title="Return to Menu" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:scale-105 transition-transform">
           Back to Arena
         </button>
      </div>
    )
  }

  if (mode === 'PLAYING') {
    const q = questions[currentIndex];
    return (
      <div className="max-w-2xl mx-auto relative">
        <button onClick={() => setMode('MENU')} title="Quit Quiz" className="absolute -top-12 right-0 flex items-center gap-2 bg-red-500/10 text-red-300 px-3 py-1 rounded-full hover:bg-red-600 hover:text-white transition-all font-bold text-sm">
           <XCircle size={16}/> Quit
        </button>

        <div className="flex justify-between items-center mb-6">
           <span className="bg-slate-700 px-3 py-1 rounded-full text-xs font-bold text-indigo-300">{category} • Level {level}</span>
           <span className="text-slate-400 font-mono">Q: {currentIndex + 1}/{questions.length}</span>
        </div>

        {/* Question Card */}
        <div className="bg-slate-800 p-8 rounded-3xl border-b-8 border-indigo-900 shadow-2xl mb-6 relative overflow-hidden">
           <h2 className="text-2xl md:text-3xl font-bold text-center leading-relaxed">{q.question}</h2>
           
           {/* Feedback Overlay */}
           {feedback && (
             <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center animate-fade-in z-10">
                <div className={`text-6xl mb-2 ${feedback.includes('Correct') ? 'text-green-500' : 'text-orange-500'}`}>
                  {feedback.includes('Correct') || feedback.includes('goldfish') ? <Check size={64} /> : <X size={64}/>}
                </div>
                <p className="text-white text-xl font-display text-center px-4">"{feedback}"</p>
             </div>
           )}
        </div>

        {/* Options */}
        <div className="grid gap-4">
           {q.options.map((opt, idx) => (
             <button
               key={idx}
               disabled={selectedOption !== null}
               onClick={() => handleAnswer(idx)}
               title={`Select ${opt}`}
               className={`p-4 rounded-xl text-left font-bold text-lg transition-all transform hover:scale-[1.02] border-2 
                 ${selectedOption === idx 
                    ? idx === q.correctIndex ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'
                    : 'bg-slate-700 border-slate-600 hover:bg-indigo-600 hover:border-indigo-400'
                 }`}
             >
               <span className="inline-block w-8 h-8 bg-black/20 rounded-full text-center mr-3">{String.fromCharCode(65 + idx)}</span>
               {opt}
             </button>
           ))}
        </div>
      </div>
    );
  }

  // MENU MODE
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-display text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
           Knowledge Arena
        </h2>
        <p className="text-slate-400 text-lg">Choose your battleground!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         {/* Bible Card */}
         <div onClick={() => startQuiz('Bible')} title="Start Bible Quiz" className="group cursor-pointer bg-slate-800 rounded-3xl p-1 border-2 border-slate-700 hover:border-amber-400 transition-all hover:-translate-y-2">
            <div className="bg-gradient-to-b from-amber-700 to-slate-900 rounded-[20px] p-6 h-full flex flex-col items-center text-center">
               <Book size={48} className="text-amber-400 mb-4 group-hover:scale-110 transition-transform"/>
               <h3 className="text-2xl font-bold text-white mb-2">Bible Quest</h3>
               <p className="text-amber-200/60 text-sm mb-4">Heroes, Miracles & Arks</p>
               <div className="mt-auto w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-amber-500 h-full rounded-full" style={{width: `${getProgress('Bible') * 10}%`}}></div>
               </div>
               <span className="text-xs font-bold mt-2 text-slate-500">Level {getProgress('Bible')}</span>
            </div>
         </div>

         {/* Music Card */}
         <div onClick={() => startQuiz('Music')} title="Start Music Quiz" className="group cursor-pointer bg-slate-800 rounded-3xl p-1 border-2 border-slate-700 hover:border-pink-400 transition-all hover:-translate-y-2">
            <div className="bg-gradient-to-b from-pink-900 to-slate-900 rounded-[20px] p-6 h-full flex flex-col items-center text-center">
               <Music size={48} className="text-pink-400 mb-4 group-hover:scale-110 transition-transform"/>
               <h3 className="text-2xl font-bold text-white mb-2">Melody Master</h3>
               <p className="text-pink-200/60 text-sm mb-4">Instruments, Songs & Beats</p>
               <div className="mt-auto w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-pink-500 h-full rounded-full" style={{width: `${getProgress('Music') * 10}%`}}></div>
               </div>
               <span className="text-xs font-bold mt-2 text-slate-500">Level {getProgress('Music')}</span>
            </div>
         </div>

         {/* Football Card */}
         <div onClick={() => startQuiz('Football')} title="Start Football Quiz" className="group cursor-pointer bg-slate-800 rounded-3xl p-1 border-2 border-slate-700 hover:border-emerald-400 transition-all hover:-translate-y-2">
            <div className="bg-gradient-to-b from-emerald-900 to-slate-900 rounded-[20px] p-6 h-full flex flex-col items-center text-center">
               <Cup size={48} className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform"/>
               <h3 className="text-2xl font-bold text-white mb-2">Football Pro</h3>
               <p className="text-emerald-200/60 text-sm mb-4">Goals, Rules & Legends</p>
               <div className="mt-auto w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{width: `${getProgress('Football') * 10}%`}}></div>
               </div>
               <span className="text-xs font-bold mt-2 text-slate-500">Level {getProgress('Football')}</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;