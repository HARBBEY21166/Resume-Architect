
"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { CvForm } from '@/components/cv-form';
import { CvPreviewCard } from '@/components/cv-preview-card';
import { parseCV } from '@/ai/flows/ai-cv-parser';
import { generateDocxForModernTemplate } from '@/lib/docx-generator';
import type { ParsedCvData, TemplateKey } from '@/types/cv';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";


const EXAMPLE_CV = `John Doe
Front-End Developer
john@email.com | (123) 456-7890 | linkedin.com/in/johndoe | github.com/johndoe | New York, NY

OBJECTIVE
A highly motivated and results-oriented Front-End Developer with 5+ years of experience in creating and implementing innovative web solutions. Proven ability to work independently and as part of a team to deliver high-quality products.

EXPERIENCE
Senior Developer, ABC Tech (2020-Present)
New York, NY
- Led team of 5 developers in agile environment.
- Implemented React architecture for a client-facing product resulting in a 20% performance increase.
- Mentored junior developers and conducted code reviews.
- Spearheaded the adoption of TypeScript, improving code quality and reducing bugs by 15%.

Software Engineer, XYZ Solutions (2018-2020)
San Francisco, CA (Remote)
- Developed and maintained features for a large-scale e-commerce platform using Angular and Node.js.
- Collaborated with cross-functional teams to deliver high-quality software on tight deadlines.
- Contributed to the migration of legacy systems to modern microservices architecture.

EDUCATION
- BS Computer Science, University X (2016-2020)
  - Graduated with Honors (GPA: 3.8/4.0)
  - President of the Coding Club
  - Relevant coursework: Data Structures, Algorithms, Web Development, Database Management

SKILLS
Technical Skills: JavaScript (ES6+), TypeScript, React, Angular, Node.js, Express, HTML5, CSS3, SASS, Python, Java, C++, MongoDB, PostgreSQL, MySQL, RESTful APIs, GraphQL
Tools & Platforms: Git, Docker, Kubernetes, AWS (EC2, S3, Lambda), Jenkins, Jira, Figma
Personal Skills: Problem-solving, Communication, Teamwork, Agile Methodologies, Leadership, Adaptability

CERTIFICATIONS
- Certified Kubernetes Application Developer (CKAD) - The Linux Foundation (2022)
- AWS Certified Solutions Architect – Associate - Amazon Web Services (2021)

INTERESTS
- Open-source contributions
- Attending tech meetups and conferences
- Hiking and outdoor activities
`;


export default function HomePage() {
  const [cvText, setCvText] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedCvData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('modern');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState<boolean>(false);
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

  const handleDownloadDocx = async () => {
    if (!parsedData) {
      toast({ title: "Cannot Download", description: "Please parse the CV first to generate data.", variant: "destructive" });
      return;
    }
    if (selectedTemplate !== 'modern') {
      toast({ title: "Not Implemented", description: `DOCX download for '${selectedTemplate}' template is not yet implemented. Defaulting to Modern.`, variant: "default" });
      // For now, we only have modern template for DOCX
    }

    setIsDownloadingDocx(true);
    try {
      // For now, we only generate DOCX for the modern template.
      // Later, we can add a switch or different functions for other templates if needed.
      await generateDocxForModernTemplate(parsedData); 
      toast({ title: "DOCX Generated", description: "Your CV has been downloaded." });
    } catch (e) {
      console.error("DOCX Generation error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during DOCX generation.";
      toast({ title: "DOCX Generation Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsDownloadingDocx(false);
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
              onDownloadDocx={handleDownloadDocx}
              isParsing={isParsing}
              isDownloadingDocx={isDownloadingDocx}
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
        © {new Date().getFullYear()} Resume Architect. All rights reserved.
      </footer>
    </div>
  );
}
