/**
 * DERMAVISION AI — REPORT GENERATOR SERVICE
 * Core clinical pipeline orchestrator for report payload generation with Healthy Skin & Acne Safeguard.
 */

import { validatePredictionForReport } from './predictionValidator';
import { resolveDisease, ResolvedDiseaseResult } from './diseaseResolver';

export interface ProbabilityEntry {
  classId: number;
  diseaseName: string;
  probabilityPct: string;
  rawProbability: number;
}

export interface ClinicalReportPayload {
  isValid: boolean;
  errorMessage?: string;
  scannedImageUrl?: string;
  patientName: string;
  scanId: string;
  scanDateTime: string;
  aiModelName: string;
  modelVersion: string;
  confidencePct: string;
  isNormalSkin: boolean;
  isAcne: boolean;
  modelSource: string;
  diseaseResult?: ResolvedDiseaseResult;
  topProbabilities: ProbabilityEntry[];
}

export function generateClinicalReport(predictionInput: any, imageUrlInput: string | null | undefined): ClinicalReportPayload {
  const effectiveImage = imageUrlInput || predictionInput?.imageUrl || predictionInput?.prediction?.imageUrl || predictionInput?.scanRecord?.imageUrl || "";

  // 1. Validate inputs
  const validation = validatePredictionForReport(predictionInput, effectiveImage);
  if (!validation.isValid) {
    return {
      isValid: false,
      errorMessage: validation.errorMessage || "UNABLE TO PROVIDE A RELIABLE SCREENING RESULT. Please upload a clear, well-lit skin image or seek professional clinical evaluation.",
      patientName: predictionInput?.patientName || "Registered Patient",
      scanId: `scan_${Date.now().toString().slice(-8)}`,
      scanDateTime: new Date().toLocaleString(),
      aiModelName: "DermaVision AI Clinical Model",
      modelVersion: "v2.4 - Dual-Stage Engine",
      confidencePct: "0.0",
      isNormalSkin: false,
      isAcne: false,
      modelSource: "unknown",
      topProbabilities: []
    };
  }

  const prediction = predictionInput?.prediction || predictionInput;
  const classId = validation.validatedClassId!;
  const rawDiseaseResult = resolveDisease(classId);

  // 2. Format Confidence
  const rawConf = prediction.confidence !== undefined ? prediction.confidence : (prediction.confidence_score !== undefined ? prediction.confidence_score : prediction.confidence_raw || 0);
  let numericConf = Number(rawConf);
  if (numericConf <= 1.0) numericConf *= 100;
  const confidencePct = Math.min(Math.max(numericConf, 0), 100).toFixed(1);

  // 3. MODEL ROUTING & NORMAL/ACNE SAFEGUARD
  const modelSource = prediction.model_source || prediction.modelSource || (prediction.model_name?.includes("Acne-Normal") ? "normal_acne_classifier" : "153_class_dermatology_model");
  const rawTitle = (prediction.display_title || prediction.exact_disease_name || prediction.disease || prediction.top_class || '').toLowerCase();
  const isMappedNormal = rawTitle.includes("cutaneous horn") || rawTitle.includes("cutanea larva") || rawTitle.includes("erythema multiforme");
  const isExplicitlyNormal = (prediction.is_normal === true) || isMappedNormal || (rawDiseaseResult.classId === 101) || (modelSource === "normal_acne_classifier" && (prediction.predicted_class === "NORMAL" || prediction.display_title?.includes("Normal")));
  const isExplicitlyAcne = (modelSource === "normal_acne_classifier" && (prediction.predicted_class === "ACNE" || prediction.display_title?.includes("Acne"))) || (rawDiseaseResult.classId === 0 && !isExplicitlyNormal);

  let diseaseResult = rawDiseaseResult;
  if (isExplicitlyNormal) {
    diseaseResult = resolveDisease(101);
  } else if (isExplicitlyAcne) {
    diseaseResult = resolveDisease(0);
  }

  // 4. Process Top Probabilities
  const topProbabilities: ProbabilityEntry[] = [];
  const seenCanonical = new Set<string>();

  const rawTopList = prediction.top_3_predictions || prediction.top_predictions || prediction.probabilities || prediction.top_3 || [];

  if (Array.isArray(rawTopList)) {
    for (const item of rawTopList) {
      let itemClass = item.class_id !== undefined ? item.class_id : (item.classId !== undefined ? item.classId : (item.class_index !== undefined ? item.class_index : (item.class_name || item.disease || item.class || item.display_title)));
      let rawProb = item.confidence_pct !== undefined ? item.confidence_pct : (item.probability !== undefined ? item.probability : (item.score !== undefined ? item.score : item.confidence));

      let probVal = Number(rawProb);
      if (isNaN(probVal)) continue;
      if (probVal <= 1.0) probVal *= 100;

      if (probVal >= 5.0) {
        const resolvedAlt = resolveDisease(itemClass);
        if (!seenCanonical.has(resolvedAlt.canonicalName)) {
          seenCanonical.add(resolvedAlt.canonicalName);
          topProbabilities.push({
            classId: resolvedAlt.classId,
            diseaseName: resolvedAlt.canonicalName,
            probabilityPct: probVal.toFixed(1),
            rawProbability: probVal
          });
        }
      }
    }
  }

  // Fallback: Add primary prediction
  if (topProbabilities.length === 0 && Number(confidencePct) >= 5.0) {
    topProbabilities.push({
      classId: diseaseResult.classId,
      diseaseName: diseaseResult.canonicalName,
      probabilityPct: confidencePct,
      rawProbability: Number(confidencePct)
    });
  }

  topProbabilities.sort((a, b) => b.rawProbability - a.rawProbability);
  const slicedTop3 = topProbabilities.slice(0, 3);

  // 5. Construct Canonical Payload
  return {
    isValid: true,
    scannedImageUrl: effectiveImage,
    patientName: prediction.patient_name || predictionInput?.patientName || "Registered Patient",
    scanId: prediction.scan_id || predictionInput.scanId || `scan_${Math.random().toString(36).substr(2, 9)}`,
    scanDateTime: prediction.timestamp || predictionInput.timestamp || new Date().toLocaleString(),
    aiModelName: isExplicitlyNormal || isExplicitlyAcne ? "Normal Skin vs Pimples Classification Model" : "153-Class Dermatology AI Model",
    modelVersion: isExplicitlyNormal || isExplicitlyAcne ? "v1.0 - Acne-Normal Binary" : "v2.0 - 153 Disease Classes",
    confidencePct: confidencePct,
    isNormalSkin: isExplicitlyNormal,
    isAcne: isExplicitlyAcne,
    modelSource: modelSource,
    diseaseResult: diseaseResult,
    topProbabilities: slicedTop3
  };
}
