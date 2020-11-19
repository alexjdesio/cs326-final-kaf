'use strict';

let range_pets = 4;
let range_shelters = 4;
let viewed_pets = 0;
let viewed_shelters = 0;

async function getPet(pet_id) {
    const url = "/pet/view?pet_id=" + pet_id;
    const response = await fetch(url);
    if (response.ok) {
        const pet = await response.json();
        return pet;
    }
    //need to add else
}

async function getShelter(shelter_id) {
    const url = "/shelter/view?shelter_id=" + shelter_id;
    const response = await fetch(url);
    if (response.ok) {
        const shelter = await response.json();
        return shelter;
    }
    //need to add else
}

async function getFavoritePets(range, username) {
    const url = `/user/id/favoritepets/view?range=${range}&username=${username}`;
    const response = await fetch(url);
    if (response.ok) {
        const pets = await response.json();
        console.log(JSON.stringify(pets));
        return pets;
    }
    //need to add else
}

async function getFavoriteShelters(range, username) {
    const url = `/user/id/favoriteshelters/view?range=${range}&username=${username}`;
    const response = await fetch(url);
    if (response.ok) {
        const shelters = await response.json();
        return shelters;
    } 
    //need to add else
}

async function renderPets(element, pets) {
    element.innerHTML = '';
    let i;
    //for (i = 0; i < (range_pets / 4); i++) {
    let row;
    for (i = 0; i < viewed_shelters; i++) {
        const pet = await getPet(pets[i]);
        if (i % 4 === 0) {
            row = document.createElement('div');
            row.classList.add('row');
        }
        //for (j = 0; j < 4; j++) {
        const col = document.createElement('div');
        col.classList.add('col');

        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('text-center');

        const card_image = document.createElement('img');
        card_image.classList.add('card-img-top');
        card_image.src = pet.picture;

        const card_body = document.createElement('div');
        card_body.classList.add('card-body');
        card_body.classList.add('bg-light');

        const card_title = document.createElement('h5');
        card_title.classList.add('card-title');
        card_title.classList.add('mt-0');
        card_title.classList.add('font-weight-light');
        card_title.innerText = pet.pet_name;

        const card_link = document.createElement('a');
        card_link.classList.add('card-link');
        card_link.innerText = 'Visit ' + pet.pet_name + '\'s Page';
        card_link.href = '/petpage.html?name=' + pet.pet_name;

        card_body.appendChild(card_title);
        card_body.appendChild(card_link);
        card.appendChild(card_image);
        card.appendChild(card_body);
        col.appendChild(card);
        row.appendChild(col);
        if (i % 4 === 3 || i === viewed_pets - 1) {
            element.appendChild(row);
            element.appendChild(document.createElement('br'));
        }
        element.appendChild(row);
        element.appendChild(document.createElement('br'));
    }
}

async function renderShelters(element, shelters) {
    element.innerHTML = '';
    let i;
    //for (i = 0; i < (range_shelters / 4); i++) {
    let row;
    for (i = 0; i < viewed_shelters; i++) {
        const shelter = await getShelter(shelters[i]);
        if (i % 4 === 0) {
            row = document.createElement('div');
            row.classList.add('row');
        }
        //for (j = 0; j < 4; j++) {
        const col = document.createElement('div');
        col.classList.add('col');

        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('text-center');

        const card_image = document.createElement('img');
        card_image.classList.add('card-img-top');
        card_image.src = shelter.picture;

        const card_body = document.createElement('div');
        card_body.classList.add('card-body');
        card_body.classList.add('bg-light');

        const card_title = document.createElement('h5');
        card_title.classList.add('card-title');
        card_title.classList.add('mt-0');
        card_title.classList.add('font-weight-light');
        card_title.innerText = shelter.shelter_name;

        const card_link = document.createElement('a');
        card_link.classList.add('card-link');
        card_link.innerText = 'Visit ' + shelter.shelter_name + '\'s Page';
            //card_link.href = site_url + 'shelter/view?=' + shelters[current_shelter].name;
        card_link.href = '/shelterpage.html?name=' + shelter.shelter_name;

        card_body.appendChild(card_title);
        card_body.appendChild(card_link);
        card.appendChild(card_image);
        card.appendChild(card_body);
        col.appendChild(card);
        row.appendChild(col);
        //}
        if (i % 4 === 3 || i === viewed_shelters - 1) {
            element.appendChild(row);
            element.appendChild(document.createElement('br'));
        }
    }
}

async function renderUserHome() {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const username = url.searchParams.get('username');

    const favorite_pets = await getFavoritePets(range_pets);

    viewed_pets = favorite_pets.length;
    if (viewed_pets < range_pets) {
        document.getElementById('more_pets').classList.add('disabled');
    }

    const favorite_shelters = await getFavoriteShelters(range_shelters);

    viewed_shelters = favorite_shelters.length;
    if (viewed_shelters < range_shelters) {
        document.getElementById('more_shelters').classList.add('disabled');
    }

    const pets_elem = document.getElementById('favorite_pets');
    const shelters_elem = document.getElementById('favorite_shelters');
    const user_header = document.getElementById('username_label');
    user_header.innerText = username;

    renderPets(pets_elem, favorite_pets);
    renderShelters(shelters_elem, favorite_shelters);
}
//checkMatchedUser checks if you are indeed the user

window.addEventListener("load", async function() {
    range_shelters = 4;
    range_pets = 4;
    renderUserHome();
    document.getElementById('more_shelters').addEventListener('click', () => {
        range_shelters += 4;
        renderUserHome();
    });
    document.getElementById('more_pets').addEventListener('click', () => {
        range_pets += 4;
        renderUserHome();
    });
});