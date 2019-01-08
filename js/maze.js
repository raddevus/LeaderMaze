// maze.js

window.addEventListener("load",initApp);

function initGrid(){
	gameVars.PREV_COL_SIZE = gameVars.MAX_COLS;
	gameVars.MAX_COLS = Number(gameVars.maxColElement.value);
	gameVars.GRID_SIZE = gameVars.MAX_COLS*gameVars.MAX_COLS;
	initCols();
	initRows();
}


function initCols(){
	gameVars.cols=[];
	for (x = 0; x< gameVars.MAX_COLS;x++){
		gameVars.cols.push(gameVars.MAX_COLS*(x+1));
	}
}


function initRows(){
	gameVars.rows=[];
	for (x = 0; x< gameVars.MAX_COLS +1;x++){
		gameVars.rows.push(gameVars.MAX_COLS*x+1);
	}
}

function initPossibles(){
	// location 1 and gameVars.GRID_SIZE are off limits
	// since they are the enter and exit rooms
	for (x = 2; x < gameVars.GRID_SIZE; x++){
		gameVars.possibleOgresAndTraps.push(x);
	}
}

function drawPathSteps(){
	gameVars.ctx.strokeStyle = "darkorange";
	gameVars.ctx.beginPath();
	gameVars.ctx.lineWidth = 2;
	if (gameVars.pathIndexer < gameVars.path.length -1){
		gameVars.ctx.moveTo(gameVars.path[gameVars.pathIndexer].textLocationX,gameVars.path[gameVars.pathIndexer].textLocationY);
		gameVars.ctx.lineTo(gameVars.path[gameVars.pathIndexer+1].textLocationX,gameVars.path[gameVars.pathIndexer+1].textLocationY);
		gameVars.ctx.stroke();
		gameVars.pathIndexer++;
		setTimeout(drawPathSteps,100);
	}
	else{
		gameVars.pathIndexer = 0;
	}
	
}

function drawPath(){
	setTimeout(drawPathSteps, 100);
}

function placeOgresAndTraps(){
	gameVars.ogres = [];
	gameVars.traps = [];
	// ###  NOTES #########
	// An ogre and trap can never be in locations 30 & 35 (blocks exit) or
	// 2 and 7 (blocks entrance). 
	// ####################

	while (gameVars.ogres.length < gameVars.MAX_OGRES_TRAPS){ 
		var possibleOgre = gameVars.possibleOgresAndTraps.splice(Math.floor((Math.random() * gameVars.possibleOgresAndTraps.length)),1);
		gameVars.ogres.push(possibleOgre);
		if (possibleOgre == gameVars.unblockedRooms[0] || possibleOgre == gameVars.unblockedRooms[1]){
			if (possibleOgre - gameVars.unblockedRooms[0] == 0){
				gameVars.possibleOgresAndTraps.splice(gameVars.possibleOgresAndTraps.indexOf(gameVars.unblockedRooms[1]),1);
			}
			else{
				gameVars.possibleOgresAndTraps.splice(gameVars.possibleOgresAndTraps.indexOf(gameVars.unblockedRooms[0]),1);
			}
		}
		if (possibleOgre == gameVars.unblockedRooms[2] || possibleOgre == gameVars.unblockedRooms[3]){
			if (possibleOgre - gameVars.unblockedRooms[2] == 0){
				gameVars.possibleOgresAndTraps.splice(gameVars.possibleOgresAndTraps.indexOf(gameVars.unblockedRooms[3]),1);
			}
			else{
				gameVars.possibleOgresAndTraps.splice(gameVars.possibleOgresAndTraps.indexOf(gameVars.unblockedRooms[2]),1);
			}
		}
	}

	while (gameVars.traps.length < gameVars.MAX_OGRES_TRAPS){
		var possibleTrap = gameVars.possibleOgresAndTraps.splice(Math.floor((Math.random() * gameVars.possibleOgresAndTraps.length)),1);
		gameVars.traps.push(possibleTrap);
		if (possibleTrap == gameVars.unblockedRooms[0] || possibleTrap == gameVars.unblockedRooms[1]){
			if (possibleTrap - gameVars.unblockedRooms[0] == 0){
				gameVars.possibleOgresAndTraps.splice(gameVars.possibleOgresAndTraps.indexOf(gameVars.unblockedRooms[1]),1);
			}
			else{
				gameVars.possibleOgresAndTraps.splice(gameVars.possibleOgresAndTraps.indexOf(gameVars.unblockedRooms[0]),1);
			}
		}
		if (possibleTrap == gameVars.unblockedRooms[2] || possibleTrap == gameVars.unblockedRooms[3]){
			if (possibleTrap - gameVars.unblockedRooms[2] == 0){
				gameVars.possibleOgresAndTraps.splice(gameVars.possibleOgresAndTraps.indexOf(gameVars.unblockedRooms[3]),1);
			}
			else{
				gameVars.possibleOgresAndTraps.splice(gameVars.possibleOgresAndTraps.indexOf(gameVars.unblockedRooms[2]),1);
			}
		}
	} 
	drawTrapsAndOgres();
}

