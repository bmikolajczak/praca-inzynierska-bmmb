import style from '../styles/Solar.module.scss'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import celestials from './Solar.json'
import { OrbitControls, Environment } from '@react-three/drei'
import Loader from '../../../infrastructure/loader/Loader'
import Sun from './SunShader'
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing'

function CelestialModel(props) {
  const modelURL = `src/assets/solar_system/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const ref = useRef()
  useThree(({ camera }) => {
    camera.position.set(0, 60, 125)
  })
  useFrame(() => (ref.current.rotation.y += props.spinSpeed))
  return (
    <Suspense fallback={null}>
      <primitive
        object={gltf.scene}
        ref={ref}
        scale={0.5}
        position={props.position}
      />
    </Suspense>
  )
}

export default function Solar() {
  const celestialBodies = celestials.map((celes) => (
    <CelestialModel
      model={celes.model}
      position={celes.position}
      key={celes.name}
      spinSpeed={celes.spinSpeed}
    />
  ))
  return (
    <main className={style.solar}>
      <Canvas camera={{ far: 2000 }}>
        <Suspense fallback={<Loader />}>
          <Sun />
          {celestialBodies}
          {/* <directionalLight color="white" position={[5, 5, 5]} intensity={1} /> */}
          <pointLight intensity={1} position={[0, 0, 0]} decay={2} />
          <pointLight intensity={0.5} position={[0, 25, 0]} decay={2} />
          <pointLight intensity={0.5} position={[0, -25, 0]} decay={2} />
          <OrbitControls
            makeDefault
            enableZoom={true}
            // enablePan on for dev, off for prod
            enablePan={true}
            zoomSpeed={1}
            maxDistance={1000}
            minDistance={50}
          />
          <Environment
            background="only"
            files="src/assets/solar_system/starmap2020dark_6k.hdr"
          />
        </Suspense>
        <EffectComposer>
          <Noise opacity={0.03} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </main>
  )
}
