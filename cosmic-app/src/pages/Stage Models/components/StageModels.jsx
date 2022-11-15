import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Environment, ContactShadows, Html, OrbitControls, Loader } from '@react-three/drei'
import style from '../styles/StageModels.module.scss'
import modelsJson from './StageModels.json'
import { AiFillCaretLeft, AiFillCaretRight, AiFillEye, AiFillEyeInvisible, AiOutlinePause } from 'react-icons/ai'
import LoaderCustom from '../../../infrastructure/loader/LoaderCustom'

function Model(props) {
  // HTML Occlude
  const [occluded, setOcclude] = useState()
  let markers = {}

  // Loading GLTF model
  const modelURL = `/src/assets/stage_models/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.z = Math.sin(t / 2) / 50
  })

  // Markers muszą być dodane manualnie w Blenderze w formie Empty
  if (gltf.nodes['Markers']) {
    markers = gltf.nodes['Markers'].children.map((mark) => (
      <Html scale={0.2} transform sprite position={[mark.position.x, mark.position.y - 0.5, mark.position.z]}>
        <p>{mark.userData.name}</p>
      </Html>
    ))
  } else {
    console.log('nie ma markers')
    markers = null
  }

  return (
    <group>
      <primitive object={gltf.scene} ref={ref} scale={0.8} position={[0, -0.5, 0]} />
      <Html
        scale={0.15}
        rotation={[0, 0, 0]}
        position={[1.8, 1.5, 0.3]}
        transform
        sprite
        occlude
        onOcclude={setOcclude}
        style={{
          transition: 'all 0.5s',
          opacity: occluded ? 0.2 : 1,
          display: props.infoVisibility ? 'initial' : 'none',
        }}
      >
        <div className={style.infoPanel}>
          <h2>{props.name}</h2>
          <p>{props.description}</p>
          {/* problem with clickables when set in transform and sprite */}
        </div>
      </Html>
      {markers}
    </group>
  )
}

export default function StageModels(props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [infoVisibility, setInfo] = useState(true)

  function nextModel() {
    if (activeIndex < modelsJson.length - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }
  function prevModel() {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }

  return (
    <main className={style.main}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.5, 4], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <Model
            model={modelsJson[activeIndex].model}
            name={modelsJson[activeIndex].name}
            description={modelsJson[activeIndex].description}
            infoVisibility={infoVisibility}
          />
          <OrbitControls
            makeDefault
            autoRotate={paused ? false : true}
            autoRotateSpeed={0.65}
            enableZoom={true}
            enablePan={false}
            zoomSpeed={1}
            maxDistance={8}
            minDistance={1}
          />
          <ContactShadows position={[0, -0.8, 0]} opacity={0.75} scale={10} blur={2} far={4} />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
      <LoaderCustom />
      <div className={style.galleryButtons}>
        <button onClick={prevModel} style={{ opacity: activeIndex === 0 ? 0.3 : 1 }}>
          <AiFillCaretLeft />
        </button>
        <button onClick={() => setPaused(!paused)} style={{ opacity: paused ? 0.65 : 1 }}>
          <AiOutlinePause />
        </button>
        <button onClick={nextModel} style={{ opacity: activeIndex === modelsJson.length - 1 ? 0.3 : 1 }}>
          <AiFillCaretRight />
        </button>
        <button onClick={() => setInfo(!infoVisibility)}>
          {infoVisibility ? <AiFillEye /> : <AiFillEyeInvisible />}
        </button>
      </div>
      <div
        className={style.linksBar}
        style={{
          visibility: infoVisibility ? 'visible' : 'hidden',
          opacity: infoVisibility ? 1 : 0,
          left: infoVisibility ? 0 : -50,
          transition: 'all 0.5s ease-out',
        }}
      >
        <h3 className={style.linksTopBox}>Links</h3>
        <div className={style.linksCol}>
          {modelsJson[activeIndex].links.map((link) => (
            <a key={link.url} href={link.url} target="_blank">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
