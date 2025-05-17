document.addEventListener('DOMContentLoaded', () => {
  const buttonStart = document.getElementById("start-button");
  const buttonClear = document.getElementById("clear-button");
  const container = document.getElementById("content");
  
  const rows = ["A3", "A#4", "E4", "F4", "A4", "A#3", "D4", "C#4"];
  const cols = 8;
  const grid = Array.from({ length: rows.length }, () => Array(cols).fill(false));
  const cells = [];
  
  let audioInitialized = false;
  let isPlaying = false;
  let sequence = null;
  const synth = new Tone.PolySynth().connect(new Tone.Reverb({ decay: 2.5, preDelay: 0.1 }).toDestination());

  // Initialize the grid
  function createGrid() {
    grid.forEach((row, rowIndex) => {
      const rowCells = [];
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        const square = document.createElement("div");
        square.classList.add("cell");
        square.textContent = "🛸";
        square.addEventListener("click", () => handleCellClick(rowIndex, colIndex, square));
        container.appendChild(square);
        rowCells.push(square);
      }
      cells.push(rowCells);
    });
  }

  function handleCellClick(rowIndex, colIndex, square) {
    grid[rowIndex][colIndex] = !grid[rowIndex][colIndex];
    square.classList.toggle("active");
    playNote(rows[rowIndex], square);
  }

  // Audio Initialization Functions
  function initializeAudio() {
    return Tone.start()
      .then(() => {
        console.log("Audio is ready");
        audioInitialized = true;
      })
      .catch(error => {
        console.log("Audio not ready", error);
      });
  }

  // Sequence Functions
  function toggleSequence() {
    if (!audioInitialized) {
      initializeAudio().then(() => isPlaying ? stopSequence() : startSequence());
    } else {
      isPlaying ? stopSequence() : startSequence();
    }
    animateButton(buttonStart);
  }

  function startSequence() {
    sequence?.dispose(); // Dispose of any existing sequence

    sequence = new Tone.Sequence((time, col) => {
      rows.forEach((note, rowIndex) => {
        if (grid[rowIndex][col]) {
          synth.triggerAttackRelease(note, "9n", time);
        }
      });
      highlightColumn(col);
    }, Array.from({ length: cols }, (_, i) => i), "8n");

    sequence.start(0);
    Tone.Transport.start();
    isPlaying = true;
    buttonStart.textContent = "Stop Sequence";
  }

  function stopSequence() {
    sequence?.stop();
    Tone.Transport.stop();
    isPlaying = false;
    buttonStart.textContent = "Start Sequence";
  }

  // Highlighting Functions
  function highlightColumn(col) {
    cells.forEach(row => row.forEach(cell => cell.classList.remove("highlight")));
    cells.forEach(row => row[col].classList.add("highlight"));
  }

  // Play Note Function
  function playNote(note, cell) {
    if (!audioInitialized) {
      initializeAudio().then(() => synth.triggerAttackRelease(note, "8n"));
    } else {
      synth.triggerAttackRelease(note, "8n");
    }
    animateCell(cell);
  }

  // Animation Functions
  function animateCell(cell) {
    cell.classList.add("fish-animation");
    setTimeout(() => cell.classList.remove("fish-animation"), 300);
  }

  function animateButton(button) {
    button.classList.add("fish-animation");
    setTimeout(() => button.classList.remove("fish-animation"), 300);
  }

  // Clear Sequence
  function clearSequence() {
    grid.forEach((row, rowIndex) => {
      row.forEach((_, colIndex) => {
        grid[rowIndex][colIndex] = false;
        cells[rowIndex][colIndex].classList.remove("active");
      });
    });
    stopSequence();
    console.log("Grid cleared");
  }

  // Event Listeners
  buttonStart.addEventListener("click", toggleSequence);
  buttonClear.addEventListener("click", clearSequence);
  
  // Initialize the grid on page load
  createGrid();
});