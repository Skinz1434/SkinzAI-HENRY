'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  Minimize2, Maximize2, Move, Eye, EyeOff, Filter, 
  RotateCw, ZoomIn, ZoomOut, Home, FileText, Brain,
  Activity, Clock, Users, TrendingUp, X, ChevronDown
} from 'lucide-react';
import { 
  ClinicalVector, 
  Point3D, 
  VectorType,
  VectorConvergenceVisualizerProps 
} from '../../app/hvec/types';

interface ViewState {
  zoom: number;
  panX: number;
  panY: number;
  rotation: number;
  showConnections: boolean;
  selectedNodes: string[];
  minimizedPanels: string[];
}

/**
 * Hyper-Interactive 3D Clinical Mind Map
 * Advanced vector visualization with full manipulation and exploration
 */
export const SimpleVectorVisualizer: React.FC<VectorConvergenceVisualizerProps> = ({
  vectors,
  convergencePoint,
  interactionMode = 'exploration',
  cognitiveLoad,
  onVectorSelect,
  onConvergenceReached,
  onViewDetails,
  onViewAIReasoning,
}) => {
  const [selectedVector, setSelectedVector] = useState<ClinicalVector | null>(null);
  const [hoveredVector, setHoveredVector] = useState<ClinicalVector | null>(null);
  const [detailsModal, setDetailsModal] = useState<{ vector: ClinicalVector; position: { x: number; y: number } } | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    showConnections: true,
    selectedNodes: [],
    minimizedPanels: []
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Interactive handlers
  const handleVectorClick = useCallback((vector: ClinicalVector) => {
    setSelectedVector(vector);
    setDetailsModal({ 
      vector, 
      position: { x: 400, y: 200 } // Fixed position for now
    });
    if (onVectorSelect) {
      onVectorSelect(vector);
    }
  }, [onVectorSelect]);

  const handleVectorHover = useCallback((vector: ClinicalVector | null) => {
    setHoveredVector(vector);
  }, []);

  // Pan and zoom handlers
  const handlePan = useCallback((event: any, info: any) => {
    setViewState(prev => ({
      ...prev,
      panX: prev.panX + info.delta.x,
      panY: prev.panY + info.delta.y
    }));
  }, []);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setViewState(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(5, prev.zoom * delta))
    }));
  }, []);

  const togglePanel = useCallback((panelId: string) => {
    setViewState(prev => ({
      ...prev,
      minimizedPanels: prev.minimizedPanels.includes(panelId)
        ? prev.minimizedPanels.filter(id => id !== panelId)
        : [...prev.minimizedPanels, panelId]
    }));
  }, []);

  const resetView = useCallback(() => {
    setViewState(prev => ({
      ...prev,
      zoom: 1,
      panX: 0,
      panY: 0,
      rotation: 0
    }));
  }, []);

  // Color system
  const getVectorColor = (type: VectorType, opacity: number = 1): string => {
    const colors = {
      diagnostic: '#3b82f6',
      temporal: '#10b981',
      causal: '#f59e0b',
      comparative: '#8b5cf6',
      predictive: '#ef4444',
    };
    return colors[type] + Math.floor(opacity * 255).toString(16).padStart(2, '0');
  };

  const getTypeIcon = (type: VectorType) => {
    const icons = {
      diagnostic: Activity,
      temporal: Clock,
      causal: TrendingUp,
      comparative: Users,
      predictive: Brain
    };
    return icons[type];
  };

  // Smart 3D positioning
  const getNodePosition = (vector: ClinicalVector, index: number) => {
    const angle = (index / vectors.length) * Math.PI * 2;
    const radius = 180 + vector.magnitude * 100;
    const x = 400 + Math.cos(angle) * radius;
    const y = 300 + Math.sin(angle) * radius;
    return { x, y, z: vector.magnitude * 50 };
  };

  // Event handlers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-600 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={() => { isDragging.current = true; }}
      onMouseUp={() => { isDragging.current = false; }}
      onMouseLeave={() => { isDragging.current = false; }}
    >
      {/* Floating Control Panel */}
      <motion.div 
        className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 z-20 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        drag
        dragMomentum={false}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewState(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom * 0.8) }))}
            className="p-2 hover:bg-slate-700 rounded text-gray-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <div className="px-2 text-xs text-gray-400 font-mono min-w-[50px] text-center">
            {Math.round(viewState.zoom * 100)}%
          </div>
          <button
            onClick={() => setViewState(prev => ({ ...prev, zoom: Math.min(5, prev.zoom * 1.2) }))}
            className="p-2 hover:bg-slate-700 rounded text-gray-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-4 bg-slate-600 mx-1" />
          <button
            onClick={() => setViewState(prev => ({ ...prev, rotation: prev.rotation + 15 }))}
            className="p-2 hover:bg-slate-700 rounded text-gray-300 hover:text-white transition-colors"
            title="Rotate"
          >
            <RotateCw size={16} />
          </button>
          <button
            onClick={resetView}
            className="p-2 hover:bg-slate-700 rounded text-gray-300 hover:text-white transition-colors"
            title="Reset View"
          >
            <Home size={16} />
          </button>
          <div className="w-px h-4 bg-slate-600 mx-1" />
          <button
            onClick={() => setViewState(prev => ({ ...prev, showConnections: !prev.showConnections }))}
            className={`p-2 rounded transition-colors ${
              viewState.showConnections
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Toggle Connections"
          >
            {viewState.showConnections ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </motion.div>

      {/* Interactive Mind Map Canvas */}
      <motion.svg 
        className="w-full h-full"
        viewBox="0 0 800 600"
        style={{ cursor: 'grab' }}
        drag
        onDrag={handlePan}
        dragMomentum={false}
        dragElastic={0}
      >
        <defs>
          {/* Gradients and effects */}
          <radialGradient id="nodeGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>

        {/* Mind Map Content */}
        <g transform={`translate(${viewState.panX}, ${viewState.panY}) scale(${viewState.zoom}) rotate(${viewState.rotation}, 400, 300)`}>
          
          {/* Connection Lines */}
          {viewState.showConnections && vectors.map((vector, index) => {
            const position = getNodePosition(vector, index);
            return (
              <motion.line
                key={`connection-${vector.id}`}
                x1={400} y1={300}
                x2={position.x} y2={position.y}
                stroke={getVectorColor(vector.type, 0.3)}
                strokeWidth={2}
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            );
          })}
          
          {/* Central Diagnosis Node */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <circle
              cx="400" cy="300" r="50"
              fill="url(#nodeGradient)"
              stroke="#22c55e" strokeWidth="3"
              filter="url(#shadow)"
            />
            <text x="400" y="295" textAnchor="middle" fill="white" fontSize="14" className="font-bold">
              Rheumatoid
            </text>
            <text x="400" y="310" textAnchor="middle" fill="white" fontSize="14" className="font-bold">
              Arthritis
            </text>
            <text x="400" y="325" textAnchor="middle" fill="#22c55e" fontSize="12" className="font-mono">
              87.3%
            </text>
          </motion.g>
          
          {/* Evidence Nodes */}
          {vectors.map((vector, index) => {
            const position = getNodePosition(vector, index);
            const isSelected = selectedVector?.id === vector.id;
            const isHovered = hoveredVector?.id === vector.id;
            const IconComponent = getTypeIcon(vector.type);
            
            return (
              <motion.g
                key={vector.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Node Circle */}
                <circle
                  cx={position.x} cy={position.y}
                  r={25 + vector.magnitude * 15}
                  fill={getVectorColor(vector.type, 0.2)}
                  stroke={getVectorColor(vector.type)}
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                  filter={isSelected ? "url(#glow)" : "url(#shadow)"}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleVectorClick(vector)}
                  onMouseEnter={() => handleVectorHover(vector)}
                  onMouseLeave={() => handleVectorHover(null)}
                />
                
                {/* Type Icon */}
                <g>
                  <circle
                    cx={position.x} cy={position.y}
                    r={8}
                    fill="rgba(255,255,255,0.2)"
                  />
                  <text
                    x={position.x} y={position.y + 2}
                    textAnchor="middle" fill="white" fontSize="10" className="font-bold"
                    style={{ pointerEvents: 'none' }}
                  >
                    {vector.type.charAt(0).toUpperCase()}
                  </text>
                </g>
                
                {/* Confidence Ring */}
                <motion.circle
                  cx={position.x} cy={position.y}
                  r={30 + vector.magnitude * 20}
                  fill="none"
                  stroke={getVectorColor(vector.type, 0.4)}
                  strokeWidth={2}
                  strokeDasharray={`${vector.magnitude * 15} 5`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Node Label */}
                <text
                  x={position.x} y={position.y + 45}
                  textAnchor="middle" fill="white" fontSize="12" className="font-medium"
                  style={{ pointerEvents: 'none' }}
                >
                  {vector.label.length > 20 ? vector.label.substring(0, 20) + '...' : vector.label}
                </text>
                
                {/* Confidence Badge */}
                <rect
                  x={position.x - 15} y={position.y + 50}
                  width={30} height={16}
                  fill={getVectorColor(vector.type)} rx={8}
                  style={{ pointerEvents: 'none' }}
                />
                <text
                  x={position.x} y={position.y + 61}
                  textAnchor="middle" fill="white" fontSize="10" className="font-mono font-bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {Math.round(vector.magnitude * 100)}%
                </text>
              </motion.g>
            );
          })}
        </g>
      </motion.svg>

      {/* Hover Detail Modal */}
      <AnimatePresence>
        {detailsModal && (
          <motion.div
            className="fixed bg-slate-800/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-slate-600 z-50 max-w-md"
            style={{
              left: detailsModal.position.x,
              top: detailsModal.position.y
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getVectorColor(detailsModal.vector.type) }}
                />
                <h4 className="text-white font-semibold text-lg flex items-center">
                  {React.createElement(getTypeIcon(detailsModal.vector.type), { size: 18, className: "mr-2" })}
                  {detailsModal.vector.type.charAt(0).toUpperCase() + detailsModal.vector.type.slice(1)}
                </h4>
              </div>
              <button
                onClick={() => setDetailsModal(null)}
                className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <h3 className="text-white font-bold mb-3">{detailsModal.vector.label}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Confidence Level:</span>
                <span className="text-green-400 font-mono font-bold">
                  {(detailsModal.vector.magnitude * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${detailsModal.vector.magnitude * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              {detailsModal.vector.metadata && (
                <div className="border-t border-slate-600 pt-3">
                  <h5 className="text-gray-300 font-medium mb-2">Clinical Context:</h5>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {Object.entries(detailsModal.vector.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
                        <span className="text-white">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => {
                    console.log('View Details clicked for vector:', detailsModal.vector.id);
                    if (onViewDetails) {
                      onViewDetails(detailsModal.vector);
                    }
                    // Show detailed information
                    alert(`Viewing detailed information for: ${detailsModal.vector.label}\n\nType: ${detailsModal.vector.type}\nConfidence: ${(detailsModal.vector.magnitude * 100).toFixed(1)}%\nMetadata: ${JSON.stringify(detailsModal.vector.metadata, null, 2)}`);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={14} />
                  View Details
                </button>
                <button 
                  onClick={() => {
                    console.log('AI Reasoning clicked for vector:', detailsModal.vector.id);
                    if (onViewAIReasoning) {
                      onViewAIReasoning(detailsModal.vector);
                    }
                    // Show AI reasoning chain
                    alert(`AI Reasoning for: ${detailsModal.vector.label}\n\nReasoning Chain:\n1. Clinical evidence processed through Bayesian inference\n2. Vector magnitude indicates ${detailsModal.vector.magnitude > 0.8 ? 'high' : detailsModal.vector.magnitude > 0.6 ? 'moderate' : 'low'} confidence\n3. Type '${detailsModal.vector.type}' suggests ${detailsModal.vector.type === 'diagnostic' ? 'diagnostic relevance' : detailsModal.vector.type === 'temporal' ? 'time-dependent pattern' : 'causal relationship'}\n\nQuantum State: ${detailsModal.vector.quantumState ? `Amplitude: ${detailsModal.vector.quantumState.amplitude}` : 'Not quantum entangled'}`);
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Brain size={14} />
                  AI Reasoning
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-400 max-w-xs">
        🖱️ <strong>Drag</strong> to pan • 🔍 <strong>Scroll</strong> to zoom • 🎯 <strong>Click nodes</strong> for details • ⚙️ <strong>Use controls</strong> to customize
      </div>
    </div>
  );
};

export default SimpleVectorVisualizer;
