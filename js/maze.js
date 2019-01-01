// board.js

// function definition
var n = 0;
var s = 1;
var e = 2;
var w = 3;
var ogres = [];
var traps = [];
possibleOgresAndTraps = [];

// path is an array of rooms used by generatePath()
	var path = [];
var ctx = null;
var theCanvas = null;
window.addEventListener("load", initApp);
var MAX_COLS = 6;//document.getElementById("colSize").value;
var GRID_SIZE = MAX_COLS*MAX_COLS;
var lineInterval = 0;
var boardPos = null;

var mouseIsCaptured = false;

function boardLoc (loc){
	this.x = loc.x;
	this.y = loc.y;
}

var cols = [];
function initCols(){
	for (x = 0; x< MAX_COLS;x++){
		cols.push(MAX_COLS*(x+1));
	}
}

var rows = []; 
function initRows(){
	for (x = 0; x< MAX_COLS +1;x++){
		rows.push(MAX_COLS*x+1);
	}
}

var allRooms = [];
initApp();
initializeRooms();
placeOgresAndTraps();
generatePath();

function initPossibles(){
	// location 1 and GRID_SIZE are off limits
	// since they are the enter and exit rooms
	for (x = 2; x < GRID_SIZE; x++){
		possibleOgresAndTraps.push(x);
	}
}

function drawPath(){
	ctx.strokeStyle = "darkorange";
	ctx.lineWidth = 2;
	ctx.beginPath();
	for(x = 0; x < path.length -1; x++){
		ctx.moveTo(path[x].textLocationX,path[x].textLocationY);
		ctx.lineTo(path[x+1].textLocationX,path[x+1].textLocationY);
		ctx.stroke();
	}
}

function placeOgresAndTraps(){
	ogres = [];
	traps = [];
	// ###  NOTES #########
	// An ogre and trap can never be in locations 30 & 35 (blocks exit) or
	// 2 and 7 (blocks entrance). 
	// ####################

	while (ogres.length < 5){ 
		console.log("possibleOgresAndTraps : " + possibleOgresAndTraps);
		var possibleOgre = possibleOgresAndTraps.splice(Math.floor((Math.random() * possibleOgresAndTraps.length)),1);
		ogres.push(possibleOgre);
		if (possibleOgre == 2 || possibleOgre == 7){
			if (possibleOgre - 2 == 0){
				// remove 7 from possibleOgresAndTraps
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(7),1);
			}
			else{
				//otherwise remove the 2
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(2),1);
			}
		}
		if (possibleOgre == 30 || possibleOgre == 35){
			if (possibleOgre - 30 == 0){
				// remove 35 from possibleOgresAndTraps
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(35),1);
			}
			else{
				//otherwise remove the 30
				possibleOgresAndTraps.splice(possibleOgresAndTraps.indexOf(30),1);
			}
		}
	}

/*	while (traps.length < 5){
		var possibleTrap = Math.ceil((Math.random() * (GRID_SIZE-2))+1);
		addTrap = true;
		for (x = 0; x< 5;x++){
			if (ogres[x] == possibleTrap){addTrap = false;continue;}
		}
		for (x = 0; x<5;x++){
			if (traps[x] == possibleTrap){addTrap = false;continue;}
		}
		if (addTrap){
			traps.push(possibleTrap);
		}
	} */
	drawTrapsAndOgres();
}

function drawTrapsAndOgres(){
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
	for(x = 0; x < ogres.length; x++){
		// NOTE: the +5 on the Y side is just to move the square down a bit
		// so you can read the direction letters.
		ctx.fillRect(allRooms[ogres[x]-1].textLocationX,allRooms[ogres[x]-1].textLocationY+5,15,15);
	}
	ctx.globalAlpha = 1;
}

