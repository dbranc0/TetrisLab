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
                {   filled: true   }, {   filled: true   }, {   filled: true   }, {   filled: true   }
            ]
        ]   },
        {   name: "L", color: GFX_Engine.colors.orange, pivot: { x: 0, y: 1 }, data: [
            [
                {   filled: true   }, {   filled: false   }
            ], [
                {   filled: true   }, {   filled: false   }
            ], [
                {   filled: true   }, {   filled: true   }
            ]
        ]   },
        {   name: "J", color: GFX_Engine.colors.blue, pivot: { x: 1, y: 1 },data: [
            [
                {   filled: false   }, {   filled: true   }
            ], [
                {   filled: false   }, {   filled: true   }
            ], [
                {   filled: true   }, {   filled: true   }
            ]
        ]   },
        {   name: "S", color: GFX_Engine.colors.green, pivot: { x: 1, y: 0 }, data: [
            [
                {   filled: false   }, {   filled: true   }, {   filled: true   }
            ], [
                {   filled: true   }, {   filled: true   }, {   filled: false   }
            ]
        ]   },
        {   name: "Z", color: GFX_Engine.colors.red, pivot: { x: 1, y: 0 }, data: [
            [
                {   filled: true   }, {   filled: true }, {   filled: false   }
            ], [
                {   filled: false   }, {   filled: true   }, {   filled: true   }
            ]
        ]   },
        {   name: "T", color: GFX_Engine.colors.purple, pivot: { x: 1, y: 0 }, data: [
            [
                {   filled: true   }, {   filled: true   }, {   filled: true   }
            ], [
                {   filled: false   }, {   filled: true   }, {   filled: false   }
            ]
        ]   },
        {   name: "O", color: GFX_Engine.colors.yellow, pivot: { x:0, y: 0 }, data: [
            [
                {   filled: true   }, {   filled: true   }
            ], [
                {   filled: true   }, {   filled: true   }
            ]
        ]   }
    ]

    static getPiece(name) {
        return this.pieces.find((piece) => piece.name == name.toUpperCase());
    }

    static getBag() {
        let bag = this.pieces.slice();
        shuffle(bag);
        return bag;
    }
}