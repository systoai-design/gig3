import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, File, X, FileText, FileImage } from 'lucide-react';

interface ProofUploadProps {
  orderId: string;
  onSuccess: () => void;
}

interface FileWithPreview {
  file: File;
  preview: string | null;
  progress: number;
}

export function ProofUpload({ orderId, onSuccess }: ProofUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [files]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        progress: 0
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const urls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const fileWithPreview = files[i];
      const file = fileWithPreview.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${orderId}/${Date.now()}-${i}.${fileExt}`;
      
      // Update progress to show starting
      setFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, progress: 10 } : f
      ));

      const { error: uploadError, data } = await supabase.storage
        .from('review-proofs')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Update progress to show completion
      setFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, progress: 100 } : f
      ));

      const { data: { publicUrl } } = supabase.storage
        .from('review-proofs')
        .getPublicUrl(fileName);

      urls.push(publicUrl);
    }

    return urls;
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please provide a detailed description of the completed work');
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
          <Label htmlFor="description" className="text-destructive">
            Delivery Description * (Required)
          </Label>
          <Textarea
            id="description"
            placeholder="Describe the completed work, deliverables, and any important details for the buyer..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-2"
            required
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
              <div className="space-y-3">
                {files.map((fileWithPreview, index) => (
                  <div
                    key={index}
                    className="relative flex items-start gap-3 p-3 bg-secondary/50 rounded-lg border border-border/50"
                  >
                    {/* Preview or Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-background/50 flex items-center justify-center">
                      {fileWithPreview.preview ? (
                        <img 
                          src={fileWithPreview.preview} 
                          alt={fileWithPreview.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : fileWithPreview.file.type.includes('pdf') ? (
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      ) : (
                        <File className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium truncate">
                          {fileWithPreview.file.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 flex-shrink-0"
                          onClick={() => removeFile(index)}
                          disabled={uploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {(fileWithPreview.file.size / 1024 / 1024).toFixed(2)} MB
                      </div>

                      {/* Progress Bar */}
                      {uploading && fileWithPreview.progress > 0 && (
                        <div className="space-y-1">
                          <Progress value={fileWithPreview.progress} className="h-1.5" />
                          <div className="text-xs text-muted-foreground">
                            {fileWithPreview.progress === 100 ? 'Uploaded' : 'Uploading...'}
                          </div>
                        </div>
                      )}
                    </div>
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
