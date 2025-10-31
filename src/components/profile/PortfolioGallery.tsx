import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PortfolioItem {
  title: string;
  description: string;
  image_url: string;
  link?: string;
}

interface PortfolioGalleryProps {
  items: PortfolioItem[];
}

export function PortfolioGallery({ items }: PortfolioGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  if (!items || items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No portfolio items yet</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <Card
            key={index}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative h-48 overflow-hidden bg-muted">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Project <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-card rounded-lg overflow-hidden shadow-large"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={() => setSelectedItem(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative h-96 bg-muted">
              <img
                src={selectedItem.image_url}
                alt={selectedItem.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>
              <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
              {selectedItem.link && (
                <a
                  href={selectedItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  View Project <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
