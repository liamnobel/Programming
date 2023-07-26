//@ts-check

const canvasWidth = 768;
const canvasHeight = 768;
const cellSize = 64;
const cellSpace = 4;

// create an 8x8 grid world
const world = new Array(12);
for (let i = 0; i < world.length; i++) {
    world[i] = new Array(12);
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
        add_neighbors(x, y);
        y++;
    }
}
console.log(frontier);

let iterations = 0;
while (frontier.length > 0) {
    // pop a cell from the frontier
    let cell = frontier.pop();
    cell.frontier = false;

    // get the cell's neighbors
    let left = get_cell_safe(cell.x - 1, cell.y);
    let right = get_cell_safe(cell.x + 1, cell.y);
    let up = get_cell_safe(cell.x, cell.y - 1);
    let down = get_cell_safe(cell.x, cell.y + 1);

    // calculate the light value for the cell
    let sunlight = 0;
    if (left !== null && left.sunlight > sunlight) {
        sunlight = left.sunlight;
    }
    if (right !== null && right.sunlight > sunlight) {
        sunlight = right.sunlight;
    }
    if (up !== null && up.sunlight > sunlight) {
        sunlight = up.sunlight;
    }
    if (down !== null && down.sunlight > sunlight) {
        sunlight = down.sunlight;
    }

    if (sunlight > cell.sunlight) {
        cell.sunlight = sunlight - 1;
        add_neighbors(cell.x, cell.y);
    }

    iterations++;
    if (iterations > 500) {
        console.log("too many iterations");
        break;
    }
}
console.log("Iterations", iterations);

function add_neighbors(x, y) {
    let left = get_cell_safe(x - 1, y);
    let right = get_cell_safe(x + 1, y);
    let up = get_cell_safe(x, y - 1);
    let down = get_cell_safe(x, y + 1);
    if (left !== null && !left.solid && left.checked === false && left.frontier === false) {
        left.checked = true;
        frontier.push(left);
    }
    if (right !== null && !right.solid && right.checked === false && right.frontier === false) {
        right.checked = true;
        frontier.push(right);
    }
    if (up !== null && !up.solid && up.checked === false && up.frontier === false) {
        up.checked = true;
        frontier.push(up);
    }
    if (down !== null && !down.solid && down.checked === false && down.frontier === false) {
        down.checked = true;
        frontier.push(down);
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
    textSize(24);
}

function draw() {
    translate(-canvasWidth / 2, -canvasHeight / 2); // set origin to top left in gl context

    background(15);
    fill(100);

    // draw the world
    for (let x = 0; x < world.length; x++) {
        for (let y = 0; y < world[x].length; y++) {
            if (world[x][y].solid) {
                fill(20);
            } else {
                fill(127, world[x][y].sunlight * 16, world[x][y].sunlight * 16);
            }
            let xx = x * (cellSize + cellSpace) + cellSpace;
            let yy = y * (cellSize + cellSpace) + cellSpace;

            rect(xx, yy, cellSize, cellSize);

            fill(0);
            //fill(127, 255, 255);
            text(world[x][y].sunlight, xx + 10, yy + 30);
            //fill(255, 150, 0);
            //text(world[x][y].light, xx + 10, yy + 50);
            // fill(255, 127, 127);
            // text(world[x][y].frontier ? "T" : "F", xx + 10, yy + 50);
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
