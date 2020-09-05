import View from "/resources/js/timer-view.js";
import Model from "/resources/js/timer-model.js";
import {settings} from "/resources/js/timer-settings.js";

class Controller {
    constructor(view, model) {
        this.view = view;
        this.view.playersScreen.style.display = "none";
        this.view.onStartButtonClick(this.handleStartButton);
        this.view.onPlayersScreenButtonClick(this.handlePlayersScreenButton);
        this.view.onHomeScreenButtonClick(this.handleHomeScreenButton);
        this.view.onAddPlayerButtonClick(this.handleAddPlayerButton);

        document.body.addEventListener("keydown", this.keydownHandler);

        this.model = model;
        this.buzzer = document.getElementById("buzzer");
        this.buzzerBuzzing = false;
        this.timerId;
        this.timerAtZeroCount = 0;
    }

    handleStartButton = () => {    
        let gameData = this.model.currentGameData;
        let startButton = this.view.startButton;
        let addPlayerButton = this.view.addPlayerButton;
        if (!this.buzzerBuzzing) {
            switch (gameData.state) {
                case gameData.NOT_STARTED:
                    startButton.value = "Pause";
                    this.timerId = setInterval(this.timer.bind(this), 1000);
                    addPlayerButton.disabled = true;
                    gameData.state = gameData.RUNNING;
                    break;
                case gameData.RUNNING:
                    startButton.value = "Continue";
                    clearInterval(this.timerId);
                    gameData.state = gameData.PAUSED;
                    break;
                case gameData.PAUSED:
                    startButton.value = "Pause";
                    this.timerId = setInterval(this.timer.bind(this), 1000);
                    gameData.state = gameData.RUNNING;
                    break;
                case gameData.END_OF_ROUND:
                    this.startNextRound();
                    startButton.value = "Pause";
                    this.timerId = setInterval(this.timer.bind(this), 1000);
                    gameData.state = gameData.RUNNING;
                    break;
            }
        }
    }

    handlePlayersScreenButton = () => {
        this.view.homeScreen.style.display = "none";
        this.view.playersScreen.style.display = "table";
    }

    handleHomeScreenButton = () => {
        this.view.homeScreen.style.display = "table";
        this.view.playersScreen.style.display = "none";
        this.model.currentGameData.updateCurrentGameData();
        this.updateDisplay();
    }

    handleAddPlayerButton = () => {
        if (this.view.popup == undefined) {
            this.view.addPlayerButton.disabled = true;
            this.view.createPopup("<b>Enter Name</b>", "addPlayer");
            this.view.popup.onOkButtonClick(this.handleOkButton);
            this.view.popup.onCancelButtonClick(this.handleCancelButton);
        }
    }

    handleAddRebuyButton = (event) => {
        let name = event.target.parentElement.parentElement.childNodes[1].innerHTML;
        let rebuys = event.target.parentElement.parentElement.childNodes[2];
        let player = this.model.currentGameData.getPlayerByName(name);
        if (player.rebuys < settings.maxRebuys) {
            player.rebuys++;
        } else {
            player.rebuys = 0;
        }
        rebuys.innerHTML = player.rebuys;
    }

    handleRemoveButton = (event) => {
        let table = event.target.closest("table");
        let row = event.target.closest("tr");
        let place = row.cells[0];
        let name = row.cells[1].innerHTML;
        let removeButton = row.cells[4].childNodes[0];
        let gameData = this.model.currentGameData;
        let player = gameData.getPlayerByName(name);
        if (gameData.state == gameData.NOT_STARTED) {
            table.deleteRow(row.rowIndex);
            gameData.startingPlayers--;
            gameData.removePlayer(name);
        } else {
            removeButton.disabled = true;
            player.place = gameData.playersLeft;
            player.eliminated = true;
            this.updatePlace(place);
            gameData.playersLeft--;
        }
    }

    handleOkButton = (input, divId) => {
        let gameData = this.model.currentGameData;
        let row;        
        switch (divId) {
            case "addPlayer":
                if (this.validPlayerInput(input.value)) {
                    gameData.startingPlayers++;
                    gameData.addPlayer(input.value);
                    row = this.view.createPlayerRow(input);
                    row.onAddRebuyButtonClick(this.handleAddRebuyButton);
                    row.onRemoveButtonClick(this.handleRemoveButton);
                } else {
                    input.value = "";
                    input.focus();
                    this.view.popup.error.innerHTML = "Player Already Exists!";
                }
                break;
            case "changeTime":
                if (this.validTimeInput(input.value)) {
                    gameData.setTime(input.value);
                    this.updateDisplay();
                    this.view.popup.remove();
                    delete this.view.popup;
                }
                else {
                    input.value = "";
                    input.focus();
                    this.view.popup.error.innerHTML = "Invalid Entry!";
                }
                break;
            case "changeRound":
                if (this.validRoundInput(input.value)) {
                    gameData.round = parseInt(input.value, 10);
                    this.updateDisplay();
                    this.view.popup.remove();
                    delete this.view.popup;
                }
                else {
                    input.value = "";
                    input.focus();
                    this.view.popup.error.innerHTML = "Invalid Entry!";
                }
                break;

        }
    }

    handleCancelButton = () => {
        this.view.popup.remove();
        delete this.view.popup;
        // In case this is the addPlayer popup, re-enable the addPlayerButton
        this.view.addPlayerButton.disabled = false;
    }

