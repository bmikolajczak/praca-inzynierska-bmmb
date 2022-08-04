import { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

import logo from "./logo.svg";
import "./App.css";

import { HeaderNavigation } from "./components/header";
import { Box } from "./components/box";
import { Outlet } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <HeaderNavigation />
      <Outlet />
      <div>
        <h2 className="abslouteText">Hello</h2>
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[1.2, 0, 0]} />
          <Box position={[-1.2, 1, 0]} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
