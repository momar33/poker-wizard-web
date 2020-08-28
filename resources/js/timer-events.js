
var startingPlayers = 0;

//***************************************************
//
//  Define Events
//
//***************************************************
document.addEventListener("DOMContentLoaded", load);
document.body.addEventListener("keydown", keyupHandler);
document.getElementById("startButton").addEventListener("click", startButtonPressed);
document.getElementById("playersScreenButton").addEventListener("click", switchScreen);
document.getElementById("homeScreenButton").addEventListener("click", switchScreen);
document.getElementById("addPlayerButton").addEventListener("click", addPlayer);
//document.getElementById("addButton").addEventListener("click", createPlayerRow);
//document.getElementById("closeButton").addEventListener("click", closeForm);
//***************************************************
//
//  Global Controls
//
//***************************************************

function load() {
    currentGameData.updateCurrentGameData();
    display.updateDisplay(currentGameData);
}

function keyupHandler(event) {
    var input = document.getElementById("popupText");
    if (document.activeElement === input) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("okButton").click();
        } else if (event.key === "Escape") {
            event.preventDefault();
            document.getElementById("cancelButton").click();
        }
    } else {
        if (event.key === "f") {
            setFullscreen();
        } else if (event.key === " ") {
            event.preventDefault();
            document.getElementById("startButton").click();
        } else if (event.key === "`") {
            document.getElementById("playersScreenButton").click();
        } else if (event.ctrlKey && event.altKey && event.key === "t") {
            event.preventDefault();
            if (input == null) {
                showForm("<b>Enter Time in Minutes</b><br>(min: 0.1, max: 60)", "changeTime");
            }
        } else if (event.ctrlKey && event.altKey && event.key === "r") {
            if (input == null) {
                showForm("<b>Enter Round</b><br>(min: 1, max: 20, no decimals)", "changeRound");
            }
        }
    }
}

function showForm(labelText, divId) {
    var div = document.createElement("div");
    div.className = "form-popup";
    div.id = divId;

    var label = document.createElement("label");
    label.innerHTML = labelText;

    var lineBreak = document.createElement("br");
    var lineBreak2 = document.createElement("br");

    var input = document.createElement("input");
    input.type = "text";
    input.id = "popupText";

    var error = document.createElement("p")
    error.id = "errorMessage";
    error.innerHTML = " "
    error.style.color = "red";
    error.style.margin = "0px";

    var button1 = document.createElement("button");
    button1.type = "button";
    button1.innerHTML = "OK";
    button1.id = "okButton";
    button1.addEventListener("click", okButtonPressed);
    button1.style.marginTop = "5px";
    button1.style.marginBottom = "0px";

    var button2 = document.createElement("button");
    button2.type = "button";
    button2.innerText = "Cancel";
    button2.id = "cancelButton";
    button2.addEventListener("click", cancelButtonPressed);
    button2.style.marginTop = "5px";
    button2.style.marginBottom = "0px";

    div.appendChild(label);
    div.appendChild(lineBreak);
    div.appendChild(lineBreak2);
    div.appendChild(input);
    div.appendChild(error);
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    //div.style.display = "block";
    input.focus();
}

function okButtonPressed() {
    var changeTime = document.getElementById("changeTime");
    var changeRound = document.getElementById("changeRound");
    var addPlayer = document.getElementById("addPlayer");
    var input = document.getElementById("popupText");
    var error = document.getElementById("errorMessage");
    var inputValue;

    if (changeTime != null) {
        inputValue = parseFloat(document.getElementById("popupText").value);

        if (isNaN(inputValue) || inputValue < 0.1 || inputValue > 60) {
            input.value = "";
            input.focus();
            error.innerHTML = "Invalid Entry!";
        } else {
            currentGameData.setTime(inputValue);
            //currentGameData.time = inputValue;
            display.updateDisplay(currentGameData);
            changeTime.remove();
        }
    } else if (changeRound != null) {

        inputValue = parseInt(document.getElementById("popupText").value,10);

        if (isNaN(inputValue) || inputValue < 1 || inputValue > 20 ||
            document.getElementById("popupText").value.indexOf(".") != -1) {
            input.value = "";
            input.focus();
            error.innerHTML = "Invalid Entry!";
        } else {
            currentGameData.round = inputValue;
            display.updateDisplay(currentGameData);
            changeRound.remove();
        }
    } else if (addPlayer != null) {
        var table = document.getElementById("players");
        var duplicate = false;
        var i;
        for (i = 0; i < table.rows.length; i++) {
            if (table.rows[i].cells[1].innerHTML == input.value) {
                duplicate = true;
            }
        }
        if (duplicate) {
            input.value = "";
            input.focus();
            error.innerHTML = "Player Already Exists!";
        } else {
            createPlayerRow(input);
        }
    }
}

