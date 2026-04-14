import { prisma } from "../../lib/prisma";

const createCategory = async (payload: { name: string; description?: string; image?: string }) => {
     return prisma.category.create({
          data: payload,
     });
};

const getAllCategories = async () => {
     return prisma.category.findMany({
          orderBy: { name: "asc" },
     });
};

const getCategoryById = async (id: string) => {
     const category = await prisma.category.findUnique({
          where: { id },
     });
     if (!category) throw new Error("Category not found");
     return category;
};

const updateCategory = async (id: string, payload: Partial<{ name: string; description: string; image: string }>) => {
     return prisma.category.update({
          where: { id },
          data: payload,
     });
};

const deleteCategory = async (id: string) => {
     const hasItems = await prisma.menuItem.findFirst({
          where: { categoryId: id },
     });
     if (hasItems) throw new Error("Cannot delete category with associated menu items");

     return prisma.category.delete({
          where: { id },
     });
};

export const categoryService = {
     createCategory,
     getAllCategories,
     getCategoryById,
     updateCategory,
     deleteCategory,
};
