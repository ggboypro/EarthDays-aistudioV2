export interface PhotoAsset {
  id: string;
  url: string;
  thumbnailUrl?: string;
  aspectRatio: number; // width / height
  caption?: string;
  rotationDeg?: number; // -1.5 ~ +1.5 degrees natural print placement
}
