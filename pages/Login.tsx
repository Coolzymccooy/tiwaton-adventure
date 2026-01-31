
import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { FamilyProfile } from '../types';
import { 
  ShieldCheck, Plus, ArrowRight, Smile, KeyRound, 
  AlertTriangle, ChevronLeft, LogIn, HelpCircle, User, Lock
} from 'lucide-react';

interface LoginProps {
    onLogin: (profile: FamilyProfile) => void;
    onBackToLanding?: () => void;
    initialViewMode?: ViewMode;
}

export type ViewMode = 'SETUP_ADMIN' | 'RECOVERY_INFO' | 'SETUP_CHILD' | 'USER_GRID' | 'VERIFY_ACCOUNT' | 'FORGOT_FLOW' | 'SIGN_IN_ENTRY';

const Login: React.FC<LoginProps> = ({ onLogin, onBackToLanding, initialViewMode }) => {
    const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode || 'SIGN_IN_ENTRY');
    const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<FamilyProfile | null>(null);
    const [authInput, setAuthInput] = useState('');
    const [loginIdentifier, setLoginIdentifier] = useState(''); 
    const [error, setError] = useState('');

    // Setup Form State
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPin, setAdminPin] = useState('');
    const [recoveryKey, setRecoveryKey] = useState('');
    
    const [childName, setChildName] = useState('');
    const [childAge, setChildAge] = useState('');
    const [childPass, setChildPass] = useState('');

    // Forgot Flow State
    const [resetInput, setResetInput] = useState('');
    const [resetStep, setResetStep] = useState<'CHOICE' | 'VERIFY' | 'NEW_CREDS'>('CHOICE');

    useEffect(() => {
        const stored = StorageService.getProfiles();
        setProfiles(stored);
        if (initialViewMode) {
            setViewMode(initialViewMode);
        } else if (stored.length === 0) {
            setViewMode('SETUP_ADMIN');
        }
    }, [initialViewMode]);

    const handleGlobalSignIn = () => {
        if (!loginIdentifier || !authInput) {
            setError("Please enter your name/email and password.");
            return;
        }

        const match = profiles.find(p => 
            (p.childName.toLowerCase() === loginIdentifier.toLowerCase() || (p.email && p.email.toLowerCase() === loginIdentifier.toLowerCase()))
        );

        if (!match) {
            setError("Account not found. Check spelling or sign up!");
            return;
        }

        const isAuthorized = match.mode === 'PARENT' 
            ? authInput === match.pin 
            : authInput.toLowerCase() === (match.password || '').toLowerCase();

        if (isAuthorized) {
            setError('');
            if (match.mode === 'PARENT') {
                setViewMode('USER_GRID');
            } else {
                onLogin(match);
            }
        } else {
            setError("Incorrect credentials. Use Reset Access if forgotten!");
        }
    };

    const handleAdminSetup = () => {
        if (!adminName || !adminEmail || adminPin.length < 4) {
            setError("All fields (and 4-digit PIN) required.");
            return;
        }
        const p = StorageService.createParentProfile(adminName, adminEmail, adminPin);
        setRecoveryKey(p.recoveryKey || '');
        setProfiles(StorageService.getProfiles());
        setViewMode('RECOVERY_INFO');
        setError('');
    };

    const handleChildSetup = (finish = false) => {
        if (!childName || !childPass) {
            setError("Name and Password are required.");
            return;
        }
        StorageService.createChildProfile(childName, parseInt(childAge) || 6, childPass);
        setProfiles(StorageService.getProfiles());
        setChildName(''); setChildAge(''); setChildPass('');
        if (finish) setViewMode('USER_GRID');
    };

    const handleResetVerify = () => {
        const admin = profiles.find(p => p.mode === 'PARENT');
        if (!admin) {
            setError("No Parent Hub account exists yet to reset.");
            return;
        }

        const normalizedInput = resetInput.trim().toLowerCase();
        const isAdminEmail = admin.email && normalizedInput === admin.email.toLowerCase();
        const isAdminKey = admin.recoveryKey && normalizedInput === admin.recoveryKey.toLowerCase();
        const isAdminPin = normalizedInput === admin.pin;

        if (isAdminEmail || isAdminKey || isAdminPin) {
            setResetStep('NEW_CREDS');
            setResetInput('');
            setError('');
        } else {
            setError("Verification failed. Check your Recovery Key or Parent Email.");
        }
    };

    const handleSaveNewCreds = () => {
        if (!resetInput) {
            setError("Please enter a new PIN.");
            return;
        }
        const admin = profiles.find(p => p.mode === 'PARENT');
        if (!admin) return;
        
        StorageService.updateProfile({ ...admin, pin: resetInput });
        alert("Success! Your Admin PIN has been updated. Please sign in.");
        setViewMode('SIGN_IN_ENTRY');
        setResetStep('CHOICE');
        setResetInput('');
    };

    const BackButton = ({ onClick }: { onClick?: () => void }) => (
      <button 
        type="button" 
        onClick={onClick} 
        className="absolute top-6 left-6 text-slate-500 hover:text-white transition-all z-[100] active:scale-90"
      >
        <ChevronLeft size={32}/>
      </button>
    );

    // --- RENDER VIEWS ---

    if (viewMode === 'SIGN_IN_ENTRY') return (
        <div className="h-screen w-screen flex items-center justify-center p-4 bg-[#050810] font-sans overflow-hidden">
            <div className="max-w-md w-full bg-[#0b1120] p-8 sm:p-12 rounded-[3rem] border-2 border-white/5 shadow-2xl relative animate-fade-in flex flex-col items-center">
                <BackButton onClick={onBackToLanding} />
                <div className="text-center mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-2xl border-2 border-white/10">
                        <LogIn size={40} className="text-white"/>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-display text-white mb-2 italic tracking-tighter">Sign In</h1>
                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.4em] opacity-60">Adventure Entry</p>
                </div>
                <div className="w-full space-y-5">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4 opacity-60">Identity / Email</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18}/>
                            <input 
                                value={loginIdentifier} 
                                onChange={e => setLoginIdentifier(e.target.value)} 
                                className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-[1.5rem] p-4 pl-12 text-white text-lg focus:border-indigo-500 outline-none transition-all" 
                                placeholder="Name or Email" 
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4 opacity-60">Secret Code</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18}/>
                            <input 
                                type="password" 
                                value={authInput} 
                                onChange={e => setAuthInput(e.target.value)} 
                                className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-[1.5rem] p-4 pl-12 text-white text-lg focus:border-indigo-500 outline-none transition-all" 
                                placeholder="••••" 
                            />
                        </div>
                    </div>
                    {error && <p className="text-rose-500 text-[10px] font-black text-center animate-pulse uppercase tracking-wider">{error}</p>}
                    <button 
                        onClick={handleGlobalSignIn} 
                        disabled={!loginIdentifier || !authInput}
                        className="w-full py-5 sm:py-7 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-[2rem] font-black text-2xl text-white shadow-xl border-b-8 border-indigo-900 active:border-b-0 active:translate-y-1 transition-all"
                    >
                        ENTER HUB
                    </button>
                    <div className="flex flex-col gap-2 pt-4 border-t border-white/5 items-center">
                        <button onClick={() => { setResetStep('CHOICE'); setViewMode('FORGOT_FLOW'); setError(''); setResetInput(''); }} className="text-slate-500 hover:text-indigo-400 font-black text-[9px] uppercase tracking-[0.3em] flex items-center gap-1"><HelpCircle size={12}/> Reset Access</button>
                        <button onClick={() => setViewMode('SETUP_ADMIN')} className="text-indigo-400 font-black text-[9px] uppercase tracking-[0.3em]">No Hub? Create One</button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (viewMode === 'SETUP_ADMIN') return (
        <div className="h-screen w-screen flex items-center justify-center p-4 bg-[#050810] font-sans overflow-hidden">
            <div className="max-w-md w-full bg-[#0b1120] p-8 sm:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative animate-fade-in flex flex-col items-center">
                <BackButton onClick={onBackToLanding} />
                <div className="text-center mb-8">
                    <ShieldCheck size={64} className="mx-auto text-indigo-500 mb-4 animate-float"/>
                    <h1 className="text-4xl sm:text-5xl font-display text-white mb-1 italic tracking-tighter">Sign Up</h1>
                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.4em] opacity-60">Master Hub Setup</p>
                </div>
                <div className="w-full space-y-4">
                    <input value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-[1.5rem] p-4 text-white text-lg outline-none focus:border-indigo-500" placeholder="Guardian Name (e.g. Mum)" />
                    <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-[1.5rem] p-4 text-white text-lg outline-none focus:border-indigo-500" placeholder="Admin Email" />
                    <input type="password" maxLength={4} value={adminPin} onChange={e => setAdminPin(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-[1.5rem] p-4 text-white text-center text-4xl tracking-[0.6em] outline-none" placeholder="••••" />
                    {error && <p className="text-red-500 text-[10px] font-black text-center animate-pulse">{error}</p>}
                    <button onClick={handleAdminSetup} className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] font-black text-2xl text-white shadow-xl border-b-8 border-indigo-900 active:border-b-0 transition-all">ACTIVATE HUB</button>
                </div>
            </div>
        </div>
    );

    if (viewMode === 'RECOVERY_INFO') return (
        <div className="h-screen w-screen flex items-center justify-center p-4 bg-[#050810] animate-fade-in">
            <div className="max-w-md w-full bg-[#0b1120] p-10 rounded-[4rem] border-2 border-amber-500/30 text-center shadow-2xl relative">
                <KeyRound size={72} className="mx-auto text-amber-400 mb-6 animate-bounce" />
                <h2 className="text-4xl font-display text-white mb-4 italic tracking-tighter">Master Key</h2>
                <p className="text-slate-400 text-sm mb-8">Save this key! You'll need it to reset access if forgotten.</p>
                <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 mb-10"><code className="text-2xl font-mono text-amber-300 tracking-widest break-all select-all">{recoveryKey}</code></div>
                <button onClick={() => setViewMode('SETUP_CHILD')} className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] font-black text-2xl text-white border-b-8 border-indigo-900 active:border-b-0">SECURED & CONTINUE</button>
            </div>
        </div>
    );

    if (viewMode === 'SETUP_CHILD') return (
        <div className="h-screen w-screen flex items-center justify-center p-4 bg-[#050810] animate-fade-in">
            <div className="max-w-md w-full bg-[#0b1120] p-10 rounded-[4rem] border-2 border-pink-500/20 shadow-2xl relative">
                <BackButton onClick={() => setViewMode('USER_GRID')} />
                <div className="text-center mb-8">
                    <Smile size={64} className="mx-auto text-pink-500 mb-4 animate-float"/>
                    <h1 className="text-4xl sm:text-5xl font-display text-white mb-1 italic tracking-tighter">Add Adventurer</h1>
                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.4em] opacity-60">Grow your hub</p>
                </div>
                <div className="space-y-4">
                    <input value={childName} onChange={e => setChildName(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-[1.5rem] p-4 text-white text-lg focus:border-pink-500 outline-none" placeholder="Name" />
                    <input type="number" value={childAge} onChange={e => setChildAge(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-[1.5rem] p-4 text-white focus:border-pink-500 outline-none" placeholder="Age" />
                    <input value={childPass} onChange={e => setChildPass(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-[1.5rem] p-4 text-white focus:border-pink-500 outline-none" placeholder="Secret Word" />
                    {error && <p className="text-red-500 text-[10px] font-black text-center">{error}</p>}
                    <div className="grid grid-cols-1 gap-3 pt-2">
                        <button onClick={() => handleChildSetup(false)} className="w-full py-6 bg-pink-600 hover:bg-pink-500 rounded-[2rem] font-black text-2xl text-white shadow-xl border-b-8 border-pink-900 active:border-b-0">ADD ANOTHER</button>
                        <button onClick={() => handleChildSetup(true)} className="w-full py-4 text-slate-500 font-bold uppercase text-[9px] tracking-widest">FINISH & GO TO PROFILES</button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (viewMode === 'USER_GRID') return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
            <BackButton onClick={() => setViewMode('SIGN_IN_ENTRY')} />
            <div className="text-center mb-12">
                <h1 className="font-display text-7xl sm:text-8xl text-white mb-2 tracking-tighter italic drop-shadow-2xl">Tiwaton</h1>
                <p className="text-slate-500 font-black uppercase tracking-[0.6em] text-[10px] bg-white/5 py-2 px-6 rounded-full inline-block">Select Explorer</p>
            </div>
            <div className="max-w-5xl w-full grid grid-cols-2 md:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar p-2">
                {profiles.map(p => (
                    <button key={p.id} onClick={() => onLogin(p)} className="group bg-slate-900/50 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-slate-800 hover:border-indigo-500 transition-all hover:-translate-y-2 flex flex-col items-center">
                        <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">{p.avatar}</div>
                        <span className="font-black text-white text-xl uppercase italic tracking-tighter">{p.childName}</span>
                        {p.mode === 'PARENT' && <span className="text-[7px] text-indigo-400 font-black uppercase tracking-widest mt-1">HOST</span>}
                    </button>
                ))}
                <button onClick={() => setViewMode('SETUP_CHILD')} className="p-8 rounded-[3rem] border-2 border-dashed border-slate-800 hover:border-slate-500 transition-all flex flex-col items-center justify-center text-slate-600 hover:text-slate-300 min-h-[160px]">
                    <Plus size={40}/>
                    <span className="font-black text-[9px] uppercase mt-4">New Hero</span>
                </button>
            </div>
        </div>
    );

    if (viewMode === 'FORGOT_FLOW') return (
        <div className="h-screen w-screen flex items-center justify-center p-4 bg-[#050810] animate-fade-in overflow-hidden">
            <div className="max-w-sm w-full bg-[#0b1120] p-10 rounded-[3.5rem] border-2 border-amber-500/20 text-center shadow-2xl relative flex flex-col items-center">
                <BackButton onClick={() => setViewMode('SIGN_IN_ENTRY')} />
                <AlertTriangle size={64} className="mx-auto text-amber-500 mb-6 animate-pulse"/>
                <h2 className="text-3xl font-display text-white mb-6 italic tracking-tighter">Access Reset</h2>
                
                {resetStep === 'CHOICE' && (
                    <div className="space-y-4 w-full">
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">Reset requires your Hub Recovery Key or Parent Email to verify identity.</p>
                        <button 
                            onClick={() => setResetStep('VERIFY')} 
                            className="w-full py-6 bg-slate-800/30 hover:bg-slate-800/50 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                            START RESET
                        </button>
                    </div>
                )}

                {resetStep === 'VERIFY' && (
                    <div className="space-y-6 w-full">
                        <input 
                            value={resetInput} 
                            onChange={e => setResetInput(e.target.value)} 
                            placeholder="Recovery Key or Email" 
                            className="w-full bg-[#050810] border-2 border-slate-800 rounded-[1.5rem] p-4 text-white text-center outline-none focus:border-amber-500 transition-all" 
                        />
                        {error && <p className="text-red-500 text-[10px] font-black uppercase animate-pulse">{error}</p>}
                        <button 
                            onClick={handleResetVerify} 
                            disabled={!resetInput}
                            className="w-full py-5 bg-amber-600 disabled:opacity-50 hover:bg-amber-500 rounded-2xl text-white font-black text-[10px] uppercase transition-all shadow-xl"
                        >
                            VERIFY KEY
                        </button>
                    </div>
                )}

                {resetStep === 'NEW_CREDS' && (
                    <div className="space-y-6 w-full">
                        <input 
                            type="password" 
                            maxLength={4} 
                            value={resetInput} 
                            onChange={e => setResetInput(e.target.value)} 
                            placeholder="New 4-Digit PIN" 
                            className="w-full bg-[#050810] border-2 border-slate-800 rounded-[1.5rem] p-6 text-white text-center text-3xl tracking-widest outline-none focus:border-indigo-500 transition-all" 
                        />
                        {error && <p className="text-red-500 text-[10px] font-black uppercase">{error}</p>}
                        <button 
                            onClick={handleSaveNewCreds} 
                            disabled={resetInput.length < 4}
                            className="w-full py-6 bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 rounded-2xl text-white font-black text-xl italic uppercase shadow-xl transition-all"
                        >
                            SAVE NEW PIN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-white">
            <div className="relative">
                <div className="w-24 h-24 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-display italic text-2xl">T</div>
            </div>
            <p className="mt-8 text-xl animate-pulse font-display italic">Opening the Adventure Hub...</p>
        </div>
    );
};

export default Login;
