from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class QualityCheckMetrics(BaseModel):
    width: Optional[int] = None
    height: Optional[int] = None
    blur_score: Optional[float] = None
    blur_threshold: Optional[float] = None
    brightness: Optional[float] = None

class QualityCheckResponse(BaseModel):
    passed: bool
    reason: str
    suggestion: str
    metrics: Dict[str, Any]

class ClassProbability(BaseModel):
    class_name: str
    display_title: str
    confidence: float
    confidence_pct: float
    risk_level: str
    risk_color: str

class TopPrediction(BaseModel):
    top_class: str
    display_title: str
    confidence: float
    confidence_raw: float
    risk_level: str
    risk_color: str
    description: str
    action: str

class PredictionResponse(BaseModel):
    success: bool
    filename: str
    quality: QualityCheckResponse
    prediction: Optional[TopPrediction] = None
    probabilities: Optional[List[ClassProbability]] = None
