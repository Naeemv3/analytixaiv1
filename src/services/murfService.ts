export async function synthesizeSpeech(text: string): Promise<string> {
  try {
    const response = await fetch('/api/voice-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to synthesize speech using Murf AI');
    }

    const data = await response.json();
    if (!data.audioUrl) {
      throw new Error('No audio URL returned from Murf AI service');
    }

    return data.audioUrl;
  } catch (error) {
    console.error('Error in synthesizeSpeech:', error);
    throw error;
  }
}
