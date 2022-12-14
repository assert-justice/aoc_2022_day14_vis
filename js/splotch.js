"use strict";
class Splotch {
    constructor(parent, width, height, maxWidth = Infinity) {
        // Input events
        this.onClick = (_) => { };
        this.onHover = (_) => { };
        this.onEnter = (_) => { };
        this.onExit = (_) => { };
        // Colors
        this.clearColor = "black";
        this._drawColor = "white";
        if (!parent)
            throw 'Splotch was passed an undefined parent.';
        parent.innerHTML = '';
        let cWidth = parent.clientWidth > maxWidth ? maxWidth : parent.clientWidth;
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', `${cWidth}`);
        this.canvas.setAttribute('height', `${cWidth / (width / height)}`);
        const mapEvent = (e) => {
            const xOffset = this.canvas.offsetLeft - window.pageXOffset;
            const yOffset = this.canvas.offsetTop - window.pageYOffset;
            // console.log(window.pageYOffset);
            const x = (e.clientX - xOffset) / this.canvas.width * width;
            const y = (e.clientY - yOffset) / this.canvas.height * height;
            return {
                x,
                y,
            };
        };
        this.canvas.onclick = (e) => {
            this.onClick(mapEvent(e));
        };
        this.canvas.onmousemove = (e) => {
            this.onHover(mapEvent(e));
        };
        this.canvas.onmouseenter = (e) => {
            this.onEnter(mapEvent(e));
        };
        this.canvas.onmouseleave = (e) => {
            this.onExit(mapEvent(e));
        };
        this._width = width;
        this._height = height;
        this.widthRatio = this.canvas.width / width;
        this.heightRatio = this.canvas.height / height;
        parent.appendChild(this.canvas);
        const context = this.canvas.getContext('2d');
        if (!context)
            throw "Could not get context";
        this._context = context;
        this.clear();
    }
    get context() { return this._context; }
    get width() { return this._width; }
    get height() { return this._height; }
    get drawColor() { return this._drawColor; }
    set drawColor(color) {
        this._drawColor = color;
        this.context.fillStyle = color;
    }
    // Drawing
    clear(color = null) {
        this.rect(0, 0, this.width, this.height, color ? color : this.clearColor);
    }
    rect(x, y, width, height, color = null, filled = true) {
        if (color) {
            this._context.fillStyle = color;
        }
        x = Math.floor(x * this.widthRatio);
        y = Math.floor(y * this.heightRatio);
        width = Math.floor(width * this.widthRatio);
        height = Math.floor(height * this.heightRatio);
        if (filled) {
            this._context.fillRect(x, y, width, height);
        }
        else {
            this._context.rect(x, y, width, height);
        }
        if (color) {
            this._context.fillStyle = this._drawColor;
        }
    }
}
