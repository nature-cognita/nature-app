import React, { Suspense, useState, useMemo, useRef } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { DatabaseContext, recordsCountAtom } from "../../store";
import { useContext } from "react";
import { useAtom } from "jotai";
import { Canvas, useFrame } from "react-three-fiber";
import * as THREE from "three";

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

function Swarm({ count }) {
  const mesh = useRef(null);
  const [dummy] = useState(() => new THREE.Object3D());

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -20 + Math.random() * 40;
      const yFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.max(1.5, Math.cos(t) * 5);
      particle.mx +=
        (state.mouse.x * state.viewport.width - particle.mx) * 0.02;
      particle.my +=
        (state.mouse.y * state.viewport.height - particle.my) * 0.02;
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={mesh}
        args={[null, null, count]}
        castShadow
        receiveShadow
      >
        <sphereBufferGeometry args={[1, 32, 32]} />
        <meshPhongMaterial />
      </instancedMesh>
    </>
  );
}

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
        camera={{ fov: 75, position: [0, 0, 70], near: 10, far: 150 }}
        shadowMap
        gl={{ alpha: false, antialias: false }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[100, 100, 100]} intensity={2} castShadow />
        <pointLight position={[-100, -100, -100]} intensity={5} color="red" />
        <Suspense fallback={null}>
          <Box />
        </Suspense>
        <Swarm count={150} />
      </Canvas>
      <Text>Stored Records Count: {recordsCount} </Text>
      <Button icon="download" mode="contained" onPress={downloadPlantData}>
        Download plant data
      </Button>
    </View>
  );
};
