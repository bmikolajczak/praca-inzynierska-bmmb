import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  Environment,
  ContactShadows,
  Html,
  OrbitControls,
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
    ref.current.rotation.y = Math.sin(t / 2) / 10
    ref.current.rotation.z = Math.sin(t / 2) / 40
  })
  return (
    <group>
      <Suspense fallback={null}>
        <primitive
          object={gltf.scene}
          ref={ref}
          scale={1}
          position={[0, -0.5, 0]}
        />
      </Suspense>
      <Html
        scale={0.2}
        rotation={[0, 0, 0]}
        position={[1.8, 1.5, 0.3]}
        transform
        sprite
        occlude
        onOcclude={setOcclude}
        style={{
          transition: 'all 0.5s',
          opacity: occluded ? 0.2 : 1,
        }}
      >
        <div className={style.infoPanel}>
          <h2>Name</h2>
          <p>
            One of the twin rovers that landed on Mars in January 2004 - Spirit
            and Opportunity. Both rovers lived well beyond their planned 90-day
            missions. Opportunity worked nearly 15 years on Mars and broke the
            driving record for putting the most miles on the odometer. They have
            found geologic evidence that once Mars was wetter, and the
            conditions could have sustained microbial life.
          </p>
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
        <Model model="curiosity.glb" />
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.8}
          enableZoom={true}
          enablePan={false}
          zoomSpeed={1}
          maxDistance={8}
          minDistance={1}
        />
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.75}
          scale={10}
          blur={2.5}
          far={4}
        />
        <Environment preset="warehouse" />
      </Canvas>
    </main>
  )
}
