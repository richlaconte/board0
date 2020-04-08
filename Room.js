const Game = require('./Game');

class Room {
    constructor(roomName, playerID, playerName) {
        this.name = roomName;
        this.game = new Game();
        this.game.addPlayer(playerID, playerName);
    }
}

module.exports = Room;