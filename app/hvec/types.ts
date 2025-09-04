/**
 * HVEC (HENRY VECTOR Enhancement Component) Type Definitions
 * 
 * VectorForge Pedagogical Commentary:
 * These interfaces represent the mathematical foundations of our quantum-enhanced 
 * clinical intelligence system. Each type encodes a different aspect of medical 
 * reasoning, from basic vector representations to complex diagnostic hypotheses.
 * 
 * The elegance emerges from how these simple mathematical primitives compose 
 * into sophisticated clinical intelligence patterns.
 */

// ========================================================================
// FOUNDATIONAL QUANTUM TYPES
// ========================================================================

/**
 * Quantum State Representation for Clinical Data
 * 
 * In quantum mechanics, states exist in superposition until measured.
 * Similarly, clinical findings exist in probabilistic superposition
 * until diagnostic convergence occurs.
 */
export interface QuantumState {
  amplitude: number;        // Probability amplitude (0-1)
  phase: number;           // Quantum phase angle (0-2π)
  entangled: boolean;      // Whether this state affects others
  measurementBasis: string; // The clinical context that collapses superposition
}

/**
 * 3D Vector Representation for Clinical Vectors
 * 
 * Every piece of clinical data can be represented as a vector in 
 * high-dimensional diagnostic space. The direction indicates the 
 * clinical significance, magnitude represents confidence.
 */
export interface ClinicalVector {
  id: string;
  origin: Point3D;
  terminus: Point3D;
  magnitude: number;        // Confidence level (0-1)
  direction: Point3D;       // Normalized direction vector
  type: VectorType;
  label: string;
  metadata: Record<string, any>;
  quantumState?: QuantumState;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export type VectorType = 
  | 'diagnostic'    // Points toward specific diagnosis
  | 'temporal'      // Represents change over time
  | 'causal'        // Indicates causal relationships
  | 'comparative'   // Compares to population norms
  | 'predictive';   // Forecasts future states

// ========================================================================
// DIAGNOSTIC HYPOTHESIS SYSTEM
// ========================================================================

/**
 * Bayesian Diagnostic Hypothesis with Quantum Probability Distributions
 * 
 * Traditional diagnostic systems use simple probability scores.
 * Our quantum-enhanced system maintains full probability distributions
 * that evolve dynamically as evidence accumulates.
 */
export interface DiagnosticHypothesis {
  id: string;
  condition: string;
  icd10Code?: string;
  
  // Quantum probability distribution instead of single probability
  probabilityDistribution: ProbabilityDistribution;
  
  // Information-theoretic measures
  informationGain: number;        // Bits of diagnostic information
  entropy: number;                // Remaining uncertainty
  surprisal: number;              // How unexpected this hypothesis is
  
  // Supporting evidence vectors
  supportingVectors: ClinicalVector[];
  contradictoryVectors: ClinicalVector[];
  
  // Temporal dynamics
  evolutionHistory: HypothesisEvolution[];
  
  // Cross-specialty connections
  crossSpecialtyLinks: SpecialtyBridge[];
  
  metadata: {
    confidence: number;
    clinicalSignificance: 'low' | 'moderate' | 'high' | 'critical';
    urgency: 'routine' | 'urgent' | 'emergent';
    complexity: 'simple' | 'moderate' | 'complex' | 'quantum';
  };
}

export interface ProbabilityDistribution {
  mean: number;
  variance: number;
  confidence_interval_95: [number, number];
  pdf_samples: Array<{ x: number; y: number }>; // For visualization
  cdf_samples: Array<{ x: number; y: number }>; // Cumulative distribution
}

export interface HypothesisEvolution {
  timestamp: Date;
  probabilityBefore: number;
  probabilityAfter: number;
  trigger: string;              // What caused the probability update
  evidenceAdded: string[];      // New evidence that triggered update
  reasoningStep: string;        // Natural language explanation
}

// ========================================================================
// PATTERN CONSTELLATION SYSTEM
// ========================================================================

/**
 * Cross-Specialty Pattern Constellation
 * 
 * Represents patterns that span multiple medical specialties.
 * Like astronomical constellations, these are meaningful arrangements
 * of clinical findings that create recognizable diagnostic patterns.
 */
export interface PatternConstellation {
  id: string;
  name: string;
  description: string;
  
  // Vector embedding for similarity search
  embedding: number[];          // High-dimensional embedding vector
  
  // Clinical components of the pattern
  components: ConstellationComponent[];
  
  // Cross-specialty bridges
  specialtyBridges: SpecialtyBridge[];
  
  // Pattern significance metrics
  significance: {
    prevalence: number;           // How common this pattern is
    specificity: number;          // How specific to certain conditions
    sensitivity: number;          // How often it appears when condition present
    clinicalImpact: number;       // How much it changes management
  };
  
