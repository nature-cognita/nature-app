import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Button } from "react-native-paper";

const PLANT_URL = "http://localhost:3000";

export const PlantScreen: React.FC = () => {
  const syncPlantData = () => {
    fetch(`${PLANT_URL}`)
      .then(responce => responce.json())
      .then(responceJson => {
        const data = responceJson.data;
        const dateValues = Object.entries(data);

        dateValues.forEach(([date, value]) => {
          // AsyncStorage.setItem(date, JSON.stringify(value));
        });
      })
      .catch(error => console.error(error));
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button icon="sync" mode="contained" onPress={syncPlantData}>
        Load Plant Data
      </Button>
    </View>
  );
};
