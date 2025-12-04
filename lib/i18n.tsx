'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'ja' | 'en';

export interface Entry {
  date: string;
  title: string;
  description: string;
  tech?: string;
  readTime?: string;
  link: string;
  type: 'app' | 'note' | 'about';
  detailContent?: string;
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
}

const translations = {
  ja: {
    nav: {
      home: 'ホーム',
      apps: 'Apps',
      notes: 'Notes',
    },
    home: {
      title: 'アプリと記録',
      subtitle: 'Apps & Development Notes',
      description: '作ったアプリと、開発中に考えたことの記録。設計から実装まで、丁寧に作ることを心がけています。',
    },
    apps: {
      title: 'Apps',
      description: 'これまでに作ったアプリの一覧です。',
    },
    notes: {
      title: 'Notes',
      description: '開発中に考えたこと、学んだことの記録。',
    },
    buttons: {
      viewApp: '作品を見る',
      closeApp: '作品を閉じる',
      readNote: '記事を読む',
      closeNote: '記事を閉じる',
      readAbout: 'プロフィールを見る',
      closeAbout: 'プロフィールを閉じる',
    },
    about: {
      title: 'About',
      cardTitle: '自己紹介',
      summary: 'Web開発者。シンプルで読みやすいUIを作ることが好き。技術は手段であり、本質は人の体験を良くすること。',
      detailContent: `なんとかなる、っていう気持ちでやってる。

完璧主義じゃないし、全部わかってるわけでもない。でも、一つずつ丁寧に作っていけば、なんとかなる。そう思ってる。

技術選定はシンプルに。Next.js、TypeScript、CSS Modules。流行りを追うより、理解できるものを使う。ライブラリに頼りすぎず、必要な機能は自分で実装する。その方が後々楽だし、何より理解できる。

デザインは読みやすさ重視。余白をたっぷり取って、行間を広めに。セリフ体とモノスペースフォントを組み合わせて、柔らかさと堅実さを両立させる。細部に遊び心を忘れない。

完璧じゃないけど、これでいい。なんとかなってる。`,
    },
    sectionLabels: {
      latestUpdate: 'Latest update:',
      usedTech: '使用技術',
    },
    heroTitle: 'なんとか',
    heroAccent: 'なる！',
    heroAccentHover: 'なる？',
    heroSubtitle: '思考と制作の記録',
    aboutEntry: {
      date: '',
      title: 'hakunama',
      description: '企画/アプリ開発/デザインをやってる。アイデアを形にすることが好き。技術は手段であり、本質は人の体験を良くすること。',
      image: '/hakunama-icon.png',
      detailContent: `なんとかなる、っていう気持ちでやってる。

完璧主義じゃないし、全部わかってるわけでもない。でも、一つずつ丁寧に作っていけば、なんとかなる。そう思ってる。

企画を立てて、設計して、実装して、デザインする。全部やる。専門性より幅広さ。一人で完結できる強みを活かして、アイデアを素早く形にする。

技術選定はシンプルに。Next.js、TypeScript、CSS Modules。流行りを追うより、理解できるものを使う。ライブラリに頼りすぎず、必要な機能は自分で実装する。その方が後々楽だし、何より理解できる。

デザインは読みやすさ重視。余白をたっぷり取って、行間を広めに。セリフ体とモノスペースフォントを組み合わせて、柔らかさと堅実さを両立させる。細部に遊び心を忘れない。

完璧じゃないけど、これでいい。なんとかなってる。

---

アイコンについて: このアイコンは、シンプルで親しみやすいデザインを目指して作った。技術は複雑でも、人に見せるものは温かみがあってほしい。そんな気持ちを込めてる。`,
      type: 'about' as const,
      link: '#',
    },
    entries: [
      {
        date: '2024.12.04',
        title: 'なんとかポートフォリオサイト',
        description: '「なんとかなる」って気持ちを形にしたかった。読みやすさと遊び心、どっちも諦めたくなくて、試行錯誤しながら作ったサイト。',
        detailContent: `正直、最初は何作ればいいかわからなかった。ポートフォリオって言っても、ありきたりなテンプレートは使いたくない。自分らしさって何だろう？って考えたら、「なんとかなる」っていう前向きな諦めの悪さが浮かんできた。

デザインで一番こだわったのは読みやすさ。長い文章でも疲れないように、行間広めに取って、余白もたっぷり。セリフ体とモノスペースフォントを組み合わせたのは、柔らかさと堅実さの両立を狙ってる。あと、遊び心も忘れたくなかったから、タイトルの「なる！」にカーソル当てると「なる？」になるとか、細かいとこで遊んでみた。

技術的にはNext.jsとCSS Modules。シンプルが一番。ライブラリをあれこれ入れるより、必要な機能だけ自分で実装した方が後々楽だし、何より理解できる。右からスライドするモーダルとか、フローティングナビとか、一個一個ちゃんと意図を持たせて作ってる。

完璧じゃないけど、これでいい。なんとかなってる。`,
        tech: 'Next.js / TypeScript / React',
        githubUrl: 'https://github.com/yourusername/nantoka',
        link: '#',
        type: 'app' as const,
      },
      {
        date: '2024.12.04',
        title: 'CSSだけでモーダル作ってみた話',
        description: 'JavaScriptゴリゴリ書かなくても、CSSだけで結構いい感じのモーダルができる。transitionとtransformの組み合わせだけ。',
        detailContent: `モーダルってJavaScriptで制御するもんだと思ってた。でも調べたら、CSSだけで十分だった。

デスクトップは右から50%、モバイルは下から90vhでスライドイン。やってることは単純で、初期状態を画面外に置いて（translateX(100%)とかtranslateY(100%)）、開くときに0に戻すだけ。これだけでヌルッと動く。

アニメーションのイージングは cubic-bezier(0.25, 0.1, 0.25, 1) にした。いろいろ試した結果、これが一番自然に感じた。0.5秒っていう時間も大事で、速すぎると落ち着かないし、遅すぎるとイライラする。このへんは感覚値。

ReactのstateはisOpenのboolean一個だけ。あとは全部CSSに任せる。ロジックとスタイルを分けると、後で見返したときに「あ、これモーダルの開閉だけやってるんだな」ってすぐわかる。シンプルは正義。`,
        readTime: '8分',
        link: '#',
        type: 'note' as const,
      },
      {
        date: '2024.12.04',
        title: 'フローティングナビ、邪魔にならない程度に',
        description: '画面下にずっと居座るナビって邪魔じゃない？必要なときだけ出てくる方が気が利いてる気がして、そういうの作った。',
        detailContent: `フローティングナビって便利なんだけど、正直うざい。ずっと画面に出てるやつ、スクロールの邪魔になるし。

だから「必要なときだけ出る」設計にした。開いてから2秒経ったら消える。スクロールしたら0.8秒後に消える。操作してないときは画面から消えてる方がいい。

実装はuseEffectとタイマーの組み合わせ。スクロールイベントって頻繁に発火するから、ちゃんと制御しないと無駄な再レンダリングが走る。最初ここでハマった。タイマーのクリーンアップをちゃんとやらないとメモリリークするし。

あと、現在見てるセクションに応じてボタンの表示を変えたり、opacityとtransformでフワッと消えるようにしたり。細かいとこの積み重ねで、「あ、使いやすい」って思ってもらえたら嬉しい。

まあ、完璧じゃないけどね。でもこれでいいと思ってる。`,
        readTime: '10分',
        link: '#',
        type: 'note' as const,
      },
    ] as Entry[],
  },
  en: {
    nav: {
      home: 'Home',
      apps: 'Apps',
      notes: 'Notes',
    },
    home: {
      title: 'Apps & Notes',
      subtitle: 'Portfolio & Development Journal',
      description: "A collection of apps I've built and notes on the development process. I strive for thoughtful design and implementation.",
    },
    apps: {
      title: 'Apps',
      description: "A collection of applications I've built.",
    },
    notes: {
      title: 'Notes',
      description: 'Thoughts and learnings from development.',
    },
    buttons: {
      viewApp: 'View',
      closeApp: 'Close',
      readNote: 'Read',
      closeNote: 'Close',
      readAbout: 'View Profile',
      closeAbout: 'Close',
    },
    about: {
      title: 'About',
      cardTitle: 'About Me',
      summary: 'Web developer who loves creating simple, readable UIs. Technology is a means - the essence is improving human experience.',
      detailContent: `"Somehow it works" - that's my approach.

I'm not a perfectionist, and I don't know everything. But if you build things carefully, one step at a time, somehow it works. That's what I believe.

Tech choices: keep it simple. Next.js, TypeScript, CSS Modules. Rather than chasing trends, I use what I understand. Don't rely too much on libraries - implement what you need yourself. It's easier later, and more importantly, you actually understand it.

Design: readability first. Plenty of whitespace, wide line spacing. Mix serif and monospace fonts to balance softness with solidity. Don't forget playfulness in the details.

Not perfect, but good enough. Somehow, it works.`,
    },
    sectionLabels: {
      latestUpdate: 'Latest update:',
      usedTech: 'Tech Stack',
    },
    heroTitle: 'Somehow',
    heroAccent: 'Works!',
    heroAccentHover: 'Works?',
    heroSubtitle: 'Thoughts & Creations',
    aboutEntry: {
      date: '',
      title: 'hakunama',
      description: 'Planning / App Development / Design. Love turning ideas into reality. Technology is a means - the essence is improving human experience.',
      image: '/hakunama-icon.png',
      detailContent: `"Somehow it works" - that's my approach.

I'm not a perfectionist, and I don't know everything. But if you build things carefully, one step at a time, somehow it works. That's what I believe.

I do everything: planning, design, implementation. Breadth over specialization. The strength of being able to complete things solo lets me turn ideas into reality quickly.

Tech choices: keep it simple. Next.js, TypeScript, CSS Modules. Rather than chasing trends, I use what I understand. Don't rely too much on libraries - implement what you need yourself. It's easier later, and more importantly, you actually understand it.

Design: readability first. Plenty of whitespace, wide line spacing. Mix serif and monospace fonts to balance softness with solidity. Don't forget playfulness in the details.

Not perfect, but good enough. Somehow, it works.

---

About the icon: This icon was created with a simple, approachable design in mind. Even when technology gets complex, what we show people should feel warm and welcoming. That's the feeling behind it.`,
      type: 'about' as const,
      link: '#',
    },
    entries: [
      {
        date: '2024.12.04',
        title: 'Nantoka Portfolio',
        description: 'Wanted to capture that "somehow it works" feeling. A site built through trial and error, refusing to compromise on either readability or playfulness.',
        detailContent: `Honestly, I had no idea what to build at first. A portfolio, sure, but I didn\'t want some cookie-cutter template. What even is "me"? Then it hit me - this stubborn optimism of "somehow it\'ll work out."

What I cared most about was readability. Wide line spacing, plenty of whitespace - so even long text doesn\'t tire you out. Mixed serif and monospace fonts to balance softness with solidity. And I couldn\'t forget playfulness - hover over the "!" in the title and it turns to "?". Little touches like that.

Tech-wise: Next.js and CSS Modules. Simple is best. Rather than loading up libraries, implementing just what you need makes life easier later. Plus, you actually understand it. The slide-in modal, floating nav - each element has intention behind it.

Not perfect, but good enough. Somehow, it works.`,
        tech: 'Next.js / TypeScript / React',
        githubUrl: 'https://github.com/yourusername/nantoka',
        link: '#',
        type: 'app' as const,
      },
      {
        date: '2024.12.04',
        title: 'Building Modals with Just CSS',
        description: 'You don\'t need heavy JavaScript - CSS alone makes pretty nice modals. Just transition and transform.',
        detailContent: `I used to think modals needed JavaScript control. Turns out, CSS is enough.

Desktop: slides in 50% from the right. Mobile: 90vh from bottom. It\'s simple - start with elements off-screen (translateX(100%) or translateY(100%)), then return to 0 on open. That\'s it for the smooth motion.

For easing, I went with cubic-bezier(0.25, 0.1, 0.25, 1). Tried a bunch, this felt most natural. The 0.5s duration matters too - too fast feels rushed, too slow gets annoying. It\'s all feel.

React state is just one boolean: isOpen. Everything else lives in CSS. Separating logic from style means later you can look at it and immediately go "ah, this just handles modal open/close." Simple is justice.`,
        readTime: '8 min',
        link: '#',
        type: 'note' as const,
      },
      {
        date: '2024.12.04',
        title: 'Floating Nav That Stays Out of Your Way',
        description: 'Navs that stick around on screen are annoying, right? Built one that only appears when needed.',
        detailContent: `Floating navs are useful, but honestly? Annoying. The ones that stay visible all the time get in the way of scrolling.

So I made it "appear only when needed." Disappears 2 seconds after opening. Gone 0.8s after scrolling. Better to vanish when not in use.

Implementation: useEffect plus timer control. Scroll events fire constantly, so without proper control you get wasteful re-renders. Got stuck on that initially. Gotta clean up those timers or you\'ll leak memory.

Also: changing button display based on current section, fading out with opacity and transform. These small details add up to hopefully make someone think "oh, this is nice to use."

Not perfect, sure. But I think it\'s good enough.`,
        readTime: '10 min',
        link: '#',
        type: 'note' as const,
      },
    ] as Entry[],
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.ja;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ja');

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
