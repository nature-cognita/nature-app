import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import * as THREE from "three";

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

const Swarm = ({ count }: { count: number }) => {
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
};

export const Visualisation = ({ count }: { count: number }) => {
  return (
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
      <Swarm count={count} />
    </Canvas>
  );
};
