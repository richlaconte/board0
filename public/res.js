socket.on('game', (game) => {
    hideRoomOptions();
    showGameStats();
    console.log('updating board');
    console.log(game);
    updateBoard(game.board);
    updateTurnDisplay(game.turn);
})

socket.on('ping', () => {
    console.log('ping');
})

socket.on('chat', (message) => {
    console.log(message);
    appendChatMessage(message);
})

socket.on('statusMessage', (message) => {
    appendChatMessage(message, 'status');
})

socket.on('users', (users) => {
    console.log(users);
    updateUsers(users);
})

// Change this to clear all then add
const updateBoard = (newBoard) => {
    if (board.length > 0) {
        for (let i = 0; i < newBoard.length; i++) {
            for (let x = 0; x < newBoard[i].length; x++) {
                clearCol(i, x);
                if (newBoard[i][x] !== null) {
                    placeUnit(i, x, null, null, 'test');
                }
            }
        }
    } else {
        createBoard();
        showHand();
        updateBoard(newBoard);
    }
}