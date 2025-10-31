import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { getLanguageProficiencyColor } from '@/lib/profileUtils';

interface LanguagesCardProps {
  languages: string[];
  proficiency?: Record<string, string>;
}

export function LanguagesCard({ languages, proficiency = {} }: LanguagesCardProps) {
  if (!languages || languages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Languages
        </h3>
        <div className="space-y-3">
          {languages.map((lang) => {
            const level = proficiency[lang] || 'conversational';
            return (
              <div key={lang} className="flex items-center justify-between">
                <span className="text-sm">{lang}</span>
                <Badge variant="secondary" className="text-xs capitalize">
                  {level}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
