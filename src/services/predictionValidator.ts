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
  // 1. Verify Prediction object exists and check hard non-skin rejection status
  if (!predictionInput || typeof predictionInput !== 'object') {
    return {
      isValid: false,
      errorMessage: "No human skin detected in this image. Clinical disease report cannot be generated."
    };
  }

  // Check explicit failure / invalid image flags
  if (
    predictionInput.success === false ||
    predictionInput.is_invalid_image === true ||
    predictionInput.error_type === 'INVALID_IMAGE' ||
    predictionInput.status === 'INVALID_IMAGE' ||
    predictionInput.status === 'NON_SKIN' ||
    predictionInput.status === 'UNCERTAIN'
  ) {
    return {
      isValid: false,
      errorMessage: predictionInput.detail || "No human skin detected in this image. Clinical disease report cannot be generated."
    };
  }

  // Unwrap nested prediction object if wrapped
  const prediction = predictionInput.prediction || predictionInput;

  if (
    prediction.is_invalid_image === true ||
    prediction.status === 'INVALID_IMAGE' ||
    prediction.status === 'NON_SKIN'
  ) {
    return {
      isValid: false,
      errorMessage: "No human skin detected in this image. Clinical disease report cannot be generated."
    };
  }

  // 2. Extract Class ID / Class Key / Disease Name
  const classIdRaw = prediction.classId !== undefined
    ? prediction.classId
    : (prediction.class_id !== undefined
      ? prediction.class_id
      : (prediction.class_index !== undefined
        ? prediction.class_index
        : (prediction.class_idx !== undefined
          ? prediction.class_idx
          : (predictionInput.class_index !== undefined
            ? predictionInput.class_index
            : (prediction.top_class || prediction.predicted_class || prediction.display_title || prediction.exactDiseaseName || prediction.className || prediction.technicalClass || prediction.disease || prediction.condition)))));

  if (classIdRaw === undefined || classIdRaw === null) {
    return {
      isValid: false,
      errorMessage: "Unable to resolve skin classification for this image."
    };
  }

  // 3. Resolve disease via resolver
  const resolved = resolveDisease(classIdRaw);
  const parsedId = resolved.classId;

  if (parsedId === null) {
    return {
      isValid: false,
      errorMessage: "Unrecognized disease classification."
    };
  }

  return {
    isValid: true,
    validatedClassId: parsedId
  };
}
