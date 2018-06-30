$(document).foundation()

var userData = {
    city: "",
    state: "",
    country: "",
    zipCode: "",
    jobQuery: ""
}
// function for maxing sure that all the characters in a string are letters and not numbers, symbols, etc
function validText (string) {
    var text = string.toLowercase();
    var isValid = true;
    while(isValid){
        for(var i=0; i < text.length; i++){
            var char = text.charCodeAt(i);
            if (char < 0x0061 || char > 0x007A){
                if(char != 0x0027 || char != 0x002D){
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
    });
})