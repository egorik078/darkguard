import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, sublinks, accessLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ServerInfo, mergeServers, limitServers, exportAsBase64, exportAsRaw } from '@/lib/sublink-parser';

// GET - User uchun subscription link generatsiya qilish
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'base64'; // 'base64' yoki 'raw'
    
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)));
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // User aktiv emasligini tekshirish
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'User is inactive' },
        { status: 403 }
      );
    }
    
    // Muddati tugagan yoki yo'qligini tekshirish
    if (user.expiresAt && new Date(user.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'User subscription has expired' },
        { status: 403 }
      );
    }
    
    // User konfiguratsiyasi bo'yicha sublinklar
    const configs = user.sublinkConfigs as Array<{ sublinkId: number; serverLimit: number }>;
    
    if (!configs || configs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No sublink configurations found for user' },
        { status: 400 }
      );
    }
    
    // Har bir sublinkdan serverlarni olamiz
    const allServerArrays: ServerInfo[][] = [];
    
    for (const config of configs) {
      const [sublink] = await db
        .select()
        .from(sublinks)
        .where(eq(sublinks.id, config.sublinkId));
      
      if (sublink && sublink.isActive && sublink.serversData) {
        const servers = sublink.serversData as ServerInfo[];
        const limited = limitServers(servers, config.serverLimit);
        allServerArrays.push(limited);
      }
    }
    
    // Barcha serverlarni birlashtirish
    const mergedServers = mergeServers(allServerArrays);
    
    if (mergedServers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No servers available' },
        { status: 404 }
      );
    }
    
    // Access log yozish
    try {
      await db.insert(accessLogs).values({
        userId: parseInt(id),
        sublinkId: null,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
    } catch (logError) {
      console.error('Access log error:', logError);
      // Log xatosi asosiy jarayonni to'xtatmasin
    }
    
    // Format bo'yicha export qilish
    const content = format === 'base64' 
      ? exportAsBase64(mergedServers) 
      : exportAsRaw(mergedServers);
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${user.name}-subscription.txt"`,
        'Subscription-Userinfo': `upload=0; download=0; total=0; expire=${user.expiresAt ? new Date(user.expiresAt).getTime() / 1000 : 0}`,
      },
    });
  } catch (error) {
    console.error('User subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate subscription' },
      { status: 500 }
    );
  }
}
