
export default class Popup {
    constructor(labelText, divId) {
        this.div = this.createElement("div", {className: "popup",
                                              id: divId});

        this.label = this.createElement("label", {innerHTML: labelText});

        this.br1 = this.createElement("br");
        this.br2 = this.createElement("br");

        this.input = this.createElement("input", {type: "text",
                                                  id: "popupText"});

        this.error = this.createElement("p", {id: "errorMessage"});

        this.okButton = this.createElement("input", {type: "button",
                                                     value: "OK",
                                                     id: "okButton"});

        this.cancelButton = this.createElement("input", {type: "button",
                                                         value: "Cancel",
                                                         id: "cancelButton"});

        this.constructPopup();
    }

    constructPopup() {
        for (var object of Object.values(this)) {
            // Append to the div unless current element is div
            if (object.className != "popup") {
                this.div.appendChild(object);
            }
        }
        document.body.appendChild(this.div);
        //this.okButton.addEventListener("click", this.okButtonPressed.bind(this));
        //this.cancelButton.addEventListener("click", this.cancelButtonPressed);
        this.input.focus();
    }

    createElement(tag, attributes={}) {
        const element = document.createElement(tag);

        Object.assign(element, attributes);

        return element;
    }

    onOkButtonClick(handler) {
        const input = this.input;
        const divId = this.div.id;
        this.okButton.addEventListener("click", function(){handler(input, divId)});
    }

    onCancelButtonClick(handler) {
        this.cancelButton.addEventListener("click", handler);
    }

    remove() {
        this.div.remove();
    }

    okButtonPressed() {
        var changeTime = document.getElementById("changeTime");
        var changeRound = document.getElementById("changeRound");
        var addPlayer = document.getElementById("addPlayer");
        var input = document.getElementById("popupText");
        var error = document.getElementById("errorMessage");
        var inputValue;
    
        if (changeTime != null) {
            inputValue = parseFloat(input.value);
    
            if (isNaN(inputValue) || inputValue < 0.1 || inputValue > 60) {
                input.value = "";
                input.focus();
                error.innerHTML = "Invalid Entry!";
            } else {
                currentGameData.setTime(inputValue);
                display.updateDisplay(currentGameData);
                changeTime.remove();
            }
        } else if (changeRound != null) {
    
            inputValue = parseInt(input.value,10);
    
            if (isNaN(inputValue) || inputValue < 1 || inputValue > 20 ||
                input.value.indexOf(".") != -1) {
                input.value = "";
                input.focus();
                error.innerHTML = "Invalid Entry!";
            } else {
                currentGameData.round = inputValue;
                display.updateDisplay(currentGameData);
                changeRound.remove();
            }
        } else if (addPlayer != null) {
            var table = document.getElementById("playerTable");
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
                this.createPlayerRow(input);
            }
        }
    }
    
    cancelButtonPressed() {
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
}