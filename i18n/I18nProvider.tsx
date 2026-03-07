import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { AudioService } from '../services/audio';

type Locale = 'en' | 'de';

type Translations = {
  [locale in Locale]: {
    landing: Record<string, string>;
    login: Record<string, string>;
    activities: Record<string, string>;
    stories: Record<string, string>;
    drawing: Record<string, string>;
    countdown: Record<string, string>;
    shared: Record<string, string>;
  };
};

const TRANSLATIONS: Translations = {
  en: {
    landing: {
      heroTitle: 'Adventure Hub',
      heroSubtitle:
        'A high-definition universe where {word} meets Growth. Select your next journey below.',
      sparkleTag: 'The new standard for family adventures',
      ctaPrimary: 'Start Mission',
      ctaResume: 'Resume Hub',
      ctaSecondary: 'Sign In',
      resetButton: 'Reset Hub',
      discoverMore: 'Discover More',
      visionTitle: 'Empowering young minds through Play.',
      visionSubtitle:
        'A digital ecosystem that blends high-quality educational content with playful mechanics. Every session becomes a milestone.',
      bibleQuest: 'Bible Quest',
      bibleDescription: 'Journey through history with curated wisdom, now available offline.',
      storiesTitle: 'Stories to Inspire',
      storiesSubtitle: 'Bedtime tales, gentle lessons, and family adventures handpicked for your child.',
      drawingTitle: 'Magic Art Studio',
      drawingSubtitle: 'Sketch, transform, and share your creations.',
      countdownTitle: 'Never Miss a Moment',
      countdownSubtitle: 'Track birthdays, holidays, and family milestones with parent alerts.',
      toggleLabel: 'DE',
      featureReasoningTitle: 'Logical Reasoning',
      featureReasoningDesc: 'Next-gen math missions that build sharp thinking and celebrate each correct move.',
      featureArtTitle: 'Creative Lab',
      featureArtDesc: 'A responsive art board designed for drawing, transforming, and saving masterpieces instantly.',
      featureVisionTitle: 'Guided Growth',
      featureVisionDesc: 'Stories, quests, and rewards that champion confidence and playful curiosity.',
      featureWordTitle: 'Vocabulary Mastery',
      featureWordDesc: 'Wordplay challenges that stretch spelling, clues, and reading stamina.',
      footerTag: '© 2025 TIWATON ADVENTURE SYSTEMS',
    },
    login: {
      signInTitle: 'Sign In',
      signInSubtitle: 'Adventure Entry',
      identityLabel: 'Name or Email',
      secretLabel: 'Secret Code',
      placeholderIdentity: 'Name or Email',
      placeholderSecret: '••••',
      enterButton: 'Enter Hub',
      resetAccess: 'Reset Access',
      signupPrompt: 'No Hub? Create One',
      setupTitle: 'Sign Up',
      setupSubtitle: 'Master Hub Setup',
      createButton: 'Activate Hub',
      setupNamePlaceholder: 'Guardian Name (e.g. Mum)',
      setupEmailPlaceholder: 'Admin Email',
      setupPinPlaceholder: '••••',
      recoveryTitle: 'Master Key',
      recoverySubtitle: "Save this key! You'll need it to reset access if forgotten.",
      recoveryButton: 'Secured & Continue',
      childTitle: 'Add Adventurer',
      childSubtitle: 'Grow your hub',
      namePlaceholder: 'Name',
      childAgePlaceholder: 'Age',
      childPassPlaceholder: 'Secret Word',
      childAddAnother: 'ADD ANOTHER',
      childFinish: 'FINISH & GO TO PROFILES',
      selectExplorer: 'Select Explorer',
      newHero: 'New Hero',
      forgotTitle: 'Access Reset',
      forgotSubtitle: 'Verify your recovery key or parent email.',
      forgotStart: 'START RESET',
      forgotVerifyPlaceholder: 'Recovery Key or Email',
      forgotVerifyButton: 'VERIFY KEY',
      forgotNewPinPlaceholder: 'New 4-Digit PIN',
      forgotSaveButton: 'SAVE NEW PIN',
      forgotCancel: 'Cancel',
      errorMissingCredentials: 'Please enter your name/email and password.',
      errorAccountNotFound: 'Account not found. Check spelling or sign up!',
      errorIncorrect: 'Incorrect credentials. Use Reset Access if forgotten!',
      errorAllFields: 'All fields (and a 4-digit PIN) are required.',
      errorChildFields: 'Name and Password are required.',
      errorResetNoAdmin: 'No Parent Hub account exists yet to reset.',
      errorResetFailed: 'Verification failed. Check your Recovery Key or Parent Email.',
      errorEnterPin: 'Please enter a new PIN.',
      alertPinSaved: 'Success! Your Admin PIN has been updated. Please sign in.',
    },
    activities: {
      header: 'Bible Quest',
      description: 'Offline question bank covering eight eras, ready even if AI is unreachable.',
      loadingTitle: 'Gathering Ancient Scrolls...',
      loadingSubtitle: 'Preparing your mission',
      victoryTitle: 'Victory!',
      victorySubtitle: 'You conquered this era.',
      victoryXpLabel: 'XP EARNED',
      victoryBadgeLabel: 'Badge Earned',
      incorrectTitle: 'Incorrect',
      incorrectDescription: 'Choosing "{option}" doesn\'t quite match the story this time!',
      correctionPrompt: 'The Correct Answer Is',
      correctionButton: 'Continue Journey',
      fallbackAlert: 'The magic scrolls are dusty! Loading a local quiz.',
      fallbackHint: 'A local quiz is ready so the adventure never stops.',
      startButton: 'Continue Quest',
      offlineNote: 'Offline lore is ready—no AI call needed.',
      retryButton: 'Back to Hub',
    },
    stories: {
      createTitle: 'Write an Adventure',
      createSubtitle: 'Summon a new story to spark imagination.',
      saveButton: 'Save to Library',
      libraryTitle: 'Story Library',
      libraryToggleExpand: 'Expand Library',
      libraryToggleCollapse: 'Collapse Library',
      readAloud: 'Read Aloud',
      stopReading: 'Stop Reading',
      emptyState: 'No stories yet. Ask the family to contribute!',
      savedAlert: 'Story Saved! +50 XP',
      familyMadeTag: 'Family Made',
    },
    drawing: {
      title: 'Magic Art Studio',
      subtitle: 'Sketch, transform, and share creative masterpieces.',
      loadingMagicDust: 'Sprinkling Magic Dust...',
      loadingTemplate: 'Loading Template...',
      loadingDrawing: 'Drawing your picture...',
      loadingClean: 'Fixing lines...',
      loadingTransform: 'Converting to Real Life...',
      storyStepHero: 'Step 1: Draw the Hero!',
      storyStepVillain: 'Step 2: Draw the Villain!',
      storyStepSetting: 'Step 3: Draw the Setting!',
      storyNextButton: 'Next',
      galleryEmpty: 'Empty! Go draw something awesome.',
      templateHeader: 'Choose a Template',
      saveLabel: 'Save',
      downloadLabel: 'Download',
      closeLabel: 'Close',
      storyModeLabel: 'Story Mode',
      templatesLabel: 'Templates',
      musicTrackLabel: 'Soundtracks',
      storySaved: 'Saved!',
      downloadReady: 'Downloading!',
      readyToEdit: 'Ready to edit!',
      storyModeHint: 'Turn drawings into stories',
      aiLoadingFailed: 'Oops, magic failed.',
    },
    countdown: {
      title: 'Events Radar',
      subtitle: 'Counting down to fun!',
      addButton: 'New Event',
      addTitle: 'Add Event',
      eventNamePlaceholder: 'Event Name (e.g. Disney Trip)',
      eventDateLabel: 'Event Date',
      notifyPlaceholder: 'Parent Email for Reminders (Optional)',
      saveButton: 'Save & Notify',
      cancelButton: 'Cancel',
      todayLabel: 'Today!',
      daysLeftLabel: 'Days Left',
      noEvents: 'No events yet. Start the countdown!',
    },
    shared: {
      languageButton: 'DE',
      welcomeBack: 'Welcome back',
      hubBadge: 'ADVENTURE HUB',
    },
  },
  de: {
    landing: {
      heroTitle: 'Abenteuer-Hub',
      heroSubtitle:
        'Ein hochauflösendes Universum, in dem {word} auf Wachstum trifft. Wähle jetzt dein nächstes Abenteuer.',
      sparkleTag: 'Der neue Standard für Familienabenteuer',
      ctaPrimary: 'Mission starten',
      ctaResume: 'Hub fortsetzen',
      ctaSecondary: 'Anmelden',
      resetButton: 'Hub zurücksetzen',
      discoverMore: 'Mehr entdecken',
      visionTitle: 'Kinder durch spielerisches Lernen stärken.',
      visionSubtitle:
        'Eine digitale Welt, die hochwertige Bildung mit spielerischen Elementen verbindet. Jede Session ist ein Erfolg.',
      bibleQuest: 'Bibel-Quest',
      bibleDescription: 'Acht Epochen, Offline-Wissensdatenbank für verlässliche Quizabenteuer.',
      storiesTitle: 'Geschichten zum Staunen',
      storiesSubtitle: 'Sanfte Erzählungen, die Mut machen und die Fantasie beflügeln.',
      drawingTitle: 'Magisches Atelier',
      drawingSubtitle: 'Skizziere, verwandle und teile deine Meisterwerke.',
      countdownTitle: 'Familien-Countdowns',
      countdownSubtitle: 'Feiere Geburtstage und Momente mit Erinnerungen für Eltern.',
      toggleLabel: 'EN',
      featureReasoningTitle: 'Logisches Denken',
      featureReasoningDesc: 'Raumfahrt-Mathe-Missionen, die kluges Denken stärken und jeden Erfolg feiern.',
      featureArtTitle: 'Kreativlabor',
      featureArtDesc: 'Ein interaktives Studio zum Zeichnen, Verwandeln und Speichern spannender Kunstwerke.',
      featureVisionTitle: 'Gezieltes Wachstum',
      featureVisionDesc: 'Geschichten, Quests und Belohnungen für Selbstvertrauen und Neugier.',
      featureWordTitle: 'Wortschatz-Masterclass',
      featureWordDesc: 'Wortspiele, die Rechtschreibung, Hinweise und Lesefluss trainieren.',
      footerTag: '© 2025 TIWATON ABENTEUER SYSTEME',
    },
    login: {
      signInTitle: 'Anmelden',
      signInSubtitle: 'Abenteuereinstieg',
      identityLabel: 'Name oder E-Mail',
      secretLabel: 'Geheimcode',
      placeholderIdentity: 'Name oder E-Mail',
      placeholderSecret: '••••',
      enterButton: 'Hub betreten',
      resetAccess: 'Zugang zurücksetzen',
      signupPrompt: 'Noch kein Hub? Erstellen',
      setupTitle: 'Registrierung',
      setupSubtitle: 'Haupt-Hub einrichten',
      createButton: 'Hub aktivieren',
      setupNamePlaceholder: 'Name der Bezugsperson',
      setupEmailPlaceholder: 'Admin-E-Mail',
      setupPinPlaceholder: '••••',
      recoveryTitle: 'Master-Schlüssel',
      recoverySubtitle: 'Bewahre diesen Schlüssel auf! Du brauchst ihn für einen Reset.',
      recoveryButton: 'Gesichert & Weiter',
      childTitle: 'Abenteurer hinzufügen',
      childSubtitle: 'Baue deinen Hub aus',
      namePlaceholder: 'Name',
      childAgePlaceholder: 'Alter',
      childPassPlaceholder: 'Geheimwort',
      childAddAnother: 'WEITEREN HINZUFÜGEN',
      childFinish: 'FERTIG & ZU PROFILE',
      selectExplorer: 'Explorer wählen',
      newHero: 'Neuer Held',
      forgotTitle: 'Zugang zurücksetzen',
      forgotSubtitle: 'Bestätige Recovery-Key oder Eltern-E-Mail.',
      forgotStart: 'RESET STARTEN',
      forgotVerifyPlaceholder: 'Recovery-Key oder E-Mail',
      forgotVerifyButton: 'SCHLÜSSEL VERIFIZIEREN',
      forgotNewPinPlaceholder: 'Neue 4-stellige PIN',
      forgotSaveButton: 'NEUE PIN SPEICHERN',
      forgotCancel: 'Abbrechen',
      errorMissingCredentials: 'Bitte Name/E-Mail und Passwort eingeben.',
      errorAccountNotFound: 'Account nicht gefunden. Rechtschreibung prüfen oder registrieren.',
      errorIncorrect: 'Falsche Zugangsdaten. Nutze „Zugang zurücksetzen“ bei Bedarf.',
      errorAllFields: 'Alle Felder (inkl. 4-stelliger PIN) sind Pflicht.',
      errorChildFields: 'Name und Passwort werden benötigt.',
      errorResetNoAdmin: 'Noch kein Eltern-Hub zum Zurücksetzen vorhanden.',
      errorResetFailed: 'Verifizierung fehlgeschlagen. Recovery-Key oder Eltern-E-Mail prüfen.',
      errorEnterPin: 'Bitte eine neue PIN angeben.',
      alertPinSaved: 'Erfolg! Deine Admin-PIN wurde aktualisiert. Bitte melde dich an.',
    },
    activities: {
      header: 'Bibel-Quest',
      description: 'Offline-Fragenpool für acht Epochen, funktioniert auch ohne KI.',
      loadingTitle: 'Alte Schriftrollen werden gesammelt...',
      loadingSubtitle: 'Bereite deine Mission vor',
      victoryTitle: 'Sieg!',
      victorySubtitle: 'Du hast diese Epoche bezwungen.',
      victoryXpLabel: 'XP ERZIELT',
      victoryBadgeLabel: 'Abzeichen erhalten',
      incorrectTitle: 'Nicht ganz',
      incorrectDescription: '„{option}“ passt diesmal nicht zur Geschichte!',
      correctionPrompt: 'Die richtige Antwort ist',
      correctionButton: 'Reise fortsetzen',
      fallbackAlert: 'Die Zauberschriftrollen sind verstaubt! Lokales Quiz lädt...',
      fallbackHint: 'Lokales Quiz ist bereit, damit das Abenteuer weitergeht.',
      startButton: 'Quest fortsetzen',
      offlineNote: 'Offline-Wissen ist einsatzbereit – keine KI nötig.',
      retryButton: 'Zurück zum Hub',
    },
    stories: {
      createTitle: 'Schreibe ein Abenteuer',
      createSubtitle: 'Rufe eine neue Geschichte für die Fantasie herbei.',
      saveButton: 'In Bibliothek speichern',
      libraryTitle: 'Geschichtenbibliothek',
      libraryToggleExpand: 'Bibliothek öffnen',
      libraryToggleCollapse: 'Bibliothek schließen',
      readAloud: 'Vorlesen',
      stopReading: 'Stopp',
      emptyState: 'Noch keine Geschichten. Lasst die Familie beitragen!',
      savedAlert: 'Geschichte gespeichert! +50 XP',
      familyMadeTag: 'Familie erstellt',
    },
    drawing: {
      title: 'Magisches Atelier',
      subtitle: 'Skizziere, verwandle und teile kreative Meisterwerke.',
      loadingMagicDust: 'Streue magischen Staub...',
      loadingTemplate: 'Vorlage wird geladen...',
      loadingDrawing: 'Dein Bild entsteht...',
      loadingClean: 'Linien werden bereinigt...',
      loadingTransform: 'Wandelt ins echte Leben...',
      storyStepHero: 'Schritt 1: Zeichne den Helden!',
      storyStepVillain: 'Schritt 2: Zeichne den Schurken!',
      storyStepSetting: 'Schritt 3: Zeichne den Schauplatz!',
      storyNextButton: 'Weiter',
      galleryEmpty: 'Noch leer! Zeichne etwas Großartiges.',
      templateHeader: 'Vorlage auswählen',
      saveLabel: 'Speichern',
      downloadLabel: 'Herunterladen',
      closeLabel: 'Schließen',
      storyModeLabel: 'Geschichtenmodus',
      templatesLabel: 'Vorlagen',
      musicTrackLabel: 'Soundtracks',
      storySaved: 'Gespeichert!',
      downloadReady: 'Herunterladen!',
      readyToEdit: 'Bereit zum Bearbeiten!',
      storyModeHint: 'Verwandle Zeichnungen in Geschichten',
      aiLoadingFailed: 'Oh nein, Magie ist fehlgeschlagen.',
    },
    countdown: {
      title: 'Event-Radar',
      subtitle: 'Zähle die Tage bis zum Spaß!',
      addButton: 'Neues Event',
      addTitle: 'Event hinzufügen',
      eventNamePlaceholder: 'Eventname (z. B. Disney-Trip)',
      eventDateLabel: 'Datum des Events',
      notifyPlaceholder: 'Eltern-E-Mail für Erinnerungen (optional)',
      saveButton: 'Speichern & Erinnern',
      cancelButton: 'Abbrechen',
      todayLabel: 'Heute!',
      daysLeftLabel: 'Tage verbleibend',
      noEvents: 'Noch keine Events. Starte den Countdown!',
    },
    shared: {
      languageButton: 'EN',
      welcomeBack: 'Willkommen zurück',
      hubBadge: 'ABENTEUER-HUB',
    },
  },
};



type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, fallback?: string, params?: Record<string, string>) => string;
};

const STORAGE_KEY = 'tiwaton_locale';

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => { },
  t: (key) => key,
});

const translateFromPath = (dictionary: Record<string, any>, path: string): string | undefined => {
  return path.split('.').reduce((acc: any, segment) => (acc && acc[segment] ? acc[segment] : undefined), dictionary);
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'de' ? 'de' : 'en';
    } catch (_e) {
      return 'en';
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, locale); } catch (_e) { }
    AudioService.setLocale(locale);
  }, [locale]);

  const t = useMemo(() => {
    return (path: string, fallback?: string, params?: Record<string, string>) => {
      const dictionary = TRANSLATIONS[locale];
      const raw = translateFromPath(dictionary, path);
      const base = (raw || fallback || path) as string;
      if (!params) return base;
      return Object.keys(params).reduce((acc, key) => acc.replace(new RegExp(`\{${key}\}`, 'g'), params[key]), base);
    };
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
