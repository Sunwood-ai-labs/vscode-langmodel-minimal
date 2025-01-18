import * as vscode from 'vscode';
import { ChatView } from './views/ChatView';

export function activate(context: vscode.ExtensionContext) {
    // チャットビューの登録
    const chatViewProvider = new ChatView(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            ChatView.viewType,
            chatViewProvider
        )
    );

    // チャットコマンドの登録
    context.subscriptions.push(
        vscode.commands.registerCommand('chat.openChat', () => {
            vscode.commands.executeCommand('workbench.view.extension.chat-view');
        })
    );

    // チャットモデルのクイックピッカーコマンドの登録
    context.subscriptions.push(
        vscode.commands.registerCommand('chat.selectModel', async () => {
            const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
            const modelItems = models.map(model => ({
                label: `$(symbol-keyword) ${model.family}`,
                description: model.vendor,
                detail: `最大入力トークン: ${model.maxInputTokens}`,
                model: model
            }));

            const selected = await vscode.window.showQuickPick(modelItems, {
                placeHolder: 'チャットモデルを選択',
                title: 'モデルの選択'
            });

            if (selected) {
                // イベントを発行してモデルの変更を通知
                vscode.commands.executeCommand('chat.modelChanged', selected.model.family);
            }
        })
    );

    // 拡張機能が有効化されたことを通知
    vscode.window.showInformationMessage('Chat Extension が有効化されました！');
}

export function deactivate() {}
