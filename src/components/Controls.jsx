import React from 'react';
import { calculateSpeedKmH, calculateETA } from '../utils/speed';

/**
 * Controls component - Displays vehicle status and playback controls
 */
function Controls({ 
  currentPosition, 
  currentIndex,
  routeData,
  isPlaying, 
  onPlay, 
  onPause, 
  onReset,
  onSpeedChange,
  simulationSpeed 
}) {
  
  const speed = calculateSpeedKmH(currentIndex, routeData);
  const eta = calculateETA(currentIndex, routeData);
  const progress = routeData.length > 0 
    ? ((currentIndex / (routeData.length - 1)) * 100).toFixed(1)
    : 0;
  
  return (
    <div className="absolute top-4 right-4 z-[1000] p-4 bg-white shadow-xl rounded-lg w-full max-w-xs md:max-w-sm">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Vehicle Status</h2>
      
      {/* Status Information */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between items-start">
          <span className="text-gray-600">Coordinates:</span>
          <span className="font-mono text-blue-600 text-xs">
            {currentPosition?.lat?.toFixed(6)}, {currentPosition?.lng?.toFixed(6)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Timestamp:</span>
          <span className="font-medium text-gray-700">
            {currentPosition?.timestamp 
              ? new Date(currentPosition.timestamp).toLocaleTimeString() 
              : 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Speed:</span>
          <span className="font-medium text-gray-700">{speed} km/h</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">ETA:</span>
          <span className="font-medium text-gray-700">{eta}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Progress:</span>
          <span className="font-medium text-gray-700">{progress}%</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Playback Controls */}
      <div className="flex gap-2 mb-3">
        {!isPlaying ? (
          <button
            onClick={onPlay}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            disabled={currentIndex >= routeData.length - 1}
          >
            ▶ Play
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            ⏸ Pause
          </button>
        )}
        
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
        >
          ⟲ Reset
        </button>
      </div>
      
      {/* Speed Control */}
      <div className="mt-3">
        <label className="block text-xs text-gray-600 mb-1">
          Simulation Speed: {(2000 / simulationSpeed).toFixed(1)}x
        </label>
        <input
          type="range"
          min="500"
          max="3000"
          step="100"
          value={simulationSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>
      
      {/* Route Info */}
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Total Points:</span>
          <span className="font-medium">{routeData.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Current Point:</span>
          <span className="font-medium">{currentIndex + 1}</span>
        </div>
      </div>
    </div>
  );
}

export default Controls;
