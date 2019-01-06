// maze.js

var n = 0;
var s = 1;
var e = 2;
var w = 3;
var ogres = [];
var traps = [];
var cols = [];
var rows = [];
var allRooms = [];
possibleOgresAndTraps = [];
var pathIndexer = 0;
var unblockedRooms = [];
var allPlayers = [];
var hoverItem = null;
var gameclockSecondCounter = 0;
var gameclockHandle = null;
var playerIdxMovingToken = -1;

// we have a scoreboard that takes up the top 50px so 
// the canvas is always offset by 50px (value is set up in css scoreboard element)
var gridTopOffset = 50;
// hoverToken -- token being hovered over with mouse
var hoverToken = null;
var currentRoom = null;
var maxColElement = document.getElementById("maxCols");
var challengesCheck = document.getElementById("challengesCheck");
var isChallengesDisplayed = true;
var MAX_COLS = Number(maxColElement.value);
var GRID_SIZE = MAX_COLS*MAX_COLS;
var PREV_COL_SIZE = MAX_COLS;
var MAX_ATTEMPTS = 500;
var MAX_OGRES_TRAPS = 5;
var attempts = 0;
// path is an array of rooms used by generatePath()
var path = [];
var ctx = null;
var theCanvas = null;
var lineInterval = 0;

var mouseIsCaptured = false;

console.log("before initapp...");
window.addEventListener("load", initApp);
console.log("after window.addEventListener(load, initApp)");

function initGrid(){
	PREV_COL_SIZE = MAX_COLS;
	MAX_COLS = Number(maxColElement.value);
	GRID_SIZE = MAX_COLS*MAX_COLS;
	initCols();
	initRows();
}


function initCols(){
	cols=[];
	for (x = 0; x< MAX_COLS;x++){
		cols.push(MAX_COLS*(x+1));
	}
}


function initRows(){
	rows=[];
	for (x = 0; x< MAX_COLS +1;x++){
		rows.push(MAX_COLS*x+1);
	}
}

function initPossibles(){
	// location 1 and GRID_SIZE are off limits
	// since they are the enter and exit rooms
	for (x = 2; x < GRID_SIZE; x++){
		possibleOgresAndTraps.push(x);
	}
}

function drawPathSteps(){
	ctx.strokeStyle = "darkorange";
	ctx.beginPath();
	ctx.lineWidth = 2;
	if (pathIndexer < path.length -1){
		ctx.moveTo(path[pathIndexer].textLocationX,path[pathIndexer].textLocationY);
		ctx.lineTo(path[pathIndexer+1].textLocationX,path[pathIndexer+1].textLocationY);
		ctx.stroke();
		pathIndexer++;
		setTimeout(drawPathSteps,100);
	}
	else{
		pathIndexer = 0;
	}
	
}

function drawPath(){
	setTimeout(drawPathSteps, 100);
}

function placeOgresAndTraps(){
	ogres = [];
	traps = [];
	// ###  NOTES #########
	// An ogre and trap can never be in locations 30 & 35 (blocks exit) or
	// 2 and 7 (blocks entrance). 
	// ####################

	while (ogres.length < MAX_OGRES_TRAPS){ 
		var possibleOgre = possibleOgresAndTraps.splice(Math.floor((Math.random() * possibleOgresAndTraps.length)),1);
		ogres.push(possibleOgre);
		if (possibleOgre == unblockedRooms[0] || possibleOgre == unblockedRooms[1]){
			if (possibleOgre - unblockedRooms[0] == 0){
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(unblockedRooms[1]),1);
			}
			else{
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(unblockedRooms[0]),1);
			}
		}
		if (possibleOgre == unblockedRooms[2] || possibleOgre == unblockedRooms[3]){
			if (possibleOgre - unblockedRooms[2] == 0){
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(unblockedRooms[3]),1);
			}
			else{
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(unblockedRooms[2]),1);
			}
		}
	}

	while (traps.length < MAX_OGRES_TRAPS){
		var possibleTrap = possibleOgresAndTraps.splice(Math.floor((Math.random() * possibleOgresAndTraps.length)),1);
		traps.push(possibleTrap);
		if (possibleTrap == unblockedRooms[0] || possibleTrap == unblockedRooms[1]){
			if (possibleTrap - unblockedRooms[0] == 0){
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(unblockedRooms[1]),1);
			}
			else{
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(unblockedRooms[0]),1);
			}
		}
		if (possibleTrap == unblockedRooms[2] || possibleTrap == unblockedRooms[3]){
			if (possibleTrap - unblockedRooms[2] == 0){
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(unblockedRooms[3]),1);
			}
			else{
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(unblockedRooms[2]),1);
			}
		}
	} 
	drawTrapsAndOgres();
}

