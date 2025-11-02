import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Edit, Globe } from 'lucide-react';
import { formatWalletAddress } from '@/lib/profileUtils';
import { ProBadge } from '@/components/ProBadge';

interface ProfileHeaderProps {
  profile: any;
  roles: string[];
  isOwnProfile: boolean;
  onEditClick?: () => void;
  proMember?: boolean;
  proSince?: string | null;
}

export function ProfileHeader({ profile, roles, isOwnProfile, onEditClick, proMember, proSince }: ProfileHeaderProps) {
  const socialLinks = profile.social_links || {};

  return (
    <div className="container mx-auto px-4 -mt-20 relative z-10">
      <div className="bg-card rounded-lg shadow-large p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <Avatar className="h-32 w-32 border-4 border-background shadow-medium">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-4xl bg-gradient-primary text-primary-foreground">
              {profile.name?.charAt(0) || profile.username?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            {/* Name and tagline */}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                {proMember && <ProBadge size="lg" proSince={proSince} />}
                {isOwnProfile && (
                  <Button variant="outline" size="sm" onClick={onEditClick}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.tagline && (
                <p className="text-lg text-foreground/90 mt-2">{profile.tagline}</p>
              )}
            </div>

            {/* Roles */}
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))}
            </div>

            {/* Quick info */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>5.0 (0 reviews)</span>
              </div>
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
              {profile.languages && profile.languages.length > 0 && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{profile.languages.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Social links */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="flex gap-3 pt-2">
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}

            {/* Wallet */}
            {profile.wallet_address && (
              <div className="text-sm">
                <span className="text-muted-foreground">Wallet: </span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {formatWalletAddress(profile.wallet_address)}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
