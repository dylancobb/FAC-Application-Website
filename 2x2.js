/*****************
 * 2x2 Generator *=============================================================
 *****************/

let pat = [];

// generate first melodic interval
for (let i = -7; i <= 7; ++i) {
    // exclude dissonant leaps
    if (Math.abs(i) === 6)
        continue;
    // generate second melodic interval
    for (let j = -7; j <= i; ++j) {
        // exclude dissonant leaps
        if ((Math.abs(j) === 6)
            // exclude "unrecovered" leaps larger than a 3rd
            || ((Math.abs(i) > 2 || Math.abs(j) > 2) && i * j > 0))
            continue;
        // pass melodic model to consonances() to complete pattern
        consonances(i, j);
    }
}

// find valid consonances to accompany melodic models
function consonances(i, j) {
    // generate first vertical interval
    for (let k = 0; k < (i - j + 7); ++k) {
        // second vertical interval is algebraically inferred
        let n = k + j - i;
        // first vertical int may not be dissonant
        if ((k % 7 === 1 || k % 7 === 6)
            // second vertical int may not be dissonant
            || (Math.abs(n) % 7 === 1 || Math.abs(n) % 7 === 6)
            // absolute magnitude of second vertical int should be less than 7
            // except for the unique combination of 7 and -7 for the two ints
            || (Math.abs(n) >= 7 && (k !== 7 || n !== -7))
            // exclude perfect consonances approached by parallel motion
            || (i !== 0 && i === j && (k === 0 || k === 4))
            // exclude contrary motion between perfects and their compounds
            || (i - 7 === j && (k === 7 || k === 11))
            // if first int is unison, second should not be negative
            || (k === 0 && n < 0)
            // exclude redundant duplicate patterns containing voice-crossing
            || (k < Math.abs(n)))
            continue;

        // assemble pattern data
        pat.push({
            // pattern intervals
            val: [i, j, k, n],
            // index of elaboration
            jv: get_jv(k, n),
        });
    }
}

// calculates the index a pattern elaborates at
function get_jv(x, y) {
    let jv = -x - y;
    while (jv < -13)
        jv += 7;
    return jv;
}

/*******************
 * Pattern Filters *===========================================================
 *******************/

// set up arrays to track filters
let filterIndex = [];
let jvFlag = new Array(14);
let modelFlag = new Array(15);
for (i = 0; i < modelFlag.length; i++)
    modelFlag[i] = true;
modelFlag[7] = false;
jvFirstType();
applyFilters();

// populates pattern data block with specified pattern's data
function patternData(i) {
    // show score snippet
    showScore(i);
    const playButton = document.getElementById("play-container");
    playButton.innerHTML = `<p id="rand-button" onclick="patRandom()">Rand.</p>
    <p id="play-button" onclick="playPattern()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path
                d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z">
            </path>
        </svg>
    </p>`;
}

// toggle the state of given Jv filters
function jvToggle(x) {
    jvFlag[x] = !jvFlag[x];
    applyFilters();
}

// hides/shows patterns based on all flags
function applyFilters() {
    for (let i = 0; i < 256; i++) {
        if (filterJv(i) && modelEntry(i) && filterVP(i))
            filterIndex.push(i);
        else
            continue;
    }
}

// returns true if a given pattern matches the currently toggled JJv, else false
function filterJv(x) {
    for (let i = 0; i <= 13; i++) {
        if (pat[x].jv === 0 - i && jvFlag[i])
            return true;
    }
    return false;
}

// returns true if a given pattern matches the currently toggled model, else false
function modelEntry(x) {
    let exCounter = 0;
    for (let i = -7; i <= 7; i++) {
            if (pat[x].val[0] === i && modelFlag[i + 7])
                exCounter++;
            if (pat[x].val[1] === i && modelFlag[i + 7])
                exCounter++;
    }
    if (exCounter > 1)
        return true;
    return false;
}

