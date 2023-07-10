/*
 * Utilities
 */
//always returns a random number between min (included) and max (excluded)
function getRndInteger(min, max)
{
  return Math.floor(Math.random() * (max - min) ) + min;
}

/*
 * MineSweeper classes
 */
class MineSweeperCell
{
	constructor(row, col, val)
	{
		this.row = row;
		this.column = col;
		this.value = val;
		this.clicked = false;
	}

	static compareCells(cell1, cell2)
	{
		return cell1.row == cell2.row && cell1.column == cell2.column && cell1.value == cell2.value;
	}
}

class MineSweeperBoard
{
	constructor(row, col, mines)
	{
		//ToDo: validate
		this.rowSize = parseInt(row);
		this.colSize = parseInt(col);
		this.numMines = parseInt(mines);
		this.board = new Array();
		for(var i=0; i<this.rowSize; i++)
		{
			this.board[i] = new Array();
			for(var j=0; j<this.colSize; j++)
			{
				this.board[i][j] = new MineSweeperCell(i,j,values.BLANK)
			}
		}
	}

	getValue(i, j)
	{
		//ToDo: validate
		return this.board[i][j].value;
	}

	getClicked(i,j)
	{
		//ToDo: validate
		return this.board[i][j].clicked;
	}

	setValue(i,j,val)
	{
		//this.board[val.getRow()][val.getColumn()].setValue(val.getValue());
		//logEvent("in board.setValue(). this:"+this+". ij:"+i+j+". this.board[i][j].value"+this.board[i][j].value+". val:"+val);
		this.board[i][j].value = val;
	}

	setClicked(i,j,val)
	{
		this.board[i][j].clicked = val;
	}
}

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function prueba() {
  //console.log("Start");

  await sleep(500);

  //console.log("End");
}


/*
 * Interface to the minesweeper online game http://minesweeperonline.com/
 */

