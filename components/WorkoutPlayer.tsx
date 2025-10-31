'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

// Wake Lock for keeping screen on
let wakeLock: any = null
let audioContext: AudioContext | null = null
let oscillator: OscillatorNode | null = null
let gainNode: GainNode | null = null

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await (navigator as any).wakeLock.request('screen')
      console.log('Wake Lock activated')
    } else {
      // Fallback for iOS: use silent audio
      startSilentAudio()
    }
  } catch (err) {
    console.log('Wake Lock error:', err)
    // Fallback for iOS
    startSilentAudio()
  }
}

function startSilentAudio() {
  try {
    if (typeof window === 'undefined') return
    if (audioContext) return // Already started

    // Create audio context (works on iOS)
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext = new AudioContextClass()

    // Create a very low frequency oscillator (inaudible)
    oscillator = audioContext.createOscillator()
    gainNode = audioContext.createGain()

    // Set frequency to 20Hz (below human hearing range of ~20Hz-20kHz)
    oscillator.frequency.value = 20

    // Set to extremely low volume (essentially silent)
    gainNode.gain.value = 0.001

    // Connect nodes
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Start the oscillator
    oscillator.start()

    console.log('Silent audio started for iOS wake lock')
  } catch (err) {
    console.log('Silent audio error:', err)
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release()
    wakeLock = null
    console.log('Wake Lock released')
  }

  // Stop silent audio
  if (oscillator) {
    oscillator.stop()
    oscillator.disconnect()
    oscillator = null
  }
  if (gainNode) {
    gainNode.disconnect()
    gainNode = null
  }
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
}

// Voice announcements
let selectedVoice: SpeechSynthesisVoice | null = null

// Load voices when available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices()
    selectedVoice = voices.find(voice => 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google US English') ||
      voice.name.includes('Samantha (Enhanced)') ||
      (voice.lang === 'en-US' && voice.name.toLowerCase().includes('female'))
    ) || voices.find(voice => voice.lang.startsWith('en-US')) || voices[0]
    
    console.log('Selected voice:', selectedVoice?.name)
  }
}

function speak(text: string, skipCancel = false) {
  if ('speechSynthesis' in window) {
    // Only cancel if not skipping (allows "Get ready" to finish)
    if (!skipCancel) {
      window.speechSynthesis.cancel()
    }

    // Ensure voices are loaded
    if (!selectedVoice) {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        selectedVoice = voices.find(voice =>
          voice.name.includes('Samantha') ||
          voice.name.includes('Google US English') ||
          (voice.lang === 'en-US' && voice.name.toLowerCase().includes('female'))
        ) || voices.find(voice => voice.lang.startsWith('en-US')) || voices[0]
      }
    }

    const utterance = new SpeechSynthesisUtterance(text)
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // iOS fix: Resume audio context if suspended
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume()
    }

    window.speechSynthesis.speak(utterance)
  }
}

type Exercise = {
  id: string
  name: string
  duration: number | null
  reps: number | null
  exercise_order: number
}

type Props = {
  workout: any
  exercises: Exercise[]
  level?: number
  restDuration?: number
}

