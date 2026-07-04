# komukai-portfolio

小向碧希さんのポートフォリオサイト（コーディング版）。これまでのCanva版（https://komukai-portfolio-a.my.canva.site/）とは別に、案件獲得率向上のために構築。

「何を載せるか」のルールは [content-guideline.md](content-guideline.md) を参照。

## ローカルで確認する

`index.html` を直接ダブルクリックで開くと、ブラウザのセキュリティ制限で `data/works.json` 等が読み込めず実績セクションが空になることがあります。必ず簡易サーバーを立てて確認してください。

```bash
# Python がある場合
cd komukai-portfolio
python -m http.server 8000
# → http://localhost:8000 をブラウザで開く
```

## 公開前にやること（TODO）

- [ ] LPバナー画像を `assets/images/hero/lp-banner.jpg` に配置（添付してもらった画像）
- [x] LP画像から正式なカラーコードを抽出し、`css/variables.css` の色を微調整
- [ ] ショート動画をYouTube限定公開等にアップロードし、`data/works.json` の `embedId` を設定
- [x] フィード投稿画像を `assets/works/` に配置し、`thumbnail` パスを実ファイルに合わせる
- [ ] 各実績・クライアントコメントの掲載許可を確認し、`publishStatus` を `公開可能` 等に更新（content-guideline.md の3区分ルール参照）
- [x] `#contact` セクションの「お問い合わせフォームへ」ボタン（現在 `href="#"`）に、実際の問い合わせ先（Googleフォーム・mailto等）を設定
- [x] お問い合わせ先が確定したらREADMEとこのチェックリストを更新

## デプロイ（Cloudflare Pages・無料）

1. [Cloudflare](https://dash.cloudflare.com/) にアカウント作成
2. このフォルダをGitHubリポジトリにpush（GitHubアカウントが無い場合はWrangler CLIでの直接アップロードに切り替え）
3. Cloudflare Pages でリポジトリを連携し、ビルドコマンドは空（静的ファイルのみのため不要）、公開ディレクトリはルート（`/`）に設定
4. デプロイ完了後に発行されるURL（`*.pages.dev`）で確認
5. 問題なければ独自ドメインを無料で追加可能（任意）

**公開・外部への共有（profile.mdのリンク差し替えやSNSでの告知など）は、必ず小向さんに確認した上で実行すること。**

## ディレクトリ構成

```
index.html
css/        reset.css / variables.css / style.css
js/         main.js（ナビ・年表示）/ render-works.js（実績カード生成）
data/       works.json / testimonials.json
assets/     images/hero, images/icons, works
content-guideline.md   運用ルール（掲載許可・匿名化・数値ルール）
```

## 実績データの更新方法

新しい実績は `data/works.json` に1ブロック追記するだけで反映されます（HTMLは触らなくてOK）。項目の意味は `content-guideline.md` の「1. 実績追加時の記述ルール」を参照してください。
