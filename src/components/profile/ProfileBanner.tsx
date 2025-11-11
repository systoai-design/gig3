import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileBannerProps {
  bannerUrl?: string;
  isOwnProfile: boolean;
  onEditClick?: () => void;
}

export function ProfileBanner({ bannerUrl, isOwnProfile, onEditClick }: ProfileBannerProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden z-[1]">
      {bannerUrl && !imageError ? (
        <img
          src={bannerUrl}
          alt="Profile banner"
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-hero" />
      )}
      
      {isOwnProfile && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 shadow-medium z-20"
          onClick={onEditClick}
        >
          <Camera className="h-4 w-4 mr-2" />
          Edit Banner
        </Button>
      )}
    </div>
  );
}
