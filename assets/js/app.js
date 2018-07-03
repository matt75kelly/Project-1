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
  var urlsDB = database.ref("/urls");
  var keysDB = database.ref("/keys");

// function for maxing sure that all the characters in a string are letters and not numbers, symbols, etc
function validText (string) {
    var text = string.toLowerCase();
    var isValid = true;
        for(var i=0; i < text.length; i++){
        var char = text.charCodeAt(i);
        if (char < 0x0061 || char > 0x007A){
            if(char != 0x0027 && char != 0x002D && char != 0x0020){
                isValid = false;
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
function convertTextDash (string) {
    var text = string.toLowerCase();
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
// function to convert city name to a valid url query for eventful API
function convertTextPlus (string) {
    var text = string.toLowerCase();
    var newtext = "";
    for (var i=0; i<text.length; i++){
        var char = text.charAt(i);
        if (char === " "){
            newtext += "+";
        }
        else {
            newtext += char;
        }
    }
    return newtext;
}
// function for completing the teleport API call
function retrieveTeleport(){
    urlsDB.once("value").then(function(snapshot){
        var url = snapshot.val().teleport;
        var queryUrl = url + convertTextDash(userData.city) + "/scores/";
        console.log(queryUrl);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            var data = response.categories;
            var newDiv = $("<div>");
            for(var i = 0; i<data.length; i++){
                var newerDiv = $("<div>");
                var newHead = $("<header>");
                newHead.addClass("qoL");
                newHead.attr("id", "qoL-title-" + i);
                newHead.html("<h3>" + data[i].name + "</h3>");
                newerDiv.attr("data-title", data[i].name);
                var newP = $("<p>");
                newP.addClass("qoL");
                newP.attr("id", "qol-value-" + i);
                newP.text(data[i].score_out_of_10);
                newerDiv.attr("data-value", data[i].score_out_of_10);
                newerDiv.append(newHead);
                newerDiv.append(newP);
                newDiv.append(newerDiv);
            }
            $("#qoL-Board").append(newDiv);
           
        });
    });
}
// function call for handling the ridb API call
function retrieveRidb(){
    database.ref().once("value").then(function(snapshot){
        var url = snapshot.val().urls.ridb;
        var key = "apikey=" + snapshot.val().keys.ridb;
        var queryUrl = url + key + "&full=true&limit=3&radius=25";
        console.log(queryUrl);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            var data = response.RECDATA;
            var newDiv = $("<div>");
            for(var i = 0; i<data.length; i++){
                var newerDiv = $("<div>");
                var newHead = $("<header>");
                newHead.addClass("rec");
                newHead.attr("id", "rec-title-" + i);
                newHead.html("<h3>" + data[i].RecAreaName+ "</h3>");
                newerDiv.attr("data-title", );
                var newP = $("<p>");
                newP.addClass("rec");
                newP.attr("id", "rec-value-" + i);
                newP.html(data[i].RecAreaDescription);
                newerDiv.append(newHead);
                newerDiv.append(newP);
                newDiv.append(newerDiv);
            }
            
            $("#rec-Board").append(newDiv);
        });
    });
}
function retrieveEventful(){
    database.ref().once("value").then(function(snapshot){
        var url = snapshot.val().urls.eventful;
        var key = "app_key=" + snapshot.val().keys.eventful;
        var queryUrl = url + key + "&location=" + convertTextPlus(userData.city)+ "&date=future&within=20&page_size=3&page_number=1";
        console.log(queryUrl);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            var data = response;
            console.log(data);
        });
    });
}   
// function for retreiving the job API data
function retrieveJobs(){
    urlsDB.once("value").then(function(snapshot){
        var url = snapshot.val().careerjet;
        var queryUrl = url + "pagesize=8&sort=salary&keywords=" + convertTextPlus(userData.jobQuery) + "&page=1&location=" + convertTextPlus(userData.city);
        console.log(queryUrl);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            var data = response.jobs;
            var newDiv = $("<div>");
            for(var i = 0; i<data.length; i++){
                var newerDiv = $("<div>");
                var newHead = $("<header>");
                newHead.addClass("job");
                newHead.attr("id", "job-title-" + i);
                newHead.html("<h3>" + data[i].title + "</h3>");
                newerDiv.attr("data-title", data[i].title );
                var newCompany = $("<h5>");
                newCompany.text(data[i].company);
                newCompany.addClass("job");
                newCompany.attr("id", "job-company-" + data[i].company);
                newerDiv.attr("data-company", data[i].company);
                var newP = $("<p>");
                newP.addClass("job");
                newP.attr("id", "job-description" + i);
                newP.text(data[i].description);
                var newBtn = $("<button>");
                newBtn.addClass("jobs");
                newBtn.attr("id", "jobs-btn-" + i);
                newBtn.html("<a href=" + data[i].url + " target='_blank'> More Info </a>");
                newBtn.attr("data-site", data[i]);
                newerDiv.append(newHead);
                newerDiv.append(newCompany);
                newerDiv.append(newP);
                newerDiv.append(newBtn);
                newDiv.append(newerDiv);
            }
            $("#job-Board").append(newDiv);
        });
    });
}  
function retrieveMaps(){
    database.ref().once("value").then(function(snapshot){
        var url = snapshot.val().urls.maps;
        var key = snapshot.val().keys.maps;
        var queryUrl = url + key + "&q=" + convertTextPlus(userData.city) + "&maptype=satellite&zoom=18";
        console.log(queryUrl);
        var newMap = $("<iframe>");
        newMap.attr("src", queryUrl);
        newMap.addClass("map");
        $("#map-board").append(newMap);
    });
}
// function for retrieving the user input data off the DOM
function getFormData (){
    // Using Input ID's from the Form Group Input Elements
    var city = $("#user-city").val().trim();
/*    var state = $("#user-state").val().trim();
    var country = $("#user-country").val().trim();
    var zipCode = $("#user-zip").val().trim();*/
    var jobQuery = $("#user-query").val().trim();

    if (validText(city) && validText(jobQuery)){
        userData.city = city;
/*        userData.state = state;
        userData.country = country;
        userData.zipCode = zipCode;*/
        userData.jobQuery = jobQuery;
        console.log(userData);
    }
    else {
 //       displayNotValid();
    }
}

$(document).ready(function(){
    // Using Class ID of Submit Button to trigger an Event Handler for Retrieving the Data from the Form Elements
    $(document).on("click", ".submit", function(event){
        event.preventDefault();

        getFormData();
        retrieveTeleport();
        retrieveRidb();
        retrieveJobs();
        retrieveEventful();
    });
})