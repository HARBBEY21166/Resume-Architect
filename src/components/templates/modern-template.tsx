
import type { ParsedCvData } from '@/types/cv';
import { UserRound, Briefcase, GraduationCap, Lightbulb, Mail, Phone, Link as LinkIcon, Award, Smile, Star } from 'lucide-react'; // Added Award, Smile, Star

interface ModernTemplateProps {
  data: ParsedCvData;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const { name, title, contactInformation, objective, experience, technicalSkills, personalSkills, education, certifications, interest } = data;

  // Attempt to parse contact info for display, but primarily rely on AI's formatting.
  const contactLines = contactInformation?.split('\n').map(line => line.trim()).filter(line => line);

  return (
    <div className="cv-template-container p-8 bg-card text-card-foreground font-body shadow-lg rounded-md">
      <header className="text-center mb-8 border-b pb-6 border-border">
        <h1 className="font-headline text-4xl font-bold text-primary">{name || "Your Name"}</h1>
        {title && <p className="font-headline text-xl text-muted-foreground mt-1">{title}</p>}
        <div className="mt-3 text-sm text-muted-foreground space-y-1">
          {contactLines?.map((line, index) => (
            <div key={index} className="flex items-center justify-center">
              {line.includes('@') && <Mail className="w-4 h-4 mr-2 opacity-70" />}
              {(line.match(/\d{3,}/) && (line.includes('+') || line.includes('(') || line.includes('-'))) && <Phone className="w-4 h-4 mr-2 opacity-70" />}
              {(line.includes('linkedin.com') || line.includes('github.com') || line.includes('portfolio') || line.includes('http')) && <LinkIcon className="w-4 h-4 mr-2 opacity-70" />}
              <span>{line}</span>
            </div>
          ))}
        </div>
      </header>

      {objective && (
        <section className="mb-6">
          <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
            <UserRound className="w-6 h-6 mr-2" /> Objective
          </h2>
          <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: objective?.replace(/\n/g, '<br />') || 'Your career objective...' }} />
        </section>
      )}

      {experience && (
        <section className="mb-6">
          <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
            <Briefcase className="w-6 h-6 mr-2" /> Experience
          </h2>
          <div className="space-y-4 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: experience?.replace(/\n/g, '<br />') || 'Your professional experience...' }} />
        </section>
      )}
      
      {education && (
        <section className="mb-6">
          <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2" /> Education
          </h2>
          <div className="space-y-2 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: education?.replace(/\n/g, '<br />') || 'Your educational background...' }} />
        </section>
      )}

      {(technicalSkills || personalSkills) && (
        <section className="mb-6">
          <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" /> Skills
          </h2>
          {technicalSkills && (
            <div className="text-sm prose prose-sm max-w-none mb-2">
              <h3 className="font-semibold text-md text-primary/80 mb-1">Technical:</h3>
              <div dangerouslySetInnerHTML={{ __html: technicalSkills?.replace(/\n/g, '<br />') || '' }} />
            </div>
          )}
          {personalSkills && (
            <div className="text-sm prose prose-sm max-w-none">
              <h3 className="font-semibold text-md text-primary/80 mb-1">Personal:</h3>
              <div dangerouslySetInnerHTML={{ __html: personalSkills?.replace(/\n/g, '<br />') || '' }} />
            </div>
          )}
          {!(technicalSkills || personalSkills) && <p className="text-sm">Your key skills...</p>}
        </section>
      )}

      {certifications && (
        <section className="mb-6">
          <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
            <Award className="w-6 h-6 mr-2" /> Certifications 
          </h2>
          <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: certifications?.replace(/\n/g, '<br />') || 'Your certifications...' }} />
        </section>
      )}

      {interest && (
        <section>
          <h2 className="font-headline text-2xl font-semibold text-accent mb-3 flex items-center">
            <Smile className="w-6 h-6 mr-2" /> Interests
          </h2>
          <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: interest?.replace(/\n/g, '<br />') || 'Your interests...' }} />
        </section>
      )}
    </div>
  );
}
