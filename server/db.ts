import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Color queries
export async function getUserColors(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { savedColors } = await import("../drizzle/schema");
  const result = await db.select().from(savedColors).where(eq(savedColors.userId, userId));
  return result.map(c => ({
    id: c.id,
    htmlColor: c.htmlColor,
    name: c.name ?? undefined,
  }));
}

export async function createColor(userId: number, htmlColor: string, name?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { savedColors } = await import("../drizzle/schema");
  const result = await db.insert(savedColors).values({
    userId,
    htmlColor,
    name,
  });
  return result;
}

export async function deleteColor(colorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { savedColors } = await import("../drizzle/schema");
  await db.delete(savedColors).where(eq(savedColors.id, colorId));
}

// Palette queries
export async function getUserPalettes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { colorPalettes } = await import("../drizzle/schema");
  const result = await db.select().from(colorPalettes).where(eq(colorPalettes.userId, userId));
  return result;
}

export async function createPalette(userId: number, name: string, colors: string[], description?: string, isPublic?: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { colorPalettes } = await import("../drizzle/schema");
  const result = await db.insert(colorPalettes).values({
    userId,
    name,
    colors: JSON.stringify(colors),
    description,
    isPublic: isPublic ?? false,
  });
  return result;
}

export async function deletePalette(paletteId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { colorPalettes } = await import("../drizzle/schema");
  await db.delete(colorPalettes).where(eq(colorPalettes.id, paletteId));
}


// Artist tags queries
export async function getAllArtistTags() {
  const db = await getDb();
  if (!db) return [];
  
  const { artistTags } = await import("../drizzle/schema");
  const result = await db.select().from(artistTags);
  return result;
}

export async function createArtistTag(name: string, description?: string, icon?: string, color?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { artistTags } = await import("../drizzle/schema");
  const result = await db.insert(artistTags).values({
    name,
    description,
    icon,
    color,
  });
  return result;
}

export async function deleteArtistTag(tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { artistTags, userTags } = await import("../drizzle/schema");
  // Delete all user associations first
  await db.delete(userTags).where(eq(userTags.tag, String(tagId)));
  // Then delete the tag
  await db.delete(artistTags).where(eq(artistTags.id, tagId));
}

// User tags queries
export async function getUserTags(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { userTags } = await import("../drizzle/schema");
  const result = await db.select().from(userTags).where(eq(userTags.userId, userId));
  return result;
}

export async function assignTagToUser(userId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { userTags } = await import("../drizzle/schema");
  const result = await db.insert(userTags).values({
    userId,
    tag: String(tagId),
  });
  return result;
}

export async function removeTagFromUser(userId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { userTags } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  await db.delete(userTags).where(and(eq(userTags.userId, userId), eq(userTags.tag, String(tagId))));
}

export async function getUsersByTag(tagId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { userTags, users: usersTable } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(usersTable)
    .innerJoin(userTags, eq(usersTable.id, userTags.userId))
    .where(eq(userTags.tag, String(tagId)));
  
  return result.map(r => r.users);
}

export async function getChatMessages() {
  const db = await getDb();
  if (!db) return [];
  
  const { chatMessages } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(chatMessages)
    .orderBy(desc(chatMessages.createdAt));
  
  return result.slice(-50).reverse();
}

export async function createChatMessage(userId: number, userName: string, content: string, sharedColor?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { chatMessages } = await import("../drizzle/schema");
  const result = await db.insert(chatMessages).values({
    userId,
    userName,
    message: content,
    colorShared: sharedColor || null,
    createdAt: new Date(),
  });
  
  return result;
}
