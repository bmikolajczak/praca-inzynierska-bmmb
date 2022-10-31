import style from '../styles/Landscapes.module.scss'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from '@react-three/drei'
// Data could be stored in the database
import landscapes from './Landscapes.json'
import { useState } from 'react'

function LandModel(props) {
  let visibility = false
  if (props.activeIndex === props.objectIndex) {
    visibility = true
  }

  useThree(({ camera }) => {
    camera.position.set(0, 20, 30)
  })

  // Loading GLTF model
  const modelURL = `/src/assets/mars/marsLandscapes/${props.model}`
  const gltf = useLoader(GLTFLoader, modelURL)
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.0008))

  // Changing gltf mesh color
  gltf.scene.traverse((object) => {
    if (object.isMesh) {
      object.material.color.set(0xffaa80)
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
          <Canvas camera={{ fov: 60 }}>
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
          <button onClick={prevLand}>&#9664;</button>
          <button onClick={nextLand}>&#9654;</button>
        </div>
    </section>
  )
}

// export default function Landscapes() {
//   const landItems = landscapes.map((land, index) => (
//     <li key={land.title}>
//       <div className={style.landscapeElem}>
//         <div className={style.landscapeCanvas}>
//           {/* changing fov on the Canvas element */}
//           <Canvas camera={{ fov: 50 }}>
//             <LandModel model={land.model} />
//             <ambientLight intensity={0.2} />
//             <directionalLight
//               color="white"
//               position={[5, 5, 5]}
//               intensity={1}
//             />
//             <OrbitControls
//               makeDefault
//               enableZoom={true}
//               enablePan={false}
//               zoomSpeed={0.7}
//             />
//           </Canvas>
//         </div>
//         <div className={style.landscapeInfo}>
//           <h3>{land.title}</h3>
//           <p>{land.description}</p>
//           <p>{index}</p>
//         </div>
//       </div>
//     </li>
//   ))
//   return (
//     <section className={style.landscapes}>
//       <h2>Landscapes</h2>
//       <ul className={style.landscapeList}>{landItems}</ul>
//     </section>
//   )
// }
