import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { menuItemRouter } from "../modules/menuItem/menuItem.route";
import { categoryRouter } from "../modules/category/category.route";
import { orderRouter } from "../modules/order/order.route";
import { reviewRouter } from "../modules/review/review.route";
import { couponRouter } from "../modules/coupon/coupon.route";
import { addressRouter } from "../modules/address/address.route";
import { notificationRouter } from "../modules/notification/notification.route";
import { paymentRouter } from "../modules/payment/payment.route";
import { userRouter } from "../modules/user/user.route";
import { adminRouter } from "../modules/admin/admin.route";
import { FileRoutes } from "../modules/file/file.route";
import { auditRouter } from "../modules/audit/audit.route";

const router = Router();

const moduleRoutes = [
     { path: "/auth", route: authRouter },
     { path: "/user", route: userRouter },
     { path: "/menu-item", route: menuItemRouter },
     { path: "/category", route: categoryRouter },
     { path: "/order", route: orderRouter },
     { path: "/review", route: reviewRouter },
     { path: "/coupon", route: couponRouter },
     { path: "/address", route: addressRouter },
     { path: "/notification", route: notificationRouter },
     { path: "/payment", route: paymentRouter },
     { path: "/admin", route: adminRouter },
     { path: "/file", route: FileRoutes },
     { path: "/audit", route: auditRouter },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
