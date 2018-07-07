var states = [
    "ALABAMA	AL",
    "ALASKA	AK",
    "ARIZONA	AZ",
    "ARKANSAS	AR",
    "CALIFORNIA	CA",
    "COLORADO	CO",
    "CONNECTICUT	CT",
    "DELAWARE	DE",
    "FLORIDA	FL",
    "GEORGIA	GA",
    "HAWAII	HI",
    "IDAHO	ID",
    "ILLINOIS	IL",
    "INDIANA	IN",
    "IOWA	IA",
    "KANSAS	KS",
    "KENTUCKY	KY",
    "LOUISIANA	LA",
    "MAINE	ME",
    "MARYLAND	MD",
    "MASSACHUSETTS	MA",
    "MICHIGAN	MI",
    "MINNESOTA	MN",
    "MISSISSIPPI	MS",
    "MISSOURI	MO",
    "MONTANA	MT",
    "NEBRASKA	NE",
    "NEVADA	NV",
    "NEW HAMPSHIRE	NH",
    "NEW JERSEY	NJ",
    "NEW MEXICO	NM",
    "NEW YORK	NY",
    "NORTH CAROLINA	NC",
    "NORTH DAKOTA	ND",
    "OHIO	OH",
    "OKLAHOMA	OK",
    "OREGON	OR",
    "PENNSYLVANIA	PA",
    "RHODE ISLAND	RI",
    "SOUTH CAROLINA	SC",
    "SOUTH DAKOTA	SD",
    "TENNESSEE	TN",
    "TEXAS	TX",
    "UTAH	UT",
    "VERMONT	VT",
    "VIRGINIA	VA",
    "WASHINGTON	WA",
    "WEST VIRGINIA	WV",
    "WISCONSIN	WI",
    "WYOMING	WY"
];

