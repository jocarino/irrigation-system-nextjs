import { PrismaClient } from "@prisma/client";
var crypto = require("crypto");

const prisma = new PrismaClient();
function hashPassword(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      (err: any, hashedPassword: Buffer) => {
        if (err) reject(err);
        else resolve(hashedPassword);
      }
    );
  });
}

async function createUser(name: string, email: string, password: string) {
  const salt = crypto.randomBytes(16);
  const hashedPassword = await hashPassword(password, salt);
  return prisma.user.create({
    data: {
      name,
      email,
      hashedPassword: hashedPassword.toString("base64"),
      salt: salt.toString("base64"),
    },
  });
}
async function main() {
  // Create users
  const joao = await createUser("João", "test.joao@gmail.com", "test123");
  const damola = await createUser("Damola", "test.damola@gmail.com", "test123");

  const monstera = await prisma.plant.create({
    data: { name: "Monstera", userId: joao.id },
  });
  const peaceLily = await prisma.plant.create({
    data: { name: "Peace Lily", userId: damola.id },
  });
  const monsteraHumidity = await prisma.plantHumidity.create({
    data: {
      plantId: monstera.id,
      dateTime: new Date("01-01-2024-00:00:00"),
      humidityLevel: 2000,
    },
  });
  const monsteraHumidity2 = await prisma.plantHumidity.create({
    data: {
      plantId: monstera.id,
      dateTime: new Date("01-01-2024-01:00:00"),
      humidityLevel: 1800,
    },
  });
  const monsteraHumidity3 = await prisma.plantHumidity.create({
    data: {
      plantId: monstera.id,
      dateTime: new Date("01-01-2024-02:00:00"),
      humidityLevel: 1200,
    },
  });
  const peaceLilyHumidity = await prisma.plantHumidity.create({
    data: {
      plantId: peaceLily.id,
      dateTime: new Date("01-01-2024-00:00:00"),
      humidityLevel: 1200,
    },
  });
  const peaceLilyHumidity2 = await prisma.plantHumidity.create({
    data: {
      plantId: peaceLily.id,
      dateTime: new Date("01-01-2024-01:00:00"),
      humidityLevel: 2000,
    },
  });
  const peaceLilyHumidity3 = await prisma.plantHumidity.create({
    data: {
      plantId: peaceLily.id,
      dateTime: new Date("01-01-2024-02:00:00"),
      humidityLevel: 1800,
    },
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