// returns true if a given pattern matches the currently toggled voice pair
// applicability, else false
function filterVP(x) {
    // valid in the outer voice pair (no direct perfects, no fourths)
    if ((pat[x].val[0] * pat[x].val[1] > 0
        && (Math.abs(pat[x].val[2] % 7) === 0 || Math.abs(pat[x].val[2] % 7) === 4
            || Math.abs(pat[x].val[3] % 7) === 0 || Math.abs(pat[x].val[3] % 7) === 4))
        || (Math.abs(pat[x].val[2] % 7) === 3 || Math.abs(pat[x].val[3] % 7) === 3)
        || ((Math.abs(pat[x].val[2] % 7) === 0 || Math.abs(pat[x].val[2] % 7) === 4)
            && (Math.abs(pat[x].val[3] % 7) === 0 || Math.abs(pat[x].val[3] % 7) === 4))
        && x !== 33 && x !== 36 && x !== 151 && x !== 213)
        return false;
    return true;
}

// shows just the 1JJv
function jvFirstType() {
    jvNone();
    jvToggle(0);
    jvToggle(7);
    jvToggle(3);
    jvToggle(10);
    jvToggle(4);
    jvToggle(11);
}

// set all Jv toggles to off
function jvNone() {
    for (let i = 0; i <= 13; i++) {
        jvFlag[i] = false;
    }
    applyFilters();
}

// goes to a random pattern from the currently filtered list
function patRandom() {
    patternData(filterIndex[Math.floor(Math.random() * filterIndex.length)]);
}

/**********************
 * Notation Rendering *========================================================
 **********************/

// test arrays to render
let voiceOne = [[-4, 4], [-5, 4], [2, 4], [1, 4], [8, 4], [7, 4]];
let voiceTwo = [[-8, 4], [-1, 4], [-2, 4], [5, 4], [4, 4], [11, 4]];
let timeTotal = 2;
for (let i = 0; i < voiceOne.length; i++) {
    timeTotal += voiceOne[i][1];
}
// sets the scale of the output
const unitSize = 50;
const lineHeight = 0.24 * unitSize;
const staffThickness = unitSize / 65;
const hexRed = "#BB2F3D";
const hexBlue = "#3C5EC4";

// notation canvas dimensions
let c = document.getElementById("myCanvas");
myHeight = 5 * unitSize
c.height = myHeight;
myWidth = 6 * unitSize * 1.15;
c.width = myWidth;
let ctx = c.getContext("2d");

drawStaff(0, myWidth);

// animate the placement of notes
let intervId;
let myOffset;
let myAlpha;

function refreshScore() {
    myOffset = 4;
    myAlpha = 0.07;
    intervId = setInterval(placeNotes, 30);
}

// place the notes
function placeNotes() {
    ctx.clearRect(0, 0, myWidth, myHeight);
    drawStaff(0, myWidth);
    let oneX = [2];
    let twoX = [2];
    for (let i = 1; i < voiceOne.length; i++) {
        oneX.push(oneX[i - 1] + voiceOne[i - 1][1]);
        twoX.push(twoX[i - 1] + voiceTwo[i - 1][1]);
    }
    // add voice crossing offsets
    for (let i = 0; i < voiceOne.length; i++) {
        for (let j = 0; j < voiceOne.length; j++) {
            if (twoX[j] === oneX[i]) {
                if (voiceOne[i][0] < voiceTwo[j][0]) {
                    oneX[i] += 0.25;
                    twoX[j] -= 0.25;
                }
                break;
            }
        }
    }
    for (let i = 0; i < voiceOne.length; i++) {
        noteDown(twoX[i] / timeTotal, voiceTwo[i][0], hexBlue, myOffset, myAlpha);
        noteUp(oneX[i] / timeTotal, voiceOne[i][0], hexRed, myOffset, myAlpha);
    }

    if (myAlpha === 1) {
        clearInterval(intervId);
    }

    myOffset = myOffset * 2 / 3;
    let x = 1 - myAlpha;
    x = x * 2 / 3;
    myAlpha = 1 - x;

    if (myAlpha > 0.99) {
        myOffset = 0;
        myAlpha = 1;
    }
}

// draw staff lines between two x-coordinates
function drawStaff(startX, endX) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    for (let i = -(2 * lineHeight); i <= (2 * lineHeight); i += lineHeight) {
        ctx.moveTo(startX, myHeight / 2 + i);
        ctx.lineWidth = staffThickness;
        ctx.lineTo(endX, myHeight / 2 + i);
    }
    ctx.stroke();
}

