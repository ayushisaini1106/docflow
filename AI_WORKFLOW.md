# AI Workflow Note

As requested for this AI-forward role, here is a summary of how AI tools were integrated into my development workflow for this project.

### 1. Which AI tools I used
I primarily used **GitHub Copilot** integrated directly into my VS Code editor. I relied on its autocomplete and inline chat features.

### 2. Where AI materially sped up my work
AI was exceptionally helpful in writing boilerplate code and scaffolding out repetitive structures. For example:
- **Prisma Schema Generation**: Copilot accurately predicted the relationship models between `User`, `Document`, and `DocumentShare` based on standard naming conventions.
- **Tailwind Classes**: Writing Tailwind classes for the UI components (like the dashboard layout and the editor toolbar) was sped up significantly by Copilot suggesting complete class strings for Flexbox and grid layouts.
- **Seed Script**: Copilot generated the standard Prisma `upsert` patterns for seeding Alice and Bob.

### 3. What AI-generated output I changed or rejected
- **Database Architecture**: Copilot initially suggested a complex many-to-many relationship table for document sharing with permissions flags (edit/view). I rejected this and manually wrote a simpler `DocumentShare` model because the prompt specifically requested a simple sharing model, and I wanted to prioritize execution over unnecessary complexity.
- **TipTap Setup**: AI occasionally suggested outdated imports for TipTap (v2 vs v3 syntax). I manually corrected these by referencing the official TipTap documentation to ensure stability.
- **API Error Handling**: Copilot often suggests bare `try/catch` blocks returning generic 500s. I manually rewrote the endpoints to handle specific status codes (e.g., returning 403 Forbidden when a user tries to edit an unowned document) to ensure better engineering quality.

### 4. How I verified correctness, UX quality, and implementation reliability
- **Manual User Testing**: I relied heavily on manual testing in the browser. The "mocked auth switcher" in the navbar was designed specifically so I could quickly toggle between Alice and Bob to verify that authorization boundary conditions (like hidden share buttons and 403 errors) worked perfectly.
- **TypeScript & Prisma**: I used strict TypeScript configurations and generated Prisma client types to verify implementation reliability at compile time, reducing the risk of runtime errors when accessing nested relational data.
