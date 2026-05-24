# 有據 yoju · yoju.embraced.co

> 健康有據，給家人的每日衛教筆記

每天自動生成、來源查證、寫給長輩讀的繁體中文健康衛教文章。AI 負責勤勞、真人負責方向。

➡️ **想了解設計理念與運作方式：[/about](https://yoju.embraced.co/about)**

---

## 這個 repo 裡有什麼

這是 yoju 的**網站前端 + 文章內容**，公開可見。內容生成的 pipeline 在另一個私有 repo（不公開以保護 prompt engineering、SCImago 資料、API key 設定）。

```
yoju-site/
├── src/
│   ├── content/articles/    ← 每篇文章（MDX，pipeline 每天 push 新文章進來）
│   ├── content.config.ts    ← Frontmatter schema（含 topic_key, superseded_by 鏈接）
│   ├── pages/
│   │   ├── index.astro          ← 首頁（最新文章列表，過濾掉舊版）
│   │   ├── about.astro          ← 初衷頁
│   │   ├── [category]/          ← 分類頁
│   │   └── [...slug].astro      ← 文章頁（含 superseded banner、TLDR、分享按鈕、來源列表）
│   ├── layouts/             ← Base + Article 兩層
│   ├── components/          ← TLDRBox、SourceList、ShareLine、ArticleCard、Footer
│   └── pages/og/[...slug].png.ts  ← 1200×630 OG 分享圖（satori 即時生成）
└── public/fonts/            ← Noto Sans TC (Traditional Chinese) for OG images
```

技術選擇：[Astro 6](https://astro.build/) + [Tailwind 3](https://tailwindcss.com/) + [satori](https://github.com/vercel/satori)，部署在 [Cloudflare Workers (Static Assets)](https://developers.cloudflare.com/workers/static-assets/)。

---

## 文章 frontmatter

```yaml
title: string
date: YYYY-MM-DD
category: 老年醫學 | 心血管 | 腦部健康 | 骨骼關節 | 代謝疾病 | 感官退化
tags: [string]
tldr: string                  # ≤200 字，TL;DR 給 LINE 分享用
confidence: high | medium
sources:                       # ≥1 條，全部已驗證
  - title: string
    url: string
    journal?: string
    quartile?: Q1 | Q2 | Q3 | Q4 | official
    doi?: string
    retracted: boolean
topic_key?: string             # 同主題識別碼（augment chain）
superseded_by?:                # 該文已有更新版時的指向
  slug: string
  date: YYYY-MM-DD
  title: string
```

讀者要驗證任何主張的根據時，看 `sources` 即可。所有 Q1/official 連結都是 pipeline 在發布前驗證活著的。

---

## 怎麼參與

歡迎協助讓內容更正確。

### 🩺 醫療專業人士

如果你是醫師、護理師、藥師、營養師、物理治療師、醫學研究等專業背景：

- **內容勘誤** → 開 [GitHub Issue](https://github.com/embraced/yoju-site/issues) 或 [回饋表單](https://forms.gle/F2gho2rvhnbbysdk7)
- **架構討論 / 設計理念** → [GitHub Discussions](https://github.com/embraced/yoju-site/discussions)
- **建議新主題** → Discussions 開 idea thread，附上你會用的官方來源（NIH/AHA/醫學會等）

### 👨‍👩‍👧 一般讀者

- **發現錯誤** → 文章底下的 [回饋表單](https://forms.gle/F2gho2rvhnbbysdk7)（文章 URL 會自動帶入）
- **想分享給家人** → 每篇文章都有 LINE / Facebook 分享按鈕
- **想保留**舊版內容 → 文章上有「📌 已更新」banner 時，舊文 URL 仍可訪問，只是不會出現在首頁列表

### 🤖 想知道 AI 怎麼寫的

**寫作角度與結構、查證流程、信心評等規則**在 [/about](https://yoju.embraced.co/about) 有完整說明，足以供讀者與醫療專業人士理解 AI 被如何指示。

**完整的 prompt 文字、PubMed 查詢語法、SCImago 期刊清單、信心評分演算法**保留在私有 repo——這不是為了藏私，而是為了：(1) 避免被惡意 prompt injection 利用，(2) 維護負擔考量。如果你是醫師、教育工作者、或研究 AI 衛教的人，想看細節可以寄信 [yoju@embraced.co](mailto:yoju@embraced.co) 討論。

Pipeline 的每日執行記錄（哪些主題、來源、哪些被 skip）也存於私有 repo 的 `logs/`。

---

## Local development

```bash
npm install --legacy-peer-deps   # Astro 6 + @astrojs/tailwind v3 的 peer-dep 設定
npm run dev                      # http://localhost:4321
npm run build && npm run preview # 完整建置預覽
```

部署：push 到 `main` → Cloudflare Worker 自動 build + deploy 到 yoju.embraced.co（含 SSL 與 OG 圖預先生成）。

---

## License

文章內容（`src/content/articles/`）：CC BY-SA 4.0，歡迎轉載引用，請附原文連結。

網站程式碼（其他部分）：MIT。

---

⚠️ **免責聲明**：本站內容由 AI 輔助整理、人工把關，僅供衛教參考，不構成醫療建議。
身體不適或需要診療，請諮詢您熟悉的醫師。
