const NOT_STARTED = 0;
const RUNNING =     1;
const PAUSED =      2;
const END_OF_ROUND =3;

class CurrentGameData {
    PDC_BLINDS = [  "15 / 30",
                    "25 / 50",
                    "50 / 100",
                    "75 / 150",
                    "100 / 200",
                    "150 / 300",
                    "200 / 400",
                    "300 / 600",
                    "400 / 800",
                    "500 / 1000",
                    "600 / 1200"];
    
    constructor() {
        this._startingPlayers = 0;
        this._playersLeft = 0;
        this._totalChips;
        this._averageStack;
        this._seconds;
        this._pot;
        this._round = 1;
        this._blinds = this.PDC_BLINDS;
        this._state = NOT_STARTED;
        this._payouts = [ 0.0, 0.0, 0.0, 0.0 ];
        this._players = [];
    }

    get startingPlayers() { return this._startingPlayers; }
    set startingPlayers(startingPlayers) { this._startingPlayers = startingPlayers; }

    get playersLeft() { return this._playersLeft; }
    set playersLeft(playersLeft) { this._playersLeft = playersLeft; }

    get averageStack() { return this._averageStack; }
    set averageStack(averageStack) { this._averageStack = averageStack; }

    get totalChips() { return this._totalChips; }
    set totalChips(totalChips) { this._totalChips = totalChips; }

    get payouts() { return this._payouts; }
    set payouts(payouts) { this._payouts = payouts; }

    get pot() { return this._pot; }
    set pot(pot) { this._pot = pot; }

    get seconds() { return this._seconds; }
    set seconds(seconds) { this._seconds = seconds; }

    get round() { return this._round; }
    set round(round) { this._round = round; }

    get blinds() { return this._blinds; }
    set blinds(blinds) { this._blinds = blinds; }

    get state() { return this._state; }
    set state(state) { this._state = state; }

    addPlayer(name) {
        var player = new PlayerData(name);
        this._players.push(player);
    }

    removePlayer(name) {
        for (i = 0; i < this._players.length; i++) {
            if (this._players[i].name == name) {
                this._players.splice(i, 1);
            }
        }
    }

    getPlayerByName(name) {
        var i;
        for (i = 0; i < this._players.length; i++) {
            if (this._players[i].name == name) {
                return this._players[i];
            }
        }
    }


    getBlinds() {
        var extraRounds = this._round - this._blinds.length;
        if (this._round > this._blinds.length ) {
            return (600 + (extraRounds * 200) + " / " + (1200 + (extraRounds * 400)));
        } else {
            return this._blinds[this._round - 1];
        }
    }

    getNextBlinds() {
        var nextRound = this._round + 1;
        var extraRounds = nextRound - this._blinds.length;
        if (nextRound > this._blinds.length ) {
            return (600 + (extraRounds * 200) + " / " + (1200 + (extraRounds * 400)));
        } else {
            return this._blinds[nextRound - 1];
        }
    }

    nextRound() {
        this._round++;
    }

    getMinutes() {
        return Math.floor(this._seconds / 60);
    }

    getSeconds() {
        return this._seconds % 60;
    }

    resetTime() {
        if (settings.timeIsPerPlayer) {
            this._seconds = Math.min((this._playersLeft * settings.secondsPerPlayer), settings.maxSecondsPerRound);
        } else {
            this._seconds = settings.secondsPerRound;
        }
    }

    setTime(minutes) {
        this._seconds = minutes * 60;
    }

    reduceTime() {
        return this._seconds--;
    }

    setPayouts() {
        if (this._startingPlayers < settings.playersToPayout2nd) {
            this._payouts[0] = this._pot;
            this._payouts[1] = 0;
            this._payouts[2] = 0;
            this._payouts[3] = 0;
        } else if (this._startingPlayers < settings.playersToPayout3rd) {
            this._payouts[0] = this._pot * 0.6;
            this._payouts[1] = this._pot * 0.4;
            this._payouts[2] = 0;
            this._payouts[3] = 0;
        } else if (this._startingPlayers < settings.playersToPayout4th) {
            this._payouts[0] = this._pot * 0.5;
            this._payouts[1] = this._pot * 0.3;
            this._payouts[2] = this._pot * 0.2;
            this._payouts[3] = 0;
        } else if (this._startingPlayers < settings.playersToPayout2nd) {
            this._payouts[0] = this._pot * 0.5;
            this._payouts[1] = this._pot * 0.25;
            this._payouts[2] = this._pot * 0.15;
            this._payouts[3] = this._pot * 0.1;
        }
    }

    updateCurrentGameData()
    {
        var rebuyCount = 0;
        var i;

        for (i = 0; i < this._players.length; i++) {
            rebuyCount += this._players[i].rebuys;
        }

        if (this._state == NOT_STARTED) {
            //this._startingPlayers = this._playersLeft;
            // TODO: Add if to check if timeIsPerPlayer
            this._playersLeft = this._startingPlayers;
            this._seconds = this._startingPlayers * settings.secondsPerPlayer;
        }

        //this._playersLeft = this._startingPlayers;
        this._totalChips = (this._startingPlayers + rebuyCount) * settings.startingChips;
        this._averageStack = this._totalChips / this._playersLeft;
        this._pot = (this._startingPlayers + rebuyCount) * settings.buyinCost;

        this.setPayouts()
    }
}