// create a note with an upward stem
function noteUp(x, y, color, offset = 0, alpha = 1) {
    color += Math.round((alpha) * 255).toString(16).padStart(2);
    drawLedger(x, y, alpha);
    drawNote(x, y + offset, color);
    drawStemUp(x, y + offset, color);
}

// create a note with a downward stem
function noteDown(x, y, color, offset = 0, alpha = 1) {
    color += Math.round((alpha) * 255).toString(16).padStart(2, "0");
    drawLedger(x, y, alpha);
    drawNote(x, y - offset, color);
    drawStemDown(x, y - offset, color);
}

// draw a notehead at a given position, plus ledgers if necessary
function drawNote(x, y, color) {
    // Draw the ellipse
    let ellipseX = myWidth * x;
    let ellipseY = myHeight / 2 + (- y * lineHeight) / 2;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(ellipseX, ellipseY, 0.46 * lineHeight, 0.66 * lineHeight,
        Math.PI / 3, 0, 2 * Math.PI);
    ctx.ellipse(ellipseX, ellipseY, 0.2 * lineHeight, 0.60 * lineHeight,
        Math.PI / 3, 0, 2 * Math.PI);
    ctx.fill("evenodd");

    // prepare stroke for stem coloring
    ctx.strokeStyle = color;
    ctx.lineWidth = staffThickness * 2;
}

// draw ledger lines as appropriate
function drawLedger(x, y, alpha = 1) {
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.lineWidth = staffThickness * 2.5;
    ledgerX = myWidth * x;
    if (y > 5) {
        let baseLine = myHeight / 2 - 2 * lineHeight;
        let ledgers = (y - 4) / 2;
        for (let i = 1; i <= ledgers; i++) {
            let ledgerPos = baseLine - i * lineHeight;
            ctx.beginPath();
            ctx.moveTo(ledgerX - lineHeight, ledgerPos);
            ctx.lineTo(ledgerX + lineHeight, ledgerPos);
            ctx.stroke();
        }
    }
    if (y < -5) {
        let baseLine = myHeight / 2 + 2 * lineHeight;
        let ledgers = (-y - 4) / 2;
        for (let i = 1; i <= ledgers; i++) {
            let ledgerPos = baseLine + i * lineHeight;
            ctx.beginPath();
            ctx.moveTo(ledgerX - lineHeight, ledgerPos);
            ctx.lineTo(ledgerX + lineHeight, ledgerPos);
            ctx.stroke();
        }
    }
}

// draw an upward step to a given notehead
function drawStemUp(x, y, color) {
    // draw the stem
    let stemX = myWidth * x + 1.15 * lineHeight / 2;
    let stemStartY = myHeight / 2 - lineHeight / 5 - (y * lineHeight / 2);
    let stemEndY = myHeight / 2 - 3.5 * lineHeight - (y * lineHeight / 2);

    ctx.beginPath();
    ctx.moveTo(stemX, stemStartY);
    ctx.lineTo(stemX, stemEndY);
    ctx.stroke();
}

// draw a downward stem to a given notehead
function drawStemDown(x, y, color) {
    // draw the stem
    let stemX = myWidth * x - 1.15 * lineHeight / 2;
    let stemStartY = myHeight / 2 + lineHeight / 5 - (y * lineHeight / 2);
    let stemEndY = myHeight / 2 + 3.5 * lineHeight - (y * lineHeight / 2);

    ctx.beginPath();
    ctx.moveTo(stemX, stemStartY);
    ctx.lineTo(stemX, stemEndY);
    ctx.stroke();
}

// generate the first voice's melody (un-normalised)
function getVoiceOne(i) {
    let voiceOneArray = [pat[i].val[2]];
    voiceOneArray.push(voiceOneArray[0] + pat[i].val[1]);
    voiceOneArray.push(voiceOneArray[1] + pat[i].val[0]);
    voiceOneArray.push(voiceOneArray[2] + pat[i].val[1]);
    voiceOneArray.push(voiceOneArray[3] + pat[i].val[0]);
    voiceOneArray.push(voiceOneArray[4] + pat[i].val[1]);
    return voiceOneArray;
}

