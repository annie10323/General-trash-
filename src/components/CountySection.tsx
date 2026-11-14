import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Phone,
  ExternalLink,
  ShieldAlert,
  Info,
  Sparkles,
  Layers,
  ChevronRight,
  BookmarkCheck,
} from 'lucide-react';
import { TAIWAN_COUNTIES } from '../data/countyData';
import { CountyInfo, CountyCategoryDetail, TaiwanRegion } from '../types';

interface CountySectionProps {
  currentCountyId: string;
  onSelectCounty: (countyId: string) => void;
}

export const CountySection: React.FC<CountySectionProps> = ({
  currentCountyId,
  onSelectCounty,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<TaiwanRegion | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCountyId, setActiveCountyId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Region tabs
  const regions: Array<{ id: TaiwanRegion | 'ALL'; label: string }> = [
    { id: 'ALL', label: '全台灣 (22縣市)' },
    { id: 'NORTH', label: '北部' },
    { id: 'CENTRAL', label: '中部' },
    { id: 'SOUTH', label: '南部' },
    { id: 'EAST', label: '東部' },
    { id: 'ISLAND', label: '離島' },
  ];

  // Filtered counties
  const filteredCounties = useMemo(() => {
    return TAIWAN_COUNTIES.filter((county) => {
      const matchRegion = selectedRegion === 'ALL' || county.region === selectedRegion;
      const matchSearch =
        searchTerm.trim() === '' ||
        county.name.includes(searchTerm) ||
        county.shortName.includes(searchTerm) ||
        county.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        county.highlightRules.some((r) => r.includes(searchTerm));
      return matchRegion && matchSearch;
    });
  }, [selectedRegion, searchTerm]);

  // Active county object if viewing details
  const activeCounty = useMemo(() => {
    if (!activeCountyId) return null;
    return TAIWAN_COUNTIES.find((c) => c.id === activeCountyId) || null;
  }, [activeCountyId]);

  const currentCountyObj = useMemo(() => {
    return TAIWAN_COUNTIES.find((c) => c.id === currentCountyId) || TAIWAN_COUNTIES[0];
  }, [currentCountyId]);

  const getCategoryTheme = (color: string) => {
    switch (color) {
      case 'amber':
        return {
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300 dark:border-amber-800',
          border: 'border-amber-300 dark:border-amber-700',
          dot: 'bg-amber-500',
        };
      case 'yellow':
        return {
          badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800',
          border: 'border-yellow-300 dark:border-yellow-700',
          dot: 'bg-yellow-500',
        };
      case 'green':
        return {
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800',
          border: 'border-emerald-300 dark:border-emerald-700',
          dot: 'bg-emerald-500',
        };
      case 'red':
        return {
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border-rose-300 dark:border-rose-800',
          border: 'border-rose-300 dark:border-rose-700',
          dot: 'bg-rose-500',
        };
      case 'blue':
        return {
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200 border-blue-300 dark:border-blue-800',
          border: 'border-blue-300 dark:border-blue-700',
          dot: 'bg-blue-500',
        };
      case 'purple':
        return {
          badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-200 border-purple-300 dark:border-purple-800',
          border: 'border-purple-300 dark:border-purple-700',
          dot: 'bg-purple-500',
        };
      default:
        return {
          badge: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
          border: 'border-slate-300 dark:border-slate-700',
          dot: 'bg-slate-500',
        };
    }
  };

  // If a county is selected, display its full detail page
  if (activeCounty) {
    const isCurrentActive = activeCounty.id === currentCountyId;

    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Back and Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveCountyId(null);
              setSelectedCategoryId(null);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回縣市列表</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectCounty(activeCounty.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold shadow-sm transition-all ${
                isCurrentActive
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/50'
                  : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90'
              }`}
            >
              {isCurrentActive ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>目前指定適用縣市</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>設為我的居住縣市</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero County Card */}
        <div className="bg-gradient-to-br from-teal-700 via-emerald-700 to-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide">
              {activeCounty.regionName}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                activeCounty.bagPolicy === 'DEDICATED_BAG'
                  ? 'bg-amber-400 text-amber-950'
                  : 'bg-teal-300 text-teal-950'
              }`}
            >
              {activeCounty.bagPolicy === 'DEDICATED_BAG'
                ? '專用垃圾袋（隨袋徵收）'
                : '免專用袋（隨水費徵收）'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 flex items-center gap-2">
            {activeCounty.name}
            <span className="text-base sm:text-lg font-normal text-teal-200">
              {activeCounty.englishName}
            </span>
          </h2>

          <p className="text-teal-100 text-xs sm:text-sm max-w-2xl leading-relaxed mt-2 mb-6">
            {activeCounty.bagPolicyDesc}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/20 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5 bg-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <Calendar className="w-5 h-5 text-teal-200 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">清運時程習慣</span>
                <span className="text-teal-100 text-xs">{activeCounty.scheduleSummary}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <Layers className="w-5 h-5 text-teal-200 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">廚餘政策</span>
                <span className="text-teal-100 text-xs">{activeCounty.foodWastePolicy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights and Trap warnings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm sm:text-base">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <h3>{activeCounty.name}垃圾清運重點與地方規範注意事項</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {activeCounty.highlightRules.map((rule, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories Section in this County */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{activeCounty.name}的垃圾分類項目與投遞標準</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {activeCounty.categories.length} 大分類
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                點選下方各分類，即可查看合格回收項目、常見丟棄陷阱與正確處置撇步
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeCounty.categories.map((cat, idx) => {
              const theme = getCategoryTheme(cat.binColor);
              const isExpanded = selectedCategoryId === cat.id || selectedCategoryId === null;

              return (
                <div
                  key={`${cat.id}-${idx}`}
                  className={`bg-white dark:bg-slate-900 rounded-3xl border ${theme.border} p-5 sm:p-6 shadow-sm transition-all hover:shadow-md`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full ${theme.dot} ring-4 ring-slate-100 dark:ring-slate-800`} />
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        {cat.name}
                      </h4>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${theme.badge}`}>
                      {cat.binColor === 'stone'
                        ? '一般垃圾車'
                        : cat.binColor === 'green' || (cat.binColor === 'amber' && cat.name.includes('廚餘'))
                        ? '廚餘專用桶'
                        : cat.binColor === 'red'
                        ? '有害獨立交運'
                        : '資源回收車'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                    {cat.summary}
                  </p>

                  {/* Accepted vs Rejected Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
                    {/* Accepted Items */}
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 p-3.5 rounded-2xl">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>可投遞 / 合格項目</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.acceptedItems.map((item, itemIdx) => (
                          <span
                            key={itemIdx}
                            className="text-xs px-2.5 py-1 rounded-lg bg-white/90 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100 font-medium border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rejected Items */}
                    <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/60 p-3.5 rounded-2xl">
                      <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 font-extrabold text-xs mb-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        <span>嚴禁混入 / 常見誤投</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.rejectedItems.map((item, itemIdx) => (
                          <span
                            key={itemIdx}
                            className="text-xs px-2.5 py-1 rounded-lg bg-white/90 dark:bg-rose-900/60 text-rose-900 dark:text-rose-100 font-medium border border-rose-200 dark:border-rose-800 shadow-2xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preparation Tips & Warnings */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl">
                      <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">處置與投放指引：</strong>
                        {cat.preparationTip}
                      </span>
                    </div>

                    {cat.scheduleTip && (
                      <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl">
                        <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-900 dark:text-white">清運日程提醒：</strong>
                          {cat.scheduleTip}
                        </span>
                      </div>
                    )}

                    {cat.specialWarning && (
                      <div className="flex items-start gap-2 text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3 rounded-xl font-medium">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>{cat.specialWarning}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Contact Info */}
        <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                {activeCounty.officialContact.department}
              </span>
              <span>聯絡諮詢電話：{activeCounty.officialContact.phone}</span>
            </div>
          </div>

          {activeCounty.officialContact.websiteUrl && (
            <a
              href={activeCounty.officialContact.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
            >
              <span>前往環保局官網</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    );
  }

  // County List View
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold tracking-widest text-emerald-100 uppercase">
            全台 22 縣市垃圾分類與清運專區
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
          各縣市垃圾分類方法查詢
        </h2>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
          台灣各縣市垃圾清運規範各具特色：從雙北專用垃圾袋互通、台中生廚餘綠能發電、彰化全台最嚴格破袋稽查，到離島船運回本島處理。點擊任何縣市，即可查閱專屬分類規定與清運指引！
        </p>

        {/* Current Active County Pill */}
        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white border border-white/25">
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
          <span>目前套用縣市：{currentCountyObj.name}（{currentCountyObj.bagPolicy === 'DEDICATED_BAG' ? '專用垃圾袋' : '隨水費徵收'}）</span>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋縣市名稱，如：台北市、台中市、彰化縣、金門..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-800 placeholder-slate-400 text-sm font-medium shadow-md focus:outline-hidden focus:ring-4 focus:ring-emerald-300 transition-all"
          />
        </div>
      </div>

      {/* Region Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-600 dark:text-slate-300 flex-shrink-0 ml-1" />
        {regions.map((reg) => (
          <button
            key={reg.id}
            type="button"
            onClick={() => setSelectedRegion(reg.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
              selectedRegion === reg.id
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {reg.label}
          </button>
        ))}
      </div>

      {/* Counties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCounties.map((county) => {
          const isSelected = county.id === currentCountyId;

          return (
            <div
              key={county.id}
              onClick={() => setActiveCountyId(county.id)}
              className={`group bg-white dark:bg-slate-900 border rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-2xl shadow-xs">
                  目前指定
                </div>
              )}

              <div>
                {/* County Name and Tags */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-sm">
                      {county.shortName.slice(0, 2)}
                    </span>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {county.name}
                      </h3>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {county.englishName}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    {county.regionName}
                  </span>
                </div>

                {/* Badges: Bag Policy & Food Waste */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                      county.bagPolicy === 'DEDICATED_BAG'
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                    }`}
                  >
                    {county.bagPolicy === 'DEDICATED_BAG'
                      ? '🏷️ 專用垃圾袋 (隨袋徵收)'
                      : '💧 隨自來水費徵收'}
                  </span>

                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    🍱 {county.foodWastePolicy.split('。')[0]}
                  </span>
                </div>

                {/* Highlights */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {county.highlightRules[0]}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>查看分類項目與清運指引 ({county.categories.length} 項)</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredCounties.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-slate-600 dark:text-slate-300 text-sm">找不到符合「{searchTerm}」的縣市資料。</p>
        </div>
      )}
    </div>
  );
};
