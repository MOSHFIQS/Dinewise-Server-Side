import { prisma } from "../../lib/prisma";

const getMyNotifications = async (userId: string) => {
     return prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
     });
};

const markAsRead = async (id: string, userId: string) => {
     return prisma.notification.update({
          where: { id, userId },
          data: { isRead: true },
     });
};

export const notificationService = { getMyNotifications, markAsRead };
