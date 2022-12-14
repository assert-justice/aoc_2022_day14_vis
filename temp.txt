function onGrid(sim: Sim, x: number, y: number){
    return x >= 0 && x < sim.width && y >= 0 && y < sim.height
}

function countAdj(sim: Sim, x: number, y: number): number{
    let count = 0;
    for(let i = -1; i < 2; i++){
        for(let f = -1; f < 2; f++){
            if(i === 0 && f === 0) continue;
            if(!onGrid(sim, x + i, y + f)) continue;
            if(sim.getCell(x + i, y + f)) count++;
        }
    }
    return count;
}

function step(sim: Sim){
    const commands: [number, number, boolean][] = [];
    for(let x = 0; x < sim.width; x++){
        for(let y = 0; y < sim.height; y++){
            const alive = sim.getCell(x, y);
            const adj = countAdj(sim, x, y);
            if(alive){
                if(adj < 2 || adj > 3) commands.push([x, y, false]);
            }
            else{
                if(adj === 3) commands.push([x, y, true]);
            }
        }
    }
    for (const [x, y, alive] of commands) {
        sim.setCell(x, y, alive);
    }
}

function main(){
    const sim = new Sim(30, 30);
    sim.step = () => {
        step(sim);
    }
}

window.onload = main;