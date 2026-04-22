# 神山まるごと高専 紹介ページ（非公式）

徳島県神山町にある **神山まるごと高専** を紹介する、学習目的の非公式静的サイトです。
深い森と木漏れ日をテーマにした1ページ完結のスクロール型サイトで、HTML/CSS/JS のみで構成されています（ビルド不要）。

## 公開URL

- https://pottyama1222.github.io/ghcp-school-intro-sakuma/

> GitHub リポジトリの **Settings → Pages** で `Branch: main / root` を選択して公開しています。

## 構成

```
index.html              全セクションのマークアップ
404.html                エラーページ
.nojekyll               Jekyll処理を無効化
assets/
  css/style.css         デザイントークン・テーマ・レイアウト・アニメ
  js/main.js            メニュー / フェード / カルーセル / ライトボックス / ダークモード
  img/                  プレースホルダーSVG（施設4 + ギャラリー5）
```

## セクション

1. ヒーロー（葉影＋木漏れ日）
2. 学校概要
3. 教育内容・カリキュラム（3本柱 + 5年タイムライン）
4. キャンパス・施設紹介（ライトボックス対応）
5. 学生生活・寮生活（1日のスケジュール）
6. ギャラリー（カルーセル + サムネイル + ライトボックス）

## インタラクション

- ハンバーガーメニュー（768px未満、`aria-expanded` 切替、Esc で閉じる）
- IntersectionObserver によるフェードイン（`prefers-reduced-motion` 尊重）
- カルーセル（スナップスクロール、矢印ボタン、ドット、サムネイル、矢印キー対応）
- ライトボックス（`<dialog>`、Esc / ←→ / バックドロップクリック）
- ダークモード切替（`localStorage` 永続化、初期値は `prefers-color-scheme`）

## ローカル確認

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## 画像差し替え手順

1. `assets/img/` 配下に同名で画像（SVG/PNG/WebP）を上書き配置
2. アスペクト比は施設 = 3:2、ギャラリー = 16:10 を推奨
3. `<img>` の `alt` を `index.html` で適切に更新

## 注意

本サイトは **学習目的の非公式紹介ページ** です。最新かつ正確な情報は [神山まるごと高専 公式サイト](https://kamiyama.ac.jp/) をご確認ください。

## ライセンス

- コード: MIT
- フォント: [Noto Sans/Serif JP](https://fonts.google.com/noto) (SIL Open Font License)
- 画像: 自作SVGプレースホルダー
