import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';
import * as nacl from 'https://esm.sh/tweetnacl@1.0.3';
import * as bs58 from 'https://esm.sh/bs58@5.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { walletAddress, signature, message, name, username, isSignup } = await req.json();

    console.log('Wallet auth request:', { walletAddress, isSignup });

    // Verify signature
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(walletAddress);
    
    const verified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
    
    if (!verified) {
      console.error('Signature verification failed');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Signature verified successfully');

    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Check if wallet exists
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('wallet_address', walletAddress)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profile:', profileError);
      throw profileError;
    }
    
    if (existingProfile && !isSignup) {
      // User exists - generate session token
      console.log('Existing user found, creating session');
      
      const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(
        existingProfile.id
      );

      if (userError || !user) {
        console.error('Error fetching user:', userError);
        throw userError || new Error('User not found');
      }

      // Generate access token for existing user
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: user.email || `${walletAddress}@wallet.gig3.io`
      });

      if (linkError) {
        console.error('Error generating link:', linkError);
        throw linkError;
      }

      console.log('Access token generated successfully');
      
      return new Response(
        JSON.stringify({ 
          access_token: linkData.properties.hashed_token,
          refresh_token: linkData.properties.hashed_token,
          user: user
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (isSignup) {
      if (existingProfile) {
        return new Response(
          JSON.stringify({ error: 'Wallet already registered' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // New user - create auth account
      console.log('Creating new user account');
      
      const dummyEmail = `${walletAddress}@wallet.gig3.io`;
      const randomPassword = crypto.randomUUID();

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: dummyEmail,
        password: randomPassword,
        email_confirm: true, // Auto-confirm wallet users
        user_metadata: {
          wallet_address: walletAddress,
          name: name || 'Anonymous User',
          username: username || `user_${walletAddress.substring(0, 8)}`
        }
      });

      if (authError) {
        console.error('Error creating user:', authError);
        throw authError;
      }

      console.log('User created successfully:', authData.user.id);

      // Generate access token for new user
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: dummyEmail
      });

      if (linkError) {
        console.error('Error generating link:', linkError);
        throw linkError;
      }

      console.log('Access token generated for new user');
      
      return new Response(
        JSON.stringify({ 
          access_token: linkData.properties.hashed_token,
          refresh_token: linkData.properties.hashed_token,
          user: authData.user
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Wallet not found and not signup request
    return new Response(
      JSON.stringify({ error: 'Wallet not registered. Please sign up first.' }), 
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in wallet-auth function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
