import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createReview = async (userId: string, menuItemId: string, payload: { rating: number; title?: string; comment: string }) => {
     // Check if user has already reviewed this item
     const existing = await prisma.review.findFirst({
          where: { userId, menuItemId },
     });
     if (existing) throw new Error("You have already reviewed this item");

     // Check if user has a delivered order for this item
     const hasOrdered = await prisma.orderItem.findFirst({
          where: {
               menuItemId,
               order: { customerId: userId, status: "DELIVERED" },
          },
     });

     if (!hasOrdered) throw new Error("You can only review items that have been delivered to you.");

     return prisma.review.create({
          data: {
               ...payload,
               userId,
               menuItemId,
               isVerifiedPurchase: true,
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

const getMyReviews = async (userId: string, query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.review, query, {
          searchableFields: ["comment", "title"],
          filterableFields: ["rating", "isVerifiedPurchase"],
     });
     return qb
          .where({ userId })
          .include({ menuItem: { select: { id: true, name: true, images: true } } })
          .sort()
          .paginate()
          .execute();
};

const getAllReviews = async (query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.review, query, {
          searchableFields: ["comment", "title"],
          filterableFields: ["rating", "isVerifiedPurchase", "userId", "menuItemId"],
     });
     return qb
          .include({
               user: { select: { id: true, name: true, image: true } },
               menuItem: { select: { id: true, name: true, images: true } },
          })
          .sort()
          .paginate()
          .execute();
};

const getChefReviews = async (chefId: string, query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.review, query, {
          searchableFields: ["comment", "title"],
          filterableFields: ["rating", "isVerifiedPurchase"],
     });
     return qb
          .where({ menuItem: { chefId } })
          .include({
               user: { select: { id: true, name: true, image: true } },
               menuItem: { select: { id: true, name: true, images: true } },
          })
          .sort()
          .paginate()
          .execute();
};

const canReview = async (userId: string, menuItemId: string) => {
     const hasOrdered = await prisma.orderItem.findFirst({
          where: {
               menuItemId,
               order: { customerId: userId, status: "DELIVERED" },
          },
     });

     const existing = await prisma.review.findFirst({
          where: { userId, menuItemId },
     });

     return {
          canReview: !!hasOrdered && !existing,
          reason: !hasOrdered 
               ? "You haven't ordered this item yet or it hasn't been delivered." 
               : existing 
                    ? "You have already reviewed this item." 
                    : null
     };
};

const updateReview = async (id: string, userId: string, payload: { rating?: number; title?: string; comment?: string }) => {
     const review = await prisma.review.findUnique({ where: { id } });
     if (!review) throw new Error("Review not found");
     if (review.userId !== userId) throw new Error("Unauthorized to edit this review");

     return prisma.review.update({
          where: { id },
          data: payload,
     });
};

const deleteReview = async (id: string, userId: string, role: string) => {
     const review = await prisma.review.findUnique({ where: { id } });
     if (!review) throw new Error("Review not found");
     
     if (review.userId !== userId && role !== "ADMIN") {
          throw new Error("Unauthorized to delete this review");
     }

     return prisma.review.delete({ where: { id } });
};

export const reviewService = {
     createReview,
     getReviewsForMenu,
     getMenuItemReviews: getReviewsForMenu,
     getMyReviews,
     getAllReviews,
     getChefReviews,
     canReview,
     updateReview,
     deleteReview,
};
