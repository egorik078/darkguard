import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sublinks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { fetchAndParseSublink, countServerTypes } from '@/lib/sublink-parser';

// GET - Bitta sublinkni olish
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [sublink] = await db.select().from(sublinks).where(eq(sublinks.id, parseInt(id)));
    
    if (!sublink) {
      return NextResponse.json(
        { success: false, error: 'Sublink not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: sublink,
    });
  } catch (error) {
    console.error('Sublink GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sublink' },
      { status: 500 }
    );
  }
}

// PUT - Sublinkni yangilash
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, url, isActive } = body;
    
    const [existing] = await db.select().from(sublinks).where(eq(sublinks.id, parseInt(id)));
    
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Sublink not found' },
        { status: 404 }
      );
    }
    
    // Agar URL o'zgargan bo'lsa, yangi ma'lumotlarni fetch qilamiz
    let updateData: any = {
      updatedAt: new Date(),
    };
    
    if (name) updateData.name = name;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    
    if (url && url !== existing.url) {
      const { format, servers, error } = await fetchAndParseSublink(url);
      const counts = countServerTypes(servers);
      
      updateData = {
        ...updateData,
        url,
        format,
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
      };
    }
    
    const [updated] = await db
      .update(sublinks)
      .set(updateData)
      .where(eq(sublinks.id, parseInt(id)))
      .returning();
    
    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Sublink PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update sublink' },
      { status: 500 }
    );
  }
}
