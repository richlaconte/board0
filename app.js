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

let board = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, { type: 'unit' }, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]
]

const move = (oldX, oldY, newX, newY) => {
    if (board[newY][newX] === null) {
        if (oldX === 'hand') {
        } else {
            board[oldY][oldX] = null;
        }
        let obj = {
            type: 'unit'
        }
        board[newY][newX] = obj;
    }
}

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('board', board);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
    socket.on('move', (data) => {
        console.log(data);
        move(data.oldX, data.oldY, data.newX, data.newY);
        io.emit('board', board);
    })
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});