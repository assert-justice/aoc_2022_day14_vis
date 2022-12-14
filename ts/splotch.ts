interface SplotchMouseEvent {
    x: number,
    y: number,
    // button: number,
}

class Splotch{
    // Canvas fields
    private canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    get context(){return this._context;}

    // Internal dimensions
    private _width: number;
    get width(){return this._width;}
    private _height: number;
    get height(){return this._height;}
    private widthRatio: number;
    private heightRatio: number;

    // Input events

    onClick = (_: SplotchMouseEvent) => {};
    onHover = (_: SplotchMouseEvent) => {};
    onEnter = (_: SplotchMouseEvent) => {};
    onExit = (_: SplotchMouseEvent) => {};

    // Colors
    clearColor: typeof this._context.fillStyle = "black";
    private _drawColor:typeof this.clearColor = "white"
    get drawColor(){return this._drawColor;}
    set drawColor(color: typeof this.clearColor){
        this._drawColor = color;
        this.context.fillStyle = color;
    }

    constructor(parent: Element | null, width: number, height: number, maxWidth = Infinity){
        if(!parent) throw 'Splotch was passed an undefined parent.';
        parent.innerHTML = '';
        let cWidth = parent.clientWidth > maxWidth ? maxWidth : parent.clientWidth;
        
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', `${cWidth}`);
        this.canvas.setAttribute('height', `${cWidth / (width / height)}`);
        const mapEvent = (e: MouseEvent): SplotchMouseEvent => {
            const xOffset = this.canvas.offsetLeft - window.pageXOffset;
            const yOffset = this.canvas.offsetTop - window.pageYOffset;
            // console.log(window.pageYOffset);
            
            const x = (e.clientX - xOffset) / this.canvas.width * width;
            const y = (e.clientY - yOffset) / this.canvas.height * height;
            return {
                x, 
                y,
            }
        }
        this.canvas.onclick = (e: MouseEvent) =>{
            this.onClick(mapEvent(e));
        }
        this.canvas.onmousemove = (e: MouseEvent) =>{
            this.onHover(mapEvent(e));
        }
        this.canvas.onmouseenter = (e: MouseEvent) =>{
            this.onEnter(mapEvent(e));
        }
        this.canvas.onmouseleave = (e: MouseEvent) =>{
            this.onExit(mapEvent(e));
        }
        this._width = width; 
        this._height = height;
        this.widthRatio = this.canvas.width / width;
        this.heightRatio = this.canvas.height / height;
        parent.appendChild(this.canvas);
        const context = this.canvas.getContext('2d');
        if(!context) throw "Could not get context";
        this._context = context;
        this.clear();
    }

    // Drawing
    clear(color: typeof this.clearColor | null = null){
        this.rect(0, 0, this.width, this.height, color ? color : this.clearColor);
    }
    rect(x: number, y: number, width: number, height: number, color:typeof this.clearColor | null = null, filled: boolean = true): void{
        if(color){
            this._context.fillStyle = color;
        }
        x = Math.floor(x * this.widthRatio);
        y = Math.floor(y * this.heightRatio);
        width = Math.floor(width * this.widthRatio);
        height = Math.floor(height * this.heightRatio);
        if(filled){
            this._context.fillRect(x, y, width, height);
        }
        else{
            this._context.rect(x, y, width, height);
        }
        if(color){
            this._context.fillStyle = this._drawColor;
        }
    }

}