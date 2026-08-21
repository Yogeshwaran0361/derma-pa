export interface QualityCheckMetrics {
  width?: number;
  height?: number;
  blur_score?: number;
  blur_threshold?: number;
  brightness?: number;
  min_required?: number;
  max_allowed?: number;
  skin_ratio?: number;
  green_ratio?: number;
  blue_ratio?: number;
  mono_ratio?: number;
  paper_ratio?: number;
  edge_density?: number;
}

export interface QualityCheckResult {
  passed: boolean;
  is_invalid_image?: boolean;
  is_quality_low?: boolean;
  reason: string;
  detail?: string;
  suggestion: string;
  metrics: QualityCheckMetrics;
}

export interface ClassProbability {
  class_name: string;
  display_title: string;
  confidence: number;
  confidence_pct: number;
  risk_level: string;
  risk_color: string;
}

export interface TopPrediction {
  top_class: string;
  display_title: string;
  confidence: number;
  confidence_raw: number;
  risk_level: string;
  risk_color: string;
  description: string;
  action: string;
  is_normal?: boolean;
  is_unreliable?: boolean;
  is_low_confidence?: boolean;
}

export interface PredictionResponse {
  success: boolean;
  is_invalid_image?: boolean;
  is_quality_low?: boolean;
  is_unreliable?: boolean;
  error_type?: string;
  message?: string;
  detail?: string;
  filename?: string;
  quality?: QualityCheckResult;
  prediction?: TopPrediction | null;
  probabilities?: ClassProbability[] | null;
  top_3_predictions?: ClassProbability[];
}

export interface CanonicalScanResult {
  scanId: string;
  patientId?: string;
  imageUrl: string;
  rawClass: string;
  exactDiseaseName: string;
  confidence: number;
  confidencePct: number;
  probabilities: Array<{
    class_name: string;
    display_title: string;
    confidence_pct: number;
  }>;
  isNormal: boolean;
  isLowConfidence?: boolean;
  modelName: string;
  timestamp: string;
  riskLevel?: string;
  riskColor?: string;
}

export type ScanResult = CanonicalScanResult;
