import style from '../styles/Solar.module.scss'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import celestials from './Solar.json'
import { OrbitControls, Environment } from '@react-three/drei'
import Loader from '../../../infrastructure/loader/Loader'
import Sun from './SunShader'
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { DoubleSide, MathUtils, Vector3 } from 'three'

const addendVector = new Vector3()

let currentObject = ''
function setCurrentObject(name) {
  currentObject = name
}

function Camera(props) {
  useThree(({ camera }) => {
    camera.position.set(0, 30, 125)
  })
}

function CelestialModel(props) {
  const modelURL = `src/assets/solar_system/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const mesh = useRef()
  const group = useRef()
  const controls = useThree((state) => state.controls)

  useFrame(() => {
    mesh.current.rotation.y += props.spinSpeed
    group.current.rotation.y += props.orbitalSpeed * props.orbitalFactor
    if (currentObject === props.name) {
      mesh.current.getWorldPosition(controls.target)
      controls.update()
    }
  })

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <primitive
          object={gltf.scene}
          ref={mesh}
          scale={0.5}
          position={props.position}
          onClick={() => {
            // Snap Camera to the mesh
            // copy mesh current absolute position into orbitControls position
            mesh.current.getWorldPosition(controls.object.position)
            addendVector.set(props.radius * 3, props.radius, props.radius * 3)
            controls.object.position.add(addendVector)
            console.log(addendVector)
            console.log(controls.object.position)
            // update called after on click
            // controls.update() // no need
            setCurrentObject(props.name)
          }}
        />
      </Suspense>
    </group>
  )
}
function OrbitRing(props) {
  return (
    <mesh rotation={[MathUtils.degToRad(90), 0, 0]} position={[0, 0, 0]}>
      <ringBufferGeometry args={[props.innerRadius, props.outerRadius, 180]} />
      <meshBasicMaterial
        color="white"
        side={DoubleSide}
        transparent={true}
        opacity={0.2}
      />
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
      name={celes.name}
      key={celes.name}
      spinSpeed={celes.spinSpeed}
      orbitalSpeed={celes.orbitalSpeed}
      orbitalFactor={0.5}
      radius={celes.radius}
    />,
  ])
  return (
    <main className={style.solar}>
      <Canvas camera={{ far: 2000 }}>
        <Camera />
        <Suspense fallback={<Loader title="Simplified Solar System" />}>
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
            enablePan={false}
            zoomSpeed={1.2}
            maxDistance={1000}
          />
          <Environment
            background="only"
            files="src/assets/solar_system/starmap2020dark_6k.hdr"
          />
        </Suspense>
        <EffectComposer>
          <Noise opacity={0.026} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </main>
  )
}