function addOgresAndTrapsToRooms(){
	for (o = 0; o < gameVars.ogres.length; o++){
		gameVars.allRooms[gameVars.ogres[o]-1].hasOgre = true;
	}
	for (t = 0; t < gameVars.traps.length; t++){
		gameVars.allRooms[gameVars.traps[t]-1].hasTrap = true;
	}

}

function drawTrapsAndOgres(){
	if (!gameVars.isChallengesDisplayed){
		// user has turned off the display of challengesCheck
		return;
	}
	// DRAW TRAPS
	gameVars.ctx.globalAlpha = .5;
	gameVars.ctx.fillStyle = "red";
	for(x = 0; x < gameVars.traps.length; x++){
		// NOTE: the +5 on the Y side is just to move the square down a bit
		// so you can read the direction letters.
		gameVars.ctx.fillRect(gameVars.allRooms[gameVars.traps[x]-1].textLocationX,gameVars.allRooms[gameVars.traps[x]-1].textLocationY+5,15,15);
	}
	
	// DRAW gameVars.ogres
	
	gameVars.ctx.fillStyle = "darkgreen";
	gameVars.ctx.strokeStyle = '#003300';
	gameVars.ctx.lineWidth = 1;
	for(x = 0; x < gameVars.ogres.length; x++){
		// NOTE: the +5 on the Y side is just to move the square down a bit
		// so you can read the direction letters.
		gameVars.ctx.beginPath();	
		gameVars.ctx.arc(gameVars.allRooms[gameVars.ogres[x]-1].textLocationX,gameVars.allRooms[gameVars.ogres[x]-1].textLocationY +8, 7, 0, 2 * Math.PI, false);
		gameVars.ctx.fillStyle = 'green';
		gameVars.ctx.fill();
		gameVars.ctx.stroke();
	}
	gameVars.ctx.globalAlpha = 1;
}

