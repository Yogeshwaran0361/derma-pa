/**
 * DERMAVISION AI — MASTER DISEASE KNOWLEDGE BASE (CLASSES 0–152)
 * Merges Part 1, Part 2, and Part 3 into a single unified knowledge dictionary
 */

import { diseaseKnowledgeBasePart1 } from './diseaseKnowledgeBase.part1.js';
import { diseaseKnowledgeBasePart2 } from './diseaseKnowledgeBase.part2.js';
import { diseaseKnowledgeBasePart3 } from './diseaseKnowledgeBase.part3.js';

export const diseaseKnowledgeBase = {
  ...diseaseKnowledgeBasePart1,
  ...diseaseKnowledgeBasePart2,
  ...diseaseKnowledgeBasePart3
};

export function validateMasterKnowledgeBase(db = diseaseKnowledgeBase) {
  const missingClasses = [];
  const invalidEntries = [];

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
