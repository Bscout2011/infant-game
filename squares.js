let angleDegrees = 0;
let state = "rotate";
let squareLength = 50;
let squareWidth = 50;
let wait = false;
let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 700;
let CENTER = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];
let ctx;

/**
 * 
 * @param {number} angleDegrees 
 */
function rotateSquare(angleDegrees) {
  const squareLength = 50;

  ctx.save(); // Save the current state
  ctx.translate(CENTER[0], CENTER[1]); // Move the origin to the center of the canvas
  ctx.rotate((Math.PI / 180) * angleDegrees); // Rotate the canvas for all squares

  for (let i = 0; i < 4; i++) {
    ctx.save(); // Save the current state
    ctx.translate(0, -(1.5 - i) * squareLength * 2); // Move the origin to the center of each square
    ctx.rotate((Math.PI / 180) * angleDegrees); // Rotate the canvas for each square
    ctx.fillStyle = i % 2 == 0 ? "red" : "black";
    ctx.fillRect(
      -squareLength / 2,
      -squareLength / 2,
      squareLength,
      squareLength
    ); // Draw the square centered at the origin
    ctx.restore(); // Restore the state
  }

  ctx.restore(); // Restore the state
}

/**
 *
 * @param {{
 * redFirst: boolean,
 * contract?: boolean
 * yaxis?: boolean
 * }} options
 * @returns
 */
function expandSquares(options) {
  if (options.yaxis) {
    if (!options.contract) {
      squareLength++;
    } else if (options.contract) {
      squareLength--;
      if (squareLength < 50) {
        squareLength = 50;
      }
    }
  } else {
    if (!options.contract && squareWidth < CANVAS_WIDTH) {
      squareWidth += 6;
    } else if (options.contract && squareWidth > 50) {
      squareWidth -= 6;
      if (squareWidth < 50) {
        squareWidth = 50;
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    ctx.save(); // Save the current state
    ctx.translate(
      CENTER[0],
      CENTER[1] - (1.5 - i) * (squareLength * 0.2 + 40) * 2
    ); // Move the origin to the center of each square
    if (options.redFirst) {
      ctx.fillStyle = i % 2 == 0 ? "red" : "black";
    } else {
      ctx.fillStyle = i % 2 == 0 ? "black" : "red";
    }
    ctx.fillRect(
      -squareWidth / 2,
      -squareLength / 2,
      squareWidth,
      squareLength
    ); // Draw the square centered at the origin
    ctx.restore(); // Restore the state
  }

  if (options.yaxis) {
    if (!options.contract && squareLength >= 100) {
      return "expanded";
    } else if (options.contract && squareLength <= 50) {
      squareLength = 50;
      return "contracted";
    }
  } else {
    if (!options.contract && squareWidth >= CANVAS_WIDTH) {
      return "expanded";
    } else if (options.contract && squareWidth <= 50) {
      squareWidth = 50;
      return "contracted";
    }
  }
  return options.contract ? "contracting" : "expanding";
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} canvasWidth 
 * @param {number} canvasHeight 
 * @returns 
 */
export function animateSquares(canvasContext, canvasWidth, canvasHeight) {
  ctx = canvasContext;
  CANVAS_WIDTH = canvasWidth;
  CANVAS_HEIGHT = canvasHeight;
  CENTER = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];
  if (wait) {
    return;
  }
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const currentState = state;
  if (state == "rotate") {
    angleDegrees = (angleDegrees + 1) % 360;
    if (angleDegrees % 180 == 0) {
      state = "expandX";
    } else if (angleDegrees % 90 == 0) {
      wait = true;
      setTimeout(() => {
        wait = false;
      }, 250);
    }
    rotateSquare(angleDegrees);
  } else if (state == "expandX") {
    const expanded = expandSquares({ redFirst: angleDegrees == 0 });
    if (expanded == "expanded") state = "expandY";
  } else if (state == "contractX") {
    const expanded = expandSquares({
      redFirst: angleDegrees == 0,
      contract: true,
    });
    if (expanded == "contracted") state = "rotate";
  } else if (state == "expandY") {
    const expanded = expandSquares({
      redFirst: angleDegrees == 0,
      yaxis: true,
    });
    if (expanded == "expanded") state = "contractY";
  } else if (state == "contractY") {
    const expanded = expandSquares({
      redFirst: angleDegrees == 0,
      contract: true,
      yaxis: true,
    });
    if (expanded == "contracted") state = "contractX";
  }

  if (currentState != state) {
    console.log(state);
    wait = true;
    setTimeout(() => {
      wait = false;
    }, 500);
  }
}