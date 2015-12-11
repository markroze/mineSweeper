var checkedItems = 0;
var NONE = '0';
var MINE = '@';
var gBoard = [];

//
//gBoard = createBoard(8);
//randomMines();
//hintCount();
//renderTable();

initiGame()
function initiGame (){
    var boardSize = '';
    while (boardSize < 3 || boardSize > 20 || isNaN(boardSize)) {
        boardSize = prompt('what size would you like? to quit ESC: ');
        if (boardSize === null) return;
    }
    gBoard = createBoard(boardSize);
    randomMines();
    hintCount();
    renderTable()
}



function createBoard (boardSize) {
    var board = [];
    for (var i =0; i < boardSize; i++) {
        var row = [];
        for (var j=0; j <boardSize; j++) {
            row.push(NONE);
        }
        board.push(row);
    }
    return board;
}

function renderBoard (){
    for (var i = 0; i< gBoard.length; i++){
        for (var j = 0; j< gBoard[i].length; j++){
            document.write(gBoard[i][j])
        }
        //document.write('</br>')
    }
}

function hintCount (){
    for (var i = 0; i< gBoard.length; i++){
        for (var j = 0; j< gBoard[i].length; j++){
            var currCell = gBoard[i][j];

            if (currCell ===MINE) continue;

            var mineCount = 0;
            for (var ii = -1; ii<= 1; ii++){
                for (var jj = -1; jj<= 1; jj++){
                    currI = i + ii;
                    currJ = j + jj;
                    //if ()
                    if (currI < 0 || currI >= gBoard.length) continue;
                    if (currJ < 0 || currJ >= gBoard.length) continue;
                    if (ii === 0 && jj === 0) continue;
                    if (gBoard[currI][currJ] === MINE ) {
                        mineCount++;
                    }
                }
                gBoard[i][j] = mineCount;
            }
        }
    }

}

function renderTable () {
    var strHtml = '';
    for (var i = 0; i< gBoard.length; i++){
        strHtml += '<tr>';

        for (var j = 0; j< gBoard[i].length; j++){
            var position = gBoard[i][j];
            var classname='';

            if (position === MINE) {
                classname = 'mine';
            }
            strHtml += '<td id="'+i+':'+ j+'" class="'+classname+'" oncontextmenu=" ' +
                'rightClick(' + i + ',' + j + ');return false;" onclick="cellClicked(' + i + ',' + j + ')">';
            +'</td>'
        }
        strHtml += '</tr>';
    }
    document.querySelector('.table').innerHTML = strHtml;
}


function cellClicked (i, j) {
    var currentCell = document.getElementById('' + i + ':' + j + '');
    if (currentCell.classList.contains('flagged') || currentCell.classList.contains('revealed')) return;
    if (gBoard[i][j] > 0) {
        var cellChecked = document.getElementById('' + i + ':' + j + '');
        cellChecked.innerHTML = gBoard[i][j];
        cellChecked.classList.add('revealed');
    } else if (gBoard[i][j] === MINE) {
        var elMines = document.querySelectorAll('.mine');
        for (var k = 0; k< elMines.length; k++){
            elMines[k].classList.add('boom')
        }
        alert('Game Over');
        var replay = confirm('would you like to play again?');
        if (replay === true){
            initiGame();
        }
    } else {
        testing(i,j)
        function testing(i,j) {
            for (var ii = -1; ii <= 1; ii++) {
                for (var jj = -1; jj <= 1; jj++) {
                    var currentI = i + ii;
                    var currentJ = j + jj;
                    var newI = currentI;
                    var newJ = currentJ;
                    cellChecked = document.getElementById('' + currentI + ':' + currentJ + '');
                    if (currentI < 0 || currentI >= gBoard.length) continue;
                    if (currentJ < 0 || currentJ >= gBoard.length) continue;
                    if (gBoard[currentI][currentJ] === MINE)continue;
                    if (cellChecked.classList.contains('flagged'))continue;
                    if (gBoard[currentI][currentJ]) {
                        cellChecked.classList.add('revealed');
                        cellChecked.innerHTML = gBoard[currentI][currentJ];

                    }
                    if (gBoard[currentI][currentJ] === 0) {
                        cellChecked = document.getElementById('' + currentI + ':' + currentJ + '');
                        cellChecked.classList.add('revealed');
                        testing(newI,newJ);
                    }
            }
            }
        }
    }
    checkWin()
}
//this function flags a potential mine and makes it unclickable;
function rightClick (i,j) {
    var currentCell = document.getElementById(''+ i + ':'+ j +'');
    if (currentCell.classList.contains('flagged')) {
        currentCell.classList.remove('flagged')
    }else if (!currentCell.classList.contains('revealed')) {
        currentCell.classList.add('flagged');
    }

}

function checkWin () {
    var minesInField = gBoard.length;
    var revealed = document.querySelectorAll('.revealed').length;
    var total = (gBoard.length * gBoard.length);
    if (revealed + minesInField ===total) {
        console.log('You won')
    }
}

function randomMines () {
    var level = prompt('at what level for 1-3?');
    while (level > 3 || level < 1 || isNaN(level)) {
        level = prompt('at what level for 1-3? ');
    }
    if (level === null) return;

    if (level === '1') {
        for (i = 0; i < parseInt(gBoard.length); i++) {
            positionI = parseInt(Math.random() * gBoard.length);
            positionJ = parseInt(Math.random() * gBoard.length);
            if (gBoard[positionI][positionJ] === NONE) {
                gBoard[positionI][positionJ] = MINE;
            } else {
                i--
            }
        }

    }else if(level === '2') {
        for (i = 0; i < parseInt(gBoard.length*1.5); i++) {
            positionI = parseInt(Math.random() * gBoard.length);
            positionJ = parseInt(Math.random() * gBoard.length);
            if (gBoard[positionI][positionJ] === NONE) {
                gBoard[positionI][positionJ] = MINE;
            } else {
                i--;
            }
        }

    }else if (level === '3') {
        for (i = 0; i < parseInt((gBoard.length*gBoard.length)/2); i++) {
            positionI = parseInt(Math.random() * gBoard.length);
            positionJ = parseInt(Math.random() * gBoard.length);
            if (gBoard[positionI][positionJ] === NONE) {
                gBoard[positionI][positionJ] = MINE;
            } else {
                i--;
            }
        }
    }

}