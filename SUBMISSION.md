# Submission File

This repository contains the complete DocFlow application as requested.

## Deliverables Included

1. **Source Code**: Full Next.js project with Tailwind CSS, Prisma, and TipTap implementation.
2. **README.md**: Located at the root. Contains local setup and run instructions.
3. **ARCHITECTURE.md**: Located at the root. Explains technical priorities, constraints, and scope cut decisions.
4. **AI_WORKFLOW.md**: Located at the root. Reflects on the AI usage process.
5. **Database**: A pre-configured `prisma/schema.prisma` mapping to a local `dev.db` SQLite file for zero-friction setup.

## Current State of Features

### What is working:
- **Document Creation and Editing**: TipTap editor successfully renders and saves bold, italic, underline, heading, and list formatting. Auto-resizing works seamlessly.
- **File Upload**: Users can successfully click "Upload", select a `.txt` or `.md` file, and its contents are instantly converted into a new, saved editable document.
- **Sharing**: Document owners can click "Share" to grant another user access. Shared documents correctly appear in the "Shared with Me" section of the recipient's dashboard.
- **Persistence**: All edits and sharing permissions are persisted flawlessly to the SQLite database.
- **Mocked Auth**: The user switcher in the navbar perfectly simulates swapping between Alice and Bob to demonstrate authorization flows.

### What is incomplete / Deprioritized:
- **Enterprise Access Control**: Sharing currently grants blanket "Edit" access. Read-only permissions were deprioritized.
- **Real-Time Collaboration**: The TipTap editor is currently single-player. Real-time CRDT integration via Yjs was skipped to keep the scope tightly constrained and focus on core persistence.

### What I would build next with another 2-4 hours:
1. Implement **Read-Only / Edit Permissions** when sharing a document, and adjust the UI to disable the editor if a user only has Read access.
2. Build an **Export to PDF** button utilizing a lightweight library to allow users to download their documents.
3. Implement actual authentication (e.g., NextAuth with Google provider) and remove the mocked user switcher.
