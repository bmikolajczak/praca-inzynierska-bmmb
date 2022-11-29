import style from '../styles/Solar.module.scss'
import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import celestials from './Solar.json'
import solarInfo from './SolarInfo.json'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import Sun from './SunShader'
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { DoubleSide, MathUtils, Vector3 } from 'three'
import LoaderCustom from '../../../infrastructure/loader/LoaderCustom'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { AiOutlineMenu, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

// Globally declared for use later
const addendVector = new Vector3()

function CelestialModel(props) {
  const modelURL = `src/assets/solar_system/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const mesh = useRef()
  const group = useRef()
  const controls = useThree((state) => state.controls)

  // run only once, on mount, thanks to empty []
  useEffect(() => {
    group.current.rotateY(randomRotationOnOrbit())
  }, [])

  useFrame((state, delta) => {
    // rotate around local Y axis
    mesh.current.rotateY(props.spinSpeed * props.spinFactor * delta)
    // orbit group
    group.current.rotateY(props.orbitalSpeed * props.orbitalFactor * delta)
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
    addendVector.set(props.radius + props.radius * 0.5, props.radius * 0.5, props.radius + props.radius * 0.5)
    controls.object.position.add(addendVector)
    controls.update()
  }

  function randomRotationOnOrbit() {
    return MathUtils.degToRad(Math.floor(Math.random() * 360 - 179))
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
            style={{
              visibility: props.planetLabelVis ? 'visible' : 'hidden',
            }}
            onClick={() => {
              document.querySelector('canvas').classList.add(style.animateSnapCamera)
              setTimeout(() => {
                document.querySelector('canvas').classList.remove(style.animateSnapCamera)
              }, 1500)
              props.handleClick(props.name)
              snapCamera()
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
    <mesh rotation={[MathUtils.degToRad(90), MathUtils.degToRad(props.orbitTilt), 0]} position={[0, 0, 0]}>
      <ringBufferGeometry args={[props.innerRadius, props.outerRadius, 220]} />
      <meshBasicMaterial color="white" side={DoubleSide} transparent={true} opacity={props.planetLabelVis ? 0.2 : 0} />
    </mesh>
  )
}

export default function Solar() {
  const [selectedPlanet, setPlanet] = useState('')
  const [selectedOrbitFactor, setOrbitFactor] = useState(0.2)
  const [selectedSpinFactor, setSpinFactor] = useState(1)
  const [planetInfoVis, setPlanetInfoVis] = useState(true)
  const [planetLabelVis, setPlanetLabelVis] = useState(true)

  // preparing every planet with orbits
  const celestialBodies = celestials.map((celes) => [
    <OrbitRing
      key={'Orbit' + celes.name}
      innerRadius={celes.position[0] - 0.04}
      outerRadius={celes.position[0] + 0.04}
      orbitTilt={celes.orbitTilt}
      planetLabelVis={planetLabelVis}
    />,
    <CelestialModel
      model={celes.model}
      position={celes.position}
      name={celes.name}
      key={celes.name}
      spinSpeed={celes.spinSpeed}
      orbitalSpeed={celes.orbitalSpeed}
      orbitalFactor={selectedOrbitFactor}
      spinFactor={selectedSpinFactor}
      radius={celes.radius}
      tilt={celes.tilt}
      orbitTilt={celes.orbitTilt}
      handleClick={setPlanet}
      currentTarget={selectedPlanet}
      planetLabelVis={planetLabelVis}
    />,
  ])

  // planets on click info panel
  const planetInfo = solarInfo.map(
    (planet) =>
      selectedPlanet === planet.name && (
        <div
          className={style.planetInfo}
          key={planet.name}
          style={{
            visibility: planetInfoVis ? 'visible' : 'hidden',
            opacity: planetInfoVis ? 1 : 0,
            zIndex: planetInfoVis ? 15 : -1,
            transition: 'all 0.5s ease-out',
          }}
        >
          <h2>{planet.name}</h2>
          <p>{planet.description}</p>
          <div className={style.planetInfoLinks}>
            <a href={planet.links[0].url} target="_blank">
              {planet.links[0].label}
            </a>
            {planet.links.length > 1 && <Link to={planet.links[1].url}>{planet.links[1].label}</Link>}
          </div>
        </div>
      )
  )

  return (
    <main className={style.solar}>
      <section className={style.menu}>
        <div className={style.speedControl}>
          <button
            onClick={() => {
              setOrbitFactor(0.01)
              setSpinFactor(0.1)
            }}
          >
            0.05x
          </button>
          <button
            onClick={() => {
              setOrbitFactor(0.1)
              setSpinFactor(0.5)
            }}
          >
            0.5x
          </button>
          <button
            onClick={() => {
              setOrbitFactor(0.2)
              setSpinFactor(1)
            }}
          >
            1x
          </button>
          <button
            onClick={() => {
              setOrbitFactor(0.4)
              setSpinFactor(2)
            }}
          >
            2x
          </button>
          <button
            onClick={() => {
              setOrbitFactor(1)
              setSpinFactor(5)
            }}
          >
            5x
          </button>
        </div>
        <div>
          <button
            title="Toggle planet info"
            onClick={() => setPlanetInfoVis(!planetInfoVis)}
            style={{ backgroundColor: planetInfoVis ? '#242424' : '#cf1130' }}
          >
            <AiOutlineMenu />
          </button>
          <button
            title="Toggle 3D augmentations"
            onClick={() => setPlanetLabelVis(!planetLabelVis)}
            style={{ backgroundColor: planetLabelVis ? '#242424' : '#cf1130' }}
          >
            3D
          </button>
        </div>
      </section>
      <section>{planetInfo}</section>
      {/* dpr: Pixel-ratio, use window.devicePixelRatio, or automatic: [min, max] */}
      <Canvas camera={{ far: 4000, position: [-110, 30, 110] }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Sun />
          {celestialBodies}
          <pointLight color={'white'} intensity={0.8} position={[0, 0, 0]} decay={2} />
          <pointLight color={'white'} intensity={0.5} position={[0, 25, 0]} decay={2} />
          <pointLight color={'white'} intensity={0.5} position={[0, -25, 0]} decay={2} />
          <OrbitControls
            makeDefault
            enableZoom={true}
            enablePan={false}
            zoomSpeed={1.2}
            maxDistance={4000}
            minDistance={0.3}
          />
          <Environment background="only" files="src/assets/solar_system/starmap2020dark_6k.hdr" />
        </Suspense>
        <EffectComposer>
          <Noise opacity={0.026} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
      <LoaderCustom />
    </main>
  )
}