export default function WorkoutPlayer({ workout, exercises, level, restDuration = 120 }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isResting, setIsResting] = useState(false)
  const [isGetReady, setIsGetReady] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null)

  const currentExercise = exercises[currentExerciseIndex]
  const totalRounds = level ? workout.workout_levels?.find((l: any) => l.level === level)?.sets : 1
  const totalExercises = exercises.length

  useEffect(() => {
    requestWakeLock()
    // Set workout start time when component mounts
    setWorkoutStartTime(Date.now())
    return () => {
      releaseWakeLock()
    }
  }, [])

  useEffect(() => {
    if (isGetReady) {
      setTimeLeft(6)
      if (voiceEnabled) speak('Get ready')
    }
  }, [isGetReady, voiceEnabled])

  useEffect(() => {
    if (!isGetReady && !isResting && !isPaused && currentExercise && voiceEnabled) {
      let announcement = currentExercise.name

      // Add reps information for rep-based exercises
      if (currentExercise.reps) {
        announcement = `${currentExercise.name}, ${currentExercise.reps} reps`
      }

      speak(announcement)
    }
  }, [currentExerciseIndex, isGetReady, isResting, isPaused, voiceEnabled, currentExercise])

  useEffect(() => {
    if (isResting && voiceEnabled) {
      const minutes = Math.floor(restDuration / 60)
      const seconds = restDuration % 60
      let restMessage = 'Rest'

      if (minutes > 0 && seconds > 0) {
        restMessage = `Rest ${minutes} minute${minutes > 1 ? 's' : ''} ${seconds} seconds`
      } else if (minutes > 0) {
        restMessage = `Rest ${minutes} minute${minutes > 1 ? 's' : ''}`
      } else {
        restMessage = `Rest ${seconds} seconds`
      }

      speak(restMessage)
    }
  }, [isResting, voiceEnabled, restDuration])

  // Voice countdown for last 5 seconds of exercises AND get ready countdown
  useEffect(() => {
    if (!isPaused && voiceEnabled && timeLeft > 0) {
      // Announce during get ready countdown (1-5, skip 6 since "Get ready" is said)
      if (isGetReady && timeLeft <= 5) {
        speak(timeLeft.toString(), true) // Don't cancel "Get ready"
      }
      // Announce during timed exercises (last 5 seconds)
      else if (!isResting && currentExercise?.duration && timeLeft <= 5) {
        speak(timeLeft.toString())
      }
    }
  }, [timeLeft, isPaused, isGetReady, isResting, voiceEnabled])

  // Timer - only runs for timed exercises, get ready, and rest
  useEffect(() => {
    if (isPaused || isComplete) return
    
    // Don't run timer for rep-based exercises (during workout phase)
    if (!isGetReady && !isResting && !currentExercise?.duration) {
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, isComplete, currentExerciseIndex, currentRound, isResting, isGetReady, currentExercise])

  const handleTimerComplete = () => {
    if (isGetReady) {
      setIsGetReady(false)
      startExercise()
      return
    }

    if (isResting) {
      setIsResting(false)
      setIsGetReady(true)
      return
    }

    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      startExercise()
    } else {
      if (currentRound < totalRounds) {
        setIsResting(true)
        setTimeLeft(restDuration)
        setCurrentExerciseIndex(0)
        setCurrentRound(currentRound + 1)
      } else {
        // Workout complete - save to history
        setIsComplete(true)
        saveWorkoutHistory()
      }
    }
  }

  const saveWorkoutHistory = async () => {
    if (!user || !workoutStartTime) return

    const durationSeconds = Math.floor((Date.now() - workoutStartTime) / 1000)

    try {
      await supabase.from('workout_history').insert({
        user_id: user.id,
        workout_id: workout.id,
        level: level || null,
        rest_duration: restDuration,
        duration_seconds: durationSeconds,
        workout_name: workout.name,
        workout_type: workout.type,
      })
      console.log('Workout history saved!')
    } catch (error) {
      console.error('Error saving workout history:', error)
    }
  }

  const startExercise = () => {
    if (currentExercise.duration) {
      setTimeLeft(currentExercise.duration)
    } else {
      setTimeLeft(0)
    }
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleQuit = () => {
    releaseWakeLock()
    window.speechSynthesis.cancel()
    router.push('/')
  }

  const handleSkipExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      startExercise()
    } else {
      if (currentRound < totalRounds) {
        setIsResting(true)
        setTimeLeft(restDuration)
        setCurrentExerciseIndex(0)
        setCurrentRound(currentRound + 1)
      } else {
        setIsComplete(true)
      }
    }
  }

  const handleSkipRest = () => {
    setIsResting(false)
    setIsGetReady(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-800 flex items-center justify-center p-6">
        <div className="text-center text-white">
          <div className="text-8xl mb-8">🎉</div>
          <h1 className="text-5xl font-bold mb-4">WORKOUT COMPLETE!</h1>
          <p className="text-2xl mb-8">Great job!</p>
          <button
            onClick={handleQuit}
            className="bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 px-8 py-4 rounded-xl font-bold text-xl hover:bg-green-50 dark:hover:bg-gray-700 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (isGetReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-800 flex items-center justify-center p-6">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-8">GET READY</h1>
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
            <div className="relative text-9xl font-bold animate-pulse">{timeLeft > 5 ? '' : timeLeft}</div>
          </div>
          <p className="text-2xl">Round {currentRound} of {totalRounds} starting...</p>
        </div>
      </div>
    )
  }

  if (isResting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 flex items-center justify-center p-6">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-8">REST</h1>
          <div className="text-9xl font-bold mb-8">{formatTime(timeLeft)}</div>
          <p className="text-2xl mb-4">Round {currentRound - 1} Complete!</p>
          <p className="text-xl mb-8">Next: Round {currentRound} of {totalRounds}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePause}
              className="bg-white/20 border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/30 transition-all"
            >
              {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
            </button>
            <button
              onClick={handleSkipRest}
              className="bg-orange-500 dark:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 dark:hover:bg-orange-700 transition-all"
            >
              ⏭️ SKIP REST
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 dark:from-purple-700 dark:to-purple-950 flex flex-col">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-white">
          <div>Round {currentRound} of {totalRounds}</div>
          <div>Exercise {currentExerciseIndex + 1} of {totalExercises}</div>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all relative group"
            title={voiceEnabled ? 'Voice guidance enabled' : 'Voice guidance disabled'}
          >
            {voiceEnabled ? '🔊' : '🔇'}
            <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Toggle voice guidance
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-12 uppercase">
            {currentExercise.name}
          </h1>

          {currentExercise.duration ? (
            <div className="text-9xl font-bold mb-12">
              :{timeLeft.toString().padStart(2, '0')}
            </div>
          ) : (
            <div className="text-7xl font-bold mb-12">
              {currentExercise.reps} REPS
            </div>
          )}

          <div className="w-full max-w-2xl mx-auto bg-white/20 rounded-full h-4 mb-8">
            <div
              className="bg-white h-4 rounded-full transition-all"
              style={{
                width: `${((currentExerciseIndex + 1) / totalExercises) * 100}%`,
              }}
            />
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={handlePause}
              className="bg-white/20 border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition-all"
            >
              {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
            </button>

            <button
              onClick={handleSkipExercise}
              className="bg-orange-500 dark:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 dark:hover:bg-orange-700 transition-all"
            >
              {currentExercise.duration ? '⏭️ SKIP' : '✓ NEXT'}
            </button>

            <button
              onClick={handleQuit}
              className="bg-red-500/80 dark:bg-red-600/80 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-600 dark:hover:bg-red-700 transition-all"
            >
              ❌ QUIT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}