
import type { ParseCVOutput } from '@/ai/flows/ai-cv-parser';

export type ParsedCvData = ParseCVOutput & {
    title?: string; // Ensure title is part of the type if AI parser adds it
};

export type TemplateKey = 'modern' | 'classic' | 'creative';
