'use strict';

const site_url = "";

async function getPet(pet_id) {
    const url = "/pet/view?pet_id=" + pet_id;
    const response = await fetch(url);
    if (response.ok) {
        const pet = await response.json();
        return pet;
    } else {
        console.log("Pet not found!");
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

async function getShelter(shelter_id) {
    const url = "/shelter/view?shelter_id=" + shelter_id;
    const response = await fetch(url);
    if (response.ok) {
        const shelter = await response.json();
        return shelter;
    } else {
        console.log("Couldn't find that shelter!");
    }
    //need to add else
}

async function renderPetPage(pet) {
    //get all the elements we need to fill in first. Because its easier for me to process that way.
    const pet_name = document.getElementById("pet_name");
    const pet_breed = document.getElementById("pet_breed");
    const pet_picture = document.getElementById("pet_picture");
    const shelter_picture = document.getElementById("shelter_picture");
    const about_header = document.getElementById("about_header");
    const about_body = document.getElementById("about_body");
    const health_header = document.getElementById("health_header");
    const health_body = document.getElementById("health_body");
    const pet_home_header = document.getElementById("pet_home_header");
    const shelter_name = document.getElementById("shelter_name");
    const about_shelter = document.getElementById("about_shelter");
    const adopt_button = document.getElementById("adopt_button");
    const comments_section = document.getElementById("comments_section");
    const favorite_button = document.getElementById("favorite_button");
    //Pet Objects: Name, Breed, About, Health, Location, Comments, Num Likes
    const shelter = await getShelter(pet.pet_location);

    pet_name.innerText = pet.pet_name;
    pet_breed.innerText = pet.pet_breed;
    pet_picture.src = pet.picture;
    about_header.innerText = 'About ' + pet.pet_name;
    about_body.innerText = pet.pet_about;
    health_header.innerText = pet.pet_name + '\'s Health and Needs';
    health_body.innerText = pet.pet_health;
    pet_home_header.innerText = pet.pet_name + '\'s Current Home';
    shelter_name.innerText = shelter.shelter_name;
    shelter_picture.src = shelter.picture;
    about_shelter.innerText = shelter.shelter_about;
    adopt_button.innerText = 'Adopt ' + pet.pet_name;
    favorite_button.innerText = `Add ${pet.pet_name} to Favorites`;

    //then deal with the comments section

    const userComment = document.getElementById('userComment');
    const msgComment = document.getElementById('msgComment');
    for (let x in pet.pet_comments){
        const user = document.createElement('h4');
        const comment = document.createElement('h4');
        user.classList.add('card');
        comment.classList.add('card');
        user.innerText = pet.pet_comments[x].username;
        comment.innerText = pet.pet_comments[x].value;
        userComment.appendChild(user);
        msgComment.appendChild(comment);
    }
}

window.addEventListener("load", async function() {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const pet_id = url.searchParams.get('pet_id');
    const favorite_button = document.getElementById('favorite_button');
    const adopt_button = document.getElementById('adopt_button');
    const visit_button = document.getElementById('visit_button');
    const pet = await getPet(pet_id);
    const shelter = await getShelter(pet.pet_location);
    renderPetPage(pet);

    let recently_viewed = JSON.parse(localStorage.getItem("recently_viewed"));
    if (recently_viewed === null) {
        recently_viewed = [];
    }
    if ( recently_viewed.includes(pet_id) ) {
        console.log("already seen");
    } else {
        recently_viewed.push(pet_id);
    }
    if (recently_viewed.length > 4) {
        recently_viewed.pop();
    }
    console.log(recently_viewed);
    localStorage.setItem("recently_viewed", JSON.stringify(recently_viewed));

    visit_button.innerText = `View ${shelter.shelter_name}`;

    const remove_string = 'Remove from Favorites';
    const add_string = 'Add to Favorites';
    
    const username = await getUsername();
    if (username !== '') {
        console.log(pet_id);
        console.log(username);
        //called in order type, username, id
        const pet_liked = await checkFavorites("pet", username, pet_id);
        console.log(pet_liked);
        if (!pet_liked) {
            favorite_button.innerText = remove_string;
        } else {
            favorite_button.innerText = add_string;
        }
    }

    visit_button.addEventListener('click', () => {
        const shelter_url = `${site_url}/shelterPage.html?shelter_id=${shelter.shelter_id}`;
        window.location.href = shelter_url;
    });

    adopt_button.addEventListener('click', () => {
        const adopt_url = `${site_url}/chat.html`;
        window.location.href = adopt_url;
    });

    favorite_button.addEventListener('click', async () => {
        const username = await getUsername();
        if (username === '') {
            favorite_button.classList.add('disabled');
        }
        else {
            if (favorite_button.innerText === add_string) {
                favorite_button.classList.add('active');
                const post_url = `${site_url}/user/id/favoritepets/add`;
                const post_body = {pet_id: pet_id, username: username};
                await fetch(post_url, { method: 'POST', body: JSON.stringify(post_body) });
                favorite_button.innerText = remove_string; 
            } else {
                const post_url = `${site_url}/user/id/favoritepets/delete`;
                const post_body = {pet_id: pet_id, username: username};
                await fetch(post_url, { method: 'POST', body: JSON.stringify(post_body) });
                favorite_button.innerText = add_string;
            }
        }
    });
    favorite_button.click();

    document.getElementById('post_comment_button').addEventListener('click', async () => {
        let petID = url.searchParams.get("pet_id");
        let viewUserUrl = "/pet/comments/create";
        const response = await fetch(viewUserUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                pet_id: petID, 
                value: document.getElementById('petComments').value
            })
        });
        if(!response.ok){
            console.log(response.error);
        }
        location.reload();
    });
});
