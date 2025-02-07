import React, { useState, useRef, useEffect, useContext } from "react";
import { SafeAreaView, View, Button, Dimensions, Appearance, Image, Text, Pressable } from "react-native";
import { Rating } from 'react-native-ratings';
import { WebView } from "react-native-webview";
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { SongContext } from "../context/SongContext";
import { ProfileContext } from "../context/ProfileContext";
import { colors } from "../styles/styles";

/**
 * Returns the dynamic styles based on the current theme mode and screen height.
 *
 * @param {string} mode - Current theme mode ('light' or 'dark').
 * @param {number} height - Current screen height.
 * @returns {Object} The styles object.
 */
const styles = (mode, height) => ({
    container: {
        flex: 1,
        backgroundColor: colors[mode].background,
        paddingHorizontal: 10
    },
    header: {
        fontSize: 22,
        color: colors[mode].header,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 40,
        marginLeft: 80
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: "bold",
        color: colors[mode].background,
    }, 
    songName: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors[mode].header
    },
    ratings: {
        marginTop: 20,
        tintColor: colors[mode].header,
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    commentContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        paddingLeft: 10,
        backgroundColor: 'transparent',
        marginTop: height * 0.2,
    },
    commentHeading: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors[mode].header,
        marginBottom: 20,
    }, 
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userNameText: {
        fontSize: 14,
        color: colors[mode].header,
        paddingLeft: 12,
    },
    profilePicture: {
        width: 60,
        height: 60,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: colors[mode].header
    },
    locationIcon: {
        marginLeft: 5,
        marginTop: 30,
        width: 30,
        height: 54,
    },
    playButton: {
        backgroundColor: colors[mode].header,
        color: colors[mode].background,
        fontWeight: "bold",
        padding: 10,
        borderRadius: 10,
        margin: 10
    },
});

/**
 * PlayMusic Component.
 * 
 * This component renders a music player and related information such as song name and ratings.
 * It uses a WebView to stream the music, and also shows the current location information.
 * 
 * @param {object} route - The route object passed by navigation.
 * @returns {JSX.Element} The rendered component.
 */
