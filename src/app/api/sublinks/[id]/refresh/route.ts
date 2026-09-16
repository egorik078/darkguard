import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sublinks, statistics } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { fetchAndParseSublink, countServerTypes } from '@/lib/sublink-parser';

// POST - Sublinkni refresh qilish (yangi ma'lumotlarni fetch qilish)
export async function POST(
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
    
    // Yangi ma'lumotlarni fetch qilamiz
    const { format, servers, error } = await fetchAndParseSublink(sublink.url);
    const counts = countServerTypes(servers);
    
    // Statistikaga yozamiz
    await db.insert(statistics).values({
      sublinkId: parseInt(id),
      fetchCount: 1,
      successCount: error ? 0 : 1,
      errorCount: error ? 1 : 0,
      date: new Date(),
    });
    
    // Sublinkni yangilaymiz
    const [updated] = await db
      .update(sublinks)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(sublinks.id, parseInt(id)))
      .returning();
    
    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Sublink refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh sublink' },
      { status: 500 }
    );
  }
}
