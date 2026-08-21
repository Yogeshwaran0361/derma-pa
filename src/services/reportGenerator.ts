/**
 * DERMAVISION AI — REPORT GENERATOR SERVICE
 * Core clinical pipeline orchestrator for report payload generation with Healthy Skin Safeguard.
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
      modelVersion: "v2.4 - 153 Disease Classes",
      confidencePct: "0.0",
      isNormalSkin: false,
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

  // 3. HEALTHY / NO-VISIBLE-PROBLEM SAFEGUARD
  const isExplicitlyNormal = prediction.is_normal === true || rawDiseaseResult.classId === 101 || (prediction.display_title && prediction.display_title.toLowerCase().includes('normal'));
  const isUncertainWeakPrediction = (prediction.is_low_confidence === true || Number(confidencePct) < 25.0);

  let diseaseResult = rawDiseaseResult;
  if (isExplicitlyNormal) {
    diseaseResult = resolveDisease(101);
  } else if (isUncertainWeakPrediction) {
    // For uncertain / weak model predictions (<25% confidence) on normal skin photos, classify as Healthy Skin
    diseaseResult = resolveDisease(101);
  }

  // 4. Process Top Probabilities (Filter >= 5%, Max Top 3, No Duplicates)
  const topProbabilities: ProbabilityEntry[] = [];
  const seenCanonical = new Set<string>();

  const rawTopList = prediction.top_3_predictions || prediction.top_predictions || prediction.probabilities || prediction.top_3 || [];

  if (Array.isArray(rawTopList)) {
    for (const item of rawTopList) {
      let itemClass = item.class_id !== undefined ? item.class_id : (item.classId !== undefined ? item.classId : (item.class_name || item.disease || item.class || item.display_title));
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

  // Fallback: If topProbabilities is empty, add primary prediction if >= 5%
  if (topProbabilities.length === 0 && Number(confidencePct) >= 5.0) {
    topProbabilities.push({
      classId: diseaseResult.classId,
      diseaseName: diseaseResult.canonicalName,
      probabilityPct: confidencePct,
      rawProbability: Number(confidencePct)
    });
  }

  // Sort descending and slice max top 3
  topProbabilities.sort((a, b) => b.rawProbability - a.rawProbability);
  const slicedTop3 = topProbabilities.slice(0, 3);

  // 5. Construct Payload
  return {
    isValid: true,
    scannedImageUrl: effectiveImage,
    patientName: prediction.patient_name || predictionInput?.patientName || "Registered Patient",
    scanId: prediction.scan_id || predictionInput.scanId || `scan_${Math.random().toString(36).substr(2, 9)}`,
    scanDateTime: prediction.timestamp || predictionInput.timestamp || new Date().toLocaleString(),
    aiModelName: "DermaVision AI Clinical Model",
    modelVersion: "v2.4 - 153 Disease Classes",
    confidencePct,
    isNormalSkin: diseaseResult.isNormalSkin,
    diseaseResult,
    topProbabilities: slicedTop3
  };
}
