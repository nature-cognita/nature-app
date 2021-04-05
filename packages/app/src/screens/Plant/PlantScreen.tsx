import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { DatabaseContext, recordsCountAtom } from "../../store";
import { useContext } from "react";
import { useAtom } from "jotai";
import { Visualisation } from "../../components";
const PLANT_URL = "http://192.168.31.181:4000"; //TODO: Move to env variable

export const PlantScreen: React.FC = () => {
  const [recordsCount, setRecordsCount] = useAtom(recordsCountAtom);
  const { db } = useContext(DatabaseContext);

  const updateRecordsCount = (tx: SQLite.SQLTransaction) => {
    tx.executeSql("SELECT * FROM data", [], (_tx, result) => {
      setRecordsCount(result.rows.length);
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
      <Visualisation count={150} />
      <Text>Stored Records Count: {recordsCount} </Text>
      <Button icon="download" mode="contained" onPress={downloadPlantData}>
        Download plant data
      </Button>
    </View>
  );
};
