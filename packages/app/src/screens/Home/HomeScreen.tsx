import React, { useContext } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { gql, useMutation } from "@apollo/client";
import { DatabaseContext } from "../../store";

// TODO: Share common types between apps
type SensorRecord = {
  id: string;
  value: Number;
};

const ADD_SENSOR_RECORDS = gql`
  mutation StoreRecords($input: StoreRecordsInput!) {
    storeRecords(input: $input) {
      status
    }
  }
`;

export const HomeScreen: React.FC = () => {
  const { db } = useContext(DatabaseContext);

  const cleanupCache = () => {
    console.log("Cleaning up cache");

    db.transaction((tx) => {
      tx.executeSql("DELETE FROM data", [], (_tx, result) => {
        console.log(result);
      });
    });

    // TODO: Update records counter
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
            console.log(date);

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

            console.log(records);

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
      <Button icon="upload" mode="contained" onPress={uploadData}>
        Upload Collected Data
      </Button>
    </View>
  );
};
