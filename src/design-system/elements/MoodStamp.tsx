import React from 'react';
import { MoodInfo, MoodType } from '../../core/types/diary';
import {
  MoodSunIcon,
  MoodCalmIcon,
  MoodHeartIcon,
  LocationMarkIcon,
} from '../icons/EarthDiaryIcons';

export const MOOD_PRESETS: { type: MoodType; label: string; color: string }[] = [
  { type: 'sunny', label: '开心', color: '#D97706' },
  { type: 'calm', label: '平静', color: '#0284C7' },
  { type: 'heart', label: '心动', color: '#DC2626' },
  { type: 'star', label: '惊喜', color: '#7C3AED' },
  { type: 'leaf', label: '悠然', color: '#16A34A' },
  { type: 'rainy', label: '多愁', color: '#475569' },
];

export const MoodStamp: React.FC<{
  mood?: MoodInfo;
  className?: string;
  size?: number;
}> = ({ mood, className = '', size = 16 }) => {
  if (!mood) return null;

  const getIcon = () => {
    switch (mood.type) {
      case 'sunny':
        return <MoodSunIcon size={size} color="#D97706" />;
      case 'calm':
        return <MoodCalmIcon size={size} color="#0284C7" />;
      case 'heart':
        return <MoodHeartIcon size={size} color="#DC2626" />;
      default:
        return <MoodSunIcon size={size} color="#D97706" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-serif-sc text-[12px] text-[#5A5046] select-none ${className}`}
    >
      {getIcon()}
      <span>{mood.label}</span>
    </span>
  );
};

export const LocationBadge: React.FC<{
  location?: { name: string };
  className?: string;
}> = ({ location, className = '' }) => {
  if (!location || !location.name) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 font-serif-sc text-[12px] text-[#6A6055] select-none ${className}`}
    >
      <LocationMarkIcon size={14} color="#7A6F62" />
      <span>{location.name}</span>
    </span>
  );
};
