import React, { useState, useRef, useEffect } from 'react';
import { Camera, BookOpen, Award, History, Recycle, Sparkles, MapPin, Truck, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';

interface HeaderProps {
  activeTab: 'camera' | 'truck' | 'guide' | 'city' | 'quiz' | 'history';
  onTabChange: (tab: 'camera' | 'truck' | 'guide' | 'city' | 'quiz' | 'history') => void;
  ecoPoints: number;
  currentCountyName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  ecoPoints,
  currentCountyName = '臺北市',
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: Array<{ code: Language; label: string; flag: string }> = [
    { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const tabs = [
    { id: 'camera', labelKey: 'nav.camera', icon: Camera },
    { id: 'truck', labelKey: 'nav.truck', icon: Truck },
    { id: 'city', labelKey: 'nav.city', icon: MapPin },
    { id: 'guide', labelKey: 'nav.guide', icon: BookOpen },
    { id: 'quiz', labelKey: 'nav.quiz', icon: Award },
    { id: 'history', labelKey: 'nav.history', icon: History },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between">
        {/* Logo Branding */}
        <div
          onClick={() => onTabChange('camera')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Recycle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                EcoSort
              </span>
              <span className="text-xs font-black px-1.5 py-0.5 rounded-md bg-emerald-500 text-white leading-none">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium -mt-0.5">
              {t('header.subtitle')}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t(tab.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Language, County & Eco Points */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              title={t('header.langSelect')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{currentLangObj.flag}</span>
              <span className="hidden md:inline">{currentLangObj.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-1 animate-in fade-in zoom-in-95 duration-100">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      language === l.code
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* County quick-switch pill */}
          <button
            type="button"
            onClick={() => onTabChange('city')}
            title={t('header.switchCountyTip')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span className="max-w-[70px] truncate">{currentCountyName}</span>
          </button>

          {/* Eco Points Badge */}
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
              {ecoPoints}
            </span>
            <span className="text-[10px] text-emerald-600/80 font-bold hidden xs:inline">
              {t('nav.points')}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="sm:hidden flex items-center justify-around border-t border-slate-200/60 dark:border-slate-800 px-1 py-1.5 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 font-medium'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
