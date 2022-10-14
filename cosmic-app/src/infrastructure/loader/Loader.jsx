import { Html } from '@react-three/drei'
import style from './Loader.module.scss'

// Loading element inside the canvas
export default function Loader(props) {
  return (
    <Html center wrapperClass={style.loading}>
      <h1>{props.title}</h1>
      <div className={style.loadingDots}>
        <span>•</span>
        <span>•</span>
        <span>•</span>
      </div>
    </Html>
  )
}

Loader.defaultProps = {
  title: '3D Scene',
}
