import React from "react";

import { registerRootComponent } from "expo";
import { HomeScreen, MapScreen, PlantScreen } from "screens";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { Provider as PaperProvider } from "react-native-paper";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Provider as JotaiProvider } from "jotai";

const client = new ApolloClient({
  uri: "https://cognita.dev/gql",
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <JotaiProvider>
        <PaperProvider>
          <NavigationContainer>
            <RootTabs />
          </NavigationContainer>
        </PaperProvider>
      </JotaiProvider>
    </ApolloProvider>
  );
};

const Tabs = createMaterialBottomTabNavigator();

const RootTabs = () => {
  return (
    <Tabs.Navigator initialRouteName="Home">
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="md-home" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="md-map" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Plant"
        component={PlantScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="md-flower" size={25} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

registerRootComponent(App);
