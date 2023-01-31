/**
 * This class represents a verlet constraint between two verlet points.
 */
export class VerletConstraint {
    point0;
    point1;
    magnitude;

    constructor(p0, p1) {
        this.point0 = p0;
        this.point1 = p1;

        const dx = this.point0.x - this.point1.x;
        const dy = this.point0.y - this.point1.y;
        this.magnitude = Math.sqrt((dx * dx) + (dy * dy));
    }

    constraint() {
        const dx = this.point1.x - this.point0.x;
        const dy = this.point1.y - this.point0.y;
        const h = Math.sqrt((dx * dx) + (dy * dy));
        const dh = this.magnitude - h;
        const offsetX = (dh * dx / h) * 0.5;
        const offsetY = (dh * dy / h) * 0.5;

        this.point0.x -= offsetX;
        this.point0.y -= offsetY;
        this.point1.x += offsetX;
        this.point1.y += offsetY;
    }
}

/**
 * This class represents a verlet point.
 */
export class VerletPoint {
    x; oldX;
    y; oldY;

    constructor(x, y) {
        this.setPosition(x, y);
    }

    setPosition(x, y) {
        this.x = this.oldX = x;
        this.y = this.oldY = y;
    }

    constraint(width, height) {
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
    }

    update() {
        // Save current position
        const tempX = this.x;
        const tempY = this.y;

        // Calculate velocity
        this.x += this.x - this.oldX;
        this.y += this.y - this.oldY;

        // Update old position
        this.oldX = tempX;
        this.oldY = tempY;
    }
}