  // Discovery metadata
  discoveryMetadata: {
    discoveredBy: string;
    validatedBy: string[];
    dateDiscovered: Date;
    validationStudies: string[];
  };
}

export interface ConstellationComponent {
  type: 'symptom' | 'sign' | 'lab' | 'imaging' | 'history';
  value: string;
  weight: number;               // Importance within the constellation
  temporalPosition: number;     // When in disease progression (0-1)
  specialty: string;
}

export interface SpecialtyBridge {
  fromSpecialty: string;
  toSpecialty: string;
  connectionType: 'causal' | 'comorbid' | 'differential' | 'masquerade';
  strength: number;             // How strong the connection is
  clinicalReasoning: string;    // Why this bridge exists
}

// ========================================================================
// TEMPORAL REASONING SYSTEM (Clinical Time Machine)
// ========================================================================

/**
 * Temporal Trajectory for Disease Progression Modeling
 * 
 * Represents the path a patient's condition takes through time,
 * including counterfactual trajectories showing what would have
 * happened under different intervention scenarios.
 */
export interface TemporalTrajectory {
  id: string;
  patientId: string;
  
  // Trajectory classification
  type: 'actual' | 'simulated' | 'optimal' | 'counterfactual';
  
  // Time series data
  timePoints: TemporalPoint[];
  
  // Intervention analysis
  interventions: Intervention[];
  divergencePoints: DivergencePoint[];
  
  // Outcome predictions with uncertainty
  predictions: OutcomePrediction[];
  
  // Causal analysis
  causalFactors: CausalFactor[];
  
  metadata: {
    confidenceLevel: number;
    simulationParameters: Record<string, any>;
    modelVersion: string;
    computationTime: number;
  };
}

export interface TemporalPoint {
  timestamp: Date;
  clinicalState: ClinicalState;
  vector: ClinicalVector;
  events: ClinicalEvent[];
}

export interface ClinicalState {
  vitalSigns: Record<string, number>;
  labValues: Record<string, number>;
  symptoms: string[];
  medications: string[];
  functionalStatus: number;      // 0-100 scale
  qualityOfLife: number;         // 0-100 scale
}

export interface Intervention {
  timestamp: Date;
  type: 'medication' | 'procedure' | 'lifestyle' | 'monitoring';
  description: string;
  expectedOutcome: OutcomePrediction;
  actualOutcome?: OutcomePrediction;
  costBenefit: CostBenefitAnalysis;
}

// ========================================================================
// COGNITIVE LOAD BALANCING SYSTEM
// ========================================================================

/**
 * Cognitive Load Assessment and UI Adaptation
 * 
 * Monitors physician cognitive state and adapts interface complexity.
 * Based on cognitive psychology research showing that optimal information
 * presentation varies with mental workload and expertise level.
 */
export interface CognitiveLoadProfile {
  userId: string;
  timestamp: Date;
  
  // Current cognitive load assessment
  currentLoad: CognitiveLoad;
  
  // User preferences and capabilities
  expertiseLevel: ExpertiseLevel;
  preferredComplexity: ComplexityPreference;
  
  // Adaptation parameters
  adaptationSettings: AdaptationSettings;
  
  // Performance metrics
  performanceMetrics: PerformanceMetrics;
}

export interface CognitiveLoad {
  overall: number;              // 0-100 scale
  components: {
    intrinsic: number;          // Task complexity
    extraneous: number;         // UI/UX overhead
    germane: number;            // Learning-related load
  };
  factors: {
    timeConstraint: number;     // Time pressure level
    taskComplexity: number;     // Clinical case complexity
    interruptions: number;      // Recent interruption count
    fatigue: number;            // Estimated fatigue level
  };
}

export type ExpertiseLevel = 
  | 'novice'        // Medical student level
  | 'intermediate'  // Resident level
  | 'expert'        // Attending physician level
  | 'quantum';      // Quantum-enhanced cognition level

export type ComplexityPreference = 
  | 'minimal'       // Show only critical information
  | 'standard'      // Balanced information density
  | 'detailed'      // High information density
  | 'comprehensive'; // Maximum available information

// ========================================================================
// COLLABORATIVE INTELLIGENCE NETWORK
// ========================================================================

/**
 * Network Intelligence Node for Collaborative Reasoning
 * 
 * Represents a node in the distributed clinical intelligence network.
 * Each node can share insights while preserving patient privacy through
 * federated learning and differential privacy techniques.
 */
export interface IntelligenceNode {
  id: string;
  institution: string;
  
  // Network participation metrics
  contributionScore: number;    // How much this node contributes
  reputationScore: number;      // Peer-assessed reputation
  specialtyExpertise: string[]; // Areas of expertise
  
  // Privacy-preserving collaboration
  privacySettings: PrivacySettings;
  sharingPreferences: SharingPreferences;
  
  // Performance metrics
  diagnosticAccuracy: number;
  responseTime: number;
  availabilityScore: number;
  
