//const { default: Popup } = require("./gui-popup");
import Popup from "/resources/js/gui-popup.js";
import PlayerRow from "/resources/js/gui-player-row.js";

const chipInfoText = ["Players Left", "0", "Average Stack", "0", "Total Chips", "0"];
const placeInfoText = [["1st", "$0"], ["2nd", "$0"], ["3rd", "$0"], ["4th", "$0"], ["Pot", "$0"]];
const playerTableHeaders = [["Place", "Player", "Rebuys", "", ""]];
export default class View {
    constructor() {
        // Create homeTable
        this.div = this.createElement("div");
        this.homeScreen = this.createHomeTable();
        this.div.appendChild(this.homeScreen);

        // Create playerTable
        this.playersScreen = this.createPlayersTable();
        this.div.appendChild(this.playersScreen);

        document.body.appendChild(this.div);

    }

    onStartButtonClick(handler) {
        this.startButton.addEventListener("click", handler);
    }

    onPlayersScreenButtonClick(handler) {
        this.playersScreenButton.addEventListener("click", handler);
    }

    onHomeScreenButtonClick(handler) {
        this.homeScreenButton.addEventListener("click", handler);
    }

    onAddPlayerButtonClick(handler) {
        this.addPlayerButton.addEventListener("click", handler);
    }

    createElement(tag, attributes={}) {
        const element = document.createElement(tag);

        Object.assign(element, attributes);

        return element;
    }

    createHomeTable() {
        let table = this.createTable(3, 3);
        table.id = "homeScreen";

        // Row 1
        table.rows[0].id = "hsRow1";
        this.chipInfoTable = this.createTable(6, 1);
        this.chipInfoTable.id = "chipInfoTable";
        this.playersLeft = this.chipInfoTable.rows[1].cells[0];
        this.playersLeft.id = "playersLeft";
        this.averageStack = this.chipInfoTable.rows[3].cells[0];
        this.averageStack.id = "averageChips";
        this.totalChips = this.chipInfoTable.rows[5].cells[0];
        this.totalChips.id = "totalChips";

        this.fillTable(this.chipInfoTable, chipInfoText);
        table.rows[0].cells[0].appendChild(this.chipInfoTable);

        this.startButton = this.createElement("input", {type: "button",
                                                        value: "Start",
                                                        class: "button-style1",
                                                        id: "startButton"});

        this.playersScreenButton = this.createElement("input", {type: "button",
                                                                value: "Players Screen",
                                                                class: "button-style1",
                                                                id: "playersScreenButton"});

        table.rows[0].cells[1].appendChild(this.startButton);
        table.rows[0].cells[1].appendChild(document.createElement("br"));
        table.rows[0].cells[1].appendChild(document.createElement("br"));
        table.rows[0].cells[1].appendChild(this.playersScreenButton);

        this.placeInfoTable = this.createTable(5, 2);
        this.placeInfoTable.id = "placeInfoTable";
        this.fillTable(this.placeInfoTable, placeInfoText);
        this.payout1st = this.placeInfoTable.rows[0].cells[1];
        this.payout2nd = this.placeInfoTable.rows[1].cells[1];
        this.payout3rd = this.placeInfoTable.rows[2].cells[1];
        this.payout4th = this.placeInfoTable.rows[3].cells[1];
        this.pot = this.placeInfoTable.rows[4].cells[1];
        table.rows[0].cells[2].appendChild(this.placeInfoTable);

        // Row 2
        table.rows[1].deleteCell(2);
        table.rows[1].deleteCell(1);
        table.rows[1].cells[0].colSpan = 3;
        this.timeTable = this.createTable(1, 1);
        this.time = this.timeTable.rows[0].cells[0];
        this.time.innerHTML = "0:00";
        table.rows[1].cells[0].appendChild(this.timeTable);

        // Row 3
        this.currentRoundTable = this.createTable(2, 1);
        this.currentRound = this.currentRoundTable.rows[0].cells[0];
        this.currentBlinds = this.currentRoundTable.rows[1].cells[0];
        this.currentRound.innerHTML = "Round 1";
        this.currentBlinds.innerHTML = "15 / 30";
        table.rows[2].cells[1].appendChild(this.currentRoundTable );
        this.nextRoundTable = this.createTable(2, 1);
        this.nextBlinds = this.nextRoundTable.rows[1].cells[0];
        this.nextRoundTable.rows[0].cells[0].innerHTML = "Next Round";
        this.nextBlinds.innerHTML = "25 / 50";
        table.rows[2].cells[2].appendChild(this.nextRoundTable);

        return table;
    }

    createPlayersTable() {
        let table = this.createTable(2, 2);
        table.id = "playersScreen";

        this.homeScreenButton = this.createElement("input", {type: "button",
                                                             value: "Home Screen",
                                                             class: "button-style2",
                                                             id: "homeScreenButton"});

        this.addPlayerButton = this.createElement("input", {type: "button",
                                                            value: "Add Player",
                                                            class: "button-style2",
                                                            id: "addPlayerButton"});

        table.rows[0].cells[0].appendChild(this.homeScreenButton);
        table.rows[0].cells[1].appendChild(this.addPlayerButton);

        table.rows[1].deleteCell(1);
        table.rows[1].cells[0].colSpan = 2;

        this.playerTable = this.createTable(1, 5);
        this.playerTable.id = "playerTable";
        this.fillTable(this.playerTable, playerTableHeaders)
        table.rows[1].cells[0].appendChild(this.playerTable);

        return table;
    }

    createTable(numRows, numColumns) {
        let table = document.createElement("table");
    
        for (let r = 0; r < numRows; r++) {
            let row = document.createElement("tr");
            for (let c = 0; c < numColumns; c++) {
                let col = document.createElement("td");
                //col.innerHTML = "test";
                row.appendChild(col);
            }
            table.appendChild(row);
        }
    
        return table;
    }

    fillTable(table, array) {
        for (const [rowIndex, row] of array.entries()) {
            if (table.rows[0].cells.length > 1) {
                for (const [cellIndex, cell] of array[rowIndex].entries()){
                    console.log(cell);
                    table.rows[rowIndex].cells[cellIndex].innerHTML = cell;
                }
            }
            else {
                table.rows[rowIndex].cells[0].innerHTML = row;
            }
        }
    }

    createPopup(labelText, divId) {
        this.popup = new Popup(labelText, divId);
    }

    createPlayerRow(input) {    
        let row = new PlayerRow(input.value);
    
        input.value = "";
        input.focus();

        return row;
    }
}