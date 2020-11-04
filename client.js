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

