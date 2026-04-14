import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { OrderStatus } from "../../../generated/prisma/enums";

interface CreateMenuItemPayload {
     name: string;
     description: string;
     price: number;
     discountPrice?: number;
     stock: number;
     images?: string[];
     ingredients?: string;
     isVegetarian?: boolean;
     spicyLevel?: number;
     categoryId: string;
     sku?: string;
}

const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
     OrderStatus.PLACED,
     OrderStatus.CONFIRMED,
     OrderStatus.PROCESSING,
     OrderStatus.SHIPPED,
];

const createMenuItem = async (chefId: string, payload: CreateMenuItemPayload) => {
     const slug = payload.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
     return prisma.menuItem.create({
          data: { ...payload, chefId, slug },
     });
};

const updateMenuItem = async (id: string, chefId: string, payload: Partial<CreateMenuItemPayload>) => {
     const menuItem = await prisma.menuItem.findFirst({ where: { id, chefId } });
     if (!menuItem) throw new Error("Menu item not found or unauthorized");
     return prisma.menuItem.update({ where: { id }, data: payload });
};

const deleteMenuItem = async (id: string, chefId: string) => {
     const menuItem = await prisma.menuItem.findFirst({
          where: { id, chefId },
          select: { id: true, name: true, isActive: true, stock: true },
     });
     if (!menuItem) throw new Error("Menu item not found or unauthorized");
     if (!menuItem.isActive) throw new Error("Menu item is already inactive");

     const activeOrderItem = await prisma.orderItem.findFirst({
          where: {
               menuItemId: id,
               order: {
                    status: { in: ACTIVE_ORDER_STATUSES },
               },
          },
          select: {
               orderId: true,
               order: { select: { status: true } },
          },
     });

     if (activeOrderItem) {
          throw new Error(
               `Cannot delete "${menuItem.name}" — it is part of an active order ` +
               `(status: ${activeOrderItem.order.status}). ` +
               `Wait until all orders are delivered or cancelled.`
          );
     }

     return prisma.menuItem.update({
          where: { id },
          data: { isActive: false, stock: 0 },
     });
};

const getChefMenuItems = async (chefId: string, query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.menuItem, query, {
          searchableFields: ["name", "description", "ingredients"],
          filterableFields: ["categoryId", "price", "stock", "isVegetarian", "spicyLevel"],
     });

     return qb
          .where({ chefId })
          .include({ category: true })
          .sort()
          .paginate()
          .execute();
};

const getAllMenuItems = async (query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.menuItem, query, {
          searchableFields: ["name", "description", "ingredients"],
          filterableFields: ["categoryId", "isVegetarian", "spicyLevel"],
     });

     const result = await qb
          .search()
          .filter()
          .where({ isActive: true })
          .include({
               category: true,
               chef: { select: { id: true, name: true } },
          })
          .sort()
          .paginate()
          .execute();

     return result;
};

const getMenuItemById = async (id: string) => {
     const menuItem = await prisma.menuItem.findFirst({
          where: { id, isActive: true },
          include: {
               category: true,
               chef: { select: { id: true, name: true, phone: true } },
               reviews: {
                    include: { user: { select: { id: true, name: true, image: true } } },
                    orderBy: { createdAt: "desc" },
                    take: 10,
               },
          },
     });
     if (!menuItem) throw new Error("Menu item not found");
     return menuItem;
};

export const menuItemService = {
     createMenuItem,
     updateMenuItem,
     deleteMenuItem,
     getChefMenuItems,
     getAllMenuItems,
     getMenuItemById,
};
