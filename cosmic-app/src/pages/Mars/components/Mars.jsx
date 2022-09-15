import style from '../styles/Mars.module.scss'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import landscapes from './Landscapes.json'

// Generalize component, use props
// angle rotation on camera
// Orbit controls
function LandModel(props) {
  const modelURL = `/src/assets/mars/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.0005))
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.2} />
      <pointLight color="white" position={[4, 5, 1]} />
      <primitive
        object={gltf.scene}
        ref={ref}
        scale={1}
        position={[0, -5, -15]}
      />
    </Suspense>
  )
}
function Landscapes() {
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

// Imported 3D Globe model
function MarsGlobe() {
  const gltf = useLoader(GLTFLoader, '/src/assets/mars/MarsGlobe.glb')
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.0002))
  return (
    <Suspense fallback={null}>
      <primitive
        object={gltf.scene}
        ref={ref}
        scale={2.2}
        position={[-1, 0, -1]}
      />
    </Suspense>
  )
}

// Mars Page
function Mars() {
  return (
    <main className={style.main}>
      <Suspense fallback={<span className={style.loading}>Loading...</span>}>
        <section className={style.overviewContainer}>
          <div className={style.canvasContainer}>
            <Canvas camera={{ fov: 45 }}>
              <ambientLight intensity={0.2} />
              <pointLight color="white" position={[0, 0, 5]} />
              <MarsGlobe />
            </Canvas>
          </div>
          <div className={style.overviewInfo}>
            <h1 className={style.heading}>Mars - the Red Planet</h1>
            <p>
              The fourth planet from the Sun, Mars is one of Earth's two closest
              planetary neighbors.
              <br />
              <br /> A dusty, cold, desert world with a very thin atmosphere.
              Mars is also a dynamic planet with seasons, polar ice caps,
              canyons, extinct volcanoes, and evidence that it was even more
              active in the past.
            </p>
          </div>
        </section>
      </Suspense>
      <Landscapes />
    </main>
  )
}
export default Mars
