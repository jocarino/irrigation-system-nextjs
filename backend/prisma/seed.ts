import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const joao = await prisma.user.upsert({
    update: {},
    where: { id: 1 },
    create: { name: "João", email: "test.joao@gmail.com" },
  });
  const damola = await prisma.user.upsert({
    update: {},
    where: { id: 2 },
    create: { name: "Damola", email: "test.damola@gmail.com" },
  });

  const monstera = await prisma.plant.upsert({
    update: {},
    where: { id: 1 },
    create: { name: "Monstera", userId: 1 },
  });
  const monsteraHumidity = await prisma.plantHumidity.upsert({
    update: {},
    where: { id: 1 },
    create: {
      plantId: 1,
      dateTime: new Date("01-01-2024-00:00:00"),
      humidityLevel: 2000,
    },
  });
  const monsteraHumidity2 = await prisma.plantHumidity.upsert({
    update: {},
    where: { id: 2 },
    create: {
      plantId: 1,
      dateTime: new Date("01-01-2024-01:00:00"),
      humidityLevel: 1800,
    },
  });
  const monsteraHumidity3 = await prisma.plantHumidity.upsert({
    update: {},
    where: { id: 3 },
    create: {
      plantId: 1,
      dateTime: new Date("01-01-2024-02:00:00"),
      humidityLevel: 1200,
    },
  });
  const peaceLilyHumidity = await prisma.plantHumidity.upsert({
    update: {},
    where: { id: 1 },
    create: {
      plantId: 2,
      dateTime: new Date("01-01-2024-00:00:00"),
      humidityLevel: 1200,
    },
  });
  const peaceLilyHumidity2 = await prisma.plantHumidity.upsert({
    update: {},
    where: { id: 2 },
    create: {
      plantId: 2,
      dateTime: new Date("01-01-2024-01:00:00"),
      humidityLevel: 2000,
    },
  });
  const peaceLilyHumidity3 = await prisma.plantHumidity.upsert({
    update: {},
    where: { id: 3 },
    create: {
      plantId: 2,
      dateTime: new Date("01-01-2024-02:00:00"),
      humidityLevel: 1800,
    },
  });
  const peaceLily = await prisma.plant.upsert({
    update: {},
    where: { id: 2 },
    create: { name: "Peace Lily", userId: 2 },
  });

  console.log({
    joao,
    damola,
    monstera,
    peaceLily,
    monsteraHumidity,
    monsteraHumidity2,
    monsteraHumidity3,
    peaceLilyHumidity,
    peaceLilyHumidity2,
    peaceLilyHumidity3,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
