var currentGameData = new CurrentGameData();
var display = new Display();

var buzzer = document.getElementById("buzzer");
var timerAtZeroCount = 0;
var buzzerBuzzing = false;

function timer()
{
    if (currentGameData.seconds > 0) {
        currentGameData.reduceTime();
        display.updateTime(currentGameData);
    }

    if (currentGameData.seconds <= 0) {
        if (timerAtZeroCount == 0) {
            buzzerBuzzing = true;
            buzzer.play();
            timerAtZeroCount++;
        } else if (timerAtZeroCount < 5) {
            // Waait for sound to finish
            timerAtZeroCount++;
        } else {
            buzzerBuzzing = false;
            // EndOfRound();
            clearInterval(timerId);
            document.getElementById("startButton").innerHTML = "Start";
            currentGameData.state = END_OF_ROUND;           
        }
    } else if (currentGameData.seconds <= settings.lowTime) {
        // change time to red
        document.getElementById("time").style.color = "red";        
    }
}

function startNextRound() {
    currentGameData.nextRound();
    currentGameData.resetTime();

    // Handle last rebuy round

    display.updateDisplay(currentGameData);
    timerAtZeroCount = 0;
}
