import * as vscode from 'vscode';

export function getWebviewContent(webview: vscode.Webview): string {
    const styles = getStyles();
    const scripts = getScripts();

    return `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                ${styles}
            </style>
        </head>
        <body>
            <div class="chat-container">
                <div class="model-selector">
                    <select id="modelSelect" class="model-select">
                        <option value="gpt-4o">GPT-4 Optimized</option>
                        <option value="gpt-4o-mini">GPT-4 Mini</option>
                        <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    </select>
                </div>
                <div class="messages" id="messages"></div>
                <div class="input-container">
                    <div class="input-wrapper">
                        <textarea
                            id="messageInput"
                            placeholder="メッセージを入力..."
                            rows="1"
                            class="message-input"
                        ></textarea>
                        <button id="sendButton" class="send-button">
                            <span class="send-icon">➤</span>
                        </button>
                    </div>
                </div>
            </div>
            <script>
                ${scripts}
            </script>
        </body>
        </html>
    `;
}

function getStyles(): string {
    return `
        :root {
            --chat-bg: var(--vscode-editor-background);
            --chat-fg: var(--vscode-foreground);
            --input-bg: var(--vscode-input-background);
            --input-fg: var(--vscode-input-foreground);
            --button-bg: var(--vscode-button-background);
            --button-fg: var(--vscode-button-foreground);
            --button-hover: var(--vscode-button-hoverBackground);
            --user-msg-bg: var(--vscode-button-background);
            --user-msg-fg: var(--vscode-button-foreground);
            --ai-msg-bg: var(--vscode-editor-background);
            --border-color: var(--vscode-widget-border);
        }

        body {
            font-family: var(--vscode-font-family);
            padding: 0;
            margin: 0;
            color: var(--chat-fg);
            background: var(--chat-bg);
        }

        .chat-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            padding: 1rem;
            box-sizing: border-box;
        }

        .model-selector {
            margin-bottom: 1rem;
        }

        .model-select {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--border-color);
            background: var(--input-bg);
            color: var(--input-fg);
            border-radius: 4px;
            outline: none;
        }

        .messages {
            flex-grow: 1;
            overflow-y: auto;
            padding: 1rem;
            margin-bottom: 1rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background: var(--chat-bg);
        }

        .message {
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 8px;
            max-width: 85%;
            animation: messageSlide 0.3s ease-out;
        }

        @keyframes messageSlide {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .user-message {
            background: var(--user-msg-bg);
            color: var(--user-msg-fg);
            margin-left: auto;
            border-bottom-right-radius: 4px;
        }

        .ai-message {
            background: var(--ai-msg-bg);
            border: 1px solid var(--border-color);
            margin-right: auto;
            border-bottom-left-radius: 4px;
        }

        .input-container {
            padding: 0.5rem;
            background: var(--chat-bg);
            border-top: 1px solid var(--border-color);
        }

        .input-wrapper {
            display: flex;
            gap: 0.5rem;
            background: var(--input-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 0.5rem;
        }

        .message-input {
            flex-grow: 1;
            padding: 0.5rem;
            border: none;
            background: transparent;
            color: var(--input-fg);
            resize: none;
            outline: none;
            font-family: inherit;
            line-height: 1.4;
        }

        .send-button {
            background: var(--button-bg);
            color: var(--button-fg);
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .send-button:hover {
            background: var(--button-hover);
        }

        .send-icon {
            font-size: 1.2rem;
            transform: rotate(90deg);
        }

        .progress {
            color: var(--vscode-descriptionForeground);
            font-style: italic;
            padding: 0.5rem;
            margin: 0.5rem 0;
            border-radius: 4px;
            background: var(--chat-bg);
            border: 1px solid var(--border-color);
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
    `;
}

function getScripts(): string {
    return `
        const vscode = acquireVsCodeApi();
        const messagesContainer = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const modelSelect = document.getElementById('modelSelect');
        let currentMessageElement = null;

        function adjustTextareaHeight() {
            messageInput.style.height = 'auto';
            messageInput.style.height = messageInput.scrollHeight + 'px';
        }

        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                addMessage(message, 'user');
                vscode.postMessage({
                    type: 'sendMessage',
                    message: message
                });
                messageInput.value = '';
                messageInput.style.height = 'auto';
            }
        }

        function addMessage(message, sender) {
            const messageElement = document.createElement('div');
            messageElement.className = \`message \${sender}-message\`;
            messageElement.textContent = message;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return messageElement;
        }

        function showProgress(message) {
            const progressElement = document.createElement('div');
            progressElement.className = 'progress';
            progressElement.textContent = message;
            messagesContainer.appendChild(progressElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        messageInput.addEventListener('input', adjustTextareaHeight);
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        modelSelect.addEventListener('change', (e) => {
            vscode.postMessage({
                type: 'changeModel',
                modelFamily: e.target.value
            });
        });

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'streamResponse':
                    if (!currentMessageElement) {
                        currentMessageElement = addMessage('', 'ai');
                    }
                    currentMessageElement.textContent += message.fragment;
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    break;
                case 'receiveMessage':
                    currentMessageElement = null;
                    const progressElements = document.getElementsByClassName('progress');
                    while (progressElements.length > 0) {
                        progressElements[0].remove();
                    }
                    break;
                case 'showProgress':
                    showProgress(message.message);
                    break;
                case 'modelChanged':
                    modelSelect.value = message.model;
                    break;
            }
        });
    `;
}
