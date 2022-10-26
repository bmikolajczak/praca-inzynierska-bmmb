import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const fragmentShader = `
uniform float time;

uniform sampler2D texture1;
uniform sampler2D texture2;

varying vec2 vUv;

void main( void ) {

  vec2 position = - 1.0 + 2.0 * vUv;

  vec4 noise = texture2D( texture1, vUv );
  vec2 T1 = vUv + vec2( 1.2, - 1.0 ) * time * 0.02;
  vec2 T2 = vUv + vec2( - 1.2 , 0 ) * time * 0.01;

  T1.x += noise.x * 2.0;
  T1.y += noise.y * 2.0;
  T2.x -= noise.y * 0.2;
  T2.y += noise.z * 0.2;

  float p = texture2D( texture1, T1 * 2.0 ).a;

  vec4 color = texture2D( texture2, T2 * 2.0 );
  vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

  if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
  if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
  if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }

  gl_FragColor = temp;

  float depth = gl_FragCoord.z / gl_FragCoord.w;
  const float LOG2 = 1.442695;

}

`
const vertexShader = `
uniform vec2 uvScale;
varying vec2 vUv;

void main()
{

  vUv = uvScale * uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;

}
`

export default function Sun() {
  const mesh = useRef()
  const textureLoader = new THREE.TextureLoader();
  const clock = new THREE.Clock()

  const uniforms = {
    time: { value: 1.0 },
    uvScale: { value: new THREE.Vector2(3.0, 1.5) },
    texture1: {
      value: textureLoader.load('src/assets/solar_system/textures/cloud.png'),
    },
    texture2: {
      value: textureLoader.load(
        'src/assets/solar_system/textures/lavatile.jpg'
      ),
    },
  }

  uniforms['texture1'].value.wrapS = uniforms['texture1'].value.wrapT =
    THREE.RepeatWrapping
  uniforms['texture2'].value.wrapS = uniforms['texture2'].value.wrapT =
    THREE.RepeatWrapping

  useFrame(() => {
    const delta = 5 * clock.getDelta()
    mesh.current.material.uniforms.time.value += 0.2 * delta
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={1}>
      <sphereGeometry args={[27.4, 64, 32]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  )
}
