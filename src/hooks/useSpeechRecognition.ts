'use client'

import { useRef, useState, useCallback } from 'react'

interface UseSpeechRecognitionProps {
  onResult: (text: string) => void
  onPartialResult?: (text: string) => void
}

export function useSpeechRecognition({
  onResult,
  onPartialResult
}: UseSpeechRecognitionProps) {

  const [isListening, setIsListening] = useState(false)

  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const shouldRestartRef = useRef(true)

  const startListening = useCallback(() => {

    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Speech recognition not supported. Use Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      console.log('🎤 Listening started')
      setIsListening(true)
    }

    recognition.onend = () => {
      console.log('🎤 Recognition ended')

      setIsListening(false)

      if (shouldRestartRef.current) {
        console.log('🔁 Restarting recognition...')
        recognition.start()
      }
    }

    recognition.onresult = (event: any) => {

      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {

        const result = event.results[i]

        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      if (interimTranscript && onPartialResult) {
        onPartialResult(interimTranscript)
      }

      if (finalTranscript.trim()) {

        console.log('🗣 Final speech:', finalTranscript)

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        silenceTimerRef.current = setTimeout(() => {
          onResult(finalTranscript.trim())
        }, 1200)
      }
    }

    recognition.onerror = (event: any) => {

      console.error('🎤 Speech recognition error:', event.error)

      if (event.error === 'not-allowed') {
        alert('Microphone permission denied')
      }

      if (event.error === 'no-speech') {
        console.log('⚠️ No speech detected')
      }
    }

    recognitionRef.current = recognition
    shouldRestartRef.current = true

    recognition.start()

  }, [onResult, onPartialResult])


  const stopListening = useCallback(() => {

    console.log('🛑 Stopping recognition')

    shouldRestartRef.current = false

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    setIsListening(false)

  }, [])


  return {
    isListening,
    startListening,
    stopListening
  }
}