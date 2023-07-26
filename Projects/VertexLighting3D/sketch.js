// @ts-check

const canvas_w = 768;
const canvas_h = 768;
const cell_size = 64;
const cell_space = 0;

let light_x = 0;
let light_y = 0;
let light_z = 0;

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

function triangleGradient3D(c1, x1, y1, z1, c2, x2, y2, z2, c3, x3, y3, z3) {
    beginShape(TRIANGLES);
    fill(c1);
    vertex(x1, y1, z1);
    fill(c2);
    vertex(x2, y2, z2);
    fill(c3);
    vertex(x3, y3, z3);
    endShape();
}

function setup() {
    createCanvas(canvas_w, canvas_h, WEBGL);
}

function draw() {
    noStroke();
    background(15);
    orbitControl();
    fill(100);
    for (var x = -2; x <= 2; x++) {
        for (var y = -2; y <= 2; y++) {
            for (var z = +Math.abs(x) + Math.abs(y); z <= Math.abs(x) + Math.abs(y); z++) {
                box3d(x * (cell_size + cell_space), y * (cell_size + cell_space), z * (cell_size + cell_space), cell_size);
            }
        }
    }

    light_x = mouseX - canvas_w / 2;
    light_y = mouseY - canvas_h / 2;
    light_z = Math.sin(frameCount / 100) * 128;

    fill(255);
    resetMatrix();
    translate(light_x, light_y, light_z);
    box(8);
}

function rectColored(realMouseX, realMouseY, x, y) {
    let c1 = dist(realMouseX, realMouseY, x * (cell_size + cell_space) + cell_space, y * (cell_size + cell_space) + cell_space);
    let c2 = dist(realMouseX, realMouseY, x * (cell_size + cell_space) + cell_space + cell_size, y * (cell_size + cell_space) + cell_space);
    let c3 = dist(realMouseX, realMouseY, x * (cell_size + cell_space) + cell_space + cell_size, y * (cell_size + cell_space) + cell_space + cell_size);
    let c4 = dist(realMouseX, realMouseY, x * (cell_size + cell_space) + cell_space, y * (cell_size + cell_space) + cell_space + cell_size);

    // flip based on corner light levels
    let flip_diagonal = c1 + c3 > c2 + c4;
    if (flip_diagonal) {
        // draw a triangle
        triangleGradient(color(255 - c1), x * (cell_size + cell_space) + cell_space, y * (cell_size + cell_space) + cell_space, color(255 - c4), x * (cell_size + cell_space) + cell_space, y * (cell_size + cell_space) + cell_space + cell_size, color(255 - c3), x * (cell_size + cell_space) + cell_space + cell_size, y * (cell_size + cell_space) + cell_space + cell_size);

        // draw a triangle
        triangleGradient(color(255 - c1), x * (cell_size + cell_space) + cell_space, y * (cell_size + cell_space) + cell_space, color(255 - c2), x * (cell_size + cell_space) + cell_space + cell_size, y * (cell_size + cell_space) + cell_space, color(255 - c3), x * (cell_size + cell_space) + cell_space + cell_size, y * (cell_size + cell_space) + cell_space + cell_size);
    } else {
        // draw a triangle
        triangleGradient(color(255 - c1), x * (cell_size + cell_space) + cell_space, y * (cell_size + cell_space) + cell_space, color(255 - c2), x * (cell_size + cell_space) + cell_space + cell_size, y * (cell_size + cell_space) + cell_space, color(255 - c4), x * (cell_size + cell_space) + cell_space, y * (cell_size + cell_space) + cell_space + cell_size);

        // draw a triangle
        triangleGradient(color(255 - c2), x * (cell_size + cell_space) + cell_space + cell_size, y * (cell_size + cell_space) + cell_space, color(255 - c3), x * (cell_size + cell_space) + cell_space + cell_size, y * (cell_size + cell_space) + cell_space + cell_size, color(255 - c4), x * (cell_size + cell_space) + cell_space, y * (cell_size + cell_space) + cell_space + cell_size);
    }
}

