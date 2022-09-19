import style from '../styles/Landscapes.module.scss'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// Data could be stored in the database
import landscapes from './Landscapes.json'

// Angle rotation on camera
// Add orbit controls
// Fix lighting and model position
// Unify models size
function LandModel(props) {
  const modelURL = `/src/assets/mars/marsLandscapes/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.0005))
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.2} />
      <pointLight color="white" position={[0, 4, 0]} />
      <primitive
        object={gltf.scene}
        ref={ref}
        scale={1}
        position={[0, -3, -13]}
      />
    </Suspense>
  )
}

export default function Landscapes() {
  const landItems = landscapes.map((land) => (
    <li key={land.title}>
      <h3>{land.title}</h3>
      <div className={style.landscapeElem}>
        <p>{land.description}</p>
        <div className={style.landscapeCanvas}>
          <Canvas>
            <LandModel model={land.model} />
          </Canvas>
        </div>
      </div>
    </li>
  ))
  return (
    <section className={style.landscapes}>
      <h2>Landscapes</h2>
      <ul className={style.landscapeList}>{landItems}</ul>
    </section>
  )
}
