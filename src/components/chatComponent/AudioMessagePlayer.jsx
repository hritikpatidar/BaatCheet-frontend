import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from 'wavesurfer.js'
import { Play, Pause } from "lucide-react"

const AudioMessagePlayer = ({ audioUrl }) => {
  const waveformRef = useRef(null)
  const waveSurfer = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!waveformRef.current) return

    waveSurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'gray',
      progressColor: '#000',
      height: 30,
      responsive: true,
    })

    waveSurfer.current.load(audioUrl)

    waveSurfer.current.on("ready", () => {
      const duration = waveSurfer.current.getDuration()
      setCurrentTime(duration)
    })

    waveSurfer.current.on('audioprocess', () => {
      const time = waveSurfer.current.getCurrentTime()
      setCurrentTime(time.toFixed(1) + 's')
    })
    waveSurfer.current.on("play", () => setIsPlaying(true))
    waveSurfer.current.on("pause", () => setIsPlaying(false))
    return () => {
      waveSurfer.current.destroy()
    }
  }, [audioUrl])

  return (
    <>
      {/* <WaveformPlayer audioUrl={`http://localhost:3000/${url}`} /> */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          type="button"
          className="p-2 text-gray-600 rounded hover:bg-gay-600"
          onClick={(e) => {
            e.stopPropagation()
            waveSurfer.current?.playPause()
          }}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Waveform container */}
        <div ref={waveformRef} className="w-[150px] h-[30px]" />

        {/* Current time */}
        <div className="text-sm text-gray-700 min-w-[60px]">
          {currentTime}
        </div>
      </div>

    </>
  );
};

export default AudioMessagePlayer;
