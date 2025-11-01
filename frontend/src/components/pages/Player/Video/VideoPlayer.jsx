import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Settings, Maximize } from "lucide-react"

export default function VideoPlayer({ video }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const isMobile = window.innerWidth <= 1024

  // Toggle play/pause
  const togglePlay = () => {
    const videoEl = videoRef.current
    if (!videoEl) return

    if (isPlaying) videoEl.pause()
    else videoEl.play()

    setIsPlaying(!isPlaying)
  }

  // Update progress as video plays
  const handleTimeUpdate = () => {
    const videoEl = videoRef.current
    const progressPercent = (videoEl.currentTime / videoEl.duration) * 100
    setProgress(progressPercent)
  }

  // Seek video
  const handleSeek = (e) => {
    const videoEl = videoRef.current
    const rect = e.target.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * videoEl.duration
    videoEl.currentTime = newTime
  }

  // Volume control
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    const videoEl = videoRef.current
    videoEl.volume = newVolume
    setVolume(newVolume)
  }

  // Fullscreen toggle
  const toggleFullScreen = async () => {
    const videoEl = videoRef.current;
  
    if (!document.fullscreenElement) {
      try {
        await videoEl.requestFullscreen();
  
        // Try to lock the screen to landscape on mobile
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape").catch(() => {});
        }
      } catch (err) {
        console.log("Error entering fullscreen:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
  
        // Unlock the orientation when exiting
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (err) {
        console.log("Error exiting fullscreen:", err);
      }
    }
  };

  // Change playback speed
  const changeSpeed = (rate) => {
    const videoEl = videoRef.current
    videoEl.playbackRate = rate
    setPlaybackRate(rate)
    setShowSettings(false)
  }

  const resetHideTimer = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 1500)
  }
  
  const handleVideoClick = () => {
    if (isMobile) {
      setShowControls(true)
      resetHideTimer()
    }
  }

  useEffect(() => {
    if (!isMobile) return

    const handleUserActivity = () => {
      setShowControls(true)
      resetHideTimer()
    }

    const video = videoRef.current
    video.addEventListener("touchstart", handleUserActivity)
    video.addEventListener("mousemove", handleUserActivity)

    return () => {
      clearTimeout(hideTimeoutRef.current)
      video.removeEventListener("touchstart", handleUserActivity)
      video.removeEventListener("mousemove", handleUserActivity)
    }
  }, [isMobile])

  return (
    <div 
      className="w-full bg-black rounded-lg overflow-hidden mb-4 aspect-video relative group"
      onClick={handleVideoClick}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoFile}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-[#0000004c] transition-all flex flex-col justify-between p-4 
          ${isMobile
            ? showControls
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
            : "opacity-0 group-hover:opacity-100"}
          `}
        >
        {/* Top Controls */}
        <div className="flex justify-between items-start">
          <div></div>
          <div className="relative">
            <button
              className="bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 flex items-center gap-1"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" /> {playbackRate}x
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-2 w-28 bg-black text-white text-sm rounded-lg shadow-lg border border-gray-700">
                {[0.25, 0.5, 1, 1.25, 1.5, 2].map(rate => (
                  <button
                    key={rate}
                    onClick={() => changeSpeed(rate)}
                    className={`block w-full text-left px-3 py-1 hover:bg-gray-700 ${
                      rate === playbackRate ? "bg-gray-700" : ""
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Play Button */}
        <div className="flex justify-center items-center">
          <button
            onClick={togglePlay}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-12 h-12 text-black fill-black" />
            ) : (
              <Play className="w-12 h-12 text-black fill-black" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-2">
          {/* Progress Bar */}
          <div
            className="w-full bg-gray-600 h-1 rounded-full hover:h-2 transition-all cursor-pointer"
            onClick={handleSeek}
          >
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button onClick={togglePlay} className="hover:opacity-80">
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5 cursor-pointer" onClick={() => setVolume(1)} />
                ) : (
                  <Volume2 className="w-5 h-5 cursor-pointer" onClick={() => setVolume(0)} />
                )}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-white"
                />
              </div>
            </div>

            {/* Timer */}
            <div className="text-xs">
              <span>{videoRef.current ? Math.floor(videoRef.current.currentTime) : 0}</span>
              <span> / </span>
              <span>{!isNaN(videoRef.current?.duration) ? Math.floor(videoRef.current.duration) : 0}</span>
            </div>

            {/* Settings & Fullscreen */}
            <div className="flex items-center gap-2">
              <Maximize
                className="w-5 h-5 cursor-pointer hover:opacity-80"
                onClick={toggleFullScreen}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
