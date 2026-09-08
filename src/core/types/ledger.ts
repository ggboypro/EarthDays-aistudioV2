import { ThemePalette } from './theme';

export interface Ledger {
  id: string;
  name: string;
  subtitle?: string;
  coverImage: string;
  theme: ThemePalette;
  entryCount: number;
  spineColor: string;
  createdAt: string;
  updatedAt: string;
}
