// BrassFingeringGame.js

import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import {
  Renderer,
  Stave,
  StaveNote,
  Formatter,
  Voice,
  Accidental,
} from "vexflow";

// Full range of notes including sharps and alternate fingerings for advanced mode
const advancedNotes = {
  Trumpet: {
    C4: [[0, 0, 0]],
    Db4: [[1, 1, 1]],
    D4: [[1, 0, 1]],
    Eb4: [[0, 1, 1]],
    E4: [[1, 1, 0]],
    F4: [[1, 0, 0]],
    Gb4: [[0, 1, 0]],
    G4: [[0, 0, 0]],
    Ab4: [[0, 1, 1]],
    A4: [[1, 2, 0]],
    Bb4: [[1, 0, 0]],
    B4: [[0, 1, 0]],
    C5: [[0, 0, 0]],
    Db5: [[1, 1, 1]],
    D5: [[1, 0, 1]],
    Eb5: [[0, 1, 0]],
    E5: [[1, 1, 0]],
    F5: [[1, 0, 0]],
    Gb5: [[0, 1, 0]],
    G5: [[0, 0, 0]],
    Ab5: [[0, 1, 1]],
    A5: [[1, 2, 0]],
    Bb5: [[1, 0, 0]],
    B5: [[0, 1, 0]],
    C6: [[0, 0, 0]],
    Db6: [[1, 1, 1]],
    D6: [[1, 0, 1]],
  },
  Trombone: {
    E2: [[7]], // Slide position 7
    F2: [[6]], // Slide position 6
    G2: [[5]], // Slide position 5
    Ab2: [[4]], // Slide position 4
    A2: [[3]], // Slide position 3
    Bb2: [[2]], // Slide position 2
    B2: [[1]], // Slide position 1
    C3: [[7]],
    Db3: [[6]],
    D3: [[5]],
    Eb3: [[4]],
    E3: [[3]],
    F3: [[2]],
    G3: [[1]],
    Ab3: [[7]],
    A3: [[6]],
    Bb3: [[5]],
    B3: [[4]],
    C4: [[3]],
    Db4: [[2]],
    D4: [[1]],
    Eb4: [[7]],
    E4: [[6]],
    F4: [[5]],
    Gb4: [[4]],
    G4: [[3]],
    Ab4: [[2]],
    A4: [[1]],
    Bb4: [[7]],
    B4: [[6]],
    C5: [[5]],
    Db5: [[4]],
    D5: [[3]],
    Eb5: [[2]],
    E5: [[1]],
    F5: [[7]],
  },
  Euphonium: {
    C2: [[1, 1, 1]],
    Db2: [[1, 1, 1]],
    D2: [[1, 1, 0]],
    Eb2: [[1, 1, 0]],
    E2: [[0, 1, 1]],
    F2: [[1, 0, 1]],
    Gb2: [[1, 0, 1]],
    G2: [[1, 1, 1]],
    Ab2: [[1, 1, 1]],
    A2: [[0, 1, 0]],
    Bb2: [[0, 0, 0]],
    B2: [[1, 1, 1]],
    C3: [[1, 1, 1]],
    Db3: [[1, 1, 1]],
    D3: [[1, 1, 0]],
    Eb3: [[1, 1, 0]],
    E3: [[0, 1, 1]],
    F3: [[1, 0, 1]],
    Gb3: [[1, 0, 1]],
    G3: [[1, 1, 1]],
    Ab3: [[1, 1, 1]],
    A3: [[0, 1, 0]],
    Bb3: [[0, 0, 0]],
    B3: [[1, 1, 1]],
    C4: [[1, 1, 1]],
    Db4: [[1, 1, 1]],
    D4: [[1, 1, 0]],
    Eb4: [[1, 1, 0]],
    E4: [[0, 1, 1]],
    F4: [[1, 0, 1]],
    Gb4: [[1, 0, 1]],
    G4: [[1, 1, 1]],
    Ab4: [[1, 1, 1]],
    A4: [[0, 1, 0]],
    Bb4: [[0, 0, 0]],
  },
  Tuba: {
    Bb0: [[0, 0, 0]], // Open
    C2: [[1, 0, 1]],
    D2: [[1, 1, 0]],
    Eb2: [[1, 0, 0]],
    F2: [[0, 0, 0]], // Open
    G2: [[0, 0, 0]], // Open
    Ab2: [[1, 0, 0]], // 1st valve
    A2: [[1, 1, 0]], // Added A2
    Bb2: [[0, 0, 0]], // Open
    B2: [[1, 1, 1]], // Added B2
    C3: [[0, 0, 0]], // Open
    Db3: [[1, 1, 0]], // Added Db3
    D3: [[1, 0, 1]],
    Eb3: [[1, 1, 0]],
    F3: [[0, 0, 0]], // Open
    Gb3: [[1, 0, 0]], // 1st valve
    G3: [[0, 0, 0]], // Open
    Ab3: [[1, 0, 0]], // 1st valve
    A3: [[1, 1, 0]], // Added A3
    Bb3: [[0, 0, 0]], // Open
    B3: [[1, 1, 1]], // Added B3
    C4: [[0, 0, 0]], // Open
    Db4: [[1, 1, 0]],
    D4: [[1, 0, 1]],
    Eb4: [[1, 1, 0]],
    F4: [[0, 0, 0]], // Open
  },
};

