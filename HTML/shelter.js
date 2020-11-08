import pkg from 'faker';
const faker = pkg;

'use strict';
export async function renderShelter (id){
    const response = await fetch('http://127.0.0.1:8080/shelter/view').
        catch(err => console.log(err));
    const shelterResults = await response.json();
    let img1 = document.createElement('img');
    let img2 = document.createElement('img');
    img1.src = faker.image.imageUrl();
    img2.src = faker.image.imageUrl();
    img1.classList.add('img-thumbnail', 'overlay');
    img2.classList.add('img-thumbnail', 'mx-auto', 'd-block');
    img1.width('250');
    img2.widht('500');
    document.getElementById('main').appendChild(img1, img2);
}

window.addEventListener("load", async function() {
    renderShelter(0);
});
