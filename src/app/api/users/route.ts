import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Auto-seed for Vercel Serverless ephemeral SQLite
    if (users.length === 0) {
      await prisma.user.createMany({
        data: [
          { name: 'Alice', email: 'alice@example.com' },
          { name: 'Bob', email: 'bob@example.com' },
        ],
      });
      users = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
      });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
