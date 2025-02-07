import React, { useState }from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';

import PlayMusic from './src/screens/PlayMusic';
import BottomNavBar from './src/components/BottomNavBar';
import ShowMap from './src/components/ShowMap';
import NearMe from './src/screens/NearMe';
import Profile from './src/screens/Profile';
import { SongProvider } from './src/context/SongContext';
import { ProfilePictureProvider } from './src/context/ProfileContext';

const Tab = createBottomTabNavigator();

/**
 * The BottomTabs component represents the main navigation of the app.
 * It provides a tab-based navigation experience using a custom BottomNavBar.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isSongNearby - Indicator if a song is nearby the user.
 * @param {Function} props.setIsSongNearby - Setter function for isSongNearby state.
 * 
 * @returns {JSX.Element} The rendered tab navigator component.
 */
function BottomTabs({ isSongNearby, setIsSongNearby }) {
  return (
    <Tab.Navigator 
      initialRouteName="Map"
      tabBar={(props) => <BottomNavBar {...props} isSongNearby={isSongNearby}/>} 
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          switch (route.name) {
            case 'Map':
              return require('./AppIcons/tab-map-white.png');
            case 'Songtrax':
              return require('./AppIcons/logo-white.png');
            case 'Profile':
              return require('./AppIcons/tab-profile-white.png');
            default:
              return null;
          }
        }
      })}
    >
      <Tab.Screen name="Map" 
        children={({navigation}) => <ShowMap isSongNearby={isSongNearby} setIsSongNearby={setIsSongNearby} navigation={navigation}/>}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Songtrax" component={NearMe} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
      <Tab.Screen name="PlayMusic" component={PlayMusic} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

/**
 * The App component is the root component of the application.
 * It initializes and manages the primary app state, provides the navigation container, 
 * and wraps the main content in context providers for song and profile data.
 * 
 * @returns {JSX.Element} The rendered navigation container with bottom tabs.
 */
export default function App() {
  const [isSongNearby, setIsSongNearby] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <SongProvider>
        <ProfilePictureProvider>
          <BottomTabs isSongNearby={isSongNearby} setIsSongNearby={setIsSongNearby}/>
        </ProfilePictureProvider>
      </SongProvider>
    </NavigationContainer>
  );

}

enableScreens();
