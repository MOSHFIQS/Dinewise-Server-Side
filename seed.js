const { PrismaClient } = require("./generated/prisma");
const crypto = require("crypto");
const bcrypt = require("bcrypt"); 

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database explicitly from custom Generated folder...");

  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const chef = await prisma.user.upsert({
    where: { email: "chef@example.com" },
    update: {},
    create: {
      id: crypto.randomUUID(),
      name: "Gordon Ramsay",
      email: "chef@example.com",
      password: hashedPassword,
      role: "CHEF",
      status: "ACTIVE",
    },
  });

  const categoryBurgers = await prisma.category.upsert({
    where: { name: "Burgers" },
    update: {},
    create: { name: "Burgers", description: "Juicy, flame-grilled burgers" },
  });

  const items = [
    {
      name: "Royal Burger",
      slug: "royal-burger",
      description: "A huge beef patty.",
      price: 15.99,
      stock: 50,
      images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"],
      categoryId: categoryBurgers.id,
      chefId: chef.id,
      sku: "B-ROYAL"
    }
  ];

  for (const item of items) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }

  await prisma.coupon.upsert({
       where: { code: "FREESHIP" },
       update: {},
       create: {
            code: "FREESHIP",
            discountType: "FIXED",
            discountValue: 5.0,
            validUntil: new Date("2030-01-01"),
            isActive: true
       }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
