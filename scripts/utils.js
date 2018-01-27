// Count occurance of each state
function countStates(entities) {
    let states = [0, 0, 0, 0];
    let total = 0;
    for (let i = 0; i < entities.length; i++) {
        states[entities[i].state]++;
        total++;
    }

    return [states, total];
}

// Check if coordinate is inside a circle
function inCircle(x, y, cx, cy, r) {
    return sq(x - cx) + sq(y - cy) < sq(r);
}
