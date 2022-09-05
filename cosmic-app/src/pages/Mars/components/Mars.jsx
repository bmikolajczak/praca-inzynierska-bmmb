import '../styles/Mars.scss'
import style from '../styles/Mars.module.scss'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Imported 3D Globe model
function MarsGlobe() {
  const gltf = useLoader(GLTFLoader, '/src/assets/MarsGlobe.glb')
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.0001))
  return (
    <Suspense fallback={null}>
      <primitive
        object={gltf.scene}
        ref={ref}
        scale={2.4}
        position={[-1, 0, -1]}
      />
    </Suspense>
  )
}

// Canvas
function Mars() {
  return (
    <div className={style.overviewContainer}>
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
          <br /> A dusty, cold, desert world with a very thin atmosphere. Mars
          is also a dynamic planet with seasons, polar ice caps, canyons,
          extinct volcanoes, and evidence that it was even more active in the
          past.
          <br />
          <br /> Mars is one of the most explored bodies in our solar system,
          and it's the only planet where we've sent rovers to roam the alien
          landscape.
        </p>
      </div>
    </div>
  )
}
export default Mars
