import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Award } from 'lucide-react';

interface Education {
  institution: string;
  degree: string;
  year: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
  credential_url?: string;
}

interface EducationSectionProps {
  education: Education[];
  certifications: Certification[];
}

export function EducationSection({ education, certifications }: EducationSectionProps) {
  if ((!education || education.length === 0) && (!certifications || certifications.length === 0)) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Education */}
        {education && education.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground mt-1">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-secondary" />
              Certifications
            </h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="border-l-2 border-secondary pl-4">
                  <h4 className="font-semibold">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cert.year}</p>
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      View Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
