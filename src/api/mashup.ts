import { api } from './client';

export interface MashupResponse {
  id: string;
  imageUrl: string;
}

export async function generateMashup(userId: string, heroId: string, base64Photo: string): Promise<MashupResponse> {
  const response = await api.post<MashupResponse>('/mashup/generate', {
    userId,
    heroId,
    base64Photo,
  });
  return response.data;
}
