'use strict';

const site_url = "http://localhost:8080";

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
    const url = site_url + "/user/recentlyviewedpets/";
    const response = await fetch(url);
    if (response.ok) {
        const pets = await response.json();
        return pets;
    }
    //need to add else
}

async function getFavoritePets(range) {
    const url = site_url + "/favoritepets/view?range=" + range;
    const response = await fetch(url);
    if (response.ok) {
        const pets = await response.json();
        return pets;
    }
    //need to add else
}

async function getFavoriteShelters(range) {
    const url = site_url + "/favoriteshelters/view?range=" + range;
    const response = await fetch(url);
    if (response.ok) {
        const shelters = await response.json();
        return shelters;
    } 
    //need to add else
}

async function renderPetPage() {
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

    const url_string = window.location.href;
    const url = new URL(url_string);
    const name = url.searchParams('name');
    //Pet Objects: Name, Breed, About, Health, Location, Comments, Num Likes
    const fake_pet = await getPet(name);
    const fake_shelter = await getShelter(fake_pet.location);

    pet_name.innerText = fake_pet.name;
    pet_breed.innerText = fake_pet.breed;
    pet_picture.src = fake_pet.picture;
    about_header.innerText = 'About ' + name;
    about_body.innerText = fake_pet.about;
    health_header.innerText = name + '\'s Health and Needs';
    health_body.innerText = fake_pet.health;
    pet_home_header.innerText = fake_pet.name + '\'s Current Home';
    shelter_name.innerText = fake_shelter.name;
    shelter_picture.src = fake_shelter.picture;
    about_shelter.innerText = fake_shelter.about;
    adopt_button.innerText = 'Adopt ' + fake_pet.name;

    //then deal with the comments section

}

async function renderUserHome() {
    //ok I will think about this later lol. 
}

renderPetPage();


