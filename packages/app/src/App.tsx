import React, { useState, useEffect } from "react";

import { registerRootComponent } from "expo";
import { HomeScreen, MapScreen, PlantScreen } from "screens";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

const App: React.FC = () => {
  return <AppContainer />;
};

const bottomTabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="md-home" size={25} color={tintColor} />
        ),
      },
    },
    Map: {
      screen: MapScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="md-map" size={25} color={tintColor} />
        ),
      },
    },
    Plant: {
      screen: PlantScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="md-flower" size={25} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: "Home",
  }
);

const AppContainer = createAppContainer(bottomTabNavigator);

registerRootComponent(App);
