// prisma/hashPasswords.ts
import bcrypt from "bcryptjs";
import prisma from "../src/db"; // adjust path to your Prisma client

async function hashPasswords() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, passwordHash: true },
    });

    for (const user of users) {
      // Skip if already hashed (optional safety)
      if (user.passwordHash.startsWith("$2a$") || user.passwordHash.startsWith("$2b$")) continue;

      const hashed = await bcrypt.hash(user.passwordHash, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashed },
      });
      console.log(`Hashed password for user ${user.id}`);
    }

    console.log("All plain-text passwords have been hashed.");
  } catch (err) {
    console.error("Error hashing passwords:", err);
  } finally {
    await prisma.$disconnect();
  }
}

hashPasswords();