function generatePath(){
	
	var roomIndex = 0;
	gameVars.currentRoom = gameVars.allRooms[roomIndex];
	gameVars.currentRoom.isPath = true;
	// we always push room 1 on first since that is always where we start.
	gameVars.path.push(gameVars.currentRoom);
	var counter = 0;
	
	// Requirement is that the room cannot be added to the path if it has already been added
		
	while (gameVars.currentRoom.location != gameVars.GRID_SIZE && counter < gameVars.GRID_SIZE * 3){
		counter++;
		// determine which way to exit from possible exits (doors)
		var doorIndex = getExitDoor(gameVars.currentRoom.doors);
		// doorIndex  0 = n (subtract 1 from row)
		// 1 = s (add one to row)
		// 2 = e (add one to column)
		// 3 = w (subtract one from column)
		switch (doorIndex){
			case 0 : {
				if (!gameVars.allRooms[(gameVars.currentRoom.location -1) - gameVars.MAX_COLS].isPath
				&& !gameVars.allRooms[(gameVars.currentRoom.location -1) - gameVars.MAX_COLS].hasOgre
				&& !gameVars.allRooms[(gameVars.currentRoom.location -1) - gameVars.MAX_COLS].hasTrap){
					gameVars.currentRoom = gameVars.allRooms[(gameVars.currentRoom.location -1) - gameVars.MAX_COLS];
				}
				else{
					continue;
				}
				break;
			}
			case 1 : {
				if (!gameVars.allRooms[(gameVars.currentRoom.location -1) + gameVars.MAX_COLS].isPath
				&& !gameVars.allRooms[(gameVars.currentRoom.location -1) + gameVars.MAX_COLS].hasOgre
				&& !gameVars.allRooms[(gameVars.currentRoom.location -1) + gameVars.MAX_COLS].hasTrap){
					gameVars.currentRoom = gameVars.allRooms[(gameVars.currentRoom.location -1) + gameVars.MAX_COLS];
				}
				else{
					continue;
				}
				break;
			}
			case 2 : {
				if (!gameVars.allRooms[(gameVars.currentRoom.location -1) + 1].isPath
				&& !gameVars.allRooms[(gameVars.currentRoom.location -1) + 1].hasOgre
				&& !gameVars.allRooms[(gameVars.currentRoom.location -1) + 1].hasTrap){
					gameVars.currentRoom = gameVars.allRooms[(gameVars.currentRoom.location -1) + 1];
				}
				else{
					continue;
				}
				break;
			}
			case 3 : {
				if (!gameVars.allRooms[(gameVars.currentRoom.location -1) - 1].isPath
				&& !gameVars.allRooms[(gameVars.currentRoom.location -1) - 1].hasOgre
				&& !gameVars.allRooms[(gameVars.currentRoom.location -1) - 1].hasTrap){
					gameVars.currentRoom = gameVars.allRooms[(gameVars.currentRoom.location -1) - 1];
				}
				else{
					continue;
				}
				break;
			}
		}
		gameVars.currentRoom.isPath = true;
		gameVars.path.push(gameVars.currentRoom);
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
	
	for (var i = 1; i <=gameVars.GRID_SIZE;i++){
		gameVars.allRooms.push(new room({location:i}));
		gameVars.allRooms[i-1].init();
	}
}

function DrawDirections(room){
    
	gameVars.ctx.strokeStyle = '#ff000';
	gameVars.ctx.globalAlpha = 1;
	gameVars.ctx.fillText(getPossibleDirections(room.doors), room.textLocationX,room.textLocationY);
	gameVars.ctx.fillText(room.location, room.textLocationX, room.textLocationY + 10);
	
}

function getRowNumber(location){
	for (var x =0; x < gameVars.cols.length;x++){
		if (gameVars.cols[x] - location >= 0){
			// return column number as index + 1
			var row = x+1;
			return x+1;
		}
	}
}

function getColumnNumber(location){
	for (var x =0; x < gameVars.rows.length;x++){
		if (gameVars.rows[x] - location >= 0){
			var col = x+1;
			if (location <= gameVars.MAX_COLS){
				return location % gameVars.MAX_COLS == 0 ? location  : location % gameVars.MAX_COLS;
			}
			else{
				return location % gameVars.MAX_COLS == 0 ? location - (gameVars.MAX_COLS*(x-1))  : location % gameVars.MAX_COLS;
			}
		}
	}
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

function reTryPath(){
	initGrid();
	if (gameVars.MAX_COLS != gameVars.PREV_COL_SIZE){
			initApp();
			return;
	}
	gameVars.path= [];
	initPossibles();
	initializeRooms();
	addOgresAndTrapsToRooms();
	generatePath();
	draw();
}

function retryUntilSolved(){
	initGrid();
	if (gameVars.MAX_COLS != gameVars.PREV_COL_SIZE){
			initApp();
			return;
	}
	gameVars.solutionAttempts = 0;
	while (gameVars.solutionAttempts < gameVars.MAX_ATTEMPTS && gameVars.currentRoom.location != gameVars.GRID_SIZE){
		gameVars.path= [];
		initPossibles();
		initializeRooms();
		addOgresAndTrapsToRooms();
		generatePath();
		draw();
		console.log("gameVars.solutionAttempts : " + gameVars.solutionAttempts++);
	}
	setTimeout(displayResults,1300);
}

function displayResults(){
	if (gameVars.solutionAttempts <= gameVars.MAX_ATTEMPTS && gameVars.currentRoom.location == gameVars.GRID_SIZE){
		alert ("Solved it in " + gameVars.solutionAttempts + " gameVars.solutionAttempts.");
	}
	if (gameVars.solutionAttempts >=gameVars.MAX_ATTEMPTS && gameVars.currentRoom.location != gameVars.GRID_SIZE){
		alert("Most likely, this map is unsolvable.");
	}
	
	
}

function initUnblockedRooms(){
	gameVars.unblockedRooms.push(2); // 2 is always one no matter grid size.
	gameVars.unblockedRooms.push(gameVars.MAX_COLS+1); // first room of 2nd row
	gameVars.unblockedRooms.push(gameVars.MAX_COLS*(gameVars.MAX_COLS-1)); // last room of 2nd to last row
	gameVars.unblockedRooms.push(gameVars.GRID_SIZE-1); // 2nd to last room
}

function initCanvas(){
	
	gameVars.ctx.canvas.height  = (window.innerHeight - gameVars.lineInterval);
	gameVars.ctx.canvas.width = gameVars.ctx.canvas.height;
	
	gameVars.lineInterval = Math.floor(gameVars.ctx.canvas.width / gameVars.MAX_COLS);
	
	// the -5 in the two following lines makes the canvas area, just slightly smaller
	// than the entire window.  this helps so the scrollbars do not appear.
	gameVars.ctx.canvas.height  = (window.innerHeight-gameVars.lineInterval);
	gameVars.ctx.canvas.width = gameVars.ctx.canvas.height;
	gameVars.ctx.strokeStyle = '#0000ff';

	gameVars.ctx.font = '10px sans-serif';

	gameVars.ctx.globalAlpha = 1;
	gameVars.lineInterval = Math.floor(gameVars.ctx.canvas.width / gameVars.MAX_COLS);
}

function initApp()
{
	console.log("in initapp...");
	gameVars = new GameVars();

	initGrid();	
	
	gameVars.theCanvas = document.getElementById("gamescreen");
	gameVars.ctx = gameVars.theCanvas.getContext("2d");
	
	initCanvas();
	
	window.addEventListener("resize", initApp);
	window.addEventListener("orientationchange", initApp);
	window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mousedown", mouseDownHandler);

	initUnblockedRooms();
	initPossibles();
	initializeRooms();
	placeOgresAndTraps();
	addOgresAndTrapsToRooms();
	generatePath();
	
	initPlayers();
	initTokens(45,60,gameVars.allPlayers.length,"characterSet1",gameVars.allPlayers);
	initGameItems();
	initTokens(30,30,gameVars.allGameItems.length,"items",gameVars.allGameItems);
	setPlayerStartPositions();
	draw();
	drawGameItems();
	

}

function drawClippedAsset(sx,sy,swidth,sheight,x,y,w,h,imageId)
{
	var img = document.getElementById(imageId);
	if (img != null)
	{
		gameVars.ctx.drawImage(img,sx,sy,swidth,sheight,x,y,w,h);
	}
}

function drawGameItems(){
	
    for (var tokenCount = 0; tokenCount < gameVars.allGameItems.length; tokenCount++) {
		drawClippedAsset(
			gameVars.allGameItems[tokenCount].token.imgSourceX,
			gameVars.allGameItems[tokenCount].token.imgSourceY,
			gameVars.allGameItems[tokenCount].token.imgSourceSize,
			gameVars.allGameItems[tokenCount].token.imgSourceSize,
			gameVars.allGameItems[tokenCount].token.gridLocation.x,
			gameVars.allGameItems[tokenCount].token.gridLocation.y,
			gameVars.allGameItems[tokenCount].token.size,
			gameVars.allGameItems[tokenCount].token.size,
			gameVars.allGameItems[tokenCount].token.imgIdTag
		);
    }
	// if the mouse is hovering over the location of a token, show yellow highlight
    if (gameVars.hoverToken !== null && gameVars.hoverToken != undefined) {
        gameVars.ctx.fillStyle = "yellow";
        gameVars.ctx.globalAlpha = .5;
        gameVars.ctx.fillRect(gameVars.hoverToken.gridLocation.x, gameVars.hoverToken.gridLocation.y, 
                  gameVars.hoverToken.size, gameVars.hoverToken.size);
        gameVars.ctx.globalAlpha = 1;
		drawClippedAsset(
			gameVars.hoverToken.imgSourceX,
			gameVars.hoverToken.imgSourceY,
			gameVars.hoverToken.imgSourceSize,
			gameVars.hoverToken.imgSourceSize,
			gameVars.hoverToken.gridLocation.x,
			gameVars.hoverToken.gridLocation.y,
			gameVars.hoverToken.size,
			gameVars.hoverToken.size,
			gameVars.hoverToken.imgIdTag
		);
    }
}

function draw() {
	
	
	initCanvas();

	for (var lineCount=0;lineCount<gameVars.MAX_COLS;lineCount++)
	{
		gameVars.ctx.fillStyle="blue";
		gameVars.ctx.fillRect(0,gameVars.lineInterval*(lineCount+1),gameVars.ctx.canvas.width,2);
		gameVars.ctx.fillRect(gameVars.lineInterval*(lineCount+1),0,2,gameVars.ctx.canvas.width);
	}
	
	if (gameVars.allRooms !== undefined){
		for (var i = 1; i <=gameVars.GRID_SIZE;i++){
			if  (gameVars.allRooms[i-1] !== undefined && gameVars.allRooms[i-1].doors !== undefined){
				DrawDirections(gameVars.allRooms[i-1]);
			}
		}
	}
	if (gameVars.path.length > 0){
		//drawPath();
	}
	drawTrapsAndOgres();
	
	// draw each token it its current location
    for (var tokenCount = 0; tokenCount < gameVars.allPlayers.length; tokenCount++) {
		drawClippedAsset(
			gameVars.allPlayers[tokenCount].token.imgSourceX,
			gameVars.allPlayers[tokenCount].token.imgSourceY,
			gameVars.allPlayers[tokenCount].token.imgSourceSize,
			gameVars.allPlayers[tokenCount].token.imgSourceSize,
			gameVars.allPlayers[tokenCount].token.gridLocation.x,
			gameVars.allPlayers[tokenCount].token.gridLocation.y,
			gameVars.allPlayers[tokenCount].token.size,
			gameVars.allPlayers[tokenCount].token.size,
			gameVars.allPlayers[tokenCount].token.imgIdTag
		);
    }
	// if the mouse is hovering over the location of a token, show yellow highlight
    if (gameVars.hoverToken !== null && gameVars.hoverToken != undefined) {
        gameVars.ctx.fillStyle = "yellow";
        gameVars.ctx.globalAlpha = .5;
		
        gameVars.ctx.fillRect(gameVars.hoverToken.gridLocation.x, gameVars.hoverToken.gridLocation.y, 
                  gameVars.hoverToken.size, gameVars.hoverToken.size);
        gameVars.ctx.globalAlpha = 1;
		drawClippedAsset(
			gameVars.hoverToken.imgSourceX,
			gameVars.hoverToken.imgSourceY,
			gameVars.hoverToken.imgSourceSize,
			gameVars.hoverToken.imgSourceSize,
			gameVars.hoverToken.gridLocation.x,
			gameVars.hoverToken.gridLocation.y,
			gameVars.hoverToken.size,
			gameVars.hoverToken.size,
			gameVars.hoverToken.imgIdTag
		);
    }
}

function displayChallengesClicked(){
	if (gameVars.challengesCheck.checked == true){
		gameVars.isChallengesDisplayed = true;
		draw();
	}
	else{
		gameVars.isChallengesDisplayed = false;
		draw();
		console.log(gameVars.isChallengesDisplayed);
	}
}

function gameItem(initData){
	this.token = initData.token;
	this.isAvailable = true;
	this.type = initData.type;
	this.useCounter = 0;
	this.setToken = function (token){
		this.token = token;
	};
	this.sniff = function (actionRoom){
		if (this.useCounter < 3){
			this.useCounter++;
			gameVars.outputElement.innerHTML = "The elf has just sniffed from room " + actionRoom.location + ". Ogres will be revealed.";
		}
		else{
			gameVars.outputElement.innerHTML = "The elf has no more powers of sniff left.";
		}
	};
}

function initTokens(iconSize,sizeInBitmap,iconCount,imageIdTag,targetArray){
	var currentToken =null;
	// add a token to each player
	for (var i = 0; i < iconCount;i++)
	{
		currentToken = new token({
				size:iconSize,
				imgSourceX:i*sizeInBitmap,
				imgSourceY:0*sizeInBitmap,
				imgSourceSize:sizeInBitmap,
				imgIdTag:imageIdTag,
				gridLocation: new gridlocation({x:i*iconSize,y:iconCount*iconSize})
			});
			targetArray[i].setToken(currentToken);
	}
}

function mouseMoveHandler(e)
{
    if (gameVars.mouseIsCaptured)
    {    
        if (hoverItem.isMoving)
        {
			var hoverItemPoint = getMousePos(e);
			hoverItem.gridLocation.x = hoverItemPoint.x - hoverItem.offSetX;
			hoverItem.gridLocation.y = hoverItemPoint.y - hoverItem.offSetY;
			
			//45 on next line is width/height of each token - needs to be variable later
			var maxGridLocation = gameVars.lineInterval * (gameVars.MAX_COLS) -45;
			
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
		drawGameItems();
    }
    // otherwise user is just moving mouse / highlight tokens
    else
    {
		var playerTokens = [];
		for (x = 0; x < gameVars.allPlayers.length;x++){
			playerTokens.push(gameVars.allPlayers[x].token);
		}
        gameVars.hoverToken = hitTestHoverItem(getMousePos(e), playerTokens);
        draw();
		var itemTokens = [];
		for (x = 0; x < gameVars.allGameItems.length;x++){
			itemTokens.push(gameVars.allGameItems[x].token);
		}
        gameVars.hoverToken = hitTestHoverItem(getMousePos(e), itemTokens);
		drawGameItems();
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

function initPlayers(){
	gameVars.allPlayers.push (new player({characterType: "barbarian", hasAbility: true, token: new token()})); 
	gameVars.allPlayers.push (new player({characterType: "wizard", hasAbility: false, token: new token()})); 
	gameVars.allPlayers.push (new player({characterType: "thief", hasAbility: true, token: new token()})); 
	gameVars.allPlayers.push (new player({characterType: "elf", hasAbility: false, token: new token()})); 
	gameVars.allPlayers.push (new player({characterType: "leader", hasAbility: false, token: new token()})); 
}

function initGameItems(){
	gameVars.allGameItems.push(new gameItem({type:"greater", token: new token()}));
	gameVars.allGameItems.push(new gameItem({type:"sniff", token: new token()}));
}

function setPlayerStartPositions(){
	var roomNumber = 0;
	// barbarian
	gameVars.allPlayers[0].token.gridLocation = {x:gameVars.lineInterval * (gameVars.allRooms[roomNumber].column-1), y:gameVars.lineInterval * (gameVars.allRooms[roomNumber].row-1)}
	//wizard  
	// wizardOffset 
	var wizardOffset = gameVars.lineInterval
	gameVars.allPlayers[1].token.gridLocation = {x:gameVars.lineInterval * (gameVars.allRooms[roomNumber].column-1) + gameVars.lineInterval - 45, y:gameVars.lineInterval * (gameVars.allRooms[roomNumber].row-1)}
	// thief
	gameVars.allPlayers[2].token.gridLocation = {x:gameVars.lineInterval * (gameVars.allRooms[roomNumber].column-1) + (gameVars.lineInterval /2 ) -15, y:gameVars.lineInterval * (gameVars.allRooms[roomNumber].row-1) + (gameVars.lineInterval /2) -20}
	//elf
	gameVars.allPlayers[3].token.gridLocation = {x:gameVars.lineInterval * (gameVars.allRooms[roomNumber].column-1), y:gameVars.lineInterval * (gameVars.allRooms[roomNumber].row-1)+(gameVars.lineInterval/2)}
	//leader
	gameVars.allPlayers[4].token.gridLocation = {x:gameVars.lineInterval * (gameVars.allRooms[roomNumber].column-1) + gameVars.lineInterval - 45, y:gameVars.lineInterval * (gameVars.allRooms[roomNumber].row-1)+(gameVars.lineInterval/2)}
	
}

function mouseDownHandler(event)
{

	var currentPoint = getMousePos(event);
	// barricades are added so that later added barricades have a higher z-order
	// that means if one is on top of the other the later added one will also
	// need to be hitTested first. That means we need to iterate through
	// the array from largest indext to smallest
	for (var tokenCount = gameVars.allPlayers.length-1;tokenCount >=0;tokenCount--)
	{
	  if (hitTest(currentPoint, gameVars.allPlayers[tokenCount].token))
	  {
		// playerItemTokenIdx > -1 means that a player gameItem is being dragged around
		gameVars.playerTokenIdx = tokenCount;
		currentToken = gameVars.allPlayers[tokenCount].token;
		// the offset value is the diff. between the place inside the barricade
		// where the user clicked and the barricade's xy origin.
		currentToken.offSetX = currentPoint.x - currentToken.gridLocation.x;
		currentToken.offSetY = currentPoint.y - currentToken.gridLocation.y;
		currentToken.isMoving = true;
		currentToken.idx = tokenCount;
		hoverItem = currentToken;
		gameVars.allPlayers[tokenCount].setToken(currentToken);
		console.log("b.x : " + currentToken.gridLocation.x + "  b.y : " + currentToken.gridLocation.y);
		gameVars.mouseIsCaptured = true;
		window.addEventListener("mouseup",mouseUpHandler);
		return;
	  }
	}
	for (var tokenCount = gameVars.allGameItems.length-1;tokenCount >=0;tokenCount--)
	{
	  if (hitTest(currentPoint, gameVars.allGameItems[tokenCount].token))
	  {
		// gameVars.gameItemTokenIdx > -1 means that a gameItem is being dragged around
		gameVars.gameItemTokenIdx = tokenCount;
		currentToken = gameVars.allGameItems[tokenCount].token;
		// the offset value is the diff. between the place inside the barricade
		// where the user clicked and the barricade's xy origin.
		currentToken.offSetX = currentPoint.x - currentToken.gridLocation.x;
		currentToken.offSetY = currentPoint.y - currentToken.gridLocation.y;
		currentToken.isMoving = true;
		currentToken.idx = tokenCount;
		hoverItem = currentToken;
		gameVars.allGameItems[tokenCount].setToken(currentToken);
		console.log("b.x : " + currentToken.gridLocation.x + "  b.y : " + currentToken.gridLocation.y);
		gameVars.mouseIsCaptured = true;
		window.addEventListener("mouseup",mouseUpHandler);
		return;
	  }
	}
}

function stopClock(){
	clearInterval(gameVars.gameclockHandle);
}


function updateGameClock(){
	var el = document.getElementById("gameclock");
	gameVars.gameclockSecondCounter++;
	el.innerHTML = gameVars.gameclockSecondCounter;
}

function hitTestRoom(player){
	// pass in player object and check which room she has moved to
	// return room where player has moved her token
	
	for (var k = 0;k < gameVars.allRooms.length; k++)
	{
		var testObjXmax = gameVars.allRooms[k].maxPoint.x;// + 45;
		var testObjYmax = gameVars.allRooms[k].maxPoint.y;// + hitTestObjArray[k].size;
		if ( ((player.token.gridLocation.x >= gameVars.allRooms[k].minPoint.x) && (player.token.gridLocation.x <= testObjXmax)) && 
			((player.token.gridLocation.y >= gameVars.allRooms[k].minPoint.y) && (player.token.gridLocation.y <= testObjYmax)))
		{
			return gameVars.allRooms[k];
		}
	}
	return null;
}

function setPlayerDead(player){
	for (x = 0; x < gameVars.allPlayers.length;x++){
		if (gameVars.allPlayers[x].characterType == player.characterType){
			console.log(gameVars.allPlayers[x].characterType + " confirmed dead.");
			gameVars.allPlayers.splice(x,1);
			return;
		}
	}
}

function playerMovementHandler(playerTokenIdx){
	var output = document.getElementById("output");
	var player = gameVars.allPlayers[playerTokenIdx];
	room = hitTestRoom(player);
	if (room == null) { 
		return; // couldn't get room -- this is because of current issue with landing between rooms.
	}
	output.innerHTML = player.characterType + " moved into room " + room.location;
	if (room.location == gameVars.GRID_SIZE){
		output.innerHTML += "  You've won!";
	}
	if (room.hasOgre){
		if (player.characterType == "barbarian" && player.hasSpecialAbility){
			output.innerHTML += " You barbarian! You've killed an ogre. Beware! You will not survive the next ogre you meet.";
			room.hasOgre = false;
			player.hasSpecialAbility = false;
		}
		else{
			output.innerHTML += "  An ogre leaps on you and kills you! " +  player.characterType + " is dead.";
			setPlayerDead(player);
			draw();

		}
	}
	
	if (room.hasTrap){
		if (player.characterType == "thief" && player.hasSpecialAbility){
			output.innerHTML += "  You thief! You've disarmed a trap.  Beware! You will not survive the next trap you find.";
			room.hasTrap = false;
			player.hasSpecialAbility = false;
		}
		else{
			output.innerHTML +=  "  " + player.characterType + " has sprung a trap! "  +  player.characterType + " is dead.";
			setPlayerDead(player);
			draw();
			
		}
	}
	
	if (gameVars.allPlayers.length <= 0){
			output.innerHTML += "  All your characters are dead.  You failed! :(";
			stopClock();
	}
	
}

function gameItemDropHandler(tokenIdx){
	var gameItem = gameVars.allGameItems[tokenIdx];
	var actionRoom = hitTestRoom(gameItem);
	if (actionRoom == null){
		return; // couldn't get valid room due to other bad code
	}
	if (gameItem.type == "sniff"){
		gameItem.sniff(actionRoom);
	}
	if (gameItem.type == "greater"){
		output.innerHTML = "The wizard has just cast a greater knowledge spell on room " + actionRoom.location + ".  Existing challenges will be revealed.";
	}
	
}

function mouseUpHandler()
{
	if (gameVars.mouseIsCaptured)
	{
		//playSound(POP,1);
	}
	gameVars.mouseIsCaptured = false;
	for (var j = 0; j < gameVars.allPlayers.length;j++)
	{
		gameVars.allPlayers[j].token.isMoving = false;
		
	}
	window.removeEventListener("mousemove", mouseDownHandler);
	window.removeEventListener("mouseup", mouseUpHandler);
	
	if (gameVars.playerTokenIdx > -1){
		playerMovementHandler(gameVars.playerTokenIdx);
		gameVars.playerTokenIdx = -1;
	}
	if (gameVars.gameItemTokenIdx > -1){
		gameItemDropHandler(gameVars.gameItemTokenIdx);
		gameVars.gameItemTokenIdx = -1;
	}
}

function getMousePos(evt) {
	
	var rect = gameVars.theCanvas.getBoundingClientRect();
	var currentPoint = new point();
	currentPoint.x = evt.clientX - rect.left;
	currentPoint.y = evt.clientY - rect.top;
	return currentPoint;
}

// #########################################################################
// #########################################################################
// ###################  THESE ARE ALL THE SPECIAL TYPES USED THROUGHOUT ####
// #########################################################################

function GameVars (){
	this.n = 0;
	this.s = 1;
	this.e = 2;
	this.w = 3;

	this.allGameItems = [];
	this.allPlayers = [];
	this.allRooms = [];
	this.cols = [];
	this.ogres = [];
	this.path = [];
	this.possibleOgresAndTraps = [];
	this.rows = [];
	this.traps = [];
	this.unblockedRooms = [];

	this.pathIndexer = 0;
	// hoverToken -- token being hovered over with mouse
	this.hoverToken = null;


	this.gameclockSecondCounter = 0;
	this.gameclockHandle = null;

	this.playerTokenIdx = -1;
	this.gameItemTokenIdx = -1;

	// we have a scoreboard that takes up the top 50px so 
	// the canvas is always offset by 50px (value is set up in css scoreboard element)
	//this.gridTopOffset = 50;

	this.currentRoom = null;
	this.maxColElement = document.getElementById("maxCols");
	this.challengesCheck = document.getElementById("challengesCheck");
	this.outputElement = document.getElementById("output");
	this.superstar = 33;
	this.isChallengesDisplayed = true;
	this.MAX_COLS = Number(this.maxColElement.value);
	this.GRID_SIZE = this.MAX_COLS*this.MAX_COLS;
	this.PREV_COL_SIZE = this.MAX_COLS;
	this.MAX_ATTEMPTS = 500;
	this.MAX_OGRES_TRAPS = 5;
	this.solutionAttempts = 0;
	// path is an array of rooms used by generatePath()

	this.ctx = null;
	this.theCanvas = null;
	this.lineInterval = 0;

	this.mouseIsCaptured = false;

	console.log("before initapp...");
	//initApp();
	console.log("after window.addEventListener(load, initApp)");
	return this;
};

var player = function (initData){
	// characterType is one of the following:  barbarian, wizard, thief, elf, leader
	this.characterType = initData.characterType;
	this.hasSpecialAbility = initData.hasAbility;
	this.token = initData.token;
	this.setToken = function (token){
		this.token = token;
	};
}

var point = function(x,y)
{
	this.x = x;
	this.y = y;
};

var room = function(roomInfo){
	// location is a value from 1 to gameVars.MAX_COLS
	if (roomInfo != undefined && roomInfo != null){
		//console.log("roomInfo.location : " + roomInfo.location);
		this.location = roomInfo.location;
	}
	// we will use visited to determine if user has already been in this room
	// room 1 is always initially visited since that is where user starts
	this.visited = this.location == 1 ? true : false;
	
	this.doors = [0,0,0,0];
	this.column = getColumnNumber(this.location);
	this.row = getRowNumber(this.location);
	this.textLocationX = (this.column *(gameVars.lineInterval )) - (gameVars.lineInterval /2);
	this.textLocationY = (this.row * (gameVars.lineInterval )) - (gameVars.lineInterval /2);
	this.minPoint = new point ((this.column-1) * gameVars.lineInterval, (this.row-1)*gameVars.lineInterval);
	this.maxPoint = new point ((this.column) * gameVars.lineInterval, (this.row)*gameVars.lineInterval);;
	
	this.init = function(){
		this.isPath = false; // it isn't on path until a path is generated
		this.hasOgre = false;
		this.hasTrap = false;
		// ###### If this is the first row, set up directions
		if (this.row == 1){
			this.doors[gameVars.s] = 1;
			if (this.column != 1){
				this.doors[gameVars.w] = 1;
			}
			if (this.column != gameVars.MAX_COLS){
				this.doors[gameVars.e] =1;
			}
		}
		
		if (this.location % gameVars.MAX_COLS == 0){
			this.doors[gameVars.w] = 1;
			if (this.location != gameVars.GRID_SIZE){
				this.doors[gameVars.s] = 1;
			}
			if (this.location != gameVars.MAX_COLS){
				this.doors[gameVars.n] = 1;
			}
		}

		if (this.column != 1 && this.column != gameVars.MAX_COLS){
			if (this.row != 1 && this.row != gameVars.MAX_COLS){
				this.doors[gameVars.n] = this.doors[gameVars.s] = this.doors[gameVars.e] = this.doors[gameVars.w] = 1;
			}
		}
		
		if (this.column == 1 && this.row !=1 && this.row != gameVars.MAX_COLS){
			this.doors[gameVars.n] = this.doors[gameVars.s] = this.doors[gameVars.e] = 1;
		}

		// ##### If this is the last row set up directions
		if (this.row == gameVars.MAX_COLS){
			this.doors[gameVars.n] = 1;
			if (this.column != 1){
				this.doors[gameVars.w]=1;
			}
			if (this.column != gameVars.MAX_COLS){
				this.doors[gameVars.e] = 1;
			}
		}
	}
	// locations 1 - 6 cannot have up as a direction
	// locations 1,7,13,19,25,31 cannot have west as a direction
	// locations 31 - 36 cannot have down as a direction
	// locations 6, 12, 18, 24, 30, 36 cannot have right as direction
	//var doors = []; // contains four values (u,d,l,r) either 0 or 1
	
};

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

// ########################## END OF SPECIAL TYPES #########################
// #########################################################################
// #########################################################################