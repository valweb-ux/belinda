"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import styles from "./Player.module.scss"

interface PlayerProps {
  currentTrack: {
    title: string
    artist: string
  }
}

const Player: React.FC<PlayerProps> = ({ currentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value
    }
  }

  return (
    <div className={styles.player}>
      <audio ref={audioRef} src="http://stream.cheriefm.online/live" preload="none" />

      <button className={styles.playButton} onClick={togglePlay} aria-label={isPlaying ? "Пауза" : "Грати"}>
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      <div className={styles.nowPlaying}>
        <span>Зараз в ефірі:</span>
        <div className={styles.marquee}>
          <span>{`${currentTrack.title} - ${currentTrack.artist}`}</span>
        </div>
      </div>

      <div className={styles.volumeControl}>
        <Volume2 size={18} />
        <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} />
      </div>
    </div>
  )
}

export default Player

