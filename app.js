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
const assignRoom = (roomName, playerID, playerName, socket) => {
    if (rooms.length > 0) {
        console.log('rooms.length > 0')
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].name === roomName) {
                rooms[i].game.addPlayer(playerID, playerName);
                socket.join(roomName);
                return rooms[i];
            }
        }
        console.log('didnt find existing room')
        let room = new Room(roomName, playerID, playerName);
        rooms.push(room);
        socket.join(roomName);
        return rooms[rooms.length - 1];
    } else {
        console.log('no rooms found')
        let room = new Room(roomName, playerID, playerName);
        rooms.push(room);
        socket.join(roomName);
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
    let chat;
    socket.on('joinRoom', (data) => {
        console.log('joinRoom request received');
        room = assignRoom(data.roomName, socket.id, data.playerName, socket);
        //console.log(room);
        game = room.game;
        chat = room.chat;
        io.to(room.name).emit('board', game.board);
        io.to(room.name).emit('chat',
            chat.newMessage(game.getPlayerNameByID(socket.id), `has joined the room.`)
        );
    })

    socket.on('message', (data) => {
        console.log(`sending message ${data}`)
        io.to(room.name).emit('chat',
            chat.newMessage(game.getPlayerNameByID(socket.id), data.text)
        );
    })

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`);
        if (game) {
            game.removePlayer(socket.id);
        }
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
        io.to(room.name).emit('board', game.board);
    })
    setTimeout(sendHeartbeat, 8000);
});

const PORT = process.env.PORT || 3000;


http.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});