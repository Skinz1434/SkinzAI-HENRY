'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClinicalVector, 
  Point3D, 
  VectorType,
  VectorConvergenceVisualizerProps 
} from '../../app/hvec/types';

/**
 * Clinical Evidence Vector - Shows how each piece of evidence contributes to the diagnosis
 * This actually represents the mathematical concept: Evidence Vector + Weight = Diagnostic Probability
 */
const EvidenceVector: React.FC<{
  vector: ClinicalVector;
  isSelected: boolean;
  onClick: () => void;
  diagnosticCenter: Point3D;
  canvasCenter: { x: number; y: number };
  allVectors: ClinicalVector[];
}> = ({ vector, isSelected, onClick, diagnosticCenter, canvasCenter, allVectors }) => {
  
  // Color coding based on evidence strength and type
  const getEvidenceColor = (type: VectorType, magnitude: number): string => {
    const baseColors = {
      diagnostic: '#3b82f6',  // Blue - lab results, definitive tests
      temporal: '#10b981',    // Green - symptom progression over time
      causal: '#f59e0b',      // Amber - known risk factors
      comparative: '#8b5cf6', // Purple - population comparisons
      predictive: '#ef4444',  // Red - outcome predictions
    };
    
    // Intensity based on confidence/magnitude
    const intensity = Math.max(0.3, magnitude);
    return baseColors[type] + Math.round(intensity * 255).toString(16).padStart(2, '0');
  };

  // Position evidence around a diagnostic reasoning circle
  // Each type of evidence has its logical position in clinical reasoning
  const getEvidencePosition = (type: VectorType, index: number) => {
    const positions = {
      diagnostic: { angle: 0, radius: 140 },      // Lab results at top
      temporal: { angle: Math.PI * 0.4, radius: 120 },   // Symptoms on right
      causal: { angle: Math.PI * 0.8, radius: 160 },     // Risk factors on bottom-right
      comparative: { angle: Math.PI * 1.2, radius: 130 }, // Demographics on bottom-left
      predictive: { angle: Math.PI * 1.6, radius: 110 },  // Predictions on left
    };
    
    const pos = positions[type];
    // Slight offset for multiple vectors of same type
    const offset = (index % 3 - 1) * 0.2;
    
    return {
      x: canvasCenter.x + Math.cos(pos.angle + offset) * pos.radius,
      y: canvasCenter.y + Math.sin(pos.angle + offset) * pos.radius
    };
  };
  
  // Calculate where this evidence points in diagnostic space
  const diagnosisX = canvasCenter.x;
  const diagnosisY = canvasCenter.y;
  
  const vectorIndex = allVectors.findIndex(v => v.id === vector.id);
  const startPos = getEvidencePosition(vector.type, vectorIndex);
  
  // Vector magnitude determines how strongly it points toward diagnosis
  const strength = vector.magnitude;
  const endX = startPos.x + (diagnosisX - startPos.x) * strength;
  const endY = startPos.y + (diagnosisY - startPos.y) * strength;
  
  // Calculate arrow direction
  const dx = endX - startPos.x;
  const dy = endY - startPos.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const unitX = dx / length;
  const unitY = dy / length;
  
  // Arrowhead calculation
  const arrowSize = 8;
  const arrowX1 = endX - unitX * arrowSize - unitY * (arrowSize / 2);
  const arrowY1 = endY - unitY * arrowSize + unitX * (arrowSize / 2);
  const arrowX2 = endX - unitX * arrowSize + unitY * (arrowSize / 2);
  const arrowY2 = endY - unitY * arrowSize - unitX * (arrowSize / 2);

  return (
    <g>
      {/* Evidence source circle */}
      <motion.circle
        cx={startPos.x}
        cy={startPos.y}
        r={isSelected ? 8 : 6}
        fill={getEvidenceColor(vector.type, vector.magnitude)}
        stroke={isSelected ? '#ffffff' : 'none'}
        strokeWidth={2}
        style={{ cursor: 'pointer' }}
        onClick={onClick}
        whileHover={{ scale: 1.2, r: 10 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Evidence vector line */}
      <motion.line
        x1={startPos.x}
        y1={startPos.y}
        x2={endX}
        y2={endY}
        stroke={getEvidenceColor(vector.type, vector.magnitude)}
        strokeWidth={isSelected ? 3 : 2}
        opacity={0.8}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: vectorIndex * 0.1 }}
      />
      
      {/* Arrowhead */}
      <motion.polygon
        points={`${endX},${endY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
        fill={getEvidenceColor(vector.type, vector.magnitude)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.8 + vectorIndex * 0.1 }}
      />
      
      {/* Evidence strength indicator */}
      <motion.circle
        cx={startPos.x}
        cy={startPos.y}
        r={25}
        fill="none"
        stroke={getEvidenceColor(vector.type, vector.magnitude)}
        strokeWidth={1}
        opacity={strength * 0.4}
        strokeDasharray={`${strength * 10} ${5 - strength * 3}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Evidence label */}
      <AnimatePresence>
        {(isSelected || allVectors.length <= 5) && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <rect
              x={startPos.x - 40}
              y={startPos.y - 35}
              width={80}
              height={20}
              fill="rgba(0,0,0,0.8)"
              rx={4}
            />
            <text
              x={startPos.x}
              y={startPos.y - 25}
              fill="white"
              fontSize="10"
              textAnchor="middle"
              className="font-medium"
            >
              {vector.label}
            </text>
            <text
              x={startPos.x}
              y={startPos.y - 12}
              fill={getEvidenceColor(vector.type, vector.magnitude)}
              fontSize="8"
              textAnchor="middle"
              className="font-mono"
            >
              {(vector.magnitude * 100).toFixed(1)}% confidence
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
};

/**
 * Diagnostic Conclusion Visualization - Where all evidence converges
 */
const DiagnosticConclusion: React.FC<{
  vectors: ClinicalVector[];
  canvasCenter: { x: number; y: number };
  selectedVector?: ClinicalVector;
}> = ({ vectors, canvasCenter, selectedVector }) => {
  
  // Calculate diagnostic confidence based on vector alignment
  const calculateDiagnosticConfidence = () => {
    const totalWeight = vectors.reduce((sum, v) => sum + v.magnitude, 0);
    const averageConfidence = totalWeight / vectors.length;
    return Math.min(0.95, averageConfidence); // Cap at 95% - never 100% certain in medicine
  };
  
  const confidence = calculateDiagnosticConfidence();
  const diagnosisColor = confidence > 0.8 ? '#22c55e' : confidence > 0.6 ? '#f59e0b' : '#ef4444';
  
  return (
    <g>
      {/* Central diagnostic target */}
      <circle
        cx={canvasCenter.x}
        cy={canvasCenter.y}
        r={40}
        fill="none"
        stroke="#374151"
        strokeWidth={2}
        strokeDasharray="4,4"
        opacity={0.3}
      />
      
      {/* Diagnostic confidence circle */}
      <motion.circle
        cx={canvasCenter.x}
        cy={canvasCenter.y}
        r={15}
        fill={diagnosisColor}
        opacity={0.8}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      />
      
      {/* Confidence rings */}
      <motion.circle
        cx={canvasCenter.x}
        cy={canvasCenter.y}
        r={25}
        fill="none"
        stroke={diagnosisColor}
        strokeWidth={2}
        opacity={confidence * 0.6}
        strokeDasharray={`${confidence * 15} 5`}
        animate={{ rotate: confidence > 0.8 ? 360 : 0 }}
        transition={{ duration: 4, repeat: confidence > 0.8 ? Infinity : 0, ease: 'linear' }}
      />
      
      {/* Diagnostic label */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2 }}
      >
        <rect
          x={canvasCenter.x - 60}
          y={canvasCenter.y + 50}
          width={120}
          height={35}
          fill="rgba(0,0,0,0.9)"
          rx={8}
          stroke={diagnosisColor}
          strokeWidth={1}
        />
        <text
          x={canvasCenter.x}
          y={canvasCenter.y + 65}
          fill="white"
          fontSize="12"
          textAnchor="middle"
          className="font-semibold"
        >
          Rheumatoid Arthritis
        </text>
        <text
          x={canvasCenter.x}
          y={canvasCenter.y + 78}
          fill={diagnosisColor}
          fontSize="10"
          textAnchor="middle"
          className="font-mono"
        >
          {(confidence * 100).toFixed(1)}% confidence
        </text>
      </motion.g>
      
      {/* Evidence contribution indicator */}
      {selectedVector && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <text
            x={canvasCenter.x}
            y={canvasCenter.y - 60}
            fill="#3b82f6"
            fontSize="11"
            textAnchor="middle"
            className="font-medium"
          >
            {selectedVector.label} contributes:
          </text>
          <text
            x={canvasCenter.x}
            y={canvasCenter.y - 45}
            fill="#3b82f6"
            fontSize="13"
            textAnchor="middle"
            className="font-bold"
          >
            +{(selectedVector.magnitude * 100).toFixed(1)}% to diagnosis
          </text>
        </motion.g>
      )}
    </g>
  );
};
/**
 * Main Clinical Reasoning Visualizer - Shows actual diagnostic process
 */
