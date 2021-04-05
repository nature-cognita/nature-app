import React, { useContext } from "react";
import { View } from "react-native";
import { Button, Headline, DataTable } from "react-native-paper";
import { gql, useMutation } from "@apollo/client";
import {
  DatabaseContext,
  recordsCountAtom,
  downloadedDataAtom,
} from "../../store";
import { useAtom } from "jotai";

type SensorRecord = {
  id: string;
  value: Number;
}; // TODO: Type must come from GQL

const ADD_SENSOR_RECORDS = gql`
  mutation StoreRecords($input: StoreRecordsInput!) {
    storeRecords(input: $input) {
      status
    }
  }
`;

export const HomeScreen: React.FC = () => {
  const { db } = useContext(DatabaseContext);
  const [recordsCount, setRecordsCount] = useAtom(recordsCountAtom);
  const [downloadedData, setDownloadedData] = useAtom(downloadedDataAtom);

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const cleanupCache = () => {
    console.log("Cleaning up cache");

    db.transaction((tx) => {
      tx.executeSql("DELETE FROM data", [], (_tx, result) => {
        console.log(result);
      });
    });

    setRecordsCount(0);
    setDownloadedData({
      timestamps: [0],
      humidity: [0],
      temperature: [0],
      voltage: [0],
    });
  };

  const [storeRecords] = useMutation(ADD_SENSOR_RECORDS);

  const uploadData = () => {
    console.log("Uploding data!");

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * from data;",
        [],
        async (_tx, result) => {
          for (let i = 0; i < result.rows.length; i++) {
            const item = result.rows.item(i);

            const date = item["date"];

            const sensorValues: Array<SensorRecord> = JSON.parse(
              item["sensor_values"]
            );

            const records = sensorValues.map((record) => {
              return {
                timestamp: date,
                sensorId: record.id,
                value: record.value,
              };
            });

            await storeRecords({
              variables: { input: { records } },
            });
          }

          cleanupCache();
        },
        (_tx, error) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Headline>You are storing {recordsCount} records</Headline>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Plant Name</DataTable.Title>
          <DataTable.Title numeric>Records</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>Electromuseum</DataTable.Cell>
          <DataTable.Cell numeric>{recordsCount}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <Button icon="upload" mode="contained" onPress={uploadData}>
        Upload Collected Data
      </Button>
    </View>
  );
};
