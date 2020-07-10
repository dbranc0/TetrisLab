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

    constructor() {
        this.measures = { padding: 5, size: 37, border: 2}
        this.borderColor = GFX_Engine.colors.black;

        let canvas = document.createElement("canvas");
        this.context = canvas.getContext("2d");
        canvas.height = window.innerHeight;
        canvas.width = (this.measures.size - this.measures.border) * 10 + this.measures.border + this.measures.padding * 2;
        document.getElementById("lab").append(canvas);
    }

    clear() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    }
}