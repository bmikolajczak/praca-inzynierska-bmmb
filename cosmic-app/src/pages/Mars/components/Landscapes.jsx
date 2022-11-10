import style from '../styles/Landscapes.module.scss'
import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from '@react-three/drei'
import landscapes from './Landscapes.json'
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'

function LandModel(props) {
  let visibility = false
  if (props.activeIndex === props.objectIndex) {
    visibility = true
  }

  // Loading GLTF model
  const modelURL = `/src/assets/mars/marsLandscapes/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.0008))

  // Changing gltf mesh color
  gltf.scene.traverse((object) => {
    if (object.isMesh) {
      object.material.color.set(0xf7a07b)
      object.material.metalness = 0 // needs to be 0 in order for ambient lighting to work
    }
  })
  return (
    <Suspense fallback={null}>
      <primitive visible={visibility} object={gltf.scene} ref={ref} scale={1} />
    </Suspense>
  )
}

function LandInfo(props) {
  let visibility = false
  if (props.activeIndex === props.objectIndex) {
    visibility = true
  }

  return (
    <div className={visibility ? style.show : style.hide}>
      <h3>{props.land.title}</h3>
      <p>{props.land.description}</p>
      <p>{props.index}</p>
    </div>
  )
}

export default function Landscapes() {
  const [activeIndex, setActiveIndex] = useState(0)

  function nextLand() {
    if (activeIndex < landscapes.length - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }
  function prevLand() {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }

  const lands = landscapes.map((land, index) => (
    <LandModel
      model={land.model}
      activeIndex={activeIndex}
      objectIndex={index}
      key={land.model}
    />
  ))
  const landsInfo = landscapes.map((land, index) => (
    <LandInfo land={land} activeIndex={activeIndex} objectIndex={index} key={'Info-'+land.model} />
  ))
  return (
    <section className={style.landscapes}>
      <h2>Landscapes</h2>
      <div className={style.landElement}>
        <div className={style.canvas}>
          <Canvas camera={{ fov: 60, position: [0, 20, 30] }}>
            {lands}
            <ambientLight intensity={0.2} />
            <directionalLight
              color="white"
              position={[5, 5, 5]}
              intensity={1}
            />
            <OrbitControls
              makeDefault
              enableZoom={true}
              enablePan={false}
              zoomSpeed={0.7}
            />
          </Canvas>
        </div>
        <div className={style.landInfo}>{landsInfo}</div>
      </div>
        <div className={style.landButtons}>
          <button onClick={prevLand}><AiFillCaretLeft/></button>
          <button onClick={nextLand}><AiFillCaretRight/></button>
        </div>
    </section>
  )
}
