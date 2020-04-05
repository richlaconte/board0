

let board = [];

const createBoard = () => {
    let width = 10;
    let height = 10;
    for (let i = 0; i < height; i++) {
        let boardRow = [];
        board.push(boardRow);
        let newRow = document.createElement('div');
        newRow.className = 'row';
        newRow.id = i;
        document.getElementById('board').appendChild(newRow);
        for (let x = 0; x < width; x++) {
            console.log('test')
            let newCol = document.createElement('div');
            let boardCol = [];
            newCol.className = 'col';
            newCol.id = x;
            newRow.appendChild(newCol);
            boardRow.push(boardCol);
        }
    }
}

createBoard();

const renderBoard = () => {
    for (let i = 0; i < 10; i++) {
        console.log(i);
        for (let x = 0; x < 10; x++) {
            console.log(x);
            console.log(board[i][x])
            if (board[i][x].id) {
                console.log(`creating at ${x} ${x}`)
                let col = document.getElementsByClassName('row')[i].childNodes[x];
                let unit = document.createElement('div');
                unit.className = 'unit';
                col.appendChild(unit);
            }
        }
    }
}

let testUnit = {
    idRef: 'test0'
}

const placeUnit = (newX, newY, oldX, oldY, id) => {
    let unit;
    if (!oldX && !oldY) {
        unit = document.createElement('div');
        unit.className = 'unit';
        unit.id = id;
        let row = document.getElementsByClassName('row')[newX];
        let col = row.childNodes[newY];
        col.appendChild(unit);
        unit.addEventListener('mousedown', (e) => {
            unit.classList.add('dragging');
            e.preventDefault();
        })
        unit.addEventListener('mousemove', (e) => {
            if (unit.classList.contains('dragging')) {
                unit.style.left = e.clientX - 20 + 'px';
                unit.style.top = e.clientY - 20 + 'px';
            }
        })
        unit.addEventListener('mouseup', (e) => {
            unit.classList.remove('dragging');
            unit.style.left = '';
            unit.style.top = '';
        })
        unit.addEventListener('mouseleave', () => {
            unit.classList.remove('dragging');
            unit.style.left = '';
            unit.style.top = '';
        })
    }
}

const getColByOffsets = (x, y) => {
    let cols = document.getElementsByClassName('col');
    for (col in cols) {
        let xDiff;
        let yDiff;
        if (x > col.offSetLeft) {
            xDiff = x - (col.offSetLeft + 20);
        } else {
            xDiff = (col.offSetLeft + 20) - x;
        }
        if (y > col.offSetTop) {
            yDiff = y - (col.offSetTop + 20);
        } else {
            yDiff = (col.offSetTop + 20) - y;
        }
        
        if (yDiff) {}
    }
}