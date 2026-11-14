import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CameraScanner } from './components/CameraScanner';
import { AnalysisModal } from './components/AnalysisModal';
import { GuideSection } from './components/GuideSection';
import { CountySection } from './components/CountySection';
import { TruckTrackerSection } from './components/TruckTrackerSection';
import { QuizSection } from './components/QuizSection';
import { ScanHistory } from './components/ScanHistory';
import { WasteAnalysisResult, ScanHistoryItem } from './types';
import { TAIWAN_COUNTIES } from './data/countyData';
import { AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';

const STORAGE_KEY = 'ecosort_scan_history_v1';
const COUNTY_STORAGE_KEY = 'ecosort_selected_county_v1';

export default function App() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'camera' | 'truck' | 'city' | 'guide' | 'quiz' | 'history'>('camera');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<WasteAnalysisResult | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selected County state
  const [selectedCountyId, setSelectedCountyId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(COUNTY_STORAGE_KEY);
      if (saved && TAIWAN_COUNTIES.some((c) => c.id === saved)) return saved;
    } catch (e) {}
    return 'taipei';
  });

  useEffect(() => {
    try {
      localStorage.setItem(COUNTY_STORAGE_KEY, selectedCountyId);
    } catch (e) {}
  }, [selectedCountyId]);

  const currentCounty =
    TAIWAN_COUNTIES.find((c) => c.id === selectedCountyId) || TAIWAN_COUNTIES[0];

  // History state loaded from localStorage
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
    return [];
  });

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Calculate total eco points
  const totalEcoPoints = history.reduce(
    (sum, item) => sum + (item.completedAt ? item.ecoPoints : 0),
    0
  );

  const handleAnalyze = async (imageDataUrl: string, sampleDescription?: string) => {
    try {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setCurrentImage(imageDataUrl);

      let result: WasteAnalysisResult | null = null;

      try {
        const response = await fetch('/api/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: imageDataUrl,
            userPrompt: sampleDescription,
            region: 'tw',
            county: currentCounty.id,
            countyName: currentCounty.name,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.result) {
            result = data.result;
          }
        }
      } catch (networkErr) {
        console.warn('Backend API unavailable, attempting client simulation fallback', networkErr);
      }

      // Client simulation fallback (e.g. static GitHub Pages hosting or API offline)
      if (!result) {
        // Generate contextual result matching the selected county
        const isBento = sampleDescription?.includes('便當') || sampleDescription?.includes('餐盒');
        const isBoba = sampleDescription?.includes('飲料') || sampleDescription?.includes('手搖');
        const isBattery = sampleDescription?.includes('電池');
        const isBone = sampleDescription?.includes('骨頭') || sampleDescription?.includes('生廚餘') || sampleDescription?.includes('廚餘');

        const countyBagNote =
          currentCounty.bagPolicy === 'DEDICATED_BAG'
            ? `【${currentCounty.name}規定】一般垃圾請務必使用雙北專用垃圾袋包紮投遞。`
            : `【${currentCounty.name}規定】隨水費徵收，免用專用袋，但不可使用黑色不透明袋。`;

        if (isBoba) {
          result = {
            itemName: '手搖飲料塑膠杯（含封口膜與吸管）',
            englishName: 'Boba Plastic Cup with Sealing Film',
            category: 'RECYCLABLE_PLASTIC',
            categoryName: '塑膠回收 / 部分一般垃圾',
            targetBinColor: 'yellow',
            confidence: 0.95,
            summary: `杯身為 PP 5 號可回收塑膠，但封口膜與塑膠吸管為複合髒污材質，請撕除丟一般垃圾。${countyBagNote}`,
            disposalSteps: [
              '倒空杯內殘存冰塊茶水或珍珠',
              '撕除表面膠膜，將封口膜與細吸管投入一般垃圾袋',
              '清水簡單沖洗杯身內部',
              '將塑膠杯身踩扁或疊放投入塑膠回收桶',
            ],
            componentsBreakdown: [
              { partName: '塑膠杯身 (PP 5號)', material: '聚丙烯', targetBin: '塑膠回收', actionNote: '沖洗壓扁後回收' },
              { partName: '杯口封膜', material: '複合塑膠膜', targetBin: '一般垃圾', actionNote: '撕除投入一般垃圾袋' },
              { partName: '塑膠吸管', material: 'PP塑膠', targetBin: '一般垃圾', actionNote: '沾染唾液多為一般垃圾' },
            ],
            recyclingCode: '♷ 5號 PP',
            ecoImpact: '正確回收 1 個塑膠手搖杯可減少約 35g 碳排放。',
            commonMistakes: '誤將封口膜與吸管連同杯子整杯丟入塑膠回收桶。',
            cleanlinessRequirement: '需倒空殘茶並沖洗乾淨。',
            wasteReductionTips: [
              '出門自備環保杯，台灣法規自備飲料杯可現折至少 5 元！',
              '改用可重複清洗的不鏽鋼或玻璃粗吸管。',
            ],
          };
        } else if (isBento) {
          result = {
            itemName: '外帶紙餐盒（含剩菜骨頭與免洗筷）',
            englishName: 'Paper Bento Box with Leftovers',
            category: 'RECYCLABLE_PAPER_CONTAINER',
            categoryName: '紙容器回收（非純紙類）',
            targetBinColor: 'amber',
            confidence: 0.94,
            summary: `紙餐盒內層含食用級 PE 淋膜，需歸入「紙容器類」而非純紙箱。免洗竹筷與髒衛生紙屬一般垃圾。${countyBagNote}`,
            disposalSteps: [
              `將殘餘菜餚與骨頭倒入廚餘桶或一般垃圾（${currentCounty.name}規範：大骨頭為一般垃圾）`,
              '抽出免洗竹筷丟入一般垃圾桶',
              '用紙巾刮除多餘油脂，以少量清水快速沖洗乾淨',
              '瀝乾水分後壓扁投入紙容器回收專區',
            ],
            componentsBreakdown: [
              { partName: '紙餐盒主體', material: 'PE淋膜紙板', targetBin: '紙容器回收', actionNote: '沖洗瀝乾壓扁' },
              { partName: '免洗竹筷', material: '竹木', targetBin: '一般垃圾', actionNote: '不可回收' },
              { partName: '剩菜殘渣', material: '廚餘', targetBin: currentCounty.name.includes('台中') ? '綠桶/黃桶廚餘' : '廚餘桶', actionNote: '瀝乾水分' },
            ],
            ecoImpact: '每回收 1 噸紙容器可挽救約 20 棵成樹並省水 7,000 加侖。',
            commonMistakes: '誤把紙餐盒混入一般紙類（影印紙、紙箱），造成散漿造紙機故障。',
            cleanlinessRequirement: '若油污完全無法洗淨（例如發黑發臭），請改丟一般垃圾。',
            wasteReductionTips: [
              '自備不鏽鋼或玻璃保鮮便當盒外帶。',
              '響應政府推廣之循環便當盒租借服務。',
            ],
          };
        } else if (isBattery) {
          result = {
            itemName: '廢乾電池 / 鹼性電池',
            englishName: 'Used Dry Battery',
            category: 'HAZARDOUS_WASTE',
            categoryName: '有害資源垃圾（單獨回收）',
            targetBinColor: 'red',
            confidence: 0.98,
            summary: `含重金屬鋅、錳、鎳，嚴禁投入一般垃圾車以免壓縮爆裂起火！請於指定回收日交付資收人員或攜至超商折抵消費。`,
            disposalSteps: [
              '自電器中取出，檢查是否有電解液漏液現象',
              '若為鋰電池或鈕扣電池，建議在電極兩端黏貼絕緣透明膠帶防短路',
              '存放於乾燥寶特瓶或小盒中集中保管',
              `交付清潔隊資收車有害垃圾專用箱，或於四大超商秤重折抵購物金`,
            ],
            componentsBreakdown: [
              { partName: '電池芯體', material: '金屬與重金屬', targetBin: '有害廢棄物', actionNote: '單獨交運' },
            ],
            ecoImpact: '1 顆 1 號電池腐爛可能污染 12 萬公升水，相當於一個人一生的飲水量。',
            commonMistakes: '混入一般垃圾袋丟棄，在垃圾車壓縮機內摩擦起火爆炸。',
            cleanlinessRequirement: '保持乾燥，漏液時戴手套擦拭裝袋。',
            wasteReductionTips: [
              '改用可充式鋰電池或鎳氫充電電池，可循環重複充放電 500 次以上。',
            ],
          };
        } else {
          // Default contextual result
          result = {
            itemName: '生活廢棄物品',
            englishName: 'Household Waste Item',
            category: 'GENERAL_WASTE',
            categoryName: '生活垃圾 / 資源物分類',
            targetBinColor: 'stone',
            confidence: 0.88,
            summary: `依據【${currentCounty.name}】地方垃圾清運規定，請確認物品是否具備回收標誌。${countyBagNote}`,
            disposalSteps: [
              '檢視物品外包裝之環保回收標誌（1至7號）',
              '乾淨無油污之塑膠、金屬、紙容器請交由資源回收車',
              `沾染油污髒損無法清理之雜物，請放入${currentCounty.bagPolicy === 'DEDICATED_BAG' ? '專用垃圾袋' : '垃圾袋'}交付垃圾車`,
            ],
            componentsBreakdown: [
              { partName: '主體結構', material: '複合材質', targetBin: '依材質分流', actionNote: '清空沖洗' },
            ],
            ecoImpact: '落實日常垃圾分類，台灣資源回收率已突破 55%，居全球前列。',
            commonMistakes: '未經清洗即直接投入回收桶。',
            cleanlinessRequirement: '遵循「清空、沖洗、瀝乾、壓扁」原則。',
            wasteReductionTips: [
              '源頭減量：少用一次性拋棄式包裝，自備環保袋與餐具。',
            ],
          };
        }
      }

      const historyId = 'scan_' + Date.now();
      const newHistoryItem: ScanHistoryItem = {
        id: historyId,
        timestamp: Date.now(),
        imageUrl: imageDataUrl,
        result,
        ecoPoints: 50,
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
      setCurrentHistoryId(historyId);
      setCurrentResult(result);
    } catch (err: any) {
      console.error('Classification error:', err);
      setErrorMessage(err?.message || '辨識失敗，請確認網路連線或換個角度重試。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCompleteSorting = () => {
    if (!currentHistoryId) return;
    setHistory((prev) =>
      prev.map((item) =>
        item.id === currentHistoryId && !item.completedAt
          ? { ...item, completedAt: Date.now() }
          : item
      )
    );
  };

  const handleSelectHistoryItem = (item: ScanHistoryItem) => {
    setCurrentImage(item.imageUrl);
    setCurrentResult(item.result);
    setCurrentHistoryId(item.id);
  };

  const handleClearHistory = () => {
    if (window.confirm('確定要清除所有辨識紀錄嗎？')) {
      setHistory([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  };

  const isCurrentCompleted = Boolean(
    history.find((item) => item.id === currentHistoryId)?.completedAt
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
        }}
        ecoPoints={totalEcoPoints}
        currentCountyName={currentCounty.name}
      />

      {/* Error Toast Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold text-xs"
            >
              關閉
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8 flex flex-col">
        {activeTab === 'camera' && (
          <div className="space-y-6">
            <div className="text-center max-w-md mx-auto mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('camera.title')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                {t('camera.subtitle')}
              </p>
            </div>

            <CameraScanner
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              currentCountyName={currentCounty.name}
              onOpenCountySelect={() => setActiveTab('city')}
            />
          </div>
        )}

        {activeTab === 'truck' && (
          <TruckTrackerSection
            currentCountyId={selectedCountyId}
            onSelectCounty={(id) => setSelectedCountyId(id)}
          />
        )}

        {activeTab === 'city' && (
          <CountySection
            currentCountyId={selectedCountyId}
            onSelectCounty={(id) => setSelectedCountyId(id)}
            onTrackTruck={(id) => {
              setSelectedCountyId(id);
              setActiveTab('truck');
            }}
          />
        )}

        {activeTab === 'guide' && <GuideSection />}

        {activeTab === 'quiz' && <QuizSection />}

        {activeTab === 'history' && (
          <ScanHistory
            history={history}
            onSelectHistoryItem={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Modal Result Pop-up */}
      {currentResult && (
        <AnalysisModal
          result={currentResult}
          imageUrl={currentImage}
          isCompleted={isCurrentCompleted}
          currentCountyName={currentCounty.name}
          onClose={() => setCurrentResult(null)}
          onCompleteSorting={handleCompleteSorting}
        />
      )}

      {/* Footer Info */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 py-4 text-center text-xs text-slate-600 dark:text-slate-300">
        <p>{t('footer.text')}</p>
      </footer>
    </div>
  );
}
