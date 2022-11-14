import { Loader } from "@react-three/drei";

export default function LoaderCustom() {
  return (
    <Loader
    containerStyles={{'background': '#040404'}}
    innerStyles={{'height': '10px', 'borderRadius': '8px'}}
    barStyles={{'height': '10px', 'borderRadius': '8px'}} 
    dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`}
    />
  )
} 