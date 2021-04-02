import React from "react";

import { registerRootComponent } from "expo";
import { HomeScreen, MapScreen, PlantScreen } from "screens";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Provider } from "jotai";

const client = new ApolloClient({
  uri: "http://localhost:3000/gql",
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Provider>
        <AppContainer />
      </Provider>
    </ApolloProvider>
  );
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
