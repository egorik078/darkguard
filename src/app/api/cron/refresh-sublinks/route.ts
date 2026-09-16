import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sublinks, statistics } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { fetchAndParseSublink, countServerTypes } from '@/lib/sublink-parser';

// GET - Barcha aktiv sublinklar uchun refresh
// Cron job orqali har 30-40 daqiqada chaqiriladi
export async function GET(request: NextRequest) {
  try {
    // Secret key tekshirish
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Barcha aktiv sublinklar
    const activeSublinks = await db
      .select()
      .from(sublinks)
      .where(eq(sublinks.isActive, true));
    
    const results = [];
    
    for (const sublink of activeSublinks) {
      try {
        const { format, servers, error } = await fetchAndParseSublink(sublink.url);
        const counts = countServerTypes(servers);
        
        // Statistikaga yozamiz
        await db.insert(statistics).values({
          sublinkId: sublink.id,
          fetchCount: 1,
          successCount: error ? 0 : 1,
          errorCount: error ? 1 : 0,
          date: new Date(),
        });
        
        // Sublinkni yangilaymiz
        await db
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
          .where(eq(sublinks.id, sublink.id));
        
        results.push({
          id: sublink.id,
          name: sublink.name,
          success: !error,
          serversCount: servers.length,
          error: error || null,
        });
      } catch (err) {
        results.push({
          id: sublink.id,
          name: sublink.name,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      processedCount: activeSublinks.length,
      results,
    });
  } catch (error) {
    console.error('Cron refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh sublinks' },
      { status: 500 }
    );
  }
}
