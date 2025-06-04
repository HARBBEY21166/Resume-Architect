
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';
import type { ParsedCvData } from '@/types/cv';

const createSection = (
  sectionTitle: string,
  content: string | undefined | null,
): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  if (sectionTitle) {
    paragraphs.push(
      new Paragraph({
        text: sectionTitle,
        style: "SectionTitleStyle",
      })
    );
  }

  if (content) {
    const lines = content.split('\n');
    let isFirstNonBulletInExperienceEntry = sectionTitle.toLowerCase() === 'experience';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLineStart = line.trimStart();
      const fullTrimmedLine = line.trim();

      if (!fullTrimmedLine) { 
        if (sectionTitle.toLowerCase() === 'experience') {
          isFirstNonBulletInExperienceEntry = true;
        }
        // Add an empty paragraph for spacing, but ensure it doesn't get unintended styling
        const emptyPara = new Paragraph({ text: '', style: 'NormalParaStyle' });
        if (paragraphs.length > 0) {
            const lastPara = paragraphs[paragraphs.length - 1];
            // Avoid excessive spacing if the last para was already a section title or specific styled para.
            if (!lastPara.Style?.startsWith('SectionTitle')) {
                 emptyPara. زيادةSpacing({before: 80, after: 80});
            }
        }
        paragraphs.push(emptyPara);
        continue;
      }

      const isBullet = trimmedLineStart.startsWith('- ') || trimmedLineStart.startsWith('* ');
      const textContentForRun = (isBullet ? trimmedLineStart.substring(trimmedLineStart.indexOf(' ') + 1) : line).trimEnd();


      if (!textContentForRun.trim() && isBullet) { 
        continue;
      }
      if (!textContentForRun.trim() && !isBullet) { 
        // Allow empty lines to pass through as paragraph spacing if intended by user input
         paragraphs.push(new Paragraph({ text: '', style: 'NormalParaStyle', spacing: {after: 120} }));
        if (sectionTitle.toLowerCase() === 'experience') {
             isFirstNonBulletInExperienceEntry = true; // Reset for next potential job entry
        }
        continue;
      }


      const textRuns = [];
      if (sectionTitle.toLowerCase() === 'experience') {
        if (!isBullet) {
          if (isFirstNonBulletInExperienceEntry) {
            textRuns.push(new TextRun({ text: textContentForRun, bold: true, font: "Calibri", size: 22 }));
            isFirstNonBulletInExperienceEntry = false; 
          } else {
            textRuns.push(new TextRun({ text: textContentForRun, font: "Calibri", size: 22 })); 
          }
        } else { 
          textRuns.push(new TextRun({ text: textContentForRun, font: "Calibri", size: 22 }));
          // After a bullet point, the next non-bullet line should be considered a new entry header
          isFirstNonBulletInExperienceEntry = true; 
        }
      } else { 
        textRuns.push(new TextRun({ text: textContentForRun, font: "Calibri", size: 22 }));
      }

      if (textRuns.length > 0) {
        if (isBullet) {
          paragraphs.push(
            new Paragraph({
              children: textRuns,
              bullet: { level: 0 },
              indent: { left: 360 }, 
              style: 'NormalParaStyle',
              spacing: { after: 80 } 
            })
          );
        } else {
          paragraphs.push(
            new Paragraph({
              children: textRuns,
              style: 'NormalParaStyle', 
              spacing: { after: sectionTitle.toLowerCase() === 'experience' && !isFirstNonBulletInExperienceEntry ? 40 : 120 } // Tighter spacing after sub-lines in experience
            })
          );
        }
      }
    }
  }
  return paragraphs;
};


