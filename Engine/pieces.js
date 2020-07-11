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
        return cloneObject(this.pieces.find((piece) => piece.name == name.toUpperCase()));
    }

    static getBag() {
        let bag = [];
        this.pieces.forEach(function(piece) {
            bag.push(cloneObject(piece));
        })
        shuffle(bag);
        return bag;
    }
}