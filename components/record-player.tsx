"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRecords } from "./record-provider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Power } from "lucide-react"
import Image from "next/image"

export function RecordPlayer() {
  const { records, currentRecord, isPlaying, selectRecord, togglePlay } = useRecords()
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isPoweredOn, setIsPoweredOn] = useState(true)
  const [tonearmPosition, setTonearmPosition] = useState(0)
  const animationRef = useRef<number | undefined>(undefined)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const vinylSoundRef = useRef<HTMLAudioElement | null>(null)
  const dustFilterRef = useRef<HTMLAudioElement | null>(null)

  // Find current record index
  const currentIndex = currentRecord ? records.findIndex(r => r.id === currentRecord.id) : -1

  // Go to previous record
  const goToPrevRecord = () => {
    if (!records.length) return
    if (currentIndex === -1) {
      selectRecord(records[0].id)
      return
    }
    const prevIndex = (currentIndex - 1 + records.length) % records.length
    selectRecord(records[prevIndex].id)
  }

  // Go to next record
  const goToNextRecord = () => {
    if (!records.length) return
    if (currentIndex === -1) {
      selectRecord(records[0].id)
      return
    }
    const nextIndex = (currentIndex + 1) % records.length
    selectRecord(records[nextIndex].id)
  }

  // Initialize audio elements
  useEffect(() => {
    // Main audio
    audioRef.current = new Audio(currentRecord?.audioUrl || "")
    audioRef.current.volume = volume / 100

    // Vinyl spinning sound
    if (!vinylSoundRef.current) {
      vinylSoundRef.current = new Audio("/vinyl-spinning.mp3")
      vinylSoundRef.current.loop = true
      vinylSoundRef.current.volume = 0.15 * (volume / 100)
    }

    // Dust and scratches sound
    if (!dustFilterRef.current) {
      dustFilterRef.current = new Audio("/audio/vinyl-crackling.mp3")
      dustFilterRef.current.loop = true
      dustFilterRef.current.volume = 0.1 * (volume / 100)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [currentRecord])

  // Handle play/pause
  useEffect(() => {
    if (!isPoweredOn) return

    if (isPlaying) {
      // Start main audio if available
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.log("Audio playback error:", e))
      }

      // Start vinyl spinning sound
      if (vinylSoundRef.current) {
        vinylSoundRef.current.play().catch((e) => console.log("Vinyl sound error:", e))
      }

      // Start dust and crackle sound
      if (dustFilterRef.current) {
        dustFilterRef.current.play().catch((e) => console.log("Crackle sound error:", e))
      }

      // Start animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      animateRecord()
      setTonearmPosition(-25)
    } else {
      // Pause all audio
      if (audioRef.current) {
        audioRef.current.pause()
      }

      if (vinylSoundRef.current) {
        vinylSoundRef.current.pause()
      }

      if (dustFilterRef.current) {
        dustFilterRef.current.pause()
      }

      // Stop animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = undefined
      }
      setTonearmPosition(0)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = undefined
      }
    }
  }, [isPlaying, isPoweredOn])

  // Handle volume changes
  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : volume / 100

    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume
    }

    if (vinylSoundRef.current) {
      vinylSoundRef.current.volume = 0.15 * effectiveVolume
    }

    if (dustFilterRef.current) {
      dustFilterRef.current.volume = 0.05 * effectiveVolume
    }
  }, [volume, isMuted])

  // Handle power toggle
  useEffect(() => {
    if (!isPoweredOn && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
      }

      if (vinylSoundRef.current) {
        vinylSoundRef.current.pause()
      }

      if (dustFilterRef.current) {
        dustFilterRef.current.pause()
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPoweredOn, isPlaying])

  const animateRecord = () => {
    if (!isPlaying || !isPoweredOn) return
    
    setRotation((prev) => (prev + 0.2) % 360)
    animationRef.current = requestAnimationFrame(animateRecord)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const togglePower = () => {
    setIsPoweredOn(!isPoweredOn)
  }

  // Generate dust and scratch positions once per record
  const dustAndScratches = useMemo(() => {
    return {
      dust: Array.from({ length: 80 }).map(() => ({
        width: Math.random() * 1 + 0.5,
        height: Math.random() * 1 + 0.5,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.3 + 0.15,
        rotate: Math.random() * 360,
      })),
      scratches: Array.from({ length: 25 }).map(() => {
        const isLong = Math.random() > 0.7
        return {
          width: isLong ? Math.random() * 20 + 15 : Math.random() * 8 + 3,
          height: 0.5,
          left: Math.random() * 100,
          top: Math.random() * 100,
          opacity: Math.random() * 0.25 + 0.15,
          rotate: Math.random() * 360,
        }
      })
    }
  }, [currentRecord?.id])

  return (
    <div className="bg-amber-900/80 rounded-lg p-6 shadow-xl border border-amber-800">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Record Player */}
        <div className="flex-1 relative">
          <div className="bg-amber-950 rounded-lg p-4 aspect-square relative overflow-hidden shadow-inner">
            {/* Turntable platter */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-full bg-zinc-900 flex items-center justify-center shadow-lg">
                {/* Turntable mat */}
                <div className="absolute w-[98%] h-[98%] rounded-full bg-zinc-800 opacity-70"></div>

                {/* Center spindle */}
                <div className="w-4 h-4 rounded-full bg-zinc-400 z-10 shadow-sm"></div>

                {/* Record */}
                {currentRecord && (
                  <div
                    className="absolute w-[95%] h-[95%] rounded-full bg-zinc-800 flex items-center justify-center"
                    style={{
                      transform: `rotate(${isPlaying && isPoweredOn ? rotation : 0}deg)`,
                      transition: isPlaying ? "none" : "transform 0.5s ease-out",
                    }}
                  >
                    {/* Base vinyl texture */}
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-full"></div>

                    {/* Album cover overlay - subtle and color-matched */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-0 opacity-10 mix-blend-overlay"
                        style={{
                          background: `radial-gradient(circle at center, ${getDominantColor(currentRecord.coverUrl)} 0%, transparent 70%)`,
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent"></div>
                    </div>

                    {/* Record grooves - more realistic with varying opacity and spacing */}
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full border border-zinc-700"
                        style={{
                          width: `${98 - i * 1.8}%`,
                          height: `${98 - i * 1.8}%`,
                          opacity: 0.2 + (i % 3) * 0.15,
                          borderWidth: i % 4 === 0 ? "1px" : "0.5px",
                          boxShadow: i % 3 === 0 ? "inset 0 0 2px rgba(0,0,0,0.3)" : "none",
                        }}
                      ></div>
                    ))}

                    {/* Dynamic Label based on album cover */}
                    <div className="w-[25%] h-[25%] rounded-full absolute shadow-sm overflow-hidden"
                      style={{
                        transform: `rotate(${isPlaying && isPoweredOn ? rotation : 0}deg)`,
                        transition: isPlaying ? "none" : "transform 0.5s ease-out",
                      }}>
                      {/* Album cover as label background */}
                      <div className="absolute inset-0">
                        <Image
                          src={currentRecord.coverUrl}
                          alt={currentRecord.title}
                          fill
                          className="object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-amber-300/30"></div>
                      </div>
                      
                      {/* Center hole with shadow */}
                      <div className="absolute inset-0 rounded-full flex items-center justify-center">
                        <div className="w-[30%] h-[30%] rounded-full bg-zinc-900 shadow-inner">
                          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]"></div>
                        </div>
                      </div>

                      {/* Subtle shine overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay"></div>
                      
                      {/* Edge shadow */}
                      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_3px_rgba(0,0,0,0.3)]"></div>
                    </div>

                    {/* Dynamic light reflection */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-20"
                      style={{
                        background: `radial-gradient(circle at ${isPlaying ? (rotation % 360) : 0}deg 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
                        transition: isPlaying ? "none" : "background 0.5s ease-out"
                      }}
                    ></div>

                    {/* Fine dust specks */}
                    <div className="absolute inset-0 rounded-full overflow-hidden"
                      style={{
                        transform: `rotate(${isPlaying && isPoweredOn ? rotation : 0}deg)`,
                        transition: isPlaying ? "none" : "transform 0.5s ease-out",
                      }}>
                      {dustAndScratches.dust.map((d, i) => (
                        <div
                          key={`dust-${i}`}
                          className="absolute bg-white"
                          style={{
                            width: `${d.width}px`,
                            height: `${d.height}px`,
                            left: `${d.left}%`,
                            top: `${d.top}%`,
                            opacity: d.opacity,
                            transform: `rotate(${d.rotate}deg)`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Thin scratches */}
                    <div className="absolute inset-0 rounded-full overflow-hidden"
                      style={{
                        transform: `rotate(${isPlaying && isPoweredOn ? rotation : 0}deg)`,
                        transition: isPlaying ? "none" : "transform 0.5s ease-out",
                      }}>
                      {dustAndScratches.scratches.map((s, i) => (
                        <div
                          key={`scratch-${i}`}
                          className="absolute bg-white"
                          style={{
                            width: `${s.width}px`,
                            height: `${s.height}px`,
                            left: `${s.left}%`,
                            top: `${s.top}%`,
                            opacity: s.opacity,
                            transform: `rotate(${s.rotate}deg)`,
                            filter: 'blur(0.2px)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tonearm - more realistic */}
            <div className="absolute top-4 right-4 w-1/3 h-1/3">
              <div className="relative w-full h-full">
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-zinc-400 rounded-full shadow-md z-10"></div>
                <div
                  className="absolute bottom-0 right-0 origin-bottom-right"
                  style={{
                    transform: `rotate(${tonearmPosition}deg)`,
                    transition: "transform 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)", // Smoother, more realistic movement
                  }}
                >
                  {/* Tonearm base */}
                  <div className="absolute bottom-0 right-0 w-3 h-24 bg-gradient-to-r from-zinc-400 to-zinc-300 rounded-full shadow-md">
                    {/* Tonearm counterweight */}
                    <div className="absolute -left-1 bottom-4 w-5 h-5 bg-zinc-600 rounded-full shadow"></div>
                  </div>

                  {/* Cartridge and stylus */}
                  <div className="absolute -left-1 top-0 w-4 h-6 bg-zinc-500 rounded-sm shadow-sm">
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[1px] h-2 bg-zinc-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls - improved styling */}
          <div className="mt-6 flex items-center justify-between bg-amber-950/60 p-4 rounded-lg shadow-md">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${isPoweredOn ? "bg-red-500 text-white hover:bg-red-600" : "bg-zinc-700 hover:bg-zinc-600"}`}
              onClick={togglePower}
            >
              <Power className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-amber-800 text-amber-100 hover:bg-amber-700"
                disabled={!currentRecord || !isPoweredOn}
                onClick={goToPrevRecord}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 bg-amber-700 text-amber-100 hover:bg-amber-600"
                disabled={!currentRecord || !isPoweredOn}
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-amber-800 text-amber-100 hover:bg-amber-700"
                disabled={!currentRecord || !isPoweredOn}
                onClick={goToNextRecord}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-amber-800 text-amber-100 hover:bg-amber-700"
                onClick={toggleMute}
                disabled={!isPoweredOn}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              {/* Custom volume slider */}
              <div className="w-24 h-2 bg-amber-800/50 rounded-full relative">
                <div className="absolute h-full bg-amber-500 rounded-full" style={{ width: `${volume}%` }}></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number.parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={!isPoweredOn}
                />
                <div
                  className="absolute h-4 w-4 bg-amber-100 rounded-full shadow-md -top-1 cursor-pointer"
                  style={{ left: `calc(${volume}% - 8px)` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Now Playing */}
        <div className="md:w-1/3 bg-amber-800/50 rounded-lg p-4 flex flex-col shadow-md">
          <h3 className="text-lg font-medium mb-4 text-center">Now Playing</h3>

          {currentRecord ? (
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 relative mb-4">
                <Image
                  src={currentRecord.coverUrl || "/placeholder.svg"}
                  alt={currentRecord.title}
                  fill
                  className="object-cover rounded-md shadow-md"
                  sizes="(max-width: 768px) 100vw, 160px"
                />
                {/* Vinyl wear effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent rounded-md pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('/images/dust.jpg')] opacity-20 mix-blend-overlay rounded-md pointer-events-none"></div>
              </div>

              <h4 className="text-xl font-bold text-center">{currentRecord.title}</h4>
              <p className="text-amber-200/80 text-center">{currentRecord.artist}</p>
              <p className="text-amber-200/60 text-sm text-center mt-1">{currentRecord.year}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-amber-200/60 font-es-allianz font-regular text-center">
              Select a record from the shelf to play
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getDominantColor(imageUrl: string): string {
  // Default colors for each album
  const colorMap: { [key: string]: string } = {
    "kind-of-blue.jpg": "#1a365d", // Deep blue
    "john-coltrane.jpg": "#2d3748", // Dark slate
    "billie-holiday.jpg": "#4a5568", // Gray
    "mingus.jpg": "#8B7355", // Warm yellow-brown
    "the-dave-brubeck-quartet.jpg": "#553B88", // Purple-tinted blue
    "cheek-to-cheek.jpeg": "#744210", // Brown
  }

  // Extract filename from URL
  const filename = imageUrl.split('/').pop() || ''
  return colorMap[filename] || "#2d3748" // Default to dark slate if no match
}
