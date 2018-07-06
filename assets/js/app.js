$(document).foundation()

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
            console.log(data);      
            var newDiv = $("<div>");
            newDiv.addClass("grid-x");
            for(var i = 0; i<data.length; i++){
                var scoring = Math.floor(data[i].score_out_of_10 * 10);
                var title = $("<h5>");
                title.addClass("text-center");
                title.text(data[i].name);
                var slide = '<div class="slider" data-slider data-start="0" data-end="100" data-dragga le="false" id="slider-' + i + '" aria-controls="input-' + i + '"><span class="slider-handle"  data-slider-handle role="slider" tabindex="1"></span><span class="slider-fill" data-slider-fill></span><input type="hidden" id="input-' + i + '"></div>';
                newerDiv = $("<div>");
                newerDiv.addClass("cell small-2 text-center");
                newerDiv.html(slide);
                newerDiv.prepend(title);
                newerDiv.attr("style", "float: left");
                newDiv.append(newerDiv);
            }
            $("#qoL-Board").empty();
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
            console.log(data);
            var newPark = $('<ul data-accordion-menu>');
            newPark.addClass("vertical menu accordion-menu");
            for(var i = 0; i<data.length; i++){
                var newList = $("<li>");
                newList.html('<a href="#"><h5>' + data[i].RecAreaName + '</h5></a><ul class="menu vertical nested"><li><a href="#">' + data[i].RecAreaDescription + '</a></li></ul>');
                newPark.append(newList);
            }
            $("#rec-Board").empty();            
            $("#rec-Board").append(newPark);
            $("#rec-Board").attr("style", "background-color:white; overflow-y: scroll");

        });
    });
}  
// function for retreiving the job API data
function retrieveJobs(){
    urlsDB.once("value").then(function(snapshot){
       /* var url = snapshot.val().careerjet;
        var queryUrl = url + "pagesize=10&keywords=" + convertTextPlus(userData.jobQuery) + "&page=124&location=" + convertTextPlus(userData.city) + "," + userData.state;
        console.log(queryUrl);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            var data = response.jobs;*/
            var result = {
                jobs: [
                    {
                        "locations": "Omaha, NE",
                        "site": "www.resume-library.com",
                        "date": "Mon, 02 Jul 2018 07:19:45 GMT",
                        "url": "http://jobviewtrack.com/us-en/job-4f1241595f0509084e172206060607090045066a1d014b4d5b444e440a00401d4e060d136f53531344/088b24227c1f9ecf77ece9f200797f1e.html",
                        "title": "Traffic/ITS Engineer",
                        "description": "Job Description   Traffic/ITS <b>Engineer</b>   Traffic/ITS <b>Engineer</b>  ()   About UsAt HDR, we specialize in engineering.... Above all, we believe that collaboration is the best way forward.   Primary Responsibilities   In the role of Traffic <b>Engineer</b>, we'll count...",
                        "company": "HDR Inc",
                        "salary": ""
                    },
                    {
                        "locations": "Omaha, NE",
                        "site": "www.resume-library.com",
                        "date": "Mon, 25 Jun 2018 07:07:34 GMT",
                        "url": "http://jobviewtrack.com/us-en/job-1b4a414e4412060225114e04010f0b02172217011f1a460b58434a0d010b420621575e525e/151d9b646ab5370ef75a5383f81aac65.html",
                        "title": "Civil Engineer",
                        "description": "Job Description   <b>Civil</b> <b>Engineer</b>   <b>Civil</b> <b>Engineer</b>  ()   About UsAt HDR, we specialize in engineering, architecture... that collaboration is the best way forward.   Primary Responsibilities  In the role of <b>Civil</b> <b>Engineer</b>, we'll count on you to:    Design...",
                        "company": "HDR Inc",
                        "salary": ""
                    },
                    {
                        "locations": "Omaha, NE",
                        "site": "www.resume-library.com",
                        "date": "Mon, 25 Jun 2018 07:56:51 GMT",
                        "url": "http://jobviewtrack.com/us-en/job-1218415e480a0601555444061b08090945451a0f001d4f4e4f2f5d160004421754430c041d0e024e760d0714434558485f661f1c481e45001c410b0902491a0d0c01285b4f4247010c1a2640165058/933d7180871ff5e364a9150182cf2dd1.html",
                        "title": "Senior Project Engineer Structures Design",
                        "description": "Job Description   Share:   Senior Project <b>Engineer</b> Structures Design  Location: Omaha, NE   Posting... - Engineering degree in <b>Civil</b> Engineering   Background   Medical   Union   WorkConditions   Others   Union Pacific supports...",
                        "company": "Union Pacific Railroad",
                        "salary": ""
                    },
                    {
                        "locations": "Omaha, NE",
                        "site": "www.harrisonconsultingsolutions.com",
                        "date": "Sun, 01 Jul 2018 22:53:49 GMT",
                        "url": "http://jobviewtrack.com/us-en/job-191d414e4412060225114e04010f0b02172217011f1a460b58434a0d010b420622100d0f0708170017011f1a46294e48430d001c07174915010d4e020b471d060c16582a091b1e54/232e311beef0431b0b35ecf7cbdf02cc.html",
                        "title": "Senior Civil Engineer",
                        "description": "Job Summary & Responsibilities   Local Mid West firm looking to add a Senior <b>Civil</b> <b>Engineer</b> to their Omaha office...!   Requirements:  - B. S in <b>Civil</b> Engineering  - 8+ years experience with demonstrated growth in responsibilities   - P...",
                        "company": "Harrison Consulting Solutions",
                        "salary": ""
                    },
                    {
                        "locations": "Omaha, NE",
                        "site": "www.resume-library.com",
                        "date": "Mon, 18 Jun 2018 07:07:11 GMT",
                        "url": "http://jobviewtrack.com/us-en/job-4c12414e441206022519550d01020717044c76051c1d4348545d4c084f0b4913490d0d041c65004e130107164f593f4e4412060207114e04010f0b021721405e5a43/b5db6ceba7e13833d1c111dc8336a7a7.html",
                        "title": "Civil/Municipal Engineer",
                        "description": "Job Description   <b>Civil</b>/Municipal <b>Engineer</b>   <b>Civil</b>/Municipal <b>Engineer</b>  ()   About UsAt HDR, we specialize in.... Above all, we believe that collaboration is the best way forward.   Primary Responsibilities  In the role of <b>Civil</b>/Municipal <b>Engineer</b>, we'll...",
                        "company": "HDR Inc",
                        "salary": ""
                    },
                    {
                        "locations": "Omaha, NE",
                        "site": "www.kiewit.com",
                        "date": "Tue, 22 May 2018 22:47:12 GMT",
                        "url": "http://jobviewtrack.com/us-en/job-191b414e4412060225014e070d1309150a551a0c4916444c544348011d6c421a470a06040b1567431d1e001f0a4e534a440a0a0b557653171a140d131052150449174f58544a43440a00401d4e060d136f53531344/cc9cde1a0392da0745e4f85b5096ee66.html",
                        "title": "Civil/Structural Design Engineer - Kiewit Underground",
                        "description": "  Nearest Secondary Market: Council Bluffs  Job Segment: <b>Civil</b> <b>Engineer</b>, Construction, <b>Engineer</b>, Chemical Research, Design...’s degree in <b>civil</b> engineering with an emphasis on structural design  10+ years experience in Structural Engineering and drawing...",
                        "company": "Kiewit",
                        "salary": ""
                    },
                    {
                        "locations": "Omaha, NE",
                        "site": "www.aiaa.org",
                        "date": "Sun, 01 Jul 2018 00:20:57 GMT",
                        "url": "http://jobviewtrack.com/us-en/job-491a415e480a0601555444061b08090945451a0f001d4f4e4f2f5d160004421754430c041d0e024e761a06124e5c5c540d000a1d4e134e610d0f090e0b45111a6b03584457484e104f0b4913490d0d041c6651164758/f88408e548b0c286f39cc2d628c478d6.html",
                        "title": "Senior Project Engineer - Roadway Design (Omaha)",
                        "description": "'s degree in <b>civil</b> engineering from an accredited college or university.  Registered Professional <b>Engineer</b> or ability to obtain... everything they do.   Lamp, Rynearson & Associates, Inc., a <b>civil</b> engineering, survey, planning, and consulting firm with a solid reputation...",
                        "company": "",
                        "salary": ""
                    },
                    {
                        "locations": "Omaha, NE",
                        "site": "www.harrisonconsultingsolutions.com",
                        "date": "Thu, 28 Jun 2018 22:58:55 GMT",
                        "url": "http://jobviewtrack.com/us-en/job-4919415f42050b19460d0006060607090045066a1b1c4b4f4a4c54660a00401d4e060d136f53531344/fcab2e0df39202d98206970da98ae89c.html",
                        "title": "Roadway Engineer",
                        "description": " a Roadway <b>Engineer</b> to join their Transportation team in Omaha, Nebraska!   Responsibilities:   - Process design calculations..., site visits, and inspections   Requirements:   - B.S. degree in <b>Civil</b> Engineering   - 3+ years of relevant experience   - P...",
                        "company": "Harrison Consulting Solutions",
                        "salary": ""
                    },
                    {
                        "locations": "Omaha, NE",
                        "site": "www.harrisonconsultingsolutions.com",
                        "date": "Thu, 28 Jun 2018 22:44:01 GMT",
                        "url": "http://jobviewtrack.com/us-en/job-191e415e59161a0d5301520204631d131755171c1c014b471d4843030600421152610d0f090e0b45111a68471c180d/059b03001df3ccacfda22a5382d11c61.html",
                        "title": "Structural Engineer",
                        "description": " a Structural <b>Engineer</b> to join their Omaha team!   Responsibilities:   - Serve as project manager on small/medium sized projects... and documents   - Travel to different job sites for bridge surveys   Requirements:   - B.S. degree in <b>Civil</b>, Structural...",
                        "company": "Harrison Consulting Solutions",
                        "salary": ""
                    },
                    {
                        "locations": "Omaha, NE",
                        "site": "www.harrisonconsultingsolutions.com",
                        "date": "Wed, 27 Jun 2018 22:10:27 GMT",
                        "url": "http://jobviewtrack.com/us-en/job-181f414843030600421152611f001d130057151c0c01285c5c5948164f19460754061f001a02170011060e1a444e585f2f130e1d531157021c041c47004e130107164f593f5a4c100a1c07114e04010f0b021721405e5a43/348f1a228491d6c671bd32490cdb62e5.html",
                        "title": "Water/Wastewater Engineer",
                        "description": "Job Summary & Responsibilities   Multidisciplinary design firm is seeking a Water/Wastewater <b>Engineer</b>... staff   Requirements:   - B.S. degree in <b>Civil</b> Engineering   - 5+ years of experience   - P.E. license...",
                        "company": "Harrison Consulting Solutions",
                        "salary": ""
                    }
                ],
                hits: 50,
                response_time: 0.325642108917236,
                type: "JOBS",
                pages: 5
            }
            
            var data = result.jobs;
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
                newP.html(data[i].description);
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
            $("#job-Board").empty();
            $("#job-Board").append(newDiv);
            $("#job-Board").attr("style", 'background-color: white; overflow-y: scroll');
        });
    // });
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
        $("#map-Board").empty();
        $("#map-Board").append(newMap);
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
        // retrieveMaps();
    });
})