//available events to be simulated by simulateEvent
var eventMatchers = {
'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}

//default options used by simulateEvent function
var defaultOptions = {
	pointerX: 0,
	pointerY: 0,
	button: 0,
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false,
	bubbles: true,
	cancelable: true
}

//get value of i,j
function getValue(i,j)
{
	var c = document.getElementById(i+"_"+j).className;
	var num;

	switch(c)
	{
		case "square open0": num = values.OPEN0; break; //open cell value 0
		case "square open1": num = values.OPEN1; break; //open cell value 1
		case "square open2": num = values.OPEN2; break; //open cell value 2
		case "square open3": num = values.OPEN3; break; //open cell value 3
		case "square open4": num = values.OPEN4; break; //open cell value 4
		case "square open5": num = values.OPEN5; break; //open cell value 5
		case "square open6": num = values.OPEN6; break; //open cell value 6
		case "square open7": num = values.OPEN7; break; //open cell value 7
		case "square open8": num = values.OPEN8; break; //open cell value 8
		case "square blank": num = values.BLANK; break; //closed cell
		case "square bombflagged": num = values.BOMBFLAGGED; break; //flagged cell
		case "square bombdeath": num = values.BOMBDEATH; break; //lost by clicking here
		case "square bombrevealed": num = values.BOMBREVEALED; break; //lost, so showing all bombs
		default: num = -1000; //'?' or any other values not used
	}
	return num;
}

function openIJ(i,j)
{
	var e = document.getElementById(i+"_"+j);
	if(e.className == "square blank")
	{
		myClick(e, "right");
	}
	return e.className;
}

function toggleFlagIJ(i,j)
{
	var e = document.getElementById(i+"_"+j);
	var value = getValue(i,j);

	if(value == -1 || value == -2)
	{
		myClick(e, "left");
	}
	
	return e.className;
}

function revealNeighborsIJ(i,j)
{
	var e = document.getElementById(i+"_"+j);
	if(getValue(i,j) >= 1 && getValue(i,j) <= 8)
	{
		myClick(e, "both");
	}
	return e.className;
}

function newGame()
{
	var e = document.getElementById("face");
	myClick(e, "right");
	numGames++;
	//logEvent("New Game "+ (numGames));
}

//wrapper for simulateEvent function to simulate a full click on an element
//b should contain values: "right", "left" or "both" (not necessarily "both")
function myClick(element, b)
{
	simulateEvent(element, "mouseover", { button: (b=="right"?0:(b=="left"?2:1)) });
	simulateEvent(element, "mousedown", { button: (b=="right"?0:(b=="left"?2:1)) });
	simulateEvent(element, 'mouseup',   { button: (b=="right"?0:(b=="left"?2:1)) });
	simulateEvent(element, "click",     { button: (b=="right"?0:(b=="left"?2:1)) });
}

//will simulate the event on the element
function simulateEvent(element, eventName)
{
	var options = extend(defaultOptions, arguments[2] || {});
	var oEvent, eventType = null;

	for (var name in eventMatchers)
	{
		if (eventMatchers[name].test(eventName))
		{
			eventType = name;
			break;
		}
	}

	if (!eventType)
	{
		throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
	}

	if (document.createEvent)
	{
		oEvent = document.createEvent(eventType);
		if (eventType == 'HTMLEvents')
		{
			oEvent.initEvent(eventName, options.bubbles, options.cancelable);
		}
		else
		{
			oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
			options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
			options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
		}
		element.dispatchEvent(oEvent);
	}
	else
	{
		options.clientX = options.pointerX;
		options.clientY = options.pointerY;
		var evt = document.createEventObject();
		oEvent = extend(evt, options);
		element.fireEvent('on' + eventName, oEvent);
	}

	return;
}

//to use options on the event triggered by simulateEvent
function extend(destination, source)
{
	for (var property in source)
	{
		destination[property] = source[property];
	}

	return destination;
}

function getBoardSize()
{
	if(document.getElementById("expert").checked)
	{
		rows = 16;
		cols = 30;
		mines = 99;
	}
	else if(document.getElementById("intermediate").checked)
	{
		rows = 16;
		cols = 16;
		mines = 40;
	}
	else if(document.getElementById("beginner").checked)
	{
		rows = 9;
		cols = 9;
		mines = 10;
	}
	else //custom
	{
		rows = document.getElementById("custom_height").value;
		cols = document.getElementById("custom_width").value;
		mines = document.getElementById("custom_mines").value;
	}
}

function createControlBox()
{
	//main div: controlsDiv
	var controlsDiv = document.createElement("div");
	controlsDiv.setAttribute("id", "RadoSolverControlBox");
	controlsDiv.setAttribute("class", "RadoSolverControlBox");
	//header div: headerDiv
	var headerDiv = document.createElement("div");
	headerDiv.setAttribute("id", "headerDiv");
	headerDiv.setAttribute("class", "headerDiv");
	controlsDiv.appendChild(headerDiv);
	//pre-body div: preBodyDiv
	var preBodyDiv = document.createElement("div");
	preBodyDiv.setAttribute("id", "preBodyDiv");
	preBodyDiv.setAttribute("class", "preBodyDiv");
	controlsDiv.appendChild(preBodyDiv);
	//body div: bodyDiv
	var bodyDiv = document.createElement("div");
	bodyDiv.setAttribute("id", "bodyDiv");
	bodyDiv.setAttribute("class", "bodyDiv");
	controlsDiv.appendChild(bodyDiv);
	//footer div: footerDiv
	var footerDiv = document.createElement("div");
	footerDiv.setAttribute("id", "footerDiv");
	footerDiv.setAttribute("class", "footerDiv");
	controlsDiv.appendChild(footerDiv);

	//Create title for header
	var title = document.createElement("p");
	title.innerHTML = "RadoSolver Controls";
	title.className = "RadoSolverTitle";
	headerDiv.appendChild(title);

	//Create button to start the solver
	var b=document.createElement("button");
	b.innerHTML = "RadoSolver";
	b.setAttribute("id", "radoSolver");
	b.setAttribute("onclick","solveDSSP()");
	preBodyDiv.appendChild(b);

	//Create textfields for row and column (ToDo: remove this)
	/*
	var r=document.createElement("input");
	r.setAttribute("type","text");
	r.setAttribute("id","rowI");
	preBodyDiv.appendChild(r);
	var c=document.createElement("input");
	c.setAttribute("type","text");
	c.setAttribute("id","colJ");
	preBodyDiv.appendChild(c);
	*/

	//Create button to clear log
	var b=document.createElement("button");
	b.innerHTML = "ClearLog";
	b.setAttribute("id", "clearLog");
	b.setAttribute("onclick","clearLog()");
	preBodyDiv.appendChild(b);

	//Create message div
	var m = document.createElement("div");
	m.setAttribute("class", "RadoSolverMessages");
	m.setAttribute("id", "RadoSolverMessages");
	bodyDiv.appendChild(m);

	//Create marquee
	var banner = document.createElement("marquee");
	banner.className = "RadoSolverBanner";
	banner.setAttribute("scrollamount", 3);
	banner.innerHTML = "Made by RADOMAN";
	footerDiv.appendChild(banner);

	document.body.appendChild(controlsDiv);
}

function logEvent(s)
{
	var l = document.getElementById("RadoSolverMessages");
	l.innerHTML = "<p>" + s + "</p>" + l.innerHTML;
}

function clearLog()
{
	document.getElementById("RadoSolverMessages").innerHTML = "";
}

//import stylesheet to the head
function setMyStyle(style)
{
	var myStyle = document.createElement("link");
	myStyle.setAttribute("rel", "stylesheet");
	myStyle.setAttribute("id", "styles");
	myStyle.setAttribute("href", style);
	document.getElementsByTagName("head")[0].appendChild(myStyle);
}

/*
 * Main
 */

//apply stylesheet
setMyStyle("https://drive.google.com/uc?export=download&id=1bbkb1PZq0657ZOExsTyB3cekcllvT3k0");

//Create divs to hold my controls
createControlBox();

//global variables
var rows; //number of rows on the board
var cols; //number of columns on the board
var mines; //number of mines on the board
//possible values of cells
const values =
{
	OPEN0: 0,
	OPEN1: 1,
	OPEN2: 2,
	OPEN3: 3,
	OPEN4: 4,
	OPEN5: 5,
	OPEN6: 6,
	OPEN7: 7,
	OPEN8: 8,
	BLANK: -1,
	BOMBFLAGGED: -2,
	BOMBDEATH: -3,
	BOMBREVEALED: -4
};
//movements vector (to move around a cell)
var movs = [[-1,-1],[-1,0],[-1,+1],[0,-1],[0,+1],[+1,-1],[+1,0],[+1,+1]];
var randomChoice;
var numGames;
var numMoves;

//variables for statistics
var totalGames=1000;
var totalWins=0;
var totalLosses=0;
var totalFastestTimeWin=99999;
var totalTimeToWin=0;
var totalTimeToLose=0;
var totalAvgTimeWin=0;
var totalAvgTimeLoss=0;
var totalGuesses=0;
var totalMoves=0;

//Solve minesweeper by Double Set Single Point algorithm (DSSP)
async function solveDSSP()
{
	var board;
	var safeCells = new Array();
	var questionableCells = new Array();
	var lost;
	var win;
	var i;
	var j;
	var cell;
	var dateStart;
	var dateEnd;
	var gameTime;

	//clear log
	clearLog();
	numGames=0;
	
	//get board size and store it in global variables rows & cols
	getBoardSize();
	//logEvent("Board size is: "+rows+"x"+cols);

	do
	{
		//initialize board object
		board = new MineSweeperBoard(rows, cols, mines);

		//initial move
		safeCells.push(initialMove());

		newGame();
		lost = false;
		win = false;

		numMoves = 0;
		randomChoice=0;
		probOfMine = 0;
		dateStart = new Date().getTime();

		//main part
		while(!lost && !win)
		{
			//if there is no safe choice available, choose random
			if(safeCells.length == 0)
			{
				safeCells.push(randomMove1(board));
			}

			//open all safe cells
			while(safeCells.length > 0 && !lost && !win)
			{
				cell = safeCells.shift();
				openIJ(cell.row+1, cell.column+1);
				numMoves++;
				board.setClicked(cell.row, cell.column, true)
				//logEvent("Open " + numMoves + "(" + cell.row + "," + cell.column + ")");
				
				//get the new info to the board and new value of cell
				updateBoard(board);
				cell.value = board.getValue(cell.row,cell.column);

				logEvent("sleeping a little...");
				await prueba();

				//how do results change if I make more than 1 initial move?
				if(numMoves <= 3 && probOfMine <= 0.210)
				{
					//logEvent("Open" + numMoves +" (" + cell.row + "," + cell.column + ")");
					probOfMine = (mines - countCells(board, values.BOMBFLAGGED)) / countCells(board, values.BLANK);
					//logEvent("Probability of hitting a mine is: " + probOfMine);
					if(probOfMine <= 0.210)
					{
						//logEvent("We will play random move");
						//logEvent("More than 1 starting click");
						//safeCells.unshift(randomMove1(board)); //try corners first
						safeCells.push(randomMove2(board)); //don't try corners
						//logEvent("random move will be: (" + safeCells[0].row + "," + safeCells[0].column + ")");
					}
				}

				//if it was a bomb, we died
				if(cell.value == values.BOMBDEATH)
				{
					lost = true;
					break;
				}
				//need to check if our last move won the game
				if(checkWin(board))
				{
					win = true;
					break;
				}

				//we have new info, iterate through all cells to see if we can find something useful
				for(i=0; i<rows; i++)
				{
					for(j=0; j<cols; j++)
					{
						//if all neighbors are free, put them in safeCells for next iteration
						var val = board.getValue(i,j);
						if(val != values.BLANK && val != values.OPEN0 && val != values.BOMBFLAGGED)
						{
								if(isAFN(board, i, j))
								{
									//put all unmarked neighbors of cell into safeCells
									//doesnt work -> safeCells.push(getUnmarkedNeighbors(board, cell.row, cell.column));
									getUnmarkedNeighbors(board, i, j, safeCells);
								}
								else 
								{
									//put them in questionableCells to check for AMN and AFN later
									questionableCells.push(new MineSweeperCell(i,j,val));
								}
						}
					}
				}
			}

			//check questionableCells for all MINE neighbors
			for(cell of questionableCells)
			{
				//cant use pop because i don't want to remove it yet
				//cell = questionableCells.shift();
				if(isAMN(board, cell.row, cell.column))
				{
					//mark all neighbors of cell as mines and remove cell from questionableCells
					flagNeighbors(board, cell.row, cell.column);
					//now i can pop you
					cell = questionableCells.shift();
				}
			}

			//check questionableCells for all FREE neighbors
			for(cell of questionableCells)
			{
				//if all neighbors are free, put them in safeCells for next iteration
				var val = board.getValue(cell.row,cell.column);
				if(val != values.BLANK && val != values.OPEN0 && val != values.BOMBFLAGGED)
				{
					if(isAFN(board, cell.row, cell.column))
					{
						//put all unmarked neighbors of cell into safeCells
						getUnmarkedNeighbors(board, cell.row, cell.column, safeCells);
						cell = questionableCells.pop();
					}
				}
			}
		}

		dateEnd = new Date().getTime();
		gameTime = ((dateEnd-dateStart)/1000);
		//logEvent("Time: "+ gameTime);
		//logEvent("Number of guesses = "+randomChoice);

		if(win)
		{
			logEvent("WE WON! :) :)");
			totalWins++;
			if(gameTime < totalFastestTimeWin)
			{
				totalFastestTimeWin = gameTime;
			}
			totalTimeToWin += gameTime;
		}
		else
		{
			logEvent("WE LOST! :( :(");
			totalLosses++;
			totalTimeToLose += gameTime;
		}
		totalGuesses += randomChoice;
		totalMoves += numMoves;
	} while( !win /*numGames < totalGames*/);

	logEvent("Total Games Played: " + numGames);
	logEvent("Total Games Won   : " + totalWins);
	logEvent("Total Games Lost  : " + totalLosses);
	logEvent("Win %: " + (totalWins*100/numGames));
	logEvent("Fastest Win: " + totalFastestTimeWin);
	logEvent("Average Time Wins : " + totalTimeToWin / totalWins);
	logEvent("Average Time Loss : " + totalTimeToLose / totalLosses);
	logEvent("Total Moves       : " + totalMoves);
	logEvent("Total Guesses     : " + totalGuesses);
	logEvent("Guess %           : " + totalGuesses/totalMoves);
}

function countCells(board, value)
{
	var i;
	var j;
	var r=0;

	for(i=0; i < board.rowSize; i++)
	{
		for(j=0; j < board.colSize; j++)
		{
			if(board.getValue(i,j) == value)
			{
				r++;
			}
		}
	}

	return r;
}

function effectiveLabel(board, i, j)
{
	return board.getValue(i,j) - countFlaggedNeighbors(board, i, j);
}

function countUnflaggedNeighbors(board, i, j)
{
	var f;
	var r=0;
	var auxR;
	var auxC;

	for(f=0; f<8; f++)
	{
		auxR = i+movs[f][0];
		auxC = j+movs[f][1];
		if(auxR>=0 && auxR<rows && auxC>=0 && auxC<cols)
		{
			if(board.getValue(auxR, auxC) == values.BLANK)
			{
				r++;
			}
		}
	}

	return r;
}

function countFlaggedNeighbors(board, i, j)
{
	var f;
	var r=0;
	var auxR;
	var auxC;

	for(f=0; f<8; f++)
	{
        auxR = i+movs[f][0];
		auxC = j+movs[f][1];
		if(auxR>=0 && auxR<rows && auxC>=0 && auxC<cols)
		{
			if(board.getValue(auxR, auxC) == values.BOMBFLAGGED)
			{
				r++;
			}
		}
	}

	return r;
}

function isAMN(board, i, j)
{
	return effectiveLabel(board, i, j) == countUnflaggedNeighbors(board, i, j);
}

function isAFN(board, i, j)
{
	var effLbl = effectiveLabel(board, i, j);
	//var unflgDNbrs = countUnflaggedNeighbors(board, i, j);
	
	//return (board.getValue(i,j) != values.OPEN0) && (effLbl == unflgDNbrs);
	//return effLbl == unflgDNbrs;
	return effLbl == 0;
}

function getUnmarkedNeighbors(board, i, j, safeCells)
{
	var cellVal;
	var cellClick;
	var cell;
	var f;
	var auxR;
	var auxC;

	for(f=0; f<8; f++)
	{
		auxR = i+movs[f][0];
		auxC = j+movs[f][1];
		if(auxR>=0 && auxR<rows && auxC>=0 && auxC<cols)
		{
			cellVal = board.getValue(auxR, auxC);
			cellClick = board.getClicked(auxR, auxC);
			cell = new MineSweeperCell(auxR, auxC, cellVal);
			//if(cellVal == values.BLANK)
			if(cellVal == values.BLANK /*&& cellVal != values.BOMBFLAGGED && !cellClick*/)
			{
				var flag = 0;
				var c;
				for(c of safeCells)
				{
					if(MineSweeperCell.compareCells(c, cell))
					{
						flag = 1;
					}
				}
				if(flag == 0)
				{
					safeCells.push(cell);
				}
			}
		}
	}
}

//flags all neighbors of cell(i,j) on the board
function flagNeighbors(board, i, j)
{
	var cell;
	var f;
	var auxR;
	var auxC;

	for(f=0; f<8; f++)
	{
		auxR = i+movs[f][0];
		auxC = j+movs[f][1];
		if(auxR>=0 && auxR<rows && auxC>=0 && auxC<cols)
		{
			cell = board.getValue(auxR, auxC);
			if(cell == values.BLANK)
			{
				toggleFlagIJ(auxR+1, auxC+1);
				updateBoard(board);
				board.setClicked(auxR, auxC, true);
			}
		}
	}
}

//Solve minesweeper by the simplest algorithm possible
function solveSimple()
{
	var board;
	var lost = false;
	var win = false;
	var i;
	var j;

	//get board size and store it in global variables rows & cols
	getBoardSize();
	//logEvent("Board size is: "+rows+"x"+cols);

	board = new MineSweeperBoard(rows, cols, mines);

	//go cell by cell, if it is not open, open
	for(i=1; i<=rows && !lost && !win; i++)
	{
		for(j=1; j<=cols && !lost && !win; j++)
		{
			if(board.getValue(i-1,j-1) == values.BLANK)
			{
				openIJ(i,j);
				//logEvent("Open ("+i+","+j+")");
				//get the new info from the board
				updateBoard(board);
				//if it was a bomb, we died
				if(board.getValue(i-1,j-1) == values.BOMBDEATH)
				{
					lost = true;
				}
				//need to check if our last move won the game
				if(checkWin(board))
				{
					win = true;
				}
			}
		}
	}

	if(win)
	{
		logEvent("WE WON! :)");
	}
	else
	{
		logEvent("WE LOST! :(");
	}
}

//just chooses cell 0,0
function initialMove()
{
	return new MineSweeperCell(0,0,values.BLANK);
}

function updateBoard(board)
{
	var i;
	var j;
	for(i=0; i<rows; i++)
	{
		for(j=0; j<cols; j++)
		{
			board.setValue(i,j,getValue(i+1,j+1));
		}
	}
}

function checkWin(board)
{
	var i;
	var j;
	var win = true; //assume i win

	for(i=0; i<rows && win; i++)
	{
		for(j=0; j<cols && win; j++)
		{
			if(board.getValue(i,j) == values.BLANK || board.getValue(i,j) == values.BOMBDEATH || board.getValue(i,j) == values.BOMBREVEALED)
			{
				win = false //if a cell is still blank or is a bomb, i didn't win yet
			}
		}
	}

	return win;
}

//check for corners, edges or random inner cell
function randomMove1(board)
{
	//ToDo optimize this function
	var i = 0;
	var r = getRndInteger(0,rows);
	var c = getRndInteger(0,cols);
	var ret = new MineSweeperCell(r,c,board.getValue(r,c));

	//logEvent("Random choice...");
	randomChoice++;

	//corners
	if(board.getValue(rows-1,0) == values.BLANK)
	{
		//logEvent("Random ("+(rows-1)+","+0+")");
		return new MineSweeperCell(rows-1, 0, values.BLANK);
	}
	else if(board.getValue(0,cols-1) == values.BLANK)
	{
		//logEvent("Random ("+0+","+(cols-1)+")");
		return new MineSweeperCell(0, cols-1, values.BLANK);
	}
	else if(board.getValue(rows-1,cols-1) == values.BLANK)
	{
		//logEvent("Random ("+(rows-1)+","+(cols-1)+")");
		return new MineSweeperCell(rows-1, cols-1, values.BLANK);
	}
	else if(board.getValue(0,0) == values.BLANK)
	{
		//logEvent("Random ("+0+","+0+")");
		return new MineSweeperCell(0, 0, values.BLANK);
	}

	//horizontal edges
	for(i=1;i<cols-1;i++)
	{
		if(board.getValue(0,i) == values.BLANK)
		{
			//logEvent("Random ("+0+","+i+")");
			return new MineSweeperCell(0, i, values.BLANK);
		}
		if(board.getValue(rows-1,i) == values.BLANK)
		{
			//logEvent("Random ("+(rows-1)+","+i+")");
			return new MineSweeperCell(rows-1, i, values.BLANK);
		}
	}

	//vertical edges
	for(i=1; i<rows-1; i++)
	{
		if(board.getValue(i,0) == values.BLANK)
		{
			//logEvent("Random ("+i+","+0+")");
			return new MineSweeperCell(i, 0, values.BLANK);
		}
		if(board.getValue(i,cols-1) == values.BLANK)
		{
			//logEvent("Random ("+i+","+(cols-1)+")");
			return new MineSweeperCell(i, cols-1, values.BLANK);
		}
	}

	//totally random
	do
	{
		r = getRndInteger(0,rows);
		c = getRndInteger(0,cols);
		ret = new MineSweeperCell(r,c,board.getValue(r,c));
	} while(board.getValue(r,c) != values.BLANK);

	//logEvent("Random ("+r+","+c+")");
	return ret;
}


//check for NO corners, edges or random inner cell
function randomMove2(board)
{
	//ToDo optimize this function
	var i = 0;
	var r = getRndInteger(0,rows);
	var c = getRndInteger(0,cols);
	var ret = new MineSweeperCell(r,c,board.getValue(r,c));

	//logEvent("Random choice...");
	randomChoice++;

	//horizontal edges
	for(i=1;i<cols-1;i++)
	{
		if(board.getValue(0,i) == values.BLANK)
		{
			//logEvent("Random ("+0+","+i+")");
			return new MineSweeperCell(0, i, values.BLANK);
		}
		if(board.getValue(rows-1,i) == values.BLANK)
		{
			//logEvent("Random ("+(rows-1)+","+i+")");
			return new MineSweeperCell(rows-1, i, values.BLANK);
		}
	}

	//vertical edges
	for(i=1; i<rows-1; i++)
	{
		if(board.getValue(i,0) == values.BLANK)
		{
			//logEvent("Random ("+i+","+0+")");
			return new MineSweeperCell(i, 0, values.BLANK);
		}
		if(board.getValue(i,cols-1) == values.BLANK)
		{
			//logEvent("Random ("+i+","+(cols-1)+")");
			return new MineSweeperCell(i, cols-1, values.BLANK);
		}
	}

	//totally random
	do
	{
		r = getRndInteger(0,rows);
		c = getRndInteger(0,cols);
		ret = new MineSweeperCell(r,c,board.getValue(r,c));
	} while(board.getValue(r,c) != values.BLANK);

	//logEvent("Random ("+r+","+c+")");
	return ret;
}