import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Button } from "react-native-paper";
import * as SQLite from "expo-sqlite";
const PLANT_URL = "http://localhost:3000";

export const PlantScreen: React.FC = () => {
  const initDB = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS data(date text, sensor_values text);",
        [],
        (_tx, _result) => {
          console.log("Table created successfully");
        },
        (_tx, error) => {
          console.log("Can't create table");
          console.log(error);

          return true;
        }
      );
    });
  };

  const saveData = (date, values) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO data(date, sensor_values) values(?,?);",
        [date, values],

        (_tx, result) => {
          console.log(result);
        },

        (_tx, error) => {
          console.log(error);

          return true;
        }
      );
    });
  };

  const db = SQLite.openDatabase("plantsData");
  initDB();

  const downloadPlantData = () => {
    console.log("Sync plant data");

    fetch(`${PLANT_URL}`)
      .then((responce) => responce.json())
      .then((responceJson) => {
        const data = responceJson.data;
        const dateValues = Object.entries(data);

        dateValues.forEach(([date, value]) => {
          saveData(date, JSON.stringify(value));
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button icon="download" mode="contained" onPress={downloadPlantData}>
        Download plant data
      </Button>
    </View>
  );
};
