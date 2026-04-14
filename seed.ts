import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database explicitly without bcrypt compilation layer...");

  // Mock pre-hashed 'password123'
  const hashedPassword = "$2b$10$EpI8vB4XqXy/GvjZ2Q9X.Oo.YpU8R7g6o3m1b0nLKzjK2Q9v5KxqG"; 
  
  const chef = await prisma.user.upsert({
    where: { email: "chef@example.com" },
    update: {},
    create: {
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

  const categoryDesserts = await prisma.category.upsert({
    where: { name: "Desserts" },
    update: {},
    create: { name: "Desserts", description: "Sweet treats" },
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
    },
    {
      name: "New York Cheesecake",
      slug: "ny-cheesecake",
      description: "Rich and creamy classic baked cheesecake.",
      price: 8.99,
      stock: 15,
      images: ["https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80"],
      categoryId: categoryDesserts.id,
      chefId: chef.id,
      sku: "D-CHEESE"
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

  console.log("Database seeded successfully with Categories, Users, and MenuItems!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
