'use strict';

const site_url = "http://localhost:8080";

window.addEventListener('load', async function() {
    document.getElementById('submit_pet').addEventListener('click', () => {
        const name = document.getElementById('pet_name').value;
        const dog_check = document.getElementById('dog_check');
        const cat_check = document.getElementById('cat_check');
        //const exotic_check = document.getElementById('exotic_check');
        const about = document.getElementById('about_pet').value;
        const health = document.getElementById('health_pet').value;
        const breed = document.getElementById('breed').value;
        const location = document.getElementById('location').value;
        const picture = document.getElementById('picture').value;
        //later, we can actually check that these are all filled out
        let type;
        if (dog_check.checked) {
            type = "dog";
        } else if (cat_check.checked) {
            type = "cat";
        } else {
            type = "exotic";
        }

        const pet = {pet_name: name, pet_type: type, pet_about: about, pet_health: health, pet_breed: breed, pet_location: location, pet_comments: [], picture: picture, num_likes: 0};
        const post_url = `${site_url}/pet/create`;
        fetch(post_url, { method: 'POST', body: JSON.stringify(pet) });
    });


});