function cancelButtonPressed() {
    var changeTime = document.getElementById("changeTime");
    var changeRound = document.getElementById("changeRound");
    var addPlayer = document.getElementById("addPlayer");

    if (changeTime != null) {
        changeTime.remove();
    } else if (changeRound != null) {
        changeRound.remove();
    } else if (addPlayer != null) {
        addPlayer.remove();
        document.getElementById("addPlayerButton").disabled = false;
    }
}

function setFullscreen() {
    var elem = document.getElementById("mainScreen");
    var form = document.getElementById("myForm")
    if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen(window.ALLOW_KEYBOARD_INPUT);
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function switchScreen() {
    var main = document.getElementById("mainScreen");
    var players = document.getElementById("playerScreen");
    if (main.style.display == "none") {
        main.style.display = "table";
        players.style.display = "none";
        currentGameData.updateCurrentGameData();
        display.updateDisplay(currentGameData);
    } else {
        main.style.display = "none";
        players.style.display = "table";
    }
}

//***************************************************
//
//  Home Screen Controls
//
//***************************************************
var timerId;
function startButtonPressed()
{
    var elem = document.getElementById("startButton");

    if (!buzzerBuzzing) {
        switch (currentGameData.state) {
            case NOT_STARTED:
                elem.innerHTML = "Pause";
                timerId = setInterval(timer, 1000);
                document.getElementById("addPlayerButton").disabled = true;
                currentGameData.state = RUNNING;
                break;
            case RUNNING:
                elem.innerHTML = "Continue";
                clearInterval(timerId);
                currentGameData.state = PAUSED;
                break;
            case PAUSED:
                elem.innerHTML = "Pause";
                timerId = setInterval(timer, 1000);
                currentGameData.state = RUNNING;
                break;
            case END_OF_ROUND:
                startNextRound();
                elem.innerHTML = "Pause";
                timerId = setInterval(timer, 1000);
                currentGameData.state = RUNNING;
                break;
        }
    }
}

//***************************************************
//
//  Players Screen Controls
//
//***************************************************
function addPlayer() {
    if (document.getElementById("popupText") == null) {
        document.getElementById("addPlayerButton").disabled = true;
        showForm("<b>Enter Name</b>", "addPlayer");
    }
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function createPlayerRow(input) {
    currentGameData.startingPlayers++;
    name = input.value;
    currentGameData.addPlayer(name);

    var table = document.getElementById("players");
    var row = table.insertRow();
    var playerPlace = row.insertCell(0);
    var playerName = row.insertCell(1);
    var playerRebuys = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    playerName.innerHTML = name;
    playerRebuys.innerHTML = 0;
    var addRebuyButton = document.createElement("button");
    addRebuyButton.className = "button-style3";
    addRebuyButton.onclick = function () { addRebuy(playerRebuys, playerName); };
    addRebuyButton.innerText = "Add Rebuy";
    cell4.appendChild(addRebuyButton);

    var removeButton = document.createElement("button");
    removeButton.className = "button-style3";
    removeButton.onclick = function () { removePlayer(row, removeButton); };
    removeButton.innerText = "Remove";
    cell5.appendChild(removeButton);

    input.value = "";
    input.focus();
}

function addRebuy(playerRebuys, playerName) {
    var player = currentGameData.getPlayerByName(playerName.innerHTML);
    if (player.rebuys < settings.maxRebuys) {
        player.rebuys++;
    } else {
        player.rebuys = 0;
    }
    playerRebuys.innerHTML = player.rebuys;
}

function removePlayer(row, removeButton) {
    var table = document.getElementById("players");
    var name = row.cells[1].innerHTML;
    var placeCell = row.cells[0];
    var player = currentGameData.getPlayerByName(name);
    if (currentGameData.state == NOT_STARTED) {
        table.deleteRow(row.rowIndex);
        currentGameData.startingPlayers--;
        currentGameData.removePlayer(name);
    } else {
        removeButton.disabled = true;
        player.place = currentGameData.playersLeft;
        player.eliminated = true;
        updatePlace(placeCell);
        currentGameData.playersLeft--;
    }

}

function updatePlace(place) {
    switch (currentGameData.playersLeft)
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
            place.innerHTML = currentGameData.playersLeft + "th";
            break;
    }
}