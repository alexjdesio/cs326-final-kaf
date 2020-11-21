'use strict';

const site_url = "http://localhost:8080";

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

async function checkFavoritePets(username, pet_id) {
    //-1 range gives you all the pets!
    const url = `/user/id/favoritepets/view?range=-1&username=${username}`;
    const response = await fetch(url);
    let liked = false;
    if (response.ok) {
        const pets = await response.json();
        let i;
        for (i = 0; i < pets.length; i++) {
            if (pet[i] === pet_id) { 
                liked = true; 
            }
        }
        return liked;
    } else {
        console.log("Couldn't find favorite pets!")
    }
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
        user.innerText = results.shelter_comments[x].username;
        comment.innerText = results.shelter_comments[x].value;
        userComment.appendChild(user);
        msgComment.appendChild(comment);
    }
}

window.addEventListener("load", async function() {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const pet_id = url.searchParams.get('pet_id');
    const favorite_button = document.getElementById('favorite_button');
    const pet = await getPet(pet_id);
    renderPetPage(pet);
    
    const username = await getUsername();
    if (username !== '') {
        const pet_liked = checkFavoritePets(username, pet_id);
        if (pet_liked) {
            favorite_button.innerText = `Remove ${pet.pet_name} from Favorites`;
        } else {
            `Add ${pet.pet_name} to Favorites`;
        }
    }

    favorite_button.addEventListener('click', async () => {
        const username = await getUsername();
        console.log("THE NAME IS!");
        console.log(username);
        if (username === '') {
            favorite_button.classList.add('disabled');
        }
        else {
            if (favorite_button.innerText === `Add ${pet.pet_name} to Favorites`) {
                //do a POST request
                //        fetch('http://localhost:8080/gameScore', { method: 'POST', body: JSON.stringify(p0JSON) } ); 
                favorite_button.classList.add('active');
                const post_url = `${site_url}/user/id/favoritepets/add`;
                const post_body = {pet_id: pet_id, username: username};
                fetch(post_url, { method: 'POST', body: JSON.stringify(post_body) });
                favorite_button.innerText = `Remove ${pet.pet_name} from Favorites`; 
            } else {
                const post_url = `${site_url}/user/id/favoritepets/delete`;
                const post_body = {pet_id: pet_id, username: username};
                fetch(post_url, { method: 'POST', body: JSON.stringify(post_body) });
                favorite_button.innerText = `Add ${pet.pet_name} to Favorites`;
            }
        }
    });
    document.getElementById('post_comment_button').addEventListener('click', () => {
        const user_comment = document.getElementById('comment_body').value;
        //do a POST request
    });
});


