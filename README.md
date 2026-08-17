# Smart Parking System

A modern, responsive, and fully interactive smart parking dashboard designed to optimize the process of tracking, booking, and managing parking spaces.

## Implemented JavaScript Event Handling Features

As per the assignment requirements, this project has been fully updated to be interactive using **only `addEventListener()`** bindings (no inline HTML handlers). Below is a detailed breakdown of the event types used and where they are implemented:

### 1. `click`
- **Parking Slot Grid:** Clicking the "Park Vehicle" button books the slot and changes its status to occupied. Clicking the favorite/star icon toggles it.
- **Session Timer:** Clicking "Start Session" / "Pause Session" toggles the timer. Clicking on the session progress bar jumps the timer to the clicked percentage.
- **Parking Preferences:** Clicking the "Confirm Preferences" button calculates and displays the optimal parking spot, and "Start Reservation Timer" starts the 60s countdown.
- **Feedback Board:** Clicking the "Reply" button (handled via Event Delegation on the container) dynamically opens a reply textbox.
- **Dashboard Tracker:** Clicking the tracking card expands it to reveal details.

### 2. `mouseover` & `mouseout`
- **Parking Slot Grid:** Hovering over a parking slot displays a hidden preview overlay with specific slot details.
- **Dashboard Tracker:** Hovering over the progress bar reveals a precise tooltip showing the percentage complete.

### 3. `input`
- **Search & Filter Bar:** Typing in the search bar instantly filters the parking slot grid.
- **Session Timer:** Sliding the range input instantly updates the duration reminder text.
- **Registration Form:** Typing in the "Confirm Password" field triggers live, real-time matching validation against the Password field.

### 4. `change`
- **Search & Filter Bar:** Changing any of the 3 dropdowns (Zone, Vehicle Type, Status) instantly filters the grid.
- **Parking Preferences:** Changing the radio buttons records the user's preference state internally.
- **Dashboard Tracker:** Toggling the "Mark Complete" checkbox instantly fills the progress bar.

### 5. `submit`
- **Registration Form:** Submits the form, validates password matching, prevents default page reload (`event.preventDefault()`), and shows a success message.
- **Feedback Board:** Submits the new comment form, intercepts the reload (`preventDefault()`), and dynamically prepends a new comment card to the DOM.

### 6. `blur`
- **Registration Form:** Clicking away from the **Phone** or **Email** fields triggers individual inline validation (e.g. validating exactly 10 digits for phone and regex format for email).

### 7. `keydown`
- **Search & Filter Bar:** Pressing the Enter key while focused on the search box intercepts the default action and explicitly runs the filter function.

### 8. `dblclick`
- **Feedback Board:** Double-clicking on your own comment text transforms it into an editable text input, allowing you to edit it dynamically!

### 9. Timers (`setInterval`)
- **Session Timer:** Runs a 1-second interval to increment the elapsed time, update the formatted clock, calculate live parking fees, and fill the progress bar.
- **Preference Reservation:** Runs a 60-second countdown timer.

---

*Designed and Built by Summerjeet Singh*
