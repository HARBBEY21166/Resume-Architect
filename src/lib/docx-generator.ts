
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, SectionType, PageOrientation, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';
import type { ParsedCvData } from '@/types/cv';

const createSection = (
  sectionTitle: string,
  content: string | undefined | null,
  headingLevel: HeadingLevel // Retained for semantic mapping, though styling is direct
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
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmedLine = line.trimStart(); 
      
      if (trimmedLine) {
        const isBullet = trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ');
        const textContent = isBullet ? trimmedLine.substring(trimmedLine.indexOf(' ') + 1).trimStart() : line;

        const textRuns = [];
        // Special handling for Experience section to bold titles/company lines
        if (sectionTitle.toLowerCase() === 'experience' && !isBullet && textContent.trim()) {
          textRuns.push(new TextRun({ text: textContent.trimEnd(), bold: true }));
        } else if (textContent.trim()) {
          textRuns.push(new TextRun(textContent.trimEnd()));
        } else {
          continue;
        }

        if (isBullet) {
          paragraphs.push(
            new Paragraph({
              children: textRuns,
              bullet: { level: 0 },
              indent: { left: convertInchesToTwip(0.25) }, // Standard bullet indent
              style: 'NormalParaStyle', 
              spacing: { after: convertInchesToTwip(0.05) } // Small space after bullet items
            })
          );
        } else {
          paragraphs.push(
            new Paragraph({
              children: textRuns,
              style: 'NormalParaStyle', 
            })
          );
        }
      } else { 
         if (line.length > 0 && !line.trim()) {
            paragraphs.push(new Paragraph({style: 'NormalParaStyle'}));
         }
      }
    }
  }
  // Add a bit more space after a section before the next one starts
  if (paragraphs.length > 0) {
    paragraphs[paragraphs.length -1]. زيادةSpacing({ after: convertInchesToTwip(0.15) });
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
  
  const children = [
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
  
  children.push(new Paragraph({ style: "NormalParaStyle", spacing: { before: convertInchesToTwip(0.1) } }));


  if (objective) children.push(...createSection("Objective", objective, HeadingLevel.HEADING_3));
  if (experience) children.push(...createSection("Experience", experience, HeadingLevel.HEADING_3));
  if (education) children.push(...createSection("Education", education, HeadingLevel.HEADING_3));
  
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
     if (skillsParagraphs.length > 1) { // Check if any skill content was added
        skillsParagraphs[skillsParagraphs.length -1].เพิ่มSpacing({ after: convertInchesToTwip(0.15) });
    }
    children.push(...skillsParagraphs);
  }

  if (certifications) children.push(...createSection("Certifications", certifications, HeadingLevel.HEADING_3));
  if (interest) children.push(...createSection("Interests", interest, HeadingLevel.HEADING_3));


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
          run: { size: 44, bold: true, font: "Calibri" }, // 22pt
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: convertInchesToTwip(0.05) } },
        },
        {
          id: "TitleStyle",
          name: "Title Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 28, font: "Calibri" }, // 14pt
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: convertInchesToTwip(0.1) } },
        },
        {
          id: "ContactInfoStyle",
          name: "Contact Info Style",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Calibri", size: 20 }, // 10pt
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: convertInchesToTwip(0.02) } },
        },
        {
          id: "SectionTitleStyle",
          name: "Section Title Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 24, bold: true, font: "Calibri", color: "4F81BD" }, // 12pt, Accent color
          paragraph: { spacing: { before: convertInchesToTwip(0.2), after: convertInchesToTwip(0.1) } },
        },
        {
          id: "SkillSubheadingStyle",
          name: "Skill Subheading",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 22, bold: true, font: "Calibri" }, // 11pt bold
          paragraph: { spacing: { before: convertInchesToTwip(0.05), after: convertInchesToTwip(0.05) } },
        },
        {
          id: "NormalParaStyle",
          name: "Normal Para Style",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Calibri", size: 22 }, // 11pt
          paragraph: { spacing: { after: convertInchesToTwip(0.07) } },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.75), 
            right: convertInchesToTwip(0.75),
            bottom: convertInchesToTwip(0.75),
            left: convertInchesToTwip(0.75),
          },
        },
      },
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${(name || 'CV').replace(/\s+/g, '_')}_Modern.docx`);
}

// Helper for Paragraph to add spacing - a bit of a workaround since direct modification isn't straightforward
interface ParagraphWithSpacing extends Paragraph {
    เพิ่มSpacing?(spacingOptions: { after?: number; before?: number }): void;
}

Paragraph.prototype.เพิ่มSpacing = function(spacingOptions: { after?: number; before?: number }) {
    const currentSpacing = this.properties.spacing || {};
    if (spacingOptions.after !== undefined) {
        currentSpacing.after = (currentSpacing.after || 0) + spacingOptions.after;
    }
    if (spacingOptions.before !== undefined) {
        currentSpacing.before = (currentSpacing.before || 0) + spacingOptions.before;
    }
    this.properties.spacing = currentSpacing;
};
