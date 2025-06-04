
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
  name: 'Abiodun Aina',
  title: 'Front-End Developer',
  contactInformation: `📍 Bramley View, Johannesburg, 2090, South Africa
📞 +27641663906
✉️ olamilekan445@gmail.com
🔗 Portfolio: yourportfolio.com
👨‍💻 GitHub: github.com/yourusername
💼 LinkedIn: linkedin.com/in/yourprofile`,
  objective: 'Frontend Developer & Junior UX/UI Designer with 2+ years of experience building responsive, performance-driven web apps using React, WordPress, and Firebase. Strong communicator with proven results in remote, international teams. Recently built a full-stack e-commerce platform during a DevelopersHub internship. Passionate about transforming ideas into seamless digital products and creating visually pleasing, thoughtful, and user-friendly experiences.',
  experience: `Full-Stack Developer Intern @ DevelopersHub
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
- Implemented design adjustments based on client feedback, including color consistency to maintain brand identity.`,
  education: `- Advanced Front-End Development, ALX (Nov 2024 – Mar 2025)
- Front-End Web Development, ALX (May 2024 – Oct 2024)
- Responsive Web Design, freeCodeCamp (Jun 2022 – Oct 2022)`,
  technicalSkills: `Languages & Frameworks: HTML5, CSS3, TypeScript, JavaScript, WordPress, React, Firebase, Next.js, Tailwind, Bootstrap
Tools & Platforms: Figma, Git/GitHub, Prototyping, UI/UX Design, Wireframing`,
  personalSkills: 'UI Design, UX Design, Google Workspace, Slack, Communication, Teamwork, Problem-Solving',
  certifications: `- Front-End Software Engineering Job Simulation, Skyscanner Forage (Apr 2025)
- Certificate Of Front-End Web Development, Alx_Africa (Feb 2025)
- Certificate Of Web Development, GAOTek Inc. (Jan 2025)
- Responsive Web Design, freeCodeCamp (Oct 2022)`,
  interest: `- Problem-Solving Games (e.g., puzzles or coding challenges)
- UI/UX Design
- Exploring and learning new technologies related to web development.`,
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
