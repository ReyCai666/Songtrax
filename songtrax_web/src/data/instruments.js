import * as Tone from "tone";

export const toneObject = Tone;

export const toneTransport = toneObject.Transport;

export const tonePart = new toneObject.Part((time, note) => {
    guitar.triggerAttackRelease(note, "8n", time);
}, []).start(0);

export const piano = new toneObject.Sampler({
    urls: {
    "A3": "A3.mp3",
    "B3": "B3.mp3",
    "C3": "C3.mp3",
    "D3": "D3.mp3",
    "E3": "E3.mp3",
    "F3": "F3.mp3",
    "G3": "G3.mp3",
    },
    release: 1,
    baseUrl: "samples/piano/"
}).toDestination();

export const guitar = new toneObject.Sampler({
    urls: {
    "A3": "A3.mp3",
    "B3": "B3.mp3",
    "C3": "C3.mp3",
    "D3": "D3.mp3",
    "E3": "E3.mp3",
    "F3": "F3.mp3",
    "G3": "G3.mp3",
    },
    release: 1,
    baseUrl: "samples/guitar/"
}).toDestination();

export const frenchHorn = new toneObject.Sampler({
    urls: {
    "A3": "A3.mp3",
    "B3": "C4.mp3",
    "C3": "D3.mp3",
    "D3": "Ds2.mp3",
    "E3": "F3.mp3",
    "F3": "F5.mp3",
    "G3": "G2.mp3",
    },
    release: 1,
    baseUrl: "samples/french-horn/"
}).toDestination();

export const Drums = new toneObject.Sampler({
    urls: {
    "A3": "drums1.mp3",
    "B3": "drums2.mp3",
    "C3": "drums3.mp3",
    "D3": "drums4.mp3",
    "E3": "drums5.mp3",
    "F3": "drums6.mp3",
    "G3": "drums7.mp3",
    },
    release: 1,
    baseUrl: "samples/drum/"
}).toDestination();