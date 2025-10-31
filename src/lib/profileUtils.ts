export function calculateProfileCompletion(profile: any, sellerProfile: any | null): number {
  const checks = [
    !!profile.avatar_url,           // 10%
    !!profile.banner_url,           // 10%
    !!profile.bio && profile.bio.length > 50, // 15%
    !!profile.tagline,              // 5%
    !!profile.location,             // 5%
    profile.languages?.length > 0,  // 10%
    profile.social_links && Object.keys(profile.social_links).length > 0, // 10%
    // Seller-specific
    sellerProfile?.skills?.length >= 3, // 10%
    sellerProfile?.portfolio_items?.length > 0, // 15%
    sellerProfile?.education?.length > 0, // 5%
    sellerProfile?.certifications?.length > 0, // 5%
  ];
  
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function formatWalletAddress(address: string): string {
  if (!address || address.length < 16) return address;
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

export function getLanguageProficiencyColor(level: string): string {
  const levels: Record<string, string> = {
    native: 'bg-primary',
    fluent: 'bg-primary-light',
    conversational: 'bg-secondary',
    basic: 'bg-muted',
  };
  return levels[level.toLowerCase()] || 'bg-muted';
}
