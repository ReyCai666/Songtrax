// Light and Dark colour schemes
export const colors = {
	purpleColorLighter: "#A42DE8",
	blueColorLighter: "#318AFF",
	blueColorDarker: "#2D3DE8",
	blackColorTranslucentLess: "rgba(0,0,0,0.35)",
	blackColorTranslucentMore: "rgba(0,0,0,0.7)",
    whiteColor: "#ffffff",
    whiteColorTranslucent: "rgba(255,255,255, 0.5)",
    light: {
        background: 'white',
        text: 'white',
        header: '#760099',
        buttonBackground: '#9A0395',
        borderColor: '#C067BD',
        inputBackground: '#C067BD',
    },
    dark: {
        background: "#422142",
        text: '#760099',
        header: "#f0c4f0",
        buttonBackground: "#f0c4f0",
        borderColor: "#f0c4f0",
        inputBackground: '#C067BD',
    },
};

/**
 * Returns the dynamic styles based on the current theme mode and screen height.
 *
 * @param {string} mode - Current theme mode ('light' or 'dark').
 * @param {number} height - Current screen height.
 * @returns {Object} The styles object.
 */
// unused
export const styles = (mode, height) => ({
    nearbyAndPlayContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: colors[mode].bgColor
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
        color: colors[mode].fgColor,
        paddingBottom: 0
    },
    subHeading: {
        fontSize: 14,
        color: colors[mode].fgColor,
        paddingBottom: 25
    },
    songName: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors[mode].fgColor,
        paddingBottom: 0
    },
    location: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center", 
    },
    locationHeading: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 100,
        color: colors[mode].fgColor,
        paddingBottom: 6
    },
    playButton: {
        backgroundColor: colors[mode].fgColor,
        color: colors[mode].bgColor,
        fontWeight: "bold",
        padding: 10,
        borderRadius: 10,
        margin: 10
    },
    locationIcon: {
        marginLeft: 5,
        marginTop: 30,
        width: 30,
        height: 54,
    },
    currentLocation: {
        marginBottom: 10
    }, 
    ratingComponent: {
        paddingTop: 15,
    },
    profileContainer: {
        padding: 20,
        backgroundColor: colors[mode].bgColor,
        flex: 1
    },
    input: {
        marginTop: 20,
        backgroundColor: colors[mode].fgColorLighter,
        color: colors[mode].fgColor,
        borderRadius: 5,
        textAlign: "center",
        height: 40
    },
    photoEmptyView: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors[mode].fgColorLighter,
        borderStyle: "dashed",
        height: height / 1.625
    },
    photoFullImage: {
        width: "100%",
        borderRadius: 10
    },
    addPhoto: {
        backgroundColor: colors[mode].fgColor,
        color: colors[mode].bgColor,
        fontWeight: "bold",
        padding: 10,
        borderRadius: 10,
        textAlign: "center",
        width: "50%",
        marginLeft: "25%",
        marginTop: -(height / 3.25)
    },
    changePhoto: {
        backgroundColor: colors[mode].fgColor,
        color: colors[mode].bgColor,
        fontWeight: "bold",
        padding: 10,
        borderRadius: 10,
        textAlign: "center",
        width: "50%",
        marginLeft: "25%",
        marginTop: -(height / 12)
    }
});


