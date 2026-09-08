import React from 'react';
import { PhotoAsset } from '../../core/types/photo';

interface PhotoPrintProps {
  photo: PhotoAsset;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showCaption?: boolean;
  onClick?: () => void;
}

export const PhotoPrint: React.FC<PhotoPrintProps> = ({
  photo,
  className = '',
  size = 'md',
  showCaption = false,
  onClick,
}) => {
  const rotation = photo.rotationDeg || 0;

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    hero: 'w-full h-56 sm:h-72',
  }[size];

  return (
    <div
      onClick={onClick}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={`relative inline-block bg-white p-[3px] sm:p-[4px] rounded-[1px] shadow-photo-l2 transition-transform duration-200 hover:scale-[1.02] cursor-pointer shrink-0 ${className}`}
    >
      {/* 0.5px subtle photographic print border */}
      <div className={`relative overflow-hidden bg-[#2D2A26]/10 ${sizeClasses}`}>
        <img
          src={photo.url}
          alt={photo.caption || '日记照片'}
          className="w-full h-full object-cover select-none"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Photographic surface soft gloss */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />
      </div>

      {showCaption && photo.caption && (
        <p className="mt-1 text-center font-serif-sc text-[11px] text-[#4A4036] tracking-wide">
          {photo.caption}
        </p>
      )}
    </div>
  );
};

export const PhotoGrid: React.FC<{
  photos: PhotoAsset[];
  onPhotoClick?: (photo: PhotoAsset) => void;
}> = ({ photos, onPhotoClick }) => {
  if (!photos || photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <div className="my-2.5">
        <PhotoPrint photo={photos[0]} size="lg" onClick={() => onPhotoClick?.(photos[0])} />
      </div>
    );
  }

  return (
    <div className="my-2.5 flex flex-wrap gap-2.5 items-center">
      {photos.map((p, idx) => (
        <PhotoPrint
          key={p.id || idx}
          photo={p}
          size="md"
          onClick={() => onPhotoClick?.(p)}
        />
      ))}
    </div>
  );
};
