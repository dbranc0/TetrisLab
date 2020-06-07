const measures = { padding: 5, size: 30, border: 2}
const colors = {
    white: "#ffffff", 
    red: "#ff0000",
    blue: "#0000ff",
    green: "#00ff00",
    yellow: "#ffff00",
    orange: "#ffaa00"
}
const borderColor = "#000000";
const createSquare = function(x,y, color, context) {
    const square = { 
        x: x,
        y: y
    };
    const border = {
        x: square.x + measures.border,
        y: square.y + measures.border,
        size: measures.size - 2 * measures.border
    };

    context.fillStyle = borderColor;
    context.fillRect(square.x, square.y, measures.size, measures.size);
    context.fillStyle = color;
    context.fillRect(border.x, border.y, border.size, border.size);
}

const squareColor = function(x, y, color) {
    createSquare((measures.size - measures.border) * x + measures.padding, (measures.size - measures.border) * y + measures.padding, color, ctx);
}

var ctx = document.getElementById("lab").getContext("2d");
for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
        createSquare((measures.size - measures.border) * col + measures.padding, (measures.size - measures.border) * row + measures.padding, colors.white, ctx);
    }
}
