import './Mars.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'

function Mars() {
  return (
    <div id="canvas-container">
      <Canvas >
        <ambientLight intensity={0.1}/>
        <directionalLight color="blue" position={[0,0,5]}/>
        <OrbitControls/>
        <mesh>
          <octahedronGeometry/>
          <meshStandardMaterial color="white"/>
        </mesh> 
      </Canvas>
    </div>
  )
}
export default Mars