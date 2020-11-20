function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

class Tetriminos {
    static pieces = [
        {   name: "I", color: GFX_Engine.colors.cyan, pivot: { x: 2, y: 0 }, data: [
            [
                {   filled: true, color: GFX_Engine.colors.cyan  }, {   filled: true, color: GFX_Engine.colors.cyan   }, {   filled: true, color: GFX_Engine.colors.cyan   }, {   filled: true, color: GFX_Engine.colors.cyan   }
            ]
        ]   },
        {   name: "L", color: GFX_Engine.colors.orange, pivot: { x: 0, y: 1 }, data: [
            [
                {   filled: true, color: GFX_Engine.colors.orange   }, {   filled: false   }
            ], [
                {   filled: true, color: GFX_Engine.colors.orange   }, {   filled: false   }
            ], [
                {   filled: true, color: GFX_Engine.colors.orange   }, {   filled: true, color: GFX_Engine.colors.orange   }
            ]
        ]   },
        {   name: "J", color: GFX_Engine.colors.blue, pivot: { x: 1, y: 1 },data: [
            [
                {   filled: false   }, {   filled: true, color: GFX_Engine.colors.blue   }
            ], [
                {   filled: false   }, {   filled: true, color: GFX_Engine.colors.blue   }
            ], [
                {   filled: true, color: GFX_Engine.colors.blue   }, {   filled: true, color: GFX_Engine.colors.blue   }
            ]
        ]   },
        {   name: "S", color: GFX_Engine.colors.green, pivot: { x: 1, y: 0 }, data: [
            [
                {   filled: false   }, {   filled: true, color: GFX_Engine.colors.green   }, {   filled: true, color: GFX_Engine.colors.green   }
            ], [
                {   filled: true, color: GFX_Engine.colors.green   }, {   filled: true, color: GFX_Engine.colors.green   }, {   filled: false   }
            ]
        ]   },
        {   name: "Z", color: GFX_Engine.colors.red, pivot: { x: 1, y: 0 }, data: [
            [
                {   filled: true, color: GFX_Engine.colors.red   }, {   filled: true, color: GFX_Engine.colors.red }, {   filled: false   }
            ], [
                {   filled: false   }, {   filled: true, color: GFX_Engine.colors.red   }, {   filled: true, color: GFX_Engine.colors.red   }
            ]
        ]   },
        {   name: "T", color: GFX_Engine.colors.purple, pivot: { x: 1, y: 0 }, data: [
            [
                {   filled: true, color: GFX_Engine.colors.purple   }, {   filled: true, color: GFX_Engine.colors.purple   }, {   filled: true, color: GFX_Engine.colors.purple   }
            ], [
                {   filled: false   }, {   filled: true, color: GFX_Engine.colors.purple   }, {   filled: false   }
            ]
        ]   },
        {   name: "O", color: GFX_Engine.colors.yellow, pivot: { x:0, y: 0 }, data: [
            [
                {   filled: true, color: GFX_Engine.colors.yellow   }, {   filled: true, color: GFX_Engine.colors.yellow   }
            ], [
                {   filled: true, color: GFX_Engine.colors.yellow   }, {   filled: true, color: GFX_Engine.colors.yellow   }
            ]
        ]   }
    ]

    static getPiece(name) {
        let piece = cloneObject(this.pieces.find((piece) => piece.name == name.toUpperCase()));
        return this.rotateRandomTimes(piece);
    }

    static rotateRandomTimes(piece) {
        const timesToRotate = Math.floor(Math.random() * (5));
        for (let i = 0; i < timesToRotate; i++) {
            piece = this.rotatePiece(piece);
        }
        return piece;
    }

    static getBag() {
        let bag = [];
        const _this = this;
        this.pieces.forEach(function(piece) {
            bag.push(_this.rotateRandomTimes(cloneObject(piece)));
        })
        shuffle(bag);
        return bag;
    }

    static getSpecificBag(pieces) {
        let bag = [];
        const _this = this;
        for (let i = pieces.length - 1; i >= 0; i--) {
            const piece = pieces[i];
            bag.push(_this.getPiece(piece));
        }
        return bag;
    }

    static rotatePiece(piece) {
        piece = cloneObject(piece);
        let originalPivot = cloneObject(piece.pivot);
        let data = create2dArray(piece.data.length, piece.data[0].length);

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
        return piece;
    }

    static getGrayPiece() {
        return {  selected:false, filled: true, color: GFX_Engine.colors.gray  };
    }

    static createLines(nrOfLines, wellBegin, wellLength) {
        const emptySpace = {    selected: false, filled: false, color: GFX_Engine.colors.white  };
        let line = [];
        for(let i = 0; i < 10; i++) {
            if((i + 1) < wellBegin || (i + 1) >= (wellBegin + wellLength)) {
                line.push(this.getGrayPiece());
            } else {
                line.push(emptySpace);
            }
        }

        let lines = [];
        for(let i = 0; i < nrOfLines; i++) {
            lines.push(line);
        }

        return lines;
    }
}