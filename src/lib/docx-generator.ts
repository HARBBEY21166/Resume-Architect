
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, SectionType, PageOrientation, convertInchesToTwip } from 'docx';
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
              indent: { left: convertInchesToTwip(0.25) },
              style: 'NormalParaStyle',
              spacing: { after: convertInchesToTwip(0.05) }
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
  if (paragraphs.length > 0) {
    const lastParagraph = paragraphs[paragraphs.length - 1];
    const currentSpacing = lastParagraph.properties.spacing || {};
    currentSpacing.after = (currentSpacing.after || 0) + convertInchesToTwip(0.15);
    lastParagraph.properties.spacing = currentSpacing;
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
     if (skillsParagraphs.length > 1) { 
        const lastSkillParagraph = skillsParagraphs[skillsParagraphs.length - 1];
        const currentSkillSpacing = lastSkillParagraph.properties.spacing || {};
        currentSkillSpacing.after = (currentSkillSpacing.after || 0) + convertInchesToTwip(0.15);
        lastSkillParagraph.properties.spacing = currentSkillSpacing;
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
          run: { size: 44, bold: true, font: "Calibri" },
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 100 } }, // approx 0.05 inches
        },
        {
          id: "TitleStyle",
          name: "Title Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 28, font: "Calibri" },
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 200 } }, // approx 0.1 inches
        },
        {
          id: "ContactInfoStyle",
          name: "Contact Info Style",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Calibri", size: 20 },
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 40 } }, // approx 0.02 inches
        },
        {
          id: "SectionTitleStyle",
          name: "Section Title Style",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 24, bold: true, font: "Calibri", color: "4F81BD" },
          paragraph: { spacing: { before: 400, after: 200 } }, // approx 0.2 & 0.1 inches
        },
        {
          id: "SkillSubheadingStyle",
          name: "Skill Subheading",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 22, bold: true, font: "Calibri" },
          paragraph: { spacing: { before: 100, after: 100 } }, // approx 0.05 inches
        },
        {
          id: "NormalParaStyle",
          name: "Normal Para Style",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Calibri", size: 22 },
          paragraph: { spacing: { after: 140 } }, // approx 0.07 inches
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
