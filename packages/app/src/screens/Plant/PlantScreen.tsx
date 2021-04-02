import React, { Suspense } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { DatabaseContext, recordsCountAtom } from "../../store";
import { useContext } from "react";
import { useAtom } from "jotai";
import { Canvas, useFrame } from "react-three-fiber";

const PLANT_URL = "http://localhost:4000";

const Box = () => {
  useFrame(({ scene }) => {
    const box = scene.getObjectByName("box");
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
  });

  return (
    <mesh name="box">
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial color="blue" />
    </mesh>
  );
};

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
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[-1, 1, 1]} castShadow />
          <Box />
        </Suspense>
      </Canvas>
      <Text>Stored Records Count: {recordsCount} </Text>
      <Button icon="download" mode="contained" onPress={downloadPlantData}>
        Download plant data
      </Button>
    </View>
  );
};
