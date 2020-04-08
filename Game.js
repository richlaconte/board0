const Player = require('./Player');

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
        },
            this.toggleTurn = () => {
                if (this.turn === 0) {
                    this.turn = 1;
                } else {
                    this.turn = 0;
                }
            }
    }
}

module.exports = Game;