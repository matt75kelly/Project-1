$(document).foundation()

var userData = {
    city: "",
    state: "",
    country: "",
    zipCode: "",
    jobQuery: ""
}

var config = {
    apiKey: "AIzaSyAnahAvF9gbyHcTnVx3hOlRW05siQNyWUc",
    authDomain: "dmjls-5efdd.firebaseapp.com",
    databaseURL: "https://dmjls-5efdd.firebaseio.com",
    projectId: "dmjls-5efdd",
    storageBucket: "",
    messagingSenderId: "897353852395"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var keysDB = database.ref("/keys");
  var urlsDB = database.ref("/urls");


// function for maxing sure that all the characters in a string are letters and not numbers, symbols, etc
function validText (string) {
    var text = string.toLowerCase();
    var isValid = true;
    while(isValid){
        for(var i=0; i < text.length; i++){
            var char = text.charCodeAt(i);
            if (char < 0x0061 || char > 0x007A){
                if(char != 0x0027 || char != 0x002D || char != 0x0020){
                    isValid = false;
                }
            }
        }
    }
    return isValid;
}
// function for making sure tha tall the characters in a string are numbers and not letters, symbols, etc
function validNumber(number) {
    var isNumber = true;

    while (isNumber){
        for(var i=0; i<number.length; i++){
            var char = number.charCodeAt(i);
            if(char < 0x0030 && char > 0x0039){
                isNumber = false;
            }
        }
    }
    return isNumber;
}
// function to convert city name to a valid uaID for teleport API
function convertTeleport (string) {
    var text = string.toLowercase();
    var newtext = "";
    for (var i=0; i<text.length; i++){
        var char = text.charAt(i);
        if (char === " "){
            newtext += "-";
        }
        else {
            newtext += char;
        }
    }
    return newtext;
}
// function for completing the teleport API call
function retrieveTeleport(){
    var url;
    var key;
    urlsDB.once('value').then(function(snapshot) {
        url = snapshot.val().teleport;
    });

    keysDB.once('value').then(function(snapshot) {
        key = snapshot.val().teleport;
    });

    var queryUrl = url + "=" + convertTeleport(userData.city);

      $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        console.log(response);
        return response;
    });
}

function retrieveRidb(){
    var url;
    var key;
    urlsDB.once('value').then(function(snapshot) {
        url = snapshot.val().ridb;
    });

    keysDB.once('value').then(function(snapshot) {
        key = snapshot.val().ridb;
    });

    var queryUrl = url + "=" + userData.city + "&";

      $.ajax({
        url: "",
        method: "GET"
    }).then(function(response){
        console.log(response);
        return response;
    });
}
function retrieveEventful(){
    var url;
    var key;
    urlsDB.once('value').then(function(snapshot) {
        url = snapshot.val().eventful;
    });

    keysDB.once('value').then(function(snapshot) {
        key = snapshot.eventful.val().eventful;
    });

    var queryUrl = url + "=" + userData.city + "&";

      $.ajax({
        url: "",
        method: "GET"
    }).then(function(response){
        console.log(response);
        return response;
    });
}   

function retrieveMaps(){
   
}
// function for retrieving the user input data off the DOM
function getFormData (){
    // Using Input ID's from the Form Group Input Elements
    var city = $("#user-city").val().trim();
/*    var state = $("#user-state").val().trim();
    var country = $("#user-country").val().trim();
    var zipCode = $("#user-zip").val().trim();*/
    var jobQuery = $("#user-query").val().trim();

    if (validText(city) && validText(state) && validText(country) && validText(jobQuery) && validNumber(zipCode)){
        userData.city = city;
/*        userData.state = state;
        userData.country = country;
        userData.zipCode = zipCode;*/
        userData.jobQuery = jobQuery;
    }
    else {
        displayNotValid();
    }
}

$(document).ready(function(){
    // Using Class ID of Submit Button to trigger an Event Handler for Retrieving the Data from the Form Elements
    $(document).on("click", ".submit", function(event){
        event.preventDefault();

        getFormData();
        var scores = retrieveTeleport();
        console.log(scores);
    });
})