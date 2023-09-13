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
var selectedday = Date();
const onehour = 3600000; // 1 hour in epoch milliseconds
var thishour = Math.floor(Date.parse(selectedday) / onehour) * onehour; // data in hourly blocks
var rows_to_display = 9; // show how many hours in a day

function getbaseday(day) {
    console.log("getbaseday: ", day);
    var d = new Date(day);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    // console.log("getbaseday to: ", Date.parse(d));
    return Date.parse(d);
}

// show_starthour specifies the start of the hour to display
//var show_starthour = thishour - (onehour * 2); // display two hours to this hour
//var show_starthour = thishour - (onehour * Math.floor(rows_to_display/2) + 1); // show this hour in the middle
//var show_starthour = Math.floor(selectedday / onehour) * onehour - (Math.floor(rows_to_display/2) * onehour); // 11-hour before this hour
var show_starthour = getbaseday(selectedday) + (onehour * 9); // start from 9am

var fit_in_window = false;
var show_min_rows = 3; // minimum number of rows to show in window, if we are following viewport height

// Use jsCalendar as the date selector
var myjsCalendar = jsCalendar.new('#mydateselector', selectedday.toDateString);

// Global variables - planner data - try using object oriented class to make this closer to JQuery
class plannerobj {
    constructor() {
        this.pdata = {}; // { "a": "b" };
        this.storagekey = "dayplannerdata";
        this.load_data();
    }
    // Store data in memory in this object
    //data: {},
    print_data(key) {
        if (key === undefined) {
            //console.log(this.pdata);
        } else {
            //console.log(this.pdata[key]);
        }
        return true;
    }
    // Get data from localstorage
    get_data(key) {
        if (key === undefined) {
            //console.log(this.pdata);
            return this.pdata;
        } else {
            //console.log(this.pdata[key]);
            return this.pdata[key];
        }
    }
    // Store data in memory
    set_data(key, content) {
        if (key === undefined) {
            console.log("set data ", this.pdata);
        } else {
            console.log("set data overwriting " + this.pdata[key] + " on key " + key + " with " + content);
            this.pdata[key] = content;
        }
        this.store_data();
        return true;
    }
    // Load data from localstorage
    load_data() {
        let newdata = {};
        //console.log("loading from storage");
        //console.log(this.pdata);
        newdata = JSON.parse(localStorage.getItem(this.storagekey));
        Object.assign(this.pdata, newdata); // merge data from storage
        console.log("merged from storage: ", this.pdata);
    }
    // Store data to localstorage
    store_data() {
        console.log("saving to storage");
        console.log(this.pdata);
        localStorage.setItem(this.storagekey, JSON.stringify(this.pdata));
        return true;
    }
}

// Declare a global variable planner object
var planner = new plannerobj();


// Define time blocks in html
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

// The time bar displays the current hour on today's time block
var time_bar = $($.parseHTML('<div id="timebar"></div>'));

// -------------------------
// Clock (present date/time)
// -------------------------

// Refresh the clock every second
function refreshclock() {

    let djs = dayjs();

    // Display the current Day on top clock
    $('#currentDay').text(djs.format('dddd D MMMM YYYY hh:mm:ss'));

    // Display the current Day on the main calendar
    $('#select-day').text(djs.$D);
    $('#select-month-year').text(djs.format('MMMM · YYYY'));
    $('#calendarfacetime').text(djs.format('hh:mm:ss'));

    // Display the current time:seconds on the time bar in the current hour block
    $('#timebar').text(djs.format('mm:ss'));
    $('#timebar').height((djs.$m * 60 + djs.$s) / 36 + "%");

    thishour = Math.floor(djs.valueOf() / onehour) * onehour; // update thishour

    // Re-render the table if we just turned the hour
    if ((djs.minute() + djs.second()) < 1) {
        display_table(show_starthour, rows_to_display);
    }

    /********** uncomment for non-Day.js implementation
    let d = new Date();

    // Display the current Day on top clock
    $('#currentDay').text(d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    }));

    // Display the current Day on the main calendar
    $('#select-day').text(d.getDate());
    $('#select-month-year').text(d.toLocaleDateString('en-EN', { year: 'numeric', month: 'long' }));

    // Display the current time:seconds on the time bar in the current hour block
    $('#timebar').text(d.getMinutes() + ":" + d.getSeconds());
    $('#timebar').height((d.getMinutes() * 60 + d.getSeconds()) / 36 + "%");

    thishour = Math.floor(new Date() / onehour) * onehour; // update thishour

    // Re-render the table if we just turned the hour
    if ((d.getMinutes() + d.getSeconds()) < 2) {
        display_table(show_starthour, rows_to_display);
    }
    /uncomment for non-Day.js implementation ************/
}

// Create a timer to display current date/time
const timerID = setInterval(refreshclock, 1000); // update every second

// ------------------
// Render day planner
// ------------------

