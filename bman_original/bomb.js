import { ctx, tileSize, game, globalPause, bigBomb } from "./main.js";
import { getMusicalTimeout, msPerBeat, playAudio, playRiser, playTrack, randomSfx, riserPlaying, sfxs, tracks } from "./audio.js";
import { spawnEnemiesAtLocation, enemies } from "./enemy.js";
import { getDistanceTo, getLinearUntilObstacle } from "./utils.js";
import { findPlayerById, players } from "./player.js";
import { exitLocation } from "./tile.js";
import { spriteSheets } from "./spritesheets.js";
import { lastLevel } from "./gamestate.js";

export let tilesWithBombs = [];
let crumblingWalls = [];
let fieryFloors = [];

export class Bomb {
    constructor(x, y, range, playerId) {
        this.x = x || 0;
        this.y = y || 0,
        this.range = range || 1;
        this.hasExploded = false;
        this.playerId = playerId || 0;

        // Collision
        this.w = tileSize;
        this.h = tileSize;
        this.collisionW = this.w;
        this.collisionH = this.h;
        this.collisionBox = {x: this.x, y: this.y, w: this.collisionW, h: this.collisionH};
        
        // Animation
        this.currentFrame = 0;
        this.frames = 16;
        
        this.ticking = setInterval(() => {
            if (globalPause) return;

            this.checkFirstBomb();

            this.currentFrame++;
            if (this.hasExploded) {
                clearInterval(this.ticking);
            }
            else if (this.currentFrame >= this.frames) {
                this.currentFrame = this.frames - 1;

                // Bombs explode in time with the music
                let delay;
                if (!game.firstBombExploded) {
                    // First bomb explodes onbeat
                    delay = getMusicalTimeout();
                    // Extra delay for drama.
                    delay += msPerBeat * 2;
                } else {
                    // Rest of the bombs explode offbeat
                    delay = getMusicalTimeout(true);
                }
                
                setTimeout(() => {
                    explode(this);

                    if (!game.beatDropped) {
                        setTimeout(() => {
                            if (game.level === 1) {
                                playTrack(tracks['SLOWHEART']);
                            }
                            else if (lastLevel) {
                                playTrack(tracks['HEART_DRONES']);
                            } else {
                                playTrack(tracks['INT2']);

                            }
                        }, msPerBeat);
                        game.beatDropped = true;
                    }
                }, delay);

                clearInterval(this.ticking);
            }
        }, 150);
    }

    checkFirstBomb() {
        if (game.firstBombDropped) return;

        game.firstBombDropped = true;
        if (game.level === 1) {
            bigBomb.playLightUp();
            playRiser();
        }
    }
}


function explode(bomb) {
    if (!game.firstBombExploded) {
        game.firstBombExploded = true;
        if (game.level === 1) {
            bigBomb.playShatter();
        }
    }

    const randomBomb = randomSfx(sfxs['BOMBS']);
    playAudio(randomBomb);

    let tiles = getLinearUntilObstacle(bomb, bomb.range, true, true);
    let centerTile = tiles[0][0];
    
    if (!centerTile.isWalkable) {
        centerTile.isWalkable = true;
    }

    bomb.hasExploded = true;
    tilesWithBombs.splice(0, 1);

    let player = findPlayerById(bomb.playerId);
    if (player.activeBombs > 0) {
        player.activeBombs--;
    }

    chainExplosions(tiles);
    setTilesOnFire(tiles);
}

function chainExplosions(tiles) {
    // Tiles[0] is the center, not necessary to iterate over it
    for (let i = 1; i < tiles.length; i++) {
        for (let j = 0; j < tiles[i].length; j++) {
                let currentTile = tiles[i][j];
                if ("bomb" in currentTile && currentTile.bomb.hasExploded === false) {
                    explode(currentTile.bomb);
                }
        }
    }
}

