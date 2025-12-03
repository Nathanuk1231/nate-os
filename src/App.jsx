import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF, Html } from '@react-three/drei'
import { useRadioStore from './radioStore'
import Radio from './Radio'
import EQPanel from './EQPanel'
import './index.css'

export default function App() {
  const { power, auxMode } = useRadioStore()

  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 9], fov: 45 }}>
        <Stage intensity={0.5} environment="city" shadows={false}>
          <Radio />
        </Stage>
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          maxDistance={15}
          minDistance={5}
        />
      </Canvas>

      {power && <EQPanel />}
      
      {auxMode && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#0f0',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px 20px',
          borderRadius: 10,
          fontFamily: 'monospace'
        }}>
          AUX MODE • Drop audio file anywhere
        </div>
      )}
    </>
  )
}