// Build out (render) schedule table for the day
function display_table(starthour, numrows) {
    $("#schedulelist").empty(); // Clear all time blocks from the display

    // Add time blocks one by one
    for (var i = 0; i < numrows; i++) {
        time_i = starthour + (i * onehour);
        let d = new Date(0);
        d.setUTCSeconds(time_i / 1000);
        //console.log("TIMEBLOCK: ", d, ":", selectedday, time_i, thishour, time_i===thishour);
        let hourstring = d.toLocaleString('en-US', {
            hour: 'numeric',
            hour12: true,
        });

        // time_block.attr("id", "hour-" + hourstring.replace(/ /g, '')); // actually not useful
        // time_block.attr("data-epochr", i); // set the epoch hour as data key
        time_block.attr("id", starthour + (i * onehour)); // set the ID to the epoch hour

        time_block.removeClass("past present future");
        time_block.remove("#timebar");

        time_block.children().eq(0).text(hourstring);
        time_block.children().eq(1).val(planner.get_data(time_i));

        if (time_i < thishour) {
            time_block.addClass("past");
            time_block.children().eq(1).attr("id", "");
        } else if (time_i === thishour) {
            time_block.addClass("present");
            time_block.children().eq(1).attr("id", "timenow");
            time_block.children().eq(0).prepend(time_bar);
        } else {
            time_block.addClass("future");
            time_block.children().eq(1).attr("id", "");
        }

        // Add a new row to display the date when this is 00 hours or the beginning of the table
        if (d.getHours() === 0 || i === 0) {
            //let dayformat = new Intl.DateTimeFormat('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            let dayformat = new Date(time_i).toLocaleString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            //console.log("DAYFORMAT: ", dayformat);
            $("#schedulelist").append('<div class= "dayseparator row time-block" >' + dayformat + '</div>');
        };

        time_block.clone().appendTo("#schedulelist");
    }
}

// Render all elements before attaching JQuery events to it
display_table(show_starthour, rows_to_display);

// -----------------
// Add jQuery Events
// -----------------

// Navbar - pressing enter should also toggle bootstrap collapsible button
$("#selectdaytoggle").keyup(function (event) {
    console.log("keypress on collapse button");
    if (event.keyCode === 13) {
        $("#selectdaytoggle").click();
    }
});

// Select today's date on both day selector and day planner
$("#selecttoday").on("click keyup", function () {
    selectedday = Date();
    myjsCalendar.clearselect();
    myjsCalendar.set(new Date());
    myjsCalendar.refresh();
    thishour = Math.floor(Date.parse(selectedday) / onehour) * onehour; // data in hourly blocks
    //show_starthour = thishour - onehour; // (onehour * Math.floor(rows_to_display/2)); // past hours to display
    show_starthour = getbaseday(selectedday) + (onehour * 9); // start from 9am
    display_table(show_starthour, rows_to_display);
});

// Let the user specify how many rows of hours to display
$("#numhoursdisplay").on('input', function () {
    var val = this.value;
    if (Number.isInteger(Number.parseInt(val))) {
        if (val < 3) {
            val = 3;
        } else if (val > 24) {
            val = 24;
        }
    } else {
        val = 9;
    }
    $("#numhoursdisplay").val(val);
    rows_to_display = val;
    display_table(show_starthour, rows_to_display);
});

// Navbar - Search button is pressed
/*
$("#search").on("click", function () {
    console.log("search for: ");
    console.log($(this).prev().val());
});
*/


// Save button is clicked, unblink the save icon
$("div.row.time-block > .saveBtn").on("click keyup", function () {
    //console.log($(this).parent()[0].id);
    //console.log($(this).prev().val());
    planner.set_data($(this).parent()[0].id, $(this).prev().val());
    $(this).removeClass("blink_me");  // unblink the save button after save
});

// If content is modified in any textarea section, blink the save icon sibling element
$("div.row.time-block > textarea").on("input", function () {
    //console.log($(this).parent()[0].id);
    $(this).next().addClass("blink_me"); // content changed, apply blink to save button
});


// Navigation around the day planner

// Up one day button is pressed
$("#up-day").on("click keyup", function () {
    show_starthour -= (onehour * 24);
    display_table(show_starthour, rows_to_display);
});

// Up one hour button is pressed
$("#up-one").on("click keyup", function () {
    show_starthour -= onehour;
    display_table(show_starthour, rows_to_display);
});

// Down one hour button is pressed
$("#down-one").on("click keyup", function () {
    show_starthour += onehour;
    display_table(show_starthour, rows_to_display);
});

// Down one day button is pressed
$("#down-day").on("click keyup", function () {
    show_starthour += (onehour * 24);
    display_table(show_starthour, rows_to_display);
});

// jsCalendar event - when user clicks on a selected date (and refresh the current hour)
myjsCalendar.onDateClick(function (event, clickeddate) {
    //this.set(clickedate);
    this.clearselect();
    this.select(clickeddate);
    selectedday = clickeddate;
    thishour = Math.floor(new Date() / onehour) * onehour; // data in hourly blocks
    // let selectedhour = Math.floor(Date.parse(selectedday) / onehour) * onehour; // data in hourly blocks
    show_starthour = getbaseday(selectedday) + (onehour * 9); // start from 9am
    //show_starthour = selectedhour; // - (onehour * Math.floor(rows_to_display/2)); // display at the start of the day
    display_table(show_starthour, rows_to_display);
    //console.log("selected ", clickeddate.toString());
});


// Respond to window resizing --- TODO: dynamically resize planner layout to viewport
function refresh_window() {
    if (fit_in_window) {
        let maxrows = Math.floor(($(window).height() -
            $('#schedulelist')[0].getBoundingClientRect().top -
            ($('.dayseparator').height() * 5)) /
            $('.time-block').not('.dayseparator').height());
        //console.log("enough for " + maxrows);
        if (maxrows < show_min_rows) {
            maxrows = show_min_rows;
        };
        refreshclock();
        display_table(show_starthour, maxrows);
    };
}

// Only have enough rows to fit viewport when window is resized
$(window).on("resize", refresh_window);

// collapse / show calendar day selector
$(".btn, #selectdaytoggle").on("hidden.bs.collapse shown.bs.collapse", refresh_window);

// refresh the clock on page load
refreshclock();

