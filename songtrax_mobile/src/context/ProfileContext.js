import React, { createContext, useState } from 'react';

const ProfileContext = createContext();

/**
 * ProfilePictureProvider component.
 * This component provides a context to its children with profile data.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.children - React children elements.
 */
const ProfilePictureProvider = ({children}) => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState(null);

    return (
        <ProfileContext.Provider value={{profilePicture, setProfilePicture, 
                                         username, setUsername}}>
            {children}
        </ProfileContext.Provider>
    );
}

export { ProfileContext, ProfilePictureProvider };