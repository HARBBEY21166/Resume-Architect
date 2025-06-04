
"use client";

import type { ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RotateCcw, Sparkles, Palette, Loader2, FileDown } from 'lucide-react';
import type { TemplateKey } from '@/types/cv';

interface CvFormProps {
  cvText: string;
  onCvTextChange: (text: string) => void;
  selectedTemplate: TemplateKey;
  onTemplateChange: (template: TemplateKey) => void;
  onParse: () => void;
  onReset: () => void;
  onDownloadDocx: () => void;
  isParsing: boolean;
  isDownloadingDocx: boolean;
}

const templates: { key: TemplateKey; label: string }[] = [
  { key: 'modern', label: 'Modern' },
  { key: 'classic', label: 'Classic' },
  { key: 'creative', label: 'Creative' },
];

export function CvForm({
  cvText,
  onCvTextChange,
  selectedTemplate,
  onTemplateChange,
  onParse,
  onReset,
  onDownloadDocx,
  isParsing,
  isDownloadingDocx,
}: CvFormProps) {
  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onCvTextChange(event.target.value);
  };

  return (
    <div className="space-y-6 p-1">
      <div>
        <Label htmlFor="cv-text" className="text-lg font-headline mb-2 block">
          Paste your plain text CV here:
        </Label>
        <Textarea
          id="cv-text"
          value={cvText}
          onChange={handleTextChange}
          placeholder="John Doe..."
          rows={15}
          className="min-h-[300px] text-sm"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Privacy Note: No data leaves your browser. All processing is done locally.
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-lg font-headline flex items-center">
          <Palette className="w-5 h-5 mr-2 text-accent" />
          Select Template
        </Label>
        <RadioGroup
          value={selectedTemplate}
          onValueChange={(value) => onTemplateChange(value as TemplateKey)}
          className="flex flex-col sm:flex-row gap-4"
        >
          {templates.map((template) => (
            <div key={template.key} className="flex items-center space-x-2">
              <RadioGroupItem value={template.key} id={template.key} />
              <Label htmlFor={template.key} className="font-normal cursor-pointer">
                {template.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-wrap gap-3 pt-4">
        <Button onClick={onParse} disabled={isParsing || !cvText.trim()}>
          {isParsing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Preview
        </Button>
        <Button 
          onClick={onDownloadDocx} 
          disabled={isDownloadingDocx || !cvText.trim()}
          variant="outline"
        >
          {isDownloadingDocx ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="mr-2 h-4 w-4" />
          )}
          Download DOCX
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
