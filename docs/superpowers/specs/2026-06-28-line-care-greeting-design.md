# LINE 關心問候（care greeting）設計

**日期**：2026-06-28
**狀態**：設計定案，待實作計畫

## 目標

讓子女把 yoju 文章分享到 LINE 給長輩時，收到的人**直接感受到發送者的關心**，而不是讀到一段臨床摘要。把「分享連結」這個動作本身，變成完成「關心家人健康」念頭的載體。

## 背景

`yoju/scripts/writer.py:309` 顯示團隊早已為 LINE/Messenger 轉發設計過 `tldr`（特地移除 citation，因 LINE preview 不 render `<sup>`，裸露 `[5][6]` 會破壞卡片）。本功能在既有的 LINE 分享考量上，再加一層「溫度」。

「LINE 上的預覽文字」其實有兩個獨立表面：

1. **OG 卡片描述**（`og:description`）：任何人把網址貼進 LINE 時，LINE 爬蟲抓頁面顯示的卡片灰字。對所有人相同，無法因人而異。
2. **分享按鈕訊息**（`ShareLine.astro`）：使用者按「分享到 LINE」後預先填好、可再編輯的訊息正文。是發送者本人的口吻。

兩者本次都改成關心問候。

## 資料模型

新增 frontmatter 欄位 `greeting`：每篇一句、貼合主題的關心問候。

- 型別：`z.string().max(80).optional()`（位於 `yoju-site/src/content.config.ts`）
- 風格：口語、無醫療術語、無 citation、通常是一個關心式問句
- 例：
  - 青光眼 → `最近眼睛容易累、看東西霧霧的嗎？`
  - 牙周病 → `刷牙時牙齦會流血嗎？`
  - 白內障 → `最近看東西像蒙上一層霧嗎？`
- optional：缺欄位時各表面 fallback 回 `tldr`，確保回填完成前不破版。

## 渲染：兩個表面

### A. OG 卡片（`og:description`）

**問題**：目前 `Base.astro` 的 `og:description`、`meta name="description"`、`twitter:description` 共用同一個 `description` prop（= `tldr`）。直接改會連 Google SEO snippet 一起改掉。

**做法**：解耦。

- `yoju-site/src/layouts/Base.astro`：新增 `ogDescription?: string` prop，預設 `= description`。只有 `<meta property="og:description">` 改用 `ogDescription`。
- `meta name="description"`、`twitter:description`、`ArticleSchema` 的 description **維持 `tldr` 不變** → SEO / AI 答案引擎（GEO）完全不受影響。
- `yoju-site/src/layouts/Article.astro`：傳 `ogDescription={greeting ?? tldr}` 給 `Base`。

### B. 分享按鈕訊息（`ShareLine.astro`）

- `yoju-site/src/components/ShareLine.astro`：新增 `greeting?: string` prop；`shareMessage` 由

  ```
  ${title}\n\n${tldr}\n\n${displayUrl}\n\n僅供參考，請諮詢醫師
  ```

  改為

  ```
  ${greeting ?? tldr}\n\n${displayUrl}
  ```

- 不放標題（LINE 會自動把連結 render 成卡片，卡片已含標題＋greeting＋縮圖，避免重複）。
- **移除免責聲明**（使用者決定）——目的地文章頁與 TLDRBox 仍保有完整脈絡與 confidence badge。
- `yoju-site/src/layouts/Article.astro`：兩處 `<ShareLine>` 都多傳 `greeting={greeting}`。

> 備註：LINE 分享按鈕流程下，訊息正文（greeting）與自動 render 的卡片（其 `og:description` 也是 greeting）會出現同一句問候兩次。視為可接受的「強化」，不另設兩套文案，維持「每篇一句」的簡單性。

## 問候的生成

### 未來新文章（pipeline）

- `yoju/scripts/writer.py`：
  - `ArticleOutput` dataclass 增 `greeting` 欄位。
  - `build_article_prompt` / `build_augment_prompt` 的輸出格式範例加上 `greeting:` 行。
  - 加一條 prompt rule 規範問候口吻（口語、問句、無術語、無 citation、≤ 約 30 字）。
  - `parse_claude_response` 解析 `greeting`，寫入輸出 frontmatter。
  - greeting 缺失時不應 raise（與 tldr 不同，greeting 為 optional），缺則略過該欄位由站台 fallback。

### 既有 ~70 篇回填

- 新增一次性腳本 `yoju/scripts/backfill_greetings.py`：
  - 掃 `yoju-site/src/content/articles/*.mdx`。
  - 對每篇讀 `title` + `tldr`，呼叫 Claude（Haiku，便宜）生一句 greeting。
  - 寫回該檔 frontmatter。
  - **idempotent**：已有 `greeting` 欄位則跳過。
  - 使用 `python-frontmatter`（writer.py 已依賴）讀寫，避免破壞既有 YAML。

## 受影響檔案總覽

**yoju-site（公開站台）**
- `src/content.config.ts` — 加 `greeting` 欄位
- `src/layouts/Base.astro` — 加 `ogDescription` prop，解耦 og:description
- `src/layouts/Article.astro` — 傳 `ogDescription` 與 `greeting`
- `src/components/ShareLine.astro` — 訊息改用 greeting、去標題、去免責

**yoju（私有 pipeline）**
- `scripts/writer.py` — 生成 greeting（prompt + parse + dataclass）
- `scripts/backfill_greetings.py` — 新增，回填既有文章

## 測試與驗證

- `content.config.ts` 改 schema 後，`npm run build` 必須通過（缺 greeting 的文章不應報錯，因 optional）。
- 回填腳本：先對 3 篇 dry-run 看產出，使用者確認語氣後再跑全部。
- 抽一篇 build 後檢查 `<meta property="og:description">` = greeting、`<meta name="description">` = tldr（解耦驗證）。
- 手動驗一次 LINE 分享按鈕 URL：`shareMessage` 正確帶入 greeting、無免責、無標題。

## 非目標（YAGNI）

- 不做因「收件對象關係」而變的動態問候（OG 卡片本質無法因人而異）。
- 不改 `twitter:description`、`meta name=description`、JSON-LD（保 SEO）。
- 不做使用者自訂問候 UI。
