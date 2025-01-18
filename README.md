<div align="center">

![Header](assets/header.png)

# vscode-langmodel-minimal

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg?style=flat-square)](package.json)
[![VSCode](https://img.shields.io/badge/VS_Code-1.95.0+-373277.svg?style=flat-square&logo=visual-studio-code)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![GitHub Copilot](https://img.shields.io/badge/GitHub_Copilot-Ready-2ea44f.svg?style=flat-square&logo=github)](https://github.com/features/copilot)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)

シンプルで効率的なVS Code言語モデル拡張機能です。GitHub CopilotのAPIを活用して、VS Code内でAIアシスタントとのチャット対話が可能です。

</div>

## ✨ 機能

### 🏗️ 洗練された構造設計
- `src/views/`: UIコンポーネント
- `src/models/`: チャットモデル管理
- `src/utils/`: ユーティリティ機能
- 高いメンテナンス性と可読性

### 🎨 モダンなUI
- アニメーション効果による滑らかな表示
- レスポンシブデザイン
- VSCodeテーマに完全対応
- カスタマイズ可能なスタイリング

### 🤖 高度なAI機能
- 複数の言語モデルに対応
  - GPT-4 Optimized
  - GPT-4 Mini
  - Claude 3.5 Sonnet
- モデル切り替えUI
- ストリーミングレスポンス

### ⌨️ 便利な操作機能
- キーボードショートカット
  - `Ctrl+Shift+C` (Mac: `Cmd+Shift+C`): チャットを開く
  - `Ctrl+Shift+M` (Mac: `Cmd+Shift+M`): モデルを選択
- ツールバーアクション
  - モデル選択
  - チャット履歴のクリア
- マークダウン形式のメッセージ対応

## 📋 必要条件

- Visual Studio Code 1.95.0以上
- GitHub Copilot Chat拡張機能

## 🚀 使い方

1. プロジェクトのセットアップ:
   ```bash
   npm install
   ```

2. 拡張機能の起動:
   - F5キーを押す
   - または、デバッグビューから「Run Extension」を実行
   - 新しいVS Codeウィンドウが開き、拡張機能が有効化されます

3. チャットの開始:
   - サイドバーのチャットアイコンをクリック
   - または、`Ctrl+Shift+C` (`Cmd+Shift+C`) を使用
   - コマンドパレットから「チャットを開く」を実行

4. モデルの選択:
   - ツールバーのモデル選択アイコンをクリック
   - または、`Ctrl+Shift+M` (`Cmd+Shift+M`) を使用
   - コマンドパレットから「チャットモデルを選択」を実行

## 🔧 開発者向け情報

### 📁 プロジェクト構造

```
src/
├── views/           # UIコンポーネント
│   ├── ChatView.ts
│   └── webview/
│       └── WebviewContent.ts
├── models/          # モデル管理
│   └── ChatModelManager.ts
├── utils/          # ユーティリティ
│   └── MessageHandler.ts
└── extension.ts    # エントリーポイント
```

### 🛠️ 主要コンポーネント

- `ChatView`: WebViewベースのチャットインターフェース
- `ChatModelManager`: 言語モデルの管理と通信
- `MessageHandler`: メッセージの処理と履歴管理
- `WebviewContent`: UIのHTML/CSS/JavaScript実装

## 📝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成
3. 変更を加えてコミット
4. プルリクエストを作成

## 📄 ライセンス

MITライセンスの下で公開されています。
