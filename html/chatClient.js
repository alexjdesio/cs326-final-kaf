'use strict';

let currentChat = '';
async function renderChat(){
    let viewUserUrl = "/chat/view";
    const response = await fetch(viewUserUrl, {
        method: 'GET'});
    if(response.ok){
        let result = await response.json();
        const chatUsers = document.getElementById('chatUsers');

        for (let x in result){
            let results = result[x];

            const button = document.createElement('button');
            button.innerText = results.fromUsername;
            button.addEventListener('click', () => {
                currentChat = results.fromUsername;
                const chatMessages = document.getElementById('chatMessages');
                while (chatMessages.firstChild){
                    chatMessages.removeChild(chatMessages.lastChild);
                }

                let messages = results.messages;
                for (let y of messages){
                    const message = document.createElement('p');
                    message.innerText = y.value;
                    message.classList.add('border', 'rounded', 'bg-white');
                    if (y.key === '1'){
                        message.classList.add('alignToRight');
                    } 
                chatMessages.appendChild(message);
                }
            });
            chatUsers.appendChild(button);
        }
    }
}

async function sendChatData(noContact){
    let viewUserUrl = "/chat/msg";
    if(noContact === false){
        const response = await fetch(viewUserUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                fromUsername: currentChat, 
                value: document.getElementById('chatField').value
            })
        });
    }
    else if (noContact === true){
        const response = await fetch(viewUserUrl, {
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

    if(!response.ok){
        console.log(response.error);
    }
}

function generateDynamicHTML(){
    const url_string = window.location.href;
    const url = new URL(url_string);
    const name = url.searchParams.get("name");
    const page = url.pathname;

    if (page === '/chat.html'){
        let form = document.getElementById('chatForm');
        let submit = document.getElementById('chatSubmit');
        let form2 = document.getElementById('addChat');
        let submit2 = document.getElementById('createSubmit');
        renderChat();

        form.addEventListener("submit", function (event){
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendChatData(false);
            location.reload();
        });

        form2.addEventListener("submit", function (event){
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendChatData(true);
            location.reload();
        });
    }
}

generateDynamicHTML();
