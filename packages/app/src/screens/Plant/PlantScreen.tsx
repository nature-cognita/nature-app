import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Badge, Button } from "react-native-paper";

const PLANT_URL = "http://localhost:3000";

export const PlantScreen: React.FC = () => {
  const loadPlantData = () => {
    fetch(`${PLANT_URL}`)
      .then(responce => responce.json())
      .then(responceJson => console.log(responceJson));
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button icon="sync" mode="contained" onPress={loadPlantData}>
        Load Plant Data
      </Button>
    </View>
  );
};
