import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@skillup.local";
  const adminUsername = "admin";
  const adminPassword = "rhakdto$12#";

  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [{ email: adminEmail }, { username: adminUsername }],
    },
  });

  if (existingAdmin) {
    console.log("Admin user already exists. Skipping creation.");
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      username: adminUsername,
      passwordHash,
      provider: "email",
      role: "admin",
      mustChangePassword: true, // 첫 로그인 시 비밀번호 변경 필요
    },
  });

  console.log("Admin user created successfully:");
  console.log(`  Email: ${admin.email}`);
  console.log(`  Username: ${admin.username}`);
  console.log(`  Role: ${admin.role}`);
  console.log(`  Password: ${adminPassword}`);
  console.log("\n⚠️  Please change the password after first login!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
