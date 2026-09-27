# エニクック スケジュール（factory-schedule）

工場予定・個人予定を共有するカレンダーです。GitHub Pages で公開し、データは Firebase Realtime Database に保存します。

公開URL: https://any-cook.github.io/factory-schedule/factory_schedule.html

## ファイル構成

| ファイル | 役割 |
|---|---|
| `factory_schedule.html` | アプリ本体 |
| `manifest.json` | スマホにインストールするときの設定（名前・アイコン・起動ページ） |
| `sw.js` | Service Worker。画面ファイルをキャッシュし、電波が悪くても起動できるようにする |
| `icon-192.png` / `icon-512.png` | アプリアイコン |
| `icon-maskable-512.png` | Android用（丸く切り抜かれても欠けない余白付き） |
| `apple-touch-icon.png` | iPhoneのホーム画面用 |
| `database.rules.json` | Firebase のセキュリティルール（コンソールに貼り付けて使う） |

画面を更新したのにスマホで古いまま表示されるときは、`sw.js` の `CACHE` の番号（例：`v2` → `v3`）を上げてください。

## ログイン（Googleアカウント）

`factory_schedule.html` の `REQUIRE_LOGIN` を `true` にすると、Googleアカウントでのログインが必須になります。

- `@any-cook.com` のアカウントは登録なしで使えます
- それ以外（個人のGmailなど）は、会社アカウントでログインして「👥 利用者」から追加します

### 有効にする手順

1. Firebaseコンソール → Authentication → ログイン方法 → **Google を有効にする**
2. Authentication → 設定 → 承認済みドメイン に **any-cook.github.io** があるか確認（なければ追加）
3. `REQUIRE_LOGIN` を `true` にして公開し、ログインできることを確認
4. 最後に Realtime Database → ルール に `database.rules.json` の中身を貼り付けて公開

ルールを公開すると、ログインしていないアクセスはデータを読み書きできなくなります。
このデータベースを読んでいる他のシステム（社内チャットボット fukushi-bot など）も、ログイン対応が必要です。
