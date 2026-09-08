import { Memory, BookDraft } from '../types/book';

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'memory_kyoto_trip',
    ledgerId: 'ledger_japan',
    title: '2026 初春·关西与京都游记',
    subtitle: '记录寺庙、石径与樱花初放的十天',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    diaryIds: ['entry_japan_1', 'entry_japan_2', 'entry_japan_3'],
    startDate: '2026-03-24',
    endDate: '2026-04-02',
    createdAt: '2026-04-03',
    updatedAt: '2026-04-03',
  },
  {
    id: 'memory_momo_growth',
    ledgerId: 'ledger_momo',
    title: 'MOMO 的成长时光札记',
    subtitle: '小猫初来家里的四季与毛茸茸片段',
    coverImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    diaryIds: ['entry_momo_1', 'entry_momo_2'],
    startDate: '2026-05-10',
    endDate: '2026-08-30',
    createdAt: '2026-09-01',
    updatedAt: '2026-09-01',
  },
  {
    id: 'memory_our_summer',
    ledgerId: 'ledger_us',
    title: '我们的夏天 · 2026',
    subtitle: '那些一起散步、看晚霞和做饭的平淡日子',
    coverImage: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
    diaryIds: ['entry_1', 'entry_2', 'entry_3'],
    startDate: '2026-06-01',
    endDate: '2026-09-06',
    createdAt: '2026-09-06',
    updatedAt: '2026-09-06',
  },
];

export const INITIAL_BOOKS: BookDraft[] = [
  {
    id: 'book_kyoto_memoir',
    memoryId: 'memory_kyoto_trip',
    title: '我在地球的日子：京都纪行',
    subtitle: 'A Journey in Kyoto · 2026 Spring',
    authorName: '地球记录者',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    coverColor: '#2C3A2E',
    spineText: '我在地球的日子：京都纪行 · 2026',
    paperType: 'classic_warm_cream_140g',
    bookStyle: 'editorial',
    totalPageCount: 36,
    status: 'saved',
    version: 'v1.2 (实体精装打样版)',
    createdAt: '2026-04-05',
    updatedAt: '2026-09-02',
    chapters: [
      {
        id: 'chap_1',
        title: '第一章：初抵岚山',
        subtitle: '竹林清风与鸭川落日',
        pages: [
          {
            id: 'p_1',
            pageNumber: 1,
            layout: 'L08_chapter_opener',
            chapterTitle: '第一章 · 初抵岚山',
            quote: '“每一座城市的清晨与黄昏，都是地球赠予行者的微风。”',
            photos: [],
          },
          {
            id: 'p_2',
            pageNumber: 2,
            layout: 'L01_single_hero',
            diaryDate: '2026年3月25日',
            title: '岚山渡月桥边的一杯热茶',
            bodyText: '晨雾还没散去，沿着桂川一路向前走。河边的老茶寮升起白烟，点了一壶番茶和手工年糕。微凉的风穿过竹林，那一刻觉得所有漫长的等待都值得。',
            photos: [
              {
                id: 'ph_k1',
                url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
                aspectRatio: 4 / 3,
                caption: '岚山桂川的清晨茶寮',
              }
            ],
          },
          {
            id: 'p_3',
            pageNumber: 3,
            layout: 'L06_photo_with_story',
            diaryDate: '2026年3月26日',
            title: '清水寺坂道与落樱',
            bodyText: '下午天空放晴，阳光照在木质老屋的屋檐上。转角处有一棵独自盛开的垂枝樱，微风吹过，落花落在石阶上，游人走得很慢。',
            photos: [
              {
                id: 'ph_k2',
                url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
                aspectRatio: 3 / 4,
                caption: '二年坂春日暖阳',
              }
            ],
          },
          {
            id: 'p_4',
            pageNumber: 4,
            layout: 'L03_two_photos',
            diaryDate: '2026年3月28日',
            title: '鸭川散步与居酒屋晚灯',
            bodyText: '傍晚和朋友坐在鸭川草坪上聊天，看着天色从琥珀色变成深蓝。随后拐进小巷里的老居酒屋，烤鸡肉串的香气溢满整条街。',
            photos: [
              {
                id: 'ph_k3',
                url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80',
                aspectRatio: 1,
                caption: '鸭川暮色',
              },
              {
                id: 'ph_k4',
                url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
                aspectRatio: 1,
                caption: '暖帘与灯火',
              }
            ],
          },
          {
            id: 'p_5',
            pageNumber: 5,
            layout: 'L09_quote_whitespace',
            quote: '生活会忘记，但纸张与墨水不会。\n我们在地球上的日子，每一页都算数。',
            photos: [],
          }
        ],
      }
    ],
  },
];
