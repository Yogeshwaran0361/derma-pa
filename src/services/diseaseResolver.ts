/**
 * DERMAVISION AI — DISEASE RESOLVER SERVICE
 * Maps predicted model Class IDs and raw string labels to Canonical Disease Names
 * and fetches the exact structured Knowledge Base Entry.
 */

import { diseaseKnowledgeBase, DiseaseKnowledgeSchema } from '../data/diseaseKnowledgeBase';

export interface ResolvedDiseaseResult {
  classId: number;
  internalClassName: string;
  canonicalName: string;
  knowledgeBaseEntry: DiseaseKnowledgeSchema;
  isNormalSkin: boolean;
}

export interface ProbabilityEntry {
  classId: number;
  diseaseName: string;
  probabilityPct: string;
  rawProbability: number;
}

export interface CanonicalScanResult {
  scanId: string;
  imageUrl: string;
  classId: number;
  internalClassName: string;
  diseaseName: string;
  confidence: number;
  confidencePct: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  riskColor: string;
  isHealthy: boolean;
  description: string;
  knowledgeBaseEntry: DiseaseKnowledgeSchema;
  topProbabilities: ProbabilityEntry[];
  scanDate: string;
  modelName: string;
  isValid: boolean;
  rawPredictionInput: any;
}

const ALIAS_MAP: Record<string, number> = {
  'acne': 0,
  'acne_rosacea': 0,
  'pimple': 0,
  'pustule': 0,
  'actinic_keratosis': 1,
  'alopecia_areata': 2,
  'bcc': 9,
  'basal_cell_carcinoma': 9,
  'bullous': 16,
  'bullous_pemphigoid': 16,
  'blister': 16,
  'blistering': 16,
  'drugeruption': 35,
  'drug_eruption': 35,
  'eczema': 38,
  'dermatitis': 38,
  'eczema_and_dermatitis': 38,
  'melanoma': 89,
  'melanoma_malignant': 89,
  'cutaneous_horn': 101,
  'cutanea_larva_migrans': 101,
  'erythema_multiforme': 101,
  'psoriasis': 115,
  'seborrh_keratoses': 125,
  'seborrhkeratoses': 125,
  'seborrheic_keratosis': 125,
  'skincancer': 127,
  'strawberry_hemangioma': 133,
  'sun_sunlight_damage': 136,
  'tinea': 138,
  'fungal_infection': 138,
  'tinea_fungal_infection': 138,
  'vitiligo': 149,
  'warts': 148,
  'verruca_vulgaris': 147,
  'normal_/_healthy_skin_(benign_feature)': 101,
  'normal_healthy_skin': 101,
  'healthy_skin': 101,
  'normal_skin': 101
};

/**
 * Resolves a model Class ID or raw prediction string to its canonical disease object
 */
export function resolveDisease(classIdInput: number | string): ResolvedDiseaseResult {
  let resolvedId: number | null = null;
  let rawString = String(classIdInput !== undefined && classIdInput !== null ? classIdInput : '').trim();
  const normalizedKey = rawString.toLowerCase().replace(/[\s\-_]+/g, '_');

  // 1. Check if direct integer or numeric string
  if (typeof classIdInput === 'number' && !isNaN(classIdInput)) {
    resolvedId = Math.floor(classIdInput);
  } else if (/^\d{1,3}$/.test(rawString)) {
    resolvedId = parseInt(rawString, 10);
  } else {
    const classMatch = rawString.match(/^class_?(\d{1,3})$/i);
    if (classMatch) {
      resolvedId = parseInt(classMatch[1], 10);
    }
  }

  // 2. Check explicit ALIAS_MAP
  if (resolvedId === null && ALIAS_MAP[normalizedKey] !== undefined) {
    resolvedId = ALIAS_MAP[normalizedKey];
  }

  // 3. Check explicit normal / healthy keywords if not matched by number
  if (
    resolvedId === null &&
    (normalizedKey === '101' ||
     normalizedKey === 'normal_skin' ||
     normalizedKey === 'healthy_skin' ||
     normalizedKey === 'normal_healthy_skin')
  ) {
    resolvedId = 101;
  }

  // 2. Check ALIAS_MAP
  if (resolvedId === null && ALIAS_MAP[normalizedKey] !== undefined) {
    resolvedId = ALIAS_MAP[normalizedKey];
  }

  // 3. Fallback search by canonicalName or alternateNames
  if (resolvedId === null || resolvedId < 0 || resolvedId > 152 || !diseaseKnowledgeBase[resolvedId]) {
    const searchTarget = rawString.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [idStr, entry] of Object.entries(diseaseKnowledgeBase)) {
      const idNum = parseInt(idStr, 10);
      const canonClean = entry.canonicalName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (canonClean === searchTarget) {
        resolvedId = idNum;
        break;
      }
      for (const alt of entry.alternateNames) {
        if (alt.toLowerCase().replace(/[^a-z0-9]/g, '') === searchTarget) {
          resolvedId = idNum;
          break;
        }
      }
      if (resolvedId !== null) break;
    }
  }

  // Safety fallback: default to 101 if unresolvable
  if (resolvedId === null || resolvedId < 0 || resolvedId > 152 || !diseaseKnowledgeBase[resolvedId]) {
    if (normalizedKey.includes('normal') || normalizedKey.includes('healthy')) {
      resolvedId = 101;
    } else {
      resolvedId = 0;
    }
  }

  const kbEntry = diseaseKnowledgeBase[resolvedId];
  const isNormalSkin = resolvedId === 101;

  return {
    classId: resolvedId,
    internalClassName: `class_${resolvedId}`,
    canonicalName: isNormalSkin ? "Normal / Healthy Skin" : kbEntry.canonicalName,
    knowledgeBaseEntry: kbEntry,
    isNormalSkin
  };
}

