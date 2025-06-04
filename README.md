# CV Builder

This is a web application built with Next.js, designed to help users create professional CVs.

## Features

* **Classic Template:** A template for generating CVs with sections for contact information, objective, experience, technical skills, personal skills, education, certifications, and interests.
* **Dynamic Data Rendering:** The application takes structured CV data and dynamically renders it into the chosen template.
* **Downloadable Output:** Users can likely download their generated CVs (although the current files mainly show the rendering logic).

## Getting Started

This application is built using Next.js.

1. **Clone the repository:**

bash git clone <repository_url>

2. **Install dependencies:**

bash npm install


3. **Run the development server:**

bash npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

* `src/app/page.tsx`: The main application page.
* `src/components/templates/classic-template.tsx`: Defines the structure and rendering logic for the classic CV template.
* `src/lib/docx-generator.ts`: Contains logic for generating DOCX files (likely the download functionality).
* `src/components/cv-preview-card.tsx`: A component used to preview CV data.
* `src/types/cv.ts`: Defines the TypeScript types for the CV data structure.

## Technologies Used

* **Next.js:** React framework for building server-side rendered and static web applications.
* **TypeScript:** Adds static typing to JavaScript.
* **Lucide React:** A library of open-source icons.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

[Abiodun Aina]
