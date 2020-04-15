const Player = require('./Player');
const Unit = require('./Unit');

class Game {
    constructor() {
        this.players = [];
        this.spectators = [];
        this.turn = 0;
        this.board =
            [
                [null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null]
            ];
        this.addPlayer = (id, name) => {
            if (this.players.length < 2) {
                this.players.push(new Player(id, name));
                console.log('Players:');
                console.log(this.players);
            } else {
                this.spectators.push(new Player(id, name));
                console.log('Spectators:');
                console.log(this.spectators);
            }
        };
        this.removePlayer = (id) => {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].id === id) {
                    this.players.splice(i, 1);
                    console.log('Players:');
                    console.log(this.players);
                    return;
                }
            }
            for (let i = 0; i < this.spectators.length; i++) {
                if (this.spectators[i].id === id) {
                    this.spectators.splice(i, 1);
                    console.log('Spectators:');
                    console.log(this.spectators);
                    return;
                }
            }
        };
        this.getPlayerNameByID = (id) => {
            for (let i = 0; i < this.players.length; i++) {
                if (id === this.players[i].id) {
                    return this.players[i].name;
                }
            }
            for (let spectator in this.spectators) {
                if (id === this.spectators[spectator].id) {
                    return this.spectators[spectator].name;
                }
            }
        }
        this.returnConnectedUsers = () => {
            let connected = {
                players: [],
                spectators: []
            }
            for (let player in this.players) {
                connected.players.push(this.players[player].name);
            }
            for (let spectator in this.spectators) {
                connected.spectators.push(this.spectators[spectator].name);
            }
            return connected;
        }
        this.checkTurn = (id) => {
            if (!id) {
                return this.turn;
            } else {
                if (this.players[this.turn]) {
                    if (id === this.players[this.turn].id) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return false;
            }
        }
        this.getPlayerNameByTurn = () => {
            if (this.players[this.turn]) {
                return this.players[this.turn].name;
            } else {
                return 'player2';
            }
        }
        this.toggleTurn = () => {
            if (this.turn === 0) {
                this.turn = 1;
            } else {
                this.turn = 0;
            }
        }
        this.returnGame = () => {
            let obj = {
                board: this.board,
                turn: this.getPlayerNameByTurn()
            }

            return obj;
        }
        this.moveUnit = (playerID, oldX, oldY, newX, newY) => {
            let obj = {
                status: false,
                code: ''
            }

            if (oldX === 'hand') {
                if (this.board[newY][newX] === null) {
                    let obj = {
                        playerID,
                        type: 'unit'
                    }
                    this.board[newY][newX] = obj;
                    obj.status = true;
                    return obj;
                }
            } else {
                if (this.board[oldY][oldX].playerID === playerID) {
                    if (this.board[newY][newX] === null) {
                        this.board[oldY][oldX] = null;

                        let obj = {
                            playerID,
                            type: 'unit'
                        }
                        this.board[newY][newX] = obj;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    console.log('ERROR: unit not owned by player');
                    obj.status = false;
                    obj.code = 'notOwned';
                    return obj;
                }
            }
        }
    }
}

module.exports = Game;