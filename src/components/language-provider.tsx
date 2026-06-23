"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "ko";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, ko: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: (en) => en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preferred-lang") as Lang | null;
    if (saved === "en" || saved === "ko") {
      setLangState(saved);
    } else {
      setShowModal(true);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("preferred-lang", l);
    setShowModal(false);
  };

  const t = (en: string, ko: string) => (lang === "ko" ? ko : en);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-2xl border bg-background p-8 shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4">
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold">🌐</p>
              <h2 className="text-xl font-bold">Choose your language</h2>
              <p className="text-sm text-muted-foreground">언어를 선택해주세요</p>
            </div>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setLang("en")}
                className="flex-1 flex flex-col items-center gap-1 rounded-xl border-2 border-transparent hover:border-foreground bg-muted hover:bg-background py-4 transition-all duration-200 font-semibold"
              >
                <span className="text-2xl">🇺🇸</span>
                <span className="text-sm">English</span>
              </button>
              <button
                onClick={() => setLang("ko")}
                className="flex-1 flex flex-col items-center gap-1 rounded-xl border-2 border-transparent hover:border-foreground bg-muted hover:bg-background py-4 transition-all duration-200 font-semibold"
              >
                <span className="text-2xl">🇰🇷</span>
                <span className="text-sm">한국어</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
