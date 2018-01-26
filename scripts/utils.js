// Check if coordinate is inside a circle
function inCircle(x, y, cx, cy, r) {
    return sq(x - cx) + sq(y - cy) < sq(r);
}

// Remove dead entities from an array
function removeDead(entities) {
    for (let i = entities.length - 1; i >= 0; i--) {
        if (entities[i].alive) continue;
        entities.splice(i, 1);
    }
}