export const VectorConvergenceVisualizer: React.FC<VectorConvergenceVisualizerProps> = ({
  vectors,
  convergencePoint,
  interactionMode = 'exploration',
  cognitiveLoad,
  onVectorSelect,
  onConvergenceReached,
}) => {
  const [selectedVector, setSelectedVector] = useState<ClinicalVector | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const canvasRef = useRef<SVGSVGElement>(null);
  
  // Canvas dimensions
  const canvasWidth = 800;
  const canvasHeight = 600;
  const canvasCenter = { x: canvasWidth / 2, y: canvasHeight / 2 };

  const handleVectorSelect = (vector: ClinicalVector) => {
    setSelectedVector(vector);
    if (onVectorSelect) {
      onVectorSelect(vector);
    }
  };
  
  // Group vectors by type for better visualization
  const vectorsByType = useMemo(() => {
    const groups: Record<VectorType, ClinicalVector[]> = {
      diagnostic: [],
      temporal: [],
      causal: [],
      comparative: [],
      predictive: []
    };
    
    vectors.forEach(vector => {
      groups[vector.type].push(vector);
    });
    
    return groups;
  }, [vectors]);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-600">
      
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Clinical Evidence → Diagnosis</h3>
            <p className="text-gray-400 text-sm">Vector convergence analysis for rheumatoid arthritis</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
            >
              {showLabels ? 'Hide' : 'Show'} Labels
            </button>
            
            <div className="text-right">
              <div className="text-xs text-gray-400">Evidence Vectors</div>
              <div className="text-lg font-mono text-white">{vectors.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Visualization */}
      <svg 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)' }}
      >
        {/* Diagnostic target circles */}
        <g>
          <circle
            cx={canvasCenter.x}
            cy={canvasCenter.y}
            r={60}
            fill="none"
            stroke="rgba(100, 116, 139, 0.3)"
            strokeWidth={1}
            strokeDasharray="3,3"
          />
          <circle
            cx={canvasCenter.x}
            cy={canvasCenter.y}
            r={100}
            fill="none"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth={1}
            strokeDasharray="5,5"
          />
        </g>
        
        {/* Evidence vectors */}
        {vectors.map((vector, index) => (
          <EvidenceVector
            key={vector.id}
            vector={vector}
            isSelected={selectedVector?.id === vector.id}
            onClick={() => handleVectorSelect(vector)}
            diagnosticCenter={convergencePoint}
            canvasCenter={canvasCenter}
            allVectors={vectors}
          />
        ))}
        
        {/* Diagnostic conclusion */}
        <DiagnosticConclusion
          vectors={vectors}
          canvasCenter={canvasCenter}
          selectedVector={selectedVector || undefined}
        />
      </svg>

      {/* Evidence Panel */}
      <div className="absolute top-20 left-4 bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 w-72 border border-slate-600">
        <h4 className="text-white font-semibold mb-3">Clinical Evidence</h4>
        
        {selectedVector ? (
          <div className="space-y-3">
            <div className="p-3 bg-slate-800 rounded-lg">
              <h5 className="text-cyan-400 font-medium text-sm mb-2">{selectedVector.label}</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Type:</span>
                  <div className="text-white capitalize">{selectedVector.type}</div>
                </div>
                <div>
                  <span className="text-gray-400">Confidence:</span>
                  <div className="text-green-400 font-mono">{(selectedVector.magnitude * 100).toFixed(1)}%</div>
                </div>
              </div>
              
              {selectedVector.metadata && (
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <span className="text-gray-400 text-xs">Context:</span>
                  <div className="text-gray-300 text-xs">
                    {selectedVector.metadata.specialty && `${selectedVector.metadata.specialty} • `}
                    {selectedVector.metadata.timeline && `Timeline: ${selectedVector.metadata.timeline}`}
                    {selectedVector.metadata.test && `Test: ${selectedVector.metadata.test}`}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setSelectedVector(null)}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to overview
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-300">
              Click on any evidence point to see detailed analysis.
            </div>
            
            <div className="space-y-2">
              {Object.entries(vectorsByType).map(([type, typeVectors]) => {
                if (typeVectors.length === 0) return null;
                
                const avgConfidence = typeVectors.reduce((sum, v) => sum + v.magnitude, 0) / typeVectors.length;
                const color = {
                  diagnostic: '#3b82f6',
                  temporal: '#10b981',
                  causal: '#f59e0b', 
                  comparative: '#8b5cf6',
                  predictive: '#ef4444'
                }[type as VectorType];
                
                return (
                  <div key={type} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-gray-300 text-sm capitalize">{type}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-400">{typeVectors.length}x • </span>
                      <span className="text-white font-mono">{(avgConfidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
        <h5 className="text-white text-sm font-medium mb-2">Evidence Types</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">Lab Results</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Symptoms</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-gray-300">Risk Factors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-300">Demographics</span>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-sm rounded-lg p-3 border border-slate-600 max-w-xs">
        <div className="text-xs text-gray-400">
          Each vector represents clinical evidence pointing toward the diagnosis. 
          Vector length = confidence strength. All vectors converge on the central diagnosis.
        </div>
      </div>
    </div>
  );
};
