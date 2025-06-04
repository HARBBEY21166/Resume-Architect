import type { ParsedCvData } from '@/types/cv';
import { Mail, Phone, Linkedin, Briefcase, GraduationCap, Zap } from 'lucide-react';

interface CreativeTemplateProps {
  data: ParsedCvData;
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const { name, contactInformation, experience, education, skills } = data;

  const email = contactInformation.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0];
  const phone = contactInformation.match(/(\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\d{10})/)?.[0];
  const linkedInText = contactInformation.match(/linkedin\.com\/in\/[\w-]+/)?.[0];
  const linkedInUrl = linkedInText ? `https://${linkedInText}` : '#';


  return (
    <div className="cv-template-container flex p-0 bg-card text-card-foreground font-body shadow-lg rounded-md overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-1/3 bg-accent/20 p-6 text-accent-foreground">
        <div className="text-center mb-8">
            <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-primary-foreground font-headline text-4xl">
                {name?.substring(0,1) || 'Y'}
            </div>
          <h1 className="font-headline text-3xl font-bold text-primary">{name || "Your Name"}</h1>
        </div>
        
        <div className="space-y-3 text-sm">
          {email && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 shrink-0" />
              <span>{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 shrink-0" />
              <span>{phone}</span>
            </div>
          )}
          {linkedInText && (
            <div className="flex items-center">
              <Linkedin className="w-4 h-4 mr-2 shrink-0" />
              <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                {linkedInText}
              </a>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-8 space-y-6 overflow-y-auto">
        <section>
          <h2 className="font-headline text-2xl font-semibold text-primary mb-3 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-accent" /> Experience
          </h2>
          <div className="space-y-4 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: experience?.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br />') || '<p>Your professional experience...</p>' }} />
        </section>

        <hr className="border-border"/>

        <section>
          <h2 className="font-headline text-2xl font-semibold text-primary mb-3 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-accent" /> Education
          </h2>
          <div className="space-y-2 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: education?.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br />') || '<p>Your educational background...</p>' }} />
        </section>
        
        <hr className="border-border"/>

        <section>
          <h2 className="font-headline text-2xl font-semibold text-primary mb-3 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-accent" /> Skills
          </h2>
          <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: skills?.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br />') || '<p>Your key skills...</p>' }} />
        </section>
      </main>
    </div>
  );
}
