import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = connectionString ? new Pool({
  connectionString,
  max: 10,
}) : undefined;

const adapter = pool ? new PrismaPg(pool) : undefined;

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "myadmin@skillup.local";
  const username = "myadmin";
  const password = "admin1234";

  // Check if user already exists
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existing) {
    // Update to admin
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: "admin",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
    console.log("User updated to admin:", updated.username);
  } else {
    // Create new admin
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        provider: "email",
        role: "admin",
        mustChangePassword: false,
      },
    });
    console.log("Admin user created:", user.username);
  }

  console.log("\nCredentials:");
  console.log(`  Username: ${username}`);
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (pool) await pool.end();
  });
