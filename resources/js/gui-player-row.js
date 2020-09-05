export default class PlayerRow {
    constructor(name) {
        this._name = name;
        this._table = document.getElementById("playerTable");
        this._row = this.createElement("tr");
        this.place = this.createElement("td");
        this.player = this.createElement("td", {innerHTML: this._name});
        this.rebuys = this.createElement("td", {innerHTML: "0"})
        this._rebuyButtonCell = this.createElement("td");
        this._removeButtonCell = this.createElement("td");
        this.addRebuyButton = this.createElement("input", {type: "button",
                                                           value: "Add Rebuy",
                                                           className: "button-style3"});
        this.removeButton = this.createElement("input", {type: "button",
                                                        value: "Remove",
                                                        className: "button-style3"});
        this.constructRow();
    }

    createElement(tag, attributes={}) {
        const element = document.createElement(tag);

        Object.assign(element, attributes);

        return element;
    }

    constructRow() {
        this._table.appendChild(this._row);
        this._row.appendChild(this.place);
        this._row.appendChild(this.player);
        this._row.appendChild(this.rebuys);
        this._row.appendChild(this._rebuyButtonCell);
        this._row.appendChild(this._removeButtonCell);

        this._rebuyButtonCell.appendChild(this.addRebuyButton);
        this._removeButtonCell.appendChild(this.removeButton);
    }

    onAddRebuyButtonClick(handler) {
        this.addRebuyButton.addEventListener("click", function(event){handler(event)});
    }

    onRemoveButtonClick(handler) {
        this.removeButton.addEventListener("click", handler);
    }

    addRebuy() {
        var player = currentGameData.getPlayerByName(this._nameCell.innerHTML);
        if (player.rebuys < settings.maxRebuys) {
            player.rebuys++;
        } else {
            player.rebuys = 0;
        }
        this._rebuysCell.innerHTML = player.rebuys;
    }

    removePlayer() {
        var player = currentGameData.getPlayerByName(this._name);
        if (currentGameData.state == NOT_STARTED) {
            this._table.deleteRow(this._row.rowIndex);
            currentGameData.startingPlayers--;
            currentGameData.removePlayer(this._name);
        } else {
            this._removeButton.disabled = true;
            player.place = currentGameData.playersLeft;
            player.eliminated = true;
            updatePlace(this._placeCell);
            currentGameData.playersLeft--;
        }
    }
}
