
import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { FamilyProfile } from '../types';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
    ShieldCheck, Plus, ArrowRight, Smile, KeyRound,
    AlertTriangle, ChevronLeft, LogIn, HelpCircle, User, Lock
} from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

interface LoginProps {
    onLogin: (profile: FamilyProfile) => void;
    onBackToLanding?: () => void;
    initialViewMode?: ViewMode;
}

export type ViewMode = 'SETUP_ADMIN' | 'RECOVERY_INFO' | 'SETUP_CHILD' | 'USER_GRID' | 'VERIFY_ACCOUNT' | 'FORGOT_FLOW' | 'SIGN_IN_ENTRY';

const Login: React.FC<LoginProps> = ({ onLogin, onBackToLanding, initialViewMode }) => {
    const { t } = useI18n();
    const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode || 'SIGN_IN_ENTRY');
    const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<FamilyProfile | null>(null);
    const [authInput, setAuthInput] = useState('');
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [classCode, setClassCode] = useState('');
    const [error, setError] = useState('');

    // Setup Form State
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPin, setAdminPin] = useState('');
    const [recoveryKey, setRecoveryKey] = useState('');

    const [name, setChildName] = useState('');
    const [childAge, setChildAge] = useState('');
    const [childPass, setChildPass] = useState('');

    // Forgot Flow State
    const [resetInput, setResetInput] = useState('');
    const [resetStep, setResetStep] = useState<'CHOICE' | 'VERIFY' | 'NEW_CREDS'>('CHOICE');

    // Email Verification State
    const [verificationCode, setVerificationCode] = useState('');
    const [inputVerificationCode, setInputVerificationCode] = useState('');

    // Role Setup State
    const [setupRole, setSetupRole] = useState<'PARENT' | 'TEACHER'>('PARENT');

    useEffect(() => {
        const init = async () => {
            const stored = StorageService.getProfiles();
            setProfiles(stored);

            // If we have no local profiles but have a firebase user, sync now
            if (stored.length === 0 && auth.currentUser) {
                const synced = await StorageService.syncFromFirestore(auth.currentUser.uid);
                setProfiles(synced);
            }

            if (initialViewMode) {
                setViewMode(initialViewMode);
            } else if (StorageService.hasProfiles()) {
                // If we have profiles, default to grid
                setViewMode('USER_GRID');
            } else if (!auth.currentUser) {
                // Completely new device/session
                setViewMode('SIGN_IN_ENTRY');
            }
        };
        init();
    }, [initialViewMode]);

    // Re-fetch when entering Grid to catch background syncs from App.tsx
    useEffect(() => {
        if (viewMode === 'USER_GRID') {
            setProfiles(StorageService.getProfiles());
        }
    }, [viewMode]);

    // ... (in component implementation below ...)

    const handleGlobalSignIn = async () => {
        if (!loginIdentifier || !authInput) {
            setError(t('login.errorMissingCredentials'));
            return;
        }

        try {
            // Assume it's an email/password Teacher/Parent login first
            if (loginIdentifier.includes('@')) {
                // Pad 4-digit PINs to 6 chars to match the forced signup logic
                const passwordToUse = authInput.length === 4 ? authInput.padEnd(6, '0') : authInput;
                const userCredential = await signInWithEmailAndPassword(auth, loginIdentifier, passwordToUse);
                const uid = userCredential.user.uid;

                StorageService.setTenantContext(uid);
                const loadedProfiles = await StorageService.syncFromFirestore(uid);

                setProfiles(loadedProfiles);
                setViewMode('USER_GRID');
                setError('');
            } else {
                // It's a student login. They don't have emails, they just pick their profile from USER_GRID
                // For a real production app we'd need a specific class-code sign-in flow here
                // that doesn't rely entirely on email. But based on the existing UI, kids select their
                // profile from the grid AFTER the teacher/parent logs in.

                // If they are trying to log in directly via the prompt without an email, 
                // we'll check if we currently have loaded profiles (e.g., from an active session).
                // profiles should be an array, but we add a defensive check just in case.
                const match = (profiles || []).find(p => p.name.toLowerCase() === loginIdentifier.toLowerCase());
                if (match) {
                    if ((match.password || '').toLowerCase() === authInput.toLowerCase()) {
                        onLogin(match);
                    } else {
                        setError('Incorrect password');
                    }
                } else {
                    const globalProfile = await StorageService.findChildGlobal(loginIdentifier, authInput);
                    if (globalProfile) {
                        onLogin(globalProfile);
                    } else {
                        setError('Child profile not found. Parent/Teacher must log in first, or check name and secret.');
                    }
                }
            }
        } catch (err: any) {
            console.error("Login err", err);
            let userMsg = t('login.errorAccountNotFound');
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                userMsg = t('login.errorIncorrect');
            } else if (err.code === 'auth/too-many-requests') {
                userMsg = "Too many failed attempts. Please try again later.";
            } else if (err.code === 'permission-denied') {
                userMsg = "Access denied. Your profile might still be setting up.";
            }
            setError(userMsg);
        }
    };

    const handleAdminSetup = async () => {
        if (!adminName || !adminEmail || adminPin.length < 4) {
            setError(t('login.errorAllFields'));
            return;
        }

        try {
            setError('');

            // 1. Create the Auth User
            const paddedPass = adminPin.padEnd(6, '0');
            const userCreds = await createUserWithEmailAndPassword(auth, adminEmail, paddedPass);
            const uid = userCreds.user.uid;

            // 2. Create Profile Document
            const p = setupRole === 'TEACHER'
                ? await StorageService.createTeacherProfile(uid, adminName, adminEmail, adminPin)
                : await StorageService.createParentProfile(uid, adminName, adminEmail, adminPin);

            setRecoveryKey(p.recoveryKey || '');
            setProfiles(StorageService.getProfiles());

            // 3. Send Verification Email
            await sendEmailVerification(userCreds.user);
            setViewMode('VERIFY_ACCOUNT');
        } catch (err: any) {
            console.error("Signup err", err);
            setError(err.message || "Failed to create account");
        }
    };

    const handleCheckVerification = async () => {
        try {
            setError('');
            if (auth.currentUser) {
                await auth.currentUser.reload();
                if (auth.currentUser.emailVerified) {
                    // Re-fetch profiles to ensure we have the recovery key
                    const uid = auth.currentUser.uid;
                    StorageService.setTenantContext(uid);
                    const membersSnap = await getDocs(collection(db, `tenants/${uid}/members`));
                    const childrenSnap = await getDocs(collection(db, `tenants/${uid}/children`));

                    const loadedProfiles: FamilyProfile[] = [
                        ...membersSnap.docs.map(d => d.data() as FamilyProfile),
                        ...childrenSnap.docs.map(d => d.data() as FamilyProfile)
                    ];

                    StorageService.setCachedProfiles(loadedProfiles);
                    setProfiles(loadedProfiles);

                    const admin = loadedProfiles.find(p => p.id === uid);
                    if (admin?.recoveryKey) setRecoveryKey(admin.recoveryKey);

                    setViewMode('RECOVERY_INFO');
                } else {
                    setError('Email not yet verified. Please check your inbox and click the link.');
                }
            } else {
                setError('Authentication error. Please try logging in again.');
            }
        } catch (err: any) {
            console.error("Verification err", err);
            setError(err.message || "Failed to check verification status");
        }
    };



    const handleChildSetup = async (finish = false) => {
        if (!name || !childPass) {
            setError(t('login.errorChildFields'));
            return;
        }
        try {
            const newChild = await StorageService.createChildProfile(name, parseInt(childAge) || 6, childPass);
            setProfiles(StorageService.getProfiles());
            setChildName(''); setChildAge(''); setChildPass('');
            if (finish) setViewMode('USER_GRID');
        } catch (err: any) {
            setError(err.message || 'Failed to create child');
        }
    };

    const handleResetVerify = () => {
        const admin = profiles.find(p => p.mode === 'PARENT');
        if (!admin) {
            setError(t('login.errorResetNoAdmin'));
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
            setError(t('login.errorResetFailed'));
        }
    };

    const handleSaveNewCreds = () => {
        if (!resetInput) {
            setError(t('login.errorEnterPin'));
            return;
        }
        const admin = profiles.find(p => p.mode === 'PARENT');
        if (!admin) return;

        StorageService.updateProfile({ ...admin, pin: resetInput });
        alert(t('login.alertPinSaved'));
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
            <ChevronLeft size={32} />
        </button>
    );

    // --- RENDER VIEWS ---

    if (viewMode === 'SIGN_IN_ENTRY') return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 py-8 bg-[#050810] font-sans overflow-y-auto custom-scrollbar">
            <div className="max-w-md w-full bg-[#0b1120] p-6 sm:p-8 rounded-[2rem] border-2 border-white/5 shadow-xl relative animate-fade-in flex flex-col items-center">
                <BackButton onClick={onBackToLanding} />
                <div className="text-center mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-white/10">
                        <LogIn size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-display text-white mb-1 italic tracking-tight">{t('login.signInTitle')}</h1>
                    <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.3em] opacity-80">{t('login.signInSubtitle')}</p>
                </div>
                <div className="w-full space-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3 opacity-80">Identity (Teacher Email or Student Name)</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                            <input
                                value={loginIdentifier}
                                onChange={e => setLoginIdentifier(e.target.value)}
                                className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-xl p-3 pl-10 text-white text-base focus:border-indigo-500 outline-none transition-all"
                                placeholder="e.g. jsmith@school.edu OR Tommy"
                            />
                        </div>
                    </div>

                    <div className="space-y-1 flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3 opacity-80">Secret (PIN or Pass)</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                <input
                                    type="password"
                                    value={authInput}
                                    onChange={e => setAuthInput(e.target.value)}
                                    className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-xl p-3 pl-10 text-white text-base focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Secret..."
                                />
                            </div>
                        </div>

                        <div className="flex-1 space-y-1">
                            <label className="text-[9px] font-black text-yellow-500 uppercase tracking-widest ml-3 opacity-90">Class Code (Optional)</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-600" size={16} />
                                <input
                                    value={classCode}
                                    onChange={e => setClassCode(e.target.value)}
                                    className="w-full bg-yellow-900/10 border-2 border-yellow-800/50 rounded-xl p-3 pl-10 text-yellow-100 text-base focus:border-yellow-500 outline-none transition-all"
                                    placeholder="e.g. MAT101"
                                />
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-rose-500 text-[9px] font-bold text-center animate-pulse uppercase tracking-widest">{error}</p>}
                    <button
                        onClick={handleGlobalSignIn}
                        disabled={!loginIdentifier || !authInput}
                        className="w-full py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-black text-lg sm:text-xl text-white shadow-lg border-b-4 border-indigo-900 active:border-b-0 active:translate-y-[2px] transition-all"
                    >
                        {t('login.enterButton')}
                    </button>
                    <div className="flex flex-col gap-3 pt-5 border-t border-white/5 w-full mt-3">
                        <button onClick={() => setViewMode('SETUP_ADMIN')} className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 rounded-xl font-bold text-base text-white shadow-md shadow-emerald-900/20 transition-all border border-emerald-400/30 flex items-center justify-center gap-1.5">
                            <ShieldCheck size={18} /> {t('login.signupPrompt')}
                        </button>
                        <button onClick={() => { setResetStep('CHOICE'); setViewMode('FORGOT_FLOW'); setError(''); setResetInput(''); }} className="text-slate-500 hover:text-indigo-400 font-bold text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-1 mt-1">
                            <HelpCircle size={10} /> {t('login.resetAccess')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (viewMode === 'SETUP_ADMIN') return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 py-8 bg-[#050810] font-sans overflow-y-auto custom-scrollbar">
            <div className="max-w-md w-full bg-[#0b1120] p-6 sm:p-8 rounded-[2rem] border-2 border-white/5 shadow-xl relative animate-fade-in flex flex-col items-center">
                <BackButton onClick={onBackToLanding} />
                <div className="text-center mb-6">
                    <ShieldCheck size={48} className="mx-auto text-indigo-500 mb-3 animate-float" />
                    <h1 className="text-3xl sm:text-4xl font-display text-white mb-1 italic tracking-tight">{t('login.setupTitle')}</h1>
                    <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.3em] opacity-80">{t('login.setupSubtitle')}</p>
                </div>

                <div className="w-full flex bg-[#050810] rounded-xl p-1 mb-5 border border-white/5">
                    <button
                        onClick={() => { setSetupRole('PARENT'); }}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${setupRole === 'PARENT' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}>
                        Family
                    </button>
                    <button
                        onClick={() => { setSetupRole('TEACHER'); }}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${setupRole === 'TEACHER' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}>
                        School
                    </button>
                </div>

                <div className="w-full space-y-3">
                    <input value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-xl p-3 text-white text-base outline-none focus:border-indigo-500" placeholder={t('login.setupNamePlaceholder')} />
                    <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-xl p-3 text-white text-base outline-none focus:border-indigo-500" placeholder={t('login.setupEmailPlaceholder')} />
                    <input type="password" maxLength={4} value={adminPin} onChange={e => setAdminPin(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-xl p-3 text-white text-center text-3xl tracking-[0.4em] outline-none focus:border-indigo-500" placeholder={t('login.setupPinPlaceholder')} />
                    {error && <p className="text-red-500 text-[10px] font-bold text-center animate-pulse">{error}</p>}
                    <button onClick={handleAdminSetup} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg text-white shadow-lg border-b-4 border-indigo-900 active:border-b-0 transition-all">{t('login.createButton')}</button>
                </div>
            </div>
        </div>
    );



    if (viewMode === 'RECOVERY_INFO') return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 py-8 bg-[#050810] animate-fade-in overflow-y-auto custom-scrollbar">
            <div className="max-w-md w-full bg-[#0b1120] p-6 sm:p-8 rounded-[2rem] border-2 border-amber-500/30 text-center shadow-xl relative">
                <KeyRound size={48} className="mx-auto text-amber-400 mb-4 animate-bounce" />
                <h2 className="text-3xl font-display text-white mb-2 italic tracking-tight">{t('login.recoveryTitle')}</h2>
                <p className="text-slate-400 text-xs mb-6">{t('login.recoverySubtitle')}</p>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-8"><code className="text-xl font-mono text-amber-300 tracking-widest break-all select-all">{recoveryKey}</code></div>
                <button onClick={() => setViewMode('SETUP_CHILD')} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-xl text-white border-b-4 border-indigo-900 active:border-b-0">{t('login.recoveryButton')}</button>
            </div>
        </div>
    );

    if (viewMode === 'VERIFY_ACCOUNT') return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 py-8 bg-[#050810] animate-fade-in overflow-y-auto custom-scrollbar">
            <div className="max-w-md w-full bg-[#0b1120] p-6 sm:p-8 rounded-[2rem] border-2 border-sky-500/20 text-center shadow-xl relative flex flex-col items-center">
                <div className="w-12 h-12 bg-sky-500/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck size={24} className="text-sky-400" />
                </div>
                <h2 className="text-2xl font-display text-white mb-2 italic tracking-tight">Verify Email</h2>
                <p className="text-slate-400 text-xs mb-6">
                    We sent a verification link to <br /><span className="text-white font-bold">{adminEmail}</span>
                    <br /><br />
                    Please click the link in your email to verify your account, then click the button below.
                </p>

                <div className="space-y-4 w-full mt-2">
                    {error && <p className="text-red-500 text-[10px] font-bold uppercase">{error}</p>}
                    <button
                        onClick={handleCheckVerification}
                        className="w-full py-4 bg-sky-600 hover:bg-sky-500 rounded-xl text-white font-bold text-lg italic uppercase shadow-lg transition-all"
                    >
                        I Have Verified Use This App
                    </button>
                    <button
                        onClick={() => setViewMode('SIGN_IN_ENTRY')}
                        className="w-full py-3 text-slate-500 hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );

    if (viewMode === 'SETUP_CHILD') return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 py-8 bg-[#050810] animate-fade-in overflow-y-auto custom-scrollbar">
            <div className="max-w-md w-full bg-[#0b1120] p-6 sm:p-8 rounded-[2rem] border-2 border-pink-500/20 shadow-xl relative">
                <BackButton onClick={() => setViewMode('USER_GRID')} />
                <div className="text-center mb-6">
                    <Smile size={48} className="mx-auto text-pink-500 mb-3 animate-float" />
                    <h1 className="text-3xl sm:text-4xl font-display text-white mb-1 italic tracking-tight">{t('login.childTitle')}</h1>
                    <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.3em] opacity-80">{t('login.childSubtitle')}</p>
                </div>
                <div className="space-y-3">
                    <input value={name} onChange={e => setChildName(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-xl p-3 text-white text-base focus:border-pink-500 outline-none" placeholder={t('login.namePlaceholder')} />
                    <input type="number" value={childAge} onChange={e => setChildAge(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-xl p-3 text-white focus:border-pink-500 outline-none" placeholder={t('login.childAgePlaceholder')} />
                    <input value={childPass} onChange={e => setChildPass(e.target.value)} className="w-full bg-[#050810] border-2 border-slate-800/50 rounded-xl p-3 text-white focus:border-pink-500 outline-none" placeholder={t('login.childPassPlaceholder')} />
                    {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
                    <div className="grid grid-cols-1 gap-2 pt-2">
                        <button onClick={() => handleChildSetup(false)} className="w-full py-4 bg-pink-600 hover:bg-pink-500 rounded-xl font-bold text-lg text-white shadow-lg border-b-4 border-pink-900 active:border-b-0">{t('login.childAddAnother')}</button>
                        <button onClick={() => handleChildSetup(true)} className="w-full py-3 text-slate-500 font-bold uppercase text-[8px] tracking-widest">{t('login.childFinish')}</button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (viewMode === 'USER_GRID') return (
        <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 py-12 animate-fade-in relative overflow-y-auto custom-scrollbar">
            <BackButton onClick={() => setViewMode('SIGN_IN_ENTRY')} />
            <div className="text-center mb-8">
                <h1 className="font-display text-5xl sm:text-6xl text-white mb-2 tracking-tight italic drop-shadow-lg">Tiwaton</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[8px] bg-white/5 py-1.5 px-4 rounded-full inline-block">{t('login.selectExplorer')}</p>
            </div>
            <div className="max-w-4xl w-full grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar p-2">
                {profiles.map(p => (
                    <button key={p.id} onClick={() => onLogin(p)} className="group bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 hover:border-indigo-500 transition-all hover:-translate-y-1 flex flex-col items-center shadow-lg">
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{p.avatar}</div>
                        <span className="font-bold text-white text-lg uppercase italic tracking-tight">{p.name}</span>
                        {p.mode === 'PARENT' && <span className="text-[7px] text-indigo-400 font-bold uppercase tracking-widest mt-1">HOST</span>}
                    </button>
                ))}
                <button onClick={() => setViewMode('SETUP_CHILD')} className="p-6 rounded-3xl border-2 border-dashed border-slate-800 hover:border-slate-500 transition-all flex flex-col items-center justify-center text-slate-600 hover:text-slate-300 min-h-[140px]">
                    <Plus size={32} />
                    <span className="font-bold text-[8px] uppercase mt-3">{t('login.newHero')}</span>
                </button>
            </div>
        </div>
    );

    if (viewMode === 'FORGOT_FLOW') return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 py-8 bg-[#050810] animate-fade-in overflow-y-auto custom-scrollbar">
            <div className="max-w-sm w-full bg-[#0b1120] p-6 sm:p-8 rounded-[2rem] border-2 border-amber-500/20 text-center shadow-xl relative flex flex-col items-center">
                <BackButton onClick={() => setViewMode('SIGN_IN_ENTRY')} />
                <AlertTriangle size={40} className="mx-auto text-amber-500 mb-4 animate-pulse" />
                <h2 className="text-2xl font-display text-white mb-4 italic tracking-tight">{t('login.forgotTitle')}</h2>

                {resetStep === 'CHOICE' && (
                    <div className="space-y-3 w-full">
                        <p className="text-slate-400 text-xs mb-4 leading-relaxed">{t('login.forgotSubtitle')}</p>
                        <button
                            onClick={() => setResetStep('VERIFY')}
                            className="w-full py-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl text-white font-bold text-[9px] uppercase tracking-widest transition-all"
                        >
                            {t('login.forgotStart')}
                        </button>
                    </div>
                )}

                {resetStep === 'VERIFY' && (
                    <div className="space-y-4 w-full">
                        <input
                            value={resetInput}
                            onChange={e => setResetInput(e.target.value)}
                            placeholder={t('login.forgotVerifyPlaceholder')}
                            className="w-full bg-[#050810] border-2 border-slate-800 rounded-xl p-3 text-white text-center outline-none focus:border-amber-500 transition-all text-base"
                        />
                        {error && <p className="text-red-500 text-[9px] font-bold uppercase animate-pulse">{error}</p>}
                        <button
                            onClick={handleResetVerify}
                            disabled={!resetInput}
                            className="w-full py-4 bg-amber-600 disabled:opacity-50 hover:bg-amber-500 rounded-xl text-white font-bold text-[9px] uppercase transition-all shadow-md"
                        >
                            {t('login.forgotVerifyButton')}
                        </button>
                    </div>
                )}

                {resetStep === 'NEW_CREDS' && (
                    <div className="space-y-4 w-full">
                        <input
                            type="password"
                            maxLength={4}
                            value={resetInput}
                            onChange={e => setResetInput(e.target.value)}
                            placeholder={t('login.forgotNewPinPlaceholder')}
                            className="w-full bg-[#050810] border-2 border-slate-800 rounded-xl p-4 text-white text-center text-2xl tracking-[0.4em] outline-none focus:border-indigo-500 transition-all"
                        />
                        {error && <p className="text-red-500 text-[9px] font-bold uppercase">{error}</p>}
                        <button
                            onClick={handleSaveNewCreds}
                            disabled={resetInput.length < 4}
                            className="w-full py-4 bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 rounded-xl text-white font-bold text-lg italic uppercase shadow-md transition-all"
                        >
                            {t('login.forgotSaveButton')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white">
            <div className="relative">
                <div className="w-24 h-24 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-display italic text-2xl">T</div>
            </div>
            <p className="mt-8 text-xl animate-pulse font-display italic">Opening the Adventure Hub...</p>
        </div>
    );
};

export default Login;
