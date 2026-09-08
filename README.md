# DocFlow

DocFlow is a small, full-stack document editing application that allows users to create, edit, upload, and share rich-text documents.

## Features
- **Document Creation and Editing**: Rich text editor built with TipTap (supports Bold, Italic, Underline, Headings, Lists).
- **File Upload**: Upload `.txt` and `.md` files to automatically create new documents.
- **Sharing**: Mocked authentication allows you to act as "Alice" or "Bob" and share documents between users.
- **Persistence**: Built with Prisma and SQLite, ensuring all changes and shares are persisted locally.

## Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, TipTap, Lucide Icons
- Backend: Next.js API Routes
- Database: Prisma with SQLite

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
   *Note: This creates a local `dev.db` file and seeds two default users (Alice and Bob).*

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Test the Flow
1. Load the app. The header shows a dropdown where you can switch between acting as "Alice" or "Bob".
2. Click "New Document" to create a doc or "Upload" to select a `.txt` or `.md` file from your computer.
3. Edit the document and click "Save".
4. To share, click "Share" while viewing your document, and select the other user.
5. Switch to the other user via the header dropdown, and verify the shared document appears in their "Shared with Me" dashboard section.
