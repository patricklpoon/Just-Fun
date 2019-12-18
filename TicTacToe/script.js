var origBoard;
/*shows what is on the board(table), in this example:empty, X, or O*/
const huPlayer = '0';
/*Human Plater*/
const aiPlayer = 'X';
/*AI*/
const winCombos = [
 [0,1,2],
 [3,4,5],
 [6,7,8],
 [0,3,6],
 [1,4,7],
 [2,5,8],
 [0,1,2],
 [0,4,8],
 [2,4,6] 
];
/*Conditions of cells within array for "Win"*/

const cells = document.querySelectorAll('.cell');
/*const cells will store a reference to each class named "cell" */
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none" 
	/*Starts the program with endgame display box set to none as it will be showing
 after every round*/
	origBoard = Array.from(Array(9).keys());
	/*fancy way to make an array of 9 elements 0-8*/
	for (var i=0; i < cells.length; i++) {
		cells[i].innerText = '';
		/*sets inner text, in this case it is set to nothing*/
		cells[i].style.removeProperty('background-color');
		/*removes background color due to game end results: win, lose, or tie*/
		cells[i].addEventListener('click', turnClick, false);
		/*any time 'cells' is clicked, turnClick function is activiated*/
	}
}


function turnClick(square) {
	/*console.log(square.target.id)
	shows in console component clicked*/
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer);
	if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).textContent = player;
	/*selects an element with an id,sets text to player*/
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	/*passing in paramter reference 'board' referring to a similar but
	different aspect than origBoard*/
	let plays = board.reduce((a, e, i) =>
	/*lets plays shoews each index the player has played in*/
	/*a - accumulator, e - element, i - index*/
	(e === player) ? a.concat(i) : a, []);
	/*if the element is equal to the player? concat index 
	with accumulator : if not, add accumulator(with nothing)*/
	let gameWon = null;
	/*Set default for game Win/Lose status to null*/
	for (let [index, win] of winCombos.entries()) {
		/*for the for loop we will need the index of the wins [index,win]*/
		if (win.every(elem=> plays.indexOf(elem) > -1)){
			/*win.every means we go through every element in 'win' array*/
			gameWon = {index: index, player: player};
			/*ref to what element player won in, ref to which player won*/
			break;
	 } 
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		/*index refers to winning combo*/
		document.getElementById(index).style.backgroundColor
		/*grabbing index from win combo*/
		 gameWon.player == huPlayer ? "blue" : "red";
		 /*whether huPlayer or other, blue or red*/
	}
	for (var i=0; i< cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false)
		/*makes EventListener unclickable*/
	}
	declareWinner(gameWon.player ==huPlayer ? "You win!" : "You lose.")
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number')
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i=0;i<cells.length;i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick,false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard);

	if(checkWin(newBoard, player)) {
		return {score:-10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score:0};
	}
	var moves = [];
	for (var i = 0; i <availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player ==aiPlayer) {
			var result =minimax (newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}



	var bestMove;
	if(player ===aiPlayer) {
		var bestScore = -10000;
		for(var i=0; i<moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i
			}
		}
	} else {
		var bestScore = 10000;
		for(var i=0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i
			}
		}
	}

	return moves[bestMove];
}