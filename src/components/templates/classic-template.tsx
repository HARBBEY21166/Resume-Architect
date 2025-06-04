
import type { ParsedCvData } from '@/types/cv';
import { Mail, Phone, Link as LinkIcon, UserRound, Briefcase, GraduationCap, Lightbulb, Award, Smile } from 'lucide-react';

interface ClassicTemplateProps {
  data: ParsedCvData;
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { name, contactInformation, objective, experience, technicalSkills, personalSkills, education, certifications, interest } = data;

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
    <div className="cv-template-container p-8 bg-card text-card-foreground font-body shadow-lg rounded-md border border-border">
      <header className="text-center mb-6">
        <h1 className="font-headline text-3xl font-bold text-primary tracking-wider uppercase">{name || "YOUR NAME"}</h1>
        <div className="mt-2 text-xs text-muted-foreground">
          {email && <span>{email}</span>}
          {phone && <> <span className="mx-1">|</span> <span>{phone}</span></>}
          {linkedIn && <> <span className="mx-1">|</span> <a href={`https://${linkedIn}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{linkedIn}</a></>}
        </div>
      </header>

      {objective && (
        <>
          <hr className="my-6 border-border" />
          <section className="mb-6 text-center">
            <h2 className="font-headline text-xl font-semibold text-accent mb-2 tracking-wide">OBJECTIVE</h2>
            <div className="text-sm text-center" dangerouslySetInnerHTML={{ __html: objective?.replace(/\n/g, '<br />') || 'Your career objective...' }} />
          </section>
        </>
      )}

      <hr className="my-6 border-border" />

      <section className="mb-6 text-center">
        <h2 className="font-headline text-xl font-semibold text-accent mb-2 tracking-wide">EXPERIENCE</h2>
        <div className="space-y-3 text-sm text-center" dangerouslySetInnerHTML={{ __html: experience?.replace(/\n/g, '<br />') || 'Your professional experience...' }} />
      </section>

      <hr className="my-6 border-border" />

      <section className="mb-6 text-center">
        <h2 className="font-headline text-xl font-semibold text-accent mb-2 tracking-wide">EDUCATION</h2>
        <div className="space-y-1 text-sm text-center" dangerouslySetInnerHTML={{ __html: education?.replace(/\n/g, '<br />') || 'Your educational background...' }} />
      </section>

      {(technicalSkills || personalSkills) && (
        <>
          <hr className="my-6 border-border" />
          <section className="mb-6 text-center">
            <h2 className="font-headline text-xl font-semibold text-accent mb-2 tracking-wide">SKILLS</h2>
            <div className="text-sm text-center" dangerouslySetInnerHTML={{ __html: skillsContent?.replace(/\n/g, '<br />') || 'Your key skills...' }} />
          </section>
        </>
      )}

      {certifications && (
        <>
          <hr className="my-6 border-border" />
          <section className="mb-6 text-center">
            <h2 className="font-headline text-xl font-semibold text-accent mb-2 tracking-wide">CERTIFICATIONS</h2>
            <div className="text-sm text-center" dangerouslySetInnerHTML={{ __html: certifications?.replace(/\n/g, '<br />') || 'Your certifications...' }} />
          </section>
        </>
      )}
      
      {interest && (
        <>
          <hr className="my-6 border-border" />
          <section className="text-center">
            <h2 className="font-headline text-xl font-semibold text-accent mb-2 tracking-wide">INTERESTS</h2>
            <div className="text-sm text-center" dangerouslySetInnerHTML={{ __html: interest?.replace(/\n/g, '<br />') || 'Your interests...' }} />
          </section>
        </>
      )}
    </div>
  );
}
