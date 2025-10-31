import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/settings/ImageUploader';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { calculateProfileCompletion } from '@/lib/profileUtils';
import { X, Plus, Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [completion, setCompletion] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    tagline: '',
    bio: '',
    location: '',
    languages: [] as string[],
    social_links: {} as Record<string, string>,
  });

  const [newLanguage, setNewLanguage] = useState('');
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);
      setFormData({
        name: profileData.name || '',
        username: profileData.username || '',
        tagline: profileData.tagline || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        languages: profileData.languages || [],
        social_links: (profileData.social_links as Record<string, string>) || {},
      });

      // Check if seller
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id)
        .eq('role', 'seller')
        .maybeSingle();

      const isSellerUser = !!roleData;
      setIsSeller(isSellerUser);

      // Fetch seller profile if seller
      if (isSellerUser) {
        const { data: sellerData } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('user_id', user!.id)
          .maybeSingle();

        if (sellerData) {
          setSellerProfile(sellerData);
          setPortfolioItems((sellerData.portfolio_items as any[]) || []);
          setEducation((sellerData.education as any[]) || []);
          setCertifications((sellerData.certifications as any[]) || []);
        }
      }

      // Calculate completion
      const completionPercent = calculateProfileCompletion(profileData, sellerProfile);
      setCompletion(completionPercent);
    } catch (error: any) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          tagline: formData.tagline,
          bio: formData.bio,
          location: formData.location,
          languages: formData.languages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocial = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          social_links: formData.social_links,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (error) throw error;
      toast.success('Social links updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update social links');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfessional = async () => {
    if (!isSeller) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('seller_profiles')
        .update({
          portfolio_items: portfolioItems,
          education,
          certifications,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user!.id);

      if (error) throw error;
      toast.success('Professional details updated successfully');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update professional details');
    } finally {
      setSaving(false);
    }
  };

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData({ ...formData, languages: [...formData.languages, newLanguage] });
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(l => l !== lang),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </div>

          {/* Profile Completion */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm font-bold text-primary">{completion}%</span>
              </div>
              <Progress value={completion} className="h-2" />
            </CardContent>
          </Card>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              {isSeller && <TabsTrigger value="professional">Professional</TabsTrigger>}
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Name cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="your-username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="e.g., Web3 Developer | UI/UX Designer"
                      maxLength={80}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.tagline.length}/80 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={5}
                      maxLength={600}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.bio.length}/600 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., San Francisco, USA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Languages</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="Add a language"
                        onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                      />
                      <Button type="button" onClick={addLanguage}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.languages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="gap-1">
                          {lang}
                          <button onClick={() => removeLanguage(lang)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSaveGeneral} disabled={saving} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Media</CardTitle>
                  <CardDescription>Update your avatar and banner images</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Avatar</Label>
                    <ImageUploader
                      currentImage={profile?.avatar_url}
                      onUploadComplete={async (url) => {
                        await supabase
                          .from('profiles')
                          .update({ avatar_url: url })
                          .eq('id', user!.id);
                        fetchProfile();
                      }}
                      type="avatar"
                      userId={user!.id}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Banner</Label>
                    <ImageUploader
                      currentImage={profile?.banner_url}
                      onUploadComplete={async (url) => {
                        await supabase
                          .from('profiles')
                          .update({ banner_url: url })
                          .eq('id', user!.id);
                        fetchProfile();
                      }}
                      type="banner"
                      userId={user!.id}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Tab (Sellers only) */}
            {isSeller && (
              <TabsContent value="professional">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                    <CardDescription>Manage your portfolio, education, and certifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      Professional features coming soon. You can manage your skills from the Seller Dashboard.
                    </p>
                    <Button onClick={handleSaveProfessional} disabled={saving} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Social Tab */}
            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Connect your social media accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter / X</Label>
                    <Input
                      id="twitter"
                      type="url"
                      value={formData.social_links.twitter || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social_links: { ...formData.social_links, twitter: e.target.value },
                        })
                      }
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={formData.social_links.linkedin || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social_links: { ...formData.social_links, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      type="url"
                      value={formData.social_links.github || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social_links: { ...formData.social_links, github: e.target.value },
                        })
                      }
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.social_links.website || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social_links: { ...formData.social_links, website: e.target.value },
                        })
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <Button onClick={handleSaveSocial} disabled={saving} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Social Links'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
