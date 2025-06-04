"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { CvForm } from '@/components/cv-form';
import { CvPreviewCard } from '@/components/cv-preview-card';
import { parseCV } from '@/ai/flows/ai-cv-parser';
import type { ParsedCvData, TemplateKey } from '@/types/cv';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";


const EXAMPLE_CV = `John Doe
john@email.com | (123) 456-7890 | linkedin.com/in/johndoe

EXPERIENCE
Senior Developer, ABC Tech (2020-Present)
- Led team of 5 developers
- Implemented React architecture for a client-facing product resulting in a 20% performance increase.
- Mentored junior developers and conducted code reviews.

Software Engineer, XYZ Solutions (2018-2020)
- Developed and maintained features for a large-scale e-commerce platform.
- Collaborated with cross-functional teams to deliver high-quality software.

EDUCATION
BS Computer Science, University X (2016-2020)
- Graduated with Honors
- President of the Coding Club

SKILLS
Programming Languages: JavaScript, Python, Java, C++
Frameworks/Libraries: React, Node.js, Express, Spring Boot
Databases: MongoDB, PostgreSQL, MySQL
Tools: Git, Docker, Kubernetes, AWS
`;


export default function HomePage() {
  const [cvText, setCvText] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedCvData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('modern');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load example CV on initial mount for demonstration
    setCvText(EXAMPLE_CV);
  }, []);

  const handleParseCv = async () => {
    if (!cvText.trim()) {
      setError("CV text cannot be empty.");
      toast({ title: "Error", description: "CV text cannot be empty.", variant: "destructive" });
      return;
    }
    setIsParsing(true);
    setError(null);
    try {
      const result = await parseCV({ cvText });
      setParsedData(result);
      toast({ title: "CV Parsed!", description: "Preview updated with parsed content." });
    } catch (e) {
      console.error("Parsing error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during parsing.";
      setError(`Failed to parse CV: ${errorMessage}`);
      toast({ title: "Parsing Failed", description: errorMessage, variant: "destructive" });
      setParsedData(null); // Clear previous data on error
    } finally {
      setIsParsing(false);
    }
  };

  const handleReset = () => {
    setCvText('');
    setParsedData(null);
    setError(null);
    setSelectedTemplate('modern');
    toast({ title: "Form Cleared", description: "Input and preview have been reset." });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-card p-6 rounded-lg shadow-md no-print">
            <CvForm
              cvText={cvText}
              onCvTextChange={setCvText}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              onParse={handleParseCv}
              onReset={handleReset}
              isParsing={isParsing}
            />
            {error && (
               <Alert variant="destructive" className="mt-4">
                 <Terminal className="h-4 w-4" />
                 <AlertTitle>Parsing Error</AlertTitle>
                 <AlertDescription>{error}</AlertDescription>
               </Alert>
            )}
          </div>
          <div className="lg:sticky lg:top-24"> {/* Sticky preview for large screens */}
            <CvPreviewCard parsedData={parsedData} selectedTemplate={selectedTemplate} />
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground no-print">
        © {new Date().getFullYear()} CV-Genius. All rights reserved.
      </footer>
    </div>
  );
}
