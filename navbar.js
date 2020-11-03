'use strict';

//This file holds all javascript functions for the navbar
function replaceLoginWithUsername(){
    let username = "Theo Masterson";
    document.getElementById("login-link").textContent = username;
    document.getElementById("dropdown-login").classList.add("dropdown-login"); //enables dropdown on hover
    document.getElementById("login").classList.add("dropdown-toggle"); //adds styling to login
}

replaceLoginWithUsername();