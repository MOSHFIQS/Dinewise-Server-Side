import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getMyNotifications = async (userId: string, query: IQueryParams) => {
     const notificationQuery = new QueryBuilder(prisma.notification, query)
          .search()
          .filter()
          .sort()
          .paginate();

     return notificationQuery.where({ userId }).execute();
};

const markAsRead = async (id: string, userId: string) => {
     return prisma.notification.update({
          where: { id, userId },
          data: { isRead: true },
     });
};

export const notificationService = { getMyNotifications, markAsRead };
