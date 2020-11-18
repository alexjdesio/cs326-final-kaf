'use strict';

let range_pets = 4;
let range_shelters = 4;
let viewed_pets = 0;
let viewed_shelters = 0;

async function getFavoritePets(range, id) {
    const url = `/user/id/favoritepets/view?range=${range}&username=${username}`;
    const response = await fetch(url);
    if (response.ok) {
        const pets = await response.json();
        console.log(JSON.stringify(pets));
        return pets;
    }
    //need to add else
}

async function getFavoriteShelters(range, id) {
    const url = `/user/id/favoriteshelters/view?range=${range}&username=${username}`;
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
    //for (i = 0; i < (range_pets / 4); i++) {
    let row;
    for (i = 0; i < viewed_shelters; i++) {
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
        card_image.src = pets[i].picture;

        const card_body = document.createElement('div');
        card_body.classList.add('card-body');
        card_body.classList.add('bg-light');

        const card_title = document.createElement('h5');
        card_title.classList.add('card-title');
        card_title.classList.add('mt-0');
        card_title.classList.add('font-weight-light');
        card_title.innerText = pets[i].pet_name;

        const card_link = document.createElement('a');
        card_link.classList.add('card-link');
        card_link.innerText = 'Visit ' + pets[i].pet_name + '\'s Page';
        card_link.href = '/petpage.html?name=' + pets[i].pet_name;

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

function renderShelters(element, shelters) {
    element.innerHTML = '';
    let i;
    let j;
    //for (i = 0; i < (range_shelters / 4); i++) {
    let row;
    for (i = 0; i < viewed_shelters; i++) {
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
        card_image.src = shelters[i].picture;

        const card_body = document.createElement('div');
        card_body.classList.add('card-body');
        card_body.classList.add('bg-light');

        const card_title = document.createElement('h5');
        card_title.classList.add('card-title');
        card_title.classList.add('mt-0');
        card_title.classList.add('font-weight-light');
        card_title.innerText = shelters[i].shelter_name;

        const card_link = document.createElement('a');
        card_link.classList.add('card-link');
        card_link.innerText = 'Visit ' + shelters[i].shelter_name + '\'s Page';
            //card_link.href = site_url + 'shelter/view?=' + shelters[current_shelter].name;
        card_link.href = '/shelterpage.html?name=' + shelters[i].name;

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
    const user = url.searchParams.get('user');
    const favorite_pets = await getFavoritePets(range_pets);
    viewed_pets = favorite_pets.length;
    const favorite_shelters = await getFavoriteShelters(range_shelters);
    viewed_shelters = favorite_shelters.length;

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
        if (range_shelters > viewed_shelters + 4) {
            range_shelters = viewed_shelters;
            document.getElementById('more_shelters').classList.add('disabled');
        }
        renderUserHome();
    });
    document.getElementById('more_pets').addEventListener('click', () => {
        range_pets += 4;
        if (range_shelters > viewed_shelters + 4) {
            range_shelters = viewed_shelters;
            document.getElementById('more_pets').classList.add('disabled');
        }
        renderUserHome();
    });
});


