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
        div.innerHTML = "";
        div.appendChild(list);

        let i = this.currentBag.length - 1;
        const marker = i;
        while (marker - i < 6) {
            const piece = this.currentBag[i];
            let item = document.createElement("li");
            item.id = "piece" + i;
            list.appendChild(item);
            
            try {
                piece.engine.context.canvas.remove();
            } catch(error) {
                //ignore error
            }

            piece.engine = new GFX_Engine(window.innerHeight / 20, item.id, { x:piece.data[0].length, y:piece.data.length });
            piece.engine.draw(piece.data);
            item.append(piece.engine.context.canvas);
            i--;
        }
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

    generateLine() {
        let result = [];
        for (let i = 0; i < 10; i++) {
            result.push({selected: false, filled: false, color: "#000000"});
        }
        this.grid = [result].concat(game.grid);
    }
    
    checkLines() {
        let _this = this;
        let finishedChecking = false;
        while(!finishedChecking) {
            for (let i = 0; i < this.grid.length; i++) {
                const row = this.grid[i];
                let rowComplete = row.filter(function(cell) { return !cell.filled; }).length == 0;
                
                if(rowComplete) {
                    this.grid.splice(i,1);
                    this.generateLine();
                    break;
                }

                if(i == this.grid.length - 1) finishedChecking = true;
            }
        }
    }

    setup() {
        this.gfx.draw(this.grid);
        this.currentBag = Tetriminos.getBag();
        this.currentBag = Tetriminos.getBag().concat(this.currentBag);
        this.currentPiece = cloneObject(this.currentBag.pop());
        this.createPiecesList();

        //EVENTS
        this.setEvents();

    }

    setEvents() {
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
                
                this.gfx.context.canvas.addEventListener("click", function (event) {
                    const currentSquare = _this.findGridPosition(getMousePos(_this.gfx.context.canvas, event));
                    
                    let pointer = { x: 0, y: 0 };
                    let currentPiece = _this.currentPiece;
                    let pivot = _this.currentPiece.pivot;
                    
                    _this.unselectGrid();
                    
                    let area = {
                        x: [currentSquare.x - pivot.x, currentSquare.x + (currentPiece.data[0].length - (pivot.x + 1))],
                        y: [currentSquare.y - pivot.y, currentSquare.y + (currentPiece.data.length - (pivot.y + 1))]
                    };
                    
                    
                    area = _this.pullToBottom(area);
                    if (_this.checkArea(area)) {
                        for (let r = area.y[0]; r <= area.y[1]; r++) {
                            pointer.x = 0;
                            for (let c = area.x[0]; c <= area.x[1]; c++) {
                                const squareToSelect = _this.grid[r][c];
                                if (currentPiece.data[pointer.y][pointer.x].filled) {
                                    squareToSelect.filled = currentPiece.data[pointer.y][pointer.x].filled;
                                    squareToSelect.color = _this.currentPiece.color;
                                } 
                                pointer.x++;
                            }
                            pointer.y++;
                        }
                    }
                    
                    _this.checkLines()
                    _this.gfx.clear();
                    _this.gfx.draw(game.grid)
                    
                    if (_this.currentBag.length == 6) _this.currentBag = Tetriminos.getBag().concat(_this.currentBag);
                    _this.currentPiece = cloneObject(_this.currentBag.pop());
                    _this.createPiecesList();
                })
                document.getElementById("lab").onmouseout = function(event) {
                            _this.unselectGrid();
                            _this.gfx.draw(_this.grid);
                };
                
                window.onresize = function(event) {
                            _this.gfx.context.canvas.remove();
                            _this.gfx = new GFX_Engine(event.target.innerHeight, "lab", { x:10, y:20 });
                            _this.gfx.draw(_this.grid);
                            _this.createPiecesList();
                            _this.setEvents();
                };
    }
}