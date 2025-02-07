import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Appearance, View } from "react-native";
import MapView, { Circle, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from "geolib";

import { SongContext  } from "../context/SongContext";

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});

// Get light or dark mode
const colorScheme = Appearance.getColorScheme();

/**
 * The ShowMap component.
 * It renders the map with the user's current location and the locations of the samples.
 * It also calculates the distance between the user and the nearest sample and 
 * determines and report if the user is within 100 metres of a sample.
 * 
 * @param {boolean} setIsSongNearby - Setter function for isSongNearby state. 
 * @returns {JSX.Element} The rendered map component.
 */
export default function ShowMap({ setIsSongNearby }) {
    const { songLocationId, setSongLocationId } = useContext(SongContext);

    // Setup state for map data
    const initialMapState = {
        locationPermission: false,
        locations: [],
        userLocation: {
            latitude: -27.496473254807178,
            longitude: 153.08796231065313,
        },
        nearbyLocation: {}
    };
    const [ mapState, setMapState ] = useState(initialMapState);

    /**
     * Request user's geolocation permission.
     * Updates the map state based on permission grant/denial.
     */
    function requestLocationPermission() {
        Geolocation.requestAuthorization(
            // Success callback
            () => {
                console.log("Geolocation: Permission granted");
                setMapState(prevState => ({
                    ...prevState,
                    locationPermission: true
                }));
            },
            // Error callback
            (error) => {
                console.error("Error requesting location permission:", error.message);
                setMapState(prevState => ({
                    ...prevState,
                    locationPermission: false
                }));
            }
        );
    }   

    /**
     * Fetch locations data from an API and set them to map state.
     */
    useEffect(() => {
        async function fetchLocations() {
            try {
                const response = await fetch("https://comp2140.uqcloud.net/api/location/?api_key=BzBp5cywLo");
                const data = await response.json();
                const updatedLocations = data.map(location => {
                    return {
                        id: location.id,
                        coordinates: {
                            latitude: parseFloat(location.latitude),
                            longitude: parseFloat(location.longitude)
                        }
                    };
                });
                setMapState(prevState => ({
                    ...prevState,
                    locations: updatedLocations
                }));
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        }
        fetchLocations();
    }, []);

    /**
     * Request location permission after a short delay when the component mounts.
     */
    useEffect(() => {
        setTimeout(requestLocationPermission, 1000);
    }, []);

    /**
     * Calculate distance from user location to other locations and find the nearest one.
     * @param {Object} userLocation - Object containing user's latitude and longitude.
     * @return {Object} Returns the location nearest to the user.
     */
    function calculateDistance(userLocation) {
        const nearestLocations = mapState.locations.map(location => {
            const metres = getDistance(
                userLocation,
                location.coordinates
            );
            location["distance"] = {
                metres: metres, 
                nearby: metres <= 100 ? true : false
            };
            return location;
        }).sort((previousLocation, thisLocation) => {
            return previousLocation.distance.metres - thisLocation.distance.metres;
        });
        return nearestLocations.shift();
    }

    /**
     * Check if a song sample exists for a given location.
     * @param {number} locationId - The ID of the location.
     * @return {boolean} Returns true if song sample exists, else false.
     */
    async function isSampleNearLocation(locationId) {
        try {
            const response = await fetch(`https://comp2140.uqcloud.net/api/sampletolocation/?api_key=BzBp5cywLo&location_id=${locationId}`);
            const data = await response.json();
            return data.length > 0;
        } catch (error) {
            console.error("Error fetching samples:", error);
            return false;
        }
    }

    /**
     * Update the user's current location and checks for nearby locations with songs.
     * @param {Object} position - Object containing user's current position data.
     */
    function updateUserLocation(position) {
        (async () => {
            const userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            const nearbyLocation = calculateDistance(userLocation);
            const isSongAvailable = await isSampleNearLocation(nearbyLocation.id);
            setMapState({
                ...mapState,
                userLocation,
                nearbyLocation: nearbyLocation,
            });
            if (nearbyLocation.distance.nearby) {
                setSongLocationId(nearbyLocation.id);
            } else {
                setSongLocationId(null);
            }
            if (nearbyLocation.distance.nearby && isSongAvailable) {
                setIsSongNearby(true);
            } else {
                setIsSongNearby(false);
            }
        })();
    }

    /**
     * Watches for the user's position changes if geolocation permission is granted.
     */
    useEffect(() => {
        if (!mapState.locationPermission) {
            return;
        }
        console.log("Geolocation permission:", mapState.locationPermission);

        // if user is not moving
        Geolocation.getCurrentPosition(position => {
            updateUserLocation(position);
        })

        // Watch for position changes
        const watchId = Geolocation.watchPosition(updateUserLocation, (error) => {
            console.log(error);
        }, {
            enableHighAccuracy: true,
            distanceFilter: 10,
            interval: 1000,
            fastestInterval: 500,
        });
        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, [mapState.locationPermission]);


    return (
        <View style={styles.container}>
            <MapView
                camera={{
                    center: mapState.userLocation,
                    pitch: 0, // Angle of 3D map
                    heading: 0, // Compass direction
                    altitude: 3000, // Zoom level for iOS
                    zoom: 15 // Zoom level For Android
                }}
                showsUserLocation={true}
                style={styles.map}
                // provider={PROVIDER_GOOGLE}
            >
                {mapState.locations.map(location => (
                    <Circle
                        key={location.id}
                        center={location.coordinates}
                        radius={100}
                        strokeWidth={3}
                        strokeColor="#A42DE8"
                        fillColor={colorScheme == "dark" ? "rgba(128,0,128,0.5)" : "rgba(210,169,210,0.5)"}
                    />
                ))}
            </MapView>
        </View>
    );
}