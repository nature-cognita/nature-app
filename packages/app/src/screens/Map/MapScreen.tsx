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

const MAP_THEME = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#e9e9e9",
      },
      {
        lightness: 17,
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 17,
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 29,
      },
      {
        weight: 0.2,
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 18,
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
      {
        lightness: 21,
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#dedede",
      },
      {
        lightness: 21,
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        visibility: "on",
      },
      {
        color: "#ffffff",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        saturation: 36,
      },
      {
        color: "#333333",
      },
      {
        lightness: 40,
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#f2f2f2",
      },
      {
        lightness: 19,
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#fefefe",
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#fefefe",
      },
      {
        lightness: 17,
      },
      {
        weight: 1.2,
      },
    ],
  },
];

export const MapScreen: React.FC = () => {
  const [region, setRegion] = useState<Region>(testInitialRegion);

  const [marginBottom, setMarginBottom] = useState(1); //TODO: https://github.com/react-native-community/react-native-maps/issues/2010

  const { data, loading, error } = useQuery(GET_DEVICES);

  const devices = loading || error ? [] : data["devices"];

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
      {error && <Text style={{ color: "white" }}>Error: {error.message}</Text>}
      {!error && (
        <MapView
          style={[styles.mapStyle, { marginBottom: marginBottom }]}
          initialRegion={region} //TODO: Get initial region from user latest location
          onRegionChange={onRegionChange}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          onMapReady={onMapReady}
          customMapStyle={MAP_THEME}
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
      )}
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
    height: Dimensions.get("window").height + 30,
  },
});
