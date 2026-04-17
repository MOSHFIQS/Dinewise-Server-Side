import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { auditService } from "../audit/audit.service";

const createCoupon = async (payload: {
     code: string;
     discountType: string;
     discountValue: number;
     minOrderValue?: number;
     validFrom: Date;
     validUntil: Date;
     usageLimit?: number;
}) => {
     const coupon = await prisma.coupon.create({ data: payload });

     // Side effect
     auditService
          .log({
               action: "COUPON_CREATED",
               entityType: "COUPON",
               entityId: coupon.id,
               details: { code: coupon.code, discount: coupon.discountValue },
          })
          .catch((err) => console.error("Coupon create audit failed:", err));

     return coupon;
};

const getAllCoupons = async (query: IQueryParams) => {
     const couponQuery = new QueryBuilder(prisma.coupon, query).search().filter().sort().paginate();

     return couponQuery.execute();
};

const applyCoupon = async (code: string, cartTotal: number) => {
     const coupon = await prisma.coupon.findUnique({ where: { code } });
     if (!coupon) throw new Error("This coupon code does not exist.");

     if (!coupon.isActive) {
          throw new Error("This coupon is currently deactivated by the administrator.");
     }

     const now = new Date();
     if (now < new Date(coupon.validFrom)) {
          throw new Error(`This coupon will be active starting from ${new Date(coupon.validFrom).toLocaleDateString()}.`);
     }

     if (now > new Date(coupon.validUntil)) {
          throw new Error(`This coupon has expired on ${new Date(coupon.validUntil).toLocaleDateString()}.`);
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

     return { id: coupon.id, code: coupon.code, discountValue: discount };
};

const deleteCoupon = async (id: string) => {
     const coupon = await prisma.coupon.delete({ where: { id } });

     // Side effect
     auditService
          .log({
               action: "COUPON_DELETED",
               entityType: "COUPON",
               entityId: id,
               details: { code: coupon.code },
          })
          .catch((err) => console.error("Coupon delete audit failed:", err));

     return coupon;
};

export const couponService = { createCoupon, getAllCoupons, applyCoupon, deleteCoupon };
