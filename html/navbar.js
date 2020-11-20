'use strict';

//This file holds all javascript functions for the navbar


//TODO: this function doesn't generate correct URLs
async function navbarLinks(){
    const response = await fetch("/getSessionUser",{method:"GET"});
    if(response.ok){
      let username = await response.text();
      document.getElementById("userhome-link").href =  "/userhome.html?username=" + username;
      document.getElementById("settings-link").href =  "/settings.html?username=" + username;
    }
}
navbarLinks();