var userData = {
    city: "",
    state: "",
    // zipCode: "",
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
// function to convert state to a 2 character abbreviation
function validState(string){
    var object = {
        isValid : false,
        converted : ""
    }
    var state = string.toUpperCase();
    for(var i=0; i<states.length; i++){
        var temp = states[i].slice(0, states[i].length - 3);
        var code = states[i].slice(-2);
        if(temp === state || code === state){
            object.converted = code.toLowerCase();
            object.isValid = true;
        }
    }
    console.log(object);
    return object;
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
// function that parses through a string and removes the html tags
function removeTags(string){
    var isKept = true;
    var convertedString ="";
    var st = "<";
    var en = ">";

    for(var i =0; i<string.length; i++){
        var char = string.charAt(i);
        if (char === st) isKept = false;
        if (isKept) convertedString = convertedString + char;
        if (char === en) isKept = true;
    }
    return convertedString;
}
// function for completing the teleport API call
function retrieveTeleport(){
    $("#qoL-Board").empty();
    urlsDB.once("value").then(function(snapshot){
        var url = snapshot.val().teleport;
        var queryUrl = url + convertTextDash(userData.city) + "/scores/";
        console.log(queryUrl);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            var data = response.categories;
            console.log(data);      
            var newDiv = $("<div>");
            newDiv.addClass("grid-x grid-margin-x");
            for(var i = 0; i<data.length; i++){
                var scoring = Math.floor(data[i].score_out_of_10 * 10);
                var title = $("<h5>");
                title.addClass("text-center");
                title.text(data[i].name);
                var slide = '<div class="slider" data-slider data-start="0" data-end="100" id="slider-' + i + '" data-initial-start =' + scoring + 'aria-controls="input-' + i + '"><span class="slider-handle"  data-slider-handle role="slider" tabindex="1"></span><span class="slider-fill" data-slider-fill></span><input type="hidden" id="input-' + i + '"></div>';
                newerDiv = $("<div>");
                newerDiv.addClass("cell small-2 text-center");
                newerDiv.html(slide);
                newerDiv.prepend(title);
                newerDiv.attr("style", "float: left");
                newDiv.append(newerDiv);
            }
            
            $("#qoL-Board").append(newDiv);   
            $("#qoL-Board").attr("style", "background-color:white");
            for(var j=0; j<data.length; j++){
                $('#input-' + j).val(scoring);
            }    
        });
    });
}
// function call for handling the ridb API call
function retrieveRidb(){
    $("#rec-Board").empty(); 
    database.ref().once("value").then(function(snapshot){
        var urlGeo = snapshot.val().urls.geocode;
        var keyGeo = "&key=" + snapshot.val().keys.maps;
        var queryUrlGeo = urlGeo + convertTextPlus(userData.city) + "," + userData.state + keyGeo;
        $.ajax({
            url: queryUrlGeo,
            method: "GET"
        }).then(function(response){
            console.log(response);
            var latitude = "&latitude=" + response.results[0].geometry.location.lat;
            var longitude = "&longitude=" + response.results[0].geometry.location.lng;
            var urlRidb = snapshot.val().urls.ridb;
            var keyRidb = "apikey=" + snapshot.val().keys.ridb;
            var queryUrlRidb = urlRidb + keyRidb + latitude + longitude + "&full=true&limit=3&radius=50";
            console.log(queryUrlRidb);        
            $.ajax({
                url: queryUrlRidb,
                method: "GET"
            }).then(function(results){
                var data = results.RECDATA;
                console.log(data);
                var newPark = $('<ul data-accordion-menu>');
                newPark.addClass("vertical menu accordion-menu");
                for(var i = 0; i<data.length; i++){
                    var newList = $("<li>");
                    newList.html('<a href="#"><h5>' + data[i].RecAreaName + '</h5></a><ul class="menu vertical nested"><li><a href="#"><p>' + removeTags(data[i].RecAreaDescription) + '</p></a></li></ul>');
                    newPark.append(newList);
                }
                           
                $("#rec-Board").append(newPark);
                $("#rec-Board").attr("style", "background-color:white; overflow-y: scroll");
            });
        });
    });
}  
// function for retreiving the job API data
function retrieveJobs(){
    $("#job-Board").empty();
    urlsDB.once("value").then(function(snapshot){
        var url = snapshot.val().careerjet;
        var queryUrl = url + "pagesize=10&keywords=" + convertTextPlus(userData.jobQuery) + "&page=124&location=" + convertTextPlus(userData.city) + "," + userData.state;
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
                newHead.html("<h4>" + data[i].title + "</h4>");
                newerDiv.attr("data-title", data[i].title );
                var newCompany = $("<h5>");
                newCompany.text(data[i].company);
                newCompany.addClass("job");
                newCompany.attr("id", "job-company-" + data[i].company);
                newerDiv.attr("data-company", data[i].company);
                var newP = $("<p>");
                newP.addClass("job");
                newP.attr("id", "job-description" + i);
                newP.html(removeTags(data[i].description));
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
            $("#job-Board").attr("style", 'background-color: white; overflow-y: scroll');
        });
    });
}  
function retrieveMaps(){
    $("#map-Board").empty();
    database.ref().once("value").then(function(snapshot){
        var urlGeo = snapshot.val().urls.geocode;
        var keyGeo = "&key=" + snapshot.val().keys.maps;
        var queryUrlGeo = urlGeo + convertTextPlus(userData.city) + "," + userData.state + keyGeo;
        var url = snapshot.val().urls.maps;
        var key = "?key=" + snapshot.val().keys.maps;
        $.ajax({
            url: queryUrlGeo,
            method: "GET"
        }).then(function(response){
            console.log(response);
            var latitude = response.results[0].geometry.location.lat;
            var longitude = response.results[0].geometry.location.lng;
            var center = "&center=" + latitude + "," + longitude;
            var queryUrl = url + key + center + "&maptype=satellite&zoom=10";
            console.log(queryUrl);
            var newMap = $("<iframe>");
            newMap.attr("width", "90%");
            newMap.attr("height", "90%");
            newMap.attr("src", queryUrl);
            newMap.addClass("map ");
            
            $("#map-Board").append(newMap);
        });
    });
}
// function for retrieving the user input data off the DOM
function getFormData (){
    // Using Input ID's from the Form Group Input Elements
    var city = $("#user-city").val().trim();
    var state = $("#user-state").val().trim();
//    var zipCode = $("#user-zip").val().trim();*/
    var jobQuery = $("#user-job").val().trim();
    var stateCode = validState(state);

    if (validText(city) && validText(jobQuery) && stateCode.isValid){
        userData.city = city;
        userData.state = stateCode.converted;
        // userData.zipCode = zipCode;
        userData.jobQuery = jobQuery;
        console.log(userData);
    }
    else {
    $("#user-city").val("");
    $("#user-state").val("");
    $("#user-job").val("");
    }
}

$(document).ready(function(){
    $(document).foundation()
    // Using Class ID of Submit Button to trigger an Event Handler for Retrieving the Data from the Form Elements
    $(document).on("click", ".submit", function(event){
        event.preventDefault();

        getFormData();
        retrieveTeleport();
        retrieveRidb();
        retrieveJobs();
        retrieveMaps();
    });
})