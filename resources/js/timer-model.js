import CurrentGameData from "/resources/js/current-game-data.js";

export default class Model {
    constructor() {
        this.currentGameData = new CurrentGameData();
    }
}