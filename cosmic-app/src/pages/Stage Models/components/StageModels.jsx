import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Environment, ContactShadows, Html, OrbitControls, Loader } from '@react-three/drei'
import style from '../styles/StageModels.module.scss'
import modelsJson from './StageModels.json'
import { AiFillCaretLeft, AiFillCaretRight, AiFillEye, AiFillEyeInvisible, AiOutlinePause, AiOutlineMenu } from 'react-icons/ai'
import LoaderCustom from '../../../infrastructure/loader/LoaderCustom'

function Model(props) {
  // HTML Occlude
  const [occluded, setOcclude] = useState()
  const [activeMarker, setActiveMarker] = useState('')
  let markers = {}

  // Loading GLTF model
  const modelURL = `/src/assets/stage_models/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)

  function clickMarker(markerName) {
    if (markerName === activeMarker) {
      setActiveMarker('')
    }
    else {
      setActiveMarker(markerName)
    }
  }
  // Markers muszą być dodane manualnie w Blenderze w formie Empties
  if (gltf.nodes['Markers']) {
    markers = gltf.nodes['Markers'].children.map((mark) => (
      <Html
        key={mark.userData.name}
        position={[mark.position.x, mark.position.y, mark.position.z]}
        style={{
          display: props.infoVisibility ? 'initial' : 'none',
        }}
        wrapperClass={style.markersHTML}
        zIndexRange={[2, 0]}
      >
        <div className={style.markerContainer}>
          <div className={style.circleIcon} onClick={() => clickMarker(mark.userData.name)}>&nbsp;</div>
          {activeMarker === mark.userData.name &&
            <p className={style.markerName}>{mark.userData.name}</p>
          }
        </div>
      </Html>
    ))
  } else { // Kiedy nie zostaną dodane markery w Blenderze lub mają błędną nazwę
    markers = null
  }

  return (
    // zwracany jest model z markerami oraz info panelem
    <group>
      <primitive object={gltf.scene} scale={1} position={[0, 0, 0]} />
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
        wrapperClass={style.infoHTML}
        zIndexRange={[5, 0]}
      >
        <div className={style.infoPanel}>
          <h2>{props.name}</h2>
          <p>{props.description}</p>
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
  const [linksVisibility, setLinks] = useState(true)

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
      <section>
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
      </section>
      <section className={style.links}>
        <div
          className={style.linksBar}
          style={{
            visibility: linksVisibility ? 'visible' : 'hidden',
            opacity: linksVisibility ? 1 : 0,
            transform: linksVisibility ? 'translateX(0px)' : 'translateX(-50px)',
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
        <button className={style.toggle} onClick={() => setLinks(!linksVisibility)}><AiOutlineMenu /></button>
      </section>
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
          <ContactShadows position={[0, -0.98, 0]} opacity={0.75} scale={10} blur={2} far={4} />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
      <LoaderCustom />
    </main>
  )
}
