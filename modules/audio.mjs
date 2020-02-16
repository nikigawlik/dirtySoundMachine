import { setBuffer } from "./visualizer.mjs";

let audioCtx = new AudioContext();
let master = audioCtx.createGain();
setMasterGain(0.15);
master.connect(audioCtx.destination);

export function setMasterGain(gain) {
    master.gain.setValueAtTime(gain, audioCtx.currentTime); // keep it civil!
}

let settings = {
    attack: 3, 
    hold: 100,
    decay: 3,
    freq: 440,
    freqSlide: 0,
    srate: 8000,
    shape: 0,
    slopes: 0,
}

export function setValue(name, value) {
    settings[name] = value;
}

export let buffer = null;

export function createSoundBuffer() {
    let srate = settings.srate;
    let samples = (settings.attack + settings.decay + settings.hold) / 1000 * srate;
    let atk = Math.max(settings.attack, 0);
    let hold = Math.max(settings.hold, 0);
    let dec = Math.max(settings.decay, 0);
    let freq1 = settings.freq;
    let freq2 = settings.freq + settings.freqSlide;
    buffer = audioCtx.createBuffer(1, samples, srate);
    let data = buffer.getChannelData(0);
    let env = 0;
    let preDistortion = settings.shape / 40;
    let slopesShape = settings.slopes / 40;
    
    for(let t = 0; t < samples; t++) {
        const prog = t/samples;
        const freq = freq1 * (1 - prog) + freq2 * (prog);
        const ms = t / (srate / 1000);
        env = ms <= atk? ms / atk : ms <= (atk+hold)? 1 : 1-(ms-hold-atk)/dec;
        env = Math.max(0, env);
        // env = 1
        let val = Math.sin(t / srate * 2 * Math.PI * freq);
        // distortion
        val = Math.sign(val) * Math.abs(val)**(1/(10**preDistortion));
        env = Math.sign(env) * Math.abs(env)**(1/(10**slopesShape));
        val *= env;
        data[t] = val;
    }

    setBuffer(buffer);
}

export function playSound() {
    let source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(master);
    source.start();
}
