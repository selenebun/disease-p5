const COLORS = [
    [0, 172, 193],          // susceptible
    [255, 179, 0],          // exposed
    [213, 0, 0],            // infected
    [85, 139, 47],          // recovered
];
var E_RADIUS = 8;           // particle radius

var entities;
var population;

var I_CHANCE = 0.1;         // chance for an entity to become infected
var I_RADIUS = 24;          // radius within which entities can be infected
var TRANSITIONS = [
    1,                      // exposed      -> infected
    0.005,                  // infected     -> recovered
    0                       // recovered    -> susceptible
];

var showChart = true;       // whether to display pie chart
var showFade = false;       // whether to do a fading effect
var showRadius = false;     // whether to display infection radius




/*
 * Other functions
 */

// Return scenario string
function exportScenario() {
    return LZString.compressToBase64(JSON.stringify({
        e_radius: E_RADIUS,
        i_radius: I_RADIUS,
        i_chance: I_CHANCE,
        transitions: TRANSITIONS,
        population: population
    }));
}

// Import scenario from a scenario string
function importScenario(str) {
    try {
        let custom = JSON.parse(LZString.decompressFromBase64(str));
        document.getElementById('e_r').value = custom.e_radius;
        document.getElementById('i_r').value = custom.i_radius;
        document.getElementById('ds').value = custom.i_chance;
        document.getElementById('de').value = custom.transitions[0];
        document.getElementById('di').value = custom.transitions[1];
        document.getElementById('dr').value = custom.transitions[2];
        document.getElementById('s0').value = custom.population[0];
        document.getElementById('e0').value = custom.population[1];
        document.getElementById('i0').value = custom.population[2];
        document.getElementById('r0').value = custom.population[3];
        reset();
    } catch (err) {}
}

// Draws a pie chart of all entities
function pieChart() {
    let results = countStates(entities);
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

// Fills map randomly with entities of each state
// Requires an array of SEIR
function randomEntities(states) {
    entities = [];
    for (let i = 0; i < states.length; i++) {
        for (let j = 0; j < states[i]; j++) {
            let x = random(width);
            let y = random(height);
            entities.push(new Entity(x, y, i));
        }
    }
}

// Resets map
function reset() {
    // Set entity radius
    let e = parseInt(document.getElementById('e_r').value);
    E_RADIUS = e > 0 ? e : 1;

    // Set infection radius
    let r = parseInt(document.getElementById('i_r').value);
    I_RADIUS = r >= 0 ? r : 0;

    // Set initial population
    let ids = ['s0', 'e0', 'i0', 'r0'];
    population = [];
    for (let i = 0; i < ids.length; i++) {
        let v = parseInt(document.getElementById(ids[i]).value);
        population.push(v >= 0 ? v : 0);
    }
    randomEntities(population);

    // Set transitions
    ids = ['ds', 'de', 'di', 'dr'];
    let t = [];
    for (let i = 0; i < ids.length; i++) {
        let v = parseFloat(document.getElementById(ids[i]).value);
        t.push(constrain(v, 0, 1));
    }
    console.log(t);
    I_CHANCE = t.shift();
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
    showFade ? background(0, 63) : background(0);

    for (let i = 0; i < entities.length; i++) {
        entities[i].act();
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
        case 70:
            // F
            showFade = !showFade;
            break;
        case 71:
            // G
            showChart = !showChart;
            break;
        case 77:
            // M
            importScenario(prompt('Input scenario string:'));
            break;
        case 82:
            // R
            reset();
            break;
        case 88:
            // X
            copyToClipboard(exportScenario());
            break;
    }
}