function generatePath(){
	
	// we always push room 1 on first since that is always where we start.
	
	var roomIndex = 0;
	var currentRoom = allRooms[roomIndex];
	currentRoom.isPath = true;
	path.push(currentRoom);
	var counter = 0;
	console.log("In generatePath()...");
	
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
				if (!allRooms[(currentRoom.location -1) - MAX_COLS].isPath){
					currentRoom = allRooms[(currentRoom.location -1) - MAX_COLS];
				}
				else{
					continue;
				}
				break;
			}
			case 1 : {
				if (!allRooms[(currentRoom.location -1) + MAX_COLS].isPath){
					currentRoom = allRooms[(currentRoom.location -1) + MAX_COLS];
				}
				else{
					continue;
				}
				break;
			}
			case 2 : {
				if (!allRooms[(currentRoom.location -1) + 1].isPath){
					currentRoom = allRooms[(currentRoom.location -1) + 1];
				}
				else{
					continue;
				}
				break;
			}
			case 3 : {
				if (!allRooms[(currentRoom.location -1) - 1].isPath){
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
	initCols();
	initRows();
	
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
	this.init = function(){
		this.isPath = false; // it isn't on path until a path is generated
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
	allRooms = [];
	path = [];
	possibleOgresAndTraps = [];
	initPossibles();
	initializeRooms();
	placeOgresAndTraps();
	generatePath();
	draw();
}

function initApp()
{
	theCanvas = document.getElementById("gamescreen");
	ctx = theCanvas.getContext("2d");
	
	ctx.canvas.height  = window.innerHeight-5;
	ctx.canvas.width = ctx.canvas.height;
	boardPos = new boardLoc({x:ctx.canvas.width,y:ctx.canvas.height});
	
	//window.addEventListener("mousemove", handleMouseMove);
	window.addEventListener("resize", draw());

	lineInterval = Math.floor(ctx.canvas.width / MAX_COLS);
	initPossibles();
	draw();
}

var rightKey = true;
function moveBackground(evt){
	switch (evt.keyCode)
	{
		case 37 :
		{
			boardPos.x+=5; // left
			rightKey = false;
			draw();
			break;
		}
		case 39 : //right
		{
			boardPos.x-=5;
			rightKey = true;
			draw();
			break;
		}
	}
	
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
	
	
	// the -5 in the two following lines makes the canvas area, just slightly smaller
	// than the entire window.  this helps so the scrollbars do not appear.
	ctx.canvas.height  = window.innerHeight-5;
	ctx.canvas.width = ctx.canvas.height;
	ctx.strokeStyle = '#0000ff';
	
	//ctx.lineWidth = 10;
	
	//ctx.strokeRect(10,10,ctx.canvas.width-15, ctx.canvas.height-15);
	
	ctx.font = '10px sans-serif';
	
	var textOut = "Height: " + ctx.canvas.height + "\n";

	textOut += "Width: " + ctx.canvas.width + "\n";

	// ctx.fillText  (textOut, 50, 50);
	var board=document.getElementById("board");
	ctx.globalAlpha = .5;
	//ctx.drawImage(board,boardPos.x,0,ctx.canvas.height,ctx.canvas.width);
	ctx.globalAlpha = 1;
	lineInterval = Math.floor(ctx.canvas.width / MAX_COLS);

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
		drawPath();
	}
	drawTrapsAndOgres();
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
  console.log("hitTest...");
  var testObjXmax = hitTestObject.x + hitTestObject.width;
  var testObjYmax = hitTestObject.y + hitTestObject.height;
  if ( ((mouseLocation.x >= hitTestObject.x) && (mouseLocation.x <= testObjXmax)) && 
	((mouseLocation.y >= hitTestObject.y) && (mouseLocation.y <= testObjYmax)))
  {
	console.log("you got it");
	
	return true;
  }
  return false;
}

var point = function(x,y)
  {
    this.x = x;
    this.y = y;
  };

function mouseUpHandler()
{
	if (mouseIsCaptured)
	{
		playSound(POP,1);
	}
	mouseIsCaptured = false;
	for (var j = 0; j < allTokens.length;j++)
	{
		allTokens[j].isMoving = false;
	}
	//$("#canvas").die("mousemove");
	window.removeEventListener("mousemove");
	//clearInterval(stopDraw);
	// draw once more to make sure item is at last location
	//draw();
	//console.log("mouseUpHandler");
	window.removeEventListener("mouseup");
}

   function getMousePos(evt) {
        
        var rect = theCanvas.getBoundingClientRect();
        var currentPoint = new point();
        currentPoint.x = evt.clientX - rect.left;
        currentPoint.y = evt.clientY - rect.top;
        return currentPoint;
  }