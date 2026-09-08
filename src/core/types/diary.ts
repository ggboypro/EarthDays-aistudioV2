import { PhotoAsset } from './photo';

export type MoodType = 'sunny' | 'calm' | 'heart' | 'star' | 'rainy' | 'leaf';

export interface MoodInfo {
  type: MoodType;
  label: string;
}

export interface LocationInfo {
  name: string; // e.g., "上海 · 公园", "东京 · 酒店"
}

export interface DiaryEntry {
  id: string;
  ledgerId: string;
  diaryDate: string; // YYYY-MM-DD
  dayOfWeek: string; // e.g. "周六", "周五"
  title?: string;
  body: string;
  photos: PhotoAsset[];
  location?: LocationInfo;
  mood?: MoodInfo;
  isFavorite: boolean; // Bookmark physically inserted
  createdAt: string;
  updatedAt: string;
}
