# Health Planet データ閲覧Webアプリ

## プロジェクト概要
タニタのHealth Planetに登録された健康データを閲覧するWebアプリケーション

## 技術スタック
- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **UI ライブラリ**: MUI (Material-UI)
- **データ取得**: SWR + fetch API
- **状態管理**: Jotai（必要に応じて）
- **チャート**: Chart.js / Recharts
- **スタイリング**: CSS Modules / Emotion (MUI標準)
- **テスト**: Jest + React Testing Library + Playwright
- **デプロイ**: Cloudflare Pages

## 機能要件

### データ表示
- 体重
- 体脂肪率

### 期間選択
- 週次表示
- 月次表示
- 年次表示

### 表示機能
- グラフ・チャート表示
- データテーブル表示
- CSVエクスポート機能

### UI/UX
- モバイルレスポンシブデザイン
- シンプルで直感的なインターフェース
- Material Design準拠

## API仕様
- **外部API**: Health Planet API
- **認証**: 既存のアクセス権限を使用
- **データ保存**: なし（リアルタイム取得）

## プロジェクト構成
```
src/
├── app/                 # Next.js App Router
├── components/          # 再利用可能コンポーネント
│   ├── common/         # 共通コンポーネント
│   ├── charts/         # チャート関連
│   └── data/           # データ表示関連
├── hooks/              # カスタムフック
├── lib/                # ユーティリティ・設定
├── types/              # TypeScript型定義
├── styles/             # スタイル定義
├── __tests__/          # 単体テスト
└── e2e/                # E2Eテスト (Playwright)
```

## 開発コマンド
```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# リント
npm run lint

# 単体テスト
npm run test

# E2Eテスト
npm run test:e2e

# テストカバレッジ
npm run test:coverage
```

## 環境変数
```env
HEALTH_PLANET_CLIENT_ID=your_client_id
HEALTH_PLANET_CLIENT_SECRET=your_client_secret
HEALTH_PLANET_ACCESS_TOKEN=your_access_token
```

## Health Planet API エンドポイント
- **ベースURL**: https://www.healthplanet.jp/status/
- **データ取得**: innerscan.json
- **認証方式**: OAuth 2.0

## 非機能要件
- 単一ユーザー対応
- データ永続化なし
- レスポンシブデザイン対応
- パフォーマンス最適化（SWRキャッシュ活用）

## テスト戦略

### 単体テスト (Jest + React Testing Library)
- **対象**: コンポーネント、フック、ユーティリティ関数
- **ツール**: Jest + React Testing Library + @testing-library/jest-dom
- **モック**: MSW (Mock Service Worker) でAPI モック
- **カバレッジ目標**: 80%以上

### E2Eテスト (Playwright)
- **対象**: ユーザーシナリオ全体
- **ブラウザ**: Chrome, Firefox, Safari
- **テストケース**:
  - データ表示の正常動作
  - 期間選択の動作確認
  - CSVエクスポート機能
  - レスポンシブデザイン確認

### テスト実行
```bash
# 単体テスト実行
npm run test

# E2Eテスト実行
npm run test:e2e

# 全テスト実行
npm run test:all

# テストカバレッジ確認
npm run test:coverage
```

## デプロイ

### Cloudflare Pages
- **プラットフォーム**: Cloudflare Pages
- **CI/CD**: GitHub Actions + Cloudflare Pages
- **ドメイン**: カスタムドメイン対応
- **SSL**: 自動SSL証明書
- **CDN**: グローバルエッジネットワーク

### デプロイコマンド
```bash
# 本番ビルド
npm run build

# 静的エクスポート
npm run export

# デプロイ（Cloudflare Pages）
npm run deploy

# プレビューデプロイ
npm run deploy:preview
```

### 環境変数 (本番)
```env
# Cloudflare Pages環境変数
HEALTH_PLANET_CLIENT_ID=your_production_client_id
HEALTH_PLANET_CLIENT_SECRET=your_production_client_secret
HEALTH_PLANET_ACCESS_TOKEN=your_production_access_token
NEXT_PUBLIC_APP_ENV=production
```

### CI/CD パイプライン
1. **GitHub Push** → `main`ブランチ
2. **GitHub Actions** → テスト実行
3. **Cloudflare Pages** → 自動ビルド・デプロイ
4. **プレビュー** → PR毎に自動生成
5. **本番反映** → マージ後自動デプロイ

### デプロイ設定
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `out`
- **Node.js バージョン**: 18.x
- **環境変数**: Cloudflare Pages設定画面で管理

### セキュリティ
- **HTTPS強制**: 自動リダイレクト
- **セキュリティヘッダー**: 自動設定
- **DDoS保護**: 標準装備
- **WAF**: Web Application Firewall

## 開発戦略

### 品質保証
- **機能追加・修正時の必須チェック**:
  - タイプチェック (`npm run type-check`)
  - ビルド (`npm run build`)
  - 単体テスト (`npm run test`)
  - E2Eテスト (`npm run test:e2e`)
- 全てのチェックをパスしてからコミット・デプロイを実行

## 今後の拡張予定
- 目標設定機能
- データ比較機能
- 通知機能
- PWA化