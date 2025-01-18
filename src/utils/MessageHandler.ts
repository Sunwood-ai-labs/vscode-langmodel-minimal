import * as vscode from 'vscode';

const MESSAGE_TYPES = {
    USER: 'user',
    AI: 'ai'
} as const;

type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];

export interface ChatMessage {
    type: MessageType;
    content: string;
    timestamp: number;
}

export class MessageHandler {
    private messages: ChatMessage[] = [];

    constructor() {}

    public addUserMessage(content: string): ChatMessage {
        const message: ChatMessage = {
            type: MESSAGE_TYPES.USER,
            content,
            timestamp: Date.now()
        };
        this.messages.push(message);
        return message;
    }

    public addAIMessage(content: string): ChatMessage {
        const message: ChatMessage = {
            type: MESSAGE_TYPES.AI,
            content,
            timestamp: Date.now()
        };
        this.messages.push(message);
        return message;
    }

    public getMessages(): ChatMessage[] {
        return [...this.messages];
    }

    public clearMessages(): void {
        this.messages = [];
    }

    public formatMarkdown(content: string): string {
        // マークダウンをHTMLに変換するロジックを追加可能
        return content;
    }

    public async saveHistory(filePath: string): Promise<void> {
        try {
            const historyContent = this.messages.map(msg => 
                `[${new Date(msg.timestamp).toLocaleString()}] ${msg.type.toUpperCase()}: ${msg.content}`
            ).join('\n\n');

            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(filePath),
                Buffer.from(historyContent, 'utf8')
            );
        } catch (error) {
            throw new Error('チャット履歴の保存に失敗しました');
        }
    }

    public async loadHistory(filePath: string): Promise<void> {
        try {
            const fileContent = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
            const history = fileContent.toString().split('\n\n');
            
            this.messages = history.map(entry => {
                const match = entry.match(/\[(.*?)\] (USER|AI): (.*)/);
                if (!match) throw new Error('Invalid history format');
                
                const type = match[2].toLowerCase();
                if (type !== 'user' && type !== 'ai') {
                    throw new Error('Invalid message type');
                }
                
                return {
                    type: type as MessageType,
                    content: match[3],
                    timestamp: new Date(match[1]).getTime()
                };
            });
        } catch (error) {
            throw new Error('チャット履歴の読み込みに失敗しました');
        }
    }
}
