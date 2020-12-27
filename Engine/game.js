class Game {
    constructor(gfxEngine) {
        this.gfx = gfxEngine;
        this.grid = [];
        this.designMode = false;
        this.pieceCounter = 0;
        this.pieceHistory = [];
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
        if (this.designMode) currentPiece = Tetriminos.getGrayPiece();
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
                    if (squareToSelect.selected) squareToSelect.color = currentPiece.color;
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
        const currentPieceDiv = document.getElementById("currentPiece");
        try {
            currentPieceDiv.firstChild.remove();
        } catch (error) {
            
        }

        currentPieceDiv.appendChild(this.getPieceCanvas(this.currentPiece, "currentPiece"));

        const holdPieceDiv = document.getElementById("holdPiece");
        try {
            holdPieceDiv.firstChild.remove();
        } catch (error) {
            
        }

        try {
            holdPieceDiv.appendChild(this.getPieceCanvas(this.holdPiece, "holdPiece"));
        } catch (error) {
            
        }


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

            item.append(this.getPieceCanvas(piece, item.id));
            i--;
        }
    }

    getPieceCanvas(piece, canvasId) {
        let engine = new GFX_Engine((this.gfx.measures.size - 20) * piece.data.length, canvasId, { x:piece.data[0].length, y:piece.data.length });
        engine.draw(piece.data);
        return engine.context.canvas;
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

    addGarbage(garbageLines) {
        this.grid = this.grid.filter((v,i) => i >= garbageLines.length);
        console.log(this.grid)
        this.grid = this.grid.concat(garbageLines);
        this.gfx.draw(this.grid);
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

    updateTutorial() {
        const _this = this;
        const templateTutorial = document.getElementById("TutorialTemplate");
        const tutorialDiv = document.getElementById("Tutorial");
        tutorialDiv.innerHTML = templateTutorial.innerHTML;
        const fields = Object.keys(this.keys);
        fields.forEach(function(field) {
            tutorialDiv.innerHTML = tutorialDiv.innerHTML.replace("*" + field + "*", _this.keys[field].toUpperCase());
        });
    }

    changeKey(key) {
        this.awaitingHotkey = {awaiting: true, hotkey: key};
        const tutorialDiv = document.getElementById("Tutorial");
        tutorialDiv.innerHTML = "Press any key to remap to " + key + "<br>Press Escape to cancel"
    }

    setup() {
        this.keys = {
            CWRotation: "r",
            CCWRotation: "e",
            Hold: "q",
            GrayBlock: "g",
            Undo: "u"
        };
        this.awaitingHotkey = {awaiting: false, hotkey: ""};
        this.updateTutorial();
        this.gfx.draw(this.grid);
        this.currentBag = Tetriminos.getBag();
        this.currentBag = Tetriminos.getBag().concat(this.currentBag);
        this.currentPiece = cloneObject(this.currentBag.pop());
        this.createPiecesList();
        this.setEvents();
    }

    toggleDesignMode() {
        this.designMode = !this.designMode;
    }

    swapHeldPiece() {
        if (this.holdPiece) {
            let heldPiece = this.holdPiece;
            this.holdPiece = this.currentPiece;
            this.currentPiece = heldPiece;
        } else {
            this.holdPiece = this.currentPiece;
            this.currentPiece = cloneObject(this.currentBag.pop());
        }
        this.createPiecesList();
    }

    removePiece(pieceId) {
        this.grid.forEach(function(row, i, arr) {
            arr[i] = row.map(function(block) {
                if(block.pieceId == pieceId) {
                    return {selected: false, filled: false, color: "#000000"};
                } else { 
                    return block; 
                }
            });
        })
    }

    removeLatestPiece() {
        if (this.pieceHistory.length > 0) {
            let pieceId = this.pieceHistory.pop();
            this.removePiece(pieceId);
            this.currentBag = this.currentBag.concat([this.currentPiece]);
            this.currentPiece = Tetriminos.getPiece(pieceId.split("")[0]);
            console.log(this.currentBag);
            this.createPiecesList();
            this.gfx.draw(this.grid);
        }
    }

    setEvents() {
        const _this = this;
        document.getElementsByTagName("body")[0].addEventListener('keyup', (event) => {
            if(_this.awaitingHotkey.awaiting) {
                if (event.key != "Escape") _this.keys[this.awaitingHotkey.hotkey] = event.key;
                _this.awaitingHotkey.awaiting = false;
                _this.updateTutorial();
            } else {
                switch (event.key) {
                    case _this.keys.CCWRotation:
                        _this.rotatePiece("ccw");
                        break;
                        
                    case _this.keys.CWRotation:
                        _this.rotatePiece("cw");
                        break;
    
                    case _this.keys.Hold:
                        _this.swapHeldPiece();
                        break;

                    case _this.keys.GrayBlock:
                        _this.toggleDesignMode();
                        break;

                    case _this.keys.Undo:
                        _this.removeLatestPiece();
                        break;
                }
            }
                    
                });
                
                this.gfx.context.canvas.addEventListener("mousemove", function (event) {
                    _this.mouseMove(event);
                });
                
                this.gfx.context.canvas.addEventListener("click", function (event) {
                    const currentSquare = _this.findGridPosition(getMousePos(_this.gfx.context.canvas, event));
                    
                    let pointer = { x: 0, y: 0 };
                    let currentPiece = _this.currentPiece;
                    if (_this.designMode) currentPiece = Tetriminos.getGrayPiece();
                    let pivot = _this.currentPiece.pivot;
                    
                    _this.unselectGrid();
                    
                    let area = {
                        x: [currentSquare.x - pivot.x, currentSquare.x + (currentPiece.data[0].length - (pivot.x + 1))],
                        y: [currentSquare.y - pivot.y, currentSquare.y + (currentPiece.data.length - (pivot.y + 1))]
                    };
                    
                    
                    area = _this.pullToBottom(area);
                    if (_this.checkArea(area)) {
                        _this.pieceHistory.push(currentPiece.name + _this.pieceCounter);
                        
                        for (let r = area.y[0]; r <= area.y[1]; r++) {
                            pointer.x = 0;
                            for (let c = area.x[0]; c <= area.x[1]; c++) {
                                const squareToSelect = _this.grid[r][c];
                                if (currentPiece.data[pointer.y][pointer.x].filled) {
                                    squareToSelect.filled = currentPiece.data[pointer.y][pointer.x].filled;
                                    squareToSelect.color = currentPiece.color;
                                    squareToSelect.pieceId = currentPiece.name + _this.pieceCounter;
                                } 
                                pointer.x++;
                            }
                            pointer.y++;
                        }
                        _this.pieceCounter++;
                    }
                    
                    _this.checkLines()
                    _this.gfx.clear();
                    _this.gfx.draw(game.grid)
                    
                    if (!_this.designMode) {
                        if (_this.currentBag.length == 6) _this.currentBag = Tetriminos.getBag().concat(_this.currentBag);
                        _this.currentPiece = cloneObject(_this.currentBag.pop());
                        _this.createPiecesList();
                    }
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