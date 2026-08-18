const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Create default admin
  const passwordHash = await bcrypt.hash('powboxing', 10);
  
  await prisma.admin.upsert({
    where: { username: 'abdullah123' },
    update: { passwordHash },
    create: {
      username: 'abdullah123',
      passwordHash,
    },
  });

  // Clear existing coaches to re-seed cleanly
  await prisma.coach.deleteMany({});

  // 2. Add Coaches
  const coaches = [
    {
      nameEn: "Coach Odai Al-Hindawi",
      nameAr: "الكابتن عدي الهنداوي",
      roleEn: "Jordan National Boxing Team Coach & Asian Games Medalist",
      roleAr: "مدرب المنتخب الوطني الأردني للملاكمة",
      specialtiesAr: [
        "استراتيجيات النزالات الأولمبية",
        "الملاكمة التكتيكية المتقدمة",
        "معسكرات الإعداد والنزالات",
        "تطوير مستوى المحترفين",
      ],
      image: "/images/coaches/odai.png",
      instagramUrl: "https://www.instagram.com/odaialhindawi/",
      badgeAr: "الكابتن الأولمبي",
      whatsappMessageAr: "مرحباً نادي جاب لاب، أود حجز حصة تدريب ملاكمة خاصة مع الكابتن الأولمبي عدي الهنداوي.",
    },
    {
      nameEn: "Coach Mohammad Al-Talawi",
      nameAr: "الكابتن محمد التلاوي",
      roleEn: "Jordan National Boxing Team Athlete & Performance Specialist",
      roleAr: "لاعب المنتخب الوطني للملاكمة",
      specialtiesAr: [
        "تدريب الميتس السريع",
        "حركة القدمين وتغيير الزوايا",
        "الدفاع واللكمات المرتدة",
        "اللياقة والجاهزية الانفجارية",
      ],
      image: "/images/coaches/mohammad.png",
      instagramUrl: "https://www.instagram.com/mohammad_ali_534?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      badgeAr: "لاعب المنتخب الوطني",
      whatsappMessageAr: "مرحباً نادي جاب لاب، أود حجز حصة تدريب وتطوير مهارات مع الكابتن محمد التلاوي.",
    },
    {
      nameEn: "Coach Abdullah Al-Boureini",
      nameAr: "الكابتن عبدالله البوريني",
      roleEn: "Former Jordan National Team Athlete & Multi-Year Kingdom Champion",
      roleAr: "لاعب المنتخب الوطني سابقاً وبطل المملكة لعدة سنوات",
      specialtiesAr: [
        "أساسيات وميكانيكا الملاكمة",
        "قوة اللكم والسلسلة الحركية",
        "التكتيك والدفاع الذكي",
        "القوة الوظيفية للملاكمين",
      ],
      image: "/images/coaches/abdullah.png",
      instagramUrl: "https://www.instagram.com/aboodalboreny?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      badgeAr: "المدرب الدولي",
      whatsappMessageAr: "مرحباً نادي جاب لاب، أود حجز حصة تدريب مع المدرب الدولي عبدالله البوريني.",
    },
    {
      nameEn: "Coach Diaa Al-Harthi",
      nameAr: "الكابتن ضياء الحارثي",
      roleEn: "Physical Conditioning Specialist & Multi-Year Kingdom Champion",
      roleAr: "مختص الإعداد البدني وبطل المملكة لعدة سنوات",
      specialtiesAr: [
        "الإعداد البدني عالي الشدة",
        "تنظيم الوزن وحرق الدهون",
        "تأهيل أبطال المستقبل والناشئين",
        "الرشاقة وقوة الجذع",
      ],
      image: "/images/coaches/diaa.png",
      instagramUrl: "", // Provided but without instagram yet
      badgeAr: "مختص الإعداد البدني",
      whatsappMessageAr: "مرحباً نادي جاب لاب، أود حجز حصة إعداد بدني وملاكمة مع الكابتن ضياء الحارثي.",
    },
  ];

  for (const [index, coach] of coaches.entries()) {
    await prisma.coach.create({
      data: {
        nameAr: coach.nameAr,
        nameEn: coach.nameEn,
        roleAr: coach.roleAr,
        roleEn: coach.roleEn,
        image: coach.image,
        badgeAr: coach.badgeAr,
        specialtiesAr: JSON.stringify(coach.specialtiesAr),
        instagramUrl: coach.instagramUrl || '',
        whatsappMessageAr: coach.whatsappMessageAr || '',
        order: index,
      }
    });
  }

  console.log('Seed successful');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
