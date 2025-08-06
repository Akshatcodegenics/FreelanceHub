import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for voice recording functionality
 * Compatible with React 18 and modern browsers
 * Provides recording, playback, and audio processing capabilities
 */
export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const audioElementRef = useRef(null);

  // Check browser support on mount
  useEffect(() => {
    const checkSupport = () => {
      const hasMediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      const hasMediaRecorder = window.MediaRecorder;
      setIsSupported(hasMediaDevices && hasMediaRecorder);
    };

    checkSupport();
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }, [audioUrl]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Voice recording is not supported in this browser');
      return false;
    }

    if (isRecording) {
      return false;
    }

    try {
      setError(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        setAudioBlob(blob);
        setAudioUrl(url);
        setIsRecording(false);
        
        // Stop all tracks
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError('Recording failed: ' + event.error.message);
        setIsRecording(false);
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      return true;
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to access microphone: ' + err.message);
      return false;
    }
  }, [isSupported, isRecording]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) {
      return;
    }

    try {
      mediaRecorderRef.current.stop();
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Failed to stop recording');
    }
  }, [isRecording]);

  // Play recorded audio
  const playRecording = useCallback(() => {
    if (!audioUrl || isPlaying) {
      return;
    }

    try {
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setError('Failed to play recording');
        setIsPlaying(false);
      };

      audio.play();
    } catch (err) {
      console.error('Error playing recording:', err);
      setError('Failed to play recording');
    }
  }, [audioUrl, isPlaying]);

  // Stop playback
  const stopPlayback = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Clear recording
  const clearRecording = useCallback(() => {
    stopPlayback();
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setError(null);
  }, [audioUrl, stopPlayback]);

  // Format recording time
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    // State
    isRecording,
    isPlaying,
    recordingTime,
    audioBlob,
    audioUrl,
    isSupported,
    error,
    
    // Actions
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    clearRecording,
    
    // Utilities
    formatTime: formatTime(recordingTime),
    hasRecording: !!audioBlob,
  };
};
