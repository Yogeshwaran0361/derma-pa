/**
 * DERMAVISION AI — PREDICTION VALIDATOR SERVICE
 * Validates predictions and uploaded image data before generating clinical reports.
 */

import { diseaseKnowledgeBase } from '../data/diseaseKnowledgeBase';
import { resolveDisease } from './diseaseResolver';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  validatedClassId?: number;
}

export function validatePredictionForReport(predictionInput: any, imageUrl: string | null | undefined): ValidationResult {
  // 1. Verify Prediction object exists
  if (!predictionInput || typeof predictionInput !== 'object') {
    return {
      isValid: false,
      errorMessage: "Unable to generate a reliable screening report for this image. Please rescan using a clear, well-lit image."
    };
  }

  // Unwrap nested prediction object if wrapped (e.g. { success: true, prediction: { ... } })
  const prediction = predictionInput.prediction || predictionInput;

  // 2. Extract and verify Confidence is numeric
  const rawConfidence = prediction.confidence !== undefined ? prediction.confidence : (prediction.confidence_score !== undefined ? prediction.confidence_score : prediction.confidence_raw);
  const numericConf = Number(rawConfidence);
  if (rawConfidence === undefined || rawConfidence === null || isNaN(numericConf)) {
    return {
      isValid: false,
      errorMessage: "Unable to generate a reliable screening report for this image. Please rescan using a clear, well-lit image."
    };
  }

  // 3. Extract Class ID / Class Key / Disease Name
  let classIdRaw = prediction.classId !== undefined
    ? prediction.classId
    : (prediction.class_id !== undefined
      ? prediction.class_id
      : (prediction.top_class || prediction.predicted_class || prediction.display_title || prediction.exactDiseaseName || prediction.disease || prediction.condition));

  if (classIdRaw === undefined || classIdRaw === null) {
    return {
      isValid: false,
      errorMessage: "Unable to generate a reliable screening report for this image. Please rescan using a clear, well-lit image."
    };
  }

  // 4. Resolve disease via resolver
  const resolved = resolveDisease(classIdRaw);
  const parsedId = resolved.classId;

  if (parsedId === null || parsedId < 0 || parsedId > 152 || !diseaseKnowledgeBase[parsedId]) {
    return {
      isValid: false,
      errorMessage: "Unable to generate a reliable screening report for this image. Please rescan using a clear, well-lit image."
    };
  }

  const kbEntry = diseaseKnowledgeBase[parsedId];
  if (!kbEntry || !kbEntry.canonicalName || kbEntry.canonicalName.trim() === '') {
    return {
      isValid: false,
      errorMessage: "Unable to generate a reliable screening report for this image. Please rescan using a clear, well-lit image."
    };
  }

  return {
    isValid: true,
    validatedClassId: parsedId
  };
}
