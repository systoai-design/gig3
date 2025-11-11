import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { FileText, Download, ExternalLink, Loader2 } from 'lucide-react';

interface ProofReviewProps {
  proofDescription: string;
  proofFiles: string[];
  onApprove: () => void;
  onRequestRevision: (notes: string) => void;
  onDispute: () => void;
  isLoading?: boolean;
}

export function ProofReview({
  proofDescription,
  proofFiles,
  onApprove,
  onRequestRevision,
  onDispute,
  isLoading = false
}: ProofReviewProps) {
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);

  const handleRevisionSubmit = () => {
    if (!revisionNotes.trim()) {
      return;
    }
    onRequestRevision(revisionNotes);
    setRevisionNotes('');
    setShowRevisionInput(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Proof of Work Submitted
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <Label className="text-sm font-medium">Delivery Description</Label>
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
            {proofDescription}
          </p>
        </div>

        {/* Files */}
        {proofFiles && proofFiles.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Attached Files</Label>
            <div className="mt-2 space-y-2">
              {proofFiles.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
                >
                  <FileText className="h-4 w-4" />
                  <span className="flex-1 text-sm truncate">
                    File {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {!showRevisionInput ? (
          <div className="space-y-2 pt-4 border-t">
            <Button
              onClick={onApprove}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Releasing Payment...
                </>
              ) : (
                <>✓ Approve & Release Payment</>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRevisionInput(true)}
              className="w-full"
            >
              Request Revision
            </Button>
            <Button
              variant="destructive"
              onClick={onDispute}
              disabled={isLoading}
              className="w-full"
            >
              File Dispute
            </Button>
          </div>
        ) : (
          <div className="space-y-2 pt-4 border-t">
            <Label>Revision Notes</Label>
            <Textarea
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="Explain what needs to be revised..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleRevisionSubmit}
                disabled={!revisionNotes.trim()}
                className="flex-1"
              >
                Submit Revision Request
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRevisionInput(false);
                  setRevisionNotes('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
