import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import MapView, { Marker, LatLng, Region, Callout } from "react-native-maps";
import * as Permissions from "expo-permissions";
import { useQuery, gql } from "@apollo/client";
import { Device } from "generated/types";

const testMarkers = [
  {
    id: "0",
    coordinate: { latitude: 37.763056, longitude: -122.4463657 },
    title: "test0",
    description: "This is test 0 marker",
  },
  {
    id: "1",
    coordinate: { latitude: 37.7663521, longitude: -122.4443481 },
    title: "test1",
    description: "This is test 1 marker",
  },
];

const testInitialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

type MapMarker = {
  id: string;
  coordinate: LatLng;
  title: string;
  description?: string;
};

const GET_DEVICES = gql`
  {
    devices {
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

  // const [devices, setDevices] = useState<Array<Device>>([]);

  const [marginBottom, setMarginBottom] = useState(1); //TODO: https://github.com/react-native-community/react-native-maps/issues/2010

  const { data, loading } = useQuery(GET_DEVICES);

  if (loading) return;
  // console.log(data);

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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
