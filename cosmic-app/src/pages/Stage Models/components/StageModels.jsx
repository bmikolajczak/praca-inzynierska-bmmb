import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  PresentationControls,
  Loader,
  Environment,
  ContactShadows,
  Html,
} from '@react-three/drei'
import style from '../styles/StageModels.module.scss'
import { MathUtils } from 'three'

function Model(props) {
  // HTML Occlude
  const [occluded, setOcclude] = useState()

  // Loading GLTF model
  const modelURL = `/src/assets/stage_models/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = Math.sin(t / 4) / 10
    ref.current.rotation.z = Math.sin(t / 4) / 40
    ref.current.position.y = Math.sin(t / 1.5) / 20
  })
  return (
    <group>
      <Suspense fallback={null}>
        <primitive object={gltf.scene} ref={ref} scale={1} />
      </Suspense>
      <Html scale={.2} rotation={[0, 0, 0]} position={[1,2,0]} transform occlude
      onOcclude={setOcclude}
      style={{
        transition: 'all 0.5s',
        opacity: occluded ? 0.2 : 1,
      }}
      >
          <div className={style.infoPanel}>
            <h2>Text</h2>
            <p>Some very important text here</p>

          </div>
        </Html>
    </group>
  )
}

export default function StageModels(props) {
  return (
    <main className={style.main}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.5, 4], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <PresentationControls
          makeDefault
          zoom={.8}
          global
          config={{ mass: 1, tension: 170, friction: 20 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          // azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <Model model="insight.glb" />
        </PresentationControls>
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.75}
          scale={10}
          blur={2.5}
          far={4}
        />
        <Environment preset="warehouse" />
      </Canvas>
      <Loader />
    </main>
  )
}
