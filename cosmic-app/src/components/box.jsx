import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

export const Box = (props) => {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.02;
  });

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[2, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "red"} />
    </mesh>
  );
};
