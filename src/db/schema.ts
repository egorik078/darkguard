import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

// Sublinks jadvali - subscription linklar
export const sublinks = pgTable("sublinks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  format: text("format").notNull(), // 'base64' yoki 'raw'
  isActive: boolean("is_active").notNull().default(true),
  totalServers: integer("total_servers").notNull().default(0),
  
  // Server turlari soni
  vlessCount: integer("vless_count").notNull().default(0),
  vmessCount: integer("vmess_count").notNull().default(0),
  shadowsocksCount: integer("shadowsocks_count").notNull().default(0),
  trojanCount: integer("trojan_count").notNull().default(0),
  hysteria2Count: integer("hysteria2_count").notNull().default(0),
  otherCount: integer("other_count").notNull().default(0),
  
  lastFetchedAt: timestamp("last_fetched_at"),
  lastFetchStatus: text("last_fetch_status"), // 'success', 'error'
  lastFetchError: text("last_fetch_error"),
  
  // Raw data - barcha serverlar ro'yxati
  serversData: jsonb("servers_data"), // array of server objects
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Users jadvali - foydalanuvchilar
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  note: text("note"),
  
  // Foydalanuvchiga tayinlangan sublinklar konfiguratsiyasi
  // Format: [{ sublinkId: 1, serverLimit: 10 }, ...]
  sublinkConfigs: jsonb("sublink_configs").notNull(),
  
  // Vaqt cheklovi
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Statistika jadvali - sublinklarga bog'lanish statistikasi
export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  sublinkId: integer("sublink_id").notNull().references(() => sublinks.id, { onDelete: 'cascade' }),
  
  // Statistika ma'lumotlari
  fetchCount: integer("fetch_count").notNull().default(0),
  successCount: integer("success_count").notNull().default(0),
  errorCount: integer("error_count").notNull().default(0),
  
  date: timestamp("date").notNull().defaultNow(),
});

// Access logs - foydalanuvchilar tomonidan generatsiya qilingan sublinklar
export const accessLogs = pgTable("access_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'set null' }),
  sublinkId: integer("sublink_id").references(() => sublinks.id, { onDelete: 'set null' }),
  
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
