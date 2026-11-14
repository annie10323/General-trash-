import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Star,
  Search,
  Filter,
  Volume2,
  Navigation,
  Info,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { TAIWAN_COUNTIES } from '../data/countyData';
import { getCountyTruckSchedule } from '../data/truckScheduleData';
import { TruckRoutePoint, CountyTruckSchedule } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';

interface TruckTrackerSectionProps {
  currentCountyId: string;
  onSelectCounty: (countyId: string) => void;
}

const FAVORITES_STORAGE_KEY = 'ecosort_truck_favorites_v1';

export const TruckTrackerSection: React.FC<TruckTrackerSectionProps> = ({
  currentCountyId,
  onSelectCounty,
}) => {
  const { language, t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<'ALL' | 'FIXED_POINT' | 'REGULAR_ROUTE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteSpots, setFavoriteSpots] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Current real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (spotId: string) => {
    setFavoriteSpots((prev) => {
      const next = prev.includes(spotId) ? prev.filter((id) => id !== spotId) : [...prev, spotId];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const countyObj = useMemo(() => {
    return TAIWAN_COUNTIES.find((c) => c.id === currentCountyId) || TAIWAN_COUNTIES[0];
  }, [currentCountyId]);

  const schedule: CountyTruckSchedule = useMemo(() => {
    return getCountyTruckSchedule(currentCountyId, countyObj.name);
  }, [currentCountyId, countyObj.name]);

  // Day of week check (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDay = currentTime.getDay();
  const dayNamesMap: Record<Language, string[]> = {
    'zh-TW': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    'en': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'ja': ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  };
  const currentDayName = (dayNamesMap[language] || dayNamesMap['zh-TW'])[currentDay];
  const isTodayOff = schedule.offDays.includes(currentDay);

  // Today's recycling rule determination
  const todayRecycleInfo = useMemo(() => {
    if (isTodayOff) {
      return { type: 'NONE', title: t('truck.statusOff'), desc: schedule.offDaysText };
    }
    if (schedule.todayRecycleType.planeDays.includes(currentDay)) {
      return {
        type: 'PLANE',
        title: t('truck.planeRecycleTitle'),
        desc: t('truck.planeRecycleDesc'),
      };
    }
    if (schedule.todayRecycleType.solidDays.includes(currentDay)) {
      return {
        type: 'SOLID',
        title: t('truck.solidRecycleTitle'),
        desc: t('truck.solidRecycleDesc'),
      };
    }
    return {
      type: 'STANDARD',
      title: t('truck.standardRecycleTitle'),
      desc: t('truck.standardRecycleDesc'),
    };
  }, [currentDay, isTodayOff, schedule, t]);

  // Filtered route points
  const filteredRoutes = useMemo(() => {
    return schedule.routes.filter((route) => {
      const matchDistrict = selectedDistrict === 'ALL' || route.district === selectedDistrict;
      const matchType = filterType === 'ALL' || route.type === filterType;
      const matchQuery =
        searchQuery.trim() === '' ||
        route.spotName.includes(searchQuery) ||
        route.address.includes(searchQuery) ||
        route.district.includes(searchQuery);
      return matchDistrict && matchType && matchQuery;
    });
  }, [schedule.routes, selectedDistrict, filterType, searchQuery]);

  // Sort: favorites first, then by arrival time
  const sortedRoutes = useMemo(() => {
    return [...filteredRoutes].sort((a, b) => {
      const isFavA = favoriteSpots.includes(a.id);
      const isFavB = favoriteSpots.includes(b.id);
      if (isFavA && !isFavB) return -1;
      if (!isFavA && isFavB) return 1;
      return a.arrivalTime.localeCompare(b.arrivalTime);
    });
  }, [filteredRoutes, favoriteSpots]);

  // Calculation for next upcoming collection
  const upcomingInfo = useMemo(() => {
    if (isTodayOff) return null;

    const currentHour = currentTime.getHours();
    const currentMin = currentTime.getMinutes();
    const currentMinutesFromMidnight = currentHour * 60 + currentMin;

    // Find the nearest upcoming route today
    const upcoming = schedule.routes
      .map((r) => {
        const [h, m] = r.arrivalTime.split(':').map(Number);
        const mins = h * 60 + m;
        return { route: r, mins, diff: mins - currentMinutesFromMidnight };
      })
      .filter((x) => x.diff > 0)
      .sort((a, b) => a.diff - b.diff)[0];

    if (!upcoming) {
      return {
        status: 'COMPLETED',
        message: '今日晚間班次已全數清運完畢',
        nextTime: null,
      };
    }

    const diffHrs = Math.floor(upcoming.diff / 60);
    const diffMins = upcoming.diff % 60;

    return {
      status: 'UPCOMING',
      route: upcoming.route,
      diffHrs,
      diffMins,
      message: `距離下一班垃圾車（${upcoming.route.spotName}）還有約 ${
        diffHrs > 0 ? `${diffHrs} 小時 ` : ''
      }${diffMins} 分鐘`,
    };
  }, [isTodayOff, currentTime, schedule.routes]);

  // Time comparison status for each route
  const getRouteStatus = (arrivalTime: string) => {
    if (isTodayOff) return { badge: '今日停收', color: 'bg-slate-200 text-slate-700' };

    const currentHour = currentTime.getHours();
    const currentMin = currentTime.getMinutes();
    const nowMins = currentHour * 60 + currentMin;

    const [h, m] = arrivalTime.split(':').map(Number);
    const routeMins = h * 60 + m;
    const diff = routeMins - nowMins;

    if (diff > 15) {
      return {
        badge: t('truck.statusOnTime'),
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200 border-blue-200 dark:border-blue-800',
      };
    }
    if (diff >= -10 && diff <= 15) {
      return {
        badge: t('truck.statusArriving'),
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-200 border-amber-300 dark:border-amber-700 animate-pulse',
      };
    }
    return {
      badge: t('truck.statusPassed'),
      color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & County Switcher */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-sky-200" />
            <span className="text-xs font-bold tracking-widest text-sky-100 uppercase">
              {t('truck.tagline')}
            </span>
          </div>

          {/* Current Real-time Clock */}
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-sky-100">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {currentDayName} {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>{countyObj.name} {t('truck.title')}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                {countyObj.bagPolicy === 'DEDICATED_BAG' ? t('truck.dedicatedBag') : t('truck.waterFee')}
              </span>
            </h2>
            <p className="text-sky-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              {t('truck.subtitle')}
            </p>
          </div>

          {/* Quick County Picker Dropdown */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex-shrink-0">
            <MapPin className="w-4 h-4 text-amber-300 ml-2" />
            <select
              value={currentCountyId}
              onChange={(e) => onSelectCounty(e.target.value)}
              className="bg-transparent text-white font-bold text-xs sm:text-sm rounded-xl px-2 py-1 focus:outline-hidden cursor-pointer"
            >
              {TAIWAN_COUNTIES.map((c) => (
                <option key={c.id} value={c.id} className="text-slate-900 bg-white">
                  {c.name} ({c.regionName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Today's Collection Status Badge */}
        <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
          {/* Status Box */}
          <div
            className={`p-4 rounded-2xl flex items-start gap-3 backdrop-blur-md ${
              isTodayOff
                ? 'bg-rose-500/30 border border-rose-300/40 text-rose-50'
                : 'bg-emerald-500/30 border border-emerald-300/40 text-emerald-50'
            }`}
          >
            {isTodayOff ? (
              <AlertTriangle className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-extrabold text-sm text-white">
                {isTodayOff ? t('truck.statusOff') : t('truck.statusActive')}
              </div>
              <div className="text-xs opacity-90 mt-0.5 leading-relaxed">
                {isTodayOff
                  ? `${schedule.offDaysText}。${t('truck.offDaysWarning')}`
                  : schedule.collectionDaysSummary}
              </div>
            </div>
          </div>

          {/* Recycling Focus Box */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-sky-100 flex items-start gap-3 backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sm text-white">
                {todayRecycleInfo.title}
              </div>
              <div className="text-xs text-sky-100 mt-0.5 leading-relaxed">
                {todayRecycleInfo.desc}
              </div>
            </div>
          </div>
        </div>

        {/* Live Countdown Alert if active */}
        {!isTodayOff && upcomingInfo?.status === 'UPCOMING' && (
          <div className="mt-3.5 bg-amber-400 text-amber-950 px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin flex-shrink-0" />
              <span>{upcomingInfo.message}</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-900 text-amber-100 font-black">
              {t('truck.countdownArrived')}
            </span>
          </div>
        )}
      </div>

      {/* Official Government GPS Tracking Gateway Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {schedule.officialTrackerName}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {schedule.officialAppTip || t('truck.gpsMapDesc')}
          </p>
        </div>

        {schedule.officialTrackerUrl && (
          <a
            href={schedule.officialTrackerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/30 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
          >
            <span>{t('truck.openGpsBtn')}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t('truck.queryTitle')}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredRoutes.length} {t('truck.stopsCount')}
            </span>
          </h4>

          {/* District Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{t('truck.districtLabel')}</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">{t('truck.allDistricts')}</option>
              {schedule.districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input & Slot Type Pills */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('truck.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterType === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {t('truck.filterAll')}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('FIXED_POINT')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterType === 'FIXED_POINT'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {t('truck.filterMorning')}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('REGULAR_ROUTE')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterType === 'REGULAR_ROUTE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {t('truck.filterEvening')}
            </button>
          </div>
        </div>
      </div>
      {/* Routes & Stops Cards */}
      <div className="space-y-3">
        {sortedRoutes.map((route) => {
          const isFav = favoriteSpots.includes(route.id);
          const status = getRouteStatus(route.arrivalTime);

          return (
            <div
              key={route.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-4 sm:p-5 shadow-sm transition-all hover:shadow-md ${
                isFav
                  ? 'border-amber-400/90 dark:border-amber-600/90 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Arrival Time Big Badge */}
                  <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex-shrink-0 shadow-md">
                    <span className="text-[10px] uppercase font-bold text-sky-200">抵達時間</span>
                    <span className="text-base sm:text-lg leading-none">{route.arrivalTime}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold">
                        {route.district}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                          route.type === 'FIXED_POINT'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {route.type === 'FIXED_POINT' ? '定時定點收運站' : '夜間沿線清運'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${status.color}`}>
                        {status.badge}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {route.spotName}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {route.address}
                    </p>
                  </div>
                </div>

                {/* Favorite Star Button */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(route.id)}
                  className={`p-2.5 rounded-2xl border transition-all self-end sm:self-auto ${
                    isFav
                      ? 'bg-amber-100 border-amber-300 text-amber-600 dark:bg-amber-900/60 dark:border-amber-700'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                  }`}
                  title={isFav ? '已加入常用站點' : '加到常用站點置頂'}
                >
                  <Star className={`w-5 h-5 ${isFav ? 'fill-amber-500' : ''}`} />
                </button>
              </div>

              {/* Items collected & Notes */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">可投遞：</span>
                  {route.collectedItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {route.notes && (
                  <span className="text-slate-500 dark:text-slate-400 italic">
                    💡 {route.notes}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {sortedRoutes.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <Truck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              在「{selectedDistrict === 'ALL' ? countyObj.name : selectedDistrict}」找不到符合條件的清運站點。
            </p>
          </div>
        )}
      </div>

      {/* Commuter Tips Section */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-base">
          <Info className="w-5 h-5 text-blue-600" />
          <span>{t('truck.commuterTipsTitle')}</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li className="flex items-start gap-2 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </span>
            <span>
              <strong>{t('truck.tip1Title')}</strong>
              {t('truck.tip1Desc')}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </span>
            <span>
              <strong>{t('truck.tip2Title')}</strong>
              {t('truck.tip2Desc')}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </span>
            <span>
              <strong>{t('truck.tip3Title')}</strong>
              {t('truck.tip3Desc')}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              4
            </span>
            <span>
              <strong>{t('truck.tip4Title')}</strong>
              {t('truck.tip4Desc')}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

