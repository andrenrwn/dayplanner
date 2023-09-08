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
var selectedday = today;
const onehour = 3600000; // 1 hour in epoch milliseconds
var thishour = Math.floor(Date.parse(selectedday) / onehour) * onehour; // data in hourly blocks
var show_starthour = thishour - (onehour * 11); // 11-hour before
var show_endhour = thishour + (onehour * 12); // 12-hour after

// <!--Example of a time block.The "present" class specifies background color.-->
var time_block = $($.parseHTML('\
    <div class= "row time-block" > \
      <div class="col-2 col-md-1 hour text-center py-3"></div> \
      <textarea class="col-8 col-md-10 description" rows="3"></textarea> \
      <button class="btn saveBtn col-2 col-md-1" aria-label="save"> \
          <i class="fas fa-save" aria-hidden="true"></i> \
      </button> \
    </div >\
    '));


// Display the current Day
$("#currentDay").text(selectedday.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
}));

// Build out schedule table for the day
for (var i = show_starthour; i <= show_endhour; i += onehour) {
    let d = new Date(0);
    d.setUTCSeconds(i / 1000);
    console.log(d, i / 1000);
    let hourstring = d.toLocaleString('en-US', {
        hour: 'numeric',
        hour12: true,
    });

    time_block.attr("id", "hour-" + hourstring.replace(/ /g, ''));
    if (i < thishour) {
        time_block.addClass("past");
    } else if (i === thishour) {
        time_block.addClass("present");
    } else {
        time_block.addClass("future");
    }
    time_block.children().eq(0).text(hourstring);
    time_block.clone().appendTo("#schedulelist");
}

// Save button is clicked, unblink the save icon
$("div.row.time-block > .saveBtn").on("click", function () {
    console.log($(this).parent()[0].id);
    $(this).removeClass("blink_me");  // unblink the save button after save
});

// If content is modified in any textarea section, blink the save icon sibling element
$("div.row.time-block > textarea").on("input", function () {
    console.log($(this).parent()[0].id);
    $(this).next().addClass("blink_me"); // content changed, apply blink to save button
});