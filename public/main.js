

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

const addUnitToHand = () => {
    let unit;
    unit = document.createElement('div');
    unit.className = 'unit';
    document.getElementById('hand').appendChild(unit);
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
        if (getColByOffsets(e.clientX, e.clientY)) {
            let col = getColByOffsets(e.clientX, e.clientY);
            moveUnitByXY(unit, col.id, col.parentElement.id);
        }
    })
    unit.addEventListener('mouseleave', () => {
        unit.classList.remove('dragging');
        unit.style.left = '';
        unit.style.top = '';
    })
}

const placeUnit = (newX, newY, oldX, oldY, id) => {
    let unit;
    if (!oldX && !oldY) {
        unit = document.createElement('div');
        unit.className = 'unit';
        console.log(unit);
        if (id) {
            unit.id = id;
        }

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
            if (getColByOffsets(e.clientX, e.clientY)) {
                let col = getColByOffsets(e.clientX, e.clientY);
                moveUnitByXY(unit, col.id, col.parentElement.id);
            }
        })
        unit.addEventListener('mouseleave', () => {
            unit.classList.remove('dragging');
            unit.style.left = '';
            unit.style.top = '';
        })
    }
}

const clearCol = (x, y) => {
    let row = document.getElementsByClassName('row')[x];
    if (row.childNodes[y].childNodes.length > 0) {
        let col = row.childNodes[y];
        col.removeChild(col.childNodes[0]);
    }
}

const getColByOffsets = (x, y) => {
    let cols = document.getElementsByClassName('col');
    for (col in cols) {
        let xDiff;
        let yDiff;

        if (x > cols[col].offsetLeft) {
            xDiff = x - (cols[col].offsetLeft + 25);
        } else {
            xDiff = (cols[col].offsetLeft + 25) - x;
        }
        if (y > cols[col].offsetTop) {
            yDiff = y - (cols[col].offsetTop + 25);
        } else {
            yDiff = (cols[col].offsetTop + 25) - y;
        }

        if (yDiff < 25 && xDiff < 25) {
            return cols[col];
        }
    }
}

const moveUnitByXY = (unit, x, y) => {
    /*let rows = document.getElementsByClassName('row');
    let cols = rows[y].childNodes;
    for (let i = 0; i < cols.length; i++) {
        if (cols[i].id === x) {
            cols[i].appendChild(unit);
        }
    }*/
    requestMove(unit.parentElement.id, unit.parentElement.parentElement.id, x, y);
}

//placeUnit(0, 1, null, null, 'test')
addUnitToHand();