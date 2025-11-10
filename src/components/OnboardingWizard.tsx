import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Check, Upload, Sparkles, Target, Rocket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  isSeller?: boolean;
}

export function OnboardingWizard({ open, onClose, userId, isSeller = false }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    bio: '',
    skills: [] as string[],
    portfolioTitle: '',
    portfolioDescription: '',
  });
  
  const [newSkill, setNewSkill] = useState('');

  const totalSteps = isSeller ? 4 : 2;
  const progress = (step / totalSteps) * 100;

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill) && formData.skills.length < 5) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.tagline)) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (step === 2 && isSeller && !formData.bio) {
      toast.error('Please write a bio');
      return;
    }
    
    if (step === 3 && isSeller && formData.skills.length < 3) {
      toast.error('Please add at least 3 skills');
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          tagline: formData.tagline,
          bio: formData.bio || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update seller profile if seller
      if (isSeller) {
        const { error: sellerError } = await supabase
          .from('seller_profiles')
          .update({
            skills: formData.skills,
            portfolio_items: formData.portfolioTitle && formData.portfolioDescription
              ? [{
                  title: formData.portfolioTitle,
                  description: formData.portfolioDescription,
                }]
              : [],
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (sellerError) throw sellerError;
      }

      toast.success('Profile setup complete!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center space-y-2 mb-6">
              <Sparkles className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">Welcome to Gig3!</h3>
              <p className="text-muted-foreground">Let's set up your profile</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline *</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g., Web3 Developer | UI/UX Designer"
                maxLength={80}
              />
              <p className="text-xs text-muted-foreground">
                A catchy one-liner that describes what you do
              </p>
            </div>
          </motion.div>
        );

      case 2:
        if (!isSeller) {
          return (
            <motion.div
              key="step2-buyer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center space-y-2 mb-6">
                <Check className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-2xl font-bold">You're All Set!</h3>
                <p className="text-muted-foreground">Your profile is ready</p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="font-medium">What's next?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Explore amazing gigs from creators</li>
                  <li>• Save your favorites for later</li>
                  <li>• Connect your wallet for secure payments</li>
                </ul>
              </div>
            </motion.div>
          );
        }
        
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center space-y-2 mb-6">
              <Target className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">Tell Your Story</h3>
              <p className="text-muted-foreground">Help buyers understand your expertise</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Describe your experience, what you do, and what makes you unique..."
                rows={5}
                maxLength={600}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/600 characters (minimum 50)
              </p>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center space-y-2 mb-6">
              <Target className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">Your Skills</h3>
              <p className="text-muted-foreground">Add at least 3 skills</p>
            </div>
            
            <div className="space-y-2">
              <Label>Skills (minimum 3)</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g., React, TypeScript, UI/UX"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button type="button" onClick={addSkill} disabled={formData.skills.length >= 5}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)}>×</button>
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center space-y-2 mb-6">
              <Rocket className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">Portfolio (Optional)</h3>
              <p className="text-muted-foreground">Showcase your best work</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolioTitle">Project Title</Label>
              <Input
                id="portfolioTitle"
                value={formData.portfolioTitle}
                onChange={(e) => setFormData({ ...formData, portfolioTitle: e.target.value })}
                placeholder="Your best project"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolioDescription">Description</Label>
              <Textarea
                id="portfolioDescription"
                value={formData.portfolioDescription}
                onChange={(e) => setFormData({ ...formData, portfolioDescription: e.target.value })}
                placeholder="Describe the project and your role..."
                rows={4}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              You can add more portfolio items later in settings
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="space-y-2">
            <DialogTitle>Profile Setup</DialogTitle>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        <div className="flex gap-2 mt-6">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={loading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          {step < totalSteps ? (
            <Button onClick={handleNext} className="flex-1" disabled={loading}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Complete Setup'}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
