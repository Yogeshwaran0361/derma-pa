/**
 * DERMAVISION AI — MASTER DISEASE KNOWLEDGE BASE (CLASSES 0–152)
 * Merges Part 1, Part 2, and Part 3 into a single unified knowledge dictionary
 */

import { diseaseKnowledgeBasePart1, DiseaseKnowledgeSchema, DiseaseKnowledgeRecord } from './diseaseKnowledgeBase.part1';
import { diseaseKnowledgeBasePart2 } from './diseaseKnowledgeBase.part2';
import { diseaseKnowledgeBasePart3 } from './diseaseKnowledgeBase.part3';

export type { DiseaseKnowledgeSchema, DiseaseKnowledgeRecord };

export const diseaseKnowledgeBase: DiseaseKnowledgeRecord = {
  ...diseaseKnowledgeBasePart1,
  ...diseaseKnowledgeBasePart2,
  ...diseaseKnowledgeBasePart3
};

/**
 * Master Knowledge Base Validator
 * Verifies all 153 classes (0 to 152) exist and adhere to clinical schema.
 */
export function validateMasterKnowledgeBase(db: DiseaseKnowledgeRecord = diseaseKnowledgeBase): boolean {
  const missingClasses: number[] = [];
  const invalidEntries: string[] = [];

  for (let i = 0; i <= 152; i++) {
    const entry = db[i];
    if (!entry) {
      missingClasses.push(i);
      continue;
    }
    if (!entry.canonicalName || entry.canonicalName.trim() === '') {
      invalidEntries.push(`Class ${i}: Empty canonicalName`);
    }
    if (!entry.clinicalOverview || entry.clinicalOverview.trim() === '') {
      invalidEntries.push(`Class ${i}: Empty clinicalOverview`);
    }
    if (!Array.isArray(entry.commonSymptoms) || entry.commonSymptoms.length === 0) {
      invalidEntries.push(`Class ${i}: Missing commonSymptoms`);
    }
    if (!['LOW', 'MODERATE', 'HIGH'].includes(entry.severity)) {
      invalidEntries.push(`Class ${i}: Invalid severity '${entry.severity}'`);
    }
  }

  if (missingClasses.length > 0) {
    throw new Error(`[MASTER KB ERROR] Missing entries for class IDs: ${missingClasses.join(', ')}`);
  }

  if (invalidEntries.length > 0) {
    throw new Error(`[MASTER KB ERROR] Schema failures: ${invalidEntries.join('; ')}`);
  }

  console.log(`✓ [MASTER KNOWLEDGE BASE VALIDATED] All 153 trained classes (Classes 0–152) successfully verified with 100% schema compliance.`);
  return true;
}

// Automatically execute master validation on module load
try {
  validateMasterKnowledgeBase();
} catch (err) {
  console.error("Master Knowledge Base Initialization Warning:", err);
}
