import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import MapView, { Marker, LatLng, Region, Callout } from "react-native-maps";
import * as Permissions from "expo-permissions";

const testMarkers = [
  {
    id: "0",
    coordinate: { latitude: 37.763056, longitude: -122.4463657 },
    title: "test0",
    description: "This is test 0 marker"
  },
  {
    id: "1",
    coordinate: { latitude: 37.7663521, longitude: -122.4443481 },
    title: "test1",
    description: "This is test 1 marker"
  }
];

const testInitialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

type MapMarker = {
  id: string;
  coordinate: LatLng;
  title: string;
  description?: string;
};

export const MapScreen: React.FC = () => {
  const [region, setRegion] = useState<Region>(testInitialRegion);

  const [markers, setMarkers] = useState<Array<MapMarker>>(testMarkers);

  const [marginBottom, setMarginBottom] = useState(1); //TODO: https://github.com/react-native-community/react-native-maps/issues/2010

  const onRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const onMapReady = async () => {
    Permissions.askAsync(Permissions.LOCATION).then(_status =>
      setMarginBottom(0)
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={[styles.mapStyle, { marginBottom: marginBottom }]}
        initialRegion={region} //TODO: Get initial region from location
        onRegionChange={onRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        onMapReady={onMapReady}
      >
        {markers.map(marker => (
          <Marker
            coordinate={marker.coordinate}
            title={marker.title}
            key={marker.id}
          >
            <Callout>
              <Text>{marker.title}</Text>
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
    justifyContent: "center"
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});
