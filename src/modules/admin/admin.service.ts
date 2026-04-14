import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllUsers = async (query: IQueryParams) => {
     const qb = new QueryBuilder(prisma.user, query, {
          searchableFields: ["name", "email", "phone"],
          filterableFields: ["role", "status"],
     });
     return qb.search().filter().sort().paginate().execute();
};

const updateUserStatus = async (id: string, status: "ACTIVE" | "BANNED" | "SUSPENDED") => {
     return prisma.user.update({
          where: { id },
          data: { status },
     });
};

const getDashboardStats = async () => {
     const [totalUsers, totalOrders, totalMenuItems, revenueModel] = await Promise.all([
          prisma.user.count(),
          prisma.order.count(),
          prisma.menuItem.count(),
          prisma.payment.aggregate({
               _sum: { amount: true },
               where: { status: "SUCCESS" },
          }),
     ]);

     return {
          totalUsers,
          totalOrders,
          totalMenuItems,
          totalRevenue: revenueModel._sum.amount || 0,
     };
};

export const adminService = { getAllUsers, updateUserStatus, getDashboardStats };
