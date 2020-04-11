const joinRoom = (roomName, playerName) => {
    socket.emit('joinRoom', {
        roomName,
        playerName
    })
}

const requestMove = (oldX, oldY, newX, newY) => {
    socket.emit('move', {
        oldX,
        oldY,
        newX,
        newY
    })
}

const sendMessage = (text) => {
    console.log(`sending message ${text}`);
    socket.emit('message', {
        text
    })
}