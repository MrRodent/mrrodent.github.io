import { setCameraOffsets } from "./camera.js";
import { globalPause, setGlobalPause } from "./main.js";

export let isMobile = false;

export function responsivityCheck() {
    setCameraOffsets();
    // Bools
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;

    if (window.innerHeight < 400) {
        isMobile = true;
        resizeCanvas();
        return true;
    } else {
        isMobile = false;
        fullsizeCanvas();
        return false;
    }
}

/////////////////
// Resize canvas
let canvas = document.getElementById('canvas');
let floor = document.querySelector('.floor');

function fullsizeCanvas() {
    let size = 832;

    canvas.width = size;
    canvas.height = size;

    floor.style.width = `${size}px`;
    floor.style.height = `${size}px`;
}

function resizeCanvas() {
    const windowHeight = window.innerHeight;

    canvas.width = windowHeight;
    canvas.height = windowHeight;

    floor.style.width = `${windowHeight}px`
    floor.style.height = `${windowHeight}px`
}

window.addEventListener('resize', responsivityCheck);

/////////////////
// DOM

const fsBtn = document.getElementById('fullscreen-button');
fsBtn.addEventListener('click', () => {
    document.documentElement.requestFullscreen();
    fsBtn.style.visibility = "hidden";
})
// document.addEventListener("DOMContentLoaded", function() {
//     // Full screen button
//     const fsBtn = document.getElementById('fullscreen-button');
//     fsBtn.addEventListener('click', () => {
//         console.log("rq fs");
//         // if (screen.orientation.angle === 90 || screen.orientation.angle === -90) {
//         //     document.documentElement.requestFullscreen();
//         // } else {
//         //     document.exitFullscreen();
//         // }
//     });
// });