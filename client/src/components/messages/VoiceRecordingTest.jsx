import React from 'react';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';
import { FiMic, FiPlay, FiStop, FiTrash2 } from 'react-icons/fi';

/**
 * Test component for voice recording functionality
 * This can be used to verify that voice recording works correctly
 */
const VoiceRecordingTest = () => {
  const {
    isRecording,
    isPlaying,
    recordingTime,
    audioBlob,
    isSupported,
    error,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    clearRecording,
    formatTime,
    hasRecording
  } = useVoiceRecording();

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Voice Recording Not Supported</h3>
        <p className="text-yellow-700 text-sm">
          Your browser doesn't support voice recording. Please use a modern browser like Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Voice Recording Test</h3>
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Recording Status */}
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm font-medium">
            {isRecording ? 'Recording...' : 'Ready to record'}
          </span>
          {isRecording && (
            <span className="text-sm text-gray-600">{formatTime}</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-3 mb-4">
        {/* Record/Stop Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isRecording
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={isPlaying}
        >
          <FiMic className="w-4 h-4" />
          <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
        </button>

        {/* Play/Stop Playback Button */}
        {hasRecording && (
          <button
            onClick={isPlaying ? stopPlayback : playRecording}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={isRecording}
          >
            {isPlaying ? <FiStop className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
            <span>{isPlaying ? 'Stop Playback' : 'Play Recording'}</span>
          </button>
        )}

        {/* Clear Button */}
        {hasRecording && (
          <button
            onClick={clearRecording}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={isRecording || isPlaying}
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Recording Info */}
      {hasRecording && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Recording Details</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Duration: {formatTime}</p>
            <p>Size: {(audioBlob.size / 1024).toFixed(1)} KB</p>
            <p>Type: {audioBlob.type}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Start Recording" to begin recording your voice</li>
          <li>• Click "Stop Recording" when you're done</li>
          <li>• Use "Play Recording" to listen to your recording</li>
          <li>• Use "Clear" to delete the recording and start over</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceRecordingTest;
