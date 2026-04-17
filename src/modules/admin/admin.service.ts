import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { auditService } from "../audit/audit.service";
import { notificationService } from "../notification/notification.service";

const getAllUsers = async (query: IQueryParams) => {
     const qb = new QueryBuilder(prisma.user, query, {
          searchableFields: ["name", "email", "phone"],
          filterableFields: ["role", "status"],
     });
     return qb.search().filter().sort().paginate().execute();
};

const updateUserStatus = async (id: string, status: "ACTIVE" | "BANNED" | "SUSPENDED") => {
     const oldUser = await prisma.user.findUnique({ where: { id } });
     if (!oldUser) throw new Error("User not found");

     const updatedUser = await prisma.user.update({
          where: { id },
          data: { status },
     });

     // Side effects
     Promise.all([
          auditService.log({
               action: "USER_STATUS_UPDATED",
               entityType: "USER",
               entityId: id,
               details: { oldStatus: oldUser.status, newStatus: status },
          }),
          notificationService.createNotification({
               userId: id,
               type: "ACCOUNT_STATUS",
               title: "Account Status Updated",
               message: `Your account status has been updated to ${status.toLowerCase()}.`,
               meta: { status },
          }),
     ]).catch((err) => console.error("Admin status update side effects failed:", err));

     return updatedUser;
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
