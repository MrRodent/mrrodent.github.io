import { tileSize, cagePlayer, cageMultiplayer, isMultiplayer } from "./main.js";
import { randomPowerup } from "./powerup.js";
import { levelHeight, levelPowerup, levelWidth, softwallPercent, powerupCount } from "./gamestate.js";

export let exitLocation = undefined;
export let powerupLocations = [];

const TileType = {
    FLOOR: "Floor",
    HARD_WALL: "HardWall",
    SOFT_WALL: "SoftWall",
};

function Tile(x, y, isWalkable, isDeadly, hasPowerup, powerup, type) {
    this.x = x || 0,
    this.y = y || 0,
    this.isWalkable = isWalkable || false,
    this.isDeadly = isDeadly || false,
    this.hasPowerup = hasPowerup || false;
    this.powerup = powerup || "None";
    this.type = type || TileType.FLOOR
};

export function createTiles() {
    powerupLocations = [];
    const result = [];
    let hardWallTotal = 0;

    for (let x = 0; x < levelWidth; x++) {
        const column = [];
        for (let y = 0; y < levelHeight; y++) {
            const xCoord = x * tileSize;
            const yCoord = y * tileSize;

            // Outer walls
            if (x === 0 || y === 0 || x === levelWidth - 1 || y === levelHeight - 1) {
                column.push(new Tile(xCoord, yCoord, false, false, false, "None", TileType.HARD_WALL));
                hardWallTotal++;
            } 
            // Hard tiles
            else if (x % 2 === 0 && y % 2 === 0) {
                column.push(new Tile(xCoord, yCoord, false, false, false, "None", TileType.HARD_WALL));
                hardWallTotal++;
            }
            // Floor
            else {
                column.push(new Tile(xCoord, yCoord, true, false, false, "None", TileType.FLOOR));
            }
        }
        result.push(column);
    }

    let softWallTotal = createSoftWalls(result, hardWallTotal);
    populateSoftWalls(result, softWallTotal);

    return result;
}

function createSoftWalls(result, hardWallTotal) {
    let softWallTotal = 0;
    
    const EMPTY_CORNERS = 12;
    let floorLeft = levelHeight * levelWidth - hardWallTotal - EMPTY_CORNERS;
    let softWallsLeft = Math.floor(floorLeft * softwallPercent);
    
    if (cagePlayer) {
        createCage(result);
        softWallTotal += 4;
    }
    if (cageMultiplayer) {
        createMultiplayerCage(result);
        softWallTotal += 8;
    }
    
    while (softWallsLeft > 0) {
        const x = Math.floor(Math.random() * levelWidth);
        const y = Math.floor(Math.random() * levelHeight);
        const tile = result[x][y];

        if (tile.type === "Floor"
        // Leave floor for the corners so the players can move
        && (x > 2 || y > 2) // top left
        && (x > 2 || y < levelHeight - 3) // top right
        && (x < levelWidth - 3 || y > 2) // bottom left
        && (x < levelWidth - 3 || y < levelHeight - 3)) // bottom right
        {
            tile.type = "SoftWall";
            tile.isWalkable = false;
            softWallsLeft--;
            softWallTotal++;

            // If the new wall is in the middle of 4 hard walls, add a soft wall to a random position next to it.
            if (x % 2 === 1 && y % 2 == 1) {
                // Get surrounding tiles
                const surround = [];
                if (x > 0) {
                    const left = result[x-1][y];
                    if (left.type === "Floor") {
                        surround.push(left);
                    }
                }
                if (y > 0) {
                    const top = result[x][y-1];
                    if (top.type === "Floor") {
                        surround.push(top);
                    }
                }
                if (x < levelWidth - 1) {
                    const right = result[x+1][y];
                    if (right.type === "Floor") {
                        surround.push(right);
                    }
                }
                if (y < levelHeight - 1) {
                    const bot = result[x][y+1];
                    if (bot.type === "Floor") {
                        surround.push(bot);
                    }
                }

                if(surround.length > 0) {
                    const randomFloor = surround[Math.floor(Math.random() * surround.length)];
                    randomFloor.type = "SoftWall";
                    randomFloor.isWalkable = false;
                    softWallsLeft--;
                    softWallTotal++;
                }
            }
        }
    }
    return softWallTotal;
}

// Creates the exit and power-ups behind random soft walls
function populateSoftWalls(result, softWallTotal) {
    let powerupsLeft = 0;
    let exitCreated = false;
    const createExit = !isMultiplayer;

    // If settings have more powerups than softwalls generated,
    // the amount of powerups is the amount of softwalls -1 for exit.
    if (powerupCount >= softWallTotal) {
        powerupsLeft = softWallTotal - 1;
    } else {
        powerupsLeft = powerupCount;
    }

    while (powerupsLeft > 0) {
        const x = Math.floor(Math.random() * levelWidth);
        const y = Math.floor(Math.random() * levelHeight);
        const tile = result[x][y];

        if (tile.type === "SoftWall") {
            // Create the exit
            if(createExit) {
                if (!exitCreated) {
                    tile.isExit = true;
                    tile.isOpen = false;
                    exitCreated = true;
                    exitLocation = tile;
                }
            }
            // Create powerups
            if (!tile.hasPowerup && !tile.isExit) {
                if (levelPowerup === "random") {
                    tile.powerup = randomPowerup();
                } else {
                    tile.powerup = levelPowerup;
                }
                tile.hasPowerup = true;
                powerupLocations.push(tile);
                powerupsLeft--;
            }
        }
    }
}


// Creates four soft wall tiles to make the player spawn safe
function createCage(result) {
    // Top right corner
    result[3][1].type = "SoftWall";
    result[3][1].isWalkable = false;

    result[1][3].type = "SoftWall";
    result[1][3].isWalkable = false;

    // Create randomly 2 cosmetic softwalls next to each of the walls so it doens't leave a checker pattern
    if (Math.random() < 0.5) {
        result[3][2].type = "SoftWall";
        result[3][2].isWalkable = false;
    } else {
        result[4][1].type = "SoftWall";
        result[4][1].isWalkable = false;
    }

    if (Math.random() < 0.5) {
        result[2][3].type = "SoftWall";
        result[2][3].isWalkable = false;
    } else {
        result[1][4].type = "SoftWall";
        result[1][4].isWalkable = false;
    }
}

// Create 8 soft walls (just one on each side) for multiplayer games
function createMultiplayerCage(result) {
    // Top right corner
    result[3][1].type = "SoftWall";
    result[3][1].isWalkable = false;
    result[1][3].type = "SoftWall";
    result[1][3].isWalkable = false;

    // Top left corner
    result[levelWidth - 4][1].type = "SoftWall";
    result[levelWidth - 4][1].isWalkable = false;
    result[levelWidth - 2][3].type = "SoftWall";
    result[levelWidth - 2][3].isWalkable = false;

    // Bottom left corner
    result[3][levelHeight - 2].type = "SoftWall";
    result[3][levelHeight - 2].isWalkable = false;
    result[1][levelHeight - 4].type = "SoftWall";
    result[1][levelHeight - 4].isWalkable = false;
    
    // Bottom right corner
    result[levelWidth - 4][levelHeight - 2].type = "SoftWall";
    result[levelWidth - 4][levelHeight - 2].isWalkable = false;
    result[levelWidth - 2][levelHeight - 4].type = "SoftWall";
    result[levelWidth - 2][levelHeight - 4].isWalkable = false;
}

