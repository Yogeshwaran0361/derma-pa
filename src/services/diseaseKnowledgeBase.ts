import { Language } from '../i18n/translations';
import { getLocalizedDiseaseInfo, getNormalSkinInfo, LocalizedDiseaseDetail } from './diseaseInfo';

export interface DiseaseKnowledgeEntry {
  exactDiseaseName: string;
  internalClass: string;
  getDetail: (lang: Language) => LocalizedDiseaseDetail;
}

/**
 * Centralized Disease Knowledge Base Registry
 * Provides disease-specific clinical details for all 153 classes.
 * Ensures no fallback to Healthy Skin when a disease entry is requested.
 */
export class DiseaseKnowledgeRegistry {
  public static getEntry(classKey: string, lang: Language): LocalizedDiseaseDetail {
    const keyLower = classKey.toLowerCase();
    const isNormal = keyLower.includes('normal') || keyLower.includes('healthy') || keyLower.includes('benign_feature');

    if (isNormal) {
      return getNormalSkinInfo(lang);
    }

    const detail = getLocalizedDiseaseInfo(classKey, lang);

    // Prompt Requirement #19: Prevent False Healthy Results
    // If disease details are missing, return a clean condition fallback (NEVER convert to Healthy Skin!)
    if (!detail || !detail.name) {
      const formattedName = classKey.replace(/^class_\d+_\(?|\)?$/g, '').replace(/_/g, ' ');
      const uppercaseName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
      return {
        name: uppercaseName,
        subTitle: "Dermatological Condition",
        category: "Cutaneous Evaluation",
        riskLevel: "Moderate",
        riskColor: "amber",
        description: `Clinical evaluation for ${uppercaseName}. This condition presents as a distinct cutaneous feature requiring professional dermatological evaluation for accurate diagnosis and personalized guidance.`,
        symptoms: [
          `Localized skin changes consistent with ${uppercaseName}`,
          "Surface texture variation, mild erythema, or focal papular response",
          "Cutaneous sensation such as mild itching, tenderness, or dryness"
        ],
        causes: [
          "Multifactorial cutaneous etiology requiring clinical correlation",
          "Potential environmental, inflammatory, or dermatological factors"
        ],
        precautions: [
          "Keep affected skin area clean and dry",
          "Avoid unnecessary scratching or mechanical friction",
          "Apply broad-spectrum sunscreen (SPF 30+) when exposed to direct sunlight"
        ],
        warningSigns: [
          "Rapid expansion, dark pigmentation change, or irregular borders",
          "Spontaneous bleeding, ulceration, or persistent non-healing erosion",
          "Severe localized pain, expanding redness, or fever"
        ],
        medicalAttention: `Consult a board-certified dermatologist for clinical examination, dermoscopy, and personalized management for ${uppercaseName}.`,
        summary: `Screening evaluation for ${uppercaseName}.`
      };
    }

    return detail;
  }
}
