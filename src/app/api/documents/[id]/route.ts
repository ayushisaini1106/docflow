import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (userId && document.ownerId !== userId && !document.shares.some((s) => s.userId === userId)) {
      return NextResponse.json({ error: 'Unauthorized access to document' }, { status: 403 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { title, content, userId } = body;

    const document = await prisma.document.findUnique({
      where: { id },
      include: { shares: true },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.ownerId !== userId && !document.shares.some((s) => s.userId === userId)) {
      return NextResponse.json({ error: 'Unauthorized to edit document' }, { status: 403 });
    }

    const updatedDoc = await prisma.document.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
    });

    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.ownerId !== userId) {
      return NextResponse.json({ error: 'Only owner can delete the document' }, { status: 403 });
    }

    await prisma.document.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
