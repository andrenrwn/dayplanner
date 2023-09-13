# Work Day Scheduler

## About

This simple work day scheduler allows users to enter some text into an hourly time slot.

## Features

- It can function as a daily planner or scheduler
- The navbar shows the current day and time
- Scrolling down shows future time blocks
  Clicking the up/down buttons will skip an hour or a day into the previous/future time blocks.
- Time blocks shows past, current hour, and future blocks in different colors
- Clicking time blocks allows editing text for that time block.
  Modifying the text in that time block triggers a blinking save icon.
- Clicking on the "Save" button for that time block saves the data in local storage, and the save icon will stop blinking.
- Refreshing the window loads the text for each timeblock from local storage and redisplays them.

TBD:
- a calendar will be displayed to show/select the date/time
- a day selector can be used to jump to a specific date


## Compoments & Credits

[jQuery](https://jquery.com/)
[Bootstrap](https://getbootstrap.com/) - UI, formatting and navbar
[jsCalendar](https://gramthanos.github.io/jsCalendar/docs.html) - Date selector
