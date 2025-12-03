import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useRadioStore from './radioStore'
import { createFMRadio } from './fmEngine'

export default function Radio() {
  const { nodes, materials, scene } = useGLTF('/car_radio.glb')
  const volumeKnob = useRef()
  const tuningKnob = useRef()
  const powerButton = useRef()
  const screen = useRef()

  const {
    power, volume, frequency, setVolume, setFrequency, togglePower,
    setPreset, currentPreset, auxMode, setAuxMode, playAuxAudio
  } = useRadioStore()

  const fm = useRef(null)

  useEffect(() => {
    fm.current = createFMRadio()
    return () => fm.current?.dispose()
  }, [])

  // Power glow
  useEffect(() => {
    scene.traverse((child) => {
      if (child.material && child.material.emissive) {
        child.material.emissiveIntensity = power ? 1.5 : 0
        child.material.emissive = power ? new THREE.Color(1, 0.4, 0.1) : new THREE.Color(0,0,0)
      }
    })
  }, [power, scene])

  // Volume knob rotation
  useFrame(() => {
    if (volumeKnob.current) {
      volumeKnob.current.rotation.y = (volume / 100) * Math.PI * 4 - Math.PI * 2
    }
    if (tuningKnob.current) {
      const normalized = (frequency - 87.5) / (108 - 87.5)
      tuningKnob.current.rotation.y = normalized * Math.PI * 5 - Math.PI * 2.5
    }
  })

  const handleVolumeDrag = (e) => {
    const delta = e.delta[0] || e.movement[0] || 0
    setVolume(Math.max(0, Math.min(100, volume + delta / 5)))
  }

  const handleTuningDrag = (e) => {
    const delta = e.delta[0] || e.movement[0] || 0
    const newFreq = frequency + delta / 30
    setFrequency(Math.max(87.5, Math.min(108, newFreq)))
  }

  useEffect(() => {
    if (fm.current) fm.current.setFrequency(frequency, volume / 100, power && !auxMode)
  }, [frequency, volume, power, auxMode])

  // AUX file drop
  useEffect(() => {
    const drop = (e) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file)
        setAuxMode(true)
        setAuxAudio(url)
        fm.current?.playAux(url, volume / 100)
      }
    }
    const dragover = (e) => e.preventDefault()
    window.addEventListener('drop', drop)
    window.addEventListener('dragover', dragover)
    return () => {
      window.removeEventListener('drop', drop)
      window.removeEventListener('dragover', dragover)
    }
  }, [volume])

  return (
    <group dispose={null}>
      <primitive object={scene} scale={2.5} />

      {/* Invisible draggable knobs */}
      <group ref={volumeKnob} position={[0.8, 0.3, 0.8]}>
        <mesh onPointerMove={handleVolumeDrag}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      <group ref={tuningKnob} position={[-0.8, 0.3, 0.8]}>
        <mesh onPointerMove={handleTuningDrag}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      {/* Power button */}
      <mesh ref={powerButton} position={[0, -0.4, 0.9]} onClick={togglePower}>
        <boxGeometry args={[0.6, 0.3, 0.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Screen overlay screen */}
      {power && (
        <Html position={[0, 0.4, 0.7]} transform distanceFactor={3}>
          <div style={{
            background: 'rgba(0,20,0,0.8)',
            color: '#0f0',
            padding: '15px 30px',
            borderRadius: 10,
            fontFamily: 'monospace',
            fontSize: 24,
            textAlign: 'center',
            minWidth: 300,
            border: '2px solid #0f0',
            textShadow: '0 0 10px #0f0'
          }}>
            {auxMode ? 'AUX MODE' : `${frequency.toFixed(1)} MHz`}
            <br />
            <small>{auxMode ? 'Local File' : fm.current?.currentStation?.name || 'Tuning...'}</small>
          </div>
        </Html>
      )}

      {/* Preset buttons 1–6 */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[-1.4 + i * 0.5, -0.1, 0.9]}
          onClick={() => setPreset(i + 1)}
          onContextMenu={(e) => { e.stopPropagation(); useRadioStore.getState().savePreset(i + 1) }}
        >
          <boxGeometry args={[0.35, 0.35, 0.15]} />
          <meshBasicMaterial transparent opacity={0} />
          {power && (
            <Html transform>
              <div style={{ color: currentPreset === i+1 ? '#ff0' : '#0f0', fontWeight: 'bold' }}>
                {i+1}
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </group>
  )
}

useGLTF.preload('/car_radio.glb')
