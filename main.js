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

function restartGame() {
  game = new Game(game.gfx);
  game.setup();
}

function restartWithBag() {
  restartGame();
  let piecesText = "";
  while (hasIllegalPieces(piecesText)) {
    piecesText = prompt("Choose a bag with the pieces you want: \n [S Z L J I O T]", "SZLJIOT");
  }
  let newBag = Tetriminos.getSpecificBag(piecesText.split(""));
  game.currentPiece = newBag.pop();
  game.currentBag = newBag;
  game.createPiecesList();
}

function hasIllegalPieces(piecesText) {
  piecesText = piecesText.trim();
  let result = true;
  if(piecesText) {
    const arrayText = piecesText.split("");
    result = !arrayText.every(function(char) {
      return ["s","z","t","l","j","i","o"].includes(char.toLowerCase());
    });
  }
  return result;
}

let game = new Game(new GFX_Engine(window.innerHeight, "lab",  { x:10, y:20 }));
game.setup();