import style from '../styles/Mars.module.scss'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Generalize component, use props
// angle rotation on camera
// Orbit controls
function VallesMarineris() {
  const gltf = useLoader(GLTFLoader, '/src/assets/mars/OlympusMons.glb')
  const ref = useRef()
  useFrame(
    () => ((ref.current.rotation.x += 0.0), (ref.current.rotation.y += 0.0005))
  )
  return (
    <Suspense fallback={<span className={style.loading}>Loading...</span>}>
      <ambientLight intensity={0.2} />
      <pointLight color="white" position={[4, 5, 1]} />
      <primitive
        object={gltf.scene}
        ref={ref}
        scale={1}
        position={[0, -5, -15]}
      />
    </Suspense>
  )
}
// Landscapes
function Landscapes() {
  return (
    <section className={style.landscapes}>
      <h2>Landscapes</h2>
      <ul className={style.landscapeList}>
        {/* Generalize list items, use components, data in json */}
        <li>
          <h3>Olympus Mons</h3>
          <div className={style.landscapeElem}>
            <p>
              Olympus Mons is the most extreme volcano in the solar system.
              Located in the Tharsis volcanic region. Its height of 16 miles (25
              kilometers) makes it nearly three times the height of Earth's
              Mount Everest, which is about 5.5 miles (8.9 km) high.
              <br />
              <br />
              Olympus Mons is a gigantic shield volcano, which was formed after
              lava slowly crawled down its slopes. This means that the mountain
              is probably easy for future explorers to climb, as its average
              slope is only 5 percent. At its summit is a spectacular depression
              some 53 miles (85 km) wide, formed by magma chambers that lost
              lava (likely during an eruption) and collapsed.
            </p>
            <div className={style.landscapeCanvas}></div>
          </div>
        </li>
        <li>
          <h3>Tharsis volcanoes</h3>
          <div className={style.landscapeElem}>
            <p>
              With Olympus Mons as its' most impressive feature there are also
              more volcanoes in the area. Tharsis hosts 12 gigantic volcanoes in
              a zone roughly 2500 miles (4000 km) wide. Like Olympus Mons, these
              volcanoes tend to be much larger than those on Earth, presumably
              because Mars has a weaker gravitational pull that allows the
              volcanoes to grow taller. These volcanoes may have erupted for as
              long as two billion years, or half of the history of Mars.
            </p>
          </div>
        </li>
        <li>
          <h3>Valles Marineris</h3>
          <div className={style.landscapeElem}>
            <p>
              Mars not only hosts the largest volcano of the solar system, but
              also the largest canyon. Valles Marineris is roughly 1850 miles
              (3000 km) long. That's about four times longer than the Grand
              Canyon, which has a length of about 500 miles (800 km).
              <br />
              <br />
              Researchers aren't sure how Valles Marineris came to be, but there
              are several theories about its formation. Many scientists suggest
              that when the Tharsis region was formed, it contributed to the
              growth of Valles Marineris. Lava moving through the volcanic
              region pushed the crust upward, which broke the crust into
              fractures in other regions. Over time, these fractures grew into
              Valles Marineris.
            </p>
            <div className={style.landscapeCanvas}>
              <Canvas>
                <VallesMarineris />
              </Canvas>
            </div>
          </div>
        </li>
        <li>
          <h3>Gale Crater and Mount Sharp (Aeolis Mons)</h3>
          <div className={style.landscapeElem}>
            <p>
              Made famous by the landing of the Curiosity rover in 2012, Gale
              Crater is host to extensive evidence of past water. Curiosity
              stumbled upon a streambed within weeks of landing, and found more
              extensive evidence of water throughout its journey along the
              crater floor. Curiosity is now summiting a nearby volcano called
              Mount Sharp (Aeolis Mons) and looking at the geological features
              in each of its strata.
              <br />
              <br />
              One of Curiosity's more exciting finds was discovering complex
              organic molecules in the region, on multiple occasions. Results
              from 2018 announced these organics were discovered inside of
              3.5-billion-year-old rocks. Simultaneous to the organics results,
              researchers announced the rover also found methane concentrations
              in the atmosphere change over the seasons. Methane is an element
              that can be produced by microbes, as well as geological phenomena,
              so it's unclear if that's a sign of life.
            </p>
          </div>
        </li>
        <li>
          <h3>Medusae Fossae</h3>
          <div className={style.landscapeElem}>
            <p>
              Medusae Fossae is one of the weirdest locations on Mars. Possible
              explanation for its interesting shape is that it is a huge
              volcanic deposit, some one-fifth of the size of the United States.
              Over time, winds sculpted the rocks into some beautiful
              formations.But researchers will need more study to learn how these
              volcanoes formed Medusae Fossae. A 2018 study suggested that the
              formation may have formed from immensely huge volcanic eruptions
              taking place hundreds of times over 500 million years. These
              eruptions would have warmed the Red Planet's climate as greenhouse
              gases from the volcanoes drifted into the atmosphere.
            </p>
          </div>
        </li>
        <li>
          <h3>Hale Crater</h3>
          <div className={style.landscapeElem}>
            <p>
              Mars is host to strange features called recurring slope lineae
              (RSL), which tend to form on the sides of steep craters during
              warm weather. It's hard to figure out what these RSL are, though.
              Pictures from Hale Crater and some other locations show spots
              where spectroscopy picked up signs of hydration. The RSL could be
              also formed from atmospheric water or dry flows of sand. It may
              also host alien microbes so future explorers will need to be very
              cautious in case of contamination.
            </p>
          </div>
        </li>
        <li>
          <h3>Noctis Labyrinthus and Hellas basin</h3>
          <div className={style.landscapeElem}>
            <p>
              Mars is a planet mostly shaped by wind these days, since the water
              evaporated as its atmosphere thinned. But we can see extensive
              evidence of past water, such as regions of "ghost dunes" found in
              Noctis Labyrinthus and Hellas basin. Researchers say these regions
              used to hold dunes that were tens of meters tall. Later, the dunes
              were flooded by lava or water, which preserved their bases while
              the tops eroded away.
              <br />
              <br />
              Old dunes such as these show how winds used to flow on ancient
              Mars, which in turn gives climatologists some hints as to the
              ancient environment of the Red Planet. In an even more exciting
              twist, there could be microbes hiding in the sheltered areas of
              these dunes, safe from the radiation and wind that would otherwise
              sweep them away.
            </p>
          </div>
        </li>
      </ul>
    </section>
  )
}
// Imported 3D Globe model
function MarsGlobe() {
  const gltf = useLoader(GLTFLoader, '/src/assets/mars/MarsGlobe.glb')
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.0002))
  return (
    <Suspense fallback={null}>
      <primitive
        object={gltf.scene}
        ref={ref}
        scale={2.2}
        position={[-1, 0, -1]}
      />
    </Suspense>
  )
}

// Mars Page
function Mars() {
  return (
    <main className={style.main}>
      <Suspense fallback={<span className={style.loading}>Loading...</span>}>
        <section className={style.overviewContainer}>
          <div className={style.canvasContainer}>
            <Canvas camera={{ fov: 45 }}>
              <ambientLight intensity={0.2} />
              <pointLight color="white" position={[0, 0, 5]} />
              <MarsGlobe />
            </Canvas>
          </div>
          <div className={style.overviewInfo}>
            <h1 className={style.heading}>Mars - the Red Planet</h1>
            <p>
              The fourth planet from the Sun, Mars is one of Earth's two closest
              planetary neighbors.
              <br />
              <br /> A dusty, cold, desert world with a very thin atmosphere.
              Mars is also a dynamic planet with seasons, polar ice caps,
              canyons, extinct volcanoes, and evidence that it was even more
              active in the past.
            </p>
          </div>
        </section>
      </Suspense>
      <Landscapes />
    </main>
  )
}
export default Mars
