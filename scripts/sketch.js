const COLORS = [
    [0, 172, 193],          // susceptible
    [255, 179, 0],          // exposed
    [213, 0, 0],            // infected
    [85, 139, 47],          // recovered
];
var P_RADIUS = 8;           // particle radius

var particles;

var I_CHANCE = 0.1;         // chance for an entity to become infected
var I_RADIUS = 24;          // radius within which entities can be infected
var TRANSITIONS = [
    1,                      // exposed      -> infected
    0.005,                  // infected     -> recovered
    0                       // recovered    -> susceptible
];

var showChart = true;       // whether to display pie chart
var showRadius = false;     // whether to display infection radius




/*
 * Other functions
 */

// Draws a pie chart of all entities
function pieChart() {
    let results = countStates(particles);
    let states = results[0];
    let total = results[1];

    // Draw pie chart
    let radius = 75;
    let lastAngle = 0;
    for (let i = 0; i < states.length; i++) {
        let angle = states[i] / total * TWO_PI;
        if (angle === 0) continue;

        // Arc
        fill(COLORS[i].concat(191));
        noStroke();
        ellipseMode(RADIUS);
        arc(100, 100, radius, radius, lastAngle, lastAngle + angle);
        lastAngle += angle;
    }
}

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

// Resets map
function reset() {
    // Set particle radius
    let p = parseInt(document.getElementById('p_r').value);
    P_RADIUS = p > 0 ? p : 1;

    // Set infection radius
    let r = parseInt(document.getElementById('i_r').value);
    I_RADIUS = r >= 0 ? r : 0;

    // Set initial population
    let ids = ['s0', 'e0', 'i0', 'r0'];
    let population = [];
    for (let i = 0; i < ids.length; i++) {
        let v = parseInt(document.getElementById(ids[i]).value);
        population.push(v >= 0 ? v : 0);
    }
    randomParticles(population);

    // Set transitions
    ids = ['ds', 'de', 'di', 'dr'];
    let t = [];
    for (let i = 0; i < ids.length; i++) {
        let v = parseFloat(document.getElementById(ids[i]).value);
        t.push(constrain(v, 0, 1));
    }
    INFECT_CHANCE = t.shift();
    TRANSITIONS = t;
}




/*
 * Main p5.js functions
 */

function setup() {
    let m = document.getElementById('sketch');
    let canvas = createCanvas(m.offsetWidth, m.offsetHeight);
    canvas.parent(m);
    resizeCanvas(m.offsetWidth, m.offsetHeight, true);
    
    reset();
}

function draw() {
    background(0);

    for (let i = 0; i < particles.length; i++) {
        particles[i].act();
    }

    if (showChart) pieChart();
}




/*
 * User input
 */

function keyPressed() {
    switch (keyCode) {
        case 32:
            // Spacebar
            showRadius = !showRadius;
            break;
        case 71:
            // G
            showChart = !showChart;
            break;
        case 82:
            // R
            reset();
            break;
    }
}
