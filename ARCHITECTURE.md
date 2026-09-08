# Architecture Note

## Priorities & Tradeoffs

Given the tight time constraint of the exercise, the primary goal was to deliver a complete, robust "happy path" for the core requirements: Document Editing, File Upload, Sharing, and Persistence.

### 1. Mocked Authentication Context
**Decision**: Instead of setting up a complex NextAuth provider and database session handling, I implemented a lightweight React Context (`UserContext.tsx`) that fetches seeded users from the database and allows switching between them via the header.
**Why**: This provides a clear, testable demonstration of sharing and ownership boundaries without bogging down the reviewer with credential management or OAuth setup.

### 2. Editor Choice (TipTap)
**Decision**: I used TipTap over simpler contenteditables or heavier alternatives like Quill.
**Why**: TipTap provides an excellent headless editing experience that integrates seamlessly with React and Tailwind (`@tailwindcss/typography`). It handles complex document operations robustly, allowing me to easily add formatting (Bold, Italic, Headings) without writing custom selection logic. 

### 3. Database (Prisma + SQLite)
**Decision**: Prisma ORM with a local SQLite database (`dev.db`).
**Why**: SQLite is the perfect choice for a scoped take-home project. It eliminates the need for reviewers to spin up a Docker container or connect to an external Postgres instance. Prisma provides excellent type safety from schema to frontend.

### 4. File Upload via FileReader API
**Decision**: Instead of uploading files to an S3 bucket or local `/public` directory, I process `.txt` and `.md` files entirely on the client side using the browser's `FileReader` API, sending only the extracted text content to the backend document creation endpoint.
**Why**: This approach simplifies infrastructure significantly and prevents file system pollution, while perfectly meeting the requirement of "turning an uploaded file into a new editable document."