export async function generateDocxForModernTemplate(data: ParsedCvData): Promise<void> {
  const { name, title, contactInformation, objective, experience, technicalSkills, personalSkills, education, certifications, interest } = data;

  const contactParagraphs: Paragraph[] = [];
  if (contactInformation) {
    contactInformation.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        let paragraphChild;
        // Regex to check for email (simple version)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Regex to check for URL (simple version)
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
        const commonDomains = ['linkedin.com', 'github.com', 'portfolio', '.io', '.dev', '.me', '.tech', '.online', '.site', '.space', '.website'];
        
        const isLikelyUrl = urlRegex.test(trimmedLine) || commonDomains.some(domain => trimmedLine.includes(domain));

        if (emailRegex.test(trimmedLine)) { 
          paragraphChild = new ExternalHyperlink({
            children: [new TextRun({ text: trimmedLine, style: "Hyperlink" })],
            link: `mailto:${trimmedLine}`,
          });
        } else if (isLikelyUrl) { 
          const linkTarget = trimmedLine.startsWith('http://') || trimmedLine.startsWith('https://') ? trimmedLine : `https://${trimmedLine}`;
          paragraphChild = new ExternalHyperlink({
            children: [new TextRun({ text: trimmedLine, style: "Hyperlink" })],
            link: linkTarget,
          });
        } else {
          paragraphChild = new TextRun(trimmedLine);
        }
        contactParagraphs.push(new Paragraph({ children: [paragraphChild], style: "ContactInfoStyle" }));
      }
    });
  }

  const children: Paragraph[] = [
    new Paragraph({
      text: name || "Your Name",
      style: "NameStyle",
    }),
  ];

  if (title) {
    children.push(new Paragraph({
      text: title,
      style: "TitleStyle",
    }));
  }

  children.push(...contactParagraphs);
  children.push(new Paragraph({ text: '', style: "NormalParaStyle", spacing: { before: 20, after: 20 } }));


  if (objective) children.push(...createSection("Objective", objective));
  if (experience) children.push(...createSection("Experience", experience));
  if (education) children.push(...createSection("Education", education));

  const skillsParagraphs: Paragraph[] = [];
  if (technicalSkills || personalSkills) {
     skillsParagraphs.push(
        new Paragraph({
          text: "Skills",
          style: "SectionTitleStyle",
        })
      );
    if (technicalSkills) {
        skillsParagraphs.push(new Paragraph({ text: "Technical:", style: "SkillSubheadingStyle" }));
        technicalSkills.split('\n').forEach(line => {
            if (line.trim()) skillsParagraphs.push(new Paragraph({ text: line.trim(), style: "NormalParaStyle" }));
        });
    }
    if (personalSkills) {
        skillsParagraphs.push(new Paragraph({ text: "Personal:", style: "SkillSubheadingStyle" }));
        personalSkills.split('\n').forEach(line => {
            if (line.trim()) skillsParagraphs.push(new Paragraph({ text: line.trim(), style: "NormalParaStyle" }));
        });
    }
    children.push(...skillsParagraphs);
  }

  if (certifications) children.push(...createSection("Certifications", certifications));
  if (interest) children.push(...createSection("Interests", interest));


  const doc = new Document({
    creator: "Resume Architect",
    title: `${name || 'CV'} - Modern Template by Resume Architect`,
    description: "Curriculum Vitae generated by Resume Architect",
    styles: {
      characterStyles: [
        {
          id: 'Hyperlink',
          name: 'Hyperlink',
          basedOn: 'DefaultParagraphFont',
          run: {
            color: '0563C1', // Standard hyperlink blue
            underline: {
              type: 'single',
              color: '0563C1',
            },
          },
        },
      ],
      paragraphStyles: [
        {
          id: "NameStyle",
          name: "Name Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 40, bold: true, font: "Calibri" }, 
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 100 } },
        },
        {
          id: "TitleStyle",
          name: "Title Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 28, font: "Calibri" }, 
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 180 } },
        },
        {
          id: "ContactInfoStyle",
          name: "Contact Info Style",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Calibri", size: 20 }, 
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 40 } },
        },
        {
          id: "SectionTitleStyle",
          name: "Section Title Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 26, bold: true, font: "Calibri", color: "2E74B5" }, 
          paragraph: { spacing: { before: 280, after: 140 }, border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } } }, 
        },
        {
          id: "SkillSubheadingStyle",
          name: "Skill Subheading",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 22, bold: true, font: "Calibri" }, 
          paragraph: { spacing: { before: 100, after: 80 } },
        },
        {
          id: "NormalParaStyle",
          name: "Normal Para Style",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Calibri", size: 22 }, 
          paragraph: { spacing: { after: 120 } }, 
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1080, 
            right: 1080,
            bottom: 1080,
            left: 1080,
          },
        },
      },
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${(name || 'CV').replace(/\s+/g, '_')}_Modern.docx`);
}
