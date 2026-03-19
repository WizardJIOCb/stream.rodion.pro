import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

async function seed() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Seeding database...');

  // 1. Site settings (upsert singleton row)
  const existing = await db.select().from(schema.siteSettings).limit(1);
  if (existing.length === 0) {
    await db.insert(schema.siteSettings).values({
      siteTitle: 'WizardJIOCb — Stream Command Center',
      siteSubtitle: 'Интерактивные стримы, хаос в чате, честные обзоры',
      currentStatusMode: 'OFFLINE',
      statusSource: 'manual',
      manualOverrideActive: true,
      currentHookTitle: 'Mass Effect начат. Чат может сделать из Шепарда героя… или идиота.',
      currentHookDescription: 'Сегодня в Mass Effect: моральные выборы, тупые риски и зрительский саботаж.',
      currentGameSlug: 'mass-effect-legendary',
      currentFormatSlug: 'chat-breaks-game',
      primaryCtaText: 'Смотреть на Kick',
      secondaryCtaText: 'Открыть чат',
      currentAnnouncement: 'Следующий стрим: сегодня, если горит!',
    });
    console.log('  ✓ site_settings');
  } else {
    console.log('  - site_settings already exists, skipping');
  }

  // 2. Games
  await db
    .insert(schema.games)
    .values({
      slug: 'mass-effect-legendary',
      title: 'Mass Effect Legendary Edition',
      shortDescription: 'Интерактивное прохождение трилогии с управлением чата',
      longDescription:
        'Здесь не просто прохождение. Зрители влияют на решения, челленджи и темп стрима. Если хочешь не просто смотреть, а вмешиваться — заходи в чат Kick и копи Channel Points.',
      heroCopy: 'Mass Effect Legendary — чат решает, как выживает Шепард',
      rewardExamples: [
        { title: 'Выбери ответ Шепарда', description: 'Зритель выбирает тон следующего важного диалога', cost: 500 },
        { title: 'Без медигеля 10 минут', description: 'Временное ограничение — без лечения', cost: 700 },
        { title: 'Иду в рискованную зону сейчас', description: 'Зритель заставляет идти в опасность немедленно', cost: 1000 },
        { title: 'Сменить оружие / спек на бой', description: 'Временный саботаж экипировки', cost: 800 },
        { title: 'Парагон или Ренегат — решает чат', description: 'Зритель толкает в сторону roleplay направления', cost: 600 },
        { title: 'Разбери механику как разработчик', description: 'Родион останавливается и разбирает дизайн-решение', cost: 300 },
        { title: 'Горячий тейк по персонажу', description: 'Brutal honest обзор персонажа прямо сейчас', cost: 200 },
        { title: 'Чат выбирает следующего напарника', description: 'Контроль состава отряда', cost: 500 },
        { title: 'Один бой без укрытий', description: 'Высокорисковый челлендж — бой в открытую', cost: 1200 },
        { title: 'Скажи, что я сделал тупо', description: 'Зритель получает явный момент разбора', cost: 100 },
      ],
      predictionExamples: [
        'Пройду следующий бой с первой попытки?',
        'Сдохну до конца миссии?',
        'Чат заставит меня выбрать плохой ответ?',
        'Найду нормальный лут до конца часа?',
        'Этот напарник переживёт миссию?',
        'Саботажный билд сработает или нет?',
        'Пойду по Парагону или Ренегату в этой сцене?',
        'Босс сломает меня за 3 попытки?',
      ],
      isActive: true,
    })
    .onConflictDoUpdate({
      target: schema.games.slug,
      set: {
        title: 'Mass Effect Legendary Edition',
        updatedAt: new Date(),
      },
    });
  console.log('  ✓ games (mass-effect-legendary)');

  // 3. Formats
  const formatData = [
    {
      slug: 'chat-breaks-game',
      title: 'Чат ломает мне Mass Effect',
      description: 'Зрители через награды и голосования саботируют прохождение. Каждое решение — в руках чата.',
      participationRules: 'Копи Channel Points на Kick, активируй награды, голосуй в предсказаниях. Чем больше хаоса — тем веселее.',
      sortOrder: 0,
    },
    {
      slug: 'audience-controlled-shepard',
      title: 'Шепард под управлением аудитории',
      description: 'Все ключевые решения — за зрителями. Парагон, Ренегат, напарники, тактика — чат решает всё.',
      participationRules: 'Следи за голосованиями в чате. Когда появляется предсказание — делай ставку. Когда награда — активируй.',
      sortOrder: 1,
    },
    {
      slug: 'dev-eyes',
      title: 'Mass Effect глазами разработчика',
      description: 'Родион разбирает дизайн-решения, баги, UX и механики как профессиональный разработчик.',
      participationRules: 'Задавай вопросы в чате. Используй награду "Разбери механику" чтобы остановить игру для анализа.',
      sortOrder: 2,
    },
    {
      slug: 'one-evening-experiment',
      title: 'Один вечер — один эксперимент',
      description: 'Каждый стрим — уникальный формат. Без медигеля, только пистолет, speedrun-участок, или полный хаос.',
      participationRules: 'Формат объявляется в начале стрима. Используй награды чтобы усилить или изменить условия эксперимента.',
      sortOrder: 3,
    },
  ];

  for (const f of formatData) {
    await db
      .insert(schema.formats)
      .values(f)
      .onConflictDoUpdate({
        target: schema.formats.slug,
        set: { title: f.title, description: f.description, participationRules: f.participationRules, sortOrder: f.sortOrder },
      });
  }
  console.log('  ✓ formats (4)');

  // 4. Rewards
  const rewardData = [
    { title: 'Выбери ответ Шепарда', description: 'Зритель выбирает тон следующего важного диалога', cost: 500, isUserInputRequired: true, noteForSite: 'Работает в диалоговых сценах', sortOrder: 0 },
    { title: 'Без медигеля 10 минут', description: 'Временное ограничение — без лечения', cost: 700, isUserInputRequired: false, noteForSite: 'Очень токсичная награда', sortOrder: 1 },
    { title: 'Иду в рискованную зону', description: 'Зритель заставляет идти в опасность немедленно', cost: 1000, isUserInputRequired: false, noteForSite: null, sortOrder: 2 },
    { title: 'Сменить оружие на бой', description: 'Временный саботаж экипировки', cost: 800, isUserInputRequired: true, noteForSite: 'Зритель указывает оружие', sortOrder: 3 },
    { title: 'Парагон / Ренегат — решает чат', description: 'Зритель толкает roleplay направление', cost: 600, isUserInputRequired: false, noteForSite: null, sortOrder: 4 },
    { title: 'Разбери механику', description: 'Родион останавливается и разбирает дизайн-решение', cost: 300, isUserInputRequired: true, noteForSite: 'Хорошо работает в Mass Effect', sortOrder: 5 },
    { title: 'Горячий тейк по персонажу', description: 'Brutal honest обзор персонажа прямо сейчас', cost: 200, isUserInputRequired: true, noteForSite: null, sortOrder: 6 },
    { title: 'Выбери напарника', description: 'Контроль состава отряда', cost: 500, isUserInputRequired: true, noteForSite: null, sortOrder: 7 },
    { title: 'Бой без укрытий', description: 'Высокорисковый челлендж — бой в открытую', cost: 1200, isUserInputRequired: false, noteForSite: 'Самая сложная награда', sortOrder: 8 },
    { title: 'Скажи, что я сделал тупо', description: 'Зритель получает явный момент разбора', cost: 100, isUserInputRequired: false, noteForSite: null, sortOrder: 9 },
  ];

  for (const r of rewardData) {
    const existingReward = await db
      .select()
      .from(schema.rewardCache)
      .where(eq(schema.rewardCache.title, r.title))
      .limit(1);
    if (existingReward.length === 0) {
      await db.insert(schema.rewardCache).values(r);
    }
  }
  console.log('  ✓ rewards (10)');

  // 5. Sample feed events
  const existingEvents = await db.select().from(schema.siteFeedEvents).limit(1);
  if (existingEvents.length === 0) {
    await db.insert(schema.siteFeedEvents).values([
      { sourceType: 'status', title: 'Родион вышел в эфир', body: { game: 'Mass Effect Legendary Edition' }, isPublic: true, isPinned: false },
      { sourceType: 'reward', title: 'Награда активирована: Выбери ответ Шепарда', body: { user: 'ShadowMancer', reward: 'Выбери ответ Шепарда' }, isPublic: true, isPinned: false },
      { sourceType: 'follow', title: 'Новый фолловер: NeoX', body: {}, isPublic: true, isPinned: false },
      { sourceType: 'reward', title: 'Награда: Без медигеля 10 минут', body: { user: 'ChaosLord', reward: 'Без медигеля 10 минут' }, isPublic: true, isPinned: false },
      { sourceType: 'chat', title: 'Чат в огне: "Ренегат! Ренегат!"', body: { excerpt: 'Ренегат! Ренегат!' }, isPublic: true, isPinned: false },
    ]);
    console.log('  ✓ feed events (5)');
  } else {
    console.log('  - feed events already exist, skipping');
  }

  console.log('Seed complete!');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
