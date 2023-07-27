// @ts-check

/// @typedef import("../../node_modules/@types/p5/global.d.ts") {}

const cellSize = 42;
const cellSpace = 0;
const cellWidth = 12;
const cellHeight = 12;
const canvasWidth = cellWidth * cellSize;
const canvasHeight = cellHeight * cellSize;

// directions
let directions = [
    [-1, 0], // left
    [+1, 0], // right
    [0, -1], // up
    [0, +1], // down
];

// create a grid world
const world = new Array(cellWidth);
for (let i = 0; i < world.length; i++) {
    world[i] = new Array(cellHeight);
}

// fill it with cell objects
for (let x = 0; x < world.length; x++) {
    for (let y = 0; y < world[x].length; y++) {
        world[x][y] = {
            sunlight: 0,
            light: 0,
            solid: false,
            frontier: false,
            checked: false,
            x: x,
            y: y,
        };
    }
}

// set some cells to solid
world[2][2].solid = true;
world[2][3].solid = true;
world[0][0].solid = true;
world[5][4].solid = true;
world[4][5].solid = true;
world[3][6].solid = true;
world[2][7].solid = true;
world[1][7].solid = true;
world[0][7].solid = true;
world[0][6].solid = true;
world[0][5].solid = true;
world[0][4].solid = true;
world[3][3].solid = true;
world[4][3].solid = true;
world[5][3].solid = true;
world[6][3].solid = true;
world[7][0].solid = true;

// fill in sunlight from top row down until hitting a solid
for (let x = 0; x < world.length; x++) {
    let y = 0;
    while (y < world[x].length && world[x][y].solid === false) {
        world[x][y].sunlight = 15;
        world[x][y].checked = true;
        y++;
    }
}

// returns null if out of bounds, otherwise returns the cell
/**
 * @param {number} x
 * @param {number} y
 * @returns {null | {solid: boolean, sunlight: number, light: number, frontier: boolean, checked: boolean, x: number, y: number}}
 **/
function get_cell_safe(x, y) {
    if (x < 0 || x >= world.length || y < 0 || y >= world[x].length) {
        return null;
    } else {
        return world[x][y];
    }
}

// fill in light from bottom row up until hitting a solid
let frontier = [];
for (let x = 0; x < world.length; x++) {
    let y = 0;
    while (y < world[x].length && world[x][y].solid === false) {
        add_neighbors(x, y, false);
        y++;
    }
}

function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        iterate();
    }
}

function iterate() {
    // pop a cell from the frontier
    let cell = frontier.pop();
    if (cell === undefined) {
        return;
    }
    cell.frontier = false;

    // calculate the light value for the cell
    let sunlight = cell.sunlight;
    directions.forEach((direction) => {
        let neighbor = get_cell_safe(
            cell.x + direction[0],
            cell.y + direction[1]
        );
        if (neighbor !== null) {
            sunlight = Math.max(sunlight, neighbor.sunlight - 1);
        }
    });

    if (sunlight > 0 && sunlight > cell.sunlight - 1) {
        cell.sunlight = sunlight - 1;
        add_neighbors(cell, true);
    }

    cell.checked = true;
}

function add_neighbors(cell_centered, ignore_if_checked = false) {
    for (let i = 0; i < directions.length; i++) {
        let cell = get_cell_safe(
            cell_centered.x + directions[i][0],
            cell_centered.y + directions[i][1]
        );

        if (
            cell !== null &&
            cell.solid === false &&
            (ignore_if_checked === true || cell.checked === false) &&
            cell.frontier === false
        ) {
            cell.checked = false;
            cell.frontier = true;
            frontier.push(cell);
        }
    }
}

function triangleGradient(c1, x1, y1, c2, x2, y2, c3, x3, y3) {
    beginShape(TRIANGLES);
    fill(c1);
    vertex(x1, y1);
    fill(c2);
    vertex(x2, y2);
    fill(c3);
    vertex(x3, y3);
    endShape();
}

let myFont;
function preload() {
    myFont = loadFont("../../Fonts/Fira_Code_v6.2/ttf/FiraCode-Medium.ttf");
}

function setup() {
    createCanvas(canvasWidth, canvasHeight, WEBGL);
    textFont(myFont);
    textSize(16);
    noStroke();
}

function draw() {
    translate(-canvasWidth / 2, -canvasHeight / 2); // set origin to top left in gl context

    background(15);
    fill(100);

    // draw the world
    for (let x = 0; x < world.length; x++) {
        for (let y = 0; y < world[x].length; y++) {
            let xx = x * (cellSize + cellSpace) + cellSpace;
            let yy = y * (cellSize + cellSpace) + cellSpace;

            if (world[x][y].solid) {
                fill(20);
            } else {
                fill(127, world[x][y].sunlight * 16, world[x][y].sunlight * 16);
            }

            if (world[x][y] === frontier[frontier.length - 1]) {
                fill(255, 0, 0);
            }

            rect(xx, yy, cellSize, cellSize);

            fill(0);
            //fill(127, 255, 255);
            text(world[x][y].sunlight, xx + 8, yy + 8 + 16);
            //fill(255, 150, 0);
            //text(world[x][y].light, xx + 10, yy + 50);
            fill(0, world[x][y].frontier ? 255 : 0, 0);
            text(world[x][y].frontier ? "fT" : "fF", xx + 4, yy + 8 + 32);
            fill(127);
            text(world[x][y].checked ? "cT" : "cF", xx + 4 + 16, yy + 8 + 32);
        }
    }

    // // draw the light
    // for (var x = -4; x < 4; x++) {
    //     for (var y = -4; y < 4; y++) {
    //         let realMouseX = mouseX - canvasWidth / 2;
    //         let realMouseY = mouseY - canvasHeight / 2;

    //         // get color as distance from mouse
    //         let c1 = dist(realMouseX, realMouseY, x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace);
    //         let c2 = dist(realMouseX, realMouseY, x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace);
    //         let c3 = dist(realMouseX, realMouseY, x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace + cellSize);
    //         let c4 = dist(realMouseX, realMouseY, x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace + cellSize);

    //         // flip based on corner light levels
    //         let flip_diagonal = c1 + c3 > c2 + c4;
    //         if (flip_diagonal) {
    //             // draw a triangle (this one is good)
    //             triangleGradient(color(255 - c1), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace, color(255 - c4), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace + cellSize, color(255 - c3), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace + cellSize);

    //             // draw a triangle
    //             triangleGradient(color(255 - c1), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace, color(255 - c2), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace, color(255 - c3), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace + cellSize);
    //         } else {
    //             // draw a triangle
    //             triangleGradient(color(255 - c1), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace, color(255 - c2), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace, color(255 - c4), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace + cellSize);

    //             // draw a triangle
    //             triangleGradient(color(255 - c2), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace, color(255 - c3), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace + cellSize, color(255 - c4), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace + cellSize);
    //         }
    //     }
    // }
}

export {};

//@ts-expect-error
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
