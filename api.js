import pkg from 'faker';
import {createServer} from 'http';
import {parse} from 'url';
import {join} from 'path';
import {writeFile, readFileSync, existsSync} from 'fs';
const {name,internet,company,address,lorem,commerce} = pkg;

'use strict';

function createFakePet() {
    //Pet Objects: Pet Name, Breed, About, Health, Location, Comments, Num Likes
    let i;
    const commarr = [];
    const num_com = Math.random() * 10;
    for (i = 0; i < num_com; i++) {
        commarr.push({comment: lorem.sentence(), user: internet.userName()});
    }
    
    const pet = {
        name:  name.firstName(),
        breed: 'terrier',
        about: lorem.paragraph(),
        health: lorem.paragraph(),
        location: address.city(),
        comments: commarr,
        num_likes: Math.floor(Math.random() * 100)
    };
    return pet;
}

console.log(createFakePet());

