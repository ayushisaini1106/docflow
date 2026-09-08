import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: Missing userId' }, { status: 401 });
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { shares: { some: { userId } } },
        ],
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, ownerId } = body;

    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newDoc = await prisma.document.create({
      data: {
        title: title || 'Untitled Document',
        content: content || '',
        ownerId,
      },
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
