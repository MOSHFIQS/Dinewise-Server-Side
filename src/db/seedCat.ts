import { prisma } from "../lib/prisma";

const categories = [
  { name: "Haleem", description: "A rich and savory slow-cooked dish made with meat, lentils, and spices.", image: null },
  { name: "Omelette", description: "A simple and nutritious egg-based dish cooked with vegetables or cheese.", image: null },
  { name: "Fries", description: "Crispy deep-fried potato strips served as a popular snack or side.", image: null },
  { name: "Noodles", description: "Soft noodles cooked with vegetables, sauces, and sometimes meat.", image: null },
  { name: "Pizza", description: "A baked dish with crust, cheese, sauce, and various toppings.", image: null },
  { name: "Biryani", description: "A fragrant rice dish cooked with spices and meat or vegetables.", image: null },
  { name: "Burger", description: "A sandwich with a grilled patty, vegetables, and sauces inside a bun.", image: null },
  { name: "Ice Cream", description: "A frozen dessert made from milk and sugar in various flavors.", image: null },
  { name: "Kebab", description: "Grilled or roasted meat skewers seasoned with spices.", image: null },
  { name: "Pancake", description: "Soft and fluffy flat cakes served with syrup or fruits.", image: null },
  { name: "Rice and Beans", description: "A simple and nutritious dish combining rice and beans.", image: null },
  { name: "Soup", description: "A warm liquid dish made from vegetables, meat, or lentils.", image: null }
];

async function main() {
  for (const category of categories) {
    await prisma.category.create({
      data: category
    });
  }
}

main()
  .then(() => console.log("Seeding done"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());