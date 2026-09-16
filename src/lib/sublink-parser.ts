// Sublink parser - subscription linklar bilan ishlash

export interface ServerInfo {
  type: 'vless' | 'vmess' | 'shadowsocks' | 'trojan' | 'hysteria2' | 'other';
  raw: string;
  parsed?: any;
}

// Server turini aniqlash
export function detectServerType(line: string): ServerInfo['type'] {
  const lowercased = line.toLowerCase();
  
  if (lowercased.startsWith('vless://')) return 'vless';
  if (lowercased.startsWith('vmess://')) return 'vmess';
  if (lowercased.startsWith('ss://')) return 'shadowsocks';
  if (lowercased.startsWith('trojan://')) return 'trojan';
  if (lowercased.startsWith('hysteria2://') || lowercased.startsWith('hy2://')) return 'hysteria2';
  
  return 'other';
}

// Base64 dekodlash
export function decodeBase64(encoded: string): string {
  try {
    // Node.js da Buffer ishlatamiz
    return Buffer.from(encoded, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Base64 decode error:', error);
    return '';
  }
}

// Sublink content ni parse qilish
export function parseSublink(content: string): ServerInfo[] {
  const servers: ServerInfo[] = [];
  
  // Har bir qatorni ajratamiz
  const lines = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  for (const line of lines) {
    const type = detectServerType(line);
    
    // Faqat taniqli protokollarni qo'shamiz
    if (line.includes('://')) {
      servers.push({
        type,
        raw: line,
      });
    }
  }
  
  return servers;
}

// Sublinkdan ma'lumot olish va parse qilish
export async function fetchAndParseSublink(url: string): Promise<{
  format: 'base64' | 'raw';
  servers: ServerInfo[];
  error?: string;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SubConverter/1.0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    let content = await response.text();
    let format: 'base64' | 'raw' = 'raw';
    
    // Agar base64 bo'lsa, dekodlaymiz
    // Base64 ekanligini tekshirish: agar birinchi qator :// ni o'z ichiga olmasa, base64 deb hisoblaymiz
    const firstLine = content.split('\n')[0].trim();
    if (firstLine && !firstLine.includes('://')) {
      // Base64 bo'lishi mumkin
      try {
        const decoded = decodeBase64(content);
        if (decoded && decoded.includes('://')) {
          content = decoded;
          format = 'base64';
        }
      } catch (e) {
        // Base64 emas, raw sifatida qoldiramiz
      }
    }
    
    const servers = parseSublink(content);
    
    return {
      format,
      servers,
    };
  } catch (error) {
    return {
      format: 'raw',
      servers: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Server turlarini sanash
export function countServerTypes(servers: ServerInfo[]) {
  const counts = {
    vless: 0,
    vmess: 0,
    shadowsocks: 0,
    trojan: 0,
    hysteria2: 0,
    other: 0,
  };
  
  for (const server of servers) {
    counts[server.type]++;
  }
  
  return counts;
}

// Serverlarni cheklash (user uchun)
export function limitServers(servers: ServerInfo[], limit: number): ServerInfo[] {
  return servers.slice(0, limit);
}

// Ko'p sublinkdan serverlarni birlashtirish
export function mergeServers(serverArrays: ServerInfo[][]): ServerInfo[] {
  const merged: ServerInfo[] = [];
  const seen = new Set<string>();
  
  for (const servers of serverArrays) {
    for (const server of servers) {
      // Dublikatlarni olib tashlash
      if (!seen.has(server.raw)) {
        seen.add(server.raw);
        merged.push(server);
      }
    }
  }
  
  return merged;
}

// Serverlarni base64 formatda export qilish
export function exportAsBase64(servers: ServerInfo[]): string {
  const content = servers.map(s => s.raw).join('\n');
  return Buffer.from(content, 'utf-8').toString('base64');
}

// Serverlarni raw formatda export qilish
export function exportAsRaw(servers: ServerInfo[]): string {
  return servers.map(s => s.raw).join('\n');
}
