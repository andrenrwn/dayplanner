// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
/*$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});
*/

// Global variables

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
var yyyy = today.getFullYear();


// Save button is clicked
$("div.row.time-block > .saveBtn").on("click", function () {
    console.log($(this).parent()[0].id);
    $(this).removeClass("blink_me");  // unblink the save button after save
});

$("div.row.time-block > textarea").on("input", function () {
    console.log($(this).parent()[0].id);
    $(this).next().addClass("blink_me"); // content changed, apply blink to save button
});


//document.querySelector("#hour-10 > textarea")
//document.querySelector("body > div > div.row.time-block.present > textarea")