// generate the second voice's melody (un-normalised)
function getVoiceTwo(i) {
    let voiceTwoArray = [0];
    voiceTwoArray.push(voiceTwoArray[0] + pat[i].val[0]);
    voiceTwoArray.push(voiceTwoArray[1] + pat[i].val[1]);
    voiceTwoArray.push(voiceTwoArray[2] + pat[i].val[0]);
    voiceTwoArray.push(voiceTwoArray[3] + pat[i].val[1]);
    voiceTwoArray.push(voiceTwoArray[4] + pat[i].val[0]);
    return voiceTwoArray;
}

// normalise the two voices about the central line of the staff, then print
function showScore(x) {
    let unNormOne = getVoiceOne(x);
    let unNormTwo = getVoiceTwo(x);
    let high = unNormOne[0];
    let low = unNormOne[0];
    for (let i = 0; i < unNormOne.length; i++) {
        if (unNormOne[i] > high)
            high = unNormOne[i];
        if (unNormTwo[i] > high)
            high = unNormTwo[i];
        if (unNormOne[i] < low)
            low = unNormOne[i];
        if (unNormTwo[i] < low)
            low = unNormTwo[i];
    }
    let offset = Math.floor((high - low) / 2) - high;
    voiceOne = [];
    voiceTwo = [];
    for (let i = 0; i < unNormOne.length; i++) {
        voiceOne.push([unNormOne[i] + offset, 4]);
        voiceTwo.push([unNormTwo[i] + offset, 4]);
    }
    refreshScore();
}

/******************
 * Audio Playback *========================================================
 ******************/

let audioContext = new AudioContext();

function DiaToChromatic(x) {
    const scale = [-10, -8, -7, -5, -3, -1, 0, 2, 4, 5, 7, 9, 11];
    x -= 1;
    // get octaves
    let oct = x >= 0 ? Math.floor(x / 7) : Math.ceil(x / 7);
    // scale degree to semitones
    let dia = scale[x % 7 + 6];

    return (oct * 12) + dia;
}

function playPattern() {
    let timing = [0];
    for (let i = 1; i < voiceOne.length; i++) {
        timing.push(timing[i - 1] + voiceOne[i - 1][1]);
    }
    audioContext.close();
    audioContext = new AudioContext();
    for (let i = 0; i < voiceOne.length; i++) {
        play(timing[i] / 6, DiaToChromatic(voiceOne[i][0]), 0.66, 0.5, 1)
        play(timing[i] / 6, DiaToChromatic(voiceTwo[i][0]), 0.66, -0.5, 0)
    }
}

function stopPlaying() {
    audioContext.close();
}

function play(delay, pitch, duration, panVal, oscType) {
    let startTime = audioContext.currentTime + delay;
    let endTime = startTime + duration;
    let oscillator = audioContext.createOscillator();
    let vol = audioContext.createGain();
    let filter = audioContext.createBiquadFilter();
    let pan = audioContext.createStereoPanner();
    oscillator.connect(vol).connect(filter).connect(pan).connect(audioContext.destination);

    filter.type = 'lowpass';
    oscillator.type = oscType ? "sawtooth" : "triangle";
    vol.gain.value = 0.05;

    pan.pan.value = panVal;

    oscillator.frequency.value = 440 * Math.pow(2, (pitch + 3) / 12);

    // add audioContext.currentTime
    oscillator.start(audioContext.currentTime + delay);
    oscillator.stop(audioContext.currentTime + delay + duration);
    filter.frequency.setValueAtTime(oscType ? 1000 : 2000, audioContext.currentTime + delay);
    filter.frequency.linearRampToValueAtTime(oscType ? 500 : 750, audioContext.currentTime + delay + duration);
    vol.gain.setValueAtTime(0.06, audioContext.currentTime + delay);
    vol.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + delay + duration);

}

/******************
 * Scroll Trigger *========================================================
 ******************/

scrolledFlag = false;
window.onscroll = function() {
    var triggerElement = document.getElementById("myCanvas");
    var triggerPoint = triggerElement.offsetTop + 400;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var clientHeight = document.documentElement.clientHeight;
    if (scrollTop >= triggerPoint - clientHeight && scrolledFlag === false) {
        patRandom();
        scrolledFlag = true;
    }
};