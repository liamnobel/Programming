//@ts-check

const canvasWidth = 768;
const canvasHeight = 768;
const cellSize = 64;
const cellSpace = 4;

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

function setup() {
    createCanvas(canvasWidth, canvasHeight, WEBGL);
}

function draw() {
    background(15);
    fill(100);
    for (var x = -4; x < 4; x++) {
        for (var y = -4; y < 4; y++) {
            let realMouseX = mouseX - canvasWidth / 2;
            let realMouseY = mouseY - canvasHeight / 2;

            // get color as distance from mouse
            let c1 = dist(realMouseX, realMouseY, x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace);
            let c2 = dist(realMouseX, realMouseY, x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace);
            let c3 = dist(realMouseX, realMouseY, x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace + cellSize);
            let c4 = dist(realMouseX, realMouseY, x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace + cellSize);

            // flip based on corner light levels
            let flip_diagonal = c1 + c3 > c2 + c4;
            if (flip_diagonal) {
                // draw a triangle (this one is good)
                triangleGradient(color(255 - c1), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace, color(255 - c4), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace + cellSize, color(255 - c3), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace + cellSize);

                // draw a triangle
                triangleGradient(color(255 - c1), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace, color(255 - c2), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace, color(255 - c3), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace + cellSize);
            } else {
                // draw a triangle
                triangleGradient(color(255 - c1), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace, color(255 - c2), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace, color(255 - c4), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace + cellSize);

                // draw a triangle
                triangleGradient(color(255 - c2), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace, color(255 - c3), x * (cellSize + cellSpace) + cellSpace + cellSize, y * (cellSize + cellSpace) + cellSpace + cellSize, color(255 - c4), x * (cellSize + cellSpace) + cellSpace, y * (cellSize + cellSpace) + cellSpace + cellSize);
            }
        }
    }
}

export {};

window.setup = setup;
window.draw = draw;