// Beginner mode (first five notes of the Concert Bb scale)
const beginnerNotes = {
  Trumpet: {
    C4: [[0, 0, 0]],
    D4: [[1, 0, 1]],
    E4: [[1, 1, 0]],
    F4: [[1, 0, 0]],
    G4: [[0, 0, 0]],
  },
  Trombone: {
    Bb2: [[1]],
    C3: [[6]],
    D3: [[4]],
    Eb3: [[3]],
    F3: [[1]],
  },
  Euphonium: {
    Bb1: [[0, 0, 0]],
    C2: [[1, 0, 0]],
    D2: [[1, 1, 0]],
    Eb2: [[1, 0, 1]],
    F2: [[0, 0, 0]],
  },
  Tuba: {
    Bb0: [[0, 0, 0]], // Open
    C2: [[1, 0, 1]],
    D2: [[1, 1, 0]],
    Eb2: [[1, 0, 0]],
    F2: [[0, 0, 0]], // Open
  },
};

// Frequencies for the notes for sound playback
const noteFrequencies = {
  C2: "65.41",
  C3: "130.81",
  C4: "261.63",
  C5: "523.25",
  C6: "1046.50",
  Db2: "69.30",
  Db3: "138.59",
  Db4: "277.18",
  Db5: "554.37",
  Db6: "1108.73",
  D2: "73.42",
  D3: "146.83",
  D4: "293.66",
  D5: "587.33",
  D6: "1174.66",
  Eb2: "77.78",
  Eb3: "155.56",
  Eb4: "311.13",
  Eb5: "622.25",
  Eb6: "1244.51",
  E1: "41.20",
  E2: "82.41",
  E3: "164.81",
  E4: "329.63",
  E5: "659.25",
  F2: "87.31",
  F3: "174.61",
  F4: "349.23",
  F5: "698.46",
  F6: "1396.91",
  Gb2: "92.50",
  Gb3: "185.00",
  Gb4: "369.99",
  G2: "98.00",
  G3: "196.00",
  G4: "392.00",
  G5: "783.99",
  G6: "1567.98",
  Ab2: "103.83",
  Ab3: "207.65",
  Ab4: "415.30",
  Ab5: "830.61",
  A2: "110.00",
  A3: "220.00",
  A4: "440.00",
  A5: "880.00",
  Bb0: "58.27",
  Bb1: "116.54",
  Bb2: "233.08",
  Bb3: "466.16",
  Bb4: "466.16",
  Bb5: "932.33",
  Bb6: "1864.66",
  B1: "61.74",
  B2: "123.47",
  B3: "246.94",
  B4: "493.88",
  B5: "987.77",
  B6: "1975.53",
};

