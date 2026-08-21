/**
 * DERMAVISION AI — REPORT GENERATOR SERVICE
 */

import { validatePredictionForReport } from './predictionValidator.js';
import { resolveDisease } from './diseaseResolver.js';

export function generateClinicalReport(predictionInput, imageUrlInput) {
  const effectiveImage = imageUrlInput || predictionInput?.imageUrl || predictionInput?.prediction?.imageUrl || predictionInput?.scanRecord?.imageUrl || "";

  const validation = validatePredictionForReport(predictionInput, effectiveImage);
  if (!validation.isValid) {
    return {
      isValid: false,
      errorMessage: validation.errorMessage || "Unable to generate a reliable screening report for this image. Please rescan using a clear, well-lit image.",
      patientName: "Yogesh",
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
  const classId = validation.validatedClassId;
  const rawDiseaseResult = resolveDisease(classId);

  const rawConf = prediction.confidence !== undefined ? prediction.confidence : (prediction.confidence_score !== undefined ? prediction.confidence_score : prediction.confidence_raw || 0);
  let numericConf = Number(rawConf);
  if (numericConf <= 1.0) numericConf *= 100;
  const confidencePct = Math.min(Math.max(numericConf, 0), 100).toFixed(1);

  // HEALTHY / NO-VISIBLE-PROBLEM SAFEGUARD
  const isExplicitlyNormal = prediction.is_normal === true || rawDiseaseResult.classId === 101;
  const isUncertainWeakPrediction = (prediction.is_low_confidence === true || Number(confidencePct) < 40.0);

  let diseaseResult = rawDiseaseResult;
  if (!isExplicitlyNormal && isUncertainWeakPrediction) {
    diseaseResult = resolveDisease(101);
  }

  const topProbabilities = [];
  const rawTopList = prediction.top_3_predictions || prediction.top_predictions || prediction.probabilities || prediction.top_3 || [];

  if (Array.isArray(rawTopList)) {
    for (const item of rawTopList) {
      let itemClass = item.class_id !== undefined ? item.class_id : (item.classId !== undefined ? item.classId : (item.class_name || item.disease || item.class));
      let rawProb = item.confidence_pct !== undefined ? item.confidence_pct : (item.probability !== undefined ? item.probability : (item.score !== undefined ? item.score : item.confidence));

      let probVal = Number(rawProb);
      if (isNaN(probVal)) continue;
      if (probVal <= 1.0) probVal *= 100;

      if (probVal >= 5.0) {
        const resolvedAlt = resolveDisease(itemClass);
        topProbabilities.push({
          classId: resolvedAlt.classId,
          diseaseName: resolvedAlt.canonicalName,
          probabilityPct: probVal.toFixed(1),
          rawProbability: probVal
        });
      }
    }
  }

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

  return {
    isValid: true,
    scannedImageUrl: effectiveImage,
    patientName: prediction.patient_name || predictionInput.patientName || "Yogesh",
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
