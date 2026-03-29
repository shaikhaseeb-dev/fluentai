import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@fluentai.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@fluentai.com',
      plan: 'PRO',
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create sample sessions
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const session = await prisma.practiceSession.create({
      data: {
        userId: user.id,
        startedAt: date,
        endedAt: new Date(date.getTime() + (5 + i) * 60 * 1000),
        duration: (5 + i) * 60,
        sentenceCount: 10 + i * 2,
        grammarCorrections: Math.max(0, 5 - i),
        fillerCount: Math.max(0, 8 - i),
        confidenceScore: 5 + i * 0.4,
        strengths: [
          'Clear pronunciation and good pacing',
          'Strong vocabulary usage',
          'Good sentence structure',
        ],
        improvements: [
          'Try to reduce filler words',
          'Practice past tense consistency',
        ],
        recommendedFocus: 'Focus on tense consistency in storytelling',
        summaryGenerated: true,
      },
    });
    console.log(`✅ Created session ${i + 1}`);
  }

  // Create sample improvement memory
  const words = ['opportunity', 'consequently', 'furthermore', 'perspective', 'elaborate'];
  for (const word of words) {
    await prisma.improvementMemory.upsert({
      where: { userId_word: { userId: user.id, word } },
      update: {},
      create: { userId: user.id, word, context: 'Example context' },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
