import type { Locale } from '@/lib/i18n';

export type UrgencyLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface DiagnosisResult {
  urgencyLevel: UrgencyLevel;
  moldType: string;
  moldReason: string;
  fermentationChemistry: string;
  immediateActions: string[];
  preventionTips: string[];
  batchComparison?: string;
}

export interface RecipeJson {
  kojRatio?: number;
  saltRatio?: number;
  soybeanVariety?: string;
  waterContent?: number;
  notes?: string;
}

export interface Batch {
  id: string;
  name: string;
  started_at: string;
  recipe_json: RecipeJson;
  status: 'active' | 'completed' | 'failed';
  created_at: string;
}

export interface EnvJson {
  temperature?: number;
  humidity?: number;
  storageLocation?: string;
  soybeanVariety?: string;
  kojRatio?: number;
  saltRatio?: number;
}

export interface Log {
  id: string;
  batch_id: string;
  captured_at: string;
  photo_url?: string;
  env_json: EnvJson;
  diagnosis_json?: DiagnosisResult;
  action_json?: DailyAction;
  created_at: string;
}

export interface AgentSession {
  id: string;
  batch_id: string;
  agent_state: AgentState;
  last_action_at?: string;
  next_action_at?: string;
  created_at: string;
}

export interface AgentState {
  completionDate?: string;
  daysElapsed?: number;
  fermentationStage?: string;
  lastAssessment?: string;
  actions?: DailyAction[];
}

export interface DailyAction {
  type: 'tenchi_gaeshi' | 'weather_response' | 'salt_tasting' | 'observation' | 'warning';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  scheduledDate?: string;
}

export interface BatchWithLogs extends Batch {
  logs: Log[];
  agent_session?: AgentSession;
}

export interface KnowledgeTranslationResult {
  originalKnowledge: string;
  scientificExplanation: string;
  chemistry: string;
  practicalAdvice: string[];
  references?: string[];
}

export interface ReverseEngineeringResult {
  targetFlavor: string;
  recommendedParameters: {
    kojRatio?: number;
    saltRatio?: number;
    fermentationTemp?: number;
    fermentationDuration?: string;
    soybeanVariety?: string;
  };
  reasoning: string;
  expectedOutcome: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  miso_type?: string;
  koji_ratio?: number;
  salt_ratio?: number;
  soybean_variety?: string;
  water_content?: number;
  fermentation_duration?: string;
  notes?: string;
  is_template: boolean;
  created_at: string;
}

export interface DiagnosisRequest {
  imageBase64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp';
  locale?: Locale;
  startDate?: string;
  temperature?: number;
  storageLocation?: string;
  soybeanVariety?: string;
  kojRatio?: number;
  saltRatio?: number;
  batchId?: string;
}
