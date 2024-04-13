import { animateSquares } from "./squares.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 700);
const CENTER = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];
let gameFrame = 0;
let state = "squares";

function animate() {
  
  if (state === "squares") {
    animateSquares(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  
  gameFrame++;
  requestAnimationFrame(animate);
}

window.addEventListener("load", animate);
