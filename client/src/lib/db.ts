
/// Prevents creating a new PrismaClient every time the file is imported, especially in development.

/// Caches the PrismaClient on globalThis so it's reused across reloads or hot module replacements (HMR).

/// This avoids the "too many clients" error in PostgreSQL.


/// db.ts or prisma.ts

import { PrismaClient } from '@shared/generated/client';

// 👇 This defines a custom global type so TypeScript understands
// that we are putting our PrismaClient on the global object
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 👇 Reuse the existing PrismaClient if it exists on globalThis,
// otherwise create a new one.
export const prisma = globalForPrisma.prisma ?? new PrismaClient({})

// 👇 In development, save the PrismaClient instance to globalThis
// so it persists across hot reloads.
// In production, we skip this to avoid accidental global leaks.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}