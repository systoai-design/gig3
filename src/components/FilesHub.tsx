import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, ExternalLink, FileText, Image as ImageIcon, File, Search } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export interface FileItem {
  id: string;
  url: string;
  fileName: string;
  fileType: 'image' | 'pdf' | 'doc' | 'other';
  uploadedAt: string;
  source: 'order' | 'message';
  sourceId: string;
  sourceName: string;
  sellerName: string;
  sellerAvatar: string | null;
}

interface FilesHubProps {
  files: FileItem[];
}

export default function FilesHub({ files }: FilesHubProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState<'all' | 'order' | 'message'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'seller' | 'type'>('date');

  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(file => 
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.sourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by source
    if (filterSource !== 'all') {
      result = result.filter(file => file.source === filterSource);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'seller':
          return a.sellerName.localeCompare(b.sellerName);
        case 'type':
          return a.fileType.localeCompare(b.fileType);
        default:
          return 0;
      }
    });

    return result;
  }, [files, searchTerm, filterSource, sortBy]);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-8 w-8 text-primary" />;
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc':
        return <FileText className="h-8 w-8 text-blue-500" />;
      default:
        return <File className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <File className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Files Yet</h3>
        <p className="text-muted-foreground max-w-md">
          Files from order deliveries and messages will appear here once sellers send them to you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files, orders, or sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterSource === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterSource('all')}
          >
            All Files
          </Button>
          <Button
            variant={filterSource === 'order' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterSource('order')}
          >
            From Orders
          </Button>
          <Button
            variant={filterSource === 'message' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterSource('message')}
          >
            From Messages
          </Button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sort by:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortBy('date')}
          className={sortBy === 'date' ? 'text-primary' : ''}
        >
          Date
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortBy('seller')}
          className={sortBy === 'seller' ? 'text-primary' : ''}
        >
          Seller
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortBy('type')}
          className={sortBy === 'type' ? 'text-primary' : ''}
        >
          Type
        </Button>
      </div>

      {/* Files Count */}
      <div className="text-sm text-muted-foreground">
        {filteredAndSortedFiles.length} {filteredAndSortedFiles.length === 1 ? 'file' : 'files'}
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedFiles.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* File Preview */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {file.fileType === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getFileIcon(file.fileType)
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm truncate flex-1" title={file.fileName}>
                      {file.fileName}
                    </h4>
                    <Badge variant={file.source === 'order' ? 'default' : 'secondary'} className="text-xs">
                      {file.source}
                    </Badge>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={file.sellerAvatar || undefined} />
                      <AvatarFallback className="text-xs">
                        {file.sellerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">
                      {file.sellerName}
                    </span>
                  </div>

                  {/* Source Name */}
                  <p className="text-xs text-muted-foreground truncate" title={file.sourceName}>
                    {file.sourceName}
                  </p>

                  {/* Date */}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(file.uploadedAt), 'MMM dd, yyyy')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => downloadFile(file.url, file.fileName)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAndSortedFiles.length === 0 && searchTerm && (
        <div className="text-center py-8 text-muted-foreground">
          No files found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
}
