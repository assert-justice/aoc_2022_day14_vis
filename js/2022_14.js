"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function splitLines(text) {
    const lines = text.trim().split(/\r?\n/);
    if (!lines[lines.length - 1])
        lines.pop();
    return lines;
}
class HashGrid2D {
    constructor(startValue) {
        this.separator = ':';
        this.data = new Map();
        this.startValue = startValue;
    }
    toCoord(key) {
        const [x, y] = key.split(this.separator).map(Number);
        return [x, y];
    }
    toKey(x, y) {
        return [x, this.separator, y].join('');
    }
    set(x, y, val) {
        this.data.set(this.toKey(x, y), val);
    }
    get(x, y) {
        const val = this.data.get(this.toKey(x, y));
        if (val === undefined)
            return this.startValue;
        return val;
    }
    setLine(ax, ay, bx, by, val) {
        let [cx, cy] = [ax, ay];
        const dx = ax === bx ? 0 : (bx - ax) / Math.abs(bx - ax);
        const dy = ay === by ? 0 : (by - ay) / Math.abs(by - ay);
        this.set(cx, cy, val);
        while (cx !== bx || cy !== by) {
            [cx, cy] = [cx + dx, cy + dy];
            this.set(cx, cy, val);
        }
    }
    getExtents() {
        let [xMin, xMax, yMin, yMax] = [Infinity, -Infinity, Infinity, -Infinity];
        for (const key of this.data.keys()) {
            const [cx, cy] = this.toCoord(key);
            xMin = Math.min(xMin, cx);
            xMax = Math.max(xMax, cx);
            yMin = Math.min(yMin, cy);
            yMax = Math.max(yMax, cy);
        }
        return [xMin, xMax, yMin, yMax];
    }
}
var State;
(function (State) {
    State[State["Empty"] = 0] = "Empty";
    State[State["Rock"] = 1] = "Rock";
    State[State["Sand"] = 2] = "Sand";
})(State || (State = {}));
function print(grid, xMin, xMax, yMin, yMax) {
    const lookup = '.#o';
    for (let y = yMin; y <= yMax; y++) {
        const line = [];
        for (let x = xMin; x <= xMax; x++) {
            const val = grid.get(x, y);
            line.push(lookup[val]);
        }
        console.log(line.join(''));
    }
}
function drawWalls(grid, lines) {
    for (const line of lines) {
        const segments = line.split('->');
        for (let i = 0; i < segments.length - 1; i++) {
            const [ax, ay] = segments[i].split(',').map(Number);
            const [bx, by] = segments[i + 1].split(',').map(Number);
            grid.setLine(ax, ay, bx, by, State.Rock);
        }
    }
}
function main() {
    const content = document.getElementById('content');
    const dataElem = document.getElementById('data');
    const run1Button = document.getElementById('run1');
    const run2Button = document.getElementById('run2');
    const fastCheckbox = document.getElementById('fast');
    const display = document.getElementById('display');
    if (!display)
        return;
    if (!run1Button)
        return;
    if (!run2Button)
        return;
    if (!fastCheckbox)
        return;
    let delay = 50;
    fastCheckbox.onchange = (e) => {
        const target = e.target;
        delay = target.checked ? 0 : 50;
    };
    let part = 1;
    run1Button.onclick = () => { part = 1; run(); };
    run2Button.onclick = () => { part = 2; run(); };
    function simGrain(grid, sx, sy, yMax, vis, drawCell) {
        return __awaiter(this, void 0, void 0, function* () {
            if (part === 2 && grid.get(sx, sy) === State.Sand)
                return false;
            let [x, y] = [sx, sy];
            for (let i = 0; true; i++) {
                vis.drawColor = 'brown';
                drawCell(x, y);
                yield new Promise(res => setTimeout(res, delay));
                // clear the cell
                vis.drawColor = 'black';
                drawCell(x, y);
                if (y > yMax) {
                    if (part === 1)
                        return false;
                    else
                        break;
                }
                ;
                if (grid.get(x, y + 1) === State.Empty) {
                    y++;
                }
                else if (grid.get(x - 1, y + 1) === State.Empty) {
                    x--;
                    y++;
                }
                else if (grid.get(x + 1, y + 1) === State.Empty) {
                    x++;
                    y++;
                }
                else {
                    break;
                }
            }
            vis.drawColor = 'brown';
            drawCell(x, y);
            grid.set(x, y, State.Sand);
            return true;
        });
    }
    function run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!display)
                return;
            display.innerText = `Dropping Sand...`;
            const text = dataElem.value;
            if (!text)
                return;
            const lines = splitLines(text);
            const grid = new HashGrid2D(State.Empty);
            drawWalls(grid, lines);
            let [xMin, xMax, yMin, yMax] = grid.getExtents();
            const xOffset = 5;
            const yOffset = 5;
            const vis = new Splotch(content, xOffset * 2 + xMax - xMin, yOffset + yMax - yMin + 2);
            const drawCell = (x, y) => {
                vis.rect(x + xOffset - xMin, y, 1, 1);
            };
            vis.drawColor = 'green';
            for (const key of grid.data.keys()) {
                const [x, y] = grid.toCoord(key);
                drawCell(x, y);
            }
            let count = 0;
            while (yield simGrain(grid, 500, 0, yMax, vis, drawCell))
                count++;
            display.innerText = `${count} grains dropped`;
            // vis.clear();
            // let x = 1;
            // let c = 0;
            // async function cycle(){
            //     const solid = Math.abs(c % 40 - x) <= 1;
            //     if(solid){
            //         vis.rect(c % 40, Math.floor(c / 40), 1, 1);
            //     }
            //     c++;
            //     await new Promise(res => setTimeout(res,  50));
            // }
            // for (const line of lines) {
            //     if(line === 'noop'){
            //         await cycle();
            //     }
            //     else{
            //         await cycle();
            //         await cycle();
            //         x += +line.split(' ')[1];
            //         if(display) display.innerText = `X Value: ${x}`;
            //     }
            // }
        });
    }
}
window.onload = main;
