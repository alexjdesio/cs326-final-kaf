'use strict';

const site_url = "http://localhost:8080";

let range_pets = 4;
let range_shelters = 4;

async function getPet(name) {
    const url = site_url + "/pet/view?name=" + name;
    const response = await fetch(url);
    if (response.ok) {
        const pet = await response.json();
        return pet;
    }
    //need to add else
}

async function getShelter(name) {
    const url = site_url + "/shelter/view?name=" + name;
    const response = await fetch(url);
    if (response.ok) {
        const shelter = await response.json();
        return shelter;
    }
    //need to add else
}

async function getRecentPets() {
    const url = site_url + "/user/id/recentlyviewedpets/";
    const response = await fetch(url);
    if (response.ok) {
        const pets = await response.json();
        return pets;
    }
    //need to add else
}

async function getFavoritePets(range) {
    const url = site_url + "/user/id/favoritepets/view?range=" + range;
    const response = await fetch(url);
    if (response.ok) {
        const pets = await response.json();
        console.log(JSON.stringify(pets));
        return pets;
    }
    //need to add else
}

async function getFavoriteShelters(range) {
    const url = site_url + "/user/id/favoriteshelters/view?range=" + range;
    const response = await fetch(url);
    if (response.ok) {
        const shelters = await response.json();
        return shelters;
    } 
    //need to add else
}

function renderPets(element, pets) {
    element.innerHTML = '';
    let i;
    let j;
    let current_pet = 0;
    for (i = 0; i < (range_pets / 4); i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (j = 0; j < 4; j++) {
            const col = document.createElement('div');
            col.classList.add('col');

            const card = document.createElement('div');
            card.classList.add('card');
            card.classList.add('text-center');

            const card_image = document.createElement('img');
            card_image.classList.add('card-img-top');
            card_image.src = pets[current_pet].picture;

            const card_body = document.createElement('div');
            card_body.classList.add('card-body');
            card_body.classList.add('bg-light');

            const card_title = document.createElement('h5');
            card_title.classList.add('card-title');
            card_title.classList.add('mt-0');
            card_title.classList.add('font-weight-light');
            card_title.innerText = pets[current_pet].name;

            const card_link = document.createElement('a');
            card_link.classList.add('card-link');
            card_link.innerText = 'Visit ' + pets[current_pet].name + '\'s Page';
            card_link.href = site_url + 'petpage.html/name?=' + pets[current_pet].name;

            current_pet += 1;
            
            card_body.appendChild(card_title);
            card_body.appendChild(card_link);
            card.appendChild(card_image);
            card.appendChild(card_body);
            col.appendChild(card);
            row.appendChild(col);
        }
        element.appendChild(row);
        element.appendChild(document.createElement('br'));
    }
}

function renderShelters(element, shelters) {
    element.innerHTML = '';
    let i;
    let j;
    let current_shelter = 0;
    for (i = 0; i < (range_shelters / 4); i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (j = 0; j < 4; j++) {
            const col = document.createElement('div');
            col.classList.add('col');

            const card = document.createElement('div');
            card.classList.add('card');
            card.classList.add('text-center');

            const card_image = document.createElement('img');
            card_image.classList.add('card-img-top');
            card_image.src = shelters[current_shelter].picture;

            const card_body = document.createElement('div');
            card_body.classList.add('card-body');
            card_body.classList.add('bg-light');

            const card_title = document.createElement('h5');
            card_title.classList.add('card-title');
            card_title.classList.add('mt-0');
            card_title.classList.add('font-weight-light');
            card_title.innerText = shelters[current_shelter].name;

            const card_link = document.createElement('a');
            card_link.classList.add('card-link');
            card_link.innerText = 'Visit ' + shelters[current_shelter].name + '\'s Page';
            //card_link.href = site_url + 'shelter/view?=' + shelters[current_shelter].name;

            current_shelter += 1;

            card_body.appendChild(card_title);
            card_body.appendChild(card_link);
            card.appendChild(card_image);
            card.appendChild(card_body);
            col.appendChild(card);
            row.appendChild(col);
        }
        element.appendChild(row);
        element.appendChild(document.createElement('br'));
    }
}

async function renderUserHome() {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const user = url.searchParams.get('user');
    const favorite_pets = await getFavoritePets(range_pets);
    const favorite_shelters = await getFavoriteShelters(range_shelters);

    const pets_elem = document.getElementById('favorite_pets');
    const shelters_elem = document.getElementById('favorite_shelters');
    const user_header = document.getElementById('username_label');
    user_header.innerText = user;
    renderPets(pets_elem, favorite_pets);
    renderShelters(shelters_elem, favorite_shelters);
    

    /**
    <div class="row">
                    <div class="col">
                        <div class="card text-center">
                            <img class="card-img-top" src="https://i.guim.co.uk/img/media/fe1e34da640c5c56ed16f76ce6f994fa9343d09d/0_174_3408_2046/master/3408.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=0d3f33fb6aa6e0154b7713a00454c83d" alt="Pug">
                            <div class="card-body bg-light">
                                <h5 class="card-title mt-0 font-weight-light">Boink the Pug</h5>
                                <!--button type="button" class="btn btn-primary">View Boink</button-->
                            </div>
                        </div>
                    </div>
                    **/
}

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


