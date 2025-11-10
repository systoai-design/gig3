import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2, Save, Trash2, Briefcase, GraduationCap, Award, Code } from 'lucide-react';
import { toast } from 'sonner';

interface PortfolioItem {
  title: string;
  description: string;
  image_url?: string;
  link?: string;
  date?: string;
}

interface Education {
  institution: string;
  degree: string;
  field?: string;
  start_date?: string;
  end_date?: string;
}

interface Certification {
  name: string;
  issuer: string;
  date?: string;
  credential_url?: string;
}

interface ProfessionalSectionProps {
  skills: string[];
  portfolioItems: PortfolioItem[];
  education: Education[];
  certifications: Certification[];
  onUpdate: (data: {
    skills?: string[];
    portfolio_items?: PortfolioItem[];
    education?: Education[];
    certifications?: Certification[];
  }) => Promise<void>;
}

export function ProfessionalSection({
  skills,
  portfolioItems,
  education,
  certifications,
  onUpdate,
}: ProfessionalSectionProps) {
  const [localSkills, setLocalSkills] = useState<string[]>(skills || []);
  const [localPortfolio, setLocalPortfolio] = useState<PortfolioItem[]>(portfolioItems || []);
  const [localEducation, setLocalEducation] = useState<Education[]>(education || []);
  const [localCerts, setLocalCerts] = useState<Certification[]>(certifications || []);
  
  const [newSkill, setNewSkill] = useState('');
  const [editingPortfolio, setEditingPortfolio] = useState<number | null>(null);
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [editingCert, setEditingCert] = useState<number | null>(null);
  
  const [portfolioForm, setPortfolioForm] = useState<PortfolioItem>({
    title: '',
    description: '',
    image_url: '',
    link: '',
    date: '',
  });
  
  const [educationForm, setEducationForm] = useState<Education>({
    institution: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: '',
  });
  
  const [certForm, setCertForm] = useState<Certification>({
    name: '',
    issuer: '',
    date: '',
    credential_url: '',
  });
  
  const [saving, setSaving] = useState(false);

  // Skills Management
  const addSkill = () => {
    if (newSkill && !localSkills.includes(newSkill)) {
      const updated = [...localSkills, newSkill];
      setLocalSkills(updated);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setLocalSkills(localSkills.filter(s => s !== skill));
  };

  const saveSkills = async () => {
    setSaving(true);
    try {
      await onUpdate({ skills: localSkills });
      toast.success('Skills updated successfully');
    } catch (error) {
      toast.error('Failed to update skills');
    } finally {
      setSaving(false);
    }
  };

  // Portfolio Management
  const addPortfolioItem = () => {
    if (!portfolioForm.title || !portfolioForm.description) {
      toast.error('Title and description are required');
      return;
    }
    
    if (editingPortfolio !== null) {
      const updated = [...localPortfolio];
      updated[editingPortfolio] = portfolioForm;
      setLocalPortfolio(updated);
      setEditingPortfolio(null);
    } else {
      setLocalPortfolio([...localPortfolio, portfolioForm]);
    }
    
    setPortfolioForm({ title: '', description: '', image_url: '', link: '', date: '' });
  };

  const deletePortfolioItem = (index: number) => {
    setLocalPortfolio(localPortfolio.filter((_, i) => i !== index));
  };

  const savePortfolio = async () => {
    setSaving(true);
    try {
      await onUpdate({ portfolio_items: localPortfolio });
      toast.success('Portfolio updated successfully');
    } catch (error) {
      toast.error('Failed to update portfolio');
    } finally {
      setSaving(false);
    }
  };

  // Education Management
  const addEducation = () => {
    if (!educationForm.institution || !educationForm.degree) {
      toast.error('Institution and degree are required');
      return;
    }
    
    if (editingEducation !== null) {
      const updated = [...localEducation];
      updated[editingEducation] = educationForm;
      setLocalEducation(updated);
      setEditingEducation(null);
    } else {
      setLocalEducation([...localEducation, educationForm]);
    }
    
    setEducationForm({ institution: '', degree: '', field: '', start_date: '', end_date: '' });
  };

  const deleteEducation = (index: number) => {
    setLocalEducation(localEducation.filter((_, i) => i !== index));
  };

  const saveEducation = async () => {
    setSaving(true);
    try {
      await onUpdate({ education: localEducation });
      toast.success('Education updated successfully');
    } catch (error) {
      toast.error('Failed to update education');
    } finally {
      setSaving(false);
    }
  };

  // Certification Management
  const addCertification = () => {
    if (!certForm.name || !certForm.issuer) {
      toast.error('Name and issuer are required');
      return;
    }
    
    if (editingCert !== null) {
      const updated = [...localCerts];
      updated[editingCert] = certForm;
      setLocalCerts(updated);
      setEditingCert(null);
    } else {
      setLocalCerts([...localCerts, certForm]);
    }
    
    setCertForm({ name: '', issuer: '', date: '', credential_url: '' });
  };

  const deleteCertification = (index: number) => {
    setLocalCerts(localCerts.filter((_, i) => i !== index));
  };

  const saveCertifications = async () => {
    setSaving(true);
    try {
      await onUpdate({ certifications: localCerts });
      toast.success('Certifications updated successfully');
    } catch (error) {
      toast.error('Failed to update certifications');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Skills
          </CardTitle>
          <CardDescription>Add your professional skills (minimum 3 recommended)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g., React, TypeScript, UI/UX Design"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button type="button" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {localSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button onClick={() => removeSkill(skill)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Button onClick={saveSkills} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Skills'}
          </Button>
        </CardContent>
      </Card>

      {/* Portfolio Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Portfolio
          </CardTitle>
          <CardDescription>Showcase your best work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Portfolio Form */}
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <Input
              placeholder="Project Title"
              value={portfolioForm.title}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
            />
            <Textarea
              placeholder="Project Description"
              value={portfolioForm.description}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
              rows={3}
            />
            <Input
              placeholder="Image URL (optional)"
              value={portfolioForm.image_url}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, image_url: e.target.value })}
            />
            <Input
              placeholder="Project Link (optional)"
              value={portfolioForm.link}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, link: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Date"
              value={portfolioForm.date}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, date: e.target.value })}
            />
            <Button onClick={addPortfolioItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {editingPortfolio !== null ? 'Update Item' : 'Add Portfolio Item'}
            </Button>
          </div>

          {/* Portfolio Items List */}
          <div className="space-y-3">
            {localPortfolio.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  {item.date && <p className="text-xs text-muted-foreground mt-1">{item.date}</p>}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setPortfolioForm(item);
                      setEditingPortfolio(index);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePortfolioItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={savePortfolio} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Portfolio'}
          </Button>
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Education
          </CardTitle>
          <CardDescription>Add your educational background</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Education Form */}
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <Input
              placeholder="Institution"
              value={educationForm.institution}
              onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
            />
            <Input
              placeholder="Degree"
              value={educationForm.degree}
              onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
            />
            <Input
              placeholder="Field of Study (optional)"
              value={educationForm.field}
              onChange={(e) => setEducationForm({ ...educationForm, field: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Start Date"
                value={educationForm.start_date}
                onChange={(e) => setEducationForm({ ...educationForm, start_date: e.target.value })}
              />
              <Input
                type="date"
                placeholder="End Date"
                value={educationForm.end_date}
                onChange={(e) => setEducationForm({ ...educationForm, end_date: e.target.value })}
              />
            </div>
            <Button onClick={addEducation} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {editingEducation !== null ? 'Update Education' : 'Add Education'}
            </Button>
          </div>

          {/* Education Items List */}
          <div className="space-y-3">
            {localEducation.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{item.degree}</h4>
                  <p className="text-sm text-muted-foreground">{item.institution}</p>
                  {item.field && <p className="text-xs text-muted-foreground">{item.field}</p>}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEducationForm(item);
                      setEditingEducation(index);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEducation(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={saveEducation} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Education'}
          </Button>
        </CardContent>
      </Card>

      {/* Certifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certifications
          </CardTitle>
          <CardDescription>Add your professional certifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Certification Form */}
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <Input
              placeholder="Certification Name"
              value={certForm.name}
              onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
            />
            <Input
              placeholder="Issuing Organization"
              value={certForm.issuer}
              onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Issue Date"
              value={certForm.date}
              onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
            />
            <Input
              placeholder="Credential URL (optional)"
              value={certForm.credential_url}
              onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })}
            />
            <Button onClick={addCertification} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {editingCert !== null ? 'Update Certification' : 'Add Certification'}
            </Button>
          </div>

          {/* Certifications List */}
          <div className="space-y-3">
            {localCerts.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.issuer}</p>
                  {item.date && <p className="text-xs text-muted-foreground">{item.date}</p>}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCertForm(item);
                      setEditingCert(index);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCertification(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={saveCertifications} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Certifications'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
