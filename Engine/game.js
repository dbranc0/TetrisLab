class Game {
    constructor(gfxEngine) {
        this.gfx = gfxEngine;
        this.grid = [];
        for (let row = 0; row < 20; row++) {
            this.grid.push([]);
            for (let col = 0; col < 10; col++) {
                this.grid[row].push({ selected: false, filled: false, color: GFX_Engine.colors.white});
            }
        }
    }

    rotatePiece(direction = "cw") {
        if (this.currentPiece.name != "O") {
            let piece = cloneObject(this.currentPiece);
            let originalPivot = cloneObject(piece.pivot);
            let data = create2dArray(piece.data.length, piece.data[0].length);

            if (direction == "cw") {
                let pointer = { row: piece.data.length - 1, col: 0 };

                for (let row = 0; row < data.length; row++) {
                    for (let col = 0; col < data[0].length; col++) {
                        if (col == originalPivot.y && row == originalPivot.x) {
                            piece.pivot = { "x": pointer.row, "y": pointer.col };
                        }
                        data[row][col] = piece.data[pointer.row][pointer.col];
                        pointer.row--;
                    }
                    pointer.row = piece.data.length - 1;
                    pointer.col++;
                }

                piece.data = data;
                this.currentPiece = piece;
            }

            if (direction == "ccw") {
                let pointer = { row: 0, col: piece.data[0].length - 1 };

                for (let row = 0; row < data.length; row++) {
                    for (let col = 0; col < data[0].length; col++) {
                        if (col == originalPivot.y && row == originalPivot.x) {
                            piece.pivot = { "x": pointer.row, "y": pointer.col };
                        }
                        data[row][col] = piece.data[pointer.row][pointer.col];
                        pointer.row++;
                    }
                    pointer.row = 0;
                    pointer.col--;
                }

                piece.data = data;
                this.currentPiece = piece;
            }

            this.mouseMove(this.lastMousePos);
        }
    }

    mouseMove(event) {
        this.lastMousePos = event;
        const currentSquare = this.findGridPosition(getMousePos(this.gfx.context.canvas, event));


        let pointer = { x: 0, y: 0 };
        let currentPiece = this.currentPiece;
        let pivot = this.currentPiece.pivot;

        this.unselectGrid();
        let area = {
            x: [currentSquare.x - pivot.x, currentSquare.x + (currentPiece.data[0].length - (pivot.x + 1))],
            y: [currentSquare.y - pivot.y, currentSquare.y + (currentPiece.data.length - (pivot.y + 1))]
        };


        area = this.pullToBottom(area);

        if (this.checkArea(area)) {
            for (let r = area.y[0]; r <= area.y[1]; r++) {
                pointer.x = 0;
                for (let c = area.x[0]; c <= area.x[1]; c++) {
                    const squareToSelect = this.grid[r][c];
                    if (currentPiece.data[pointer.y][pointer.x].filled) squareToSelect.selected = currentPiece.data[pointer.y][pointer.x].filled;
                    if (squareToSelect.selected) squareToSelect.color = this.currentPiece.color;
                    pointer.x++;
                }
                pointer.y++;
            }
        }
        this.gfx.draw(this.grid);
    }

    unselectGrid() {
        this.grid.forEach(function (row) {
            row.forEach(function (c) {
                c.selected = false;
                if (!c.filled) c.color = GFX_Engine.colors.white;
            })
        })
    }

    createPiecesList() {
        const div = document.getElementById("nextPieces");
        let list = document.createElement("ul");

        let i = this.currentBag.length - 1;
        const marker = i;
        while (marker - i < 6) {
            const piece = this.currentBag[i];
            let item = document.createElement("li");
            item.innerHTML = piece.name;
            item.style.color = piece.color;
            list.appendChild(item);
            i--;
        }
        div.innerHTML = "";
        div.appendChild(list);
    }

    findGridPosition(mousePosition) {
        return this.gfx.findGridPosition(mousePosition, this.grid);
    }

    pullToBottom(area) {
        let ok = true;
        while(ok) {
            let tempArea = cloneObject(area);
            tempArea.y[0]++;
            tempArea.y[1]++;
            if (ok = this.checkArea(tempArea)) area = tempArea;
        }
        area.y[0]--;
        area.y[1]--;
        
        return area;
    }

    checkArea(area) {
        let result = false;
        let pointer = { x: 0, y: 0 };
        for (let r = area.y[0]; r <= area.y[1]; r++) {
            let rowOk = true;
            try {
                for (let c = area.x[0]; c <= area.x[1]; c++) {
                    const cell = this.grid[r][c];
                    const currentSquare = this.currentPiece.data[pointer.y][pointer.x];
                    pointer.x++;

                    if(cell.filled && !currentSquare.filled) {
                        continue;
                    }

                    if (cell.filled && currentSquare.filled) {
                        rowOk = false;
                        break;
                    }
                }
              } catch (error) {
                rowOk = false;
                break;
            }
            pointer.y++;
            pointer.x = 0;
            if (!rowOk) break;
            if (r != area.y[1]) continue;
            result = true;
        }
        return result;
    }

    setup() {
        this.gfx.draw(this.grid);
        this.currentBag = Tetriminos.getBag();
        this.currentBag = Tetriminos.getBag().concat(this.currentBag);
        this.currentPiece = cloneObject(this.currentBag.pop());
        this.createPiecesList();

        //EVENTS
        const _this = this;
        document.getElementsByTagName("body")[0].addEventListener('keyup', (event) => {
            switch (event.key) {
                case "e":
                    _this.rotatePiece("ccw");
                    break;

                case "r":
                    _this.rotatePiece("cw");
                    break;
            }

        });

        this.gfx.context.canvas.addEventListener("mousemove", function (event) {
            _this.mouseMove(event);
        });
    }
}