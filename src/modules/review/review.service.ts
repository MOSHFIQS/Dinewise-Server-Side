import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createReview = async (userId: string, menuItemId: string, payload: { rating: number; title?: string; comment: string }) => {
     const hasOrdered = await prisma.orderItem.findFirst({
          where: {
               menuItemId,
               order: { customerId: userId, status: "DELIVERED" },
          },
     });

     return prisma.review.create({
          data: {
               ...payload,
               userId,
               menuItemId,
               isVerifiedPurchase: !!hasOrdered,
          },
     });
};

const getReviewsForMenu = async (menuItemId: string, query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.review, query, {
          filterableFields: ["rating", "isVerifiedPurchase"],
     });
     return qb
          .where({ menuItemId })
          .include({ user: { select: { id: true, name: true, image: true } } })
          .sort()
          .paginate()
          .execute();
};

const deleteReview = async (id: string, userId: string, role: string) => {
     const review = await prisma.review.findUnique({ where: { id } });
     if (!review) throw new Error("Review not found");
     if (review.userId !== userId && role !== "ADMIN") throw new Error("Unauthorized");

     return prisma.review.delete({ where: { id } });
};

export const reviewService = { createReview, getReviewsForMenu, deleteReview };
