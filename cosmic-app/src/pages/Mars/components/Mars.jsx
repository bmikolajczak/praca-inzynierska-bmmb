import style from '../styles/Mars.module.scss'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Landscapes from './Landscapes'
import { Clock } from 'three'
import LoaderCustom from '../../../infrastructure/loader/LoaderCustom'

// Imported 3D Globe model
function MarsGlobe() {
  const gltf = useLoader(GLTFLoader, '/src/assets/mars/MarsGlobe.glb')
  const ref = useRef()
  const clock = new Clock()
  useFrame(() => (ref.current.rotation.y += 0.03 * clock.getDelta()))
  return <primitive object={gltf.scene} ref={ref} scale={2.2} position={[-1, 0, -1]} />
}

// Mars Page
export default function Mars() {
  return (
    <main className={style.main}>
      {/* Loading outside canvas, can't use Loader component */}
      <section className={style.overviewContainer}>
        <div className={style.canvasContainer}>
          <Canvas camera={{ fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.2} />
              <pointLight color="white" position={[0, 0, 5]} />
              <MarsGlobe />
            </Suspense>
          </Canvas>
          <LoaderCustom />
        </div>
        <div className={style.overviewInfo}>
          <h1 className={style.heading}>Mars - the Red Planet</h1>
          <p>
            The fourth planet from the Sun, Mars is one of Earth's two closest planetary neighbors.
            <br />
            <br /> A dusty, cold, desert world with a very thin atmosphere. Mars is also a dynamic planet with seasons,
            polar ice caps, canyons, extinct volcanoes, and evidence that it was even more active in the past.
          </p>
        </div>
      </section>
      <Landscapes />
    </main>
  )
}
