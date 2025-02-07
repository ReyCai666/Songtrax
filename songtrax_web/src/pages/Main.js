import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchSample, baseNotes, previewSequence, playNoteSound } from "./CreateSample"; 
import { toneObject, toneTransport } from "../data/instruments.js";

const APIKEY = "BzBp5cywLo";
const baseURL = "https://comp2140.uqcloud.net/api/";

/**
 * Fetches the list of available song samples.
 *
 * @async
 * @returns {Array} An array of song samples.
 */
async function getSamples() {
    const sampleResponse = await fetch(baseURL + "sample/?api_key=" + APIKEY);
    const json = await sampleResponse.json();
    return json;
}


/**
 * Deletes a song sample based on its ID.
 *
 * @async
 * @param {number} sampleId - The ID of the sample to be deleted.
 * @param {Function} setRreshKey - Function to update the refresh key, causing a re-render.
 * @returns {Response} The response object from the delete request.
 */
async function deleteSample(sampleId, setRreshKey) {
    const url = `${baseURL}sample/${sampleId}/?api_key=${APIKEY}`;
    const response = await fetch(url, {method: 'DELETE'}).catch(
        error => console.log(error));
    setRreshKey(refreshKey => refreshKey + 1);
    return response;
}

/**
 * Main Component
 * The main component that showcases the list of song samples and allows for CRUD operations.
 *
 * @component
 * @returns {JSX.Element} The Rendered main component.
 */
export default function Main() {
    const [samples, setSamples] = useState([]);
    const [refreshKey, setRreshKey] = useState(0); // used to refresh the page
    const [currentPlayingSample, setCurrentPlayingSample] = useState(null); // Store the ID of the sample currently being previewed.
    const [isPreviewing, setIsPreviewing] = useState(false);
    const partRef = useRef(null);
    const scheduledStopRef = useRef(null);
    // fetching all song samples from the api as long as url path changes or if sample is deleted.
    useEffect(()=>{
        async function fetchSongSamples() {
            const fetchedSamples = await getSamples();
            setSamples(fetchedSamples);
        }
        fetchSongSamples();
    }, [window.location.pathname, refreshKey]);

    /**
     * Set up the preview mechanism for a sample identified by its ID.
     * 
     * @async
     * @param {number} sampleId - The ID of the sample to be previewed.
     */
    async function setUpPreview(sampleId) {
        if (partRef.current) {
            partRef.current.stop();
            partRef.current.dispose();
        }
        if (scheduledStopRef.current) {
            toneTransport.clear(scheduledStopRef.current);
        }
        if (currentPlayingSample === sampleId && isPreviewing) {
            toneTransport.stop();
            setIsPreviewing(false);
            setCurrentPlayingSample(null);
            return;
        }

        await toneObject.start();
        console.log(sampleId);
        const sample = await fetchSample(sampleId);
        const newSequence = [...JSON.parse(sample.recording_data)];
        const newInstrument = sample.type;

        const onPreview = () => {
            previewSequence(
                newSequence,
                toneTransport,
                setIsPreviewing,
                partRef,
                scheduledStopRef,
                isPreviewing,
                newInstrument
            );
        };
        onPreview();
        setCurrentPlayingSample(sampleId);
    }
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
            <h2 className="title">My Songs</h2>
            <div className="create-card">
                <Link to="/create-sample" className="full-button">Create Sample</Link>
            </div>
            {samples.map((sample) => (
                <section className="sample" key={sample.id}>
                    <div className="card">
                        <div className="song-details">
                            <h3>{sample.name}</h3>
                            <p>{sample.datetime}</p>
                        </div>
                        <div className="button-group-container">
                            <Link onClick={() => deleteSample(sample.id, setRreshKey)} className="bright-button">Delete</Link>
                            <Link to={`/share/${sample.id}`} className="hollow-button">Share</Link> 
                            <button type="button" className="hollow-button" onClick={() => setUpPreview(sample.id)}>
                                {currentPlayingSample === sample.id && isPreviewing ? "Stop Preview" : "Preview"}
                            </button> 
                            <Link to={`/sample/${sample.id}`} className="bright-button">Edit</Link>
                        </div>
                    </div>
                </section>
            ))}
            <div className="create-card">
                <Link to="/create-sample" className="full-button">Create Sample</Link>
            </div>
        </main>
    );
}