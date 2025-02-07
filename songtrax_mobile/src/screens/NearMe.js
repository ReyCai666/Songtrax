import React, { useState, useEffect, useContext} from "react";
import { View, Text, TextInput, Button, Image, Appearance, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Rating } from "react-native-elements";
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { SongContext  } from "../context/SongContext";
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
    songRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd', 
        paddingVertical: 15,
        marginTop: 10
    },
    songInfo: {
        flex: 1
    },
    songName: {
        fontSize: 14,
        fontWeight: 'bold',
        fontWeight: '500',
        marginBottom: 10,
        color: '#888'
    },
    songDate: {
        fontSize: 14,
        color: '#888'  
    },
    headerContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    locationIcon: {
        marginLeft: 5,
        marginTop: 30,
        width: 30,
        height: 54,
    },
});

/**
 * NearMe component displays a list of songs available near the user.
 *
 * @param {Object} route - The route object passed by React Navigation.
 * @returns {JSX.Element} The rendered component.
 */
export default function NearMe({ route }) {
    const { width, height } = Dimensions.get('window');
    const mode = Appearance.getColorScheme();
    const dynamicStyles = styles(mode, height);

    const { songLocationId, setSongLocationId } = useContext(SongContext);
    const { setCurrentLocationName } = useContext(SongContext);
    const { availableSongSamples, setAvailableSongSamples } = useContext(SongContext);
    const navigation = useNavigation();
    // console.log("Location_id received in Songtrax tab: ", songLocationId);

    const initailSampleNearby = {
        sampleId: null,
        sampleName: null,
        createDate: null,
        ratings: null,
    }

    const [sampleIdsNearby, setSampleIdsNearby] = useState([]);
    const [locationName, setLocationName] = useState("");
    const [allSamplesNearby, setAllSamplesNearby] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);

    /**
     * Fetch the sample IDs associated with the selected location.
     */
    useFocusEffect(
        React.useCallback(() => {
            if (songLocationId) {
                async function fetchSampleIdsWithLocation() {
                    const response = await fetch(`https://comp2140.uqcloud.net/api/sampletolocation/?api_key=BzBp5cywLo&location_id=${songLocationId}`);
                    const location = await fetch(`https://comp2140.uqcloud.net/api/location/${songLocationId}/?api_key=BzBp5cywLo`);
                    const locationData = await location.json();
                    setLocationName(locationData.name);
                    setCurrentLocationName(locationData.name);
                    const data = await response.json();
                    const ids = data.map(sample => sample.sample_id);
                    setSampleIdsNearby(ids);
                }
                fetchSampleIdsWithLocation();
            } else {
                setSampleIdsNearby([]);
                setLocationName("No location selected");
                setAllSamplesNearby([]);
            }
        }, [songLocationId])
    );

    /**
     * Fetch the song samples using the sample IDs.
     */
    useFocusEffect(
        React.useCallback(() => {
            if (sampleIdsNearby.length != 0) {
                async function fetchSamplesNearby() {
                    const samples = [];
                    for (const sampleId of sampleIdsNearby) {
                        const response = await fetch(`https://comp2140.uqcloud.net/api/sample/${sampleId}/?api_key=BzBp5cywLo`);
                        const ratings = await fetch(`https://comp2140.uqcloud.net/api/samplerating/?api_key=BzBp5cywLo&sample_id=${sampleId}`);
                        const data = await response.json();
                        const ratingsData = await ratings.json();

                        let sampleRating = 0; // default rating
                        if (ratingsData.length > 0) {
                            sampleRating = ratingsData[0].rating;
                        }
                        const currentSample = {
                            sampleId: data.id,
                            sampleName: data.name,
                            createDate: data.datetime,
                            ratings: sampleRating,
                        };
                        samples.push(currentSample);
                    }
                    setAllSamplesNearby(samples);
                    setAvailableSongSamples(samples);
                }
                fetchSamplesNearby();
            } else {
                setAllSamplesNearby([]);
            }
        }, [sampleIdsNearby])  
    ); 

    /**
     * Cleanup effect to reset sample IDs nearby when the component is unmounted.
     */
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setSampleIdsNearby([]);
            }
        }, [])
    );
    // console.log("SampleIds nearby: ", sampleIdsNearby);
    // console.log("Samples nearby: ", allSamplesNearby);

    return (   
        <ScrollView style={dynamicStyles.container}>
            <View style={dynamicStyles.headerContainer}>
                <Image source={mode == "light" ? require('../../AppIcons/icon-pin-darkpurple.png') : 
                                    require('../../AppIcons/icon-pin-lightpurple.png')} 
                                    style={dynamicStyles.locationIcon} />
                <Text style={dynamicStyles.header}>{locationName}</Text>
            </View>
            {allSamplesNearby.map((sample, index) => {
                return (
                    <TouchableOpacity key={index} 
                        style={dynamicStyles.songRow}
                        activeOpacity={0.7}
                        onPress={() => {setSelectedSong(sample.sampleId); 
                                        navigation.navigate('PlayMusic', { sampleId: sample.sampleId })
                                }}
                    >
                        <View style={dynamicStyles.songInfo}>
                            <Text style={dynamicStyles.songName}>{sample.sampleName}</Text>
                            <Text style={dynamicStyles.songDate}>{new Date(sample.createDate).toLocaleDateString()}</Text>
                        </View>
                        <Rating
                            type='custom'
                            tintColor={mode == "dark" ? colors[mode].background : undefined} 
                            fractions={1}
                            imageSize={20}
                            readonly
                            startingValue={sample.ratings ? sample.ratings : 0}
                        /> 
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    );
}