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

const sendHeartbeat = (id) => {
    setTimeout(() => sendHeartbeat(id), 8000);
    io.to(id).emit('ping', { beat: 1 });
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
        io.to(room.name).emit('game', game.returnGame());
        io.to(room.name).emit('users', game.returnConnectedUsers());
        io.to(room.name).emit('chat',
            chat.newMessage(game.getPlayerNameByID(socket.id), `has joined the room.`)
        );
    })

    socket.on('message', (data) => {
        if (room) {
            io.to(room.name).emit('chat',
                chat.newMessage(game.getPlayerNameByID(socket.id), data.text)
            );
        }
    })

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`);
        if (game) {
            game.removePlayer(socket.id);
            io.to(room.name).emit('users', game.returnConnectedUsers());
        }
        if (room) {
            io.to(room.name).emit('chat',
                chat.newMessage(`A player has left the room.`)
            );
        }

    })

    socket.on('move', (data) => {
        console.log(socket.id, data);
        console.log('Is turn?:', game.checkTurn(socket.id));
        console.log(`turn: ${game.turn}`);
        if (game.checkTurn(socket.id)) {
            let move = game.moveUnit(socket.id, data.oldX, data.oldY, data.newX, data.newY);
            if (move.passed === true) {
                game.toggleTurn();
            } else if (move.code === 'notOwned') {
                io.to(socket.id).emit('statusMessage', chat.statusMessage(`That's not your unit.`));
            } else if (move.code === 'tooFar') {
                io.to(socket.id).emit('statusMessage', chat.statusMessage(`You can't move that far.`));
            }
        } else {
            io.to(socket.id).emit('statusMessage', chat.statusMessage(`It's not your turn.`));
        }
        io.to(room.name).emit('game', game.returnGame());
    })
    setTimeout(() => sendHeartbeat(socket.id), 8000);
});

const PORT = process.env.PORT || 3000;


http.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});