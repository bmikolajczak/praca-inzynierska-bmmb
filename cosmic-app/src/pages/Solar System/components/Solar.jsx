import style from '../styles/Solar.module.scss'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import celestials from './Solar.json'
import {
  OrbitControls,
  Environment,
  GizmoHelper,
  GizmoViewport,
} from '@react-three/drei'
import Loader from '../../../infrastructure/loader/Loader'
import Sun from './SunShader'
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { DoubleSide, MathUtils } from 'three'

function CelestialModel(props) {
  const modelURL = `src/assets/solar_system/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const mesh = useRef()
  const group = useRef()

  // Weird, maybe separate component for camera?
  // If used outside canvas component: Error: R3F hooks can only be used within the Canvas Component
  useThree(({ camera }) => {
    camera.position.set(0, 30, 125)
  })

  useFrame(
    () => (
      (mesh.current.rotation.y += props.spinSpeed),
      (group.current.rotation.y += props.orbitalSpeed * props.orbitalFactor)
    )
  )
  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <primitive
          object={gltf.scene}
          ref={mesh}
          scale={0.5}
          position={props.position}
          onClick={() => console.log('hi')}
        />
      </Suspense>
    </group>
  )
}
function OrbitRing(props) {
  return (
    <mesh rotation={[MathUtils.degToRad(90), 0, 0]} position={[0, 0, 0]}>
      <ringBufferGeometry args={[props.innerRadius, props.outerRadius, 180]} />
      <meshBasicMaterial color="white" side={DoubleSide} transparent={true} opacity={0.2} />
    </mesh>
  )
}

export default function Solar() {
  const celestialBodies = celestials.map((celes) => [
    <OrbitRing
      key={'Orbit' + celes.name}
      innerRadius={celes.position[0] - 0.05}
      outerRadius={celes.position[0] + 0.05}
    />,
    <CelestialModel
      model={celes.model}
      position={celes.position}
      key={celes.name}
      spinSpeed={celes.spinSpeed}
      orbitalSpeed={celes.orbitalSpeed}
      orbitalFactor={0.5}
    />,
  ])
  return (
    <main className={style.solar}>
      <Canvas camera={{ far: 2000 }}>
        <Suspense fallback={<Loader title="Simplified Solar System"/>}>
          <Sun />
          {celestialBodies}
          <pointLight
            color={'white'}
            intensity={0.8}
            position={[0, 0, 0]}
            decay={2}
          />
          <pointLight
            color={'white'}
            intensity={0.5}
            position={[0, 25, 0]}
            decay={2}
          />
          <pointLight
            color={'white'}
            intensity={0.5}
            position={[0, -25, 0]}
            decay={2}
          />
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
        {/* For dev, axis snap and reference */}
        {/* <GizmoHelper
            alignment="bottom-right" // widget alignment within scene
            margin={[80, 80]} // widget margins (X, Y)
            renderPriority={1}
          >
            <GizmoViewport
              axisColors={['red', 'green', 'blue']}
              labelColor="black"
            />
          </GizmoHelper> */}
      </Canvas>
    </main>
  )
}