    validPlayerInput(value) {
        var table = this.view.playerTable;
        var duplicate = false;
        var i;
        for (i = 0; i < table.rows.length; i++) {
            if (table.rows[i].cells[1].innerHTML == value) {
                duplicate = true;
            }
        }
        return !duplicate;
    }

    validTimeInput(value) {
        //value = parseFloat(value);
        if (isNaN(value) || value < 0.1 || value > 60) {
            return false;
        } else {
            return true;
        }
    }

    validRoundInput(value) {
        if (isNaN(value) || value < 1 || value > 20 ||
            value.indexOf(".") != -1)  {
            return false;
        } else {
            return true;
        }
    }

    updatePlace(place) {
        let playersLeft = this.model.currentGameData.playersLeft;
        switch (playersLeft)
        {
            case 1:
                place.innerHTML = "1st";
                break;
            case 2:
                place.innerHTML = "2nd";
                break;
            case 3:
                place.innerHTML = "3rd";
                break;
            default:
                place.innerHTML = playersLeft + "th";
                break;
        }
    }

    updateDisplay() {
        this.view.playersLeft.innerHTML = this.model.currentGameData.playersLeft;
        this.view.averageStack.innerHTML = this.model.currentGameData.averageStack;
        this.view.totalChips.innerHTML = this.model.currentGameData.totalChips;
        this.view.payout1st.innerHTML = "$" + this.model.currentGameData.payouts[0];
        this.view.payout2nd.innerHTML = "$" + this.model.currentGameData.payouts[1];
        this.view.payout3rd.innerHTML = "$" + this.model.currentGameData.payouts[2];
        this.view.payout4th.innerHTML = "$" + this.model.currentGameData.payouts[3];
        this.view.pot.innerHTML = "$" + this.model.currentGameData.pot;
        this.updateTime(this.model.currentGameData);
        this.view.currentRound.innerHTML = "Round " + this.model.currentGameData.round;
        this.view.currentBlinds.innerHTML = this.model.currentGameData.getBlinds();
        this.view.nextBlinds.innerHTML = this.model.currentGameData.getNextBlinds();
    }

    updateTime(gameData) {
        this.view.time.innerHTML = this.formatTime(gameData.getMinutes(), gameData.getSeconds());
    }

    formatTime(min, sec) {
        var s;
        if (sec < 10) {
            s = min + ":0" + sec;
        }
        else {
            s = min + ":" + sec;
        }
        return s;
    }

    startNextRound() {
        let gameData = this.model.currentGameData;
        gameData.nextRound();
        gameData.resetTime();
    
        // Handle last rebuy round
    
        this.updateDisplay(gameData);
        this.timerAtZeroCount = 0;
    }

    timer() {
        let gameData = this.model.currentGameData;
        if (gameData.seconds > 0) {
            gameData.reduceTime();
            this.updateTime(gameData);
        }

        if (gameData.seconds <= 0) {
            if (this.timerAtZeroCount == 0) {
                this.buzzerBuzzing = true;
                this.buzzer.play();
                this.timerAtZeroCount++;
            } else if (this.timerAtZeroCount < 5) {
                // Waait for sound to finish
                this.timerAtZeroCount++;
            } else {
                this.buzzerBuzzing = false;
                // EndOfRound();
                clearInterval(this.timerId);
                this.view.startButton.value = "Start";
                gameData.state = gameData.END_OF_ROUND;           
            }
        } else if (gameData.seconds <= settings.lowTime &&
                   this.view.time.style.color != "red") {
            // change time to red
            this.view.time.style.color = "red";        
        } else if (gameData.seconds > settings.lowTime && this.view.time.style.color != "white") {
            this.view.time.style.color = "white";   
        }
    }

    keydownHandler = (event) => {
        //var input = document.getElementById("popupText");
        var popup = this.view.popup;
        if (popup != undefined && document.activeElement === popup.input) {
            if (event.key === "Enter") {
                event.preventDefault();
                this.view.popup.okButton.click();
            } else if (event.key === "Escape") {
                event.preventDefault();
                this.view.popup.cancelButton.click();
            }
        } else {
            if (event.key === "f") {
                this.setFullscreen();
            } else if (event.key === " ") {
                event.preventDefault();
                this.view.startButton.click()
            } else if (event.key === "`") {
                if (this.view.homeScreen.style.display == "none") {
                    this.view.homeScreenButton.click();
                } else {
                    this.view.playersScreenButton.click();
                }
            } else if (event.ctrlKey && event.altKey && event.key === "t") {
                event.preventDefault();
                if (popup == undefined) {
                    this.view.createPopup("<b>Enter Time in Minutes</b><br>(min: 0.1, max: 60)", "changeTime");
                    this.view.popup.onOkButtonClick(this.handleOkButton);
                    this.view.popup.onCancelButtonClick(this.handleCancelButton);
                }
            } else if (event.ctrlKey && event.altKey && event.key === "r") {
                if (popup == undefined) {
                    this.view.createPopup("<b>Enter Round</b><br>(min: 1, max: 20, no decimals)", "changeRound");
                    this.view.popup.onOkButtonClick(this.handleOkButton);
                    this.view.popup.onCancelButtonClick(this.handleCancelButton);
                }
            }
        }
    }

    setFullscreen() {
        var elem = this.view.homeScreen;
        if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen(window.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }
}

const pokerTimer = new Controller(new View(), new Model());