const startButton = document.getElementById("start-button");

// Initialize the Tone.js audio context
Tone.start().then(() => {
    console.log("Audio is ready");
});

// Create the instruments
const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 2,
    oscillator: {
        type: "triangle",
    },
    envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0,
        release: 0.4,
    },
}).toDestination();

const snare = new Tone.NoiseSynth({
    noise: {
        type: "white",
    },
    envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.4,
    },
}).toDestination();

const hiHat = new Tone.MetalSynth({
    frequency: 2000,
    attack: 0.001,
    decay: 0.01,
    envelope: {
        attack: 0.001,
        decay: 0.01,
    },
}).toDestination();

// Create a loop for the beat
const loop = new Tone.Loop((time) => {
    kick.triggerAttackRelease("C2", "16n", time);  // Kick on 1
    snare.triggerAttackRelease("8n", time + "8n"); // Snare on 2 and 4
    hiHat.triggerAttackRelease("16n", time + "4n"); // HiHat on every 4th note
}, "4n"); // Loop every 4 notes

// Function to start the beat
startButton.addEventListener("click", () => {
    Tone.Transport.start(); // Start the transport
    loop.start(0); // Start the loop
    startButton.disabled = true; // Disable the button once started
});

// Optional: Stop the beat (you can create another button if needed)
const stopButton = document.createElement("button");
stopButton.textContent = "Stop Beat";
document.body.appendChild(stopButton);
stopButton.addEventListener("click", () => {
    loop.stop(); // Stop the loop
    Tone.Transport.stop(); // Stop the transport
    startButton.disabled = false; // Enable the start button again
});