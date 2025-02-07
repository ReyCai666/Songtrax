import React, { useState, createContext } from "react";

const SongContext = createContext();

/**
 * The SongProvider component.
 * 
 * This coponent offers a way to share song and location-related data 
 * across components without explicitly passing the data through props.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.children - React children elements that will have access to this context.
 */
const SongProvider = ({children}) => {
    const [songLocationId, setSongLocationId] = useState(null);
    const [currentLocationName, setCurrentLocationName] = useState(null);
    const [availableSongSamples, setAvailableSongSamples] = useState([]);
    
    return (
        <SongContext.Provider value={{songLocationId, setSongLocationId, 
                                      currentLocationName, setCurrentLocationName,
                                      availableSongSamples, setAvailableSongSamples}}>
            {children}
        </SongContext.Provider>
    );
}

export {SongContext, SongProvider};