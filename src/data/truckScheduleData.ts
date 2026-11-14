import { CountyTruckSchedule } from '../types';

export const TRUCK_SCHEDULES: Record<string, CountyTruckSchedule> = {
  // 1. 台北市
  taipei: {
    countyId: 'taipei',
    countyName: '臺北市',
    offDays: [0, 3], // 每週日、三停收
    offDaysText: '每週三、週日停收垃圾與資收',
    collectionDaysSummary: '每週一、二、四、五、六夜間清運；市區設有定時定點收運站（早鳥 06:00~08:30 專區）。',
    todayRecycleType: {
      planeDays: [1, 5], // 週一、五 平面類
      solidDays: [2, 4, 6], // 週二、四、六 立體類
      specialNotes: '週一與週五收【平面類】（廢紙、乾淨塑膠袋、舊衣）；週二、週四、週六收【立體類】（塑膠容器、金屬鐵鋁、玻璃瓶罐、保麗龍）。',
    },
    officialTrackerName: '臺北市環保局定點定時清運暨垃圾車即時動態',
    officialTrackerUrl: 'https://data.gov.tw/dataset/6088',
    officialAppTip: '可下載「愛台北 APP」或進入環保局清運定位地圖，查詢各清運點垃圾車即時 GPS 位置與到站倒數。',
    districts: ['大安區', '信義區', '中山區', '松山區', '士林區', '北投區', '內湖區', '南港區', '文山區', '萬華區', '中正區', '大同區'],
    routes: [
      {
        id: 'tp-1',
        district: '大安區',
        spotName: '大安路一段 132 號前（仁愛醫院旁）',
        address: '臺北市大安區大安路一段 132 號',
        arrivalTime: '19:25',
        type: 'REGULAR_ROUTE',
        collectedItems: ['專用袋一般垃圾', '生熟廚餘', '當日指定資源回收'],
        notes: '夜間沿線主力車次，平均停等時間 5-8 分鐘。',
      },
      {
        id: 'tp-2',
        district: '大安區',
        spotName: '復興南路二段 148 巷口（科技大樓站旁）',
        address: '臺北市大安區復興南路二段 148 巷口',
        arrivalTime: '20:10',
        type: 'REGULAR_ROUTE',
        collectedItems: ['專用袋一般垃圾', '生熟廚餘', '資源回收車同行'],
        notes: '夜間清運，人潮較多請依序排隊投放。',
      },
      {
        id: 'tp-3',
        district: '大安區',
        spotName: '【日間定點】大安森林公園 1 號出口旁',
        address: '臺北市大安區新生南路二段大安森林公園旁',
        arrivalTime: '06:30',
        type: 'FIXED_POINT',
        collectedItems: ['專用袋一般垃圾', '廚餘', '全項資源回收'],
        notes: '上班族早鳥專用定點（06:00 ~ 08:30），免追夜間垃圾車。',
      },
      {
        id: 'tp-4',
        district: '信義區',
        spotName: '松仁路 215 巷口（象山步道周邊）',
        address: '臺北市信義區松仁路 215 巷',
        arrivalTime: '19:40',
        type: 'REGULAR_ROUTE',
        collectedItems: ['專用袋一般垃圾', '生熟廚餘', '當日指定資收物'],
        notes: '請務必使用雙北防偽專用垃圾袋包紮紮實。',
      },
      {
        id: 'tp-5',
        district: '信義區',
        spotName: '【日間定點】信義行政中心廣場旁',
        address: '臺北市信義區信義路五段 150 巷口',
        arrivalTime: '07:00',
        type: 'FIXED_POINT',
        collectedItems: ['專用袋一般垃圾', '生熟廚餘', '各類資源回收'],
        notes: '晨間固定收運點（06:30 ~ 08:50），設有專人引導分類。',
      },
      {
        id: 'tp-6',
        district: '中山區',
        spotName: '南京東路二段 115 巷口（四平商圈）',
        address: '臺北市中山區南京東路二段 115 巷口',
        arrivalTime: '19:50',
        type: 'REGULAR_ROUTE',
        collectedItems: ['專用袋一般垃圾', '熟廚餘', '生廚餘', '資源回收'],
        notes: '商圈收運車次，廚餘請確實瀝乾湯汁。',
      },
      {
        id: 'tp-7',
        district: '士林區',
        spotName: '中正路與文林路交叉口（士林捷運站周邊）',
        address: '臺北市士林區文林路 255 號前',
        arrivalTime: '20:30',
        type: 'REGULAR_ROUTE',
        collectedItems: ['專用袋一般垃圾', '生熟廚餘', '資源回收物'],
        notes: '大型家電家具需另外提前電話向清潔隊預約登記。',
      },
    ],
  },

  // 2. 新北市
  'new-taipei': {
    countyId: 'new-taipei',
    countyName: '新北市',
    offDays: [0, 3], // 每週日、三停收
    offDaysText: '每週三、週日停收垃圾與資收',
    collectionDaysSummary: '每週一、二、四、六夜間清運為主；早晨設有固定定時定點站點。',
    todayRecycleType: {
      planeDays: [1, 4],
      solidDays: [2, 6],
      specialNotes: '資收採透明袋包裝！週一、四收平面紙類與舊衣；週二、六收瓶罐立體類。',
    },
    officialTrackerName: '新北樂圾車即時清運定位便民網',
    officialTrackerUrl: 'https://crd-rubbish.epd.ntpc.gov.tw/',
    officialAppTip: '推薦至「新北樂圾車」網站搜尋住址或里別，可查詢 3D 垃圾車即時動態與抵達提示鬧鐘。',
    districts: ['板橋區', '中和區', '永和區', '新莊區', '三重區', '新店區', '土城區', '汐止區', '蘆洲區', '淡水區', '林口區', '三峽區', '樹林區', '鶯歌區'],
    routes: [
      {
        id: 'ntp-1',
        district: '板橋區',
        spotName: '文化路一段 188 巷口（油庫口麵線旁）',
        address: '新北市板橋區文化路一段 188 巷',
        arrivalTime: '19:15',
        type: 'REGULAR_ROUTE',
        collectedItems: ['新北/雙北專用袋垃圾', '全回收廚餘', '當日資收物'],
        notes: '雙北專用垃圾袋互通，禁止使用黑色不透光袋裝資收物。',
      },
      {
        id: 'ntp-2',
        district: '板橋區',
        spotName: '府中捷運站 1 號出口旁定點',
        address: '新北市板橋區縣民大道一段府中商圈',
        arrivalTime: '20:05',
        type: 'REGULAR_ROUTE',
        collectedItems: ['專用袋一般垃圾', '全回收廚餘', '資收專車'],
        notes: '夜間定點停靠約 10 分鐘。',
      },
      {
        id: 'ntp-3',
        district: '板橋區',
        spotName: '【日間定點】板橋萬坪都會公園旁',
        address: '新北市板橋區新府路口',
        arrivalTime: '06:40',
        type: 'FIXED_POINT',
        collectedItems: ['專用垃圾袋一般垃圾', '廚餘', '全項資源回收'],
        notes: '早鳥日間定時定點站（06:30 ~ 08:30），提供通勤上班族投放。',
      },
      {
        id: 'ntp-4',
        district: '中和區',
        spotName: '中和路與景安路口（南山高中旁）',
        address: '新北市中和區景安路 102 號',
        arrivalTime: '19:35',
        type: 'REGULAR_ROUTE',
        collectedItems: ['專用袋一般垃圾', '生熟廚餘', '資源回收'],
        notes: '垃圾車音樂響起後再出門，嚴禁提早落地棄置！',
      },
      {
        id: 'ntp-5',
        district: '新莊區',
        spotName: '新泰路與中正路交叉口（新莊夜市周邊）',
        address: '新北市新莊區新泰路 45 號',
        arrivalTime: '20:20',
        type: 'REGULAR_ROUTE',
        collectedItems: ['專用袋一般垃圾', '生熟廚餘', '資源回收車'],
        notes: '高壓瓶罐與瓦斯罐務必排空後獨立分袋交運。',
      },
    ],
  },

  // 3. 桃園市
  taoyuan: {
    countyId: 'taoyuan',
    countyName: '桃園市',
    offDays: [0, 3], // 每週日、三停收
    offDaysText: '每週三、週日停收垃圾與資收',
    collectionDaysSummary: '每週一、二、四、五、六收運一般垃圾與廚餘；資收車隨車分日清運。',
    todayRecycleType: {
      planeDays: [1, 4],
      solidDays: [2, 5, 6],
      specialNotes: '隨水費徵收，禁絕黑色不透光袋！請使用可辨識內容物之透光袋包紮。生廚餘請落實分類以供榮強生質能中心發電。',
    },
    officialTrackerName: '桃園垃圾車行動即時動態路線查詢系統',
    officialTrackerUrl: 'https://route.tydep.gov.tw/',
    officialAppTip: '可下載「桃園垃圾車 APP」，支援清運車到達前 5~15 分鐘推播到站鈴聲提醒。',
    districts: ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '龜山區', '龍潭區', '大溪區', '大園區'],
    routes: [
      {
        id: 'ty-1',
        district: '桃園區',
        spotName: '中正路與復興路口（桃園大廟旁）',
        address: '桃園市桃園區中正路 180 號',
        arrivalTime: '19:10',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾（免專用袋）', '熟廚餘', '生廚餘（綠能發電）', '資收物'],
        notes: '嚴格執行破袋檢查，混雜 3 件以上資收物整袋退回。',
      },
      {
        id: 'ty-2',
        district: '中壢區',
        spotName: '中正路與延平路口（中壢火車站商圈）',
        address: '桃園市中壢區中正路 92 號',
        arrivalTime: '19:45',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '熟廚餘', '生廚餘', '資源回收物'],
        notes: '夜間主力路線，尖峰時段車次密集。',
      },
      {
        id: 'ty-3',
        district: '桃園區',
        spotName: '【日間定點】朝陽森林公園旁清運點',
        address: '桃園市桃園區三民路二段朝陽公園',
        arrivalTime: '07:15',
        type: 'FIXED_POINT',
        collectedItems: ['一般生活垃圾', '生熟廚餘', '全項資收物'],
        notes: '早鳥通勤族定點專區（06:40 ~ 08:30）。',
      },
    ],
  },

  // 4. 台中市
  taichung: {
    countyId: 'taichung',
    countyName: '臺中市',
    offDays: [0, 3], // 每週日、三停收
    offDaysText: '每週三、週日停收垃圾與廚餘',
    collectionDaysSummary: '每週一、二、四、五、六清運；資源回收車定點定日分流清運。',
    todayRecycleType: {
      planeDays: [1, 4],
      solidDays: [2, 5, 6],
      specialNotes: '生熟廚餘嚴格分流！「綠桶」收集生廚餘送外埔綠能生態發電；「黃桶」收集熟廚餘養豬。週一、四收紙類/玻璃；週二、五、六收塑膠/金屬/保麗龍。',
    },
    officialTrackerName: '臺中市垃圾清運車即時動態查詢網',
    officialTrackerUrl: 'https://recycle.epb.taichung.gov.tw/cleantruck/',
    officialAppTip: '可下載「臺中垃圾清運大隊 APP」，在地圖上直接看見清運車即時移動軌跡與預估到達時間。',
    districts: ['西屯區', '北屯區', '南屯區', '西區', '北區', '中區', '東區', '南區', '豐原區', '大里區', '太平區', '沙鹿區', '清水區'],
    routes: [
      {
        id: 'tc-1',
        district: '西屯區',
        spotName: '逢甲路與福星路口（逢甲大學正門周邊）',
        address: '臺中市西屯區逢甲路 25 號',
        arrivalTime: '19:30',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾（免專用袋）', '綠桶生廚餘（發電）', '黃桶熟廚餘（養豬）', '當日資收物'],
        notes: '請落實綠桶生廚餘分流，果皮菜葉請勿混入一般垃圾。',
      },
      {
        id: 'tc-2',
        district: '西屯區',
        spotName: '臺灣大道四段（澄清醫院中港院區旁）',
        address: '臺中市西屯區臺灣大道四段 966 號',
        arrivalTime: '20:15',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '生熟廚餘雙桶', '資源回收專車'],
        notes: '夜間沿線清運，大型舊家具可向西屯清潔隊電話預約。',
      },
      {
        id: 'tc-3',
        district: '北區',
        spotName: '【日間定點】臺中公園雙十路側門定點',
        address: '臺中市北區雙十路一段 65 號',
        arrivalTime: '06:45',
        type: 'FIXED_POINT',
        collectedItems: ['一般垃圾', '生熟廚餘', '全項資源回收'],
        notes: '晨間定時定點站（06:15 ~ 08:30），專人現場引導分類。',
      },
      {
        id: 'tc-4',
        district: '南屯區',
        spotName: '文心南路與大墩十一街口（文心森林公園旁）',
        address: '臺中市南屯區文心南路 280 號',
        arrivalTime: '19:55',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '綠桶生廚餘', '黃桶熟廚餘', '資收物'],
        notes: '隨水費徵收，不需專用袋，但需確實綁緊袋口防臭防漏。',
      },
    ],
  },

  // 5. 彰化縣
  changhua: {
    countyId: 'changhua',
    countyName: '彰化縣',
    offDays: [0, 3], // 各鄉鎮多數週日、三停收
    offDaysText: '各鄉鎮多數每週三、日停收（部分鄉鎮週日、四停收）',
    collectionDaysSummary: '每週清運 4~5 天；執行全台灣最嚴格「破袋檢查退運制」！',
    todayRecycleType: {
      planeDays: [1, 4],
      solidDays: [2, 5, 6],
      specialNotes: '全台最嚴破袋檢查！袋內含超過 3 件資收物或廚餘即拒收開罰！12大項資源細分類，紙餐盒、薄片塑膠、生廚餘務必分清！',
    },
    officialTrackerName: '彰化縣各鄉鎮清潔隊清運時間與清運動態',
    officialTrackerUrl: 'https://www.chepb.gov.tw/',
    officialAppTip: '請注意鄉鎮公所清潔隊公布之沿線站點。嚴禁未經分類整袋包裝丟棄。',
    districts: ['彰化市', '員林市', '和美鎮', '鹿港鎮', '溪湖鎮', '二林鎮', '田中鎮', '北斗鎮', '花壇鄉', '大村鄉'],
    routes: [
      {
        id: 'ch-1',
        district: '彰化市',
        spotName: '中正路二段（彰化火車站前商圈）',
        address: '彰化縣彰化市中正路二段 210 號',
        arrivalTime: '19:20',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾（嚴檢）', '熟廚餘', '生廚餘（水分瀝乾）', '細分類資收物'],
        notes: '清潔隊員現場抽檢破袋，紙容器或保麗龍不可當垃圾丟。',
      },
      {
        id: 'ch-2',
        district: '員林市',
        spotName: '中山路與民生路口（員林第一市場周圍）',
        address: '彰化縣員林市中山路二段 75 號',
        arrivalTime: '19:50',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '生熟廚餘', '資源回收車'],
        notes: '蛤蜊殼、大骨頭列入一般垃圾；菜渣茶葉渣列入生廚餘。',
      },
      {
        id: 'ch-3',
        district: '鹿港鎮',
        spotName: '中山路天后宮商圈定點',
        address: '彰化縣鹿港鎮中山路 430 號',
        arrivalTime: '20:10',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '生熟廚餘', '資收物'],
        notes: '免用專用袋，隨自來水費徵收。',
      },
    ],
  },

  // 6. 台南市
  tainan: {
    countyId: 'tainan',
    countyName: '臺南市',
    offDays: [0, 2, 3], // 每週日、三、四多數區停收（每週清運4天：一、二、五、六）
    offDaysText: '每週日、三停收（多數行政區週四亦停收，每週清運 4 天）',
    collectionDaysSummary: '每週一、二、五、六收運垃圾；週三、四、日多數停收。',
    todayRecycleType: {
      planeDays: [1, 5],
      solidDays: [2, 6],
      specialNotes: '生廚餘製成高品質「尚介光有機培養土」！市民可持資收物至各區隊兌換。',
    },
    officialTrackerName: '臺南環保局垃圾車動態便民查詢地圖',
    officialTrackerUrl: 'https://clean.tainan.gov.tw/',
    officialAppTip: '可下載「臺南垃圾車 APP」，提供即時 GPS 地圖、清運路線以及定點語音廣播提示。',
    districts: ['東區', '中西區', '南區', '北區', '安平區', '安南區', '永康區', '新營區', '仁德區', '歸仁區', '新化區', '善化區'],
    routes: [
      {
        id: 'tn-1',
        district: '東區',
        spotName: '中華東路三段（巴克禮紀念公園旁）',
        address: '臺南市東區中華東路三段 357 號',
        arrivalTime: '19:30',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾（免專用袋）', '生廚餘（尚介光原料）', '熟廚餘', '資源回收物'],
        notes: '每週一、二、五、六清運，週三、四、日不收垃圾。',
      },
      {
        id: 'tn-2',
        district: '中西區',
        spotName: '西門路二段與民生路口（水仙宮市場旁）',
        address: '臺南市中西區西門路二段 225 號',
        arrivalTime: '20:00',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '生熟廚餘分流', '資收專車'],
        notes: '市場商圈清運點，請勿提早堆置垃圾以免受罰。',
      },
      {
        id: 'tn-3',
        district: '永康區',
        spotName: '小東路與中華路口（成功大學周邊）',
        address: '臺南市永康區中華路 1 號',
        arrivalTime: '20:25',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '生熟廚餘', '資源回收物'],
        notes: '人口密集生活圈，垃圾車定點停靠約 8~10 分鐘。',
      },
    ],
  },

  // 7. 高雄市
  kaohsiung: {
    countyId: 'kaohsiung',
    countyName: '高雄市',
    offDays: [0, 3], // 每週日、三停收
    offDaysText: '每週三、週日停收垃圾與資收',
    collectionDaysSummary: '每週一、二、四、五、六夜間清運；資收採分日分項隨車收運。',
    todayRecycleType: {
      planeDays: [1, 5],
      solidDays: [2, 4, 6],
      specialNotes: '資收分日清運：週一、五收【紙類、廢玻璃】；週二、四、六收【廢塑膠、金屬鐵鋁、舊衣布料】。高壓瓶罐請排空後獨立分裝。',
    },
    officialTrackerName: '高雄市垃圾車即時動態查詢網',
    officialTrackerUrl: 'https://recycle.kcg.gov.tw/',
    officialAppTip: '可下載「高雄垃圾車 APP」或加入環保局 LINE 官方帳號，精準查詢到站時間。',
    districts: ['苓雅區', '新興區', '前金區', '三民區', '左營區', '鼓山區', '前鎮區', '小港區', '鳳山區', '楠梓區', '大寮區', '岡山區'],
    routes: [
      {
        id: 'kh-1',
        district: '苓雅區',
        spotName: '五福一路與光華一路口（文化中心前）',
        address: '高雄市苓雅區五福一路 67 號',
        arrivalTime: '19:20',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾（免專用袋）', '熟廚餘', '生廚餘', '當日指定資收物'],
        notes: '週一五收紙類/玻璃；週二四六收塑膠/鐵鋁。',
      },
      {
        id: 'kh-2',
        district: '左營區',
        spotName: '裕誠路與博愛二路口（漢神巨蛋商圈）',
        address: '高雄市左營區博愛二路 777 號周圍',
        arrivalTime: '20:10',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '生熟廚餘雙桶', '資收物'],
        notes: '免用專用袋，隨水費徵收，袋口務必繫緊。',
      },
      {
        id: 'kh-3',
        district: '鳳山區',
        spotName: '光遠路與曹公路口（鳳山火車站周邊）',
        address: '高雄市鳳山區曹公路 137 號',
        arrivalTime: '20:35',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '生熟廚餘', '資源回收車'],
        notes: '高壓殺蟲劑、瓦斯罐嚴禁投入壓縮垃圾車，需排空交付資收車。',
      },
    ],
  },

  // 8. 基隆市
  keelung: {
    countyId: 'keelung',
    countyName: '基隆市',
    offDays: [0, 3],
    offDaysText: '每週三、週日停收垃圾',
    collectionDaysSummary: '每週一、二、四、五、六清運；市區設有定時定點停靠站。',
    todayRecycleType: {
      planeDays: [1, 4],
      solidDays: [2, 5, 6],
      specialNotes: '隨自來水費徵收處理費，免用專用垃圾袋。市區山坡狹窄巷弄設有定點專車。',
    },
    officialTrackerName: '基隆市環境保護局垃圾清運車即時查詢',
    officialTrackerUrl: 'https://www.klepb.gov.tw/',
    districts: ['仁愛區', '中正區', '信義區', '中山區', '安樂區', '暖暖區', '七堵區'],
    routes: [
      {
        id: 'kl-1',
        district: '仁愛區',
        spotName: '愛四路與仁二路口（廟口夜市周邊定點）',
        address: '基隆市仁愛區愛四路 20 號',
        arrivalTime: '20:00',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '瀝乾廚餘', '資源回收物'],
        notes: '夜市人潮密集處，請依序等候垃圾車停妥後投放。',
      },
    ],
  },

  // 9. 新竹市
  'hsinchu-city': {
    countyId: 'hsinchu-city',
    countyName: '新竹市',
    offDays: [0, 3],
    offDaysText: '每週三、週日停收垃圾',
    collectionDaysSummary: '每週一、二、四、五、六收運垃圾與廚餘；竹科生活圈設有日間定點站。',
    todayRecycleType: {
      planeDays: [1, 4],
      solidDays: [2, 5, 6],
      specialNotes: '生熟廚餘全回收，生廚餘堆肥、熟廚餘瀝乾回收。大骨頭與硬殼算一般垃圾。',
    },
    officialTrackerName: '新竹市清運車即時動態查詢便民網',
    officialTrackerUrl: 'https://garbage.hcchb.gov.tw/',
    districts: ['東區', '北區', '香山區'],
    routes: [
      {
        id: 'hc-1',
        district: '東區',
        spotName: '光復路二段與建功路口（清華大學正門旁）',
        address: '新竹市東區光復路二段 101 號',
        arrivalTime: '19:40',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '全回收廚餘', '資源回收物'],
        notes: '科園學區清運點，資收物請先於家中分袋整理。',
      },
    ],
  },

  // 10. 宜蘭縣
  yilan: {
    countyId: 'yilan',
    countyName: '宜蘭縣',
    offDays: [0, 3],
    offDaysText: '每週三、週日停收垃圾與資收',
    collectionDaysSummary: '每週一、二、四、五、六清運；資源回收採極為嚴格的分日分項收運。',
    todayRecycleType: {
      planeDays: [1, 4], // 週一、四
      solidDays: [2, 5], // 週二、五
      specialNotes: '環保模範縣：週一、四收平面類（紙類、乾淨塑膠袋、舊衣）；週二、五收立體類（鐵鋁罐、瓶罐塑膠、玻璃）。週六僅收垃圾與廚餘。',
    },
    officialTrackerName: '宜蘭縣垃圾清運車即時查詢系統',
    officialTrackerUrl: 'https://www.ilepb.gov.tw/',
    districts: ['宜蘭市', '羅東鎮', '礁溪鄉', '頭城鎮', '冬山鄉', '五結鄉', '蘇澳鎮'],
    routes: [
      {
        id: 'yl-1',
        district: '宜蘭市',
        spotName: '中山路三段與舊城南路口（宜蘭新月廣場旁）',
        address: '宜蘭縣宜蘭市舊城南路 100 號',
        arrivalTime: '19:35',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '萱花堆肥廚餘', '當日指定資收項目'],
        notes: '分日清運嚴格落實，非指定日之資收物清潔隊有權拒收。',
      },
      {
        id: 'yl-2',
        district: '羅東鎮',
        spotName: '興東路與民權路口（羅東夜市公所前定點）',
        address: '宜蘭縣羅東鎮中興路 3 號',
        arrivalTime: '20:15',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '全量廚餘', '資源回收專車'],
        notes: '夜間定點停等時間較充裕。',
      },
    ],
  },

  // 11. 花蓮縣
  hualien: {
    countyId: 'hualien',
    countyName: '花蓮縣',
    offDays: [0, 3],
    offDaysText: '每週三、週日停收垃圾',
    collectionDaysSummary: '花蓮市、吉安鄉等主要人口區每週收運 5 天；推行台泥和平氣化協同處理。',
    todayRecycleType: {
      planeDays: [1, 4],
      solidDays: [2, 5, 6],
      specialNotes: '高溫氣化協同處理家戶垃圾，大骨頭硬物與硬殼請勿混入廚餘損毀刀刃。',
    },
    officialTrackerName: '花蓮縣垃圾車即時動態查詢系統',
    officialTrackerUrl: 'https://www.hlepb.gov.tw/',
    districts: ['花蓮市', '吉安鄉', '新城鄉', '玉里鎮', '壽豐鄉'],
    routes: [
      {
        id: 'hl-1',
        district: '花蓮市',
        spotName: '中正路與中山路口（花蓮金三角商圈）',
        address: '花蓮縣花蓮市中正路 550 號',
        arrivalTime: '19:45',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '全量廚餘', '資源回收物'],
        notes: '隨自來水費徵收，袋口務必綁緊。',
      },
    ],
  },

  // 12. 澎湖縣
  penghu: {
    countyId: 'penghu',
    countyName: '澎湖縣',
    offDays: [0, 3],
    offDaysText: '每週三、週日停收',
    collectionDaysSummary: '垃圾全數海運回本島焚化處理，運費昂貴，極度仰賴市民高度落實源頭減量與嚴格分類！',
    todayRecycleType: {
      planeDays: [1, 4],
      solidDays: [2, 5, 6],
      specialNotes: '海運代燒成本極高！若垃圾車進廠抽驗分類不合格整櫃退運，請務必徹底做好資源分類。',
    },
    officialTrackerName: '澎湖縣各鄉市清潔隊垃圾清運日程表',
    officialTrackerUrl: 'https://www.phepb.gov.tw/',
    districts: ['馬公市', '湖西鄉', '白沙鄉', '西嶼鄉'],
    routes: [
      {
        id: 'ph-1',
        district: '馬公市',
        spotName: '中正路商圈定點（天后宮周邊）',
        address: '澎湖縣馬公市中正路 53 號',
        arrivalTime: '19:30',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾（海運）', '脫水廚餘', '資源回收物'],
        notes: '花火節期間設有額外定點資收專區。',
      },
    ],
  },
};

