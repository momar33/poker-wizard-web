class Display {
    constructor() {
        this._playersLeft = document.getElementById("playersLeft");
        this._averageStack = document.getElementById("averageStack");;
        this._totalChips = document.getElementById("totalChips");;
        this._payout1st = document.getElementById("payout1st");;
        this._payout2nd = document.getElementById("payout2nd");;
        this._payout3rd = document.getElementById("payout3rd");;
        this._payout4th = document.getElementById("payout4th");;
        this._pot = document.getElementById("pot");;
        this._time = document.getElementById("time");;
        this._currentRound = document.getElementById("currentRound");;
        this._currentBlinds = document.getElementById("currentBlinds");;
        this._nextBlinds = document.getElementById("nextBlinds");;
    }

    updateDisplay(gameData) {
        this._playersLeft.innerHTML = gameData.playersLeft;
        this._averageStack.innerHTML = gameData.averageStack;
        this._totalChips.innerHTML = gameData.totalChips;
        this._payout1st.innerHTML = "$" + gameData.payouts[0];
        this._payout2nd.innerHTML = "$" + gameData.payouts[1];
        this._payout3rd.innerHTML = "$" + gameData.payouts[2];
        this._payout4th.innerHTML = "$" + gameData.payouts[3];
        this._pot.innerHTML = "$" + gameData.pot;
        this._time.innerHTML = this.formatTime(gameData.getMinutes(), gameData.getSeconds());
        this._currentRound.innerHTML = "Round " + gameData.round;
        this._currentBlinds.innerHTML = gameData.getBlinds();
        this._nextBlinds.innerHTML = gameData.getNextBlinds();
    }

    updateTime(gameData) {
        this._time.innerHTML = this.formatTime(gameData.getMinutes(), gameData.getSeconds());
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
}