function addOgresAndTrapsToRooms(){
	for (o = 0; o < ogres.length; o++){
		allRooms[ogres[o]-1].hasOgre = true;
	}
	for (t = 0; t < traps.length; t++){
		allRooms[traps[t]-1].hasTrap = true;
	}

}

function drawTrapsAndOgres(){
	if (!isChallengesDisplayed){
		// user has turned off the display of challengesCheck
		return;
	}
	// DRAW TRAPS
	ctx.globalAlpha = .5;
	ctx.fillStyle = "red";
	for(x = 0; x < traps.length; x++){
		// NOTE: the +5 on the Y side is just to move the square down a bit
		// so you can read the direction letters.
		ctx.fillRect(allRooms[traps[x]-1].textLocationX,allRooms[traps[x]-1].textLocationY+5,15,15);
	}
	
	// DRAW OGRES
	
	ctx.fillStyle = "darkgreen";
	ctx.strokeStyle = '#003300';
	ctx.lineWidth = 1;
	for(x = 0; x < ogres.length; x++){
		// NOTE: the +5 on the Y side is just to move the square down a bit
		// so you can read the direction letters.
		ctx.beginPath();	
		ctx.arc(allRooms[ogres[x]-1].textLocationX,allRooms[ogres[x]-1].textLocationY +8, 7, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.stroke();
	}
	ctx.globalAlpha = 1;
}

function generatePath(){
	
	var roomIndex = 0;
	currentRoom = allRooms[roomIndex];
	currentRoom.isPath = true;
	// we always push room 1 on first since that is always where we start.
	path.push(currentRoom);
	var counter = 0;
	
	// Requirement is that the room cannot be added to the path if it has already been added
		
	while (currentRoom.location != GRID_SIZE && counter < GRID_SIZE * 3){
		counter++;
		// determine which way to exit from possible exits (doors)
		var doorIndex = getExitDoor(currentRoom.doors);
		// doorIndex  0 = n (subtract 1 from row)
		// 1 = s (add one to row)
		// 2 = e (add one to column)
		// 3 = w (subtract one from column)
		switch (doorIndex){
			case 0 : {
				if (!allRooms[(currentRoom.location -1) - MAX_COLS].isPath
				&& !allRooms[(currentRoom.location -1) - MAX_COLS].hasOgre
				&& !allRooms[(currentRoom.location -1) - MAX_COLS].hasTrap){
					currentRoom = allRooms[(currentRoom.location -1) - MAX_COLS];
				}
				else{
					continue;
				}
				break;
			}
			case 1 : {
				if (!allRooms[(currentRoom.location -1) + MAX_COLS].isPath
				&& !allRooms[(currentRoom.location -1) + MAX_COLS].hasOgre
				&& !allRooms[(currentRoom.location -1) + MAX_COLS].hasTrap){
					currentRoom = allRooms[(currentRoom.location -1) + MAX_COLS];
				}
				else{
					continue;
				}
				break;
			}
			case 2 : {
				if (!allRooms[(currentRoom.location -1) + 1].isPath
				&& !allRooms[(currentRoom.location -1) + 1].hasOgre
				&& !allRooms[(currentRoom.location -1) + 1].hasTrap){
					currentRoom = allRooms[(currentRoom.location -1) + 1];
				}
				else{
					continue;
				}
				break;
			}
			case 3 : {
				if (!allRooms[(currentRoom.location -1) - 1].isPath
				&& !allRooms[(currentRoom.location -1) - 1].hasOgre
				&& !allRooms[(currentRoom.location -1) - 1].hasTrap){
					currentRoom = allRooms[(currentRoom.location -1) - 1];
				}
				else{
					continue;
				}
				break;
			}
		}
		currentRoom.isPath = true;
		path.push(currentRoom);
	}
}

function getExitDoor(doors){
	// returns the index of the original doors array 
	var possibleDoors = [];
	for (x = 0;x<doors.length;x++){
		if (doors[x] == 1){
			// this is an array of the door indexes
			possibleDoors.push(x);
		}
	}
	var chosenDoorIndex = Math.floor((Math.random() * possibleDoors.length))
	return possibleDoors[chosenDoorIndex];
}

function initializeRooms(){
	initGrid();
	
	for (var i = 1; i <=GRID_SIZE;i++){
		allRooms.push(new room({location:i}));
		allRooms[i-1].init();
	}
}

function DrawDirections(room){
    
	ctx.strokeStyle = '#ff000';
	ctx.globalAlpha = 1;
	ctx.fillText(getPossibleDirections(room.doors), room.textLocationX,room.textLocationY);
	ctx.fillText(room.location, room.textLocationX, room.textLocationY + 10);
	
}

function getRowNumber(location){
	for (var x =0; x < cols.length;x++){
		if (cols[x] - location >= 0){
			// return column number as index + 1
			var row = x+1;
			return x+1;
		}
	}
}

function getColumnNumber(location){
	for (var x =0; x < rows.length;x++){
		if (rows[x] - location >= 0){
			var col = x+1;
			if (location <= MAX_COLS){
				return location % MAX_COLS == 0 ? location  : location % MAX_COLS;
			}
			else{
				return location % MAX_COLS == 0 ? location - (MAX_COLS*(x-1))  : location % MAX_COLS;
			}
		}
	}
}

function room(roomInfo){
	// location is a value from 1 to MAX_COLS
	this.location = roomInfo.location;
	// we will use visited to determine if user has already been in this room
	// room 1 is always initially visited since that is where user starts
	this.visited = this.location == 1 ? true : false;
	
	this.doors = [0,0,0,0];
	this.column = getColumnNumber(this.location);
	this.row = getRowNumber(this.location);
	this.textLocationX = (this.column *(lineInterval )) - (lineInterval /2);
	this.textLocationY = (this.row * (lineInterval )) - (lineInterval /2);
	this.minPoint = new point ((this.column-1) * lineInterval, (this.row-1)*lineInterval);
	this.maxPoint = new point ((this.column) * lineInterval, (this.row)*lineInterval);;
	
	this.init = function(){
		this.isPath = false; // it isn't on path until a path is generated
		this.hasOgre = false;
		this.hasTrap = false;
		// ###### If this is the first row, set up directions
		if (this.row == 1){
			this.doors[s] = 1;
			if (this.column != 1){
				this.doors[w] = 1;
			}
			if (this.column != MAX_COLS){
				this.doors[e] =1;
			}
		}
		
		if (this.location % MAX_COLS == 0){
			this.doors[w] = 1;
			if (this.location != GRID_SIZE){
				this.doors[s] = 1;
			}
			if (this.location != MAX_COLS){
				this.doors[n] = 1;
			}
		}

		if (this.column != 1 && this.column != MAX_COLS){
			if (this.row != 1 && this.row != MAX_COLS){
				this.doors[n] = this.doors[s] = this.doors[e] = this.doors[w] = 1;
			}
		}
		
		if (this.column == 1 && this.row !=1 && this.row != MAX_COLS){
			this.doors[n] = this.doors[s] = this.doors[e] = 1;
		}

		// ##### If this is the last row set up directions
		if (this.row == MAX_COLS){
			this.doors[n] = 1;
			if (this.column != 1){
				this.doors[w]=1;
			}
			if (this.column != MAX_COLS){
				this.doors[e] = 1;
			}
		}
	}
	// locations 1 - 6 cannot have up as a direction
	// locations 1,7,13,19,25,31 cannot have west as a direction
	// locations 31 - 36 cannot have down as a direction
	// locations 6, 12, 18, 24, 30, 36 cannot have right as direction
	//var doors = []; // contains four values (u,d,l,r) either 0 or 1
	
}

function getPossibleDirections(doors){
	//turns door values of 0 or 1 into letters n,s,e,w
	// returns it as a string
	// 
	if (doors === undefined){
		return "";
	}
	var possibleDirections = ""
	if (doors[0] == 1){
		possibleDirections = "n";
	}
	if (doors[1] == 1){
		possibleDirections += "s";
	}
	if (doors[2] == 1){
		possibleDirections += "e";
	}
	if (doors[3] == 1){
		possibleDirections += "w";
	}
	return possibleDirections;
}
function reGenPath(){
	initGrid();
	initApp();
	allRooms = [];
	path = [];
	ogres = [];
	traps = [];
	possibleOgresAndTraps = [];
	unblockedRooms = [];
	stopClock();
	gameclockHandle = setInterval(updateGameClock, 1000);
	gameclockSecondCounter = 0;
	initUnblockedRooms();
	initPossibles();
	initializeRooms();
	placeOgresAndTraps();
	addOgresAndTrapsToRooms();
	generatePath();
	var el = document.getElementById("output");
	el.innerHTML = "";
	draw();
}

function reTryPath(){
	initGrid();
	if (MAX_COLS != PREV_COL_SIZE){
			reGenPath();
			return;
	}
	path= [];
	initPossibles();
	initializeRooms();
	addOgresAndTrapsToRooms();
	generatePath();
	draw();
}

function retryUntilSolved(){
	initGrid();
	if (MAX_COLS != PREV_COL_SIZE){
			reGenPath();
			return;
	}
	attempts = 0;
	while (attempts < MAX_ATTEMPTS && currentRoom.location != GRID_SIZE){
		path= [];
		initPossibles();
		initializeRooms();
		addOgresAndTrapsToRooms();
		generatePath();
		draw();
		console.log("attempts : " + attempts++);
	}
	setTimeout(displayResults,1300);
}

function displayResults(){
	if (attempts <= MAX_ATTEMPTS && currentRoom.location == GRID_SIZE){
		alert ("Solved it in " + attempts + " attempts.");
	}
	if (attempts >=MAX_ATTEMPTS && currentRoom.location != GRID_SIZE){
		alert("Most likely, this map is unsolvable.");
	}
	
	
}

function initUnblockedRooms(){
	unblockedRooms.push(2); // 2 is always one no matter grid size.
	unblockedRooms.push(MAX_COLS+1); // first room of 2nd row
	unblockedRooms.push(MAX_COLS*(MAX_COLS-1)); // last room of 2nd to last row
	unblockedRooms.push(GRID_SIZE-1); // 2nd to last room
}

function initCanvas(){
	
	ctx.canvas.height  = (window.innerHeight - lineInterval);
	ctx.canvas.width = ctx.canvas.height;
	
	lineInterval = Math.floor(ctx.canvas.width / MAX_COLS);
	
	// the -5 in the two following lines makes the canvas area, just slightly smaller
	// than the entire window.  this helps so the scrollbars do not appear.
	ctx.canvas.height  = (window.innerHeight-lineInterval);
	ctx.canvas.width = ctx.canvas.height;
	ctx.strokeStyle = '#0000ff';

	ctx.font = '10px sans-serif';

	ctx.globalAlpha = 1;
	lineInterval = Math.floor(ctx.canvas.width / MAX_COLS);
}

function initApp()
{
	console.log("in initapp...");

	ogres = [];
	traps = [];
	cols = [];
	rows = [];
	allRooms = [];
	possibleOgresAndTraps = [];
	pathIndexer = 0;
	unblockedRooms = [];
	currentRoom = null;
	maxColElement = document.getElementById("maxCols");
	challengesCheck = document.getElementById("challengesCheck");
	MAX_COLS = Number(maxColElement.value);
	GRID_SIZE = MAX_COLS*MAX_COLS;
	PREV_COL_SIZE = MAX_COLS;
	MAX_ATTEMPTS = 500;
	MAX_OGRES_TRAPS = 5;
	attempts = 0;
	// path is an array of rooms used by generatePath()
	path = [];

	initGrid();
	allRooms = [];
	path = [];
	ogres = [];
	traps = [];
	possibleOgresAndTraps = [];
	unblockedRooms = [];
	allPlayers = [];
	
	theCanvas = document.getElementById("gamescreen");
	ctx = theCanvas.getContext("2d");
	
	initCanvas();
	
	window.addEventListener("resize", initApp);
	window.addEventListener("orientationchange", initApp);
	window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", mouseDownHandler);

	initUnblockedRooms();
	initPossibles();
	initializeRooms();
	placeOgresAndTraps();
	addOgresAndTrapsToRooms();
	
	generatePath();
	initPlayers();
	initTokens();
	startGame();
	draw();
	

}

function drawClippedAsset(sx,sy,swidth,sheight,x,y,w,h,imageId)
{
	var img = document.getElementById(imageId);
	if (img != null)
	{
		ctx.drawImage(img,sx,sy,swidth,sheight,x,y,w,h);
	}
}

function draw() {
	
	
	initCanvas();

	for (var lineCount=0;lineCount<MAX_COLS;lineCount++)
	{
		ctx.fillStyle="blue";
		ctx.fillRect(0,lineInterval*(lineCount+1),ctx.canvas.width,2);
		ctx.fillRect(lineInterval*(lineCount+1),0,2,ctx.canvas.width);
	}
	
	if (allRooms !== undefined){
		for (var i = 1; i <=GRID_SIZE;i++){
			if  (allRooms[i-1] !== undefined && allRooms[i-1].doors !== undefined){
				DrawDirections(allRooms[i-1]);
			}
		}
	}
	if (path.length > 0){
		//drawPath();
	}
	drawTrapsAndOgres();
	
	// draw each token it its current location
    for (var tokenCount = 0; tokenCount < allPlayers.length; tokenCount++) {
		drawClippedAsset(
			allPlayers[tokenCount].token.imgSourceX,
			allPlayers[tokenCount].token.imgSourceY,
			allPlayers[tokenCount].token.imgSourceSize,
			allPlayers[tokenCount].token.imgSourceSize,
			allPlayers[tokenCount].token.gridLocation.x,
			allPlayers[tokenCount].token.gridLocation.y,
			allPlayers[tokenCount].token.size,
			allPlayers[tokenCount].token.size,
			allPlayers[tokenCount].token.imgIdTag
		);
    }
	// if the mouse is hovering over the location of a token, show yellow highlight
    if (hoverToken !== null) {
        ctx.fillStyle = "yellow";
        ctx.globalAlpha = .5
        ctx.fillRect(hoverToken.gridLocation.x, hoverToken.gridLocation.y, 
                  hoverToken.size, hoverToken.size);
        ctx.globalAlpha = 1;
		drawClippedAsset(
			hoverToken.imgSourceX,
			hoverToken.imgSourceY,
			hoverToken.imgSourceSize,
			hoverToken.imgSourceSize,
			hoverToken.gridLocation.x,
			hoverToken.gridLocation.y,
			hoverToken.size,
			hoverToken.size,
			hoverToken.imgIdTag
		);
    }
}

function displayChallengesClicked(){
	if (challengesCheck.checked == true){
		isChallengesDisplayed = true;
		draw();
	}
	else{
		isChallengesDisplayed = false;
		draw();
		console.log(isChallengesDisplayed);
	}
}

function gridlocation(value){
    this.x = value.x;
    this.y = value.y
}

function token(userToken){
	// represents the users onscreen token
	if (userToken !== undefined){
    this.size = userToken.size;
    this.imgSourceX = userToken.imgSourceX;
    this.imgSourceY = userToken.imgSourceY;
    this.imgSourceSize = userToken.imgSourceSize;
    this.imgIdTag = userToken.imgIdTag;
    this.gridLocation = userToken.gridLocation;
	}
}

function initTokens(){
	var currentToken =null;
	// add a token to each player
	for (var i = 0; i < 5;i++)
	{
		currentToken = new token({
				size:45,
				imgSourceX:i*60,
				imgSourceY:0*60,
				imgSourceSize:60,
				imgIdTag:'characterSet1',
				gridLocation: new gridlocation({x:i*45,y:5*45})
			});
			allPlayers[i].setToken(currentToken);
	}
}

function handleMouseMove(e)
{
    if (mouseIsCaptured)
    {    
        if (hoverItem.isMoving)
        {
			var hoverItemPoint = getMousePos(e);
			hoverItem.gridLocation.x = hoverItemPoint.x - hoverItem.offSetX;
			hoverItem.gridLocation.y = hoverItemPoint.y - hoverItem.offSetY;
			
			//45 on next line is width/height of each token - needs to be variable later
			var maxGridLocation = lineInterval * (MAX_COLS) -45;
			
			 if (hoverItemPoint.x < 0)
			  {
				hoverItem.gridLocation.x = 0;
			  }
			  if (hoverItemPoint.x >= maxGridLocation)
			  {
				hoverItem.gridLocation.x = maxGridLocation;
			  }
			  if (hoverItemPoint.y < 0)
			  { 
				hoverItem.gridLocation.y = 0;
			  }
			  if (hoverItemPoint.y >= maxGridLocation)
			  {
				hoverItem.gridLocation.y = maxGridLocation;
			  } 
        }
        draw();
    }
    // otherwise user is just moving mouse / highlight tokens
    else
    {
		var playerTokens = [];
		for (x = 0; x < allPlayers.length;x++){
			playerTokens.push(allPlayers[x].token);
		}
        hoverToken = hitTestHoverItem(getMousePos(e), playerTokens);
        draw();
    }
}

function hitTestHoverItem(mouseLocation, hitTestObjArray)
{
  for (var k = 0;k < hitTestObjArray.length; k++)
  {
	var testObjXmax = hitTestObjArray[k].gridLocation.x + hitTestObjArray[k].size;
	var testObjYmax = hitTestObjArray[k].gridLocation.y + hitTestObjArray[k].size;
	if ( ((mouseLocation.x >= hitTestObjArray[k].gridLocation.x) && (mouseLocation.x <= testObjXmax)) && 
		((mouseLocation.y >= hitTestObjArray[k].gridLocation.y) && (mouseLocation.y <= testObjYmax)))
	  {
		return hitTestObjArray[k];
	  }
  
  }
  return null;
}

function hitTestReturnObject(mouseLocation, hitTestObjArray)
{
	console.log("array length : " + hitTestObjArray.length);
	// send in an array of objects ret the one that is hit
  console.log("hitTest Obj array...");
  for (var k = 0;k < hitTestObjArray.length; k++)
  {
  console.log("k : " + k);
  var testObjXmax = hitTestObjArray[k].x + hitTestObjArray[k].width;
  var testObjYmax = hitTestObjArray[k].y + hitTestObjArray[k].height;
  if ( ((mouseLocation.x >= hitTestObjArray[k].x) && (mouseLocation.x <= testObjXmax)) && 
	((mouseLocation.y >= hitTestObjArray[k].y) && (mouseLocation.y <= testObjYmax)))
  {
	console.log("you got it");
	
	return hitTestObjArray[k];
  }
  
  }
  return null;
}

function hitTest(mouseLocation, hitTestObject)
{
  var testObjXmax = hitTestObject.gridLocation.x + hitTestObject.size;
  var testObjYmax = hitTestObject.gridLocation.y + hitTestObject.size;
  if ( ((mouseLocation.x >= hitTestObject.gridLocation.x) && (mouseLocation.x <= testObjXmax)) && 
	((mouseLocation.y >= hitTestObject.gridLocation.y) && (mouseLocation.y <= testObjYmax)))
  {
	return true;
  }
  return false;
}



var point = function(x,y)
{
this.x = x;
this.y = y;
};

function initPlayers(){
	allPlayers.push (new player({characterType: "barbarian", token: new token()})); 
	allPlayers.push (new player({characterType: "wizard", token: new token()})); 
	allPlayers.push (new player({characterType: "thief", token: new token()})); 
	allPlayers.push (new player({characterType: "elf", token: new token()})); 
	allPlayers.push (new player({characterType: "leader", token: new token()})); 
}

function startGame(){
	var roomNumber = 0;
	// barbarian
	allPlayers[0].token.gridLocation = {x:lineInterval * (allRooms[roomNumber].column-1), y:lineInterval * (allRooms[roomNumber].row-1)}
	//wizard  
	// wizardOffset 
	var wizardOffset = lineInterval
	allPlayers[1].token.gridLocation = {x:lineInterval * (allRooms[roomNumber].column-1) + lineInterval - 45, y:lineInterval * (allRooms[roomNumber].row-1)}
	// thief
	allPlayers[2].token.gridLocation = {x:lineInterval * (allRooms[roomNumber].column-1) + (lineInterval /2 ) -15, y:lineInterval * (allRooms[roomNumber].row-1) + (lineInterval /2) -20}
	//elf
	allPlayers[3].token.gridLocation = {x:lineInterval * (allRooms[roomNumber].column-1), y:lineInterval * (allRooms[roomNumber].row-1)+(lineInterval/2)}
	//leader
	allPlayers[4].token.gridLocation = {x:lineInterval * (allRooms[roomNumber].column-1) + lineInterval - 45, y:lineInterval * (allRooms[roomNumber].row-1)+(lineInterval/2)}
	
}

var player = function (initData){
	// characterType is one of the following:  barbarian, wizard, thief, elf, leader
	this.characterType = initData.characterType;
	this.token = initData.token;
	this.setToken = function (token){
		this.token = token;
	};
}

function mouseDownHandler(event)
{

var currentPoint = getMousePos(event);
// barricades are added so that later added barricades have a higher z-order
// that means if one is on top of the other the later added one will also
// need to be hitTested first. That means we need to iterate through
// the array from largest indext to smallest
	for (var tokenCount = allPlayers.length-1;tokenCount >=0;tokenCount--)
	{
	  if (hitTest(currentPoint, allPlayers[tokenCount].token))
	  {
		playerIdxMovingToken = tokenCount;
		currentToken = allPlayers[tokenCount].token;
		// the offset value is the diff. between the place inside the barricade
		// where the user clicked and the barricade's xy origin.
		currentToken.offSetX = currentPoint.x - currentToken.gridLocation.x;
		currentToken.offSetY = currentPoint.y - currentToken.gridLocation.y;
		currentToken.isMoving = true;
		currentToken.idx = tokenCount;
		hoverItem = currentToken;
		allPlayers[tokenCount].setToken(currentToken);
		console.log("b.x : " + currentToken.gridLocation.x + "  b.y : " + currentToken.gridLocation.y);
		mouseIsCaptured = true;
		window.addEventListener("mouseup",mouseUpHandler);
		break;
	  }
	}
}

function stopClock(){
	clearInterval(gameclockHandle);
}


function updateGameClock(){
	var el = document.getElementById("gameclock");
	gameclockSecondCounter++;
	el.innerHTML = gameclockSecondCounter;
}

function hitTestRoom(player){
	// pass in player object and check which room she has moved to
	// return room where player has moved her token
	
	for (var k = 0;k < allRooms.length; k++)
	{
		var testObjXmax = allRooms[k].maxPoint.x;// + 45;
		var testObjYmax = allRooms[k].maxPoint.y;// + hitTestObjArray[k].size;
		if ( ((player.token.gridLocation.x >= allRooms[k].minPoint.x) && (player.token.gridLocation.x <= testObjXmax)) && 
			((player.token.gridLocation.y >= allRooms[k].minPoint.y) && (player.token.gridLocation.y <= testObjYmax)))
		{
			return allRooms[k];
		}
	}
	return null;
}

function setPlayerDead(player){
	for (x = 0; x < allPlayers.length;x++){
		if (allPlayers[x].characterType == player.characterType){
			console.log(allPlayers[x].characterType + " confirmed dead.");
			allPlayers.splice(x,1);
			return;
		}
	}
}

function handlePlayerMovement(room, player){
	var output = document.getElementById("output");
	
	output.innerHTML = player.characterType + " moved into room " + room.location;
	if (room.location == GRID_SIZE){
		output.innerHTML += "  You've won!";
	}
	if (room.hasOgre){
		if (player.characterType != "barbarian"){
			output.innerHTML += "  An ogre leaps on you and kills you! " +  player.characterType + " is dead.";
			setPlayerDead(player);
			draw();
		}
		else{
			output.innerHTML += " You barbarian! You've killed an ogre.";
			room.hasOgre = false;
		}
	}
	
	if (room.hasTrap){
		if (player.characterType != "thief"){
			output.innerHTML +=  "  " + player.characterType + " has sprung a trap! "  +  player.characterType + " is dead.";
			setPlayerDead(player);
			draw();
		}
		else{
			output.innerHTML += "  You thief! You've disarmed a trap.";
			room.hasTrap = false;
		}
	}
	
	if (allPlayers.length <= 0){
			output.innerHTML += "  All your characters are dead.  You failed! :(";
			stopClock();
	}
	
}

function mouseUpHandler()
{
	if (mouseIsCaptured)
	{
		//playSound(POP,1);
	}
	mouseIsCaptured = false;
	for (var j = 0; j < allPlayers.length;j++)
	{
		allPlayers[j].token.isMoving = false;
		
	}
	window.removeEventListener("mousemove", mouseDownHandler);
	window.removeEventListener("mouseup", mouseUpHandler);
	
	var actionRoom = hitTestRoom(allPlayers[playerIdxMovingToken]);
	handlePlayerMovement(actionRoom, allPlayers[playerIdxMovingToken]);
	playerIdxMovingToken = -1;
}

function getMousePos(evt) {
	
	var rect = theCanvas.getBoundingClientRect();
	var currentPoint = new point();
	currentPoint.x = evt.clientX - rect.left;
	currentPoint.y = evt.clientY - rect.top;
	return currentPoint;
}
