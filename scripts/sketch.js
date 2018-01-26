const COLORS = [
    [0, 172, 193],          // susceptible
    [255, 179, 0],          // exposed
    [213, 0, 0],            // infected
    [85, 139, 47],          // recovered
];
const P_RADIUS = 12;        // particle radius

var particles;

var INFECT_CHANCE = 0.1;    // chance for an entity to become infected
var SPREAD = 20;            // radius within which entities can be infected
var TRANSITIONS = [
    0.2,                    // exposed      -> infected
    0.01,                   // infected     -> recovered
    0.01                    // recovered    -> susceptible
];




/*
 * Other functions
 */

// Fills map randomly with particles of each state
// Requires an array of SEIR
function randomParticles(states) {
    particles = [];

    for (let i = 0; i < states.length; i++) {
        for (let j = 0; j < states[i]; j++) {
            let x = random(width);
            let y = random(height);
            particles.push(new Particle(x, y, i));
        }
    }
}


/*
 * Main p5.js functions
 */

function setup() {
    createCanvas(windowWidth, windowHeight);
    randomParticles([99, 0, 1, 0]);
}

function draw() {
    background(0);

    for (let i = 0; i < particles.length; i++) {
        particles[i].act();
    }
}
