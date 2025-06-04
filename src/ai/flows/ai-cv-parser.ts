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
  contactInformation: z.string().describe('The contact information of the person, including email and phone number.'),
  experience: z.string().describe('The work experience of the person.'),
  education: z.string().describe('The education history of the person.'),
  skills: z.string().describe('The skills of the person.'),
});
export type ParseCVOutput = z.infer<typeof ParseCVOutputSchema>;

export async function parseCV(input: ParseCVInput): Promise<ParseCVOutput> {
  return parseCVFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseCVPrompt',
  input: {schema: ParseCVInputSchema},
  output: {schema: ParseCVOutputSchema},
  prompt: `You are an expert CV parser.  You will receive a CV in plain text format and you will parse it into its constituent sections.  The sections are name, contact information, experience, education, and skills.

CV Text: {{{cvText}}}

Make sure that the contact information includes both email and phone number.
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
