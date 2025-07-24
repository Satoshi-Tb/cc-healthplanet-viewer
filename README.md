# Health Planet Dashboard

タニタの **Health Planet** から取得した体重・体脂肪率データを閲覧する Next.js アプリです。MUI でデザインされた UI 上で期間を切り替えながらグラフとテーブルを確認でき、CSV エクスポートも行えます。

## 必要環境
- Node.js 18 以上
- `.env.local` に `HEALTH_PLANET_ACCESS_TOKEN` を設定

## セットアップ
```bash
npm install
```

## 開発サーバー起動
```bash
npm run dev
```
`http://localhost:3000` をブラウザで開くとアプリが表示されます。

## 主な機能
- 週・月・年の範囲でデータ取得
- 体重・体脂肪率のチャート表示（Recharts）
- データ一覧テーブル
- CSV エクスポート
- MUI によるレスポンシブ対応

## スクリプト
```bash
npm run lint            # ESLint による静的解析
npm run type-check      # TypeScript 型チェック
npm run test            # 単体テスト (Jest)
npm run test:e2e        # E2E テスト (Playwright)
npm run build           # 本番ビルド
npm run export          # 静的サイトのエクスポート
```

## テスト
単体テストは `jest` と `@testing-library/react`、E2E テストは `playwright` で実施します。E2E テスト実行時は開発サーバーが自動で起動します。

## デプロイ
`next.config.ts` で `output: 'export'` を指定しているため、`npm run export` で静的 HTML を生成できます。生成された `out` ディレクトリを静的ホスティングサービスにアップロードしてください。
