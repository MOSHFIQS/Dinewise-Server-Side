import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createCoupon = async (payload: { code: string; discountType: string; discountValue: number; minOrderValue?: number; validFrom: Date; validUntil: Date; usageLimit?: number }) => {
     return prisma.coupon.create({ data: payload });
};

const getAllCoupons = async (query: IQueryParams) => {
     const couponQuery = new QueryBuilder(prisma.coupon, query)
          .search()
          .filter()
          .sort()
          .paginate();

     return couponQuery.execute();
};

const applyCoupon = async (code: string, cartTotal: number) => {
     const coupon = await prisma.coupon.findUnique({ where: { code } });
     if (!coupon) throw new Error("Coupon not found");
     if (!coupon.isActive || new Date() < new Date(coupon.validFrom) || new Date() > new Date(coupon.validUntil)) {
          throw new Error("Coupon is invalid or expired");
     }
     if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          throw new Error("Coupon usage limit reached");
     }
     if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
          throw new Error(`Minimum order value is $${coupon.minOrderValue} to use this coupon`);
     }

     let discount = 0;
     if (coupon.discountType === "FIXED") {
          discount = coupon.discountValue;
     } else {
          discount = (cartTotal * coupon.discountValue) / 100;
     }

     return { couponId: coupon.id, discountAmount: discount };
};

const deleteCoupon = async (id: string) => {
     return prisma.coupon.delete({ where: { id } });
};

export const couponService = { createCoupon, getAllCoupons, applyCoupon, deleteCoupon };