  // Current active collaborations
  activeCollaborations: Collaboration[];
}

export interface Collaboration {
  id: string;
  participants: string[];      // Node IDs
  caseFingerprint: string;     // Privacy-preserving case identifier
  collaborationType: 'consultation' | 'second_opinion' | 'pattern_matching';
  status: 'active' | 'completed' | 'cancelled';
  insights: CollaborativeInsight[];
}

// ========================================================================
// INSIGHT ARCHAEOLOGY SYSTEM
// ========================================================================

/**
 * Archaeological Insight Discovery
 * 
 * Represents patterns discovered by mining through historical clinical data.
 * Like archaeological discoveries, these insights reveal hidden structures
 * and relationships that weren't visible on the surface.
 */
export interface ArchaeologicalInsight {
  id: string;
  discoveryTimestamp: Date;
  
  // Pattern characteristics
  pattern: ClinicalPattern;
  significance: InsightSignificance;
  
  // Historical context
  historicalCases: string[];    // Patient IDs where pattern appears
  temporalSpan: DateRange;      // Time period covered
  
  // Clinical implications
  actionableRecommendations: ActionableRecommendation[];
  preventionOpportunities: PreventionOpportunity[];
  
  // Validation status
  validationStatus: 'discovered' | 'hypothesis' | 'validated' | 'refuted';
  evidenceLevel: EvidenceLevel;
  
  // Narrative explanation
  clinicalNarrative: string;    // Human-readable explanation
}

// ========================================================================
// UTILITY TYPES AND ENUMS
// ========================================================================

// Missing type definitions
export interface ClinicalEvent {
  timestamp: Date;
  type: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

export interface DivergencePoint {
  timestamp: Date;
  description: string;
  alternativeOutcomes: string[];
}

export interface OutcomePrediction {
  probability: number;
  timeframe: string;
  description: string;
  confidenceInterval: [number, number];
}

export interface CausalFactor {
  factor: string;
  strength: number;
  evidence: string[];
}

export interface AdaptationSettings {
  autoAdapt: boolean;
  complexityLevel: ComplexityPreference;
  responseDelay: number;
}

export interface PerformanceMetrics {
  taskCompletionTime: number;
  errorRate: number;
  cognitiveEfficiency: number;
}

export interface PrivacySettings {
  dataSharing: boolean;
  anonymization: boolean;
  retentionPeriod: number;
}

export interface SharingPreferences {
  shareInsights: boolean;
  sharePatterns: boolean;
  collaborationLevel: 'minimal' | 'standard' | 'full';
}

export interface CollaborativeInsight {
  id: string;
  contributor: string;
  insight: string;
  confidence: number;
  timestamp: Date;
}

export interface ClinicalPattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  significance: number;
}

export interface InsightSignificance {
  clinicalImpact: number;
  novelty: number;
  actionability: number;
}

export interface ActionableRecommendation {
  action: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeframe: string;
  expectedOutcome: string;
}

export interface PreventionOpportunity {
  intervention: string;
  preventableOutcome: string;
  probability: number;
  timeWindow: string;
}

export type HVECModule = 
  | 'diagnostics'
  | 'archaeology'  
  | 'timeMachine'
  | 'cognitiveLoad'
  | 'constellations'
  | 'collaboration';

export type EvidenceLevel = 
  | 'case_series'
  | 'cohort_study'
  | 'randomized_trial'
  | 'systematic_review'
  | 'meta_analysis';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface CostBenefitAnalysis {
  estimatedCost: number;
  expectedBenefit: number;
  riskAdjustedROI: number;
  qualityAdjustedLifeYears: number;
}

// ========================================================================
// COMPONENT PROPS AND UI TYPES
// ========================================================================

/**
 * Props for the main HVEC components
 * 
 * These define the interfaces between our quantum-enhanced components,
 * ensuring type safety and clear contracts between system layers.
 */
export interface VectorConvergenceVisualizerProps {
  vectors: ClinicalVector[];
  convergencePoint: Point3D;
  interactionMode?: 'exploration' | 'analysis' | 'presentation';
  cognitiveLoad?: CognitiveLoad;
  onVectorSelect?: (vector: ClinicalVector) => void;
  onConvergenceReached?: (point: Point3D) => void;
  onViewDetails?: (vector: ClinicalVector) => void;
  onViewAIReasoning?: (vector: ClinicalVector) => void;
}

export interface HVECDashboardProps {
  patientId?: string;
  initialModule?: HVECModule;
  cognitiveProfile?: CognitiveLoadProfile;
  collaborationEnabled?: boolean;
}

/**
 * VectorForge Architectural Commentary:
 * 
 * These type definitions represent the mathematical substrate upon which
 * our quantum-enhanced clinical intelligence operates. Notice how each
 * interface encodes not just data structure, but semantic meaning and
 * relationships between clinical concepts.
 * 
 * The power emerges from composition - simple vector mathematics combine
 * with probability theory, information theory, and cognitive psychology
 * to create a system that can reason about medicine in ways no traditional
 * system can achieve.
 * 
 * Each type tells a story about how clinical intelligence works, from
 * basic vector convergence to complex cross-specialty pattern recognition.
 * This is pedagogy through code architecture.
 */
