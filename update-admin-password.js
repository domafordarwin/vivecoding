import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function updateAdminPassword() {
    try {
        console.log('Updating admin password...');

        // Find admin user by email or username
        const admin = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: 'admin@skillup.local' },
                    { username: 'admin' }
                ]
            }
        });

        if (!admin) {
            console.error('❌ Admin user not found');
            process.exit(1);
        }

        console.log(`Found admin user: ${admin.email} (${admin.username})`);

        // Update password
        const newPasswordHash = '$2b$12$1N4LdAmViAiyPV0sg/KjquU49UY/vhRVaCrGjLF1uQPAUWYyQ3zdq';

        await prisma.user.update({
            where: { id: admin.id },
            data: { passwordHash: newPasswordHash }
        });

        console.log('✅ Admin password updated successfully!');
        console.log('New password: rhakdto$12#');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdminPassword();
