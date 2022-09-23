import style from '../styles/Solar.module.scss'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function CelestialModel(props) {
  const modelURL = `src/assets/solar_system/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.0005))
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} ref={ref} scale={1} position={[0, 0, 0]} />
    </Suspense>
  )
}

export default function Solar() {
  return (
    <main className={style.solar}>
      <Canvas>
        <CelestialModel model="earth.glb" />
        <directionalLight color="white" position={[5, 5, 5]} intensity={1} />
      </Canvas>
    </main>
  )
}
