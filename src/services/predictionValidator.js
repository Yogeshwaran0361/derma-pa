/**
 * DERMAVISION AI — PREDICTION VALIDATOR SERVICE
 */

import { diseaseKnowledgeBase } from '../data/diseaseKnowledgeBase.js';
import { resolveDisease } from './diseaseResolver.js';

export function validatePredictionForReport(predictionInput, imageUrl) {
  if (!predictionInput || typeof predictionInput !== 'object') {
    return {
      isValid: false,
      errorMessage: "Unable to generate a reliable screening report for this image. Please rescan using a clear, well-lit image."
    };
  }

  const prediction = predictionInput.prediction || predictionInput;

  const rawConfidence = prediction.confidence !== undefined ? prediction.confidence : (prediction.confidence_score !== undefined ? prediction.confidence_score : prediction.confidence_raw);
  const numericConf = Number(rawConfidence);
  if (rawConfidence === undefined || rawConfidence === null || isNaN(numericConf)) {
    return {
      isValid: false,
      errorMessage: "Unable to generate a reliable screening report for this image. Please rescan using a clear, well-lit image."
    };
  }

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
