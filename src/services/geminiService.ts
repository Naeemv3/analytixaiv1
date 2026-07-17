import { DatasetSchema, KPIOverview, BusinessInsight, AnomalyAlert, SmartRecommendation } from '../types';

export interface VoiceAssistantRequest {
  question: string;
  dashboardData: {
    filename: string;
    schema: DatasetSchema | null;
    kpis: KPIOverview | null;
    insights: BusinessInsight[];
    anomalies: AnomalyAlert[];
    recommendations: SmartRecommendation[];
  };
}

export interface VoiceAssistantResponse {
  answer: string;
}

export async function askGemini(
  question: string,
  dashboardData: VoiceAssistantRequest['dashboardData']
): Promise<string> {
  try {
    const response = await fetch('/api/voice-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, dashboardData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get answer from voice assistant');
    }

    const data: VoiceAssistantResponse = await response.json();
    return data.answer;
  } catch (error) {
    console.error('Error in askGemini:', error);
    throw error;
  }
}