/**
 * SINGLE SOURCE OF TRUTH CANONICAL SCAN RESULT RESOLVER
 * Converts any prediction JSON, scan record, or state object into one unified CanonicalScanResult.
 */
export function resolveCanonicalScanResult(inputData: any, imagePreviewUrl?: string | null): CanonicalScanResult {
  if (!inputData || typeof inputData !== 'object') {
    const defaultKb = diseaseKnowledgeBase[101];
    return {
      scanId: `scan_${Date.now()}`,
      imageUrl: imagePreviewUrl || '',
      classId: 101,
      internalClassName: 'class_101',
      diseaseName: 'Normal / Healthy Skin',
      confidence: 98.5,
      confidencePct: '98.5',
      riskLevel: 'LOW',
      riskColor: 'emerald',
      isHealthy: true,
      description: defaultKb.clinicalOverview,
      knowledgeBaseEntry: defaultKb,
      topProbabilities: [],
      scanDate: new Date().toLocaleString(),
      modelName: 'DermaVision AI Clinical Model (153 Classes)',
      isValid: false,
      rawPredictionInput: null
    };
  }

  const scanRecord = inputData.scanRecord || (inputData.topClass || inputData.displayTitle ? inputData : null);
  const predictionObj = inputData.prediction || (inputData.predictionData?.prediction) || inputData;

  const rawTarget =
    scanRecord?.topClass ||
    scanRecord?.displayTitle ||
    scanRecord?.diseaseName ||
    inputData.topClass ||
    inputData.displayTitle ||
    inputData.exactDiseaseName ||
    predictionObj.exactDiseaseName ||
    predictionObj.display_title ||
    predictionObj.top_class ||
    predictionObj.predicted_class ||
    predictionObj.classId ||
    predictionObj.class_id ||
    predictionObj.class_index ||
    101;

  const resolved = resolveDisease(rawTarget);
  const classId = resolved.classId;
  const isHealthy = classId === 101;

  const rawConf = scanRecord?.confidence !== undefined
    ? scanRecord.confidence
    : (predictionObj.confidence !== undefined
      ? predictionObj.confidence
      : (predictionObj.confidence_score !== undefined
        ? predictionObj.confidence_score
        : (predictionObj.confidence_raw !== undefined ? predictionObj.confidence_raw : 0.95)));

  let numConf = Number(rawConf);
  if (isNaN(numConf)) numConf = 0;
  if (numConf > 0 && numConf <= 1.0) numConf *= 100;
  const confidencePct = Math.min(Math.max(numConf, 0), 100).toFixed(1);

  const kbEntry = resolved.knowledgeBaseEntry;
  const severity: 'LOW' | 'MODERATE' | 'HIGH' = isHealthy ? 'LOW' : kbEntry.severity;
  const riskLevelText = isHealthy ? 'LOW' : (severity === 'HIGH' ? 'HIGH' : severity === 'MODERATE' ? 'MODERATE' : 'LOW');
  const riskColor = isHealthy ? 'emerald' : (severity === 'HIGH' ? 'rose' : severity === 'MODERATE' ? 'amber' : 'emerald');

  const effectiveImage = imagePreviewUrl || scanRecord?.imageUrl || inputData.imageUrl || predictionObj.imageUrl || inputData.imagePreviewUrl || '';

  const rawTopList = predictionObj.top_3_predictions || predictionObj.top_predictions || predictionObj.probabilities || predictionObj.top_3 || [];
  const topProbabilities: ProbabilityEntry[] = [];
  const seenCanonical = new Set<string>();

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

  if (topProbabilities.length === 0 && Number(confidencePct) >= 5.0) {
    topProbabilities.push({
      classId: resolved.classId,
      diseaseName: resolved.canonicalName,
      probabilityPct: confidencePct,
      rawProbability: Number(confidencePct)
    });
  }

  topProbabilities.sort((a, b) => b.rawProbability - a.rawProbability);

  return {
    scanId: scanRecord?.id || scanRecord?.scanId || inputData.scanId || `scan_${Date.now().toString().slice(-8)}`,
    imageUrl: effectiveImage,
    classId,
    internalClassName: `class_${classId}`,
    diseaseName: resolved.canonicalName,
    confidence: Number(confidencePct),
    confidencePct,
    riskLevel: riskLevelText,
    riskColor,
    isHealthy,
    description: isHealthy ? "Your uploaded image was evaluated as Normal / Healthy Skin. No supported skin abnormality was identified by the AI screening model." : kbEntry.clinicalOverview,
    knowledgeBaseEntry: kbEntry,
    topProbabilities: topProbabilities.slice(0, 3),
    scanDate: scanRecord?.scanDate || inputData.timestamp || new Date().toLocaleString(),
    modelName: "DermaVision AI Clinical Model (153 Classes)",
    isValid: true,
    rawPredictionInput: inputData
  };
}
