import React from "react";
import { View } from "react-native";
import { Button, Title } from "react-native-paper";
import * as SQLite from "expo-sqlite";
import {
  DatabaseContext,
  recordsCountAtom,
  downloadedDataAtom,
} from "../../store";
import { useContext } from "react";
import { useAtom } from "jotai";
import { Chart } from "../../components";
const PLANT_URL = "http://localhost:4000"; //TODO: Move to env variable

export const PlantScreen: React.FC = () => {
  const [_recordsCount, setRecordsCount] = useAtom(recordsCountAtom);
  const [downloadedData, setDownloadedData] = useAtom(downloadedDataAtom);

  const { db } = useContext(DatabaseContext);

  const updateRecordsCount = (tx: SQLite.SQLTransaction) => {
    tx.executeSql("SELECT * FROM data", [], (_tx, result) => {
      const timestamps = [];
      const humidity = [];
      const temperature = [];
      const voltage = [];

      for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows.item(i);

        const date = item["date"];
        const sensorValues = JSON.parse(item["sensor_values"]);

        timestamps.push(date);
        const [hValue, tValue, vValue] = sensorValues;

        humidity.push(hValue.value);
        temperature.push(tValue.value);
        voltage.push(vValue.value);
      }

      setDownloadedData({
        timestamps,
        humidity,
        temperature,
        voltage,
      });

      setRecordsCount(result.rows.length);
    });
  };

  const saveData = (date, values) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO data(date, sensor_values) values(?,?);",
        [date, values],

        (_tx, _result) => {
          // console.log(result);
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
      {/* <Visualisation count={150} /> */}

      {downloadedData.humidity.length > 0 && (
        <>
          <Title>Humidity</Title>
          <Chart
            timestamps={downloadedData.timestamps.slice(-50)}
            data={downloadedData.humidity.slice(-50)}
          />
        </>
      )}

      {downloadedData.humidity.length > 0 && (
        <>
          <Title>Temperature</Title>
          <Chart
            timestamps={downloadedData.timestamps.slice(-50)}
            data={downloadedData.temperature.slice(-50)}
          />
        </>
      )}

      {downloadedData.voltage.length > 0 && (
        <>
          <Title>Voltage</Title>
          <Chart
            timestamps={downloadedData.timestamps.slice(-50)}
            data={downloadedData.voltage.slice(-50)}
          />
        </>
      )}
      <Button icon="download" mode="contained" onPress={downloadPlantData}>
        Download plant data
      </Button>
    </View>
  );
};
