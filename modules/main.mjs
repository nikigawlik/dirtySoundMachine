import { createSoundBuffer, playSound, setValue as audioSetValue, buffer as audioBuffer } from "./audio.mjs";
import { setCanvas } from "./visualizer.mjs";
import { donwloadAsWAV } from "./downloadWav.mjs";

let controls = [];

window.onload = () => {
    init();
}

function init() {
    let waveCanvas = document.querySelector("canvas");
    let ctx = waveCanvas.getContext("2d");
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, waveCanvas.width, waveCanvas.height);
    setCanvas(waveCanvas);

    setupControls();
    createSoundBuffer();

    document.querySelector("button.playSound").onclick = ev => playSound();
    document.querySelector("button.randomize").onclick = ev => {
        controls.forEach(ctrl => ctrl.randomize())
        createSoundBuffer();
        playSound();
    };
    document.querySelector("button.download").onclick = ev => {
        donwloadAsWAV(audioBuffer, audioBuffer.length);
    };
}


function setupControls() {
    let container = document.querySelector("div.slider-area");
    let labelElements = container.querySelectorAll("label");
    let rangeElements = container.querySelectorAll("input[type=range]");
    let numberElements = container.querySelectorAll("input[type=number]");

    if(labelElements.length != rangeElements.length || labelElements.length != numberElements.length) {
        console.error("element lists mismatch");
    }

    for(let i = 0; i < labelElements.length; i++) {
        let control = new Control("temp", labelElements[i], rangeElements[i], numberElements[i]);
        controls.push(control);
    }
    createSoundBuffer();
}

class Control {
    constructor(name, labelElement, rangeElement, numberElement) {
        this.value = 0;
        this.rangeElement = rangeElement;
        this.numberElement = numberElement;

        this.setValue(rangeElement.value);
        rangeElement.oninput = ev => {
            this.setValue(rangeElement.value);
            createSoundBuffer();
        }
        numberElement.oninput = ev => {
            this.setValue(numberElement.value);
            createSoundBuffer();
        }
    }

    randomize() {
        let min = Number(this.rangeElement.min);
        let max = Number(this.rangeElement.max);
        this.setValue(min + Math.round(Math.random() * (max - min)));
    }

    setValue(value) {
        value = Number(value);
        this.rangeElement.value = value;
        this.numberElement.value = value;
        this.value = value;
        audioSetValue(this.rangeElement.name || this.numberElement.name, value);
    }
}