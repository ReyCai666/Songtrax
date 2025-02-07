import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';

import CustomTabs from './CustomTabs';

/**
 * BottomNavBar Component
 * 
 * A custom bottom navigation bar that displays the available tabs.
 * It uses the `CustomTabs` component to render the tab buttons.
 * Each tab button corresponds to a route/screen in the application.
 * 
 * @param {Object} props - The component's props.
 * @param {Object} props.state - The navigation state.
 * @param {Object} props.navigation - The navigation functions.
 * @returns {JSX.Element} The rendered component.
 */
const BottomNavBar = ({ state, navigation, isSongNearby}) => {
  return (
    <LinearGradient 
        colors={['#CA3DFF', '#2229FF']} 
        style={styles.tabBarContainer}
    >
      <CustomTabs 
        onTabPress={(index) => {
          const routeName = state.routes[index].name;
          navigation.navigate(routeName);
        }}
        activeTab={state.index}
        isSongNearby={isSongNearby}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    width: '100%', 
    height: 60, 
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  }
});

export default BottomNavBar;
