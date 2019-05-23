// gametypes.ts
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
	this.revealedItemRoomIndexes = [];
	this.highlightedRooms = [];

	this.pathIndexer = 0;
	// hoverToken -- token being hovered over with mouse
	this.hoverToken = null;


	this.gameclockSecondCounter = 0;
	this.gameclockHandle = null;

	this.playerTokenIdx = -1;
	this.gameItemTokenIdx = -1;
	this.lesserClickCount = 0;
	this.lesserIsActivated = false;

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
	this.MAX_SNIFFS = 3;
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
}
let gameVars = GameVars();
function  player (initData){
	// characterType is one of the following:  barbarian, wizard, thief, elf, leader
	this.characterType = initData.characterType;
	this.hasSpecialAbility = initData.hasAbility;
	// location is the room.location where the player was when the token was clicked (mousedownHandler)
	this.currentRoom = null;
	this.token = initData.token;
	this.setToken = function (token){
		this.token = token;
	};
}

function point(x,y)
{
	this.x = x;
	this.y = y;
}

function room(roomInfo){
	// location is a value from 1 to gameVars.MAX_COLS
	if (roomInfo != undefined && roomInfo != null){
		//console.log("roomInfo.location : " + roomInfo.location);
		this.location = roomInfo.location;
	}
	// we will use visited to determine if user has already been in this room
	// room 1 is always initially visited since that is where user starts
	this.visited = this.location == 1 ? true : false;
	
	this.doors = [0,0,0,0];
	this.column = this.getColumnNumber(this.location);
	this.row = this.getRowNumber(this.location);
	this.textLocationX = (this.column *(gameVars.lineInterval )) - (gameVars.lineInterval /2);
	this.textLocationY = (this.row * (gameVars.lineInterval )) - (gameVars.lineInterval /2);
	this.minPoint = new point ((this.column-1) * gameVars.lineInterval, (this.row-1)*gameVars.lineInterval);
	this.maxPoint = new point ((this.column) * gameVars.lineInterval, (this.row)*gameVars.lineInterval);;
	
	this.init = function(){
		this.isPath = false; // it isn't on path until a path is generated
		this.hasOgre = false;
		this.isOgreDead = true;
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
		this.getColumnNumber = function(location){
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
		this.getRowNumber = function (location){
			for (var x =0; x < gameVars.cols.length;x++){
				if (gameVars.cols[x] - location >= 0){
					// return column number as index + 1
					var row = x+1;
					return x+1;
				}
			}
		}
	}
	// locations 1 - 6 cannot have up as a direction
	// locations 1,7,13,19,25,31 cannot have west as a direction
	// locations 31 - 36 cannot have down as a direction
	// locations 6, 12, 18, 24, 30, 36 cannot have right as direction
	//var doors = []; // contains four values (u,d,l,r) either 0 or 1
	
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

// ########################## END OF SPECIAL TYPES #########################
// #########################################################################
// #########################################################################