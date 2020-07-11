class GFX_Engine {
    static colors = {
        black: "#555555", //change black and white in code later
        blue: "#2812ee",
        orange: "#f76d0d",
        red: "#e60026",
        green: "#66e319",
        yellow: "#eeff00",
        cyan: "#00FFFF",
        purple: "#C217C2",
        white: "#000000" //change later because this is actually black
    }

    constructor(height, divId, gridSize) {
        console.log(gridSize);
        this.measures = { padding: 5, size: height / gridSize.y, border: 2}
        this.borderColor = GFX_Engine.colors.black;

        let canvas = document.createElement("canvas");
        this.context = canvas.getContext("2d");
        canvas.height = height;
        canvas.width = (this.measures.size - this.measures.border) * gridSize.x + this.measures.border + this.measures.padding * 2;
        document.getElementById(divId).append(canvas);
    }

    clear() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    }

    draw(grid) {
        const _this = this;
        grid.forEach(function(row, rowNr) {
            row.forEach(function(cell, colNr) {
                const x = (_this.measures.size - _this.measures.border) * colNr + _this.measures.padding;
                const y = (_this.measures.size - _this.measures.border) * rowNr + _this.measures.padding;

                _this.createSquare(x, y, cell.color, cell.selected);
            })
        });
    }

    createSquare(x, y, color, isGhost = false) {
        const square = { 
            x: x,
            y: y
        };
        const border = {
            x: square.x + this.measures.border,
            y: square.y + this.measures.border,
            size: this.measures.size - 2 * this.measures.border
        };
    
        if(isGhost) {
            const offset = 2;
            this.context.fillStyle = color;
            this.context.fillRect(square.x, square.y, this.measures.size, this.measures.size);
            this.context.fillStyle = "#000000";
            this.context.fillRect(border.x, border.y, border.size - offset, border.size - offset);
        } else {
            this.context.fillStyle = this.borderColor;
            this.context.fillRect(square.x, square.y, this.measures.size, this.measures.size);
            this.context.fillStyle = color;
            this.context.fillRect(border.x, border.y, border.size, border.size);
        }
    }

    findGridPosition(mousePosition, grid) {
        const _this = this;
        let result = null;
        grid.forEach(function(row, rowNr) {
            row.forEach(function(cell, colNr) {
                const square = {
                    x: (_this.measures.size - _this.measures.border) * colNr + _this.measures.padding,
                    y: (_this.measures.size - _this.measures.border) * rowNr + _this.measures.padding
                };
                if (checkBoundaries(mousePosition, square, _this)) {
                    result = { cell: cell, x: colNr, y: rowNr };
                }
            })
        });
        return result;
    }
}