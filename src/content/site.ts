export type NotePhoto = {
  id: string;
  src: string;
  storagePath?: string;
  alt: string;
  caption?: string;
};

export const JOURNAL_CATEGORY_LABELS = {
  life: "生活笔记",
  study: "学习笔记",
  fragment: "碎片笔记",
} as const;

export type JournalCategory = keyof typeof JOURNAL_CATEGORY_LABELS;

export const JOURNAL_SPACE_LABELS = {
  photo_notes: "照片手记",
  journals: "随笔",
} as const;

export type JournalSpace = keyof typeof JOURNAL_SPACE_LABELS;

export type Note = {
  id: string;
  slug: string;
  entryType: "photo" | "journal";
  journalSpace?: JournalSpace;
  journalCategory?: JournalCategory;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  location: string;
  shotAt?: string;
  readTime: string;
  coverImage: string;
  coverSource?: "explicit" | "photo" | "fallback";
  imageAspect: string;
  camera: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  featured?: boolean;
  status: "draft" | "published";
  photos: NotePhoto[];
};

export const siteConfig = {
  name: "Lens Notes",
  description: "一个把照片与手记分开书写的个人空间，记录光线、旅途与日常里的细小现场。",
  tagline: "透过镜头与文字，记录日常里的静默层次。",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const notes: Note[] = [
  {
    id: "photo-1",
    slug: "chasing-light-in-the-city",
    entryType: "photo",
    title: "在城市中追逐光影",
    excerpt: "晨间街角的反光、玻璃幕墙的折射、咖啡店门口被切开的阳光，让城市拥有轻微呼吸感。",
    content: `# 城市的光，不会等人

很多时候，我不是为了“拍到什么”而出门，而是为了看看今天的光会怎样落在城市表面。

## 我会优先观察这三件事

1. 阳光进入街道的角度
2. 玻璃或金属表面的反射
3. 行人与建筑之间形成的几何关系

清晨是最适合做这种练习的时间。街道还没有完全拥挤，影子更长，画面也更干净。`,
    date: "2026-03-12T08:20:00.000Z",
    location: "上海",
    shotAt: "2026-03-12T08:12",
    readTime: "4 min",
    coverImage:
      "https://images.unsplash.com/photo-1598087216773-d02ad98034f1?auto=format&fit=crop&w=1200&q=80",
    imageAspect: "4 / 5.6",
    camera: "Leica Q2",
    aperture: "f/2.8",
    shutterSpeed: "1/1000s",
    iso: "400",
    featured: true,
    status: "published",
    photos: [
      {
        id: "p-1",
        src: "https://images.unsplash.com/photo-1598087216773-d02ad98034f1?auto=format&fit=crop&w=1200&q=80",
        storagePath: "https://images.unsplash.com/photo-1598087216773-d02ad98034f1?auto=format&fit=crop&w=1200&q=80",
        alt: "Tokyo street scene with cinematic light",
        caption: "反射和阴影叠在一起时，城市会突然变得很安静。",
      },
      {
        id: "p-2",
        src: "https://images.unsplash.com/photo-1646123202952-4f2e037b7936?auto=format&fit=crop&w=1200&q=80",
        storagePath: "https://images.unsplash.com/photo-1646123202952-4f2e037b7936?auto=format&fit=crop&w=1200&q=80",
        alt: "Modern architecture with strong geometry",
        caption: "几何感强的建筑，是练习构图秩序最好的对象。",
      },
    ],
  },
  {
    id: "photo-2",
    slug: "black-and-white-minimalism",
    entryType: "photo",
    title: "黑白极简主义的练习",
    excerpt: "去掉颜色以后，画面只剩形状、纹理和明暗，也更能看见什么是真正重要的视觉信息。",
    content: `# 去掉颜色之后

黑白摄影并不是复古滤镜，而是一种更严苛的观看方式。没有颜色帮你制造热闹，主体必须自己成立。`,
    date: "2026-02-08T10:20:00.000Z",
    location: "京都",
    shotAt: "2026-02-08T10:06",
    readTime: "2 min",
    coverImage:
      "https://images.unsplash.com/photo-1640964535474-1060ff9ccb94?auto=format&fit=crop&w=1200&q=80",
    imageAspect: "4 / 6.2",
    camera: "Sony A7R4",
    aperture: "f/4.0",
    shutterSpeed: "1/500s",
    iso: "200",
    status: "published",
    photos: [
      {
        id: "p-4",
        src: "https://images.unsplash.com/photo-1640964535474-1060ff9ccb94?auto=format&fit=crop&w=1200&q=80",
        storagePath: "https://images.unsplash.com/photo-1640964535474-1060ff9ccb94?auto=format&fit=crop&w=1200&q=80",
        alt: "Minimal white architecture",
      },
    ],
  },
  {
    id: "photo-3",
    slug: "gentle-morning-portrait",
    entryType: "photo",
    title: "温柔晨光里的人像练习",
    excerpt: "早晨的人像最迷人的地方，是它不会用力，人物和空气会同时变得可见。",
    content: `# 早晨的人像，不需要太多道具

清晨的光线天然带着一种没有攻击性的层次。皮肤、发丝和背景都会更柔和。`,
    date: "2026-01-26T06:42:00.000Z",
    location: "京都",
    shotAt: "2026-01-26T06:35",
    readTime: "3 min",
    coverImage:
      "https://images.unsplash.com/photo-1715429575468-9a2799df8100?auto=format&fit=crop&w=1200&q=80",
    imageAspect: "4 / 5.3",
    camera: "Canon R5",
    aperture: "f/1.4",
    shutterSpeed: "1/500s",
    iso: "200",
    status: "published",
    photos: [],
  },
  {
    id: "photo-4",
    slug: "texture-of-the-earth",
    entryType: "photo",
    title: "从高处看见大地肌理",
    excerpt: "抽象摄影迷人的地方，在于景物脱离原本的名字，只留下结构、颜色和节奏。",
    content: `# 当风景开始变抽象

很多时候我们以为自己在拍地点，其实更像是在拍纹理。`,
    date: "2026-01-10T14:26:00.000Z",
    location: "冰岛",
    shotAt: "2026-01-10T14:02",
    readTime: "2 min",
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    imageAspect: "4 / 4.9",
    camera: "DJI Mavic 3",
    aperture: "f/5.6",
    shutterSpeed: "1/640s",
    iso: "100",
    status: "published",
    photos: [],
  },
  {
    id: "journal-1",
    slug: "notes-after-a-rainy-walk",
    entryType: "journal",
    journalSpace: "photo_notes",
    title: "雨后散步，城市像刚被轻轻擦拭过",
    excerpt: "一场不大的雨，会把平时看不见的反光和边缘都慢慢推出来，让城市显得更诚实。",
    content: `# 雨后的街道总会慢下来

走在积水边时，我会比平时更愿意停下来。因为路面开始有第二层画面，树影、路灯、招牌都变成了可被重写的东西。

## 今天记住的两个瞬间

- 一位路人撑着透明伞，在灰色墙边停了三秒
- 一台共享单车被路边灯箱照出一条很细的反光

这些瞬间都不大，但它们会让一天忽然有了可记住的边角。`,
    date: "2026-03-18T20:10:00.000Z",
    location: "上海",
    readTime: "3 min",
    coverImage:
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80",
    imageAspect: "4 / 5.2",
    camera: "参数无",
    aperture: "参数无",
    shutterSpeed: "参数无",
    iso: "参数无",
    status: "published",
    photos: [
      {
        id: "jp-1",
        src: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80",
        storagePath: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80",
        alt: "Rainy city street at night",
      },
    ],
  },
  {
    id: "journal-2",
    slug: "quiet-hotel-morning",
    entryType: "journal",
    journalSpace: "photo_notes",
    title: "住进一间安静酒店后，我反而更愿意早起",
    excerpt: "陌生空间会重置日常节奏，窗帘缝里的光、桌上的水杯、刚收好的行李，都像在提醒人重新开始。",
    content: `# 旅途中最容易忽略的是房间里的安静

很多时候照片来自街道和目的地，但真正让情绪沉下来的是回到房间之后的几十分钟。`,
    date: "2026-02-22T07:30:00.000Z",
    location: "杭州",
    readTime: "2 min",
    coverImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    imageAspect: "4 / 5",
    camera: "参数无",
    aperture: "参数无",
    shutterSpeed: "参数无",
    iso: "参数无",
    status: "published",
    photos: [],
  },
  {
    id: "journal-3",
    slug: "one-line-about-spring",
    entryType: "journal",
    journalSpace: "photo_notes",
    title: "春天的风比任何滤镜都更会修饰画面",
    excerpt: "同样一条街在春天会突然轻一些，树叶还没完全长好，影子却已经开始有了松动感。",
    content: `# 风会改变画面的表情

有时候拍摄现场并没有很戏剧化，但风一吹，画面就会多出一点不受控制的柔软。`,
    date: "2026-02-02T16:00:00.000Z",
    location: "杭州",
    readTime: "1 min",
    coverImage:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
    imageAspect: "4 / 5",
    camera: "参数无",
    aperture: "参数无",
    shutterSpeed: "参数无",
    iso: "参数无",
    status: "published",
    photos: [],
  },
  {
    id: "journal-4",
    slug: "reading-notes-about-interface-silence",
    entryType: "journal",
    journalSpace: "journals",
    journalCategory: "study",
    title: "界面安静下来以后，信息反而更容易被看见",
    excerpt: "最近在反复看一些旧杂志和产品界面，发现真正耐看的设计几乎都懂得退后一步，把注意力让给内容本身。",
    content: `# 关于安静界面的几条学习笔记

当页面上的每一块都想被看见时，真正重要的东西反而会被稀释。

## 这周记下来的三个判断

- 好的留白不是空，而是节奏
- 颜色越克制，层级越要准确
- 动效的作用不是热闹，而是减轻切换时的突兀

这些笔记还没有完全成熟，但已经足够影响我最近的排版判断。`,
    date: "2026-02-10T20:10:00.000Z",
    location: "上海",
    readTime: "3 min",
    coverImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    imageAspect: "4 / 5",
    camera: "参数无",
    aperture: "参数无",
    shutterSpeed: "参数无",
    iso: "参数无",
    status: "published",
    photos: [],
  },
  {
    id: "journal-5",
    slug: "notes-on-small-daily-order",
    entryType: "journal",
    journalSpace: "journals",
    journalCategory: "life",
    title: "把生活重新摆回秩序里，往往从一张桌子开始",
    excerpt: "最近在练习更慢一点地生活。擦桌子、折衣服、整理抽屉，看起来都很小，但会让一天变得更安静。",
    content: `# 日常秩序感并不来自效率

很多时候真正安定人的，不是完成了多少事，而是空间终于和心绪重新对齐。

## 今天做的三件小事

- 把旧纸张按时间归档
- 留下桌面中央的一块空白
- 给常用笔记本重新贴上标签

这些动作都很小，但会让人重新意识到，生活也可以被温柔地整理。`,
    date: "2026-01-26T08:00:00.000Z",
    location: "杭州",
    readTime: "3 min",
    coverImage:
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80",
    imageAspect: "4 / 5",
    camera: "参数无",
    aperture: "参数无",
    shutterSpeed: "参数无",
    iso: "参数无",
    status: "published",
    photos: [],
  },
  {
    id: "journal-6",
    slug: "fragment-about-reading-at-night",
    entryType: "journal",
    journalSpace: "journals",
    journalCategory: "fragment",
    title: "夜里读书时，世界会自动把杂音调低一点",
    excerpt: "有些句子在白天只是信息，到了夜里才会真正落进心里。",
    content: `# 一则碎片

夜深时读到一句喜欢的话，窗外没有风，房间里只剩纸页翻动的声音。那一刻不会留下很大的结论，但会让人愿意继续读下去。`,
    date: "2026-01-05T22:18:00.000Z",
    location: "上海",
    readTime: "1 min",
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    imageAspect: "4 / 5",
    camera: "参数无",
    aperture: "参数无",
    shutterSpeed: "参数无",
    iso: "参数无",
    status: "published",
    photos: [],
  },
];

export function getPublishedPhotos() {
  return notes.filter((note) => note.status === "published" && note.entryType === "photo");
}

export function getPublishedJournals() {
  return notes.filter(
    (note) =>
      note.status === "published" &&
      note.entryType === "journal" &&
      note.journalSpace === "journals",
  );
}

export function getPublishedPhotoNotes() {
  return notes.filter(
    (note) =>
      note.status === "published" &&
      note.entryType === "journal" &&
      note.journalSpace === "photo_notes",
  );
}
