'use strict';

let currentChat = '';
async function renderChat() {
    const viewUserUrl = "/chat/view";
    const response = await fetch(viewUserUrl, {
        method: 'GET'
    });
    if (response.ok) {
        const result = await response.json();
        const chatUsers = document.getElementById('chatUsers');

        for (const x in result) {
            const results = result[x];

            const button = document.createElement('button');
            button.innerText = results.fromUsername;
            button.addEventListener('click', () => {
                currentChat = results.fromUsername;
                const chatMessages = document.getElementById('chatMessages');
                while (chatMessages.firstChild) {
                    chatMessages.removeChild(chatMessages.lastChild);
                }

                const messages = results.messages;
                for (const y of messages) {
                    const message = document.createElement('p');
                    message.innerText = y.value;
                    message.classList.add('border', 'rounded', 'bg-white');
                    if (y.key === '1') {
                        message.classList.add('alignToRight');
                    }
                    chatMessages.appendChild(message);
                }
            });
            chatUsers.appendChild(button);
        }
    }
}

async function sendChatData(noContact) {
    const viewUserUrl = "/chat/msg";
    if (noContact === false) {
        await fetch(viewUserUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                fromUsername: currentChat,
                value: document.getElementById('chatField').value
            })
        });
    } else if (noContact === true) {
        await fetch(viewUserUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                fromUsername: document.getElementById('nameField').value,
                value: document.getElementById('textField').value
            })
        });
    }
}

function generateDynamicHTML() {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const page = url.pathname;

    if (page === '/chat.html') {
        const form = document.getElementById('chatForm');
        const form2 = document.getElementById('addChat');
        renderChat();

        form.addEventListener("submit", function(event) {
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendChatData(false);
            location.reload();
        });

        form2.addEventListener("submit", function(event) {
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendChatData(true);
            location.reload();
        });
    }
}

generateDynamicHTML();