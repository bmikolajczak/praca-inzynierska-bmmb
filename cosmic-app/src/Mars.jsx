import './Mars.css'
import React, {useState, useRef} from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Planet() {
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.005))
  return (
    <mesh ref={ref} scale={4} position={[-3, 0, -3]}>
      <sphereGeometry />
      <meshStandardMaterial color="red"/>
    </mesh>
  )
}

function Mars() {
  return (
    <div id="overview-container">
      <div id="canvas-container">
        <Canvas >
          <ambientLight intensity={0.2} />
          <pointLight color="white" position={[0, 0, 5]} />
          <Planet/>
        </Canvas>
      </div>
      <div id="overview-info">
        <h1>Title Mars</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat ab totam incidunt nam dicta deleniti sapiente cupiditate, illum iure voluptatibus beatae aperiam. Dignissimos, vero blanditiis similique eius deserunt eaque officia qui doloremque officiis suscipit.
        </p>
      </div>
    </div>
  )
}
export default Mars