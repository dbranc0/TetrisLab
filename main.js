function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function checkBoundaries(mouse, cell, gfx) {
  return mouse.x >= cell.x + gfx.measures.border && mouse.x <= cell.x + gfx.measures.size - gfx.measures.border &&
  mouse.y >= cell.y + gfx.measures.border&& mouse.y <= cell.y + gfx.measures.size - gfx.measures.border
}

function cloneObject(object) {
let clonedObject = {};
const keys = Object.keys(object);
keys.forEach((key) => clonedObject[key] = object[key]);
return clonedObject;
}

function create2dArray(c, r) {
let array = [];
  for (let row = 0; row < r; row++) {
    array.push([]);
    array[row] = [];
    for (let col = 0; col < c; col++) {
      array[row].push(null);
    }
  }
return array;
}

let game = new Game(new GFX_Engine());
game.setup();