function box3d(x, y, z, size) {
    size /= 2;

    let p000 = [x - size, y - size, z - size];
    let p001 = [x + size, y - size, z - size];
    let p010 = [x - size, y + size, z - size];
    let p011 = [x + size, y + size, z - size];
    let p100 = [x - size, y - size, z + size];
    let p101 = [x + size, y - size, z + size];
    let p110 = [x - size, y + size, z + size];
    let p111 = [x + size, y + size, z + size];

    let distSquared = (x, y, z) => x * x + y * y + z * z;
    let distSquareRooted = (x, y, z) => Math.sqrt(distSquared(x, y, z));

    let c000 = dist(light_x, light_y, light_z, p000[0], p000[1], p000[2]);
    let c001 = dist(light_x, light_y, light_z, p001[0], p001[1], p001[2]);
    let c010 = dist(light_x, light_y, light_z, p010[0], p010[1], p010[2]);
    let c011 = dist(light_x, light_y, light_z, p011[0], p011[1], p011[2]);
    let c100 = dist(light_x, light_y, light_z, p100[0], p100[1], p100[2]);
    let c101 = dist(light_x, light_y, light_z, p101[0], p101[1], p101[2]);
    let c110 = dist(light_x, light_y, light_z, p110[0], p110[1], p110[2]);
    let c111 = dist(light_x, light_y, light_z, p111[0], p111[1], p111[2]);

    // let c000 = distSquareRooted(light_x - p000[0], light_y - p000[1], light_z - p000[2]);
    // let c001 = distSquareRooted(light_x - p001[0], light_y - p001[1], light_z - p001[2]);
    // let c010 = distSquareRooted(light_x - p010[0], light_y - p010[1], light_z - p010[2]);
    // let c011 = distSquareRooted(light_x - p011[0], light_y - p011[1], light_z - p011[2]);
    // let c100 = distSquareRooted(light_x - p100[0], light_y - p100[1], light_z - p100[2]);
    // let c101 = distSquareRooted(light_x - p101[0], light_y - p101[1], light_z - p101[2]);
    // let c110 = distSquareRooted(light_x - p110[0], light_y - p110[1], light_z - p110[2]);
    // let c111 = distSquareRooted(light_x - p111[0], light_y - p111[1], light_z - p111[2]);

    const face = (p1, p2, p3, p4, c1, c2, c3, c4) => {
        let flip_diagonal = c1 + c4 > c2 + c3;
        //let flip_diagonal = true;
        if (flip_diagonal) {
            triangleGradient3D(color(255 - c1), p1[0], p1[1], p1[2], color(255 - c4), p4[0], p4[1], p4[2], color(255 - c3), p3[0], p3[1], p3[2]);
            triangleGradient3D(color(255 - c1), p1[0], p1[1], p1[2], color(255 - c2), p2[0], p2[1], p2[2], color(255 - c4), p4[0], p4[1], p4[2]);
        } else {
            triangleGradient3D(color(255 - c1), p1[0], p1[1], p1[2], color(255 - c2), p2[0], p2[1], p2[2], color(255 - c3), p3[0], p3[1], p3[2]);
            triangleGradient3D(color(255 - c2), p2[0], p2[1], p2[2], color(255 - c3), p3[0], p3[1], p3[2], color(255 - c4), p4[0], p4[1], p4[2]);
        }
    };

    // front ("z = 0")
    face(p000, p001, p010, p011, c000, c001, c010, c011);
    // back
    face(p111, p110, p101, p100, c111, c110, c101, c100);
    // left
    face(p000, p001, p100, p101, c000, c001, c100, c101);
    // right
    face(p011, p010, p111, p110, c011, c010, c111, c110);
    // top
    face(p010, p000, p110, p100, c010, c000, c110, c100);
    // bottom
    face(p001, p011, p101, p111, c001, c011, c101, c111);
}

export {};

window.setup = setup;
window.draw = draw;