export default function PlayMusic({ route }) {
    // getting the screen height and theme mode
    const { width, height } = Dimensions.get('window');
    const mode = Appearance.getColorScheme();

    // getting the sample ID from the route params
    const { sampleId } = route.params;
    // console.log("Sample ID received in PlayMusic tab: ", sampleId);

    // using a ref to store the sample ID to prevent state closure for the async functions
    const sampleIdRef = useRef(sampleId);

    const [songData, setSongData] = useState(null);
    const [instrumentType, setInstrumentType] = useState(null);
    const [songName, setSongName] = useState(null);
    const [songRating, setSongRating] = useState(null);

    // getting the current location name, profile picture and username from the contexts
    const { currentLocationName, setCurrentLocationName } = useContext(SongContext);
    const { profilePicture, setProfilePicture, username} = useContext(ProfileContext);

    const dynamicStyles = styles(mode, height);

    const [ webViewState, setWebViewState ] = useState({
        loaded: false,
        actioned: false,
    });
    const webViewRef = useRef();

    /**
     * Handles the loading state of the WebView.
     */
    function webViewLoaded() {
        setWebViewState({
            ...webViewState,
            loaded: true
        });
    }

    /**
     * Reloads the WebView.
     */
    function handleReloadPress() {
       webViewRef.current.reload();
    }

    /**
     * Handles play and stop actions for music streaming within the WebView.
     */
    function handleActionPress() {
        console.log("Song data: ", songData);
        console.log("Instrument type: ", instrumentType);
        if (!webViewState.loaded) {
            console.warn("WebView is not fully loaded yet.");
            return;
        }
        const jsToInject = `
            preparePreview(${songData}, "${instrumentType}");
            playPreview();
        `;
        if(!webViewState.actioned) {
            webViewRef.current.injectJavaScript(jsToInject);      
        }
        else {
            webViewRef.current.injectJavaScript("stopSong()");   
        }
        setWebViewState({
            ...webViewState,
            actioned: !webViewState.actioned
        });
    }

    /**
     * Handle the change of song rating by updating the rating for the song in the database.
     * If the song is already rated, it updates the rating, otherwise it posts a new rating.
     * 
     * @param {number} sampleIdRef - The ID of the sample song.
     * @param {number} newRating - The new rating value.
     */
    async function handleRatingChange(sampleIdRef, newRating) {
        console.log("Changing rating for: ", sampleIdRef);
        let rateId = 0;
        let method = 'PUT';
        const currentRating = await fetch(`https://comp2140.uqcloud.net/api/samplerating/?api_key=BzBp5cywLo&sample_id=${sampleIdRef}`);
        const isRated = await currentRating.json();
        if (isRated.length != 0) {
            rateId = isRated[0].id;
            await fetch(`https://comp2140.uqcloud.net/api/samplerating/${rateId}/?api_key=BzBp5cywLo`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: "BzBp5cywLo",
                    sample_id: sampleIdRef,
                    rating: newRating
                })
            });
        } else {
            method = 'POST';
            await fetch(`https://comp2140.uqcloud.net/api/samplerating/?api_key=BzBp5cywLo`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: "BzBp5cywLo",
                    sample_id: sampleIdRef,
                    rating: newRating
                })
            });
        }
    }

    /**
     * Fetches the current rating for the song from the database.
     */
    async function getRating() {
        const currentRating = await fetch(`https://comp2140.uqcloud.net/api/samplerating/?api_key=BzBp5cywLo&sample_id=${sampleId}`);
        const ratingData = await currentRating.json();
        if (ratingData.length) {
            setSongRating(ratingData[0].rating);
        } else {
            setSongRating(0);
        }
    }

    /**
     * Fetches the sample song data including the name, type, and recording data.
     */
    async function fetchSampleData() {
        const response = await fetch(`https://comp2140.uqcloud.net/api/sample/${sampleId}/?api_key=BzBp5cywLo`);
        const data = await response.json();
        setSongData(data.recording_data);
        setInstrumentType(data.type.toLowerCase());
        setSongName(data.name);
    }

    // Using the useFocusEffect hook to handle certain actions when the component is focused.
    useFocusEffect(
        React.useCallback(() => {
            sampleIdRef.current = sampleId; 
            fetchSampleData();
            getRating();
            handleReloadPress();

            return () => {
                webViewRef.current.injectJavaScript("stopSong()"); 
            };
        }, [sampleId])
    )

    // UseEffect hook to re-fetch the rating whenever songRating changes.
    useEffect(() => {
        getRating();
    }, [songRating])

    return (
        <SafeAreaView style={dynamicStyles.container}>
            <View style={dynamicStyles.headerContainer}>
                <Image source={mode == "light" ? require('../../AppIcons/icon-pin-darkpurple.png') : 
                                                 require('../../AppIcons/icon-pin-lightpurple.png')} 
                                                 style={dynamicStyles.locationIcon} />
                <Text style={dynamicStyles.header}>{currentLocationName}</Text>
            </View>
            <View>
                <View>
                    <WebView
                        ref={ref => webViewRef.current = ref}
                        originWhitelist={["*"]}
                        source={{
                            uri: "https://comp2140.uqcloud.net/static/samples/index.html"
                        }}
                        pullToRefreshEnabled={true}
                        onLoad={webViewLoaded}
                    />
                </View>
                {webViewState.loaded && 
                    <View>
                        <Text style={dynamicStyles.songName}>{songName}</Text>
                        <Pressable onPress={handleActionPress} style={dynamicStyles.playButton}> 
                            <Text style={dynamicStyles.buttonText}>{!webViewState.actioned ? "Play Music" : "Stop Music"}</Text>
                        </Pressable>
                        <Rating
                            type="custom"
                            imageSize={40}
                            tintColor={mode == "dark" ? colors[mode].background : undefined} 
                            startingValue={songRating}
                            style={dynamicStyles.ratings}
                            onFinishRating={(rating) => handleRatingChange(sampleIdRef.current, rating)}
                        />
                    </View>
                }
            </View>
            <View style={dynamicStyles.commentContainer}>
                <Text style={dynamicStyles.commentHeading}>Currently At This Location:</Text>
                <View style={dynamicStyles.userRow}>
                    <Image 
                        source={profilePicture ? { uri: profilePicture } : require('../../AppIcons/noProfilePicture.png')}
                        style={dynamicStyles.profilePicture}
                    />
                    <Text style={dynamicStyles.userNameText}>{username ? username : "dummy"}</Text>
                </View>
                <View style={dynamicStyles.userRow}>
                    <Image 
                        source={mode == "light" ? require('../../AppIcons/icon-smiley-darkpurple.png') : require('../../AppIcons/icon-smiley-lightpurple.png')} 
                        style={dynamicStyles.profilePicture}
                    />
                    <Text style={{...dynamicStyles.userNameText}}>And Others...</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}