import { create } from 'zustand'

const stations = [
  { freq: 87.9, name: "Static" },
  { freq: 89.1, name: "BBC Radio 1" },
  { freq: 92.5, name: "Classic Rock" },
  { freq: 95.8, name: "Capital FM" },
  { freq: 98.5, name: "Kiss FM" },
  { freq: 101.9, name: "Smooth Radio" },
  { freq: 104.9, name: "Heart FM" },
  { freq: 107.8, name: "Absolute Radio" },
]

const useRadioStore = create((set, get) => ({
  power: false,
  volume: 70,
  frequency: 98.5,
  currentPreset: null,
  auxMode: false,
  auxUrl: null,
  presets: {},

  togglePower: () => set(state => ({ power: !state.power })),
  setVolume: (v) => set({ volume: v }),
  setFrequency: (f) => set({ frequency: f }),
  setAuxMode: (bool) => set({ auxMode: bool }),
  setAuxAudio: (url) => set({ auxUrl: url }),

  setPreset: (num) => {
    const preset = get().presets[num]
    if (preset) set({ frequency: preset, currentPreset: num })
  },
  savePreset: (num) => set(state => ({
    presets: { ...state.presets, [num]: state.frequency },
    currentPreset: num
  })),
}))

export default useRadioStore
