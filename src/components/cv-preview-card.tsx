"use client";

import type { ParsedCvData, TemplateKey } from '@/types/cv';
import { ModernTemplate } from './templates/modern-template';
import { ClassicTemplate } from './templates/classic-template';
import { CreativeTemplate } from './templates/creative-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet } from 'lucide-react';

interface CvPreviewCardProps {
  parsedData: ParsedCvData | null;
  selectedTemplate: TemplateKey;
}

const placeholderData: ParsedCvData = {
  name: 'Your Name',
  contactInformation: 'your.email@example.com | (123) 456-7890 | linkedin.com/in/yourprofile',
  experience: 'Company Name (Year - Present)\n- Your responsibilities and achievements.',
  education: 'University Name (Year - Year)\n- Your degree and field of study.',
  skills: 'Skill 1, Skill 2, Skill 3',
};

export function CvPreviewCard({ parsedData, selectedTemplate }: CvPreviewCardProps) {
  const dataToRender = parsedData || placeholderData;

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate data={dataToRender} />;
      case 'classic':
        return <ClassicTemplate data={dataToRender} />;
      case 'creative':
        return <CreativeTemplate data={dataToRender} />;
      default:
        return <ModernTemplate data={dataToRender} />;
    }
  };

  return (
    <Card className="shadow-xl h-full">
      <CardHeader className="no-print">
        <CardTitle className="font-headline text-2xl flex items-center">
          <FileSpreadsheet className="w-6 h-6 mr-2 text-primary" />
          CV Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div id="cv-preview-area" className="bg-muted/30 p-2 sm:p-4 rounded-lg overflow-auto aspect-[210/297] max-h-[calc(100vh-250px)] resize-y">
          {/* The aspect ratio helps simulate A4 paper. Scale it down to fit. */}
          <div className="transform scale-[0.9] sm:scale-[0.8] md:scale-[0.65] lg:scale-[0.9] origin-top"> 
            {/* For very large screens, could scale up slightly or adjust container size */}
            {/* The actual cv-template-container will control print size */}
            {renderTemplate()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
