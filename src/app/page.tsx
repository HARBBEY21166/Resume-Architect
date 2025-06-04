
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


const EXAMPLE_CV = `Abiodun Aina
Front-End Developer

📍 Bramley View, Johannesburg, 2090, South Africa | 📞 +27641663906 | ✉️ olamilekan445@gmail.com
🔗 Portfolio: yourportfolio.com | 👨‍💻 GitHub: github.com/yourusername | 💼 LinkedIn: linkedin.com/in/yourprofile

OBJECTIVE
Frontend Developer & Junior UX/UI Designer with 2+ years of experience building responsive, performance-driven web apps using React, WordPress, and Firebase. Strong communicator with proven results in remote, international teams. Recently built a full-stack e-commerce platform during a DevelopersHub internship. Passionate about transforming ideas into seamless digital products and creating visually pleasing, thoughtful, and user-friendly experiences.

EXPERIENCE
Full-Stack Developer Intern @ DevelopersHub
Pakistan (Remote) (May 2025)
- Built a responsive full-stack e-commerce web app using React, Next.js, TypeScript, and Firebase.
- Implemented user authentication, product catalog, shopping cart, wishlist, checkout, and user profile management.
- Developed a custom admin dashboard for product management, order tracking, and analytics.

WordPress Developer Intern @ GAO Tek Inc.
Canada (Remote) (June 2024)
- Customized and maintained WordPress sites using Bitnami & VirtualBox.
- Supported SEO and content publishing tasks while assisting in digital marketing efforts.
- Gained experience working with remote teams and contributing to website improvements based on stakeholder feedback.

UI/UX Designer @ WanderUnion
South Africa (Remote) (Sept 2024)
- Collaborated with WanderUnion, a travel platform, to prototype and design user interfaces to enhance user experience.
- Developed user-centered designs for the sign-up flow and simplified options for signing up as a Traveler or Operator.
- Implemented design adjustments based on client feedback, including color consistency to maintain brand identity.

EDUCATION
- Advanced Front-End Development, ALX (Nov 2024 – Mar 2025)
- Front-End Web Development, ALX (May 2024 – Oct 2024)
- Responsive Web Design, freeCodeCamp (Jun 2022 – Oct 2022)

SKILLS
Technical Skills: HTML5, CSS3, TypeScript, JavaScript, WordPress, React, Firebase, Next.js, Tailwind, Bootstrap
Tools & Platforms: Figma, Git/GitHub, Prototyping, UI/UX Design, Wireframing
Personal Skills: UI Design, UX Design, Google Workspace, Slack, Communication, Teamwork, Problem-Solving

CERTIFICATIONS
- Front-End Software Engineering Job Simulation, Skyscanner Forage (Apr 2025)
- Certificate Of Front-End Web Development, Alx_Africa (Feb 2025)
- Certificate Of Web Development, GAOTek Inc. (Jan 2025)
- Responsive Web Design, freeCodeCamp (Oct 2022)

INTERESTS
- Problem-Solving Games (e.g., puzzles or coding challenges)
- UI/UX Design
- Exploring and learning new technologies related to web development.
`;


export default function HomePage() {
  const [cvText, setCvText] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedCvData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('modern');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
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
    if (selectedTemplate !== 'modern' && selectedTemplate !== 'classic' && selectedTemplate !== 'creative') { // Future-proofing if more templates are added
      toast({ title: "Not Implemented", description: `DOCX download for '${selectedTemplate}' template might not be fully optimized. Using Modern structure.`, variant: "default" });
    }

    setIsDownloadingDocx(true);
    try {
      // For now, we only generate DOCX for the modern template structure.
      // This can be expanded to support different structures per template if needed.
      await generateDocxForModernTemplate(parsedData, "Resume Architect");
      toast({ title: "DOCX Generated", description: "Your CV has been downloaded." });
    } catch (e) {
      console.error("DOCX Generation error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during DOCX generation.";
      toast({ title: "DOCX Generation Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!parsedData) {
      toast({ title: "Cannot Download", description: "Please parse the CV first to generate data.", variant: "destructive" });
      return;
    }
    setIsDownloadingPdf(true);
    // Briefly hide non-printable elements to ensure clean print output
    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');

    // Ensure CV preview area scaling is removed for print
    const cvPreviewArea = document.getElementById('cv-preview-area');
    const innerScaledDiv = cvPreviewArea?.querySelector<HTMLDivElement>('div[class*="transform scale"]');
    let originalTransform = '';
    if (innerScaledDiv) {
        originalTransform = innerScaledDiv.style.transform;
        innerScaledDiv.style.transform = 'none';
    }


    try {
      window.print();
      toast({ title: "Print Dialog Opened", description: "Choose 'Save as PDF' to download your CV." });
    } catch (e) {
      console.error("PDF Generation error (window.print):", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during PDF generation.";
      toast({ title: "PDF Generation Failed", description: errorMessage, variant: "destructive" });
    } finally {
      // Restore non-printable elements and scaling
      noPrintElements.forEach(el => (el as HTMLElement).style.display = '');
       if (innerScaledDiv) {
        innerScaledDiv.style.transform = originalTransform;
      }
      setIsDownloadingPdf(false);
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
              onDownloadPdf={handleDownloadPdf}
              isParsing={isParsing}
              isDownloadingDocx={isDownloadingDocx}
              isDownloadingPdf={isDownloadingPdf}
              isPreviewAvailable={!!parsedData} // Pass the availability state
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
