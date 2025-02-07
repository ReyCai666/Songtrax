import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet, Text } from 'react-native';

/**
 * TabButton Component
 * 
 * Represents an individual tab button in the bottom navigation bar.
 * 
 * Props:
 * @param {object} icon - The image source for the tab's icon.
 * @param {function} onPress - Callback function to be called when the tab is pressed.
 * @param {boolean} isActive - Indicates if the tab is currently active/selected.
 * @param {boolean} [isSongtrax=false] - Optional flag for custom styling or behavior specific to the Songtrax tab.
 * 
 * Notes:
 * - The visual appearance of the tab changes based on the `isActive` prop to indicate the current selection.
 * - The icon's `tintColor` also adjusts based on the `isActive` status: white for active, gray for inactive.
 * - If `isSongtrax` is set to true, the icon will have a custom style specific for the Songtrax tab.
 */
const TabButton = ({ icon, onPress, isActive, isSongtrax, containerStyle, children}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.buttonContainer, 
        containerStyle,
        isActive && styles.buttonActive,
      ]}
    >
      <View style={isSongtrax ? styles.songtraxContainer : {}}>
        <Image 
          source={icon} 
          resizeMode="contain" 
          style={isSongtrax ? styles.songtraxIcon : styles.icon}
        />
        {children}
      </View>
    </TouchableOpacity>
  );
};


// Define the icons' sources
const map = require('../../AppIcons/tab-map-white.png');
const songtrax = require('../../AppIcons/logo-white.png');
const profile = require('../../AppIcons/tab-profile-white.png');

/**
 * CustomTabs Component
 * 
 * Represents a custom bottom navigation bar containing three tabs: map, Songtrax, and profile.
 * 
 * Props:
 * 
 * @param {function} [onTabPress=() => {}] - Callback function to be called when a tab is pressed.
 *                                         Receives the index of the pressed tab (0, 1, or 2).
 * @param {number} activeTab - The index of the currently active tab. Used to visually highlight the active tab.
 * 
 * Notes:
 * - Each tab button is represented by the `TabButton` component.
 * - The indices 0, 1, and 2 correspond to the map, Songtrax, and profile tabs respectively.
 */
const CustomTabs = ({ onTabPress = () => {}, activeTab, isSongNearby }) => {
  return (
    <View style={styles.container}>
      <TabButton icon={map} onPress={() => onTabPress(0)} isActive={activeTab === 0} />
      <TabButton 
        icon={songtrax} 
        onPress={() => onTabPress(1)} 
        isActive={activeTab === 1}
        isSongtrax={true}
        containerStyle={activeTab === 1 ? styles.songtraxActive : {}}
      >
        {isSongNearby && <Text style={styles.songNearbyText}>There's Music Nearby</Text>}
      </TabButton>
      <TabButton icon={profile} onPress={() => onTabPress(2)} isActive={activeTab === 2} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
    },
    buttonActive: {
        backgroundColor: 'rgba(0,0,0,0.2)', // Darkened background for active state
    },
    icon: {
        width: 30,
        height: 30,
    },
    songtraxIcon: {
        marginTop: -10,
        width: 100,
        height: 40,
    },
    songtraxContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    songNearbyText: {
        color: 'white',
        fontSize: 10,
        marginTop: -10,
    },
    songtraxActive: {
        backgroundColor: 'rgba(0,0,0,0.2)',
    }
});

export default CustomTabs;
