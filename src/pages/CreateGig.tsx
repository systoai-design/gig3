import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loader2, Upload, X } from 'lucide-react';

const packageSchema = z.object({
  name: z.string().min(1, 'Package name required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price_sol: z.number().min(0.01, 'Minimum price is 0.01 SOL'),
  delivery_days: z.number().min(1, 'Minimum 1 day').max(90, 'Maximum 90 days'),
  revisions: z.number().min(0, 'Minimum 0 revisions').max(10, 'Maximum 10 revisions'),
  features: z.array(z.string()).min(1, 'Add at least one feature'),
});

const gigSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description too long'),
  category: z.string().min(1, 'Please select a category'),
  price_sol: z.number().optional(),
  delivery_days: z.number().optional(),
});

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Smart Contract Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Video Editing',
  'Marketing',
  'Other'
];

export default function CreateGig() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [usePackages, setUsePackages] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price_sol: '',
    delivery_days: '',
  });

  const [packages, setPackages] = useState([
    {
      name: 'Basic',
      description: '',
      price_sol: '',
      delivery_days: '',
      revisions: '2',
      features: [''],
    },
    {
      name: 'Standard',
      description: '',
      price_sol: '',
      delivery_days: '',
      revisions: '3',
      features: [''],
    },
    {
      name: 'Premium',
      description: '',
      price_sol: '',
      delivery_days: '',
      revisions: '5',
      features: [''],
    },
  ]);

  useEffect(() => {
    const checkSellerRole = async () => {
      if (!user) {
        toast.error('Please sign in to create gigs');
        navigate('/auth');
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'seller')
        .maybeSingle();

      if (!data) {
        toast.error('You must be a seller to create gigs');
        navigate('/become-seller');
        return;
      }

      setCheckingRole(false);
    };

    checkSellerRole();
  }, [user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages([...images, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const updatePackageFeature = (pkgIdx: number, featIdx: number, value: string) => {
    const newPackages = [...packages];
    newPackages[pkgIdx].features[featIdx] = value;
    setPackages(newPackages);
  };

  const addPackageFeature = (pkgIdx: number) => {
    const newPackages = [...packages];
    newPackages[pkgIdx].features.push('');
    setPackages(newPackages);
  };

  const removePackageFeature = (pkgIdx: number, featIdx: number) => {
    const newPackages = [...packages];
    newPackages[pkgIdx].features = newPackages[pkgIdx].features.filter((_, i) => i !== featIdx);
    setPackages(newPackages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    try {
      // Validate form data
      const validatedData = gigSchema.parse({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price_sol: usePackages ? undefined : parseFloat(formData.price_sol),
        delivery_days: usePackages ? undefined : parseInt(formData.delivery_days),
      });

      // Validate packages if using packages
      let validatedPackages = null;
      if (usePackages) {
        validatedPackages = packages.map(pkg => 
          packageSchema.parse({
            name: pkg.name,
            description: pkg.description,
            price_sol: parseFloat(pkg.price_sol),
            delivery_days: parseInt(pkg.delivery_days),
            revisions: parseInt(pkg.revisions),
            features: pkg.features.filter(f => f.trim() !== ''),
          })
        );
      }

      setLoading(true);

      // Upload images
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gig-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gig-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // Create gig
      const { data, error } = await supabase
        .from('gigs')
        .insert({
          seller_id: user.id,
          title: validatedData.title,
          description: validatedData.description,
          category: validatedData.category,
          price_sol: usePackages ? validatedPackages[0].price_sol : validatedData.price_sol,
          delivery_days: usePackages ? validatedPackages[0].delivery_days : validatedData.delivery_days,
          images: imageUrls,
          status: 'active',
          packages: validatedPackages || [],
          has_packages: usePackages,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Gig created successfully!');
      navigate(`/gig/${data.id}`);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || 'Failed to create gig');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-navbar pt-8 pb-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-navbar pt-8 pb-12 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-4xl font-bold mb-2">Create a New Gig</h1>
            <p className="text-muted-foreground">Share your skills with the community</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Gig Title *</Label>
            <Input
              id="title"
              placeholder="I will create a professional website using React"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your service in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={8}
              required
            />
          </div>

          {/* Pricing Type Selection */}
          <div className="space-y-4">
            <Label>Pricing Model</Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                type="button"
                variant={usePackages ? 'default' : 'outline'}
                onClick={() => setUsePackages(true)}
                className="flex-1 min-h-[44px]"
              >
                Tiered Packages (Recommended)
              </Button>
              <Button
                type="button"
                variant={!usePackages ? 'default' : 'outline'}
                onClick={() => setUsePackages(false)}
                className="flex-1 min-h-[44px]"
              >
                Single Price
              </Button>
            </div>
          </div>

          {usePackages ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Create Your Packages</h3>
              {packages.map((pkg, pkgIdx) => (
                <div key={pkgIdx} className="border rounded-lg p-4 md:p-6 space-y-4">
                  <h4 className="font-semibold text-lg">{pkg.name} Package</h4>
                  
                  <div>
                    <Label>Package Description *</Label>
                    <Textarea
                      placeholder={`Describe what's included in the ${pkg.name} package...`}
                      value={pkg.description}
                      onChange={(e) => {
                        const newPackages = [...packages];
                        newPackages[pkgIdx].description = e.target.value;
                        setPackages(newPackages);
                      }}
                      rows={2}
                      required
                      className="min-h-[44px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Price (SOL) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.5"
                        value={pkg.price_sol}
                        onChange={(e) => {
                          const newPackages = [...packages];
                          newPackages[pkgIdx].price_sol = e.target.value;
                          setPackages(newPackages);
                        }}
                        required
                        className="min-h-[44px]"
                      />
                    </div>
                    <div>
                      <Label>Delivery (days) *</Label>
                      <Input
                        type="number"
                        placeholder="7"
                        value={pkg.delivery_days}
                        onChange={(e) => {
                          const newPackages = [...packages];
                          newPackages[pkgIdx].delivery_days = e.target.value;
                          setPackages(newPackages);
                        }}
                        required
                        className="min-h-[44px]"
                      />
                    </div>
                    <div>
                      <Label>Revisions *</Label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={pkg.revisions}
                        onChange={(e) => {
                          const newPackages = [...packages];
                          newPackages[pkgIdx].revisions = e.target.value;
                          setPackages(newPackages);
                        }}
                        required
                        className="min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Features *</Label>
                    <div className="space-y-2">
                      {pkg.features.map((feature, featIdx) => (
                        <div key={featIdx} className="flex gap-2">
                          <Input
                            placeholder="e.g., Responsive design"
                            value={feature}
                            onChange={(e) => updatePackageFeature(pkgIdx, featIdx, e.target.value)}
                            required
                            className="min-h-[44px]"
                          />
                          {pkg.features.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removePackageFeature(pkgIdx, featIdx)}
                              className="min-w-[44px] min-h-[44px] flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addPackageFeature(pkgIdx)}
                        className="w-full sm:w-auto min-h-[44px]"
                      >
                        + Add Feature
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (SOL) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.5"
                  value={formData.price_sol}
                  onChange={(e) => setFormData({ ...formData, price_sol: e.target.value })}
                  required
                  className="min-h-[44px]"
                />
              </div>
              <div>
                <Label htmlFor="delivery">Delivery Time (days) *</Label>
                <Input
                  id="delivery"
                  type="number"
                  placeholder="7"
                  value={formData.delivery_days}
                  onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                  required
                  className="min-h-[44px]"
                />
              </div>
            </div>
          )}

          <div>
            <Label>Gig Images * (Max 5)</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full h-40 md:h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <div className="text-center p-4">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload images</span>
                  <span className="text-xs text-muted-foreground block mt-1">Max 5 images</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full min-h-[48px]">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Gig...
              </>
            ) : (
              'Create Gig'
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
