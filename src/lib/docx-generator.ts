
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageNumberFormat, SectionType, PageOrientation, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';
import type { ParsedCvData } from '@/types/cv';

const createSection = (
  sectionTitle: string,
  content: string | undefined | null,
  headingLevel: HeadingLevel
): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  if (sectionTitle) {
    paragraphs.push(
      new Paragraph({
        text: sectionTitle,
        heading: headingLevel,
        style: "SectionTitleStyle", 
      })
    );
  }
  if (content) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      // Remove leading/trailing whitespace for processing, but preserve internal spaces
      const trimmedLine = line.trimStart(); 
      
      if (trimmedLine) { // Process non-empty lines
        const isBullet = trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ');
        // For bullet points, remove the bullet character and trim leading space from the content
        const textContent = isBullet ? trimmedLine.substring(trimmedLine.indexOf(' ') + 1).trimStart() : line; // Use original line for non-bullets to preserve indentation

        const textRuns = [];
        // Special handling for Experience section to bold titles/company lines
        if (sectionTitle.toLowerCase() === 'experience' && !isBullet && textContent.trim()) {
          textRuns.push(new TextRun({ text: textContent.trimEnd(), bold: true })); // Trim end for bolded lines
        } else if (textContent.trim()) { // Ensure non-empty content after processing
          textRuns.push(new TextRun(textContent.trimEnd())); // Trim end for regular lines
        } else {
          // Handle cases where textContent might be empty after trimming, to avoid empty TextRun
          continue;
        }

        if (isBullet) {
          paragraphs.push(
            new Paragraph({
              children: textRuns,
              bullet: { level: 0 },
              indent: { left: convertInchesToTwip(0.5) }, 
              style: 'NormalParaStyle', 
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
        // If the original line was just whitespace but not completely empty, create a blank paragraph
        // This helps preserve intentional blank lines from the AI output.
         if (line.length > 0 && !line.trim()) {
            paragraphs.push(new Paragraph({style: 'NormalParaStyle'}));
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
  
  // Add a small manual space after contact info before the first section
  children.push(new Paragraph({ style: "NormalParaStyle", spacing: { before: 100 } }));


  if (objective) children.push(...createSection("Objective", objective, HeadingLevel.HEADING_3));
  if (experience) children.push(...createSection("Experience", experience, HeadingLevel.HEADING_3));
  if (education) children.push(...createSection("Education", education, HeadingLevel.HEADING_3));
  
  const skillsParagraphs: Paragraph[] = [];
  if (technicalSkills || personalSkills) {
     skillsParagraphs.push(
        new Paragraph({
          text: "Skills",
          heading: HeadingLevel.HEADING_3,
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
          run: { size: convertInchesToTwip(24 / 72), bold: true, font: "Calibri" }, // 24pt
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: convertInchesToTwip(0.05) } },
        },
        {
          id: "TitleStyle",
          name: "Title Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: convertInchesToTwip(14 / 72), font: "Calibri" }, // 14pt
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: convertInchesToTwip(0.1) } },
        },
        {
          id: "ContactInfoStyle",
          name: "Contact Info Style",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Calibri", size: convertInchesToTwip(10 / 72) }, // 10pt
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: convertInchesToTwip(0.02) } }, // Minimal spacing between contact lines
        },
        {
          id: "SectionTitleStyle", // HEADING_3 will map to this
          name: "Section Title Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: convertInchesToTwip(14 / 72), bold: true, font: "Calibri", color: "4F81BD" }, // 14pt, Accent color like "Modern"
          paragraph: { spacing: { before: convertInchesToTwip(0.2), after: convertInchesToTwip(0.1) } }, // Spacing around section titles
        },
        {
          id: "SkillSubheadingStyle",
          name: "Skill Subheading",
          basedOn: "Normal",
          next: "Normal",
          run: { size: convertInchesToTwip(11 / 72), bold: true, font: "Calibri" }, // 11pt bold
          paragraph: { spacing: { before: convertInchesToTwip(0.05), after: convertInchesToTwip(0.05) } },
        },
        {
          id: "NormalParaStyle",
          name: "Normal Para Style",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Calibri", size: convertInchesToTwip(11 / 72) }, // 11pt
          paragraph: { spacing: { after: convertInchesToTwip(0.07) } }, // Default spacing after paragraphs (approx 5pt)
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

// Helper to convert points to Twips (1 point = 20 twips)
// However, docx.js `size` property for runs seems to expect half-points.
// So, size: 22 means 11pt.
// For margins etc, using convertInchesToTwip is more reliable.
// The library's direct use of point sizes (e.g., size: 48 for 24pt) is what we'll use for fonts.
// The createSection uses HeadingLevel, which then needs to be mapped to a style.
// In this setup, HEADING_3 is implicitly styled by "SectionTitleStyle".
