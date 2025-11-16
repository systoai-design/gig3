import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithWallet: (walletAddress: string, signature: string, message: string) => Promise<{ error: any }>;
  signUpWithWallet: (walletAddress: string, signature: string, message: string, name: string, username: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkWalletMatch: (walletAddress: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const previousUser = user;
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only navigate on initial sign-in, not on token refresh or session restoration
        if (event === 'SIGNED_IN' && !previousUser && session?.user) {
          navigate('/');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, username: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username,
          name
        }
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! You can now sign in.');
    }

    return { error };
  };

  const signInWithWallet = async (walletAddress: string, signature: string, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('wallet-auth', {
        body: { walletAddress, signature, message, isSignup: false }
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.error) {
        toast.error(data.error);
        return { error: { message: data.error } };
      }
      
      // Set session using the access token
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });

      if (sessionError) {
        toast.error(sessionError.message);
        return { error: sessionError };
      }

      toast.success('Signed in with wallet!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with wallet');
      return { error };
    }
  };

  const signUpWithWallet = async (
    walletAddress: string,
    signature: string,
    message: string,
    name: string,
    username: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('wallet-auth', {
        body: { walletAddress, signature, message, name, username, isSignup: true }
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.error) {
        toast.error(data.error);
        return { error: { message: data.error } };
      }
      
      // Set session using the access token
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });

      if (sessionError) {
        toast.error(sessionError.message);
        return { error: sessionError };
      }

      toast.success('Account created with wallet!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up with wallet');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
    }

    return { error };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Only show error for unexpected issues, not "session not found"
      if (error && !error.message.includes('session')) {
        console.error('Sign out error:', error);
        toast.error('There was an issue signing out, but your session has been cleared.');
      } else {
        toast.success('Signed out successfully');
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.info('Your session has been cleared.');
    } finally {
      // Always clear local state and navigate, even if API call fails
      setSession(null);
      setUser(null);
      navigate('/');
    }
  };

  const checkWalletMatch = (walletAddress: string): boolean => {
    if (!user) return false;
    const userWalletAddress = user.user_metadata?.wallet_address;
    return userWalletAddress === walletAddress;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithWallet, signUpWithWallet, signOut, checkWalletMatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
