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

const ALIAS_MAP: Record<string, number> = {
  'bcc': 9,
  'drugeruption': 35,
  'seborrh_keratoses': 125,
  'seborrhkeratoses': 125,
  'strawberry_hemangioma': 133,
  'skincancer': 127,
  'warts': 148,
  'sun_sunlight_damage': 136,
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
  let rawString = String(classIdInput).trim();
  const normalizedKey = rawString.toLowerCase().replace(/[\s\-_]+/g, '_');

  // Check explicit normal / healthy keywords
  if (normalizedKey.includes('normal') || normalizedKey.includes('healthy')) {
    resolvedId = 101;
  }

  // 1. Check if direct integer or numeric string
  if (resolvedId === null) {
    if (typeof classIdInput === 'number' && !isNaN(classIdInput)) {
      resolvedId = Math.floor(classIdInput);
    } else {
      const numMatch = rawString.match(/\b([0-9]{1,3})\b/);
      if (numMatch) {
        resolvedId = parseInt(numMatch[1], 10);
      }
    }
  }

  // 2. Check alias map if string match or out of range
  if (ALIAS_MAP[normalizedKey] !== undefined) {
    resolvedId = ALIAS_MAP[normalizedKey];
  }

  // 3. Fallback search by canonicalName or alternateNames
  if (resolvedId === null || resolvedId < 0 || resolvedId > 152 || !diseaseKnowledgeBase[resolvedId]) {
    for (const [idStr, entry] of Object.entries(diseaseKnowledgeBase)) {
      const idNum = parseInt(idStr, 10);
      const canonNorm = entry.canonicalName.toLowerCase().replace(/[\s\-_]+/g, '_');
      if (canonNorm === normalizedKey || entry.alternateNames.some(alt => alt.toLowerCase().replace(/[\s\-_]+/g, '_') === normalizedKey)) {
        resolvedId = idNum;
        break;
      }
    }
  }

  // Safety fallback: default to 101 if unresolvable
  if (resolvedId === null || resolvedId < 0 || resolvedId > 152 || !diseaseKnowledgeBase[resolvedId]) {
    resolvedId = 101;
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
