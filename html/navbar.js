'use strict';

//This file holds all javascript functions for the navbar
function replaceLoginWithUsername(){
    let username = "Theo Masterson";
    document.getElementById("login-link").textContent = username;
    document.getElementById("dropdown-login").classList.add("dropdown-login"); //enables dropdown on hover
    document.getElementById("login").classList.add("dropdown-toggle"); //adds styling to login
}

//replaceLoginWithUsername();


//TODO: this function doesn't generate correct URLs
async function navbarLinks(){
    const response = await fetch("/getSessionUser",{method:"GET"});
    console.log("Here,",response);
    if(response.ok){
      let username = response.text();
      document.getElementById("userhome-link").href =  "/userhome.html?username=" + username;
      document.getElementById("settings-link").href =  "/settings.html?username=" + username;
    }
}
navbarLinks();


