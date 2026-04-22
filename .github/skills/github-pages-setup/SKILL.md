---
name: github-pages-setup
description: 'GitHub Pages の構築・公開・初期確認を進める skill。Use when setting up GitHub Pages, choosing a publishing source, verifying static site files, adding .nojekyll, documenting deploy steps, or troubleshooting why a Pages site is not publishing.'
argument-hint: 'リポジトリ種別、公開方法、カスタムドメインの有無'
user-invocable: true
---

# GitHub Pages Setup

GitHub Pages で静的サイトを公開するための判断手順、設定手順、確認項目をまとめた skill や。

## When to Use

- GitHub Pages を新規に設定したい
- `main / root`、`docs/`、GitHub Actions のどれを使うべきか決めたい
- 静的サイト公開前に必要なファイルや設定を点検したい
- `.nojekyll` が必要か判断したい
- カスタムドメイン設定や公開後の確認手順を整理したい
- README や運用手順に GitHub Pages の公開方法を書きたい

## Inputs to Confirm

最初に次を確認する。

1. これはユーザーサイト / 組織サイトか、プロジェクトサイトか
2. サイトはビルド不要の静的配信か、ビルド成果物を出す構成か
3. 公開元は `branch + folder` で足りるか、GitHub Actions が必要か
4. カスタムドメインを使うか
5. 既に README や公開 URL が決まっているか

## Decision Guide

### 1. 公開方式を決める

- ビルド不要の HTML/CSS/JS だけなら `Deploy from a branch` を優先する
- 生成物を作るなら GitHub Actions を使う
- 単純な静的サイトで公開元を分けたいなら `docs/` を選べる

### 2. Jekyll 処理の有無を決める

- Jekyll を使わへんなら `.nojekyll` を置く
- アンダースコア始まりのファイルやそのまま配信したい静的資産がある場合も `.nojekyll` を検討する

### 3. URL とパスを決める

- ユーザーサイト / 組織サイトなら通常はルート URL 配下で公開される
- プロジェクトサイトなら通常は `/<repository-name>/` 配下になる
- そのため、画像・CSS・JS のパスがルート固定になってへんか確認する

## Procedure

### 1. リポジトリを点検する

- `index.html` の有無を確認する
- `404.html`、`assets/`、`.nojekyll`、README の記載を確認する
- 相対パスでアセット参照しているか確認する

### 2. 公開元を決める

- 単純な静的サイトなら `main / root` か `main / docs` を選ぶ
- ビルドが必要なら GitHub Actions に切り替える
- 迷うならまず `branch / root` を採用し、運用が複雑になってから Actions を検討する

### 3. GitHub Pages を設定する

GitHub の `Settings -> Pages` で次を設定する。

1. Source を開く
2. `Deploy from a branch` か `GitHub Actions` を選ぶ
3. ブランチとフォルダを選ぶ
4. 保存して公開 URL を確認する

### 4. リポジトリ側の補助設定を整える

- 静的サイトで Jekyll 不要なら `.nojekyll` を置く
- README に公開 URL と公開手順を書く
- カスタムドメインを使うなら `CNAME` と DNS を整える

### 5. 公開結果を検証する

- ルート URL でトップページが開く
- CSS と JavaScript が 404 にならへん
- 画像が表示される
- `404.html` が Pages 上でも想定どおり動く
- モバイル幅とデスクトップ幅の両方で崩れへん

## Completion Checks

- GitHub Pages の公開 URL が確定している
- 公開元のブランチ / フォルダまたは Actions が明示されている
- 主要アセットが相対パスで読み込めている
- `.nojekyll` の要否が整理できている
- README に公開 URL と最低限の運用情報が残っている

## Common Failure Modes

- プロジェクトサイトなのにルート絶対パスを使っていてアセットが壊れる
- 公開元ブランチを誤って選んでいる
- `docs/` を選んだのに成果物がルート直下にある
- Jekyll 非対応ファイルが無視される
- カスタムドメインの DNS 反映前に設定不備と誤認する

## Recommended References

- [official docs](./references/official-docs.md)

## Suggested Output Pattern

この skill を使うときは、結果を次の順でまとめる。

1. リポジトリの種類と前提
2. 推奨する公開方式
3. 必要な設定手順
4. 公開後の確認項目
5. README に残すべき内容

## Example Prompts

- このリポジトリを GitHub Pages で公開する手順を整理して
- GitHub Pages の公開元は `main / root` と `docs/` のどっちがええか比較して
- この静的サイトで `.nojekyll` が必要か確認して
- GitHub Pages 公開後の確認チェックリストを作って