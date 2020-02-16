/**
 * @type {HTMLCanvasElement}
 */
let canvas = null;
/**
 * @type {CanvasRenderingContext2D}
 */
let ctx = null;

export function setCanvas(cnv) {
    canvas = cnv;
    ctx = canvas.getContext("2d");
}


/**
 * 
 * @param {AudioBuffer} buffer 
 */
export function setBuffer(buffer) {
    let data = buffer.getChannelData(0);
    let px = 0;
    let py = 0;
    ctx.fillStyle = "#222"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#aaa";
    ctx.beginPath();
    for(let t = 0; t < data.length; t++) {
        const x = t/data.length * canvas.width;
        const y = (data[t] + 1) * canvas.height / 2;
        if(t > 0) {
            //drawln
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
        }
        px = x;
        py = y;
    }
    ctx.stroke();
}