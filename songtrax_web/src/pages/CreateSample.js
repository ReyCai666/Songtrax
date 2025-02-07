import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toneObject, piano, guitar, frenchHorn, Drums, toneTransport } from "../data/instruments.js";

const APIKEY = "BzBp5cywLo";
const baseURL = "https://comp2140.uqcloud.net/api/";

export const baseNotes = {
    "C": "C3",
    "D": "D3",
    "E": "E3",
    "F": "F3",
    "G": "G3",
    "A": "A3",
    "B": "B3"
};

/**
 * ToggleRow component
 * Renders a row of toggle buttons for the given chord and its notes.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.chord - The name of the chord for the current row.
 * @param {Array<boolean>} props.notes - An array indicating if each note is selected.
 * @param {function(string, number): void} props.onNoteChange - A callback to be called when a note is toggled.
 * @returns {JSX.Element} A row of toggle buttons representing the chord notes.
 */
function ToggleRow({ chord, notes, onNoteChange }) {
    return (
        <div className="toggle-row-container">
            <div className="row-label">
                <h4>{chord}</h4>
            </div>
            <div className="sequence-row-container">
                {notes.map((isSelected, index) => (
                    <button key={index} 
                            className={isSelected ? "toggle-selected" : "toggle"}
                            // notify the parent to exectue onNoteChange when a note is clicked 
                            onClick={() => onNoteChange(chord, index)}>     
                    </button>
                ))}
            </div>
        </div>
    )
}

/**
 * Fetch a sample by its ID from the API.
 *
 * @param {string} sampleId - The ID of the sample to be fetched.
 * @returns {Promise<Object>} A promise that resolves with the sample data.
 */
