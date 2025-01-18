import * as vscode from 'vscode';

export class ChatModelManager {
    private currentModel?: vscode.LanguageModelChat;
    private readonly defaultModelFamily = 'gpt-4o';

    constructor() {
        this.initializeModel();
    }

    private async initializeModel() {
        try {
            await this.setModel(this.defaultModelFamily);
        } catch (error) {
            console.error('モデルの初期化に失敗しました:', error);
        }
    }

    public async setModel(modelFamily: string): Promise<void> {
        try {
            const [model] = await vscode.lm.selectChatModels({
                vendor: 'copilot',
                family: modelFamily
            });

            if (!model) {
                throw new Error('GitHub Copilot Chatの拡張機能が必要です。');
            }

            this.currentModel = model;
        } catch (error) {
            throw new Error(`モデルの設定に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
        }
    }

    public async sendMessage(message: string): Promise<vscode.LanguageModelChatResponse> {
        if (!this.currentModel) {
            throw new Error('チャットモデルが初期化されていません。');
        }

        const messages = [
            vscode.LanguageModelChatMessage.User(
                'あなたは優秀なアシスタントです。ユーザーの質問になんでも丁寧に答えてください。'
            ),
            vscode.LanguageModelChatMessage.User(message)
        ];

        try {
            return await this.currentModel.sendRequest(
                messages,
                {},
                new vscode.CancellationTokenSource().token
            );
        } catch (error) {
            if (error instanceof vscode.LanguageModelError) {
                throw new Error(`AI応答エラー: ${error.message}`);
            }
            throw error;
        }
    }

    public async getAvailableModels(): Promise<string[]> {
        const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
        return models.map(model => model.family);
    }
}
