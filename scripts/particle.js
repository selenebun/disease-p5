class Particle {
    constructor(x, y, state) {
        // Misc
        this.state = state;

        // Physics
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.accAmt = 1;
        this.maxSpeed = 3;
    }

    act() {
        this.wander();
        this.update();
        if (this.state === 2) this.infect();
        this.bounce();
        this.draw();
    }

    // Bounce off walls
    bounce() {
        if (this.pos.x - P_RADIUS < 0) {
            this.pos.x = P_RADIUS;
            this.vel.x *= -1;
        }
        if (this.pos.x + P_RADIUS > width) {
            this.pos.x = width - P_RADIUS;
            this.vel.x *= -1;
        }
        if (this.pos.y - P_RADIUS < 0) {
            this.pos.y = P_RADIUS;
            this.vel.y *= -1;
        }
        if (this.pos.y + P_RADIUS > height) {
            this.pos.y = height - P_RADIUS;
            this.vel.y *= -1;
        }
    }

    draw() {
        fill(COLORS[this.state]);
        noStroke();
        ellipseMode(RADIUS)
        ellipse(this.pos.x, this.pos.y, P_RADIUS, P_RADIUS);
    }

    // Infect nearby particles
    infect() {
        // Find all particles within spreadRange
        let inRange = [];
        for (let i = 0; i < particles.length; i++) {
            let e = particles[i];
            if (inCircle(e.pos.x, e.pos.y, this.pos.x, this.pos.y, SPREAD)) {
                inRange.push(e);
            }
        }
    }

    update() {
        // Update position, etc.
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);

        // State transitions
        if (this.state !== 0) {
            if (random() < TRANSITIONS[this.state - 1]) {
                this.state++;
                if (this.state > 3) this.state = 0;
            }
        }
    }

    // Wander randomly around the map
    wander() {
        this.acc = p5.Vector.random2D().mult(this.accAmt);
    }
}
