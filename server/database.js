import pkg from 'faker'; 
const {name,internet,company,address,lorem,commerce} = pkg; 

//THIS DATABASE IS FAKE

//User Login
export function createFakeUser(username){
    let interestIndex = Math.floor((Math.random()*3))
    let interestArray = ["dog","cats","exotics"];
    let userType = (Math.random() > 0.5) ? "adopter" : "shelter";
    
    let user = {
        username: username,
        email: internet.email(), 
        password: internet.password(),
        type: userType,
        interests: (userType === "adopter") ? interestArray[interestIndex] : "null",
        shelter: (userType === "shelter") ? company.companyName() : "null",
        liked_pets: [],
        viewed_pets: [],
        location: address.city()
    };
    //console.log(user);
    return user;
}

export function createFakeLogin(){
    let login = {
        username: internet.userName(),
        password: internet.password(), 
    };
    return login;
}

export function createFakeLoginToken(){
    return internet.password(); //using this as a placeholder
}

//Pet 
export function createFakePetResult(type,query){
    let pet = {
        pet_name: name.firstName(),
        pet_location: company.companyName(), pet_breed: commerce.color(), pet_about: lorem.sentence(5,10),
        pet_health: lorem.sentence(5,10),
        pet_comments: []
    };
    let fields = Object.keys(pet);
    if(fields.includes(type)){ //guarantees that the fake data satisfies the search constraints
        pet[type] = query;
    }
    return pet;
}

//Shelter
export function createFakeShelterResult(type,query){
    let shelter = {
        shelter_name: company.companyName(),
        shelter_location: company.companyName(),
        shelter_about: lorem.sentence(5,10),
        shelter_pets: null,
        shelter_comments: []
    };
    let petArr = [];
    for(let i = 0; i < 10;i++){
        petArr.push(createFakePetResult("location",shelter.shelter_name))
    }
    shelter.shelter_pets = petArr;
    let fields = Object.keys(shelter);
    if(fields.includes(type)){ //guarantees that the fake data satisfies the search constraints
        shelter[type] = query;
    }
    return shelter;
}

/**
 * @param {} 
 * @returns {object} chat - Object that holds all messages 
 */
export function createFakeChat(){
    let chat = [];
    for (let i = 0; i < 10; ++i){
        let fakeName = name.findName();
        let messages = [];
        for (let j = 0; j < 5; ++j){
            let sentence1 = lorem.sentence();
            let sentence2 = lorem.sentence();
            messages.push({'key': 0, 'value': sentence1});
            messages.push({'key': 1, 'value': sentence2});
        }
        chat.push({
            'id': i,
            'name': fakeName,
            'messages': messages
        });
    }
    return chat; 
}

//Search
export function createFakeSearchResult(type,query,quantity){
    let shelter_fields = Object.keys(createFakeShelterResult("null",""));
    let pet_fields = Object.keys(createFakePetResult("null",""));
    let returnArr = [];

    if(pet_fields.includes(type)){
        for(let i = 0;i<parseInt(quantity);i++){
            returnArr.push(createFakePetResult(type,query));
        }
    }
    else if(shelter_fields.includes(type)){
        for(let i = 0;i<parseInt(quantity);i++){
            returnArr.push(createFakeShelterResult(type,query));
        }
    }
    else{
        console.log("Invalid query type");
    }
    return returnArr;
}

//Non-persistent database
let database = {
    users: [],
    tokens: []
};
