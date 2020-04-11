const Game = require('./Game');
const Chat = require('./Chat');

class Room {
    constructor(roomName, playerID, playerName) {
        this.name = roomName;
        this.game = new Game();
        this.chat = new Chat();
        this.game.addPlayer(playerID, playerName);
    }
}

module.exports = Room;