export async function fetchSample(sampleId) {
    const url = `${baseURL}sample/${sampleId}/?api_key=${APIKEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

/**
 * Uploads a sample to the API. Depending on the presence of sampleId, 
 * it will either update or create a new sample.
 *
 * @param {string} songName - The name of the song/sample.
 * @param {string} instrument - The instrument type.
 * @param {Array<Object>} recordingData - The sequence of notes for the sample.
 * @param {string} [sampleId] - The ID of the sample (if updating an existing one).
 * @returns {Promise<Object>} A promise that resolves with the server response.
 */
async function uploadSample(songName, instrument, recordingData,
                          sampleId) {
    const method = sampleId ? 'PUT' : 'POST';
    const url = sampleId ? 
                `${baseURL}sample/${sampleId}/?api_key=${APIKEY}` :
                `${baseURL}sample/?api_key=${APIKEY}`;
    const data = {
        'api_key': APIKEY,
        'name': songName,
        'type': instrument,
        'recording_data': JSON.stringify(recordingData),
    };
    const response = await fetch(url, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json;
}

/**
 * Plays the sound of a given chord for the specified instrument.
 *
 * @param {string} chord - The name of the chord.
 * @param {string} instrument - The instrument type.
 */
export const playNoteSound = (chord, instrument) => {
    const now = toneObject.now();
    const duration = 0.25;
    if (instrument == "Piano") {
        const note = baseNotes[chord]; 
        piano.triggerAttackRelease(note, duration, now);
    }
    if (instrument == "Guitar") {
        const note = baseNotes[chord]; 
        guitar.triggerAttackRelease(note, duration, now);
    }
    if (instrument == "French Horn") {
        const note = baseNotes[chord]; 
        frenchHorn.triggerAttackRelease(note, duration, now);
    }
    if (instrument == "Drums") {
        const note = baseNotes[chord]; 
        Drums.triggerAttackRelease(note, duration, now);
    }
}

/**
 * Previews the sequence of notes by playing them.
 *
 * @param {Array<Object>} sequence - The sequence of notes to preview.
 * @param {Object} toneTransport - The Tone.js transport object.
 * @param {function(boolean): void} setIsPreviewing - Setter function for the previewing state.
 * @param {Object} partRef - A React ref object to keep track of the current Tone.js Part instance.
 * @param {Object} scheduledStopRef - A React ref object to keep track of the scheduled stop callback.
 * @param {boolean} isPreviewing - Whether the sequence is currently being previewed.
 * @param {string} instrument - The instrument type.
 */
export const previewSequence = (sequence,
                                toneTransport,
                                setIsPreviewing,
                                partRef,
                                scheduledStopRef,
                                isPreviewing,
                                instrument) => {
    console.log("isPreviewing when just entering: " + isPreviewing);
    console.log("partRef when just entering: " + partRef.current);
    toneTransport.start();
    // if manually stop the preview, stop the part and clear the scheduled callback
    if (isPreviewing && partRef.current) {
        partRef.current.stop();
        partRef.current.dispose();
        setIsPreviewing(false);
        toneTransport.clear(scheduledStopRef.current);
        toneTransport.stop();
        return;
    }

    if (scheduledStopRef.current) {
        toneTransport.clear(scheduledStopRef.current);  // Clear the old scheduled callback
    }

    const events = Array(16).fill(0).map((_, colIdx) => {
        return {
            time: colIdx * 0.25,
            chords: sequence
                .filter(row => row[Object.keys(row)[0]][colIdx])  // filter for only toggled on notes in this column
                .map(row => Object.keys(row)[0])  // get the note names
        };
    });

    // Calculate the total duration for the sequence
    const sequenceDuration = events.length * 0.25;
    console.log("duration: " + sequenceDuration);

    setIsPreviewing(true);
    // Dispose the old Part before creating a new one
    if (partRef.current) {
        partRef.current.dispose();
    }
    
    const partInstance = new toneObject.Part((time, event) => {
        event.chords.forEach(chord => {
            playNoteSound(chord, instrument);
        });
    }, events).start(0);
    partRef.current = partInstance;

    // Setup the callback to stop the sequence after its duration has passed
    scheduledStopRef.current = toneTransport.schedule(() => {
        console.log("entering call back.")
        setIsPreviewing(prevIsPreviewing => {
            console.log(prevIsPreviewing);
            console.log(partRef.current);
            if (prevIsPreviewing && partRef.current) {
                partRef.current.stop();
                partRef.current.dispose();
                toneTransport.stop();
                return false; // Set isPreviewing to false
            }
            return prevIsPreviewing; // Otherwise, keep the current state
        });
    }, sequenceDuration);
}

/**
 * CreateSample component
 * Provides functionality to create or edit a musical sample.
 *
 * @Component
 * @returns {JSX.Element} The rendered CreateSample component.
 */
export default function CreateSample() {
    const [songName, setSongName] = useState("");
    const [instrument, setInstrument] = useState("guitar");
    const sequenceData = [
        { "B" : Array(16).fill(false) },
        { "A" : Array(16).fill(false) },
        { "G" : Array(16).fill(false) },
        { "F" : Array(16).fill(false) },
        { "E" : Array(16).fill(false) },
        { "D" : Array(16).fill(false) },
        { "C" : Array(16).fill(false) }
    ];
    const [sequence, setSequence] = useState([...sequenceData]);
    // extract the specifed sampleId from the url 
    const { sampleId } = useParams();
    // use state to rememeber the data for each instrument
    const [instrumentData, setInstrumentData] = useState({  
        "Guitar" :  [...sequenceData],
        "Piano" : [...sequenceData],
        "French Horn" : [...sequenceData], 
        "Drums" : [...sequenceData]  
    });
    // for loading spinner
    const [isLoading, setIsLoading] = useState(false);
    // for previewing the sample
    const [isPreviewing, setIsPreviewing] = useState(false);
    const partRef = useRef(null);
    const scheduledStopRef = useRef(null);

    // only fetch the specifc sample data if sampleId is present.
    useEffect(() => {
        if (sampleId) {
            // set up the edit sample page
            async function setUp() {
                // fetch the sample from api and update the state
                const sample = await fetchSample(sampleId);
                setSongName(sample.name);
                setInstrument(sample.type);
                setSequence([...JSON.parse(sample.recording_data)]);
                const fetchedSequence = JSON.parse(sample.recording_data);
                // update the instrument data without affecting the rest instrument data
                setInstrumentData(prevSequenceState => ({
                    ...prevSequenceState,
                    [sample.type]: fetchedSequence
                }))
            }
            setUp();
        }
    }, [sampleId]);

    const handleSongNameChange = (event) => {
        setSongName(event.target.value);
    };

    const handleInstrumentChange = (newInstrument) => {
        setInstrument(newInstrument);
        // when instrument change, sequence change together.
        setSequence(instrumentData[newInstrument]);
    };


    const handleNoteChange = (chord, noteIndex) => {
        // deep copy of the sequence for reactivity (prevent direct state mutation)
        const sequenceCopy = JSON.parse(JSON.stringify(sequence));
        // find the note with the given index and toggle it
        const sequenceWithChord = sequenceCopy.find((sequence) => sequence.hasOwnProperty(chord));
        // // clear the status of a note before toggling
        // sequenceWithChord[chord].fill(false);
        sequenceWithChord[chord][noteIndex] = !sequenceWithChord[chord][noteIndex];
        // update the state
        setSequence(sequenceCopy);

        // preserve/remember the sequences for all the other instruments.
        // take the most recent sequence states and update specifc instrument on top of it, so that the rest instrument data is still preseved.
        setInstrumentData(recentSequenceState => ({
            ...recentSequenceState,
            [instrument]: sequenceCopy
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        await uploadSample(songName, instrument, sequence, sampleId);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
    }

    const handlePlayNoteSound = (chord) => {
        playNoteSound(chord, instrument);
    }

    const onPreview = () => {
        previewSequence(
            sequence,
            toneTransport,
            setIsPreviewing,
            partRef,
            scheduledStopRef,
            isPreviewing,
            instrument
        );
    };

    // clear any tone related stuff when unmounted to prevent multiple sounds playing together.
    useEffect(() => {
        return () => { 
            if (partRef.current) {
                partRef.current.stop();
                partRef.current.dispose();
            }
            if (scheduledStopRef.current) {
                toneTransport.clear(scheduledStopRef.current);
            }
            toneTransport.stop();
        };
    }, []);

    return (
        <main>
            <h2 className="title">{sampleId ? "Edit Sample: " : "Create Sample: " }</h2>
            <form className="card edit-card" onSubmit={handleSubmit}>
                <input type="text" value={songName} onChange={handleSongNameChange} placeholder="song name"></input>
                <div className="button-group-container">
                    <button type="button" className="hollow-button" onClick={onPreview}>{isPreviewing ? "Stop Preview" : "Preview"}</button>
                    <button type="submit" className="bright-button">Save</button>
                    {isLoading && <div className="spinner"></div>}
                </div>
            </form>
            <div className="toggle-row-container">
                <div className="row-label">
                    <h4>Instrument</h4>
                 </div>
                <div className="sequence-row-container">
                    <button className= {instrument == "Guitar" ? "toggle-selected" : "toggle"}
                            onClick={() => handleInstrumentChange("Guitar")}>Guitar</button>
                    <button className={instrument == "Piano" ? "toggle-selected" : "toggle"}
                            onClick={() => handleInstrumentChange("Piano")}>Piano</button>
                    <button className={instrument == "French Horn" ? "toggle-selected" : "toggle"}
                            onClick={() => handleInstrumentChange("French Horn")}>French Horn</button>
                    <button className={instrument == "Drums" ? "toggle-selected" : "toggle"}
                            onClick={() => handleInstrumentChange("Drums")}>Drums</button>
                </div>
            </div>
            {sequence.map((chordRow) => {
                const chordName = Object.keys(chordRow)[0];
                const notes = chordRow[chordName];
                return (
                    <ToggleRow chord={chordName} notes={notes} 
                        onNoteChange={(chord, index) => {
                            handleNoteChange(chord, index);
                            handlePlayNoteSound(chord, index);
                    }} />
                ); 
            })}
        </main>
    );
};