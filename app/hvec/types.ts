// HVEC Types - Clean, production-ready type definitions for rheumatology module

export interface ClinicalVector {
  id: string;
  type: VectorType;
  origin: Point3D;
  terminus: Point3D;
  magnitude: number;
  label: string;
  metadata?: Record<string, any>;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export type VectorType = 'diagnostic' | 'temporal' | 'causal' | 'comparative' | 'clinical';