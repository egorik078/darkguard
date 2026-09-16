import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { statistics, sublinks, accessLogs } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';

// GET - Statistikani olish
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview'; // 'overview', 'sublinks', 'access'
    
    if (type === 'overview') {
      // Umumiy statistika
      const [sublinksCount] = await db.select({ count: sql<number>`count(*)` }).from(sublinks);
      const [activeSublinksCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(sublinks)
        .where(eq(sublinks.isActive, true));
      
      // Umumiy serverlar soni
      const [totalServersResult] = await db
        .select({ 
          total: sql<number>`COALESCE(sum(total_servers), 0)`,
          vless: sql<number>`COALESCE(sum(vless_count), 0)`,
          vmess: sql<number>`COALESCE(sum(vmess_count), 0)`,
          shadowsocks: sql<number>`COALESCE(sum(shadowsocks_count), 0)`,
          trojan: sql<number>`COALESCE(sum(trojan_count), 0)`,
          hysteria2: sql<number>`COALESCE(sum(hysteria2_count), 0)`,
          other: sql<number>`COALESCE(sum(other_count), 0)`,
        })
        .from(sublinks)
        .where(eq(sublinks.isActive, true));
      
      // So'nggi 24 soatdagi access loglar
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const [accessCount24h] = await db
        .select({ count: sql<number>`count(*)` })
        .from(accessLogs)
        .where(sql`created_at >= ${oneDayAgo}`);
      
      return NextResponse.json({
        success: true,
        data: {
          sublinks: {
            total: Number(sublinksCount.count),
            active: Number(activeSublinksCount.count),
          },
          servers: {
            total: Number(totalServersResult.total),
            byType: {
              vless: Number(totalServersResult.vless),
              vmess: Number(totalServersResult.vmess),
              shadowsocks: Number(totalServersResult.shadowsocks),
              trojan: Number(totalServersResult.trojan),
              hysteria2: Number(totalServersResult.hysteria2),
              other: Number(totalServersResult.other),
            },
          },
          access: {
            last24h: Number(accessCount24h.count),
          },
        },
      });
    }
    
    if (type === 'sublinks') {
      // Har bir sublink uchun statistika
      const allSublinks = await db.select().from(sublinks).orderBy(sublinks.name);
      
      const sublinkStats = [];
      
      for (const sublink of allSublinks) {
        // Ushbu sublink uchun statistikalarni olish
        const stats = await db
          .select({
            totalFetches: sql<number>`COALESCE(sum(fetch_count), 0)`,
            successFetches: sql<number>`COALESCE(sum(success_count), 0)`,
            errorFetches: sql<number>`COALESCE(sum(error_count), 0)`,
          })
          .from(statistics)
          .where(eq(statistics.sublinkId, sublink.id));
        
        sublinkStats.push({
          id: sublink.id,
          name: sublink.name,
          url: sublink.url,
          isActive: sublink.isActive,
          totalServers: sublink.totalServers,
          serverTypes: {
            vless: sublink.vlessCount,
            vmess: sublink.vmessCount,
            shadowsocks: sublink.shadowsocksCount,
            trojan: sublink.trojanCount,
            hysteria2: sublink.hysteria2Count,
            other: sublink.otherCount,
          },
          lastFetchedAt: sublink.lastFetchedAt,
          lastFetchStatus: sublink.lastFetchStatus,
          statistics: stats[0] || { totalFetches: 0, successFetches: 0, errorFetches: 0 },
        });
      }
      
      return NextResponse.json({
        success: true,
        data: sublinkStats,
      });
    }
    
    if (type === 'access') {
      // Access loglar
      const limit = parseInt(searchParams.get('limit') || '100');
      
      const logs = await db
        .select()
        .from(accessLogs)
        .orderBy(desc(accessLogs.createdAt))
        .limit(limit);
      
      // Har bir user uchun access count
      const userAccessCounts = await db
        .select({
          userId: accessLogs.userId,
          count: sql<number>`count(*)`,
        })
        .from(accessLogs)
        .groupBy(accessLogs.userId);
      
      return NextResponse.json({
        success: true,
        data: {
          logs,
          userAccessCounts,
        },
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Statistics GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
