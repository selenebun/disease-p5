class Entity {
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
        if (this.pos.x - E_RADIUS < 0) {
            this.pos.x = E_RADIUS;
            this.vel.x *= -1;
        }
        if (this.pos.x + E_RADIUS > width) {
            this.pos.x = width - E_RADIUS;
            this.vel.x *= -1;
        }
        if (this.pos.y - E_RADIUS < 0) {
            this.pos.y = E_RADIUS;
            this.vel.y *= -1;
        }
        if (this.pos.y + E_RADIUS > height) {
            this.pos.y = height - E_RADIUS;
            this.vel.y *= -1;
        }
    }

    draw() {
        noStroke();
        ellipseMode(RADIUS);
        if (showRadius) {
            fill(255, 255, 255, 31);
            ellipse(this.pos.x, this.pos.y, I_RADIUS, I_RADIUS);
        }
        fill(COLORS[this.state]);
        ellipse(this.pos.x, this.pos.y, E_RADIUS, E_RADIUS);
    }

    // Infect nearby entities
    infect() {
        // Find all entities within spread range and infect
        for (let i = 0; i < entities.length; i++) {
            let e = entities[i];
            if (inCircle(e.pos.x, e.pos.y, this.pos.x, this.pos.y, I_RADIUS)) {
                if (e.state === 0 && random() < I_CHANCE) e.state = 1;
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
