//@ts-check

const cellSize = 32;
const gridWidth = 15;
const gridHeight = 9;
const cellSpace = 0;
const canvasWidth = gridWidth * (cellSize + cellSpace) + cellSpace;
const canvasHeight = gridHeight * (cellSize + cellSpace) + cellSpace;

let maze = new Array(gridWidth);
for (var i = 0; i < gridWidth; i++) {
    maze[i] = new Array(gridHeight);
}
function mazeReset() {
    background(255, 0, 0);

    for (var x = 0; x < gridWidth; x++) {
        for (var y = 0; y < gridHeight; y++) {
            maze[x][y] = x % 2 === 0 || y % 2 === 0 ? 1 : 0;
        }
    }
}

// clear warning
let cleared_warning = /** @type {HTMLDivElement} */ (document.getElementById("cleared_warning"));
cleared_warning.classList.add("d-none");

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    mazeReset();
    mazeRender();
}

function random_walk_reset() {
    mazeReset();
    mazeRender();
    randomWalk();
}

document.getElementById("random_walk")?.addEventListener("click", random_walk_reset);

document.getElementById("random_walk_reset")?.addEventListener("click", function () {
    mazeReset();
    mazeRender();
});

function mazeRender() {
    noStroke();
    for (var x = 0; x < gridWidth; x++) {
        for (var y = 0; y < gridWidth; y++) {
            if (maze[x][y] === 1) {
                fill(0);
            } else {
                fill(255);
            }

            rect(x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace, cellSize, cellSize);
        }
    }
}

const steps_element = /** @type {HTMLSpanElement} */ (document.getElementById("steps"));

function randomWalk() {
    let x = 1;
    let y = 1;

    let steps = 0;
    while (true) {
        fill(steps, steps, 127);
        rect(x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace, cellSize, cellSize);

        maze[x][y] = 0;

        if (random(1) < 0.5) {
            x += random(1) < 0.5 ? -1 : 1;
        } else {
            y += random(1) < 0.5 ? -1 : 1;
        }

        if (x < 1) x = 1;
        if (x > gridWidth - 2) x = gridWidth - 2;
        if (y < 1) y = 1;
        if (y > gridHeight - 2) y = gridHeight - 2;

        // break when at bottom right
        if (x === gridWidth - 2 && y === gridHeight - 2) {
            // draw final cell
            fill(steps, steps, 127);
            rect(x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace, cellSize, cellSize);
            break;
        }

        steps++;
    }

    steps_element.innerHTML = `${steps}`;

    // check if all inner walls are removed
    allWallsRemoved: {
        for (let i = 1; i < gridWidth - 1; i++) {
            for (let j = 1; j < gridHeight - 1; j++) {
                if (maze[i][j] === 1) {
                    break allWallsRemoved;
                }
            }
        }
        cleared_warning.classList.remove("d-none");
    }
}

export {};

window.setup = setup;
