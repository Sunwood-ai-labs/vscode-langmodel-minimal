import * as vscode from 'vscode';
import { getWebviewContent } from './webview/WebviewContent';
import { ChatModelManager } from '../models/ChatModelManager';
import { MessageHandler } from '../utils/MessageHandler';

export class ChatView implements vscode.WebviewViewProvider {
    public static readonly viewType = 'chat.chatView';
    private _view?: vscode.WebviewView;
    private modelManager: ChatModelManager;
    private messageHandler: MessageHandler;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) {
        this.modelManager = new ChatModelManager();
        this.messageHandler = new MessageHandler();
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = getWebviewContent(webviewView.webview);

        // メッセージハンドラーの設定
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'sendMessage':
                    await this.handleSendMessage(data.message);
                    break;
                case 'changeModel':
                    await this.handleModelChange(data.modelFamily);
                    break;
            }
        });
    }

    private async handleSendMessage(message: string) {
        try {
            this.showProgress('AIが考え中...');

            const response = await this.modelManager.sendMessage(message);
            let fullResponse = '';

            for await (const fragment of response.text) {
                fullResponse += fragment;
                // ストリーミングレスポンスを送信
                this._view?.webview.postMessage({
                    type: 'streamResponse',
                    fragment: fragment
                });
            }

            // 完了通知
            this._view?.webview.postMessage({
                type: 'receiveMessage',
                message: fullResponse
            });

        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage('エラーが発生しました: ' + error.message);
            }
        }
    }

    private async handleModelChange(modelFamily: string) {
        try {
            await this.modelManager.setModel(modelFamily);
            this._view?.webview.postMessage({
                type: 'modelChanged',
                model: modelFamily
            });
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage('モデルの変更に失敗しました: ' + error.message);
            }
        }
    }

    private showProgress(message: string) {
        this._view?.webview.postMessage({ 
            type: 'showProgress',
            message: message 
        });
    }
}
