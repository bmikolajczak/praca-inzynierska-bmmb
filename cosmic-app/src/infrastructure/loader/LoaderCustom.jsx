import { Loader } from "@react-three/drei";

export default function LoaderCustom() {
  return (
    <Loader
    containerStyles={{'background': '#040404'}}
    innerStyles={{'height': '12px', 'borderRadius': '8px'}}
    barStyles={{'height': '12px', 'borderRadius': '8px'}}
    dataStyles={{'fontSize': '12px'}}
    dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`}
    />
  )
} 