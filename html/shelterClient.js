'use strict';

async function checkFavorites(type, username, id) {
    const url = `/user/id/checkfavorites?type=${type}&username=${username}&id=${id}`;
    const response = await fetch(url);
    if (response.ok) {
        const restext = await response.text();
        console.log(restext);
        if (restext === "Not in favorites") {
            return false;
        } else if (restext === "In favorites") {
            return true;
        } else {
            console.log("Invalid request");
            return false;
        }
    }
}

async function renderShelter(shelterID){
    const viewUserUrl = "/shelter/view?shelter_id=" + shelterID;
    const response = await fetch(viewUserUrl);
    if(response.ok){
        const results = await response.json();
        console.log(results);
        document.getElementById('nameOrg').innerText = results.shelter_name;
        document.getElementById('nameOrg2').innerText = results.shelter_name;
        document.getElementById('aboutOrg').innerText = results.shelter_about;
        document.getElementById('aboutOrg2').innerText = results.shelter_location;

        document.getElementById('profile').src = results.picture;
        document.getElementById('banner').src = results.banner_picture;
        document.getElementById('location').src = results.location_picture;
        
        const recentList = document.getElementById('recentPet');
        for (let i = 0; i < results.shelter_pets.length; i++){
            const petResults = await fetch ('/pet/view?pet_id=' + results.shelter_pets[i]);
            const petResult = await petResults.json();
            console.log(petResult);
            const post = document.createElement('div');
            post.classList.add('col-3', 'card');
            recentList.appendChild(post);

            const img = document.createElement('img');
            img.classList.add('img-thumbnail', 'imgCrop');
            img.src = petResult.picture;
            const hyperLink = document.createElement('a');
            hyperLink.href = '/petpage.html?pet_id=' + results.shelter_pets[i];
            const header = document.createTextNode(petResult.pet_name);

            hyperLink.appendChild(header);
            post.appendChild(img);
            post.appendChild(hyperLink);
        }

        
        const userComment = document.getElementById('userComment');
        const msgComment = document.getElementById('msgComment');
        for (const x in results.shelter_comments){
            const user = document.createElement('h4');
            const comment = document.createElement('h4');
            user.classList.add('card');
            comment.classList.add('card');
            user.innerText = results.shelter_comments[x].username;
            comment.innerText = results.shelter_comments[x].value;
            userComment.appendChild(user);
            msgComment.appendChild(comment);
        }
    }
}

async function sendShelterData(){
    const viewUserUrl = "/shelter/create";
    const response = await fetch(viewUserUrl, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            shelter_name: document.getElementById('shelter_name').value,
            shelter_location: document.getElementById('shelter_location').value,
            shelter_about: document.getElementById('shelter_about').value,
            picture: document.getElementById('profile_picture').value,
            banner_picture: document.getElementById('banner_picture').value,
            location_picture: document.getElementById('location_picture').value
        })
    });
    if(!response.ok){
        console.log(response.error);
    }
}

async function sendCommentData(shelterID){
    const comment = document.getElementById('shelterComments').value;
    if (comment === ''){
        return;
    }

    const viewUserUrl = "/shelter/comments/create";
    const response = await fetch(viewUserUrl, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            shelter_id: shelterID, 
            value: comment
        })
    });
    if(!response.ok){
        console.log(response.error);
    }
}

async function getUsername() {
    const url = '/getSessionUser';
    const response = await fetch(url);
    if (response.ok) {
        const pet = await response.text();
        return pet;
    } else {
        console.log("Username not working");
    }
}

async function updateButton(button3, shelterID){
    const remove_string = 'Remove from Favorites';
    const add_string = 'Add to Favorites';
    const username = await getUsername();

    const pet_liked = await checkFavorites("shelter", username, shelterID);
    if (pet_liked) {
        button3.innerText = remove_string;
    } else {
        button3.innerText = add_string;
    }
}


function generateDynamicHTML(){
    const url_string = window.location.href;
    const url = new URL(url_string);
    const name = url.searchParams.get("name");
    const page = url.pathname;
    console.log(name,page);

    if (page ==='/shelterPage.html'){
        const shelterID = url.searchParams.get("shelter_id");
        renderShelter(shelterID); 
        const button = document.getElementById('commentShelter');
        button.addEventListener("click", function (){
            sendCommentData(shelterID);
            location.reload();
        });
        const button2 = document.getElementById('postPet');
        button2.addEventListener("click", function (){
            window.location.href="/petform.html?shelter_id=" + shelterID;
        });

        const button3 = document.getElementById('likeShelter');
        button3.addEventListener('click', async () => {
            const username = await getUsername();
            const remove_string = 'Remove from Favorites';
            const add_string = 'Add to Favorites';
            if (username === '') {
                button3.classList.add('disabled');
            }
            else {
                if (button3.innerText === add_string) {
                    button3.classList.add('active');
                    const post_url = `/user/id/favoriteShelters/add`;
                    const post_body = {shelter_id: shelterID, username: username};
                    await fetch(post_url, { method: 'POST', body: JSON.stringify(post_body) });
                    button3.innerText = remove_string; 
                } else {
                    const post_url = `/user/id/favoriteShelters/delete`;
                    const post_body = {shelter_id: shelterID, username: username};
                    await fetch(post_url, { method: 'POST', body: JSON.stringify(post_body) });
                    button3.innerText = add_string;
                }
            }
        });
        updateButton(button3, shelterID);
    }
    else if (page ==='/shelterForm.html'){
        const form = document.getElementById('createShelter');
        form.addEventListener("submit",function (event){
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendShelterData();
            location.reload();
        });
    }
}

generateDynamicHTML(); //enables dynamically-generated HTML
