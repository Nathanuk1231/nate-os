import * as Tone from 'tone'

const STREAMS = {
  89.1: "https://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p",
  92.5: "https://stream.zeno.fm/8x7q3k7q7vzuv",
  95.8: "https://media-ssl.musicradio.com/CapitalMP3",
  98.5: "https://kissfm.kissfmuk.com/kiss.aac",
  101.9: "https://stream.smoothradio.com/smoothukmp3",
  104.9: "https://stream.heart.co.uk/heartxmp3",
  107.8: "https://stream.absoluteradio.co.uk/absoluteclassicrockmp3"
}

export function createFMRadio() {
  let noise = null
  let source = null
  let gain = new Tone.Gain(0).toDestination()
  let filter = new Tone.Filter(8000, "lowpass").connect(gain)
  let currentStation = null

  const setFrequency = async (freq, vol, isFM) => {
    gain.gain.value = vol

    if (!isFM) return

    await Tone.start()

    // Kill old source
    if (source) {
      source.stop()
      source.disconnect()
    }
    if (noise) noise.volume.value = -Infinity

    const station = Object.entries(STREAMS).find(([f]) => Math.abs(f - freq) < 0.4)
    if (station) {
      const url = station[1]
      currentStation = { name: Object.keys(STREAMS).find(k => STREAMS[k] === url) || "Live Radio", freq }
      try {
        source = new Tone.Player(url).connect(filter)
        source.autostart = true
      } catch (e) {
        currentStation.name = "Stream Error"
      }
    } else {
      // Static
      currentStation = null
      noise = noise || new Tone.Noise("white").start()
      noise.connect(filter)
      noise.volume.value = -20 + Math.random() * 15
    }
  }

  const playAux = (url, vol) => {
    gain.gain.value = vol
    if (source) source.stop()
    source = new Tone.Player(url).connect(filter)
    source.autostart = true
  }

  const dispose = () => {
    gain.dispose()
    filter.dispose()
    if (source) source.dispose()
    if (noise) noise.dispose()
  }

  return { setFrequency, playAux, dispose, currentStation: () => currentStation }
}
