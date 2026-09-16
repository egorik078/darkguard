import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sublinks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { fetchAndParseSublink, countServerTypes } from '@/lib/sublink-parser';

// GET - Barcha sublinklar ro'yxati
export async function GET() {
  try {
    const allSublinks = await db.select().from(sublinks).orderBy(sublinks.createdAt);
    
    return NextResponse.json({
      success: true,
      data: allSublinks,
    });
  } catch (error) {
    console.error('Sublinks GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sublinks' },
      { status: 500 }
    );
  }
}

// POST - Yangi sublink qo'shish
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url } = body;
    
    if (!name || !url) {
      return NextResponse.json(
        { success: false, error: 'Name and URL are required' },
        { status: 400 }
      );
    }
    
    // URL validatsiya
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    // Sublinkni fetch qilib, parse qilamiz
    const { format, servers, error } = await fetchAndParseSublink(url);
    
    const counts = countServerTypes(servers);
    
    // Ma'lumotlar bazasiga qo'shamiz
    const [newSublink] = await db.insert(sublinks).values({
      name,
      url,
      format,
      isActive: true,
      totalServers: servers.length,
      vlessCount: counts.vless,
      vmessCount: counts.vmess,
      shadowsocksCount: counts.shadowsocks,
      trojanCount: counts.trojan,
      hysteria2Count: counts.hysteria2,
      otherCount: counts.other,
      lastFetchedAt: new Date(),
      lastFetchStatus: error ? 'error' : 'success',
      lastFetchError: error || null,
      serversData: servers,
      updatedAt: new Date(),
    }).returning();
    
    return NextResponse.json({
      success: true,
      data: newSublink,
    });
  } catch (error) {
    console.error('Sublink POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sublink' },
      { status: 500 }
    );
  }
}

// DELETE - Sublinkni o'chirish
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
    
    await db.delete(sublinks).where(eq(sublinks.id, parseInt(id)));
    
    return NextResponse.json({
      success: true,
      message: 'Sublink deleted',
    });
  } catch (error) {
    console.error('Sublink DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete sublink' },
      { status: 500 }
    );
  }
}
