                  const prisma = require('../src/app/util/prisma').default || require('../src/app/util/prisma');

async function test() {
  try {
    console.log('Running a quick users findMany test...');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Users result (length):', users.length);
  } catch (err) {
    console.error('Test caught error:', err.message);
    process.exitCode = 1;
  } finally {
    try { await prisma.$disconnect(); } catch (e) {}
  }
}

test();
