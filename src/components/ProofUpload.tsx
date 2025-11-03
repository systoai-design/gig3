import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, File, X } from 'lucide-react';

interface ProofUploadProps {
  orderId: string;
  onSuccess: () => void;
}

export function ProofUpload({ orderId, onSuccess }: ProofUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const urls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${orderId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('review-proofs')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('review-proofs')
        .getPublicUrl(fileName);

      urls.push(publicUrl);
    }

    return urls;
  };

  const handleSubmit = async () => {
    if (!description.trim() && files.length === 0) {
      toast.error('Please provide a description or upload files');
      return;
    }

    try {
      setUploading(true);

      // Upload files to storage
      const fileUrls = files.length > 0 ? await uploadFiles() : [];
      setUploadedUrls(fileUrls);

      // Update order with proof
      const { error } = await supabase
        .from('orders')
        .update({
          proof_description: description,
          proof_files: fileUrls,
          status: 'proof_submitted'
        })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Proof of work submitted successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting proof:', error);
      toast.error(error.message || 'Failed to submit proof');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Proof of Work</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="description">Delivery Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe the completed work and any important details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Attach Files (optional)</Label>
          <div className="mt-2 space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('file-input')?.click()}
              disabled={uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,video/*,.pdf,.doc,.docx,.zip"
            />

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-secondary rounded"
                  >
                    <File className="h-4 w-4" />
                    <span className="flex-1 text-sm truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? 'Submitting...' : 'Submit Proof of Work'}
        </Button>
      </CardContent>
    </Card>
  );
}
