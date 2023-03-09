import { VerletPoint, VerletConstraint } from './verlet.js';

const COLS = 30,
    ROWS = 30,
    QUAD_SIZE = 10;

let mouseX = 0,
    mouseY = 0,
    stiffness = 2,
    viewWidth,
    viewHeight;

const canvas = document.getElementById('main-canvas'),
    context = canvas.getContext('2d');

canvas.width = viewWidth = 1280;
canvas.height = viewHeight = 720;

const points = new Array(COLS * ROWS),
    constraints = new Array((COLS - 1) * ROWS + (ROWS - 1) * COLS);

document.addEventListener('mousemove', (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}, false);

document.addEventListener('keydown', (e) => {
    if (e.key === '=') stiffness++;
    else if (e.key === '-') stiffness--;

    if (stiffness < 1) stiffness = 1;
    if (stiffness > 10) stiffness = 10;
}, false);

(function init() {
    let i, j, k = 0;

    for (i = 0; i < ROWS; i++) {
        for (j = 0; j < COLS; j++) {
            points[i * COLS + j] = new VerletPoint(j * QUAD_SIZE, i * QUAD_SIZE);

            if (j > 0) {
                constraints[k++] = new VerletConstraint(points[i * COLS + j - 1], points[i * COLS + j]);
            }
            if (i > 0) {
                constraints[k++] = new VerletConstraint(points[i * COLS + j], points[(i - 1) * COLS + j]);
            }
        }
    }
})();

requestAnimationFrame(update);

/**
 * Update loop
 */
function update() {
    points[0].setPosition(0, 0);
    points[COLS - 1].setPosition(mouseX, mouseY);

    for (let i = COLS; i < points.length; i++) {
        // Add gravity and update.
        points[i].y += 0.15;
        points[i].update();
        points[i].constraint(viewWidth, viewHeight);
    }

    for (let s = 0; s < stiffness; s++) {
        for (let i = 0; i < constraints.length; i++) {
            constraints[i].constraint();
        }
    }

    context.clearRect(0, 0, viewWidth, viewHeight);
    context.lineWidth = 1;
    context.strokeStyle = 'rgb(255,0,0)';
    context.beginPath();
    for (let i = 0; i < constraints.length; i++) {
        const c = constraints[i];
        context.moveTo(c.point0.x, c.point0.y);
        context.lineTo(c.point1.x, c.point1.y);
    }

    context.closePath();
    context.stroke();

    requestAnimationFrame(update);
} // End update()
