
import type { ParsedCvData } from '@/types/cv';
import { UserRound, Briefcase, GraduationCap, Lightbulb, Mail, Phone, Link as LinkIcon } from 'lucide-react';

interface ModernTemplateProps {
  data: ParsedCvData;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const { name, contactInformation, objective, experience, technicalSkills, personalSkills, education, certifications, interest } = data;

  // Basic parsing for contact info - can be improved
  const email = contactInformation.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0];
  const phone = contactInformation.match(/(\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\d{10})/)?.[0];
  const linkedIn = contactInformation.match(/linkedin\.com\/in\/[\w-]+/)?.[0];

  const skillsSections = [];
  if (technicalSkills) {
    skillsSections.push(`Technical Skills:\n${technicalSkills}`);
  }
  if (personalSkills) {
    skillsSections.push(`Personal Skills:\n${personalSkills}`);
  }
  const skillsContent = skillsSections.join('\n\n');

  return (
    <div className="cv-template-container p-8 bg-card text-card-foreground font-body shadow-lg rounded-md">
      <header className="text-center mb-8 border-b pb-6 border-border">
        <h1 className="font-headline text-4xl font-bold text-primary">{name || "Your Name"}</h1>
        <div className="flex justify-center items-center space-x-4 mt-2 text-sm text-muted-foreground">
          {email && <div className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {email}</div>}
          {phone && <div className="flex items-center"><Phone className="w-4 h-4 mr-1" /> {phone}</div>}
          {linkedIn && <div className="flex items-center"><LinkIcon className="w-4 h-4 mr-1" /> <a href={`https://${linkedIn}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{linkedIn}</a></div>}
        </div>
      </header>

      {objective && (
        <section className="mb-6">
          <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
            <UserRound className="w-6 h-6 mr-2" /> Objective
          </h2>
          <div className="text-sm" dangerouslySetInnerHTML={{ __html: objective?.replace(/\n/g, '<br />') || 'Your career objective...' }} />
        </section>
      )}

      <section className="mb-6">
        <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
          <Briefcase className="w-6 h-6 mr-2" /> Experience
        </h2>
        <div className="space-y-4 text-sm" dangerouslySetInnerHTML={{ __html: experience?.replace(/\n/g, '<br />') || 'Your professional experience...' }} />
      </section>

      <section className="mb-6">
        <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
          <GraduationCap className="w-6 h-6 mr-2" /> Education
        </h2>
        <div className="space-y-2 text-sm" dangerouslySetInnerHTML={{ __html: education?.replace(/\n/g, '<br />') || 'Your educational background...' }} />
      </section>

      {(technicalSkills || personalSkills) && (
        <section className="mb-6">
          <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" /> Skills
          </h2>
          <div className="text-sm" dangerouslySetInnerHTML={{ __html: skillsContent?.replace(/\n/g, '<br />') || 'Your key skills...' }} />
        </section>
      )}

      {certifications && (
        <section className="mb-6">
          <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" /> Certifications {/* Consider a different icon for certifications */}
          </h2>
          <div className="text-sm" dangerouslySetInnerHTML={{ __html: certifications?.replace(/\n/g, '<br />') || 'Your certifications...' }} />
        </section>
      )}

      {interest && (
        <section>
          <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" /> Interests {/* Consider a different icon for interests */}
          </h2>
          <div className="text-sm" dangerouslySetInnerHTML={{ __html: interest?.replace(/\n/g, '<br />') || 'Your interests...' }} />
        </section>
      )}
    </div>
  );
}
