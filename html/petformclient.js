'use strict';

const site_url = "";

window.addEventListener('load', async function() {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const field = document.getElementById('petShelter');
    field.value = url.searchParams.get('shelter_id');
    if (field.value !== '') {
        field.readOnly = true;
    }

    document.getElementById('submit_pet').addEventListener('click', () => {
        const name = document.getElementById('pet_name').value;
        const dog_check = document.getElementById('dog_check');
        const cat_check = document.getElementById('cat_check');
        const about = document.getElementById('about_pet').value;
        const health = document.getElementById('health_pet').value;
        const breed = document.getElementById('breed').value;
        const location = document.getElementById('petShelter').value;
        const picture = document.getElementById('picture').value;
        let type;
        if (dog_check.checked) {
            type = "dog";
        } else if (cat_check.checked) {
            type = "cat";
        } else {
            type = "exotic";
        }

        const pet = {
            pet_name: name,
            pet_type: type,
            pet_about: about,
            pet_health: health,
            pet_breed: breed,
            pet_location: location,
            pet_comments: [],
            picture: picture,
            num_likes: 0
        };
        const post_url = `${site_url}/pet/create`;
        fetch(post_url, {
            method: 'POST',
            body: JSON.stringify(pet)
        });
    });
});
