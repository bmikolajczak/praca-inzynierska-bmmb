import style from '../styles/Solar.module.scss'
import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import celestials from './Solar.json'
import solarInfo from './SolarInfo.json'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import Loading from '../../../infrastructure/loader/Loader'
import Sun from './SunShader'
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { DoubleSide, MathUtils, Vector3 } from 'three'

const addendVector = new Vector3()

// Default camera position
function Camera(props) {
  useThree(({ camera }) => {
    camera.position.set(-110, 30, 110)
  })
}

function CelestialModel(props) {
  const modelURL = `src/assets/solar_system/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const mesh = useRef()
  const group = useRef()
  const controls = useThree((state) => state.controls)

  useFrame(() => {
    // rotate around local Y axis
    mesh.current.rotateY(props.spinSpeed)
    // orbit group
    group.current.rotateY(props.orbitalSpeed * props.orbitalFactor)
    // onClick currentObject switching
    if (props.currentTarget === props.name) {
      mesh.current.getWorldPosition(controls.target)
      controls.update()
    }
  })

  function snapCamera() {
    // Snap Camera to the mesh
    // copy mesh current absolute position into orbitControls position
    mesh.current.getWorldPosition(controls.object.position)
    addendVector.set(
      props.radius,
      props.radius,
      props.radius + props.radius * 1.5
    )
    controls.object.position.add(addendVector)
    // controls.update() // update called after on click - no need
  }

  return (
    <group ref={group} rotation={[0, 0, MathUtils.degToRad(props.orbitTilt)]}>
      <primitive
        object={gltf.scene}
        ref={mesh}
        scale={0.5}
        position={props.position}
        rotation={[0, 0, MathUtils.degToRad(props.tilt)]}
      >
        <Html zIndexRange={[10, 0]} wrapperClass={style.planetName}>
          <button
            type="button"
            onClick={() => {
              props.handleClick(props.name)
              // props call useState to parent and it causes weird glitching to camera but with setTimeout it works great idk
              setTimeout(() => snapCamera(), 1)
            }}
          >
            {props.name}
          </button>
        </Html>
      </primitive>
    </group>
  )
}
function OrbitRing(props) {
  return (
    <mesh
      rotation={[
        MathUtils.degToRad(90),
        MathUtils.degToRad(props.orbitTilt),
        0,
      ]}
      position={[0, 0, 0]}
    >
      <ringBufferGeometry args={[props.innerRadius, props.outerRadius, 220]} />
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
  const [selectedPlanet, setPlanet] = useState('')
  // preparing every planet with orbits
  const celestialBodies = celestials.map((celes) => [
    <OrbitRing
      key={'Orbit' + celes.name}
      innerRadius={celes.position[0] - 0.04}
      outerRadius={celes.position[0] + 0.04}
      orbitTilt={celes.orbitTilt}
    />,
    <CelestialModel
      model={celes.model}
      position={celes.position}
      name={celes.name}
      key={celes.name}
      spinSpeed={celes.spinSpeed}
      orbitalSpeed={celes.orbitalSpeed}
      orbitalFactor={0.1}
      radius={celes.radius}
      tilt={celes.tilt}
      orbitTilt={celes.orbitTilt}
      handleClick={setPlanet}
      currentTarget={selectedPlanet}
    />,
  ])

  // planets on click info panel
  const planetInfo = solarInfo.map(
    (planet) =>
      selectedPlanet === planet.name && (
        <div className={style.planetInfo} key={planet.name}>
          <h2>{planet.name}</h2>
          <p>{planet.description}</p>
          <div className={style.planetInfoLinks}>
            <a href={planet.links[0].url} target="_blank">
              {planet.links[0].label}
            </a>
            {planet.links.length > 1 && (
              <a href={planet.links[1].url}>{planet.links[1].label}</a>
            )}
          </div>
        </div>
      )
  )

  return (
    <main className={style.solar}>
      <section>{planetInfo}</section>
      <Canvas camera={{ far: 4000 }}>
        <Camera />
        <Suspense fallback={<Loading title="Simplified Solar System" />}>
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
            enablePan={false}
            zoomSpeed={1.2}
            maxDistance={2000}
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
