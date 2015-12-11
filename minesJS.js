//these are the global variables
var NONE = '0';
var MINE = '@';
var gBoard = [];
var gameOver = false;
var gTime = 0;
var gTimer = null;
var gFlags = 0;
var gLevel = 0;

function randomMines(level) {
    for (i = 0; i < parseInt(gBoard.length*level); i++) {
        positionI = parseInt(Math.random() * gBoard.length);
        positionJ = parseInt(Math.random() * gBoard.length);
        while (gBoard[positionI][positionJ] === MINE) {
        positionI = parseInt(Math.random() * gBoard.length);
        positionJ = parseInt(Math.random() * gBoard.length);
        }
        gBoard[positionI][positionJ] = MINE;
        //if (gBoard[positionI][positionJ] === NONE) {
        //    gBoard[positionI][positionJ] = MINE;
        //} else {
        //    i--
        //}
    }
}

function initGame (level, boardSize){
    document.getElementById("win/loss").style.visibility = "hidden";
    document.getElementById("win/loss").innerHTML = "";
    gameOver = false;
    gBoard = createBoard(boardSize);
    gLevel = level;
    randomMines(gLevel);
    hintCount();
    renderTable();
    showAvailableFlags(level);
    timerFunc();
}

function showAvailableFlags(level) {
    gFlags = parseInt(gBoard.length*level);
    document.querySelector('.flagsAvailable').innerHTML = gFlags;
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

function hintCount (){
    for (var i = 0; i< gBoard.length; i++){
        for (var j = 0; j< gBoard[i].length; j++){
            var currCell = gBoard[i][j];
            if (currCell ===MINE) continue;
            checkNegs(i,j);
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
            strHtml += '<td id="cell'+i+':'+ j+'" class="'+classname+'" oncontextmenu=" ' +
                         'rightClick(' + i + ',' + j + ');return false;" onclick="cellClicked(' + i + ',' + j + ')">'
                         +'</td>'
        }
        strHtml += '</tr>';
    }
    document.querySelector('.table').innerHTML = strHtml;
}

function cellClicked (i, j) {
    if (gameOver === true) return;
    var currentCell = document.getElementById('cell' + i + ':' + j + '');
    if (currentCell.classList.contains('flagged') || currentCell.classList.contains('revealed')) return;
    if (gBoard[i][j] > 0) { // if current cell isn't a 0 or a mine, reveal only specific cell
        var cellChecked = document.getElementById('cell' + i + ':' + j + '');
        cellChecked.innerHTML = gBoard[i][j];
        cellChecked.classList.add('revealed');
    } else if (gBoard[i][j] === MINE) { //check if current cell is a mine, if true reveals all
        document.getElementById('cell' + i + ':' + j + '').style.backgroundColor = "red";
        gameBlowout();
    } else { //if current cell is a 0, reveals +2 to all sides
       spreadOut(i,j);
    }
    checkWin(gLevel)
}

//this function flags a potential mine and makes it unclickable;
function rightClick (i,j) {
    if (gameOver === true) return;

    var currentCell = document.getElementById('cell'+ i + ':'+ j +'');
    if (currentCell.classList.contains('flagged')) {
        currentCell.classList.remove('flagged');
        gFlags++;
        document.querySelector('.flagsAvailable').innerHTML = gFlags;
    }else if(!currentCell.classList.contains('revealed')) {
        currentCell.classList.add('flagged');
        gFlags--;
        document.querySelector('.flagsAvailable').innerHTML = gFlags;
    }

}

function checkWin (level) {
    var minesInField = gBoard.length*level;
    var revealed     = document.querySelectorAll('.revealed').length;
    var total        = (gBoard.length * gBoard.length);
    if (revealed + minesInField ===total) {
        document.querySelector('h2').innerHTML = "Great Success!!";
        document.querySelector('h2').style.visibility = "visible";
        clearInterval(gTimer);
        gameOver = true;
    }
}

function timerFunc () {
    if (gTimer != null) {
        clearInterval(gTimer);
        gTime = -1;
    }
    gTimer = setInterval(function myTimer() {
        gTime += 1;
        document.querySelector('.seconds').innerHTML = gTime }, 1000);
}

function checkNegs (i,j) {
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

function gameBlowout() {
    var elMines = document.querySelectorAll('.mine');
    for (var i = 0; i< elMines.length; i++){
        elMines[i].classList.add('boom');
        gameOver = true;
        clearInterval(gTimer);
        document.querySelector('h2').innerHTML = "Game Over";
        document.querySelector('h2').style.visibility = "visible";
    }
}

function spreadOut(i,j) {
    for (var ii = -2; ii <= 2; ii++) {
        for (var jj = -2; jj <= 2; jj++) {
            currentI = i + ii;
            currentJ = j + jj;
            cellChecked = document.getElementById('cell' + currentI + ':' + currentJ + '');
            if (currentI < 0 || currentI >= gBoard.length) continue; //skips if exceeds boarders
            if (currentJ < 0 || currentJ >= gBoard.length) continue; //skips if exceeds boarders
            if (gBoard[currentI][currentJ] === MINE)continue; //skips if is a mine
            if (cellChecked.classList.contains('flagged'))continue; //skips if flagged
            if (gBoard[currentI][currentJ]) { //if current cell is a number write it to table
                cellChecked.innerHTML = gBoard[currentI][currentJ];
            }
            cellChecked.classList.add('revealed');
        }
    }
}