// Fallback generator for other counties
export function getCountyTruckSchedule(countyId: string, countyName: string): CountyTruckSchedule {
  if (TRUCK_SCHEDULES[countyId]) {
    return TRUCK_SCHEDULES[countyId];
  }

  // Default structure for other counties
  return {
    countyId,
    countyName,
    offDays: [0, 3], // 預設週三、週日休息
    offDaysText: '每週三、週日停收垃圾與資源回收（依各鄉鎮市公所清潔隊公告為準）',
    collectionDaysSummary: '每週一、二、四、五、六夜間清運，各鄉鎮市公所自訂清運日程。',
    todayRecycleType: {
      planeDays: [1, 4],
      solidDays: [2, 5, 6],
      specialNotes: '隨水費徵收，不需專用垃圾袋。請將一般垃圾、廚餘及資源回收物分開交付。',
    },
    officialTrackerName: `${countyName}環境保護局清潔隊清運查詢`,
    officialTrackerUrl: 'https://www.epa.gov.tw/',
    officialAppTip: `可撥打 ${countyName} 環保局電話或至各鄉鎮市公所網站查詢即時清運車路線時刻表。`,
    districts: ['市中心區', '主要市區', '周邊鄉鎮'],
    routes: [
      {
        id: `${countyId}-default-1`,
        district: '主要市區',
        spotName: `${countyName}主要幹道站點`,
        address: `${countyName}主要道路口`,
        arrivalTime: '19:30',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般生活垃圾', '廚餘', '各類資源回收物'],
        notes: '各鄉鎮公所清潔隊每週清運 4~5 天，垃圾車音樂響起後再出門丟棄。',
      },
      {
        id: `${countyId}-default-2`,
        district: '主要市區',
        spotName: `${countyName}公所前定點專區`,
        address: `${countyName}公所周邊`,
        arrivalTime: '20:10',
        type: 'REGULAR_ROUTE',
        collectedItems: ['一般垃圾', '生熟廚餘', '資源回收專車'],
        notes: '大型廢棄物需提前電話預約登記清運。',
      },
    ],
  };
}

