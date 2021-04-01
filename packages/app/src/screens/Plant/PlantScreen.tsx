import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import * as SQLite from "expo-sqlite";
const PLANT_URL = "http://localhost:4000";

export const PlantScreen: React.FC = () => {
  const [recordsCount, setRecordsCount] = useState(0); // TODO: Move to APP State

  const updateRecordsCount = (tx: SQLite.SQLTransaction) => {
    tx.executeSql("SELECT * FROM data", [], (_tx, result) => {
      setRecordsCount(result.rows.length);
    });
  };

  const initDB = () => {
    console.log("Initializing DB");

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

      updateRecordsCount(tx);
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
  initDB(); // TODO: Move to context

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
      .catch((error) => console.error(error))
      .finally(() => {
        db.transaction((tx) => {
          updateRecordsCount(tx);
        });
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Stored Records Count: {recordsCount} </Text>
      <Button icon="download" mode="contained" onPress={downloadPlantData}>
        Download plant data
      </Button>
    </View>
  );
};
