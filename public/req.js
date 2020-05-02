const joinRoom = (roomName, playerName) => {
    socket.emit('joinRoom', {
        roomName,
        playerName
    })
}

const requestMove = (oldX, oldY, newX, newY) => {
    // Check to make sure the move request isn't to the current position
    if (oldX !== newX || oldY !== newY) {
        socket.emit('move', {
            oldX,
            oldY,
            newX,
            newY
        })
    }
}

const sendMessage = (text) => {
    console.log(`sending message ${text}`);
    socket.emit('message', {
        text
    })
}