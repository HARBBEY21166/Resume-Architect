
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
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

      if (!fullTrimmedLine) { // Line is empty or contains only whitespace
        if (sectionTitle.toLowerCase() === 'experience') {
          isFirstNonBulletInExperienceEntry = true;
        }
        paragraphs.push(new Paragraph({ text: '', style: 'NormalParaStyle' })); // Add empty paragraph for spacing
        continue;
      }

      const isBullet = trimmedLineStart.startsWith('- ') || trimmedLineStart.startsWith('* ');
      // Get text content, removing bullet marker if present, and trim trailing spaces
      const textContentForRun = (isBullet ? trimmedLineStart.substring(trimmedLineStart.indexOf(' ') + 1) : line).trimEnd();


      if (!textContentForRun.trim() && isBullet) { // e.g. line is just "- " or "-    "
        // Skip creating a paragraph for a bullet that has no actual content after it
        continue;
      }
      if (!textContentForRun.trim() && !isBullet) { // line is not a bullet but has no content after trimming (should be caught by !fullTrimmedLine)
        continue;
      }


      const textRuns = [];
      if (sectionTitle.toLowerCase() === 'experience') {
        if (!isBullet) {
          if (isFirstNonBulletInExperienceEntry) {
            textRuns.push(new TextRun({ text: textContentForRun, bold: true }));
            isFirstNonBulletInExperienceEntry = false; // Subsequent non-bullets in this entry are not bold
          } else {
            textRuns.push(new TextRun({ text: textContentForRun })); // e.g., location/date line
          }
        } else { // isBullet
          textRuns.push(new TextRun({ text: textContentForRun }));
          // After a bullet point, the next non-bullet line should be considered the start of a new entry (or just be normal text if not in experience)
          isFirstNonBulletInExperienceEntry = true;
        }
      } else { // For sections other than experience
        textRuns.push(new TextRun({ text: textContentForRun }));
      }

      if (textRuns.length > 0) {
        if (isBullet) {
          paragraphs.push(
            new Paragraph({
              children: textRuns,
              bullet: { level: 0 },
              indent: { left: 360 }, // 0.25 inches
              style: 'NormalParaStyle',
              spacing: { after: 80 } // Approx 4pt
            })
          );
        } else {
          paragraphs.push(
            new Paragraph({
              children: textRuns,
              style: 'NormalParaStyle', // Inherits spacing from style (after: 120 / 6pt)
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
      if (line.trim()) {
        contactParagraphs.push(new Paragraph({ text: line.trim(), style: "ContactInfoStyle" }));
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
  children.push(new Paragraph({ text: '', style: "NormalParaStyle", spacing: { before: 20 } })); // Small space after contact info


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
    creator: "CV-Genius",
    title: `${name || 'CV'} - Modern Template`,
    description: "Curriculum Vitae generated by CV-Genius",
    styles: {
      paragraphStyles: [
        {
          id: "NameStyle",
          name: "Name Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 40, bold: true, font: "Calibri" }, // 20pt
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 100 } },
        },
        {
          id: "TitleStyle",
          name: "Title Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 28, font: "Calibri" }, // 14pt
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 180 } },
        },
        {
          id: "ContactInfoStyle",
          name: "Contact Info Style",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Calibri", size: 20 }, // 10pt
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 40 } },
        },
        {
          id: "SectionTitleStyle",
          name: "Section Title Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 26, bold: true, font: "Calibri", color: "3A5FCD" }, // 13pt, slightly darker blue
          paragraph: { spacing: { before: 280, after: 140 } }, // 14pt before, 7pt after
        },
        {
          id: "SkillSubheadingStyle",
          name: "Skill Subheading",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 22, bold: true, font: "Calibri" }, // 11pt
          paragraph: { spacing: { before: 100, after: 80 } },
        },
        {
          id: "NormalParaStyle",
          name: "Normal Para Style",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Calibri", size: 22 }, // 11pt
          paragraph: { spacing: { after: 120 } }, // 6pt after
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1080, // 0.75 inches
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

