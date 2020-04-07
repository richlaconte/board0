var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/js', (req, res) => {
    res.sendFile(__dirname + '/public/main.js');
})
app.get('/req', (req, res) => {
    res.sendFile(__dirname + '/public/req.js');
})
app.get('/res', (req, res) => {
    res.sendFile(__dirname + '/public/res.js');
})
app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/main.css');
})


class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.mana = 0;
    }
}


let game = {
    players: [],
    spectators: [],
    turn: 0,
    board:
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
        ],
    addPlayer: function (id, name) {
        if (this.players.length < 2) {
            this.players.push(new Player(id, name));
            console.log('Players:');
            console.log(this.players);
        } else {
            this.spectators.push(new Player(id, name));
            console.log('Spectators:');
            console.log(this.spectators);
        }
    },
    removePlayer: function (id) {
        for (player in this.players) {
            if (this.players[player].id === id) {
                this.players.splice(player, 1);
                console.log('Players:');
                console.log(this.players);
                return;
            }
        }
        for (player in this.spectators) {
            if (this.spectators[player].id === id) {
                this.spectators.splice(player, 1);
                console.log('Spectators:');
                console.log(this.spectators);
                return;
            }
        }
    },
    checkTurn: function (id) {
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
    toggleTurn: function () {
        if (this.turn === 0) {
            this.turn = 1;
        } else {
            this.turn = 0;
        }
    }
}

const move = (playerID, oldX, oldY, newX, newY) => {
    if (oldX === 'hand') {
        if (game.board[newY][newX] === null) {
            let obj = {
                playerID,
                type: 'unit'
            }
            game.board[newY][newX] = obj;
            return true;
        }
    } else {
        if (game.board[oldY][oldX].playerID === playerID) {
            if (game.board[newY][newX] === null) {
                game.board[oldY][oldX] = null;

                let obj = {
                    playerID,
                    type: 'unit'
                }
                game.board[newY][newX] = obj;
                return true;
            } else {
                return false;
            }
        } else {
            console.log('ERROR: unit not owned by player');
            return false;
        }
    }


}

let sendHeartbeat = () => {
    setTimeout(sendHeartbeat, 8000);
    io.emit('ping', {beat: 1 });
}

io.on('connection', (socket) => {
    // Log connected player
    console.log(`user ${socket.id} connected`);

    // Add player to game/spectate
    game.addPlayer(socket.id, 'test');

    io.emit('board', game.board);

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`);
        game.removePlayer(socket.id);
    })

    socket.on('move', (data) => {
        console.log(socket.id, data);
        console.log('Is turn?:', game.checkTurn(socket.id));
        console.log(`turn: ${game.turn}`);
        if (game.checkTurn(socket.id)) {
            if (move(socket.id, data.oldX, data.oldY, data.newX, data.newY)) {
                game.toggleTurn();
            }
        }
        io.emit('board', game.board);
    })
    setTimeout(sendHeartbeat, 8000);
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});