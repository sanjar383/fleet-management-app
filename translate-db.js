const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const typeTranslations = {
  "Легковые автомобили": "Yengil avtomobil",
  "Самосвал": "Samosval",
  "Специальный и специализированный автомобиль, специальное оборудовани": "Maxsus texnika",
  "Автобусы": "Avtobus",
  "Механизм": "Mexanizm",
  "Бортовые автомобили": "Yuk avtomobili (Bortli)",
};

const fuelTranslations = {
  "Бензин": "Benzin",
  "Дизель": "Dizel",
  "Пропан": "Propan",
  "Метан": "Metan",
  "Газ": "Gaz",
};

async function translateDB() {
  const vehicles = await prisma.vehicle.findMany();
  let updatedCount = 0;

  for (const v of vehicles) {
    let newType = typeTranslations[v.type] || v.type;
    let newFuel = fuelTranslations[v.fuelType] || v.fuelType;

    if (newType !== v.type || newFuel !== v.fuelType) {
      await prisma.vehicle.update({
        where: { id: v.id },
        data: { type: newType, fuelType: newFuel },
      });
      updatedCount++;
    }
  }

  console.log(`Baza tarjima qilindi! Jami ${updatedCount} ta mashina yangilandi.`);
}

translateDB()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
