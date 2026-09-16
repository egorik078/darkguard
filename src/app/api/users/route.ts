import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Barcha userlar ro'yxati
export async function GET() {
  try {
    const allUsers = await db.select().from(users).orderBy(users.createdAt);
    
    return NextResponse.json({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Yangi user yaratish
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, note, sublinkConfigs, expiresAt, isActive } = body;
    
    if (!name || !sublinkConfigs) {
      return NextResponse.json(
        { success: false, error: 'Name and sublinkConfigs are required' },
        { status: 400 }
      );
    }
    
    // sublinkConfigs validatsiya
    // Format: [{ sublinkId: 1, serverLimit: 10 }, ...]
    if (!Array.isArray(sublinkConfigs)) {
      return NextResponse.json(
        { success: false, error: 'sublinkConfigs must be an array' },
        { status: 400 }
      );
    }
    
    for (const config of sublinkConfigs) {
      if (!config.sublinkId || !config.serverLimit) {
        return NextResponse.json(
          { success: false, error: 'Each config must have sublinkId and serverLimit' },
          { status: 400 }
        );
      }
    }
    
    const [newUser] = await db.insert(users).values({
      name,
      note: note || null,
      sublinkConfigs,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: typeof isActive === 'boolean' ? isActive : true,
      updatedAt: new Date(),
    }).returning();
    
    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error('User POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// DELETE - Userni o'chirish
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }
    
    await db.delete(users).where(eq(users.id, parseInt(id)));
    
    return NextResponse.json({
      success: true,
      message: 'User deleted',
    });
  } catch (error) {
    console.error('User DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
