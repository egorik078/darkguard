import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Bitta userni olish
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)));
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('User GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT - Userni yangilash
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, note, sublinkConfigs, expiresAt, isActive } = body;
    
    const [existing] = await db.select().from(users).where(eq(users.id, parseInt(id)));
    
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (name) updateData.name = name;
    if (note !== undefined) updateData.note = note;
    if (sublinkConfigs) updateData.sublinkConfigs = sublinkConfigs;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    
    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(id)))
      .returning();
    
    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('User PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