// Define the range of each instrument in MIDI numbers
const instrumentRanges = {
  Trumpet: { min: 54, max: 90 }, // F#3 (54) to D6 (90)
  Trombone: { min: 40, max: 77 }, // E2 (40) to F5 (77)
  Euphonium: { min: 34, max: 77 }, // Bb1 (34) to F5 (77)
  Tuba: { min: 22, max: 65 }, // Bb0 (22) to F4 (65)
};

// Define the instrument options, including clef and note configurations
const instrumentOptions = [
  {
    name: "Trumpet",
    beginnerNotes: beginnerNotes.Trumpet,
    advancedNotes: advancedNotes.Trumpet,
    clef: "treble",
  },
  {
    name: "Trombone",
    beginnerNotes: beginnerNotes.Trombone,
    advancedNotes: advancedNotes.Trombone,
    clef: "bass",
  },
  {
    name: "Euphonium",
    beginnerNotes: beginnerNotes.Euphonium,
    advancedNotes: advancedNotes.Euphonium,
    clef: "bass",
  },
  {
    name: "Tuba",
    beginnerNotes: beginnerNotes.Tuba,
    advancedNotes: advancedNotes.Tuba,
    clef: "bass",
  },
];

// Helper function to convert note name to MIDI number
const noteToMidi = (note) => {
  const noteRegex = /^([A-Ga-g])([b#]?)(\d+)$/;
  const match = note.match(noteRegex);
  if (!match) return null;
  let [, base, accidental, octave] = match;
  base = base.toUpperCase();
  octave = parseInt(octave, 10);

  const noteMap = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
  };

  const key = accidental ? base + accidental : base;
  const semitone = noteMap[key];
  if (semitone === undefined) return null;

  const midi = (octave + 1) * 12 + semitone;
  return midi;
};

// Helper function to filter notes based on MIDI range
const filterNotesByRange = (notesObj, minMidi, maxMidi) => {
  const filteredNotes = {};
  Object.keys(notesObj).forEach((note) => {
    const midi = noteToMidi(note);
    if (midi !== null && midi >= minMidi && midi <= maxMidi) {
      filteredNotes[note] = notesObj[note];
    }
  });
  return filteredNotes;
};

// Helper function to parse a note string into its components
const parseNote = (note, clef) => {
  const regex = /^([A-Ga-g])([b#]?)(\d+)$/;
  const match = note.match(regex);
  if (!match) return null;
  let [, base, accidental, octave] = match;
  base = base.toLowerCase(); // VexFlow expects lowercase note names
  octave = parseInt(octave, 10);

  // Adjust octave based on clef
  // In VexFlow, middle C is c/4 in treble clef and c/3 in bass clef
  if (clef === "bass") {
    octave -= 1; // Subtract 1 to align with VexFlow's bass clef notation
  }

  return { base, accidental, octave };
};

const BrassFingeringGame = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("Trumpet");
  const [mode, setMode] = useState("beginner"); // Beginner or advanced
  const [gameMode, setGameMode] = useState("timed"); // Timed or practice
  const [currentNote, setCurrentNote] = useState("C4");
  const [userInput, setUserInput] = useState([0, 0, 0]); // Initialize based on instrument
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false); // Game starts only after pressing Begin
  const [gameStarted, setGameStarted] = useState(false); // Control for the "Begin" button
  const [lastNote, setLastNote] = useState(null); // Track the last note to avoid repetition

  const notationRef = useRef(null); // Ref for VexFlow notation

  // Get the current set of notes based on the mode and selected instrument
  const instrument = instrumentOptions.find(
    (inst) => inst.name === selectedInstrument
  );
  const instrumentNotes =
    mode === "beginner" ? instrument.beginnerNotes : instrument.advancedNotes;

  // State to hold filtered notes within the instrument's range
  const [filteredNotes, setFilteredNotes] = useState({});

  // Play sound for the current note using Tone.js
  const playNoteSound = (note) => {
    if (!noteFrequencies[note]) {
      console.error(`Frequency for note ${note} not found.`);
      setFeedback(`🔊 Unable to play the sound for ${note}.`);
      return;
    }
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(noteFrequencies[note], "8n");
  };

  // Render musical notation using VexFlow
  useEffect(() => {
    if (gameStarted && currentNote) {
      // Ensure the notation ref exists
      if (notationRef.current) {
        // Clear existing notation
        notationRef.current.innerHTML = "";

        // Initialize VexFlow renderer
        const renderer = new Renderer(
          notationRef.current,
          Renderer.Backends.SVG
        );
        renderer.resize(500, 200);
        const context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

        // Determine the clef based on the instrument
        const clef = instrument.clef === "bass" ? "bass" : "treble";

        // Create a stave of width 400 at position 10, 40 on the canvas
        const stave = new Stave(10, 40, 400);
        stave.addClef(clef).setContext(context).draw();

        // Parse the current note
        const parsedNote = parseNote(currentNote, clef);
        if (!parsedNote) {
          console.error("Invalid note format:", currentNote);
          setFeedback("⚠️ Invalid note format!");
          return;
        }

        const { base, accidental, octave } = parsedNote;

        // Create the note key (e.g., "c/4", "c#/4", "db/4")
        let key = `${base}/${octave}`;
        if (accidental === "b" || accidental === "#") {
          key = `${base}${accidental}/${octave}`;
        }

        // Create the note
        const staveNote = new StaveNote({
          clef: clef,
          keys: [key],
          duration: "q",
        });

        // Add accidental if necessary
        if (accidental === "b") {
          staveNote.addModifier(new Accidental("b"), 0);
        } else if (accidental === "#") {
          staveNote.addModifier(new Accidental("#"), 0);
        }

        // Create a voice in 4/4
        const voice = new Voice({ num_beats: 1, beat_value: 4 });
        voice.addTickables([staveNote]);

        // Format and justify the notes to 400 pixels
        new Formatter().joinVoices([voice]).format([voice], 400);

        // Render voice
        voice.draw(context, stave);
      }
    }
  }, [currentNote, gameStarted, selectedInstrument, instrument.clef]);

  // Filter notes based on instrument range whenever instrument or mode changes
  useEffect(() => {
    const range = instrumentRanges[selectedInstrument];
    if (!range) {
      console.error(`Range not defined for instrument ${selectedInstrument}`);
      setFeedback("⚠️ Instrument range not defined.");
      return;
    }
    const notesObj =
      mode === "beginner" ? instrument.beginnerNotes : instrument.advancedNotes;
    const filtered = filterNotesByRange(notesObj, range.min, range.max);
    setFilteredNotes(filtered);
  }, [
    selectedInstrument,
    mode,
    instrument.beginnerNotes,
    instrument.advancedNotes,
  ]);

  // Check if the user's input matches any of the correct fingerings
  const checkAnswer = () => {
    if (!isGameActive) return;

    setTotalCount((prev) => prev + 1);

    const correctFingerings = instrumentNotes[currentNote];

    if (!correctFingerings) {
      console.error(`No fingering data for note ${currentNote}`);
      setFeedback("⚠️ No fingering data available for this note.");
      return;
    }

    const isCorrect = correctFingerings.some((fingering) =>
      fingering.every((value, index) => value === userInput[index])
    );

    if (isCorrect) {
      setFeedback("✅ Correct!");
      setCorrectCount((prev) => prev + 1);
      playNoteSound(currentNote);
      setTimeout(() => {
        getNextNote();
      }, 1000);
    } else {
      setFeedback("❌ Try Again!");
    }
  };

  // Get the next random note and avoid repetition of the last note
  const getNextNote = () => {
    const noteKeys = Object.keys(filteredNotes);
    if (noteKeys.length === 0) {
      console.error(
        `No notes available for instrument ${selectedInstrument} in ${mode} mode.`
      );
      setFeedback("⚠️ No notes available for this instrument and mode.");
      return;
    }

    let randomNote;
    do {
      randomNote = noteKeys[Math.floor(Math.random() * noteKeys.length)];
    } while (randomNote === lastNote && noteKeys.length > 1);

    setCurrentNote(randomNote);
    setLastNote(randomNote);
    setUserInput(selectedInstrument === "Trombone" ? [0] : [0, 0, 0]); // Reset user input
    setFeedback("");
  };

  // Handle key presses for valve/slide inputs and submission
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isGameActive) return;

      let newInput =
        selectedInstrument === "Trombone" ? [...userInput] : [...userInput];

      if (selectedInstrument === "Trombone") {
        // For Trombone, use number keys 1-7 for slide positions
        if (event.key >= "1" && event.key <= "7") {
          const position = parseInt(event.key);
          newInput = [position];
          setUserInput(newInput);
          setFeedback(""); // Clear feedback on input change
          console.log("Trombone Slide Position Set:", position);
        }
      } else {
        // For other instruments, use arrow keys for valve toggling
        switch (event.key) {
          case "ArrowLeft": // First valve
            newInput[0] = newInput[0] === 1 ? 0 : 1;
            console.log("Valve 1 toggled:", newInput[0]);
            break;
          case "ArrowUp": // Second valve
            newInput[1] = newInput[1] === 1 ? 0 : 1;
            console.log("Valve 2 toggled:", newInput[1]);
            break;
          case "ArrowRight": // Third valve
            newInput[2] = newInput[2] === 1 ? 0 : 1;
            console.log("Valve 3 toggled:", newInput[2]);
            break;
          default:
            break; // Do nothing for other keys
        }
        setUserInput(newInput);
        setFeedback(""); // Clear feedback on input change
      }

      if (event.key === " ") {
        // Prevent default spacebar behavior (e.g., scrolling)
        event.preventDefault();
        // Submit answer when Spacebar is pressed
        console.log("Spacebar pressed. Submitting answer.");
        checkAnswer();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [userInput, isGameActive, selectedInstrument]);

  // Start the game when the "Begin" button is pressed
  const startGame = async () => {
    await Tone.start(); // Necessary for Tone.js to work properly
    setGameStarted(true);
    setIsGameActive(true);
    setCorrectCount(0);
    setTotalCount(0);
    setFeedback("");
    setTimeLeft(60);
    getNextNote(); // Start with a random note
    console.log("Game Started");
  };

  // Restart the game
  const restartGame = () => {
    setIsGameActive(true);
    setGameStarted(true);
    setCorrectCount(0);
    setTotalCount(0);
    setFeedback("");
    setTimeLeft(60);
    getNextNote(); // Start with a random note
    console.log("Game Restarted");
  };

  // Timer countdown for timed mode
  useEffect(() => {
    if (gameMode === "timed" && timeLeft > 0 && isGameActive) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer
    } else if (timeLeft === 0 && gameMode === "timed") {
      setIsGameActive(false);
      setFeedback("⏰ Time's up!");
      console.log("Time's up!");
    }
  }, [timeLeft, isGameActive, gameMode]);

  // Handle instrument selection change
  useEffect(() => {
    // Reset userInput when instrument changes
    setUserInput(selectedInstrument === "Trombone" ? [0] : [0, 0, 0]);
    console.log("Instrument Changed to:", selectedInstrument);
  }, [selectedInstrument]);

  // Render the valves/positions
  const renderValves = () => {
    if (selectedInstrument === "Trombone") {
      return (
        <div style={styles.inputContainer}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i + 1} style={renderCircle(userInput[0] === i + 1)}>
              {i + 1}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div style={styles.inputContainer}>
          <div style={renderCircle(userInput[0] === 1)}></div>
          <div style={renderCircle(userInput[1] === 1)}></div>
          <div style={renderCircle(userInput[2] === 1)}></div>
        </div>
      );
    }
  };

  // Helper to render a circle based on whether it's pressed or not
  const renderCircle = (isPressed) => {
    return {
      display: "inline-block",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      margin: "10px",
      backgroundColor: isPressed ? "#4CAF50" : "#f1f1f1",
      border: "2px solid black",
      transition: "background-color 0.3s",
      textAlign: "center",
      lineHeight: "60px", // Center the number inside the circle
      fontSize: "1rem",
      cursor: "default", // Change cursor to default since clicking isn't handled
    };
  };

  return (
    <div style={styles.container}>
      <h1>🎺 Brass Fingering Practice Game 🎶</h1>

      {/* Instrument Selection */}
      <div style={styles.dropdown}>
        <label>
          Select Instrument:
          <select
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            style={styles.select}
          >
            {instrumentOptions.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mode Selection */}
      <div style={styles.modeSelector}>
        <label>
          <input
            type="radio"
            value="beginner"
            checked={mode === "beginner"}
            onChange={() => setMode("beginner")}
          />
          Beginner Mode (First 5 Notes)
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            value="advanced"
            checked={mode === "advanced"}
            onChange={() => setMode("advanced")}
          />
          Advanced Mode (All Notes with Chromatics)
        </label>
      </div>

      {/* Game Mode Selection (Timed or Practice) */}
      <div style={styles.gameModeSelector}>
        <label>
          <input
            type="radio"
            value="timed"
            checked={gameMode === "timed"}
            onChange={() => setGameMode("timed")}
          />
          Timed Mode (60 Seconds)
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            value="practice"
            checked={gameMode === "practice"}
            onChange={() => setGameMode("practice")}
          />
          Practice Mode (No Timer)
        </label>
      </div>

      {/* Show the "Begin" button before the game starts */}
      {!gameStarted && (
        <button style={styles.beginButton} onClick={startGame}>
          🎯 Begin
        </button>
      )}

      {/* Show the game UI only after the game has started */}
      {gameStarted && (
        <>
          {/* VexFlow Notation Display */}
          <div ref={notationRef} id="notation" style={styles.notation}></div>

          {/* Note Letter Display */}
          <h2 style={styles.noteDisplay}>Note: {currentNote}</h2>

          {/* Valve Circles or Trombone Positions */}
          {renderValves()}

          {/* Feedback */}
          <p style={styles.feedback}>{feedback}</p>

          {/* Score Display */}
          <p style={styles.score}>
            Correct: {correctCount} / {totalCount}
          </p>

          {/* Timer Display for Timed Mode */}
          {gameMode === "timed" && (
            <p style={styles.timer}>⏰ Time Left: {timeLeft}s</p>
          )}

          {/* Restart Button */}
          <button style={styles.restartButton} onClick={restartGame}>
            🔄 Restart
          </button>
        </>
      )}
    </div>
  );
};

// Custom CSS styles
const styles = {
  container: {
    textAlign: "center",
    marginTop: "30px",
    fontFamily: "'Arial', sans-serif",
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  dropdown: {
    marginBottom: "20px",
  },
  select: {
    marginLeft: "10px",
    padding: "5px",
    fontSize: "1rem",
  },
  modeSelector: {
    marginBottom: "20px",
  },
  gameModeSelector: {
    marginBottom: "20px",
  },
  beginButton: {
    padding: "15px 30px",
    fontSize: "1.2rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  restartButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  feedback: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#007BFF",
    marginTop: "20px",
  },
  score: {
    fontSize: "1.2rem",
    color: "#333",
    marginTop: "10px",
  },
  timer: {
    fontSize: "1.5rem",
    color: "#FF0000",
    marginTop: "10px",
  },
  notation: {
    margin: "20px auto",
  },
  noteDisplay: {
    fontSize: "2rem",
    color: "#555",
    marginBottom: "20px",
  },
};

export default BrassFingeringGame;
