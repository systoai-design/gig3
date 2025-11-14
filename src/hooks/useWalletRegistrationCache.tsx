const registrationCache = new Map<string, boolean>();

export const useWalletRegistrationCache = () => {
  const getCachedStatus = (walletAddress: string): boolean | undefined => {
    return registrationCache.get(walletAddress);
  };
  
  const setCachedStatus = (walletAddress: string, isRegistered: boolean) => {
    registrationCache.set(walletAddress, isRegistered);
  };
  
  const clearCache = (walletAddress?: string) => {
    if (walletAddress) {
      registrationCache.delete(walletAddress);
    } else {
      registrationCache.clear();
    }
  };
  
  return { getCachedStatus, setCachedStatus, clearCache };
};
