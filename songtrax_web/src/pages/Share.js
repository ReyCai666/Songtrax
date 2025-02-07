import React, { useState, useEffect, useRef } from "react";
import { fetchSample, previewSequence } from "./CreateSample"; 
import { toneObject, toneTransport } from "../data/instruments.js";
import { useParams } from "react-router-dom";

const APIKEY = "BzBp5cywLo";
const baseURL = "https://comp2140.uqcloud.net/api/";

/**
 * Fetches the list of available locations.
 * 
 * @async
 * @returns {Array} An array of location objects.
 */
async function fetchLocations() {
    const url = `${baseURL}location/?api_key=${APIKEY}`;
    const response = await fetch(url);
    const locations = await response.json();
    return locations;
}

/**
 * Associates a given sample with a location.
 *
 * @async
 * @param {number} locationId - The ID of the location.
 * @param {number} sampleId - The ID of the sample.
 * @returns {Object} The response object from the RESTful API.
 */
async function addSampleToLocation(locationId, sampleId) {
    const url = `${baseURL}sampletolocation/?api_key=${APIKEY}`;
    const data = {
        api_key: APIKEY,
        sample_id: sampleId,
        location_id: locationId
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json
}

/**
 * Deletes a sample's association with a location.
 *
 * @async
 * @param {number} locationId - The ID of the location.
 */
async function deleteSampleFromLocation(locationId) {
    const url = `${baseURL}sampletolocation/${locationId}/?api_key=${APIKEY}`;
    await fetch(url, {
        method: 'DELETE'
    });
}

/**
 * Fetches the association between a sample and a location.
 *
 * @async
 * @param {number} sampleId - The ID of the sample.
 * @param {number} locationId - The ID of the location.
 * @returns {Array} An array of relations (usually length 0 or 1).
 */
async function fetchSampleToLocation(sampleId, locationId) {
    const url = `${baseURL}sampletolocation/?sample_id=${sampleId}&location_id=${locationId}&api_key=${APIKEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

/**
 * Share Component
 * The main component that showcases the list of song samples and allows for CRUD operations.
 * 
 * @component
 * @returns {JSX.Element} The Rendered main component.
 */
export default function Share() {
    const { sampleId } = useParams();
    const [sampleName, setSampleName] = useState("");
    const [sampleDatetime, setSampleDatetime] = useState("");
    const [locations, setLocations] = useState([]);
    const [sharingStatus, setSharingStatus] = useState({});
    const [currentPlayingSample, setCurrentPlayingSample] = useState(null);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const partRef = useRef(null);
    const scheduledStopRef = useRef(null);

    useEffect(() => {
        if (sampleId) {
            async function getSample() {
                const sample = await fetchSample(sampleId);
                setSampleName(sample.name);
                setSampleDatetime(sample.datetime);
            }
            async function getLocations() {
                const locations = await fetchLocations();
                let tempSharedStatusMap = {};
                const promises = locations.map(async (location) => {
                    const relation = await fetchSampleToLocation(sampleId, location.id);
                    tempSharedStatusMap[location.id] = relation && relation.length > 0;
                });

                await Promise.all(promises);
                setSharingStatus(tempSharedStatusMap);
                setLocations(locations);    
            }
            getSample();
            getLocations();
        }
    }, [sampleId, window.location.pathname])

    /**
     * Set up the preview mechanism for a sample identified by its ID.
     * 
     * @async
     * @param {number} sampleId - The ID of the sample to be previewed.
     * @returns {Object} The response object from the RESTful API.
     */
    const toggleShare = async (locationId) => {
        try {
            const sampleToShare = await fetchSampleToLocation(sampleId, locationId);
            console.log(sampleToShare);
            if (sampleToShare.length === 0) {
                await addSampleToLocation(locationId, sampleId);
                setSharingStatus(prevStatus => ({ ...prevStatus, [locationId]: true }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Set up the preview mechanism for a sample identified by its ID.
     * 
     * @async
     * @param {number} sampleId - The ID of the sample to be previewed.
     * @returns {Object} The response object from the RESTful API.
     */
    const untoggleShare = async (locationId) => {
        try {
            const sampleToDelete = await fetchSampleToLocation(sampleId, locationId);
            console.log(sampleToDelete);
            if (sampleToDelete.length !== 0) {
                await deleteSampleFromLocation(sampleToDelete[0].id);
                setSharingStatus(prevStatus => ({ ...prevStatus, [locationId]: false }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Set up the preview mechanism for a sample identified by its ID.
     * 
     * @async
     * @param {number} sampleId - The ID of the sample to be previewed.
     * @returns {Object} The response object from the RESTful API.
     */
    async function setUpPreview(sampleId) {
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
            <h2 className="title">Share This Sample</h2>
            <div className="card">
                <div className="song-details">
                    <h3>{sampleName}</h3>
                    <p>{sampleDatetime}</p>
                </div>
                <div classNameName="buttons">
                    <button type="button" className="hollow-button" onClick={() => setUpPreview(sampleId)}>
                                {isPreviewing ? "Stop Preview" : "Preview"}
                    </button> 
                </div>
            </div>
            {locations.map((location) => (
                <div className="toggle-row-container">
                    <div className="location-name-label">
                        <h4>{location.name}</h4>
                    </div>
                    <div className="sequence-row-container">
                        <button className={sharingStatus[location.id] ? "toggle-selected" : "toggle"} 
                                onClick={() => toggleShare(location.id)}>
                                    Shared
                        </button>
                        <button className={!sharingStatus[location.id] ? "toggle-selected" : "toggle"} 
                                onClick={() => untoggleShare(location.id)}>
                                    Not Shared
                        </button>
                    </div>
                </div>
            ))}
        </main>
    );
};