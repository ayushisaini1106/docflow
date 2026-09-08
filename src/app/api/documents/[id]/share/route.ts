import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { ownerId, shareWithUserId } = body;

    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.ownerId !== ownerId) {
      return NextResponse.json({ error: 'Only the owner can share this document' }, { status: 403 });
    }

    if (ownerId === shareWithUserId) {
      return NextResponse.json({ error: 'Cannot share with yourself' }, { status: 400 });
    }

    const share = await prisma.documentShare.upsert({
      where: {
        documentId_userId: {
          documentId: id,
          userId: shareWithUserId,
        },
      },
      update: {},
      create: {
        documentId: id,
        userId: shareWithUserId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(share);
  } catch (error) {
    console.error('Error sharing document:', error);
    return NextResponse.json({ error: 'Failed to share document' }, { status: 500 });
  }
}
