class PlayerData {
    constructor(playerName) {
        this._name = playerName;
        this._rebuys = 0;
        this._bounties = 0;
        this._eliminated = false;
        this._place = 0;
    }

    get name() { return this._name; }
    set name(name) { this._name = name; }

    get rebuys() { return this._rebuys; }
    set rebuys(rebuys) { this._rebuys = rebuys; }

    get bounties() { return this._bounties; }
    set bounties(bounties) { this._bounties = bounties; }

    get eliminated() { return this._eliminated; }
    set eliminated(eliminated) { this._eliminated = eliminated; }

    get place() { return this._place; }
    set place(place) { this._place = place; }
}