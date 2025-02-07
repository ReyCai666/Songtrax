import React, { useState } from "react";
import {     
    SafeAreaView,
    View,
    Image,
    Dimensions,
    Appearance,
    Text,
    TextInput, 
    Pressable,
    KeyboardAvoidingView
} from "react-native";
import {
    launchImageLibrary
} from "react-native-image-picker";

import { ProfileContext } from "../context/ProfileContext";
import { colors } from "../styles/styles";

const {
    width,
    height
} = Dimensions.get("window");

/**
 * Returns the dynamic styles based on the current theme mode.
 * 
 * @param {string} mode - Current theme mode ('light' or 'dark'). 
 * @returns {JSX.  Element} The styles object.
 */
const styles = (mode) => ({
    all: {
        backgroundColor: colors[mode].background,
        flex: 1
    },
    container: {
        padding: 20,
    },
    header: {
        marginBottom: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors[mode].header,
        marginBottom: 5
    },
    subHeaderText: {
        fontSize: 14,
        color: colors[mode].header,
        fontWeight: "bold",
    },
    photoFullView: {
        position: 'relative', 
        marginBottom: 20
    },
    changePhotoButton: {
        position: 'absolute',
        backgroundColor: colors[mode].buttonBackground,
        borderColor: colors[mode].buttonBackground,
        bottom: 0,
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: 1,
        padding: 8,
        margin: 10,
        zIndex: 1  
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: "bold",
        color: colors[mode].text,
        paddingHorizontal: 30
    }, 
    photoEmptyView: {
        borderWidth: 3,
        borderRadius: 10,
        borderColor: colors[mode].borderColor,
        borderStyle: "dashed",
        height: height / 2,
        marginBottom: 20
    },
    photoFullImage: {
        width: "100%",
        borderRadius: 10
    },
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    nameInput: {
        borderWidth: 1,
        backgroundColor: colors[mode].inputBackground,
        borderColor: colors[mode].borderColor,
        borderRadius: 5,
        marginTop: 10,
        padding: 10,
        textAlign: "center",
        fontSize: 16
    }
});

/**
 * The Profile Component
 * 
 * This component renders a profile page where the user can edit their profile picture and username.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function Profile() {
    // get light or dark mode
    const mode = Appearance.getColorScheme();

    const [ photoState, setPhotoState ] = useState({});
    const currentStyles = styles(mode);

    // get the profile picture and setter function from the ProfileContext
    const { profilePicture, setProfilePicture, setUsername } = React.useContext(ProfileContext);

    // console.log(photoState);

    /**
     * Handle the event when the user wants to change their profile picture.
     * This will open the image picker, and if an image is selected, it will update the 
     * photoState and the context's profile picture.
     */
    async function handleChangePress() {
        const result = await launchImageLibrary();
        if(typeof result.assets[0] == "object") {
            setPhotoState(result.assets[0]);
            setProfilePicture(result.assets[0].uri);
        }
    }

    /**
     * Handle the event when the user wants to remove their profile picture.
     * This will clear the photoState.
     */
    async function handleRemovePress() {
        setPhotoState({});
    }

    // check if the user has a profile picture
    const hasPhoto = typeof photoState.uri != "undefined";
    
    /**
     * Component to display the photo section.
     * If a photo exists, it will show the photo and a button to change the photo.
     * If a photo doesn't exist, it will show a dashed-border box with a button to add a photo.
     */
    function Photo(props) {
        if(hasPhoto) {
            return (
                <View style={currentStyles.photoFullView}>
                    <Image
                        style={currentStyles.photoFullImage}
                        resizeMode="cover"
                        source={{
                            uri: photoState.uri,
                            width: width,
                            height: height / 2
                        }}
                    />
                    <Pressable style={currentStyles.changePhotoButton} onPress={handleChangePress}>
                        <Text style={currentStyles.buttonText}>Change Photo</Text>
                    </Pressable>
                </View>
            );
        }
        else {
            return (
                <View style={currentStyles.photoEmptyView}>
                    <Pressable style={currentStyles.changePhotoButton} onPress={handleChangePress}>
                        <Text style={currentStyles.buttonText}>Add Photo</Text>
                    </Pressable>
                </View>

            );        
        }
    }

    return (
       <SafeAreaView style={currentStyles.all}>
            <KeyboardAvoidingView behavior="position">
                <View style={currentStyles.container}>
                    <SafeAreaView style={currentStyles.header}>
                        <Text style={currentStyles.headerText}>Edit Profile</Text>
                        <Text style={currentStyles.subHeaderText}>Mirror, Mirror On The Wall...</Text>
                    </SafeAreaView>
                    <Photo />
                    <TextInput 
                        style={currentStyles.nameInput} 
                        placeholder="Enter Your Name" 
                        onSubmitEditing={(event) => {
                            const submittedText = event.nativeEvent.text;
                            setUsername(submittedText);
                        }}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}