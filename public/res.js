socket.on('board', (board) => {
    console.log('unpdating board');
    updateBoard(board);
})

// Change this to clear all then add
const updateBoard = (board) => {
    for (let i = 0; i < board.length; i++) {
        for (let x = 0; x < board[i].length; x++) {
            clearCol(i, x);
            if (board[i][x] !== null) {
                placeUnit(i, x, null, null, 'test');
            }
        }
    }
}