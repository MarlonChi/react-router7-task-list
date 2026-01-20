import { faker } from "@faker-js/faker";
import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./database/database.sqlite",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.task.deleteMany();

  // Finally, create 20 tasks
  for (let i = 0; i < 20; i++) {
    await prisma.task.create({
      data: {
        title: faker.lorem.sentence({ min: 3, max: 6 }),
        description: faker.lorem.paragraph({ min: 2, max: 4 }),
        steps: JSON.stringify([
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence(),
        ]),
        estimated_time: `${faker.number.int({ min: 1, max: 8 })}h`,
        implementation_suggestion: faker.lorem.paragraphs(2),
        acceptance_criteria: JSON.stringify([
          faker.lorem.sentence(),
          faker.lorem.sentence(),
        ]),
        suggested_tests: JSON.stringify([
          `Test: ${faker.lorem.sentence()}`,
          `Test: ${faker.lorem.sentence()}`,
        ]),
        content: faker.lorem.paragraphs(3),
        chat_history: JSON.stringify([
          { role: "user", content: faker.lorem.sentence() },
          { role: "assistant", content: faker.lorem.paragraph() },
          { role: "user", content: faker.lorem.sentence() },
        ]),
      },
    });
  }

  console.log("Seed completed! Created:");
  console.log("- 20 tasks");
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
