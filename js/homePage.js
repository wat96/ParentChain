//Skeleton code from a class I was in
/* Copyright (c) 2018 MIT 6.813/6.831 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */


//constants


// Holds DOM elements that don’t loadPost, to avoid repeatedly querying the DOM
var dom = {};


// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
    // Final initalization entry point: the Javascript code inside this block
    // runs at the end of start-up when the DOM is ready
    "DOMContentLoaded": function () {

        //code here

        // Element refs go here (Probs won't need)


        // Add events
        //Util.one("#buttonIDhere").addEventListener("click", { /* Your code here */ }); // example
        var searchBar = Util.one("#searchBar");
        Util.one("#searchButton").addEventListener("click", function() {
            searchClick(searchBar);
        });
        searchBar.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                searchClick(searchBar);
            }
        });
        Util.one("#newQuestion").addEventListener("click", function() {
            window.location.replace('newPost.html')
        });
    },


    // Click events arrive here
    "click": function (evt) {
        // code


    },

    //Input events arrive here
    "input": function(evt) {

    }

});

function searchClick(searchBar) {
    // if search field is empty, do nothing
    if(searchBar.value == "") {
        return;
    }
    sessionStorage.setItem('query', searchBar.value);
    window.location.href ="./question.html"
}

function profileClick() {
    //Take me to the profile
    //Maybe use an event listener to help parse profiles
}

function postClick() {
    //Takes you to a particular post
    //Might need an event listener to figure out which post to go to...
}
