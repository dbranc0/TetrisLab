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

    setup() {
        this.gfx.draw(this.grid);
        this.currentBag = Tetriminos.getBag();
        this.currentBag = Tetriminos.getBag().concat(this.currentBag);
        this.currentPiece = cloneObject(this.currentBag.pop());
        this.createPiecesList();
    }
}