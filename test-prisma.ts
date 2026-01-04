import { prisma } from './lib/db';

async function testPrismaConnection() {
    try {
        console.log('Testing Prisma connection...');

        // Test 1: Check database connection
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Test 2: Query existing users
        const users = await prisma.user.findMany();
        console.log(`✅ Found ${users.length} existing users`);

        // Test 3: Try creating a user
        const testUser = await prisma.user.create({
            data: {
                email: `test_${Date.now()}@example.com`,
                username: `testuser${Date.now()}`,
                passwordHash: '$2a$12$test',
                provider: 'email',
            },
        });
        console.log('✅ User created:', testUser.email);

        // Cleanup
        await prisma.user.delete({ where: { id: testUser.id } });
        console.log('✅ Test user deleted');

        await prisma.$disconnect();
        console.log('✅ All tests passed!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testPrismaConnection();