function animateExplosion(tile) {
    tile.isBeingAnimated = true;
    tile.animationTimer = 7;
    tile.currentFrame = 0;

    let interval = setInterval(() => {
        tile.animationTimer--;
        tile.currentFrame++;
        if (tile.animationTimer <= 0) {
            if (tile.isWalkable) {
                tile.isDeadly = false;
            }
            else {
                tile.isWalkable = true;
            }
            tile.isBeingAnimated = false;
            clearInterval(interval);
        }
    }, 130);
}

function setTilesOnFire(tiles) {
    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[i].length; j++) {
                let currentTile = tiles[i][j];
                
                // Hardwall stops the explosion and there's no need to animate it
                if (currentTile.type === "HardWall") {
                    break;
                }
                
                if (!currentTile.isBeingAnimated) {
                    animateExplosion(currentTile);
                }

                if (currentTile.type === "SoftWall") {
                    if (crumblingWalls.indexOf(currentTile) === -1) {
                        crumblingWalls.push(currentTile);
                    }
                    // The tile turns already into a floor at this point so that it will render under the crumbling wall
                    currentTile.type = "Floor";
                }
                else if (currentTile.type === "Floor") {
                    if (fieryFloors.indexOf(currentTile) === -1) {
                        currentTile.isDeadly = true;
                        fieryFloors.push(currentTile);
                    }

                    if (currentTile.hasPowerup) {
                        currentTile.hasPowerup = false;
                    }
                    else if (currentTile.isExit && !currentTile.hasSpawnedEnemies)
                    {
                        if (exitLocation.isOpen) {
                            game.toggleDoor();
                        }
                        spawnEnemiesAtLocation(currentTile, game.level + 3);
                        currentTile.hasSpawnedEnemies = true;
                    }
                }
        }
    }
}

function killEnemies(tile) {
    if (tile.isDeadly) {
        enemies.forEach(enemy => {
            if (enemy.justSpawned) return;

            if (getDistanceTo(tile, enemy) < tileSize) {
                enemy.die();
            }
        })
    }
}

////////////////////
// Render
const bombImage = new Image();
export function renderBombs() {
    if (!bombImage.src) {
        bombImage.src = spriteSheets.bomb;
    }
    for (let i = 0; i < tilesWithBombs.length; i++) {
        let currentTile = tilesWithBombs[i];
        ctx.drawImage(bombImage, 
            tileSize*currentTile.bomb.currentFrame, 0, 
            tileSize, tileSize,  currentTile.bomb.x, currentTile.bomb.y, tileSize, tileSize);
    }
}

const softWallTexture = new Image();
const explosionImage = new Image();
export function renderExplosions() {
    if (!softWallTexture.src) {
        softWallTexture.src = spriteSheets.wall_animation;
    }
    if (!explosionImage.src) {
        explosionImage.src = spriteSheets.explosion;
    }
    
    // Walls
    crumblingWalls.forEach(tile => {
        ctx.drawImage(softWallTexture, 
            tileSize*tile.currentFrame, 0, 
            tileSize, tileSize, tile.x, tile.y, tileSize, tileSize);

        if (tile.animationTimer === 3) {
            crumblingWalls.splice(0, 1);
        }
    });

    // Floor
    fieryFloors.forEach(tile => {
        ctx.drawImage(explosionImage, 
            tileSize*tile.currentFrame, 0, 
            tileSize, tileSize, tile.x, tile.y, tileSize, tileSize);

        if (tile.animationTimer <= 2) {
            tile.isDeadly = false;
        }

        if (tile.animationTimer <= 0) {
            fieryFloors.splice(0, 1);
        }

        killEnemies(tile);
    });
}

// Clears all bombs and fire from the level
export function clearBombs() {
    tilesWithBombs.forEach(tile => {
        tile.isWalkable = true;
        clearInterval(tile.bomb.ticking);
        for (let prop in tile) {
            tile.bomb[prop] = null;
        }
    });
    tilesWithBombs = [];
    crumblingWalls = [];
    fieryFloors = [];

    players.forEach(p => {
        p.activeBombs = 0;
    });
}
