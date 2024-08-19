// Event listeners to buttons for corresponding functions
document.getElementById('start-timer').addEventListener('click', startTimer);
document.getElementById('reset-timer').addEventListener('click', resetTimer);
document.getElementById('reset-all').addEventListener('click', resetAll);
document.getElementById('stop-timer').addEventListener('click', stopTimer);
document.getElementById('resume-timer').addEventListener('click', resumeTimer);

// New event listeners for interval buttons
document.getElementById('2-min').addEventListener('click', () => setTimerInterval(2));
document.getElementById('4-min').addEventListener('click', () => setTimerInterval(4));
document.getElementById('6-min').addEventListener('click', () => setTimerInterval(6));
document.getElementById('8-min').addEventListener('click', () => setTimerInterval(8));
document.getElementById('10-min').addEventListener('click', () => setTimerInterval(10));
document.getElementById('15-min').addEventListener('click', () => setTimerInterval(15));

let interval; // Declare interval globally to clear it when restarting
let isRunning = false; // Variable to check if the timer is running
let timeRemaining = 900; // Default to 900 seconds for 15 minutes
let userTime = null; // Initialize userTime 

// Function to set the timer based on the selected interval
function setTimerInterval(minutes) {
    timeRemaining = minutes * 60;
    userTime = timeRemaining;
    document.getElementById('timer').innerText = formatTime(timeRemaining);
    document.getElementById('timer').style.visibility = 'visible'; // Make the timer visible
    
    // Move the start timer button below the timer
    const startButton = document.getElementById('start-timer');
    const startButtonGroup = document.querySelector('.start-button-group');
    startButtonGroup.style.display = 'flex';
}
// Function to start the timer
function startTimer() {
    const smallBlindInput = document.getElementById('small-blind').value;
    const bigBlindInput = document.getElementById('big-blind').value;

    if (!smallBlindInput || !bigBlindInput) {
        alert('Please enter both small and big blinds.');
        return;
    }

    // Ensure that a timer interval has been selected
    if (userTime === null) {
        alert('Please select a timer option before starting.');
        return;
    }

    if (isRunning) {
        alert('Timer is already running.');
        return;
    }

    isRunning = true;

    let smallBlind = parseInt(smallBlindInput);
    let bigBlind = parseInt(bigBlindInput);

    document.getElementById('current-small-blind').innerText = smallBlind;
    document.getElementById('current-big-blind').innerText = bigBlind;

    const timerElement = document.getElementById('timer');

    if (interval) {
        clearInterval(interval);
    }

    // Hide the instruction text and the interval buttons
    document.querySelector('.instruction-text').style.display = 'none';
    document.querySelectorAll('.interval-button').forEach(button => button.style.display = 'none');

    interval = setInterval(() => updateTimer(smallBlind, bigBlind), 1000);

    document.getElementById('start-timer').style.display = 'none';
    document.getElementById('reset-timer').style.display = 'inline-block';
    document.getElementById('reset-all').style.display = 'inline-block';
    document.getElementById('stop-timer').style.display = 'inline-block';
    document.getElementById('resume-timer').style.display = 'none';
}

// Function to reset the timer
function resetTimer() {
    if (interval) {
        clearInterval(interval);
    }

    isRunning = false; // Stop the timer from running

    const smallBlind = parseInt(document.getElementById('current-small-blind').innerText);
    const bigBlind = parseInt(document.getElementById('current-big-blind').innerText);

    // Reset the timeRemaining to user-defined or default value
    const timerElement = document.getElementById('timer');
    timeRemaining = userTime || 900; // Reset to the user-selected time or default 15 minutes
    timerElement.innerText = formatTime(timeRemaining);

    // Restart the timer with the current blinds
    startTimerWithBlinds(smallBlind, bigBlind);

    // Ensure interval buttons do NOT reappear
    document.querySelectorAll('.interval-button').forEach(button => button.style.display = 'none');

    // Hide the stop timer and resume timer buttons
    document.getElementById('stop-timer').style.display = 'inline-block';
    document.getElementById('resume-timer').style.display = 'none';
}

// Function to reset everything to initial state
function resetAll() {
    clearInterval(interval); // Clear the interval
    isRunning = false; // Set running status to false
    timeRemaining = 900; // Reset to the original time

    // Reset the blinds back to 0 and clear user input
    document.getElementById('small-blind').value = '';
    document.getElementById('big-blind').value = '';
    document.getElementById('current-small-blind').innerText = '0';
    document.getElementById('current-big-blind').innerText = '0';

    const timerElement = document.getElementById('timer');
    timerElement.innerText = formatTime(timeRemaining);

    // Show interval buttons when the timer is reset
    document.querySelectorAll('.interval-button').forEach(button => button.style.display = 'inline-block');

    // Reset button visibility
    document.getElementById('start-timer').style.display = 'inline-block';
    document.getElementById('reset-timer').style.display = 'none';
    document.getElementById('reset-all').style.display = 'none';
    document.getElementById('stop-timer').style.display = 'none';
    document.getElementById('resume-timer').style.display = 'none';

    // Show the instruction text again
    document.querySelector('.instruction-text').style.display = 'block';
}

// Function to start the timer with existing blinds
function startTimerWithBlinds(smallBlind, bigBlind) {
    const timerElement = document.getElementById('timer');

    // Clear any existing intervals
    if (interval) {
        clearInterval(interval);
    }

    // Set up interval to update the timer every second
    interval = setInterval(() => updateTimer(smallBlind, bigBlind), 1000);

    isRunning = true; // Set running status to true

    // Ensure correct button visibility
    document.getElementById('stop-timer').style.display = 'inline-block';
    document.getElementById('resume-timer').style.display = 'none';
}

// Function to stop the timer
function stopTimer() {
    if (!isRunning) {
        alert('The timer has not been started yet.');
        return;
    }

    // Clear the interval and set running status to false
    if (interval) {
        clearInterval(interval);
        isRunning = false;
    }

    // Show resume button and hide stop button
    document.getElementById('resume-timer').style.display = 'inline-block';
    document.getElementById('stop-timer').style.display = 'none';
}

// Function to resume the timer
function resumeTimer() {
    if (isRunning) {
        return;
    }

    isRunning = true; // Set running status to true

    // Set up interval to update the timer every second
    interval = setInterval(updateTimer, 1000);

    // Show stop button and hide resume button
    document.getElementById('stop-timer').style.display = 'inline-block';
    document.getElementById('resume-timer').style.display = 'none';
}

// Function to update the timer and double the blinds when time reaches 0
function updateTimer(smallBlind, bigBlind) {
    const timerElement = document.getElementById('timer');

    if (timeRemaining > 0) {
        // Update the timer display
        timerElement.innerText = formatTime(timeRemaining);
        timeRemaining--;
    } else {
        // Ensure it shows 00:00 at the end
        timerElement.innerText = `00:00`;
        clearInterval(interval);

        // Double the blinds
        smallBlind = parseInt(document.getElementById('current-small-blind').innerText) * 2;
        bigBlind = parseInt(document.getElementById('current-big-blind').innerText) * 2;
        document.getElementById('current-small-blind').innerText = smallBlind;
        document.getElementById('current-big-blind').innerText = bigBlind;

        // Reset the timer to the originally chosen time and restart it
        timeRemaining = userTime || 900; // Reset to the user-selected time or default 15 minutes
        interval = setInterval(() => updateTimer(smallBlind, bigBlind), 1000);
    }
}

// Function to format the time as mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}