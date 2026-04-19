
import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { NotificationType } from "../../../generated/prisma/enums";

const getMyNotifications = async (userId: string, query: IQueryParams) => {
     const notificationQuery = new QueryBuilder(prisma.notification, query)
          .search()
          .filter()
          .sort()
          .paginate();

     return notificationQuery.where({ userId }).execute();
};

const markAllAsRead = async (userId: string) => {
     return prisma.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true },
     });
};

const getUnreadCount = async (userId: string) => {
     return prisma.notification.count({
          where: { userId, isRead: false },
     });
};

const createNotification = async (payload: {
     userId: string;
     type: NotificationType;
     title: string;
     message: string;
     meta?: object;
}) => {
     return prisma.notification.create({
          data: {
               userId: payload.userId,
               type: payload.type,
               title: payload.title,
               message: payload.message,
               meta: (payload.meta as any) ?? null,
          },
     });
};


const markAsRead = async (id: string, userId: string) => {
     return prisma.notification.update({ where: { id, userId } as any, data: { isRead: true } })
}

export const notificationService = {
     getMyNotifications,
     markAsRead,
     markAllAsRead,
     getUnreadCount,
     createNotification,
};
