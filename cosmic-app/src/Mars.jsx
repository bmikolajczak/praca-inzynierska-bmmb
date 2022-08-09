import './Mars.css'
import React, {Suspense, useRef} from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

// Example mesh
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

// Imported 3D Globe model
function MarsGlobe() {
  const gltf = useLoader(GLTFLoader, '../resources/MarsGlobe.glb')
  const ref = useRef()
  useFrame(()=> (
    ref.current.rotation.y += 0.0001,
    ref.current.rotation.z += 0.00002
    ))
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} ref={ref} scale={4} position={[-2, 0, -1]}/>
    </Suspense>
  )
}

// Canvas
function Mars() {
  return (
    <div id="overview-container">
      <div id="canvas-container">
        <Canvas camera={{fov: 90}}>
          <ambientLight intensity={0.2} />
          <pointLight color="white" position={[0, 0, 5]} />
          {/* <Planet/> */}
          <MarsGlobe/>
        </Canvas>
      </div>
      <div id="overview-info">
        <h1>Title Mars </h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque quasi aspernatur nihil eos nemo esse officia, mollitia ipsum quam ex quae dolorem quos amet? Tempora sunt modi soluta reiciendis dolores voluptatibus, distinctio ad magnam quaerat necessitatibus fugit odit corporis reprehenderit!
        </p>
      </div>
    </div>
  )
}
export default Mars