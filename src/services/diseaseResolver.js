/**
 * DERMAVISION AI — DISEASE RESOLVER SERVICE
 */

import { diseaseKnowledgeBase } from '../data/diseaseKnowledgeBase.js';

const ALIAS_MAP = {
  'bcc': 9,
  'drugeruption': 35,
  'seborrh_keratoses': 125,
  'seborrhkeratoses': 125,
  'strawberry_hemangioma': 133,
  'skincancer': 127,
  'warts': 148,
  'sun_sunlight_damage': 136
};

export function resolveDisease(classIdInput) {
  let resolvedId = null;
  let rawString = String(classIdInput).trim();

  if (typeof classIdInput === 'number' && !isNaN(classIdInput)) {
    resolvedId = Math.floor(classIdInput);
  } else {
    const numMatch = rawString.match(/\b([0-9]{1,3})\b/);
    if (numMatch) {
      resolvedId = parseInt(numMatch[1], 10);
    }
  }

  const normalizedKey = rawString.toLowerCase().replace(/[\s\-_]+/g, '_');
  if (ALIAS_MAP[normalizedKey] !== undefined) {
    resolvedId = ALIAS_MAP[normalizedKey];
  }

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

  if (resolvedId === null || resolvedId < 0 || resolvedId > 152 || !diseaseKnowledgeBase[resolvedId]) {
    resolvedId = 101;
  }

  const kbEntry = diseaseKnowledgeBase[resolvedId];
  const isNormalSkin = resolvedId === 101;

  return {
    classId: resolvedId,
    internalClassName: `class_${resolvedId}`,
    canonicalName: kbEntry.canonicalName,
    knowledgeBaseEntry: kbEntry,
    isNormalSkin
  };
}
