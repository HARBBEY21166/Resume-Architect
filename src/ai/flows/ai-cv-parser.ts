
'use server';

/**
 * @fileOverview An AI-powered CV parsing tool.
 *
 * - parseCV - A function that handles the CV parsing process.
 * - ParseCVInput - The input type for the parseCV function.
 * - ParseCVOutput - The return type for the parseCV function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseCVInputSchema = z.object({
  cvText: z.string().describe('The plain text of the CV to parse.'),
});
export type ParseCVInput = z.infer<typeof ParseCVInputSchema>;

const ParseCVOutputSchema = z.object({
  name: z.string().describe('The name of the person.'),
  title: z.string().describe('The professional title of the person (e.g., Front-End Developer).').optional(),
  contactInformation: z.string().describe('The contact information of the person, including email, phone number, address, and links like Portfolio, GitHub, LinkedIn.'),
  experience: z.string().describe('The work experience of the person, including company, role, dates, and responsibilities.'),
  education: z.string().describe('The education history of the person, including institution, degree, and dates.'),
  technicalSkills: z.string().describe('The technical skills of the person, including programming languages, frameworks, tools, and platforms.'),
  personalSkills: z.string().describe('The personal skills or soft skills of the person (e.g., communication, teamwork).'),
  objective: z.string().describe('The career objective or summary of the person.'),
  certifications: z.string().describe('The certifications obtained by the person, including issuer and dates.'),
  interest: z.string().describe('The interests or hobbies of the person.'),
});
export type ParseCVOutput = z.infer<typeof ParseCVOutputSchema>;

export async function parseCV(input: ParseCVInput): Promise<ParseCVOutput> {
  return parseCVFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseCVPrompt',
  input: {schema: ParseCVInputSchema},
  output: {schema: ParseCVOutputSchema},
  prompt: `You are an expert CV parser. You will receive a CV in plain text format and you will parse it into its constituent sections.

CV Text:
{{{cvText}}}

Instructions:
1.  Extract the person's full name and place it in the 'name' field.
2.  Extract the professional title (e.g., 'Front-End Developer', 'Software Engineer') if present, and place it in the 'title' field. If not present, this can be omitted.
3.  For 'contactInformation', gather all contact details: email, phone number, physical address (if available), and any links to personal portfolios, GitHub, LinkedIn, or other professional profiles. Format these clearly, preserving line breaks if the original text uses them for structure.
4.  The 'objective' field should contain the career objective or summary statement.
5.  The 'experience' field should detail work history. For each role:
    *   Start with the job title and company name on the first line.
    *   On a new line, include location (and if it's remote) and dates of employment.
    *   Follow with a list of responsibilities or achievements. **Each responsibility or achievement must be on a new line and start with a hyphen and a space (e.g., "- Managed a team...").**
6.  The 'education' field should list academic qualifications, including the institution name, degree or course title, and dates attended or graduation date.
7.  For skills:
    *   'technicalSkills': Combine all programming languages, frameworks, libraries, software tools, platforms (e.g., Figma, Git), and specific technical abilities here.
    *   'personalSkills': List soft skills, interpersonal abilities, and general competencies like communication, teamwork, problem-solving, UI/UX Design (if listed as a general skill rather than a tool proficiency).
8.  The 'certifications' field should list any professional certifications, including the name of the certification, the issuing body, and the date obtained.
9.  The 'interest' field should capture hobbies or personal interests.

Ensure that the contact information is comprehensive and includes email, phone number and any professional web links.
Preserve the structure (like bullet points or paragraph breaks) within each section's content as much as possible.
For the 'experience' section, ensure each distinct job role's details are clearly separated, typically by one or more blank lines if multiple roles are listed.
`,
});

const parseCVFlow = ai.defineFlow(
  {
    name: 'parseCVFlow',
    inputSchema: ParseCVInputSchema,
    outputSchema: ParseCVOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
