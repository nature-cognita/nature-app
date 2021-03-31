import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import MapView, { Marker, Region, Callout } from "react-native-maps";
import * as Permissions from "expo-permissions";
import { useQuery, gql } from "@apollo/client";

const testInitialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const GET_DEVICES = gql`
  {
    devices {
      id
      label
      location {
        label
        latitude
        longitude
      }
    }
  }
`;

export const MapScreen: React.FC = () => {
  const [region, setRegion] = useState<Region>(testInitialRegion);

  const [marginBottom, setMarginBottom] = useState(1); //TODO: https://github.com/react-native-community/react-native-maps/issues/2010

  const { data, loading, error } = useQuery(GET_DEVICES);

  if (error) {
    console.log(error);

    return <></>;
  }
  if (loading) {
    console.log("Loading data");

    return <></>;
  }

  const devices = data["devices"];

  const onRegionChange = (newRegion: Region) => {
    setRegion(newRegion); //TODO: Use setRegion to set location on user after GPS is available.
  };

  const onMapReady = async () => {
    Permissions.askAsync(Permissions.LOCATION).then((_status) =>
      setMarginBottom(0)
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={[styles.mapStyle, { marginBottom: marginBottom }]}
        initialRegion={region} //TODO: Get initial region from user latest location
        onRegionChange={onRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        onMapReady={onMapReady}
      >
        {devices.map((device) => (
          <Marker
            coordinate={device.location}
            title={device.label}
            key={device.id}
          >
            <Callout>
              <Text>{device.label}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
