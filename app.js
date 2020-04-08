var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const Room = require('./Room');

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

let rooms = [];
const assignRoom = (roomName, playerID, playerName) => {
    if (rooms.length > 0) {
        for (room in rooms) {
            if (rooms[room].name === roomName) {
                rooms[room].game.addPlayer(playerID, playerName);
                return rooms[room];
            }
        }
    } else {
        let room = new Room(roomName, playerID, playerName);
        rooms.push(room);
        return rooms[0];
    }
}

const move = (game, playerID, oldX, oldY, newX, newY) => {
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
    io.emit('ping', { beat: 1 });
}

io.on('connection', (socket) => {
    // Log connected player
    console.log(`user ${socket.id} connected`);



    //let game = createGame();

    // Add player to game/spectate
    //game.addPlayer(socket.id, 'test');    
    let room;
    let game;
    socket.on('joinRoom', (data) => {
        console.log('joinRoom request received');
        room = assignRoom(data.roomName, socket.id, data.playerName);
        game = room.game;
        io.emit('board', game.board);
    })

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`);
        game.removePlayer(socket.id);
    })

    socket.on('move', (data) => {
        console.log(socket.id, data);
        console.log('Is turn?:', game.checkTurn(socket.id));
        console.log(`turn: ${game.turn}`);
        if (game.checkTurn(socket.id)) {
            if (move(game, socket.id, data.oldX, data.oldY, data.newX, data.newY)) {
                game.toggleTurn();
            }
        }
        io.emit('board', game.board);
    })
    setTimeout(sendHeartbeat, 8000);
});

const PORT = process.env.PORT || 3000;


http.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});