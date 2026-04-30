import { api } from './client';

export interface Hero {
  id: string;
  name: string;
  mbtiType: string;
  biography?: string;
  imageUrl?: string;
}

export async function getHeroByMbti(mbtiType: string): Promise<Hero> {
  const response = await api.get<Hero>(`/heroes/mbti/${mbtiType}`);
  return response.data;
}
