import { ctx, level, tileSize } from "./main.js";
import { levelHeight, levelWidth } from "./gamestate.js";
import { spriteSheets } from "./spritesheets.js";
import { clamp } from "./utils.js";

export class Powerup
{
    constructor() {
        this.maxBombs = 1;
        this.maxRange = 1; 
        this.blinker = null;
    }

    pickup(tile, player) {
        tile.hasPowerup = false;

        if (tile.powerup === "bomb") {
            this.maxBombs += 1;
        }
        else if (tile.powerup === "range") {
            this.maxRange += 1;
        }

        else if (tile.powerup === "speed") {
            // TODO: Mikä on sopiva max speed?
            player.speed = clamp(player.speed += 40, 0, 250);
        }
    }
}

export const powerupChoices = ["bomb", "range", "speed"];

export function randomPowerup() {
    return powerupChoices[Math.floor(Math.random() * powerupChoices.length)];
}

////////////////////
// Renders
const powerupImage = new Image();
export function renderPowerups()
{
    if (!powerupImage.src) {
        powerupImage.src = spriteSheets.powerups;
    }

    for (let x = 0; x < levelWidth; x++) {
        for (let y = 0; y < levelHeight; y++) {
            const xCoord = x * tileSize;
            const yCoord = y * tileSize;
            const currentTile = level[x][y];

            if (currentTile.hasPowerup) {
                if (currentTile.powerup === "bomb") {
                    ctx.drawImage(powerupImage, 0, 0, tileSize, tileSize, xCoord, yCoord, tileSize, tileSize);
                }
                else if (currentTile.powerup === "range") {
                    ctx.drawImage(powerupImage, tileSize, 0, tileSize, tileSize, xCoord, yCoord, tileSize, tileSize);
                }
                else if (currentTile.powerup === "speed") {
                    ctx.drawImage(powerupImage, tileSize*2, 0, tileSize, tileSize, xCoord, yCoord, tileSize, tileSize);
                }
            }
        }
    }
}