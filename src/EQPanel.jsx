import useRadioStore from './radioStore'

export default function EQPanel() {
  const { volume } = useRadioStore()

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      background: 'rgba(0,0,0,0.8)',
      padding: 20,
      borderRadius: 15,
      color: '#0f0',
      fontFamily: 'monospace',
      border: '1px solid #0f0'
    }}>
      <h3>E Q</h3>
      <label>Bass <input type="range" min="-12" max="12" defaultValue="0" /></label><br/><br/>
      <label>Treble <input type="range" min="-12" max="12" defaultValue="0" /></label><br/><br/>
      <button onClick={() => document.querySelector('canvas').requestPointerLock()}>
        Close
      </button>
    </div>
  </div>
  )
}
